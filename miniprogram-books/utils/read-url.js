const REQUIRED_CLICKS = 5;
const TAP_GAP_MS = 600;
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
 * 连续点击 REQUIRED_CLICKS 次「最新章节」（每次间隔 < TAP_GAP_MS）时复制夸克分享链接
 * 第一次点击静默，从第二次起提示「再点 N 次」
 */
function onLatestChapterTap(bookId, readUrl) {
  const key = String(bookId);
  const now = Date.now();
  const prev = tapState.get(key);

  const count =
    prev && now - prev.lastTime <= TAP_GAP_MS ? prev.count + 1 : 1;

  if (count >= REQUIRED_CLICKS) {
    tapState.delete(key);
    copyQuarkReadUrl(readUrl);
    return;
  }

  tapState.set(key, { count, lastTime: now });

  // 第一次点击不提示，避免误触
  if (count > 1) {
    const left = REQUIRED_CLICKS - count;
    wx.showToast({
      title: `再点 ${left} 次复制夸克链接`,
      icon: 'none',
      duration: 1000,
    });
  }
}

module.exports = {
  copyQuarkReadUrl,
  onLatestChapterTap,
};
