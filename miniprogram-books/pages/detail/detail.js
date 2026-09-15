const { getBookById } = require('../../utils/books');
const { onLatestChapterTap: handleLatestChapterTap } = require('../../utils/read-url');

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

  onLatestChapterTap() {
    const { book } = this.data;
    if (!book) return;
    handleLatestChapterTap(book.id, book.readUrl);
  },
});
