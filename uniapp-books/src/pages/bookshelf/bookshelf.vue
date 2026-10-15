<template>
  <view class="page">
    <view class="page-header">
      <text class="page-title">我的书架</text>
      <text class="page-subtitle">共保存 · {{ shelfBooks.length }} 本</text>
    </view>

    <view v-if="shelfBooks.length" class="book-list">
      <view v-for="item in shelfBooks" :key="item.id" class="book-card">
        <image class="book-cover" :src="item.book.cover" mode="aspectFill" />
        <view class="book-info">
          <text class="book-title">{{ item.book.title }}</text>
          <text class="book-author">{{ item.book.author }}</text>
          <text class="book-progress">{{ item.progressText }}</text>
          <view class="book-actions">
            <button class="read-button" @tap="continueReading(item.book)">
              {{ item.book.onlineReadable ? '继续阅读' : '查看详情' }}
            </button>
            <button class="remove-button" @tap="removeBook(item.book.id)">移出书架</button>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="empty-state">
      <text class="empty-icon">▣</text>
      <text class="empty-title">书架还是空的</text>
      <text class="empty-tip">在阅读页面点击"加入书架"，书籍会保存在书架中</text>
      <button class="browse-button" @tap="goHome">去发现书籍</button>
    </view>

    <!-- 自定义移出书架确认弹窗 -->
    <view v-if="showRemoveDialog" class="dialog-mask" @tap="cancelRemove">
      <view class="dialog-content" @tap.stop>
        <view class="dialog-header">
          <text class="dialog-icon">⚠</text>
          <text class="dialog-title">移出书架</text>
        </view>
        <text class="dialog-message">确定要将这本书移出书架吗？</text>
        <view class="dialog-actions">
          <button class="dialog-btn cancel-btn" @tap="cancelRemove">取消</button>
          <button class="dialog-btn confirm-btn" @tap="confirmRemove">确定</button>
        </view>
      </view>
    </view>

    <app-tab-bar />
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import AppTabBar from '@/components/AppTabBar.vue';
import { ensureBooksLoaded, getBookById } from '@/utils/books';
import { getBookshelf, getReadingProgress, removeFromBookshelf } from '@/utils/bookshelf';
import { getReadMode, getRemoteConfig } from '@/utils/remote-config';

const shelfBooks = ref([]);
const showRemoveDialog = ref(false);
const bookToRemove = ref(null);
const readMode = ref(getReadMode());

function formatProgress(book, progress) {
  if (!progress || !progress.chapterNum) return book.onlineReadable ? '尚未开始阅读' : '在线阅读暂不可用';
  return `读到第 ${progress.chapterNum} 章`;
}

async function loadShelf() {
  await ensureBooksLoaded();
  shelfBooks.value = getBookshelf()
    .map((item) => {
      const book = getBookById(item.id);
      if (!book) return null;
      return {
        ...item,
        book,
        progressText: formatProgress(book, getReadingProgress(book.id)),
      };
    })
    .filter(Boolean);
}

function continueReading(book) {
  // readMode='link' 时不支持在线阅读，直接去详情页
  const canOnlineRead = book.onlineReadable && readMode.value !== 'link';
  if (canOnlineRead) {
    uni.navigateTo({ url: `/pages/reader/reader?bookId=${book.id}` });
  } else {
    uni.navigateTo({ url: `/pages/detail/detail?id=${book.id}` });
  }
}

function removeBook(bookId) {
  bookToRemove.value = bookId;
  showRemoveDialog.value = true;
}

function cancelRemove() {
  showRemoveDialog.value = false;
  bookToRemove.value = null;
}

function confirmRemove() {
  if (bookToRemove.value) {
    removeFromBookshelf(bookToRemove.value);
    loadShelf();
  }
  showRemoveDialog.value = false;
  bookToRemove.value = null;
}

function goHome() {
  uni.reLaunch({ url: '/pages/index/index' });
}

onShow(() => {
  loadShelf();
  getRemoteConfig().then(config => {
    if (config.readMode) readMode.value = config.readMode;
  });
});
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 36rpx 28rpx 180rpx;
  box-sizing: border-box;
  background: #f7f1e6;
  color: #4a3728;
}

.page-header {
  margin-bottom: 28rpx;
}

.page-title {
  display: block;
  font-size: 44rpx;
  font-weight: 700;
}

.page-subtitle {
  display: block;
  margin-top: 8rpx;
  color: #9b836b;
  font-size: 24rpx;
}

.book-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.book-card {
  display: flex;
  padding: 22rpx;
  border: 1rpx solid #eadcc5;
  border-radius: 18rpx;
  background: rgba(255, 253, 247, 0.96);
  box-shadow: 0 8rpx 24rpx rgba(74, 55, 40, 0.06);
}

.book-cover {
  width: 150rpx;
  height: 210rpx;
  flex-shrink: 0;
  border-radius: 10rpx;
  background: #eadcc5;
}

.book-info {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: 22rpx;
}

.book-title {
  overflow: hidden;
  color: #4a3728;
  font-size: 32rpx;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-author,
.book-progress {
  margin-top: 12rpx;
  color: #92785f;
  font-size: 24rpx;
}

.book-actions {
  display: flex;
  gap: 14rpx;
  margin-top: auto;
  padding-top: 20rpx;
}

.read-button,
.remove-button,
.browse-button {
  margin: 0;
  border-radius: 999rpx;
  font-size: 24rpx;
  line-height: 64rpx;
}

.read-button {
  flex: 1;
  color: #fff;
  background: #8b3039;
}

.remove-button {
  padding: 0 18rpx;
  color: #8b3039;
  background: #f8e8e5;
}

.empty-state {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 180rpx 40rpx 80rpx;
  text-align: center;
}

.empty-icon {
  color: #b79b7b;
  font-size: 96rpx;
}

.empty-title {
  margin-top: 28rpx;
  color: #604836;
  font-size: 34rpx;
  font-weight: 700;
}

.empty-tip {
  margin-top: 18rpx;
  color: #9b836b;
  font-size: 26rpx;
  line-height: 1.6;
}

.browse-button {
  margin-top: 42rpx;
  padding: 0 44rpx;
  color: #fff;
  background: #8b3039;
}

/* ============ 自定义弹窗样式 ============ */
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.dialog-content {
  width: 560rpx;
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 12rpx 48rpx rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(40rpx);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.dialog-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx 40rpx 24rpx;
  background: linear-gradient(135deg, #f7f1e6 0%, #ffffff 100%);
}

.dialog-icon {
  font-size: 64rpx;
  color: #d9534f;
  margin-bottom: 16rpx;
}

.dialog-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #4a3728;
}

.dialog-message {
  display: block;
  padding: 32rpx 40rpx;
  font-size: 28rpx;
  color: #705845;
  line-height: 1.6;
  text-align: center;
}

.dialog-actions {
  display: flex;
  border-top: 1rpx solid #e5d8bd;
}

.dialog-btn {
  flex: 1;
  margin: 0;
  padding: 0;
  height: 96rpx;
  line-height: 96rpx;
  font-size: 30rpx;
  border: none;
  border-radius: 0;
  background: transparent;
  transition: all 0.2s ease;
}

.dialog-btn::after {
  border: none;
}

.cancel-btn {
  color: #8b7355;
  border-right: 1rpx solid #e5d8bd;
}

.cancel-btn:active {
  background: #f7f1e6;
}

.confirm-btn {
  color: #d9534f;
  font-weight: 600;
}

.confirm-btn:active {
  background: #fff5f5;
}
</style>
