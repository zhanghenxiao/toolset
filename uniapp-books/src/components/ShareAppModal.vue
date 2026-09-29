<template>
  <view v-if="visible" class="share-mask" @tap="onClose">
    <view class="share-card" @tap.stop>
      <view class="share-emoji">😊</view>
      <text class="share-title">分享APP</text>
      <text class="share-desc">分享内容已复制，快去发送给好友吧！</text>
      <view class="share-btn" @tap="onClose">
        <text>我知道了</text>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);

function onClose() {
  emit('close');
}
</script>

<style lang="scss" scoped>
.share-mask {
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48rpx;
  background: rgba(58, 47, 36, 0.45);
}

.share-card {
  width: 100%;
  max-width: 560rpx;
  padding: 56rpx 40rpx 40rpx;
  border-radius: 24rpx;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.share-emoji {
  font-size: 88rpx;
  line-height: 1;
  margin-bottom: 24rpx;
}

.share-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
  margin-bottom: 20rpx;
}

.share-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.7;
  margin-bottom: 40rpx;
}

.share-btn {
  width: 100%;
  height: 88rpx;
  border-radius: 44rpx;
  background: #4caf50;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
}

.share-btn:active {
  opacity: 0.88;
}
</style>
