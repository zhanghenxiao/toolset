<template>
  <!-- #ifdef APP-PLUS -->
  <view v-if="visible" class="feed-ad">
    <ad :adpid="AD_FEED_PID" @load="onLoad" @error="onError" />
  </view>
  <!-- #endif -->
</template>

<script setup>
import { ref } from 'vue';
import { AD_FEED_PID } from '@/utils/ad-config';

const visible = ref(true);

function onLoad() {
  console.log('[feed-ad] load ok');
}

function onError(err) {
  console.warn('[feed-ad] error', err);
  visible.value = false;
}
</script>

<style lang="scss" scoped>
.feed-ad {
  margin: 24rpx 32rpx 0;
  border-radius: 16rpx;
  overflow: hidden;
  background: #fffdf7;
  border: 1rpx solid #ddcdae;
}
</style>
