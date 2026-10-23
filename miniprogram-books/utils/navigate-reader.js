/**
 * 跳转到阅读页
 * 注意：bookId 既可能是数字（145）也可能是字符串（l_11774600__6434），
 * 不能做 Number() 转换，否则字符串 id 会变成 NaN 导致静默跳转失败
 * @param {string|number} bookId 书籍 id
 * @param {number} [chapterIndex] 起始章节下标
 */
function openReader(bookId, chapterIndex) {
  const id = bookId === undefined || bookId === null ? '' : String(bookId);
  if (!id) {
    wx.showToast({ title: '书籍标识缺失', icon: 'none' });
    return;
  }
  let url = `/pages/reader/reader?id=${encodeURIComponent(id)}`;
  if (chapterIndex !== undefined && chapterIndex !== null && chapterIndex >= 0) {
    url += `&chapter=${chapterIndex}`;
  }
  wx.navigateTo({
    url,
    fail: (err) => {
      console.error('[reader] 跳转失败', err);
      wx.showToast({ title: '打开阅读页失败', icon: 'none' });
    },
  });
}

module.exports = { openReader };
