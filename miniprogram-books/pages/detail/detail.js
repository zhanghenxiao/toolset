const { ensureLoaded, isFailed, onDataChange, getBookById } = require('../../utils/books');
const { copyQuarkReadUrl } = require('../../utils/read-url');

const DOUBLE_TAP_MS = 450;

Page({
  data: {
    book: null,
  },

  onLoad(options) {
    this._bookId = options.id;
    this._missingNotified = false;
    this.renderBook();
    // 本地缓存先渲染，后台发现云端有新数据时自动刷新
    this._offDataChange = onDataChange(() => this.renderBook());
  },

  onUnload() {
    if (this._offDataChange) this._offDataChange();
  },

  renderBook() {
    ensureLoaded().then(() => {
      const book = getBookById(this._bookId);
      if (!book) {
        if (this._missingNotified) return;
        this._missingNotified = true;
        if (isFailed()) {
          // 数据没拉下来，不是书籍不存在，留在本页等待重试
          wx.showToast({ title: '书卷加载失败，请稍后重试', icon: 'none' });
          return;
        }
        wx.showToast({ title: '书籍不存在', icon: 'none' });
        setTimeout(() => wx.navigateBack(), 1500);
        return;
      }
      wx.setNavigationBarTitle({ title: book.title });
      this.setData({ book });
    });
  },

  onStartRead() {
    const { book } = this.data;
    if (!book) return;
    copyQuarkReadUrl(book.readUrl);
  },

  copyReadUrlWithModal(title) {
    const { book } = this.data;
    if (!book) return;
    if (!book.readUrl) {
      wx.showToast({ title: '暂无网盘分享链接', icon: 'none' });
      return;
    }
    wx.setClipboardData({
      data: book.readUrl,
      success: () => {
        wx.showModal({
          title,
          content: '阅读链接已复制，请打开浏览器粘贴访问。',
          showCancel: false,
          confirmText: '知道了',
        });
      },
      fail: () => wx.showToast({ title: '复制失败，请重试', icon: 'none' }),
    });
  },

  onOpenReadUrl() {
    this.copyReadUrlWithModal('在浏览器打开');
  },

  onLatestChapterTap() {
    const now = Date.now();
    const lastTap = this._latestTapAt || 0;
    if (lastTap && now - lastTap < DOUBLE_TAP_MS) {
      this._latestTapAt = 0;
      this.copyReadUrlWithModal('网盘分享链接');
      return;
    }
    this._latestTapAt = now;
  },

  onShareAppMessage() {
    const { book } = this.data;
    if (!book) {
      return {
        title: '数维探索 · 精选小说书单',
        path: '/pages/index/index',
      };
    }
    return {
      title: `${book.title} · ${book.author}`,
      path: `/pages/detail/detail?id=${book.id}`,
      imageUrl: book.cover,
    };
  },

  onShareTimeline() {
    const { book } = this.data;
    if (!book) {
      return { title: '数维探索 · 精选小说书单' };
    }
    return {
      title: `${book.title} · ${book.author}`,
      query: `id=${book.id}`,
      imageUrl: book.cover,
    };
  },
});
