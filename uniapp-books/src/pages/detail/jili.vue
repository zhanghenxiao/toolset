<template>
  <view class="page">
    <rewarded-video-ad-host />
    <view class="card">
      <text class="title">激励视频（官方组件测试）</text>
      <text class="desc">
        使用官方 ad-rewarded-video 组件。看完广告后，uniAdCallback 会调用云函数 ad-reward-callback。
      </text>
      <text class="meta">userId: {{ userId }}</text>
      <button class="btn" type="primary" :loading="loading" @tap="onShowAd">
        看广告解锁内容
      </button>
      <text v-if="lastResult" class="result">{{ lastResult }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onReady } from '@dcloudio/uni-app';
import RewardedVideoAdHost from '@/components/RewardedVideoAdHost.vue';
import {
  getRewardAdUserId,
  preloadRewardedVideoAd,
  showRewardedVideoAd,
} from '@/utils/rewarded-video-ad';

const userId = ref(getRewardAdUserId());
const loading = ref(false);
const lastResult = ref('');

onReady(() => {
  setTimeout(() => {
    preloadRewardedVideoAd({ extra: { scene: 'jili-demo' } });
  }, 800);
});

async function onShowAd() {
  if (loading.value) return;
  loading.value = true;
  lastResult.value = '';

  try {
    const { shown, isEnded } = await showRewardedVideoAd({
      force: true,
      extra: { scene: 'jili-demo' },
      onClose: ({ isEnded: ended }) => {
        if (!ended) {
          lastResult.value = '未看完，暂无奖励';
        }
      },
    });

    if (!shown) {
      lastResult.value = '广告未能展示，请稍后重试';
      return;
    }

    if (isEnded) {
      lastResult.value = '客户端已确认看完；奖励以云函数 ad-reward-callback 服务器回调为准';
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 32rpx;
  background: #f3ead8;
}

.card {
  padding: 32rpx;
  border-radius: 16rpx;
  background: #fff;
}

.title {
  display: block;
  margin-bottom: 16rpx;
  font-size: 34rpx;
  font-weight: 600;
  color: #4a3728;
}

.desc,
.meta,
.result {
  display: block;
  margin-bottom: 16rpx;
  font-size: 26rpx;
  line-height: 1.6;
  color: #666;
}

.btn {
  margin-top: 24rpx;
}

.result {
  margin-top: 24rpx;
  color: #2f7d32;
}
</style>
