<template>
  <view class="page">
    <view class="page-top-bar">
      <view class="version-badge" @tap="onVersionTap">
        <text>v{{ appVersion }}</text>
      </view>
    </view>
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
      <view
        v-for="item in list"
        :key="item.id"
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
    </view>

    <view v-else class="no-results">
      <text class="no-results-icon">📚</text>
      <text>暂无匹配的书籍</text>
      <text class="no-results-tip">请关注微信公众号「数维探索」留言你想找的书籍</text>
    </view>

    <view v-if="totalPages > 1" class="pagination">
      <button
        class="page-btn"
        size="mini"
        :disabled="currentPage <= 1"
        @tap="onPrevPage"
      >上一页</button>
      <text class="page-info">{{ currentPage }} / {{ totalPages }}</text>
      <button
        class="page-btn"
        size="mini"
        :disabled="currentPage >= totalPages"
        @tap="onNextPage"
      >下一页</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { meta, filterBooks } from '@/utils/books';
import { APP_VERSION_NAME } from '@/utils/app-version';
import { checkAppUpdate } from '@/utils/app-update';

const PAGE_SIZE = 10;
const appVersion = APP_VERSION_NAME;

const categories = meta.categories || [];
const tags = meta.tags || [];
const categoryOptions = ['全部分类', ...categories];
const tagOptions = ['全部标签', ...tags];

const list = ref([]);
const selectedCategory = ref('');
const selectedTag = ref('');
const keyword = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const totalFiltered = ref(0);
let filteredCache = [];

function applyFilters() {
  const categoriesFilter = selectedCategory.value ? [selectedCategory.value] : [];
  const tagsFilter = selectedTag.value ? [selectedTag.value] : [];
  const filtered = filterBooks({
    categories: categoriesFilter,
    tags: tagsFilter,
    keyword: keyword.value,
  });
  filteredCache = filtered;
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (currentPage.value > pages) currentPage.value = pages;
  const start = (currentPage.value - 1) * PAGE_SIZE;
  list.value = filtered.slice(start, start + PAGE_SIZE);
  totalFiltered.value = filtered.length;
  totalPages.value = pages;
}

function onKeywordInput(e) {
  keyword.value = e.detail.value;
}

function onSearch() {
  currentPage.value = 1;
  applyFilters();
}

function onCategoryChange(e) {
  const idx = Number(e.detail.value);
  selectedCategory.value = idx === 0 ? '' : categories[idx - 1];
  currentPage.value = 1;
  applyFilters();
}

function onTagChange(e) {
  const idx = Number(e.detail.value);
  selectedTag.value = idx === 0 ? '' : tags[idx - 1];
  currentPage.value = 1;
  applyFilters();
}

function onPrevPage() {
  if (currentPage.value <= 1) return;
  currentPage.value -= 1;
  applyFilters();
}

function onNextPage() {
  if (currentPage.value >= totalPages.value) return;
  currentPage.value += 1;
  applyFilters();
}

function onBookTap(id) {
  uni.navigateTo({ url: `/pages/detail/detail?id=${id}` });
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
  applyFilters();
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
  padding-bottom: 60rpx;
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

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32rpx;
  margin-top: 48rpx;
  padding: 0 32rpx;
}

.page-btn {
  background: #fffdf7 !important;
  color: #6d2229 !important;
  border: 1rpx solid #c9a97a !important;
  border-radius: 8rpx !important;
  letter-spacing: 2rpx;
}

.page-btn[disabled] {
  color: #c3b295 !important;
  border-color: #e5d8bd !important;
}

.page-info {
  font-size: 26rpx;
  color: #8a7355;
  letter-spacing: 2rpx;
}
</style>
