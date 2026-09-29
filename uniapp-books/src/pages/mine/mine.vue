<template>
  <view class="page">
    <view class="profile-card">
      <view class="avatar">书</view>
      <text class="app-name">数维探索</text>
      <text class="version-line">当前版本 v{{ appVersion }}</text>
    </view>

    <view class="feature-card">
      <text class="section-title">常用功能</text>
      <view class="feature-grid">
        <view class="feature-item" @tap="onCheckUpdate">
          <view class="feature-icon update">↑</view>
          <text class="feature-label">版本更新</text>
        </view>
        <view class="feature-item" @tap="onOpenManual">
          <view class="feature-icon manual">?</view>
          <text class="feature-label">用户手册</text>
        </view>
        <view class="feature-item" @tap="onShareApp">
          <view class="feature-icon share">+</view>
          <text class="feature-label">分享APP</text>
        </view>
        <view class="feature-item" @tap="onOpenSite">
          <view class="feature-icon site">⌁</view>
          <text class="feature-label">访问官网</text>
        </view>
      </view>
    </view>

    <view class="info-card intro-card">
      <text class="section-title">关于数维探索</text>
      <text class="info-text">数维探索是一款精选小说书单应用，提供分类筛选、书籍详情与阅读链接获取。</text>
    </view>

    <view class="info-card">
      <text class="section-title">联系我们</text>
      <text class="info-text">小程序搜：数维探索</text>
      <text class="info-text">官方反馈群：1041698859</text>
      <text class="info-text">官网：{{ site }}</text>
    </view>

    <share-app-modal :visible="shareVisible" @close="shareVisible = false" />

    <view v-if="manualVisible" class="manual-mask" @tap="manualVisible = false">
      <view class="manual-card" @tap.stop>
        <text class="manual-title">用户手册</text>
        <scroll-view class="manual-body" scroll-y>
          <text class="manual-text">{{ manualText }}</text>
        </scroll-view>
        <view class="manual-btn" @tap="manualVisible = false">
          <text>我知道了</text>
        </view>
      </view>
    </view>

    <app-tab-bar />
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { APP_VERSION_NAME } from '@/utils/app-version';
import { checkAppUpdate } from '@/utils/app-update';
import { SITE } from '@/utils/config';
import { copyShareAppText } from '@/utils/share-app';
import AppTabBar from '@/components/AppTabBar.vue';
import ShareAppModal from '@/components/ShareAppModal.vue';

const appVersion = APP_VERSION_NAME;
const site = SITE;
const shareVisible = ref(false);
const manualVisible = ref(false);
let versionChecking = false;

const manualText = `1. 首页可按分类、标签、关键词筛选书籍，默认展示 50 本。
2. 点击书籍卡片进入详情，查看简介与阅读方式。
3. 部分书籍需观看激励视频后解锁阅读链接。
4. 本页可检查版本更新、查看本手册、分享 APP，并查看应用介绍与联系方式。
5. 更多书源与反馈：小程序搜「数维探索」，或加入官方反馈群 1041698859。`;

async function onCheckUpdate() {
  if (versionChecking) return;
  versionChecking = true;
  uni.showToast({ title: '检查更新中…', icon: 'none', duration: 1500 });
  try {
    const hasUpdate = await checkAppUpdate({ silent: false });
    if (!hasUpdate) {
      uni.showToast({ title: '已是最新版本', icon: 'none' });
    }
  } finally {
    versionChecking = false;
  }
}

function onOpenManual() {
  manualVisible.value = true;
}

async function onShareApp() {
  try {
    await copyShareAppText();
    shareVisible.value = true;
  } catch {
    uni.showToast({ title: '复制失败，请重试', icon: 'none' });
  }
}

function onOpenSite() {
  // #ifdef APP-PLUS
  plus.runtime.openURL(site);
  // #endif
  // #ifndef APP-PLUS
  uni.setClipboardData({
    data: site,
    success: () => uni.showToast({ title: '官网链接已复制', icon: 'none' }),
  });
  // #endif
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 32rpx 32rpx 140rpx;
  box-sizing: border-box;
}

.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx 32rpx 40rpx;
  margin-bottom: 24rpx;
  border-radius: 20rpx;
  background: linear-gradient(180deg, #fffaf0 0%, #f7eeda 100%);
  border: 1rpx solid #e0d0b2;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: linear-gradient(145deg, #d8c4a0, #b89b72);
  color: #fffdf7;
  font-size: 48rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
}

.app-name {
  font-size: 36rpx;
  font-weight: 700;
  color: #4a3728;
  letter-spacing: 6rpx;
}

.version-line {
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #8a7355;
}

.feature-card,
.info-card {
  padding: 28rpx;
  margin-bottom: 24rpx;
  border-radius: 20rpx;
  background: #fffdf7;
  border: 1rpx solid #e5d8bd;
}

.intro-card {
  background: linear-gradient(180deg, #fffaf0 0%, #f7eeda 100%);
}

.info-text {
  display: block;
  font-size: 26rpx;
  color: #7a6550;
  line-height: 1.9;
}

.section-title {
  display: block;
  margin-bottom: 24rpx;
  font-size: 30rpx;
  font-weight: 700;
  color: #4a3728;
}

.feature-grid {
  display: flex;
  flex-wrap: wrap;
}

.feature-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14rpx;
  padding: 16rpx 0;
}

.feature-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  color: #6d2229;
  background: #f7eeda;
  border: 1rpx solid #e5d8bd;
}

.feature-icon.share {
  font-size: 42rpx;
  font-weight: 300;
}

.feature-label {
  font-size: 22rpx;
  color: #6a5844;
  text-align: center;
}

.manual-mask {
  position: fixed;
  inset: 0;
  z-index: 9997;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48rpx;
  background: rgba(58, 47, 36, 0.45);
}

.manual-card {
  width: 100%;
  max-width: 620rpx;
  max-height: 72vh;
  padding: 36rpx 32rpx 28rpx;
  border-radius: 20rpx;
  background: #fffdf7;
  border: 1rpx solid #e5d8bd;
  display: flex;
  flex-direction: column;
}

.manual-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #4a3728;
  text-align: center;
  margin-bottom: 20rpx;
}

.manual-body {
  flex: 1;
  max-height: 52vh;
}

.manual-text {
  font-size: 28rpx;
  color: #5c4a38;
  line-height: 1.8;
  white-space: pre-wrap;
}

.manual-btn {
  margin-top: 24rpx;
  height: 80rpx;
  border-radius: 12rpx;
  background: linear-gradient(135deg, #8c2f39, #6d2229);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f7eeda;
  font-size: 28rpx;
}
</style>
