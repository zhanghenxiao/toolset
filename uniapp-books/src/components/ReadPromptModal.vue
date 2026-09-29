<template>
  <view v-if="state.visible" class="read-mask" @tap.stop="onMaskTap">
    <view class="read-card" @tap.stop>
      <view class="read-accent" />
      <view class="read-header">
        <view :class="['read-icon-wrap', state.type]">
          <text class="read-icon">{{ state.type === 'success' ? '✓' : '▶' }}</text>
        </view>
        <view class="read-title-wrap">
          <text class="read-title">{{ state.title }}</text>
          <text v-if="state.hint" class="read-hint">{{ state.hint }}</text>
        </view>
      </view>

      <view class="read-body">
        <text class="read-content">{{ state.content }}</text>
        <view v-if="state.steps.length" class="read-steps">
          <view
            v-for="(step, index) in state.steps"
            :key="index"
            class="read-step"
          >
            <view class="read-step-num">
              <text class="read-step-num-text">{{ index + 1 }}</text>
            </view>
            <text class="read-step-text">{{ step }}</text>
          </view>
        </view>
      </view>

      <view class="read-actions">
        <view class="read-btn read-btn-primary" @tap="onConfirm">
          <text class="read-btn-text">{{ state.confirmText }}</text>
        </view>
        <view
          v-if="state.showCancel"
          class="read-btn read-btn-ghost"
          @tap="onCancel"
        >
          <text class="read-btn-text ghost">{{ state.cancelText }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import {
  readPromptState,
  confirmReadPrompt,
  cancelReadPrompt,
} from '@/utils/read-prompt';

const state = readPromptState;

function onConfirm() {
  confirmReadPrompt();
}

function onCancel() {
  cancelReadPrompt();
}

function onMaskTap() {
  if (state.showCancel) {
    cancelReadPrompt();
  }
}
</script>

<style lang="scss" scoped>
.read-mask {
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48rpx;
  background: rgba(58, 47, 36, 0.52);
  backdrop-filter: blur(6px);
  animation: mask-in 0.28s ease;
}

.read-card {
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

.read-accent {
  height: 6rpx;
  background: linear-gradient(90deg, #7a2f2f 0%, #c9a97a 50%, #7a2f2f 100%);
}

.read-header {
  display: flex;
  align-items: flex-start;
  gap: 28rpx;
  padding: 40rpx 40rpx 24rpx;
}

.read-icon-wrap {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 10rpx 24rpx rgba(109, 34, 41, 0.28);
}

.read-icon-wrap.confirm {
  background: linear-gradient(145deg, #8c2f39 0%, #6d2229 100%);
}

.read-icon-wrap.success {
  background: linear-gradient(145deg, #4f6b41 0%, #3d5533 100%);
  box-shadow: 0 10rpx 24rpx rgba(61, 85, 51, 0.28);
}

.read-icon {
  font-size: 40rpx;
  font-weight: 700;
  color: #f7eeda;
  line-height: 1;
}

.read-icon-wrap.confirm .read-icon {
  transform: translateX(4rpx);
}

.read-title-wrap {
  flex: 1;
  min-width: 0;
  padding-top: 8rpx;
}

.read-title {
  display: block;
  font-size: 38rpx;
  font-weight: 700;
  color: #4a3728;
  letter-spacing: 3rpx;
  line-height: 1.35;
}

.read-hint {
  display: block;
  margin-top: 12rpx;
  font-size: 22rpx;
  color: #a08a68;
  letter-spacing: 1rpx;
}

.read-body {
  margin: 0 40rpx;
  padding: 28rpx 28rpx 24rpx;
  border-radius: 16rpx;
  background: rgba(255, 253, 247, 0.85);
  border: 1rpx solid #e5d8bd;
}

.read-content {
  display: block;
  font-size: 28rpx;
  color: #5c4a38;
  line-height: 1.75;
}

.read-steps {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1rpx dashed #dccdb2;
}

.read-step {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.read-step-num {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(122, 47, 47, 0.1);
  border: 1rpx solid rgba(122, 47, 47, 0.2);
}

.read-step-num-text {
  font-size: 22rpx;
  font-weight: 700;
  color: #6d2229;
  line-height: 1;
}

.read-step-text {
  flex: 1;
  font-size: 26rpx;
  color: #5c4a38;
  line-height: 1.5;
}

.read-actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 32rpx 40rpx 0;
}

.read-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  border-radius: 14rpx;
  transition: opacity 0.15s;
}

.read-btn:active {
  opacity: 0.82;
}

.read-btn-primary {
  background: linear-gradient(135deg, #8c2f39 0%, #6d2229 100%);
  box-shadow: 0 10rpx 28rpx rgba(109, 34, 41, 0.28);
}

.read-btn-ghost {
  background: transparent;
  border: 1rpx solid #c9a97a;
}

.read-btn-text {
  font-size: 30rpx;
  font-weight: 600;
  color: #f7eeda;
  letter-spacing: 4rpx;
}

.read-btn-text.ghost {
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
