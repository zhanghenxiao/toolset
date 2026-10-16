<template>
  <!-- 官方插屏组件：默认隐藏，通过 ref.show() 展示 -->
  <!-- #ifdef APP-PLUS -->
  <ad-interstitial
    v-if="ready"
    ref="adRef"
    class="interstitial-ad-host"
    :adpid="adpid"
    :preload="false"
    :loadnext="false"
    @load="onLoad"
    @close="onClose"
    @error="onError"
  />
  <!-- #endif -->
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import {
  registerInterstitialComponent,
  unregisterInterstitialComponent,
  onInterstitialMounted,
  onInterstitialLoad,
  onInterstitialClose,
  onInterstitialError,
  interstitialState,
} from '@/utils/interstitial-ad';

const ready = ref(false);
const adRef = ref(null);
// 跟随控制器写入的随机插屏位
const adpid = computed(() => interstitialState.adpid || '');

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
