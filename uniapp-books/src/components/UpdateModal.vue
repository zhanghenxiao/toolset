<template>
  <view v-if="state.visible" class="update-mask" @tap.stop>
    <view class="update-card" @tap.stop>
      <view class="update-accent" />
      <view class="update-header">
        <view class="update-icon-wrap">
          <text class="update-icon">↑</text>
        </view>
        <view class="update-title-wrap">
          <text class="update-title">{{ state.forceUpdate ? '重要更新' : '发现新版本' }}</text>
          <view class="update-version-row">
            <text v-if="state.versionName" class="update-version">v{{ state.versionName }}</text>
            <text class="update-build">Build {{ state.versionCode }}</text>
          </view>
        </view>
      </view>

      <view class="update-body">
        <text class="update-label">更新内容</text>
        <scroll-view class="update-changelog" scroll-y :show-scrollbar="false">
          <text class="update-changelog-text">{{ state.changelog }}</text>
        </scroll-view>
      </view>

      <view class="update-actions">
        <view class="update-btn update-btn-primary" @tap="onConfirm">
          <text class="update-btn-text">{{ state.confirmText }}</text>
        </view>
        <view
          v-if="!state.forceUpdate"
          class="update-btn update-btn-ghost"
          @tap="onCancel"
        >
          <text class="update-btn-text ghost">稍后再说</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import {
  updateModalState,
  confirmUpdatePrompt,
  cancelUpdatePrompt,
} from '@/utils/update-prompt';

const state = updateModalState;

function onConfirm() {
  confirmUpdatePrompt();
}

function onCancel() {
  cancelUpdatePrompt();
}
</script>

<style lang="scss" scoped>
.update-mask {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48rpx;
  background: rgba(58, 47, 36, 0.52);
  backdrop-filter: blur(6px);
  animation: mask-in 0.28s ease;
}

.update-card {
  position: relative;
  width: 100%;
  max-width: 620rpx;
  padding: 0 0 36rpx;
  border-radius: 24rpx;
  overflow: hidden;
  background: linear-gradient(165deg, #fffdf8 0%, #f7eeda 48%, #efe3cb 100%);
  border: 1rpx solid rgba(201, 169, 122, 0.55);
  box-shadow:
    0 24rpx 64rpx rgba(74, 55, 40, 0.22),
    0 4rpx 16rpx rgba(122, 47, 47, 0.08);
  animation: card-in 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}

.update-accent {
  height: 6rpx;
  background: linear-gradient(90deg, #7a2f2f 0%, #c9a97a 50%, #7a2f2f 100%);
}

.update-header {
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding: 40rpx 40rpx 28rpx;
}

.update-icon-wrap {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #8c2f39 0%, #6d2229 100%);
  box-shadow: 0 10rpx 24rpx rgba(109, 34, 41, 0.35);
  flex-shrink: 0;
}

.update-icon {
  font-size: 44rpx;
  font-weight: 700;
  color: #f7eeda;
  line-height: 1;
  transform: translateY(-2rpx);
}

.update-title-wrap {
  flex: 1;
  min-width: 0;
}

.update-title {
  display: block;
  font-size: 38rpx;
  font-weight: 700;
  color: #4a3728;
  letter-spacing: 4rpx;
}

.update-version-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-top: 12rpx;
}

.update-version {
  padding: 4rpx 16rpx;
  font-size: 22rpx;
  color: #6d2229;
  letter-spacing: 1rpx;
  background: rgba(122, 47, 47, 0.1);
  border: 1rpx solid rgba(122, 47, 47, 0.22);
  border-radius: 8rpx;
}

.update-build {
  font-size: 22rpx;
  color: #a08a68;
  letter-spacing: 1rpx;
}

.update-body {
  margin: 0 40rpx;
  padding: 28rpx 28rpx 24rpx;
  border-radius: 16rpx;
  background: rgba(255, 253, 247, 0.85);
  border: 1rpx solid #e5d8bd;
}

.update-label {
  display: block;
  margin-bottom: 16rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #8a6d4b;
  letter-spacing: 3rpx;
}

.update-changelog {
  max-height: 280rpx;
}

.update-changelog-text {
  font-size: 28rpx;
  color: #5c4a38;
  line-height: 1.75;
  white-space: pre-wrap;
}

.update-actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 32rpx 40rpx 0;
}

.update-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  border-radius: 14rpx;
  transition: opacity 0.15s;
}

.update-btn:active {
  opacity: 0.82;
}

.update-btn-primary {
  background: linear-gradient(135deg, #8c2f39 0%, #6d2229 100%);
  box-shadow: 0 10rpx 28rpx rgba(109, 34, 41, 0.28);
}

.update-btn-ghost {
  background: transparent;
  border: 1rpx solid #c9a97a;
}

.update-btn-text {
  font-size: 30rpx;
  font-weight: 600;
  color: #f7eeda;
  letter-spacing: 4rpx;
}

.update-btn-text.ghost {
  color: #8a7355;
  font-weight: 500;
}

@keyframes mask-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(24rpx);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
