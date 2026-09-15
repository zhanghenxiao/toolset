const DOUBLE_TAP_MS = 450;
const tapState = new Map();

function copyQuarkReadUrl(readUrl) {
  if (!readUrl) {
    wx.showToast({
      title: '暂无夸克分享链接',
      icon: 'none',
    });
    return;
  }
  wx.setClipboardData({
    data: readUrl,
    success: () => {
      wx.showToast({
        title: '夸克分享链接已复制',
        icon: 'success',
        duration: 2000,
      });
    },
    fail: () => {
      wx.showToast({
        title: '复制失败，请重试',
        icon: 'none',
      });
    },
  });
}

/**
 * 连续点击两次「最新章节」时复制夸克分享链接
 */
function onLatestChapterTap(bookId, readUrl) {
  const key = String(bookId);
  const now = Date.now();
  const prev = tapState.get(key);

  if (prev && now - prev.time < DOUBLE_TAP_MS) {
    tapState.delete(key);
    copyQuarkReadUrl(readUrl);
    return;
  }

  tapState.set(key, { time: now });
  wx.showToast({
    title: '再点一次复制夸克链接',
    icon: 'none',
    duration: 1500,
  });

  setTimeout(() => {
    const current = tapState.get(key);
    if (current && current.time === now) {
      tapState.delete(key);
    }
  }, DOUBLE_TAP_MS);
}

module.exports = {
  copyQuarkReadUrl,
  onLatestChapterTap,
};
