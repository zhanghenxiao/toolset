<template>
  <view v-if="book" class="detail-page">
    <view class="hero">
      <image class="hero-cover" :src="book.cover" mode="aspectFill" />
      <view class="hero-info">
        <text class="hero-title">{{ book.title }}</text>
        <text class="hero-author">作者：{{ book.author }}</text>
        <view class="hero-meta">
          <text class="meta-item">{{ book.category }}</text>
          <text class="meta-item">{{ book.status }}</text>
          <text class="meta-item">{{ book.chapters }}</text>
        </view>
        <view class="hero-tags">
          <text
            v-for="tag in book.tags"
            :key="tag.name"
            :class="['tag', `tag-${tag.type}`]"
          >{{ tag.name }}</text>
        </view>
      </view>
    </view>
 <!-- @tap="onLatestChapterTap" -->
    <view v-if="book.latestChapter" class="section section-latest">
      <text class="section-title">最新章节</text>
      <text class="section-content latest">{{ book.latestChapter }}</text>
    </view>

    <view class="section">
      <text class="section-title">简介</text>
      <text class="section-content">{{ book.excerpt }}</text>
    </view>

    <view class="actions">
      <!-- <button class="action-btn primary" @tap="onStartRead">开始阅读</button> -->
      <button class="action-btn  primary" @tap="onOpenReadUrl">在浏览器打开阅读</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { getBookById } from '@/utils/books';
import { copyQuarkReadUrl, onLatestChapterTap as handleLatestChapterTap } from '@/utils/read-url';

const book = ref(null);

onLoad((options) => {
  const found = getBookById(options.id);
  if (!found) {
    uni.showToast({ title: '书籍不存在', icon: 'none' });
    setTimeout(() => uni.navigateBack(), 1500);
    return;
  }
  uni.setNavigationBarTitle({ title: found.title });
  book.value = found;
});

function onStartRead() {
  if (!book.value) return;
  copyQuarkReadUrl(book.value.readUrl);
}

function onOpenReadUrl() {
  if (!book.value) return;
  if (!book.value.readUrl) {
    uni.showToast({ title: '暂无阅读链接', icon: 'none' });
    return;
  }
  uni.setClipboardData({
    data: book.value.readUrl,
    success: () => {
      uni.showModal({
        title: '在浏览器打开',
        content: '阅读链接已复制，请打开浏览器粘贴访问。',
        showCancel: false,
        confirmText: '知道了',
      });
    },
    fail: () => uni.showToast({ title: '复制失败，请重试', icon: 'none' }),
  });
}

function onLatestChapterTap() {
  if (!book.value) return;
  handleLatestChapterTap(book.value.id, book.value.readUrl);
}

onShareAppMessage(() => {
  if (!book.value) {
    return {
      title: '数维探索 · 精选小说书单',
      path: '/pages/index/index',
    };
  }
  return {
    title: `${book.value.title} · ${book.value.author}`,
    path: `/pages/detail/detail?id=${book.value.id}`,
    imageUrl: book.value.cover,
  };
});

onShareTimeline(() => {
  if (!book.value) {
    return { title: '数维探索 · 精选小说书单' };
  }
  return {
    title: `${book.value.title} · ${book.value.author}`,
    query: `id=${book.value.id}`,
    imageUrl: book.value.cover,
  };
});
</script>

<style lang="scss" scoped>
@use './detail.scss';
</style>
