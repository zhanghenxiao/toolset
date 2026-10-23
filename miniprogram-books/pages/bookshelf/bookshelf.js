/**
 * 书架页：展示已加入书架的书与阅读进度，可继续阅读 / 移出书架
 * 书架数据来自本地 storage（utils/bookshelf），书籍详情从 utils/books 取最新信息。
 */
const { ensureLoaded, getBookById } = require('../../utils/books');
const { getShelf, removeFromShelf, AUTO_ADD_CHAPTERS } = require('../../utils/bookshelf');
const { openReader } = require('../../utils/navigate-reader');

function pad(n) {
  return n < 10 ? `0${n}` : String(n);
}

/** 最近阅读时间：今天 / 昨天 / 具体日期 */
function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const hm = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const dayStart = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDay = Math.floor((dayStart(now) - dayStart(d)) / 86400000);
  if (diffDay === 0) return `今天 ${hm}`;
  if (diffDay === 1) return `昨天 ${hm}`;
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${hm}`;
}

Page({
  data: {
    list: [],
    loading: true,
    autoChapters: AUTO_ADD_CHAPTERS,
  },

  onLoad() {
    this.renderShelf();
  },

  // 从阅读页返回时刷新进度
  onShow() {
    this.renderShelf();
  },

  renderShelf() {
    ensureLoaded()
      .then(() => {
        const shelf = getShelf();
        const list = shelf.map((it) => {
          const book = getBookById(it.id) || {};
          // 书目信息以最新书数据为准，进度以书架记录为准
          const item = Object.assign({}, it, {
            title: book.title || it.title,
            author: book.author || it.author,
            cover: book.cover || it.cover,
            category: book.category || it.category,
            timeText: formatTime(it.updatedAt),
          });
          return item;
        });
        this.setData({ list, loading: false });
      })
      .catch(() => {
        // 书籍数据拉取失败时仍展示书架记录（可能缺封面/作者）
        this.setData({
          list: getShelf().map((it) => Object.assign({}, it, { timeText: formatTime(it.updatedAt) })),
          loading: false,
        });
      });
  },

  // 继续阅读：从上次读到的章节进入
  onBookTap(e) {
    const { id, chapter } = e.currentTarget.dataset;
    openReader(id, Number(chapter) || 0);
  },

  onRemoveTap(e) {
    const { id } = e.currentTarget.dataset;
    const item = this.data.list.find((it) => String(it.id) === String(id));
    wx.showModal({
      title: '移出收藏',
      content: `确定将《${(item && item.title) || '这本书'}》移出收藏？`,
      confirmText: '移出',
      confirmColor: '#8c2f39',
      success: (r) => {
        if (!r.confirm) return;
        removeFromShelf(id);
        this.renderShelf();
        wx.showToast({ title: '已移出收藏', icon: 'none' });
      },
    });
  },

  onGoBookstore() {
    wx.switchTab({ url: '/pages/index/index' });
  },

  onShareAppMessage() {
    return {
      title: '数维探索 · 我的收藏',
      path: '/pages/index/index',
    };
  },
});
