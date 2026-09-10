const { getBookById } = require('../../utils/books');

Page({
  data: {
    book: null,
  },

  onLoad(options) {
    const book = getBookById(options.id);
    if (!book) {
      wx.showToast({ title: '书籍不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }
    wx.setNavigationBarTitle({ title: book.title });
    this.setData({ book });
  },

  onCopyReadUrl() {
    const { readUrl } = this.data.book;
    if (!readUrl) {
      wx.showToast({ title: '暂无阅读链接', icon: 'none' });
      return;
    }
    wx.setClipboardData({
      data: readUrl,
      success: () => wx.showToast({ title: '阅读链接已复制', icon: 'success' }),
    });
  },

  onOpenReadUrl() {
    const { readUrl } = this.data.book;
    if (!readUrl) {
      wx.showToast({ title: '暂无阅读链接', icon: 'none' });
      return;
    }
    wx.setClipboardData({
      data: readUrl,
      success: () => {
        wx.showModal({
          title: '打开阅读',
          content: '链接已复制，请粘贴到浏览器或夸克 App 中打开',
          showCancel: false,
        });
      },
    });
  },
});
