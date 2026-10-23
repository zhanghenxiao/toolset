// 微信广告工具：激励视频 + 插屏
const { INTERSTITIAL_UNIT_ID } = require('./ad-config');

const AD_UNIT_ID = 'adunit-eacc23cc95a5f01e';

/**
 * 显示一次激励视频广告。
 * - resolve：用户完整观看（isEnded === true）
 * - reject：跳过 / 加载失败 / 显示失败 / 当前基础库不支持
 *   err.message === '观看未完成' 表示用户主动关闭（可据此锁定后续章节）
 *   err.message 含 '不支持' 表示环境不支持（降级放行，不锁章）
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
    ad.onError((err) => {
      // 无填充 / 频控 / 配置错误：不是用户放弃，交由调用方重试
      const e = new Error('广告加载失败');
      e.code = (err && (err.errCode || err.errMsg)) || '';
      finish(false, e);
    });
    ad.onClose((res) => {
      if (res && res.isEnded) finish(true);
      else finish(false, new Error('观看未完成'));
    });
    ad.show().catch(() => {
      ad.load()
        .then(() => ad.show())
        .catch((err) => {
          const e = new Error('广告加载失败');
          e.code = (err && (err.errCode || err.errMsg)) || '';
          finish(false, e);
        });
    });
  });
}

/**
 * 显示一次插屏广告（弹窗，可随时关闭，无奖励）。
 * - resolve：广告已展示并关闭
 * - reject：未配置广告位 / 基础库不支持 / 无填充 / 加载失败
 */
function showInterstitialAd() {
  return new Promise((resolve, reject) => {
    if (!INTERSTITIAL_UNIT_ID) {
      reject(new Error('未配置插屏广告位'));
      return;
    }
    if (!wx.createInterstitialAd) {
      reject(new Error('当前微信版本不支持插屏广告'));
      return;
    }
    const ad = wx.createInterstitialAd({ adUnitId: INTERSTITIAL_UNIT_ID });
    let settled = false;
    const finish = (ok, reason) => {
      if (settled) return;
      settled = true;
      ok ? resolve() : reject(reason);
    };
    const fail = (err) => {
      const e = new Error('插屏广告加载失败');
      e.code = (err && (err.errCode || err.errMsg)) || '';
      finish(false, e);
    };
    ad.onLoad(() => {});
    ad.onError(fail);
    ad.onClose(() => finish(true));
    ad.show().catch(() => {
      ad.load()
        .then(() => ad.show())
        .catch(fail);
    });
  });
}

module.exports = { showRewardedAd, showInterstitialAd, AD_UNIT_ID };
