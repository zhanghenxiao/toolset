'use strict';

const { AD_SECRETS, getDefaultSecret, COLLECTION } = require('./config');
const { verifyUniAdSign, verifyLegacyHttpSign } = require('./lib/verify-sign');
const { grantReward } = require('./lib/grant-reward');

const LOG_TAG = '[ad-reward-callback]';

function resolveSecret(adpid) {
  if (adpid && AD_SECRETS[adpid]) return AD_SECRETS[adpid];
  return getDefaultSecret();
}

function isHttpEvent(event) {
  return !!(event && event.queryStringParameters && Object.keys(event.queryStringParameters).length);
}

function isLegacyHttpPayload(query) {
  return !!(query && (query.order_id || query.sign));
}

function normalizePayload(event) {
  if (!event || typeof event !== 'object') return {};

  if (event.action === 'ping') {
    return { action: 'ping' };
  }

  if (isHttpEvent(event)) {
    return event.queryStringParameters || {};
  }

  if (event.data && typeof event.data === 'object') {
    return event.data;
  }

  if (event.args && typeof event.args === 'object') {
    return event.args;
  }

  if (event.params && typeof event.params === 'object') {
    return event.params;
  }

  return event;
}

function pickCallbackFields(payload) {
  const transId = payload.trans_id || payload.transId || payload.order_id || '';
  const userId = payload.user_id || payload.userId || payload.uid || '';
  const sign = payload.sign || '';
  const extra = payload.extra || '';
  const adpid = payload.adpid || '';
  const provider = payload.provider || '';
  const platform = payload.platform || '';
  const cpm = payload.cpm ?? null;

  return {
    transId,
    userId,
    sign,
    extra,
    adpid,
    provider,
    platform,
    cpm,
  };
}

async function findExistingRecord(db, where) {
  const res = await db.collection(COLLECTION).where(where).limit(1).get();
  return res.data && res.data.length > 0 ? res.data[0] : null;
}

async function saveRecord(db, record) {
  await db.collection(COLLECTION).add({
    ...record,
    created_at: Date.now(),
  });
}

/**
 * uniAdCallback 通过 callFunction 调用（业务在 uniCloud）
 * 返回 { isValid: true|false }
 */
async function handleUniAdCallback(payload, db) {
  const {
    transId,
    userId,
    sign,
    extra,
    adpid,
    provider,
    platform,
    cpm,
  } = pickCallbackFields(payload);

  console.log(LOG_TAG, 'callback', {
    adpid,
    transId,
    userId,
    provider,
    platform,
    hasSign: !!sign,
  });

  if (!transId || !sign) {
    console.error(LOG_TAG, 'missing trans_id or sign', payload);
    return { isValid: false, msg: 'missing trans_id or sign' };
  }

  const secret = resolveSecret(adpid);
  if (!secret) {
    console.error(LOG_TAG, 'secret not configured for adpid', adpid);
    return { isValid: false, msg: 'secret not configured' };
  }

  if (!verifyUniAdSign({ secret, transId, sign })) {
    console.error(LOG_TAG, 'invalid sign', { transId, adpid });
    return { isValid: false, msg: 'invalid sign' };
  }

  const existing = await findExistingRecord(db, { trans_id: transId });
  if (existing) {
    console.log(LOG_TAG, 'duplicate trans_id, skip', transId);
    return { isValid: true };
  }

  await grantReward(
    {
      trans_id: transId,
      user_id: userId,
      extra,
      adpid,
      provider,
      platform,
      cpm,
    },
    db,
  );

  try {
    await saveRecord(db, {
      trans_id: transId,
      user_id: userId,
      extra,
      adpid,
      provider,
      platform,
      cpm,
      source: 'uniAdCallback',
      raw_json: JSON.stringify(payload),
    });
    console.log(LOG_TAG, 'saved', transId);
  } catch (err) {
    console.error(LOG_TAG, 'save failed', err);
    return { isValid: false, msg: 'save failed', error: err.message || String(err) };
  }

  return { isValid: true };
}

/**
 * HTTP URL 化直连（业务在传统服务器 / 老版回调参数）
 */
async function handleLegacyHttpCallback(query, db) {
  const sign = query.sign;
  const orderId = query.order_id;
  const adpid = query.adpid;

  if (!sign || !orderId) {
    return { code: 400, msg: 'missing sign or order_id' };
  }

  const secret = resolveSecret(adpid);
  if (!secret) {
    return { code: 500, msg: 'secret not configured' };
  }

  if (!verifyLegacyHttpSign({ secret, query, sign })) {
    console.error(LOG_TAG, 'legacy sign invalid', { orderId, adpid });
    return { code: 401, msg: 'invalid sign' };
  }

  const existing = await findExistingRecord(db, { order_id: orderId });
  if (existing) {
    return { code: 0, msg: 'success' };
  }

  await grantReward(
    {
      trans_id: orderId,
      user_id: query.uid || '',
      extra: query.extra || '',
      adpid: adpid || '',
      provider: query.channel || '',
      platform: query.appid || '',
      cpm: null,
    },
    db,
  );

  try {
    await saveRecord(db, {
      trans_id: orderId,
      order_id: orderId,
      user_id: query.uid || '',
      extra: query.extra || '',
      adpid: adpid || '',
      provider: query.channel || '',
      platform: query.appid || '',
      source: 'legacy-http',
      raw_json: JSON.stringify(query),
    });
  } catch (err) {
    console.error(LOG_TAG, 'legacy save failed', err);
    return { code: 500, msg: 'save failed' };
  }

  return { code: 0, msg: 'success' };
}

exports.main = async (event) => {
  const db = uniCloud.database();

  try {
    console.log(LOG_TAG, 'invoked', {
      keys: event ? Object.keys(event) : [],
      isHttp: isHttpEvent(event),
    });

    if (event?.action === 'ping') {
      return { isValid: true, msg: 'pong' };
    }

    if (isHttpEvent(event) && isLegacyHttpPayload(event.queryStringParameters)) {
      return await handleLegacyHttpCallback(event.queryStringParameters, db);
    }

    const payload = normalizePayload(event);
    return await handleUniAdCallback(payload, db);
  } catch (err) {
    console.error(LOG_TAG, 'error', err);
    if (isHttpEvent(event) && isLegacyHttpPayload(event.queryStringParameters)) {
      return { code: 500, msg: 'server error' };
    }
    return { isValid: false, msg: 'server error', error: err.message || String(err) };
  }
};
