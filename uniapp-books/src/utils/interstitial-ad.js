import { reactive, nextTick } from 'vue';
import { AD_INTERSTITIAL_PID, AD_INTERSTITIAL_INTERVAL, AD_INTERSTITIAL_PID_LIST, AD_INTERSTITIAL_ENABLED } from './ad-config';
import { AD_TYPE, isAdBusy, releaseAd, tryAcquireAd } from './ad-guard';

const LOG_TAG = '[interstitial-ad]';
const SHOW_TIMEOUT_MS = 12000;
const AD_INTERSTITIAL_LAST_SHOW_KEY = 'ad_interstitial_last_show';

// 启动时从本地缓存恢复上次展示时间（跨会话防瞬时重弹），并对改时钟做基本防护
function loadInterstitialLastShow() {
  try {
    const v = uni.getStorageSync(AD_INTERSTITIAL_LAST_SHOW_KEY);
    if (typeof v !== 'number' || !isFinite(v) || v <= 0) return 0;
    // 上次展示时间不应在未来；若因改时钟变为未来值，归零避免长期屏蔽广告
    if (v > Date.now()) return 0;
    return v;
  } catch (e) {
    return 0;
  }
}

function saveInterstitialLastShow(ts) {
  try {
    uni.setStorageSync(AD_INTERSTITIAL_LAST_SHOW_KEY, ts);
  } catch (e) {}
}

export const interstitialState = reactive({
  mounted: false,
  loaded: false,
  loading: false,
  // 当前展示用的插屏 adpid（每次曝光由 showInterstitialAd 随机写入，实现更细的填充分发）
  adpid: AD_INTERSTITIAL_PID,
});

let adComponent = null;
let lastShowAt = loadInterstitialLastShow();
let pendingShow = false;
let showResolve = null;
let showTimer = null;
let afterCloseCallback = null;
// 本次展示已尝试过的插屏位下标（用于无填充兜底，避免重复/死循环）
let triedPids = [];

// 从插屏池中随机选一个尚未尝试过的 adpid 写入 interstitialState.adpid。
// 返回是否还选到了位（池耗尽则返回 false）。
function pickNextInterstitialPid() {
  const list = AD_INTERSTITIAL_PID_LIST;
  if (!list || !list.length) {
    interstitialState.adpid = AD_INTERSTITIAL_PID;
    return true;
  }
  const remaining = [];
  for (let i = 0; i < list.length; i++) {
    if (!triedPids.includes(i)) remaining.push(i);
  }
  if (!remaining.length) return false;
  const idx = remaining[Math.floor(Math.random() * remaining.length)];
  triedPids.push(idx);
  interstitialState.adpid = list[idx];
  return true;
}

// 显式加载当前 adpid（preload=false 时由我们控制；adpid 更新后必须重新 load 才会用新位）
function loadAd() {
  if (!adComponent || !adComponent.load) {
    logAdError('load', 'component has no load()');
    return;
  }
  interstitialState.loading = true;
  Promise.resolve(adComponent.load()).catch((err) => {
    interstitialState.loading = false;
    logAdError('load failed', err);
  });
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
  releaseAd(AD_TYPE.INTERSTITIAL);
  console.log(`${LOG_TAG} closed`);
  runAfterClose();
}

export function onInterstitialError(err) {
  interstitialState.loading = false;
  interstitialState.loaded = false;
  pendingShow = false;
  releaseAd(AD_TYPE.INTERSTITIAL);
  logAdError('error', err);
  // 无填充/错误：尝试池中下一个位兜底；全部失败才放弃本次展示
  if (showTimer) {
    clearTimeout(showTimer);
    showTimer = null;
  }
  if (pickNextInterstitialPid()) {
    pendingShow = true;
    nextTick(() => loadAd());
  } else {
    finishShow(false);
  }
}

function doShow() {
  if (!tryAcquireAd(AD_TYPE.INTERSTITIAL)) {
    finishShow(false);
    return;
  }

  if (!adComponent?.show) {
    releaseAd(AD_TYPE.INTERSTITIAL);
    finishShow(false);
    return;
  }

  interstitialState.loading = true;
  Promise.resolve(adComponent.show())
    .then(() => {
      lastShowAt = Date.now();
      saveInterstitialLastShow(lastShowAt);
      interstitialState.loaded = false;
      interstitialState.loading = false;
      console.log(`${LOG_TAG} shown`);
      finishShow(true);
    })
    .catch((err) => {
      interstitialState.loading = false;
      releaseAd(AD_TYPE.INTERSTITIAL);
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
  if (!AD_INTERSTITIAL_ENABLED) {
    console.log(`${LOG_TAG} disabled by AD_INTERSTITIAL_ENABLED`);
    if (options.afterClose) options.afterClose();
    return Promise.resolve(false);
  }
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

      if (isAdBusy()) {
        console.log(`${LOG_TAG} skipped: another ad active`);
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

      // 每次曝光重新随机选位（更细的填充分发），并重置兜底序列
      triedPids = [];
      if (!pickNextInterstitialPid()) {
        finishShow(false);
        return;
      }

      // 等响应式 adpid 落到原生组件后再加载/展示（preload=false 由我们控制）
      nextTick(() => {
        if (interstitialState.loaded) {
          doShow();
          return;
        }
        pendingShow = true;
        if (!interstitialState.loading) {
          loadAd();
        }
      });
    }, delay);
  });
}
