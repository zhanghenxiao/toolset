import {
  AD_ENABLE_SECONDARY,
  AD_REWARD_DETAIL_DELAY_MS,
  AD_REWARD_INDEX_DELAY_MS,
  AD_REWARD_INTERVAL,
  AD_REWARD_ON_DETAIL,
  AD_REWARD_SEARCH_INTERVAL,
  AD_REWARD_SEARCH_START,
  AD_SECONDARY_DELAY_MS,
} from './ad-config';
import { isAdBusy, waitForAdIdle } from './ad-guard';
import { showInterstitialAd } from './interstitial-ad';
import {
  cancelScheduledRewardShow,
  canShowRewardAd,
  isRewardAdShowing,
  showRewardedVideoAd,
  waitForRewardIdle,
} from './rewarded-video-ad';

const LOG_TAG = '[ad-policy]';

function getRewardDelay(scene) {
  if (scene === 'index_enter') return AD_REWARD_INDEX_DELAY_MS;
  if (scene === 'detail_enter') return AD_REWARD_DETAIL_DELAY_MS;
  return 0;
}

/**
 * 优先展示激励视频；若已有广告在播则等待其结束，避免直接 skip。
 * @param {object} [options] force 为 true 时忽略展示间隔（测试页用手动触发）
 */
export async function showPrimaryRewardAd(scene, extra = {}, options = {}) {
  const { force = false } = options;

  if (scene === 'detail_enter' && !AD_REWARD_ON_DETAIL) {
    console.log(`${LOG_TAG} skip reward scene=${scene}, disabled in config`);
    return { shown: false, isEnded: false, skipped: true, reason: 'detail_disabled' };
  }

  if (!force && !canShowRewardAd()) {
    console.log(`${LOG_TAG} skip reward scene=${scene}, interval ${Math.round(AD_REWARD_INTERVAL / 1000)}s`);
    return { shown: false, isEnded: false, skipped: true, reason: 'interval' };
  }

  if (isAdBusy() || isRewardAdShowing()) {
    console.log(`${LOG_TAG} wait active ad before scene=${scene}`);
    const rewardIdle = await waitForRewardIdle();
    const adIdle = rewardIdle ? await waitForAdIdle() : false;
    if (!rewardIdle || !adIdle) {
      console.log(`${LOG_TAG} skip reward scene=${scene}, wait timeout`);
      return { shown: false, isEnded: false, skipped: true };
    }
  }

  const delay = getRewardDelay(scene);
  console.log(`${LOG_TAG} primary reward scene=${scene} delay=${delay}ms`);

  return showRewardedVideoAd({
    delay,
    extra: { scene, ...extra },
  });
}

/** 搜索是否应弹激励视频（第 5、10、15… 次） */
export function shouldShowRewardForSearch(searchCount) {
  return searchCount >= AD_REWARD_SEARCH_START
    && searchCount % AD_REWARD_SEARCH_INTERVAL === 0;
}

/** 首页搜索：用户主动触发，忽略展示间隔 */
export async function showRewardForSearch() {
  if (isAdBusy() || isRewardAdShowing()) {
    console.log(`${LOG_TAG} wait active ad before search`);
    const rewardIdle = await waitForRewardIdle();
    const adIdle = rewardIdle ? await waitForAdIdle() : false;
    if (!rewardIdle || !adIdle) {
      console.log(`${LOG_TAG} skip search, wait timeout`);
      return { shown: false, isEnded: false, skipped: true };
    }
  }

  console.log(`${LOG_TAG} search reward`);
  return showRewardedVideoAd({
    force: true,
    extra: { scene: 'search' },
  });
}

/** 详情页复制阅读链接前：用户主动触发，忽略展示间隔 */
export async function showRewardForReadUnlock(bookId) {
  if (isAdBusy() || isRewardAdShowing()) {
    console.log(`${LOG_TAG} wait active ad before read_unlock bookId=${bookId}`);
    const rewardIdle = await waitForRewardIdle();
    const adIdle = rewardIdle ? await waitForAdIdle() : false;
    if (!rewardIdle || !adIdle) {
      console.log(`${LOG_TAG} skip read_unlock, wait timeout`);
      return { shown: false, isEnded: false, skipped: true };
    }
  }

  console.log(`${LOG_TAG} read_unlock reward bookId=${bookId}`);
  return showRewardedVideoAd({
    force: true,
    extra: { scene: 'read_unlock', bookId },
  });
}

/** 首页：激励结束 → 等待 → 插屏 → 再允许信息流 */
export function runIndexSecondaryAds(onDone) {
  if (!AD_ENABLE_SECONDARY) {
    onDone?.();
    return;
  }

  setTimeout(async () => {
    if (isAdBusy() || isRewardAdShowing()) {
      console.log(`${LOG_TAG} secondary delayed, reward still active, retry in 3s`);
      setTimeout(async () => {
        if (isAdBusy() || isRewardAdShowing()) {
          console.log(`${LOG_TAG} skip secondary, reward still active`);
          onDone?.();
          return;
        }
        console.log(`${LOG_TAG} secondary interstitial after reward`);
        await showInterstitialAd({ delay: 0 });
        onDone?.();
      }, 3000);
      return;
    }

    console.log(`${LOG_TAG} secondary interstitial after reward`);
    await showInterstitialAd({ delay: 0 });
    onDone?.();
  }, AD_SECONDARY_DELAY_MS);
}

/** 首页 onHide 时取消尚未展示的激励视频 */
export function cancelPendingHomeRewardAd() {
  cancelScheduledRewardShow();
}

/** 信息流次要广告：激励+插屏链路结束后再延迟 */
export function getSecondaryAdDelayMs() {
  return AD_ENABLE_SECONDARY ? 0 : 0;
}
