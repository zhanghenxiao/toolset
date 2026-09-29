import { reactive } from 'vue';
import {
  AD_REWARD_ENABLE_URL_CALLBACK,
  AD_REWARD_EXTRA_PREFIX,
  AD_REWARD_INTERVAL,
  AD_REWARD_PID,
} from './ad-config';
import { AD_TYPE, releaseAd, tryAcquireAd } from './ad-guard';

const LOG_TAG = '[rewarded-video-ad]';
const STORAGE_UID_KEY = 'reward_ad_uid';
const SHOW_TIMEOUT_MS = 120000;

export const rewardAdState = reactive({
  mounted: false,
  loaded: false,
  loading: false,
  showing: false,
});

export const rewardAdHostKey = reactive({ value: 0 });

const rewardUrlCallback = reactive({
  userId: '',
  extra: '',
});

let adComponent = null;
let pendingShow = false;
let pendingResultResolve = null;
let userOnClose = null;
let showTimer = null;
let scheduledRunTimer = null;
let scheduledDelayTimer = null;
let remountHostCallback = null;
let backButtonHandler = null;
let appHideDuringAd = false;
let lastRewardShowAt = 0;

export function canShowRewardAd(force = false) {
  if (force) return true;
  if (!lastRewardShowAt) return true;
  return Date.now() - lastRewardShowAt >= AD_REWARD_INTERVAL;
}

function markRewardAdShown() {
  lastRewardShowAt = Date.now();
}

function formatError(err) {
  if (!err) return 'unknown';
  const detail = err?.detail || err;
  const code = detail?.errCode ?? detail?.code ?? err?.code ?? err?.errCode;
  const msg = detail?.errMsg ?? detail?.message ?? err?.message ?? err?.errMsg ?? JSON.stringify(detail);
  return code != null ? `${code}: ${msg}` : msg;
}

function logAdError(source, err) {
  const msg = formatError(err);
  console.warn(`${LOG_TAG} ${source} ${msg}`, err);
  if (String(msg).includes('-5002')) {
    console.warn(`${LOG_TAG} -5002：自定义/云打包须用正式 adpid，测试位 1507000689 仅标准基座可用`);
  }
  if (String(msg).includes('-5004')) {
    console.warn(`${LOG_TAG} -5004：请确认自定义基座已勾选 UniAd 及 manifest 中的广告 SDK`);
  }
  if (String(msg).includes('-5005')) {
    console.warn(
      `${LOG_TAG} -5005：激励视频位 ${AD_REWARD_PID} 暂无填充。请在 uni-ad 控制台确认：类型为激励视频、已绑定全部渠道、自定义基座已重新制作`,
    );
  }
}

function clearShowTimer() {
  if (showTimer) {
    clearTimeout(showTimer);
    showTimer = null;
  }
}

function bindBackButtonHandler() {
  // #ifdef APP-PLUS
  if (backButtonHandler || typeof plus === 'undefined') return;
  backButtonHandler = (e) => {
    if (!rewardAdState.showing && !pendingResultResolve) return;
    e?.preventDefault?.();
    console.warn(`${LOG_TAG} hardware back while ad showing, force reset`);
    forceResetRewardedVideoAd('hardware_back');
    uni.showToast({ title: '已关闭广告', icon: 'none', duration: 1500 });
  };
  plus.key.addEventListener('backbutton', backButtonHandler);
  // #endif
}

function unbindBackButtonHandler() {
  // #ifdef APP-PLUS
  if (!backButtonHandler || typeof plus === 'undefined') return;
  plus.key.removeEventListener('backbutton', backButtonHandler);
  backButtonHandler = null;
  // #endif
}

function settlePending(result) {
  clearShowTimer();
  unbindBackButtonHandler();
  pendingShow = false;
  rewardAdState.showing = false;
  releaseAd(AD_TYPE.REWARD);

  const resolve = pendingResultResolve;
  const onClose = userOnClose;
  pendingResultResolve = null;
  userOnClose = null;

  if (onClose && result.shown) {
    onClose({ isEnded: result.isEnded });
  }
  resolve?.(result);
}

export function registerRewardAdRemount(fn) {
  remountHostCallback = fn;
}

/** 跳过/异常时 SDK 未触发 @close，强制释放状态并重建广告组件 */
function destroyAdComponent() {
  try {
    adComponent?.destroy?.();
  } catch (e) {
    // ignore
  }
  adComponent = null;
}

export function forceResetRewardedVideoAd(reason = 'manual') {
  console.warn(`${LOG_TAG} force reset: ${reason}`);

  const wasShowing = rewardAdState.showing || !!pendingResultResolve;
  if (wasShowing) {
    settlePending({ shown: true, isEnded: false });
  } else {
    clearShowTimer();
    unbindBackButtonHandler();
    releaseAd(AD_TYPE.REWARD);
  }

  rewardAdState.loaded = false;
  rewardAdState.loading = false;
  pendingShow = false;
  destroyAdComponent();

  if (remountHostCallback) {
    remountHostCallback();
  } else {
    rewardAdHostKey.value += 1;
  }
}

export function bindRewardAdAppLifecycle() {
  uni.onAppHide(() => {
    if (rewardAdState.showing || pendingResultResolve) {
      appHideDuringAd = true;
    }
  });

  uni.onAppShow(() => {
    if (!appHideDuringAd) return;
    appHideDuringAd = false;
    if (!rewardAdState.showing && !pendingResultResolve) return;
    // 跳过确认弹窗关闭后，SDK 有时不触发 @close，回到前台时强制重建
    setTimeout(() => {
      if (rewardAdState.showing || pendingResultResolve) {
        console.warn(`${LOG_TAG} app resume while ad still active, force reset`);
        forceResetRewardedVideoAd('app_resume');
      }
    }, 800);
  });
}

export function isRewardAdShowing() {
  return rewardAdState.showing || !!pendingResultResolve;
}

export function waitForRewardIdle(maxWait = 120000) {
  if (!isRewardAdShowing()) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const startedAt = Date.now();
    const timer = setInterval(() => {
      if (!isRewardAdShowing()) {
        clearInterval(timer);
        resolve(true);
        return;
      }
      if (Date.now() - startedAt >= maxWait) {
        clearInterval(timer);
        console.warn(`${LOG_TAG} waitForRewardIdle timeout`);
        resolve(false);
      }
    }, 200);
  });
}

export function cancelScheduledRewardShow() {
  if (scheduledDelayTimer) {
    clearTimeout(scheduledDelayTimer);
    scheduledDelayTimer = null;
  }
  if (scheduledRunTimer) {
    clearTimeout(scheduledRunTimer);
    scheduledRunTimer = null;
  }
}

export function getRewardAdUserId() {
  let uid = uni.getStorageSync(STORAGE_UID_KEY);
  if (uid) return String(uid);

  uid = `u_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  uni.setStorageSync(STORAGE_UID_KEY, uid);
  return uid;
}

export function buildRewardAdExtra(extra = {}) {
  const payload = {
    prefix: AD_REWARD_EXTRA_PREFIX,
    ...extra,
  };
  return JSON.stringify(payload);
}

export function getRewardUrlCallback() {
  if (!AD_REWARD_ENABLE_URL_CALLBACK) return undefined;
  if (!rewardUrlCallback.userId) {
    rewardUrlCallback.userId = getRewardAdUserId();
  }
  return {
    userId: rewardUrlCallback.userId,
    extra: rewardUrlCallback.extra,
  };
}

export function initRewardAdCallback(extra = { scene: 'app_launch' }) {
  rewardUrlCallback.userId = getRewardAdUserId();
  rewardUrlCallback.extra = buildRewardAdExtra(extra);
  console.log(`${LOG_TAG} urlCallback ready userId=${rewardUrlCallback.userId}`);
}

function applyRewardContext(options = {}) {
  rewardUrlCallback.userId = options.userId || getRewardAdUserId();
  rewardUrlCallback.extra = typeof options.extra === 'string'
    ? options.extra
    : buildRewardAdExtra(options.extra || {});
}

export function registerRewardedVideoComponent(comp) {
  adComponent = comp;
}

export function unregisterRewardedVideoComponent() {
  if (rewardAdState.showing || pendingResultResolve) {
    console.warn(`${LOG_TAG} skip unregister while showing`);
    return;
  }
  adComponent = null;
  rewardAdState.mounted = false;
  rewardAdState.loaded = false;
  rewardAdState.loading = false;
  pendingShow = false;
}

export function onRewardedVideoMounted() {
  rewardAdState.mounted = true;
  console.log(`${LOG_TAG} component ready adpid=${AD_REWARD_PID}`);
}

export function onRewardedVideoLoad() {
  rewardAdState.loading = false;
  rewardAdState.loaded = true;
  console.log(`${LOG_TAG} loaded`);
  if (pendingShow) {
    pendingShow = false;
    doShow();
  }
}

export function onRewardedVideoClose(e) {
  const detail = e?.detail || e || {};
  const isEnded = !!(detail.isEnded ?? detail.is_end);

  if (!rewardAdState.showing && !pendingResultResolve) {
    console.warn(`${LOG_TAG} orphan close isEnded=${isEnded}, remount native layer`);
    destroyAdComponent();
    remountHostCallback?.();
    return;
  }

  rewardAdState.loaded = false;
  console.log(`${LOG_TAG} closed isEnded=${isEnded}`);
  destroyAdComponent();

  if (isEnded) {
    console.log(`${LOG_TAG} 已看完，服务器回调请在 uniCloud 控制台查看 uniAdCallback / ad-reward-callback 日志`);
  } else {
    console.warn(`${LOG_TAG} 未看完(isEnded=false)，服务器回调通常不会触发`);
  }

  settlePending({ shown: true, isEnded });
  setTimeout(() => {
    forceResetRewardedVideoAd(isEnded ? 'close_remount' : 'early_close_remount');
  }, isEnded ? 200 : 0);
}

export function onRewardedVideoError(err) {
  rewardAdState.loading = false;
  rewardAdState.loaded = false;
  pendingShow = false;
  logAdError('error', err);
  settlePending({ shown: false, isEnded: false });
  setTimeout(() => {
    forceResetRewardedVideoAd('error_remount');
  }, 300);
}

function doShow() {
  if (!tryAcquireAd(AD_TYPE.REWARD)) {
    settlePending({ shown: false, isEnded: false, skipped: true });
    return;
  }

  if (!adComponent?.show) {
    releaseAd(AD_TYPE.REWARD);
    settlePending({ shown: false, isEnded: false });
    return;
  }

  rewardAdState.loading = true;
  Promise.resolve(adComponent.show())
    .then(() => {
      rewardAdState.loading = false;
      rewardAdState.showing = true;
      markRewardAdShown();
      console.log(`${LOG_TAG} shown`);
      bindBackButtonHandler();
    })
    .catch((err) => {
      rewardAdState.loading = false;
      rewardAdState.showing = false;
      releaseAd(AD_TYPE.REWARD);
      logAdError('show failed', err);
      settlePending({ shown: false, isEnded: false });
      setTimeout(() => forceResetRewardedVideoAd('show_fail_remount'), 300);
    });
}

function waitForRewardComponent(maxWait = 4000) {
  if (rewardAdState.mounted && adComponent) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const startedAt = Date.now();
    const timer = setInterval(() => {
      if (rewardAdState.mounted && adComponent) {
        clearInterval(timer);
        resolve(true);
        return;
      }
      if (Date.now() - startedAt >= maxWait) {
        clearInterval(timer);
        resolve(false);
      }
    }, 100);
  });
}

export function preloadRewardedVideoAd(options = {}) {
  if (!AD_REWARD_PID) return Promise.resolve(false);
  applyRewardContext(options);

  if (!adComponent?.load || rewardAdState.loading || rewardAdState.loaded) {
    return Promise.resolve(!!rewardAdState.loaded);
  }

  rewardAdState.loading = true;
  return Promise.resolve(adComponent.load())
    .then(() => {
      rewardAdState.loading = false;
      rewardAdState.loaded = true;
      console.log(`${LOG_TAG} preload ok adpid=${AD_REWARD_PID}`);
      return true;
    })
    .catch((err) => {
      rewardAdState.loading = false;
      logAdError('preload failed', err);
      return false;
    });
}

export function showRewardedVideoAd(options = {}) {
  const { onClose, delay = 0, force = false, ...contextOptions } = options;
  applyRewardContext(contextOptions);

  return new Promise((resolve) => {
    const run = async () => {
      scheduledRunTimer = null;

      if (!AD_REWARD_PID) {
        console.warn(`${LOG_TAG} AD_REWARD_PID is empty`);
        resolve({ shown: false, isEnded: false });
        return;
      }

      if (!force && !canShowRewardAd()) {
        console.log(`${LOG_TAG} skip: interval ${Math.round(AD_REWARD_INTERVAL / 1000)}s`);
        resolve({ shown: false, isEnded: false, skipped: true, reason: 'interval' });
        return;
      }

      const ready = await waitForRewardComponent();
      if (!ready) {
        console.log(`${LOG_TAG} skip: component not ready`);
        resolve({ shown: false, isEnded: false });
        return;
      }

      if (pendingResultResolve || rewardAdState.showing) {
        console.warn(`${LOG_TAG} already showing`);
        resolve({ shown: false, isEnded: false, skipped: true });
        return;
      }

      pendingResultResolve = resolve;
      userOnClose = onClose || null;

      showTimer = setTimeout(() => {
        console.warn(`${LOG_TAG} show timeout`);
        forceResetRewardedVideoAd('show_timeout');
      }, SHOW_TIMEOUT_MS);

      if (rewardAdState.loaded) {
        doShow();
        return;
      }

      pendingShow = true;
      if (!rewardAdState.loading) {
        preloadRewardedVideoAd(contextOptions);
      }
    };

    cancelScheduledRewardShow();

    if (delay > 0) {
      scheduledDelayTimer = setTimeout(() => {
        scheduledDelayTimer = null;
        scheduledRunTimer = setTimeout(run, 0);
      }, delay);
      return;
    }

    scheduledRunTimer = setTimeout(run, 0);
  });
}
