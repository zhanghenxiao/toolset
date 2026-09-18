<template>
  <!-- 官方插屏组件：默认隐藏，通过 ref.show() 展示 -->
  <!-- #ifdef APP-PLUS -->
  <ad-interstitial
    v-if="ready"
    ref="adRef"
    class="interstitial-ad-host"
    :adpid="AD_INTERSTITIAL_PID"
    :preload="true"
    :loadnext="true"
    @load="onLoad"
    @close="onClose"
    @error="onError"
  />
  <!-- #endif -->
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { AD_INTERSTITIAL_PID } from '@/utils/ad-config';
import {
  registerInterstitialComponent,
  unregisterInterstitialComponent,
  onInterstitialMounted,
  onInterstitialLoad,
  onInterstitialClose,
  onInterstitialError,
} from '@/utils/interstitial-ad';

const ready = ref(false);
const adRef = ref(null);

function isAppPlus() {
  if (typeof plus !== 'undefined') return true;
  try {
    return uni.getSystemInfoSync().uniPlatform === 'app';
  } catch {
    return false;
  }
}

onMounted(() => {
  if (!isAppPlus()) return;
  setTimeout(async () => {
    ready.value = true;
    await nextTick();
    registerInterstitialComponent(adRef.value);
    onInterstitialMounted();
  }, 500);
});

onUnmounted(() => {
  unregisterInterstitialComponent();
});

function onLoad() {
  onInterstitialLoad();
}

function onClose() {
  onInterstitialClose();
}

function onError(err) {
  onInterstitialError(err);
}
</script>

<style scoped>
.interstitial-ad-host {
  width: 0;
  height: 0;
  overflow: hidden;
}
</style>
