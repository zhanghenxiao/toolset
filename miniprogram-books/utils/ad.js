// 微信激励视频广告工具
const AD_UNIT_ID = 'adunit-eacc23cc95a5f01e';

/**
 * 显示一次激励视频广告。
 * - resolve：用户完整观看（isEnded === true）
 * - reject：跳过 / 加载失败 / 显示失败 / 当前基础库不支持
 *   err.message === '观看未完成' 表示用户主动关闭
 */
function showRewardedAd() {
  return new Promise((resolve, reject) => {
    if (!wx.createRewardedVideoAd) {
      reject(new Error('当前微信版本不支持激励视频广告'));
      return;
    }
    const ad = wx.createRewardedVideoAd({ adUnitId: AD_UNIT_ID });
    let settled = false;
    const finish = (ok, reason) => {
      if (settled) return;
      settled = true;
      ok ? resolve() : reject(reason || new Error('观看未完成'));
    };
    ad.onLoad(() => {});
    ad.onError((err) => finish(false, err));
    ad.onClose((res) => {
      if (res && res.isEnded) finish(true);
      else finish(false, new Error('观看未完成'));
    });
    ad.show().catch(() => {
      ad.load()
        .then(() => ad.show())
        .catch((err) => finish(false, err));
    });
  });
}

module.exports = { showRewardedAd, AD_UNIT_ID };