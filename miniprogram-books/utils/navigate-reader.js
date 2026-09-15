function openReader(bookId, chapterIndex) {
  const id = Number(bookId);
  if (!id) return;
  let url = `/pages/reader/reader?id=${id}`;
  if (chapterIndex !== undefined && chapterIndex !== null && chapterIndex >= 0) {
    url += `&chapter=${chapterIndex}`;
  }
  wx.navigateTo({ url });
}

module.exports = { openReader };
