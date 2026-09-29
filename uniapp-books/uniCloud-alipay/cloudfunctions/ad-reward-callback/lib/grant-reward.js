'use strict';

function parseExtra(extra) {
  if (!extra) return {};
  if (typeof extra === 'object') return extra;
  try {
    return JSON.parse(extra);
  } catch (e) {
    return { raw: String(extra) };
  }
}

/**
 * 发放激励视频奖励的业务逻辑入口。
 *
 * @param {object} ctx
 * @param {string} ctx.trans_id  唯一交易 ID（幂等键）
 * @param {string} ctx.user_id   客户端 urlCallback.userId
 * @param {string} [ctx.extra]   客户端 urlCallback.extra（JSON，含 scene/bookId）
 * @param {string} [ctx.adpid]
 * @param {string} [ctx.provider]
 * @param {string} [ctx.platform]
 * @param {number|null} [ctx.cpm]
 * @param {object} db uniCloud.database()
 */
async function grantReward(ctx, db) {
  const parsed = parseExtra(ctx.extra);
  const scene = parsed.scene || 'unknown';

  console.log('[ad-reward-callback] grantReward', {
    trans_id: ctx.trans_id,
    user_id: ctx.user_id,
    scene,
    bookId: parsed.bookId || '',
    extra: ctx.extra,
    adpid: ctx.adpid,
  });

  if (scene === 'read_unlock') {
    console.log('[ad-reward-callback] read_unlock granted', {
      trans_id: ctx.trans_id,
      user_id: ctx.user_id,
      bookId: parsed.bookId || '',
    });

    try {
      await db.collection('user_read_unlock').add({
        user_id: ctx.user_id,
        book_id: String(parsed.bookId || ''),
        trans_id: ctx.trans_id,
        scene: 'read_unlock',
        adpid: ctx.adpid || '',
        created_at: Date.now(),
      });
    } catch (err) {
      // 集合未上传时不影响回调验签通过
      console.warn('[ad-reward-callback] user_read_unlock save skipped', err.message || err);
    }

    return { ok: true, scene: 'read_unlock' };
  }

  return { ok: true, scene };
}

module.exports = {
  grantReward,
};
