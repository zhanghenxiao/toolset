<template>
  <view class="tab-bar">
    <view
      class="tab-item"
      :class="{ active: current === 'index' }"
      @tap="goTab('/pages/index/index', 'index')"
    >
      <view class="icon-wrap">
        <text class="tab-icon home-icon">⌂</text>
      </view>
      <text class="tab-text">首页</text>
    </view>
    <view
      class="tab-item"
      :class="{ active: current === 'about' }"
      @tap="goTab('/pages/mine/mine', 'about')"
    >
      <view class="icon-wrap">
        <text class="tab-icon about-icon">◎</text>
      </view>
      <text class="tab-text">关于</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';

const current = ref('index');

function syncCurrent() {
  const pages = getCurrentPages();
  const route = pages[pages.length - 1]?.route || '';
  current.value = route.includes('mine') || route.includes('about') ? 'about' : 'index';
}

function goTab(url, tab) {
  if (current.value === tab) return;
  uni.reLaunch({ url });
}

onShow(() => {
  syncCurrent();
});

syncCurrent();
</script>

<style lang="scss" scoped>
.tab-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 900;
  display: flex;
  height: 128rpx;
  padding-bottom: env(safe-area-inset-bottom);
  background: rgba(255, 253, 247, 0.98);
  border-top: 1rpx solid #e5d8bd;
  box-shadow: 0 -6rpx 24rpx rgba(74, 55, 40, 0.08);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  color: #b5a088;
  transition: color 0.2s ease;
}

.tab-item.active {
  color: #6d2229;
}

.icon-wrap {
  width: 68rpx;
  height: 68rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  transition: background 0.2s ease, transform 0.2s ease;
}

.tab-item.active .icon-wrap {
  background: linear-gradient(180deg, rgba(140, 47, 57, 0.14) 0%, rgba(109, 34, 41, 0.08) 100%);
  transform: scale(1.03);
}

.tab-icon {
  font-size: 44rpx;
  line-height: 1;
  color: inherit;
  font-weight: 500;
}

.home-icon {
  font-size: 56rpx;
}

.about-icon {
  font-size: 46rpx;
  font-weight: 500;
}

.tab-item.active .tab-icon {
  font-weight: 700;
  color: #6d2229;
}

.tab-item.active .home-icon {
  font-size: 62rpx;
}

.tab-item.active .about-icon {
  font-size: 52rpx;
  font-weight: 700;
}

.tab-text {
  font-size: 24rpx;
  letter-spacing: 2rpx;
  color: inherit;
}

.tab-item.active .tab-text {
  font-weight: 700;
  color: #6d2229;
}
</style>
