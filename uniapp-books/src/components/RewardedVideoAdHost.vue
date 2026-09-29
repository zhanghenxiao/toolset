<template>
  <!-- 官方激励视频组件：预加载后通过 ref.show() 展示 -->
  <!-- #ifdef APP-PLUS -->
  <ad-rewarded-video
    v-if="ready"
    :key="hostKey"
    ref="adRef"
    class="rewarded-video-ad-host"
    :adpid="AD_REWARD_PID"
    :url-callback="urlCallback"
    :preload="true"
    :loadnext="true"
    @load="onLoad"
    @close="onClose"
    @error="onError"
  />
  <!-- #endif -->
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue';
import { AD_REWARD_ENABLE_URL_CALLBACK, AD_REWARD_PID } from '@/utils/ad-config';
import {
  getRewardUrlCallback,
  registerRewardedVideoComponent,
  unregisterRewardedVideoComponent,
  registerRewardAdRemount,
  onRewardedVideoMounted,
  onRewardedVideoLoad,
  onRewardedVideoClose,
  onRewardedVideoError,
  preloadRewardedVideoAd,
  rewardAdHostKey,
} from '@/utils/rewarded-video-ad';

const ready = ref(false);
const adRef = ref(null);
const hostKey = computed(() => rewardAdHostKey.value);

const urlCallback = computed(() => {
  if (!AD_REWARD_ENABLE_URL_CALLBACK) return undefined;
  return getRewardUrlCallback();
});

function isAppPlus() {
  if (typeof plus !== 'undefined') return true;
  try {
    return uni.getSystemInfoSync().uniPlatform === 'app';
  } catch {
    return false;
  }
}

function destroyAdRef() {
  try {
    adRef.value?.destroy?.();
  } catch (e) {
    console.warn('[rewarded-video-ad] destroy failed', e);
  }
}

async function mountAdComponent() {
  if (!isAppPlus() || !AD_REWARD_PID) return;
  ready.value = true;
  await nextTick();
  registerRewardedVideoComponent(adRef.value);
  onRewardedVideoMounted();
  preloadRewardedVideoAd();
}

/** 销毁原生广告层并重建组件（跳过确认后 SDK 偶发不关闭时使用） */
async function remountAdHost() {
  destroyAdRef();
  ready.value = false;
  unregisterRewardedVideoComponent();
  rewardAdHostKey.value += 1;
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 600));
  await mountAdComponent();
}

onMounted(() => {
  if (!isAppPlus()) return;
  if (!AD_REWARD_PID) {
    console.warn('[rewarded-video-ad] AD_REWARD_PID empty, skip mount');
    return;
  }

  registerRewardAdRemount(remountAdHost);
  setTimeout(mountAdComponent, 500);
});

onUnmounted(() => {
  registerRewardAdRemount(null);
  unregisterRewardedVideoComponent();
});

function onLoad() {
  onRewardedVideoLoad();
}

function onClose(e) {
  onRewardedVideoClose(e);
}

function onError(err) {
  onRewardedVideoError(err);
}
</script>

<style scoped>
.rewarded-video-ad-host {
  width: 0;
  height: 0;
  overflow: hidden;
}
</style>
