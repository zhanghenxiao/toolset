const { books, meta, filterBooks } = require('../../utils/books');

const PAGE_SIZE = 10;

Page({
  data: {
    allBooks: books,
    list: [],
    categories: meta.categories,
    tags: meta.tags,
    categoryOptions: [],
    tagOptions: [],
    totalDisplay: meta.totalDisplay,
    site: meta.site,
    selectedCategory: '',
    selectedTag: '',
    keyword: '',
    currentPage: 1,
    totalPages: 1,
    totalFiltered: 0,
    hasFilters: false,
  },

  onLoad() {
    const categories = this.data.categories || [];
    const tags = this.data.tags || [];
    this.setData(
      {
        categoryOptions: ['全部分类'].concat(categories),
        tagOptions: ['全部标签'].concat(tags),
      },
      () => this.applyFilters(),
    );
  },

  applyFilters() {
    const { keyword, selectedCategory, selectedTag } = this.data;
    const categories = selectedCategory ? [selectedCategory] : [];
    const tags = selectedTag ? [selectedTag] : [];
    const filtered = filterBooks({ categories, tags, keyword });
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(this.data.currentPage, totalPages);
    const start = (currentPage - 1) * PAGE_SIZE;
    const list = filtered.slice(start, start + PAGE_SIZE);

    this.setData({
      list,
      totalFiltered: filtered.length,
      totalPages,
      currentPage,
      hasFilters: !!(keyword || selectedCategory || selectedTag),
      _filtered: filtered,
    });
  },

  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  onSearch() {
    this.setData({ currentPage: 1 }, () => this.applyFilters());
  },

  onCategoryChange(e) {
    const idx = Number(e.detail.value);
    const selectedCategory = idx === 0 ? '' : this.data.categories[idx - 1];
    this.setData({ selectedCategory, currentPage: 1 }, () => this.applyFilters());
  },

  onTagChange(e) {
    const idx = Number(e.detail.value);
    const selectedTag = idx === 0 ? '' : this.data.tags[idx - 1];
    this.setData({ selectedTag, currentPage: 1 }, () => this.applyFilters());
  },

  onClearFilters() {
    this.setData({
      keyword: '',
      selectedCategory: '',
      selectedTag: '',
      currentPage: 1,
    }, () => this.applyFilters());
  },

  onPrevPage() {
    if (this.data.currentPage <= 1) return;
    this.setData({ currentPage: this.data.currentPage - 1 }, () => this.applyFilters());
  },

  onNextPage() {
    if (this.data.currentPage >= this.data.totalPages) return;
    this.setData({ currentPage: this.data.currentPage + 1 }, () => this.applyFilters());
  },

  onBookTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  },

  onOpenSite() {
    wx.setClipboardData({
      data: this.data.site,
      success: () => wx.showToast({ title: '网址已复制', icon: 'success' }),
    });
  },
});
