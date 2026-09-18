import { reactive } from 'vue';
import { AD_INTERSTITIAL_PID, AD_INTERSTITIAL_INTERVAL } from './ad-config';

const LOG_TAG = '[interstitial-ad]';
const SHOW_TIMEOUT_MS = 12000;

export const interstitialState = reactive({
  mounted: false,
  loaded: false,
  loading: false,
});

let adComponent = null;
let lastShowAt = 0;
let pendingShow = false;
let showResolve = null;
let showTimer = null;
let afterCloseCallback = null;

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
    console.warn(`${LOG_TAG} -5002：云打包须用正式 adpid，测试位仅标准基座可用`);
  }
  if (String(msg).includes('-5004')) {
    console.warn(`${LOG_TAG} -5004：云打包请勾选 uni-ad 及已开通的广告 SDK`);
  }
  if (String(msg).includes('-5005')) {
    console.warn(
      `${LOG_TAG} -5005：暂无填充，请确认插屏位 ${AD_INTERSTITIAL_PID} 已绑定各渠道且建议选「半屏」`,
    );
  }
}

function finishShow(result) {
  if (showTimer) {
    clearTimeout(showTimer);
    showTimer = null;
  }
  if (showResolve) {
    const resolve = showResolve;
    showResolve = null;
    resolve(result);
  }
}

function runAfterClose() {
  if (!afterCloseCallback) return;
  const cb = afterCloseCallback;
  afterCloseCallback = null;
  cb();
}

export function registerInterstitialComponent(comp) {
  adComponent = comp;
}

export function unregisterInterstitialComponent() {
  adComponent = null;
  interstitialState.mounted = false;
  interstitialState.loaded = false;
  interstitialState.loading = false;
}

export function onInterstitialMounted() {
  interstitialState.mounted = true;
  console.log(`${LOG_TAG} component ready adpid=${AD_INTERSTITIAL_PID}`);
}

export function onInterstitialLoad() {
  interstitialState.loading = false;
  interstitialState.loaded = true;
  console.log(`${LOG_TAG} loaded`);
  if (pendingShow) {
    pendingShow = false;
    doShow();
  }
}

export function onInterstitialClose() {
  interstitialState.loaded = false;
  console.log(`${LOG_TAG} closed`);
  runAfterClose();
}

export function onInterstitialError(err) {
  interstitialState.loading = false;
  interstitialState.loaded = false;
  pendingShow = false;
  logAdError('error', err);
  finishShow(false);
}

function doShow() {
  if (!adComponent?.show) {
    finishShow(false);
    return;
  }

  interstitialState.loading = true;
  Promise.resolve(adComponent.show())
    .then(() => {
      lastShowAt = Date.now();
      interstitialState.loaded = false;
      interstitialState.loading = false;
      console.log(`${LOG_TAG} shown`);
      finishShow(true);
    })
    .catch((err) => {
      interstitialState.loading = false;
      logAdError('show failed', err);
      finishShow(false);
    });
}

/** 由官方 ad-interstitial 组件预加载，此处保留兼容调用 */
export function preloadInterstitialAd() {
  if (!adComponent?.load || interstitialState.loading || interstitialState.loaded) return;
  interstitialState.loading = true;
  Promise.resolve(adComponent.load()).catch((err) => {
    interstitialState.loading = false;
    logAdError('preload failed', err);
  });
}

/**
 * 展示插屏（通过官方 ad-interstitial 组件）
 */
export function showInterstitialAd(options = {}) {
  const { force = false, delay = 300, afterClose } = options;
  afterCloseCallback = afterClose || null;

  return new Promise((resolve) => {
    setTimeout(() => {
      const now = Date.now();
      if (!force && now - lastShowAt < AD_INTERSTITIAL_INTERVAL) {
        console.log(`${LOG_TAG} skipped: interval`);
        afterCloseCallback = null;
        resolve(false);
        return;
      }

      if (!interstitialState.mounted || !adComponent) {
        console.log(`${LOG_TAG} skip: component not ready`);
        afterCloseCallback = null;
        resolve(false);
        return;
      }

      if (showResolve) {
        afterCloseCallback = null;
        resolve(false);
        return;
      }

      showResolve = resolve;
      showTimer = setTimeout(() => {
        pendingShow = false;
        console.warn(`${LOG_TAG} show timeout`);
        afterCloseCallback = null;
        finishShow(false);
      }, SHOW_TIMEOUT_MS);

      if (interstitialState.loaded) {
        doShow();
        return;
      }

      pendingShow = true;
      if (!interstitialState.loading) {
        preloadInterstitialAd();
      }
    }, delay);
  });
}
