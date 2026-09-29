const LOG_TAG = '[ad-guard]';

export const AD_TYPE = {
  REWARD: 'reward',
  INTERSTITIAL: 'interstitial',
  FEED: 'feed',
};

let activeAd = null;

export function isAdBusy() {
  return activeAd !== null;
}

export function getActiveAdType() {
  return activeAd;
}

export function tryAcquireAd(type) {
  if (activeAd) {
    console.log(`${LOG_TAG} busy with ${activeAd}, reject ${type}`);
    return false;
  }
  activeAd = type;
  return true;
}

export function releaseAd(type) {
  if (activeAd === type) {
    activeAd = null;
  }
}

export function waitForAdIdle(maxWait = 90000) {
  if (!activeAd) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const startedAt = Date.now();
    const timer = setInterval(() => {
      if (!activeAd) {
        clearInterval(timer);
        resolve(true);
        return;
      }
      if (Date.now() - startedAt >= maxWait) {
        clearInterval(timer);
        console.warn(`${LOG_TAG} wait idle timeout, active=${activeAd}`);
        resolve(false);
      }
    }, 200);
  });
}
