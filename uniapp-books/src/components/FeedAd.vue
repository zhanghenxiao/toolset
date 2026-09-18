<template>
  <view v-if="visible" class="feed-ad-wrap" :style="wrapStyle">
    <!-- #ifdef APP-PLUS -->
    <ad
      v-if="adReady"
      class="feed-ad"
      :data="adData"
      :style="adStyle"
      @load="onLoad"
      @error="onError"
    />
    <!-- #endif -->
    <view v-if="!loaded" class="feed-ad-mask" :class="{ errored: errored }">
      <text class="feed-ad-tip">{{ statusText }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { AD_FEED_PID } from '@/utils/ad-config';

const LOG_TAG = '[feed-ad]';
const MAX_RETRY = 2;
const RETRY_DELAY_MS = 5000;

const props = defineProps({
  /** 由首页 onReady 后再设为 true，确保布局完成 */
  active: { type: Boolean, default: false },
});

const visible = ref(false);
const adReady = ref(false);
const loaded = ref(false);
const errored = ref(false);
const retryCount = ref(0);
const adData = ref(null);
const statusText = ref('广告加载中…');

const wrapStyle = computed(() => ({
  minHeight: loaded.value ? 'auto' : '120rpx',
}));

const adStyle = computed(() => ({
  width: '100%',
}));

function isAppPlus() {
  if (typeof plus !== 'undefined') return true;
  try {
    return uni.getSystemInfoSync().uniPlatform === 'app';
  } catch {
    return false;
  }
}

function getFeedAdWidthPx() {
  const { windowWidth = 375 } = uni.getSystemInfoSync();
  const horizontalMarginPx = uni.upx2px(64);
  return Math.max(265, Math.floor(windowWidth - horizontalMarginPx));
}

function parseAdError(err) {
  const detail = err?.detail || err;
  const nested = detail?.errMsg;
  const code = nested?.errCode ?? detail?.errCode ?? detail?.code ?? err?.code ?? err?.errCode;
  const msg = nested?.errMsg ?? detail?.errMsg ?? detail?.message ?? err?.message ?? 'unknown';
  return { code, msg };
}

function fetchAdData() {
  return new Promise((resolve, reject) => {
    if (typeof plus === 'undefined' || !plus.ad?.getAds) {
      reject(new Error('plus.ad.getAds unavailable'));
      return;
    }

    const width = getFeedAdWidthPx();
    plus.ad.getAds(
      {
        adpid: AD_FEED_PID,
        count: 3,
        width,
      },
      (res) => {
        if (res?.ads?.length) {
          resolve(res.ads[0]);
          return;
        }
        reject({ errCode: '-5005', errMsg: '无广告数据返回' });
      },
      (err) => reject(err),
    );
  });
}

async function loadFeedAd() {
  if (!visible.value) return;

  adReady.value = false;
  loaded.value = false;
  errored.value = false;
  statusText.value = retryCount.value > 0 ? '广告重试中…' : '广告加载中…';

  try {
    adData.value = await fetchAdData();
    adReady.value = true;
    console.log(`${LOG_TAG} getAds ok adpid=${AD_FEED_PID}`, adData.value);
  } catch (err) {
    const { code, msg } = parseAdError(err);
    console.warn(`${LOG_TAG} getAds fail adpid=${AD_FEED_PID} code=${code} msg=${msg}`, err);

    if (retryCount.value < MAX_RETRY) {
      retryCount.value += 1;
      setTimeout(loadFeedAd, RETRY_DELAY_MS);
      return;
    }

    errored.value = true;
    statusText.value = '广告暂未加载';
    console.warn(
      `${LOG_TAG} -5005：暂无填充。请确认信息流位 ${AD_FEED_PID} 已审核、已绑定 manifest 中 7 个渠道，且云打包已勾选 UniAd 模块`,
    );
  }
}

function startFeedAd() {
  if (visible.value || !isAppPlus()) return;
  visible.value = true;
  retryCount.value = 0;
  console.log(`${LOG_TAG} mount adpid=${AD_FEED_PID}`);
  loadFeedAd();
}

watch(
  () => props.active,
  (val) => {
    if (!val) return;
    setTimeout(startFeedAd, 300);
  },
  { immediate: true },
);

function onLoad() {
  loaded.value = true;
  errored.value = false;
  console.log(`${LOG_TAG} render ok adpid=${AD_FEED_PID}`);
}

function onError(err) {
  const { code, msg } = parseAdError(err);
  console.warn(`${LOG_TAG} render error adpid=${AD_FEED_PID} code=${code} msg=${msg}`, err);

  if (retryCount.value < MAX_RETRY) {
    retryCount.value += 1;
    adReady.value = false;
    adData.value = null;
    setTimeout(loadFeedAd, RETRY_DELAY_MS);
    return;
  }

  errored.value = true;
  statusText.value = '广告暂未加载';
}
</script>

<style scoped>
.feed-ad-wrap {
  position: relative;
  margin: 0 32rpx 24rpx;
  border-radius: 10rpx;
  overflow: hidden;
  background: #fffaf0;
  border: 1rpx solid #e0d0b2;
}

.feed-ad {
  width: 100%;
}

.feed-ad-mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 250, 240, 0.92);
  pointer-events: none;
}

.feed-ad-mask.errored {
  background: rgba(247, 238, 218, 0.95);
}

.feed-ad-tip {
  font-size: 24rpx;
  color: #a08a68;
  letter-spacing: 2rpx;
}
</style>
