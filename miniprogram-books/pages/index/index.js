const {
  ensureLoaded,
  reload,
  isFailed,
  getLastError,
  onDataChange,
  getMeta,
  filterBooks,
  getBookById,
} = require('../../utils/books');
const { copyQuarkReadUrl } = require('../../utils/read-url');
const { showRewardedAd } = require('../../utils/ad');

const MAX_DISPLAY = 40;

// Fisher-Yates 原地打乱
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

Page({
  data: {
    list: [],
    loading: true,
    loadFailed: false,
    loadError: '',
    categories: [],
    tags: [],
    categoryOptions: [],
    tagOptions: [],
    totalDisplay: 0,
    site: 'https://toolset.site',
    selectedCategory: '',
    selectedTag: '',
    keyword: '',
    totalFiltered: 0,
    hasFilters: false,
  },

  onLoad() {
    this.renderData();
    // 本地缓存先渲染，后台发现云端有新数据时自动刷新列表
    this._offDataChange = onDataChange(() => this.renderData());
  },

  onUnload() {
    if (this._offDataChange) this._offDataChange();
  },

  onRetry() {
    this.setData({ loading: true, loadFailed: false, loadError: '' }, () => {
      reload().then(() => this.renderData());
    });
  },

  renderData() {
    ensureLoaded().then(() => {
      const meta = getMeta();
      this.setData(
        {
          loading: false,
          loadFailed: isFailed(),
          loadError: isFailed() ? getLastError() : '',
          categories: meta.categories,
          tags: meta.tags,
          categoryOptions: ['全部分类'].concat(meta.categories),
          tagOptions: ['全部标签'].concat(meta.tags),
          totalDisplay: meta.totalDisplay,
          site: meta.site,
        },
        () => this.applyFilters(),
      );
    });
  },

  applyFilters() {
    const { keyword, selectedCategory, selectedTag } = this.data;
    const categories = selectedCategory ? [selectedCategory] : [];
    const tags = selectedTag ? [selectedTag] : [];
    const filtered = filterBooks({ categories, tags, keyword });
    // 随机展示 MAX_DISPLAY 本（过滤后打乱再截断）
    const list = filtered.length > MAX_DISPLAY
      ? shuffle(filtered).slice(0, MAX_DISPLAY)
      : filtered.slice();

    this.setData({
      list,
      totalFiltered: filtered.length,
      hasFilters: !!(keyword || selectedCategory || selectedTag),
      _filtered: filtered,
    });
  },

  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  onSearch() {
    this.applyFilters();
  },

  onCategoryChange(e) {
    const idx = Number(e.detail.value);
    const selectedCategory = idx === 0 ? '' : this.data.categories[idx - 1];
    this.setData({ selectedCategory }, () => this.applyFilters());
  },

  onTagChange(e) {
    const idx = Number(e.detail.value);
    const selectedTag = idx === 0 ? '' : this.data.tags[idx - 1];
    this.setData({ selectedTag }, () => this.applyFilters());
  },

  onClearFilters() {
    this.setData({
      keyword: '',
      selectedCategory: '',
      selectedTag: '',
    }, () => this.applyFilters());
  },

  onBookTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  },

  onLatestChapterTap(e) {
    const { id } = e.currentTarget.dataset;
    const book = getBookById(id);
    if (!book) {
      wx.showToast({ title: '书籍不存在', icon: 'none' });
      return;
    }
    if (!book.readUrl) {
      wx.showToast({ title: '暂无网盘分享链接', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '加载广告中...', mask: true });
    showRewardedAd()
      .then(() => copyQuarkReadUrl(book.readUrl))
      .catch((err) => {
        console.error('激励视频广告失败', err);
        const msg = err && err.message === '观看未完成'
          ? '需要看完广告才能获取链接'
          : '广告暂不可用，请稍后再试';
        wx.showToast({ title: msg, icon: 'none' });
      })
      .finally(() => wx.hideLoading());
  },

  onOpenSite() {
    wx.setClipboardData({
      data: this.data.site,
      success: () => wx.showToast({ title: '网址已复制', icon: 'success' }),
    });
  },

  onShareAppMessage() {
    const { selectedCategory, selectedTag, keyword } = this.data;
    const filters = [selectedCategory, selectedTag, keyword].filter(Boolean);
    return {
      title: filters.length
        ? `数维探索 · ${filters.join(' / ')}`
        : '数维探索 · 精选小说书单',
      path: '/pages/index/index',
    };
  },

  onShareTimeline() {
    const { selectedCategory, selectedTag, keyword } = this.data;
    const filters = [selectedCategory, selectedTag, keyword].filter(Boolean);
    return {
      title: filters.length
        ? `数维探索 · ${filters.join(' / ')}`
        : '数维探索 · 精选小说书单',
    };
  },
});
