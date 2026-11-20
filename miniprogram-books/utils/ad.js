// 微信广告工具：激励视频 + 插屏
const { INTERSTITIAL_UNIT_ID } = require('./ad-config');

const AD_UNIT_ID = 'adunit-eacc23cc95a5f01e';

let rewardedAd = null;
function getRewardedAd() {
  if (!rewardedAd) {
    rewardedAd = wx.createRewardedVideoAd({ adUnitId: AD_UNIT_ID });
  }
  return rewardedAd;
}

/**
 * 显示一次激励视频广告。
 * - resolve：用户完整观看（isEnded === true）
 * - reject：跳过 / 加载失败 / 显示失败 / 当前基础库不支持
 *   err.message === '观看未完成' 只在广告**确实展示过**后被用户提前关闭时返回
 *   err.message === '广告加载失败' 表示无填充 / 频控 / 未展示就收到 close / 超时
 *   err.message 含 '不支持' 表示环境不支持（降级放行，不锁章）
 */
function showRewardedAd() {
  return new Promise((resolve, reject) => {
    if (!wx.createRewardedVideoAd) {
      reject(new Error('当前微信版本不支持激励视频广告'));
      return;
    }
    // 同一广告位返回的是同一个实例：反复 create 会不断叠加 onClose/onError 监听
    const ad = getRewardedAd();
    try {
      if (ad.offLoad) ad.offLoad();
      if (ad.offError) ad.offError();
      if (ad.offClose) ad.offClose();
    } catch (e) {
      // 忽略：老基础库可能没有 off* 方法
    }
    let settled = false;
    // 只有 show() 成功才算「广告真的展示了」，据此区分用户放弃与广告侧失败
    let displayed = false;
    let loadTimer = null;
    const clearLoadTimer = () => {
      if (loadTimer) {
        clearTimeout(loadTimer);
        loadTimer = null;
      }
    };
    const finish = (ok, reason) => {
      if (settled) return;
      settled = true;
      clearLoadTimer();
      ok ? resolve() : reject(reason || new Error('观看未完成'));
    };
    const shown = () => {
      displayed = true;
      clearLoadTimer();
    };
    const fail = (err) => {
      const e = new Error('广告加载失败');
      e.code = (err && (err.errCode || err.errMsg)) || '';
      finish(false, e);
    };
    // 加载/展示阶段兜底：广告始终没展示时不能让调用方永远停在 loading
    loadTimer = setTimeout(() => {
      if (!displayed) fail({ errMsg: 'show timeout' });
    }, 10000);

    ad.onLoad(() => {});
    ad.onError(fail);
    ad.onClose((res) => {
      if (!displayed) {
        // 广告没展示过就收到 close（无填充、或单例上一次广告的残留事件）
        // 不能判成「用户主动关闭」，否则会硬拦阅读且重试永远重复同一错误
        fail({ errMsg: 'close before show' });
        return;
      }
      if (res && res.isEnded) finish(true);
      else finish(false, new Error('观看未完成'));
    });
    try {
      ad.show().then(shown).catch((err) => {
        if (settled) return;
        try {
          ad.load()
            .then(() => ad.show())
            .then(shown)
            .catch(fail);
        } catch (e) {
          fail(e);
        }
      });
    } catch (e) {
      // 个别基础库 createRewardedVideoAd 存在但 show() 直接抛错
      fail(e);
    }
  });
}

// 插屏实例复用：同一广告位反复创建会堆积监听（搜索页每次进入都要弹）
let interstitialAd = null;

function getInterstitialAd() {
  if (!interstitialAd) {
    interstitialAd = wx.createInterstitialAd({ adUnitId: INTERSTITIAL_UNIT_ID });
  }
  return interstitialAd;
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
    const ad = getInterstitialAd();
    // 卸载上一轮监听，避免多次调用后重复触发
    try {
      if (ad.offLoad) ad.offLoad();
      if (ad.offError) ad.offError();
      if (ad.offClose) ad.offClose();
    } catch (e) {
      // 忽略
    }
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
