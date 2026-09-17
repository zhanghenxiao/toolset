import { AD_INTERSTITIAL_PID, AD_INTERSTITIAL_INTERVAL } from './ad-config';

let interstitialAd = null;
let lastShowAt = 0;
let loading = false;

function isAppPlus() {
  try {
    return uni.getSystemInfoSync().uniPlatform === 'app';
  } catch {
    return false;
  }
}

function ensureAd() {
  if (!isAppPlus() || typeof uni.createInterstitialAd !== 'function') {
    return null;
  }

  if (!interstitialAd) {
    interstitialAd = uni.createInterstitialAd({ adpid: AD_INTERSTITIAL_PID });
    interstitialAd.onLoad(() => {
      loading = false;
    });
    interstitialAd.onError((err) => {
      loading = false;
      console.warn('[interstitial-ad] error', err);
    });
    interstitialAd.onClose(() => {
      preloadInterstitialAd();
    });
  }

  return interstitialAd;
}

/** 预加载插屏广告 */
export function preloadInterstitialAd() {
  const ad = ensureAd();
  if (!ad || loading) return;

  loading = true;
  ad.load().catch(() => {
    loading = false;
  });
}

/**
 * 展示插屏广告
 * @param {{ force?: boolean }} options force=true 时忽略展示间隔
 * @returns {Promise<boolean>} 是否成功展示
 */
export function showInterstitialAd(options = {}) {
  const { force = false } = options;
  const now = Date.now();

  if (!force && now - lastShowAt < AD_INTERSTITIAL_INTERVAL) {
    return Promise.resolve(false);
  }

  const ad = ensureAd();
  if (!ad) return Promise.resolve(false);

  return ad
    .show()
    .then(() => {
      lastShowAt = Date.now();
      return true;
    })
    .catch((err) => {
      console.warn('[interstitial-ad] show failed', err);
      preloadInterstitialAd();
      return false;
    });
}
