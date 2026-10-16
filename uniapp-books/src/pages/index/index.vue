<template>
  <view class="page">
    <update-modal />
    <interstitial-ad-host />
    <rewarded-video-ad-host />
    <view class="masthead">
      <text class="masthead-title">数维探索</text>
      <text class="masthead-sub">精选小说书单</text>
    </view>

    <view class="filter-card">
      <view class="filter-row">
        <text class="filter-label">分类</text>
        <picker
          class="filter-picker"
          mode="selector"
          :range="categoryOptions"
          @change="onCategoryChange"
        >
          <view class="picker-value">{{ selectedCategory || '全部分类' }}</view>
        </picker>
      </view>
      <view class="filter-row">
        <text class="filter-label">标签</text>
        <picker
          class="filter-picker"
          mode="selector"
          :range="tagOptions"
          @change="onTagChange"
        >
          <view class="picker-value">{{ selectedTag || '全部标签' }}</view>
        </picker>
      </view>
      <view class="filter-row search-row">
        <text class="filter-label">关键词</text>
        <view class="search-box">
          <input
            class="search-input"
            placeholder-class="search-placeholder"
            placeholder="书名、作者、简介"
            :value="keyword"
            confirm-type="search"
            @input="onKeywordInput"
            @confirm="onSearch"
          />
          <button class="search-btn" size="mini" @tap="onSearch">搜索</button>
        </view>
      </view>
    </view>



    <view v-if="list.length > 0" class="book-grid">
      <template v-for="(item, idx) in list" :key="item.id">
        <view
          class="book-card"
          :data-id="item.id"
          @tap="onBookTap(item.id)"
        >
          <view class="card-cover">
            <image class="cover-img" :src="item.cover" mode="aspectFill" lazy-load />
            <text class="category-badge">{{ item.category }}</text>
            <text v-if="item.latestChapter" class="chapter-badge">最新章节</text>
          </view>
          <view class="card-body">
            <text class="card-title">{{ item.title }}</text>
            <text class="card-author">{{ item.author }}</text>
            <text class="card-excerpt">{{ item.excerpt }}</text>
            <view class="card-tags">
              <text
                v-for="tag in item.tags"
                :key="tag.name"
                :class="['tag', `tag-${tag.type}`]"
              >{{ tag.name }}</text>
            </view>
            <text class="read-btn">查看详情</text>
          </view>
        </view>

        <view v-if="adAfterIndices.includes(idx)" class="feed-ad-wrap">
          <!-- #ifdef APP-PLUS -->
          <ad
            v-if="pageReady"
            class="index-feed-ad"
            :adpid="AD_FEED_PID"
            @load="onFeedAdLoad"
            @close="onFeedAdClose"
            @error="onFeedAdError"
          ></ad>
          <!-- #endif -->
          <!-- #ifndef APP-PLUS -->
          <view class="feed-ad-placeholder">
            <text class="feed-ad-ph-title">信息流广告位</text>
            <text class="feed-ad-ph-sub">APP 云打包后展示真实/测试广告</text>
          </view>
          <!-- #endif -->
        </view>
      </template>
    </view>

    <view v-else class="no-results">
      <text class="no-results-icon">📚</text>
      <text>暂无匹配的书籍</text>
      <text class="no-results-tip">请关注微信公众号「数维探索」留言你想找的书籍</text>
    </view>

    <app-tab-bar />
  </view>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { onReady, onShow, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import {
  meta,
  filterBooks,
  ensureBooksLoaded,
  onBooksChanged,
} from '@/utils/books';
import { APP_VERSION_NAME } from '@/utils/app-version';
import { checkAppUpdate } from '@/utils/app-update';
import UpdateModal from '@/components/UpdateModal.vue';
import InterstitialAdHost from '@/components/InterstitialAdHost.vue';
import RewardedVideoAdHost from '@/components/RewardedVideoAdHost.vue';
import { AD_FEED_PID } from '@/utils/ad-config';
import AppTabBar from '@/components/AppTabBar.vue';

// ============ 首页信息流广告事件 ============
function onFeedAdLoad(e) {
  console.log('[index-feed-ad] load', e);
}
function onFeedAdClose(e) {
  console.log('[index-feed-ad] close', e);
}
function onFeedAdError(e) {
  console.warn('[index-feed-ad] error', e);
}

const PAGE_SIZE = 40;
const appVersion = APP_VERSION_NAME;
const categories = meta.categories || [];
const tags = meta.tags || [];
const categoryOptions = ['全部分类', ...categories];
const tagOptions = ['全部标签', ...tags];

const list = ref([]);
// 广告穿插位置：存放书籍在 list 中的索引（0-based），该索引之后插入一条信息流广告
const adAfterIndices = ref([]);
const selectedCategory = ref('');
const selectedTag = ref('');
const keyword = ref('');
const pageReady = ref(false);

function isAppPlus() {
  if (typeof plus !== 'undefined') return true;
  try {
    return uni.getSystemInfoSync().uniPlatform === 'app';
  } catch {
    return false;
  }
}

function applyFilters() {
  const categoriesFilter = selectedCategory.value ? [selectedCategory.value] : [];
  const tagsFilter = selectedTag.value ? [selectedTag.value] : [];
  const filtered = filterBooks({
    categories: categoriesFilter,
    tags: tagsFilter,
    keyword: keyword.value,
  });
  list.value = filtered.slice(0, PAGE_SIZE);
  adAfterIndices.value = computeAdSlots(list.value.length);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 计算广告穿插位置：
// 第 1 个广告固定在第 4 本书之后（索引 3），
// 之后每隔 6~10 本随机穿插，且不会紧贴最后一本书。
function computeAdSlots(total) {
  const slots = [];
  if (total < 4) return slots;
  slots.push(3);
  let pos = 1;
  while (true) {
    const gap = randomInt(6, 10);
    const next = pos + gap;
    if (next >= total - 1) break;
    slots.push(next);
    pos = next;
  }
  return slots;
}

function onKeywordInput(e) {
  keyword.value = e.detail.value;
}

function onSearch() {
  applyFilters();
}

function onCategoryChange(e) {
  const idx = Number(e.detail.value);
  selectedCategory.value = idx === 0 ? '' : categories[idx - 1];
  applyFilters();
}

function onTagChange(e) {
  const idx = Number(e.detail.value);
  selectedTag.value = idx === 0 ? '' : tags[idx - 1];
  applyFilters();
}

function goDetail(id) {
  uni.navigateTo({ url: `/pages/detail/detail?id=${id}` });
}

function onBookTap(id) {
  // 已关闭点击时的插屏广告，直接跳转
  goDetail(id);
}

let versionChecking = false;

async function onVersionTap() {
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

onMounted(() => {
  ensureBooksLoaded().then(applyFilters);
});

let unsubscribeBooks = null;
unsubscribeBooks = onBooksChanged(() => {
  applyFilters();
});
onBeforeUnmount(() => {
  if (typeof unsubscribeBooks === 'function') unsubscribeBooks();
});

onReady(() => {
  pageReady.value = true;
});

onShow(() => {
  // showInterstitialAd(); // 已关闭首页进入自动展示广告
});

onShareAppMessage(() => {
  const filters = [selectedCategory.value, selectedTag.value, keyword.value].filter(Boolean);
  return {
    title: filters.length
      ? `数维探索 · ${filters.join(' / ')}`
      : '数维探索 · 精选小说书单',
    path: '/pages/index/index',
  };
});

onShareTimeline(() => {
  const filters = [selectedCategory.value, selectedTag.value, keyword.value].filter(Boolean);
  return {
    title: filters.length
      ? `数维探索 · ${filters.join(' / ')}`
      : '数维探索 · 精选小说书单',
  };
});
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding-bottom: 140rpx;
}

.page-top-bar {
  display: flex;
  justify-content: flex-end;
  padding: 20rpx 32rpx 0;
}

.version-badge {
  font-size: 22rpx;
  color: #8a7355;
  letter-spacing: 1rpx;
  padding: 6rpx 18rpx;
  border: 1rpx solid #ddcdae;
  border-radius: 8rpx;
  background: rgba(255, 253, 247, 0.92);
}

.version-badge:active {
  opacity: 0.75;
}

.masthead {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 44rpx 0 8rpx;
}

.masthead-title {
  position: relative;
  font-size: 46rpx;
  font-weight: 700;
  color: #4a3728;
  letter-spacing: 10rpx;
}

.masthead-title::after {
  content: '';
  position: absolute;
  bottom: -14rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 140rpx;
  height: 3rpx;
  background: #c9a97a;
}

.masthead-sub {
  margin-top: 30rpx;
  font-size: 24rpx;
  color: #8a7355;
  letter-spacing: 6rpx;
}

.filter-card {
  margin: 24rpx 32rpx;
  padding: 28rpx 28rpx 24rpx;
  background: linear-gradient(180deg, #fffaf0 0%, #f7eeda 100%);
  border: 1rpx solid #e0d0b2;
  border-left: 8rpx solid #7a2f2f;
  border-radius: 10rpx;
  box-shadow: 0 8rpx 22rpx rgba(122, 96, 58, 0.12);
}

.filter-row {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.filter-label {
  width: 120rpx;
  color: #8a6d4b;
  font-size: 26rpx;
  letter-spacing: 2rpx;
  flex-shrink: 0;
}

.filter-picker {
  flex: 1;
  min-width: 0;
}

.picker-value {
  padding: 16rpx 24rpx;
  background: #fdf9ef;
  border: 1rpx solid #ddcdae;
  border-radius: 8rpx;
  color: #43382d;
  font-size: 26rpx;
}

.search-row {
  align-items: center;
}

.search-box {
  flex: 1;
  display: flex;
  gap: 16rpx;
}

.search-input {
  flex: 1;
  padding: 16rpx 24rpx;
  background: #fdf9ef;
  border: 1rpx solid #ddcdae;
  border-radius: 8rpx;
  color: #43382d;
  font-size: 26rpx;
}

.search-placeholder {
  color: #b8a888;
}

.search-btn {
  background: linear-gradient(135deg, #8c2f39, #6d2229) !important;
  color: #f7eeda !important;
  border: none !important;
  border-radius: 8rpx !important;
  margin: 0 !important;
  padding: 0 28rpx !important;
  line-height: 64rpx !important;
  height: 64rpx !important;
  letter-spacing: 2rpx;
}

.book-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 24rpx;
}

.book-card {
  width: 49%;
  margin-bottom: 20rpx;
  background: #fffdf7;
  border: 1rpx solid #e5d8bd;
  border-radius: 8rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 18rpx rgba(122, 96, 58, 0.14);
}

.card-cover {
  position: relative;
  width: 100%;
  height: 320rpx;
  border-bottom: 1rpx solid #e5d8bd;
}

.cover-img {
  width: 100%;
  height: 100%;
  background: #efe3cb;
}

.category-badge {
  position: absolute;
  top: 12rpx;
  left: 12rpx;
  padding: 4rpx 14rpx;
  background: rgba(122, 47, 47, 0.92);
  color: #f7eeda;
  font-size: 20rpx;
  letter-spacing: 2rpx;
  border-radius: 6rpx;
}

.chapter-badge {
  position: absolute;
  bottom: 12rpx;
  right: 12rpx;
  z-index: 2;
  padding: 4rpx 14rpx;
  background: rgba(74, 55, 40, 0.85);
  color: #e8c976;
  font-size: 20rpx;
  border-radius: 6rpx;
}

.card-body {
  padding: 20rpx;
}

.card-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #3a2f24;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-author {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #8a7355;
}

.card-excerpt {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-top: 12rpx;
  font-size: 22rpx;
  color: #9c8a70;
  line-height: 1.6;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-top: 12rpx;
}

.tag {
  padding: 4rpx 12rpx;
  font-size: 20rpx;
  border-radius: 6rpx;
  border: 1rpx solid transparent;
}

.tag-purple {
  background: rgba(122, 47, 47, 0.1);
  color: #8c2f39;
  border-color: rgba(122, 47, 47, 0.25);
}

.tag-blue {
  background: rgba(74, 90, 60, 0.12);
  color: #4f6b41;
  border-color: rgba(74, 90, 60, 0.25);
}

.read-btn {
  display: inline-block;
  margin-top: 18rpx;
  padding: 8rpx 24rpx;
  background: linear-gradient(135deg, #8c2f39, #6d2229);
  color: #f7eeda;
  font-size: 22rpx;
  letter-spacing: 2rpx;
  border-radius: 6rpx;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 48rpx;
  color: #a08a68;
  text-align: center;
}

.no-results-icon {
  font-size: 80rpx;
  margin-bottom: 24rpx;
  opacity: 0.55;
}

.no-results-tip {
  margin-top: 20rpx;
  font-size: 32rpx;
  font-weight: 700;
  color: #6d2229;
  line-height: 1.8;
}

.index-feed-ad {
  width: 100%;
  display: block;
  margin: 8rpx 0;
}

/* 穿插广告容器：占满整行，使广告在双列网格中换行独立成行 */
.feed-ad-wrap {
  width: 100%;
}

.feed-ad-wrap .feed-ad-placeholder {
  width: 100%;
  margin: 16rpx 0;
}

/* App 端广告页调试标记，确认广告位位置（上线可删） */
.feed-ad-debug-tip {
  width: 100%;
  padding: 16rpx 32rpx;
  text-align: center;
  font-size: 22rpx;
  color: #a08a68;
  background: #fffaf0;
  border: 2rpx dashed #d9c9a3;
  border-radius: 12rpx;
  box-sizing: border-box;
}

/* 非 App 环境开发预览占位（App 云打包后由原生广告替换） */
.feed-ad-placeholder {
  width: auto;
  margin: 16rpx 32rpx;
  min-height: 200rpx;
  border: 2rpx dashed #d9c9a3;
  border-radius: 12rpx;
  background: #fffaf0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #a08a68;
}

.feed-ad-ph-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 12rpx;
}

.feed-ad-ph-sub {
  font-size: 22rpx;
}

</style>
