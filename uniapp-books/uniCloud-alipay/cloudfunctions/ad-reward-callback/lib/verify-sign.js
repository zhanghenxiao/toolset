'use strict';

const crypto = require('crypto');

/**
 * uniAdCallback → 业务云函数：sha256(secret:trans_id)
 */
function verifyUniAdSign({ secret, transId, sign }) {
  if (!secret || !transId || !sign) return false;
  const calcSign = crypto
    .createHash('sha256')
    .update(`${secret}:${transId}`)
    .digest('hex');
  return calcSign.toLowerCase() === String(sign).toLowerCase();
}

/**
 * 传统服务器 HTTP 直连（老版 order_id + MD5 参数签名）
 */
function verifyLegacyHttpSign({ secret, query, sign }) {
  if (!secret || !sign || !query) return false;

  const params = {
    adpid: query.adpid,
    appid: query.appid,
    channel: query.channel,
    create_time: query.create_time,
    openid: query.openid,
    order_id: query.order_id,
    reward_name: query.reward_name,
    reward_num: query.reward_num,
    uid: query.uid,
  };

  if (query.extra !== undefined) {
    params.extra = query.extra;
  }

  const keys = Object.keys(params).sort();
  let str = '';
  for (const key of keys) {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      str += `${key}=${params[key]}`;
    }
  }
  str += secret;

  const calcSign = crypto.createHash('md5').update(str).digest('hex');
  return calcSign.toLowerCase() === String(sign).toLowerCase();
}

module.exports = {
  verifyUniAdSign,
  verifyLegacyHttpSign,
};
