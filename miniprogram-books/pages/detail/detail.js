const { ensureLoaded, reload, isFailed, getLastError, onDataChange, getBookById } = require('../../utils/books');
const { copyQuarkReadUrl } = require('../../utils/read-url');
const { showRewardedAd } = require('../../utils/ad');
const { openReader } = require('../../utils/navigate-reader');
const { startReadEnabled } = require('../../utils/config');
const { getStartReadEnabled } = require('../../utils/remote-config');

Page({
  data: {
    book: null,
    // loading | failed | missing | ok
    status: 'loading',
    // 是否显示「开始阅读」按钮（按 envVersion 配置）
    startReadEnabled: startReadEnabled(),
  },

  onLoad(options) {
    this._bookId = options.id;
    this._missingNotified = false;
    // 先用本地环境配置渲染，云端开关返回后再校正
    getStartReadEnabled().then((v) => {
      if (v !== this.data.startReadEnabled) this.setData({ startReadEnabled: !!v });
    });
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
        if (isFailed()) {
          // 数据没拉下来，展示失败视图供重试，而不是空白页
          this.setData({ status: 'failed' });
          return;
        }
        this.setData({ status: 'missing' });
        wx.showToast({ title: '书籍不存在', icon: 'none' });
        setTimeout(() => wx.navigateBack(), 1500);
        return;
      }
      wx.setNavigationBarTitle({ title: book.title });
      this.setData({ book, status: 'ok' });
    });
  },

  onRetry() {
    this.setData({ status: 'loading' }, () => {
      reload().then(() => this.renderBook());
    });
  },

  onStartRead() {
    const { book } = this.data;
    if (!book) return;
    if (!book.readUrl) {
      wx.showToast({ title: '该书暂不支持在线阅读', icon: 'none' });
      return;
    }
    openReader(book.id);
  },

  copyReadUrlWithModal(title) {
    const { book } = this.data;
    if (!book) return;
    if (!book.readUrl) {
      wx.showToast({ title: '暂无资源', icon: 'none' });
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
    const book = this.data.book;
    if (!book || !this.data.startReadEnabled) return;
    if (!book.readUrl) {
      wx.showToast({ title: '暂无资源', icon: 'none' });
      return;
    }
    const unlock = getApp().globalData.chapterUnlock;
    const r = unlock.handle(book);
    if (r.kind === 'needAd') {
      wx.showLoading({ title: '加载广告中...', mask: true });
      showRewardedAd()
        .then(() => {
          unlock.markAdWatched(book);
          /* wx.showToast({
            title: `已解锁，再点 ${unlock.required} 次获取资源链接`,
            icon: 'none',
            duration: 1500,
          }); */
        })
        .catch((err) => {
          console.error('激励视频广告失败', err);
          const msg = err && err.message === '观看未完成'
            ? null
            : '广告暂不可用，请稍后再试';
          wx.showToast({ title: msg, icon: 'none' });
        })
        .finally(() => wx.hideLoading());
    } else if (r.kind === 'copied') {
      this.copyReadUrlWithModal('资源');
    } else if (r.kind === 'progress') {
     /*  wx.showToast({
        title: `再点 ${r.left} 次获取资源链接`,
        icon: 'none',
        duration: 1000,
      }); */
    }
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
