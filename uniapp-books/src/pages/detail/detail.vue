<template>
  <view class="detail-container">
    <update-modal />
    <read-prompt-modal />
    <rewarded-video-ad-host v-if="needLocalRewardHost" />
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
      <button
        v-if="showOnlineRead"
        class="action-btn"
        :class="{ primary: readMode !== 'link' }"
        @tap="onStartOnlineRead"
      >
        在线阅读
      </button>
      <button
        v-if="showBrowserRead"
        class="action-btn"
        :class="{ primary: readMode === 'link' }"
        :loading="readLoading"
        @tap="onOpenReadUrl"
      >
        在浏览器打开阅读
      </button>
    </view>
  </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import UpdateModal from '@/components/UpdateModal.vue';
import ReadPromptModal from '@/components/ReadPromptModal.vue';
import RewardedVideoAdHost from '@/components/RewardedVideoAdHost.vue';
import { getBookById, ensureBooksLoaded, onBooksChanged } from '@/utils/books';
import { promptWatchAdThenCopyReadUrl, onLatestChapterTap as handleLatestChapterTap } from '@/utils/read-url';
import { getReadMode, getRemoteConfig } from '@/utils/remote-config';

const book = ref(null);
const readLoading = ref(false);
const needLocalRewardHost = ref(false);
const readMode = ref(getReadMode());

const pendingId = ref(null);

// readMode: 'all' → 同时显示在线阅读 + 浏览器打开
//          'online' → 只显示在线阅读
//          'link' → 只显示在浏览器打开
const showOnlineRead = computed(() => {
  return book.value?.onlineReadable && readMode.value !== 'link';
});
const showBrowserRead = computed(() => {
  return readMode.value !== 'online';
});

function refreshBook() {
  if (pendingId.value === null) return;
  const found = getBookById(pendingId.value);
  if (!found) {
    book.value = null;
    return;
  }
  book.value = found;
  if (found.title) uni.setNavigationBarTitle({ title: found.title });
}

let unsubscribeBooks = null;

onMounted(() => {
  // 从分享直达详情时没有首页栈，需本地挂载激励组件
  needLocalRewardHost.value = getCurrentPages().length <= 1;
  unsubscribeBooks = onBooksChanged(refreshBook);
  // 异步刷新远程 readMode 配置
  getRemoteConfig().then(config => {
    if (config.readMode) readMode.value = config.readMode;
  });
});

onBeforeUnmount(() => {
  if (typeof unsubscribeBooks === 'function') unsubscribeBooks();
});

onLoad(async (options) => {
  pendingId.value = options && options.id !== undefined ? options.id : null;
  await ensureBooksLoaded();
  if (pendingId.value === null || pendingId.value === undefined) {
    uni.showToast({ title: '书籍不存在', icon: 'none' });
    setTimeout(() => uni.navigateBack(), 1500);
    return;
  }
  refreshBook();
  if (!book.value) {
    uni.showToast({ title: '书籍不存在', icon: 'none' });
    setTimeout(() => uni.navigateBack(), 1500);
  }
});

// 在线阅读
function onStartOnlineRead() {
  if (!book.value) return;
  uni.navigateTo({
    url: `/pages/reader/reader?bookId=${book.value.id}`
  });
}

async function onOpenReadUrl() {
  if (!book.value || readLoading.value) return;
  readLoading.value = true;
  try {
    await promptWatchAdThenCopyReadUrl(book.value.readUrl, book.value.id);
  } finally {
    readLoading.value = false;
  }
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
