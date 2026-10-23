const { ensureLoaded, isFailed, getLastError, filterBooks, getMeta } = require('../../utils/books');

const MAX_DISPLAY = 60;
const HISTORY_KEY = 'search_history';
const HISTORY_MAX = 10;

Page({
  data: {
    keyword: '',
    list: [],
    loading: false,
    loadFailed: false,
    loadError: '',
    total: 0,
    searched: false,
    histories: [],
    categories: [],
    tags: [],
    categoryOptions: [],
    tagOptions: [],
    selectedCategory: '',
    selectedTag: '',
  },

  onLoad(options) {
    const kw = (options && options.keyword) || '';
    this.setData({ keyword: kw, histories: this._readHistory() });
    this._loadMeta(() => {
      if (kw) this.doSearch(kw);
    });
  },

  // 分类/标签选项来自 meta，与首页同源
  _loadMeta(done) {
    ensureLoaded()
      .then(() => {
        const meta = getMeta();
        this.setData(
          {
            categories: meta.categories || [],
            tags: meta.tags || [],
            categoryOptions: ['全部分类'].concat(meta.categories || []),
            tagOptions: ['全部标签'].concat(meta.tags || []),
          },
          () => done && done(),
        );
      })
      .catch(() => done && done());
  },

  onCategoryChange(e) {
    const idx = Number(e.detail.value);
    const selectedCategory = idx === 0 ? '' : this.data.categories[idx - 1];
    this.setData({ selectedCategory }, () => this.doSearch(this.data.keyword));
  },

  onTagChange(e) {
    const idx = Number(e.detail.value);
    const selectedTag = idx === 0 ? '' : this.data.tags[idx - 1];
    this.setData({ selectedTag }, () => this.doSearch(this.data.keyword));
  },

  _readHistory() {
    try {
      const v = wx.getStorageSync(HISTORY_KEY);
      return Array.isArray(v) ? v : [];
    } catch (e) {
      return [];
    }
  },

  _saveHistory(kw) {
    if (!kw) return;
    const next = this._readHistory().filter((k) => k !== kw);
    next.unshift(kw);
    const list = next.slice(0, HISTORY_MAX);
    try {
      wx.setStorageSync(HISTORY_KEY, list);
    } catch (e) {
      // 忽略
    }
    this.setData({ histories: list });
  },

  onInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  onClear() {
    this.setData({ keyword: '', list: [], total: 0, searched: false });
  },

  onSubmit() {
    this.doSearch(this.data.keyword);
  },

  doSearch(kw) {
    const keyword = (kw || '').trim();
    const { selectedCategory, selectedTag } = this.data;
    // 关键词与分类/标签都为空时不搜索
    if (!keyword && !selectedCategory && !selectedTag) {
      this.setData({ keyword: '', list: [], total: 0, searched: false, loading: false });
      return;
    }
    this.setData({ keyword, loading: true, loadFailed: false, loadError: '' });
    if (keyword) this._saveHistory(keyword);

    ensureLoaded()
      .then(() => {
        const filtered = filterBooks({
          categories: selectedCategory ? [selectedCategory] : [],
          tags: selectedTag ? [selectedTag] : [],
          keyword,
        });
        this.setData({
          loading: false,
          loadFailed: isFailed(),
          loadError: isFailed() ? getLastError() : '',
          list: filtered.slice(0, MAX_DISPLAY),
          total: filtered.length,
          searched: true,
        });
      })
      .catch(() => {
        this.setData({ loading: false, loadFailed: true, loadError: '书籍数据加载失败' });
      });
  },

  onHistoryTap(e) {
    const kw = e.currentTarget.dataset.kw;
    this.setData({ keyword: kw }, () => this.doSearch(kw));
  },

  onClearHistory() {
    try {
      wx.removeStorageSync(HISTORY_KEY);
    } catch (e) {
      // 忽略
    }
    this.setData({ histories: [] });
  },

  onCancel() {
    wx.navigateBack();
  },

  onBookTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  },
});
