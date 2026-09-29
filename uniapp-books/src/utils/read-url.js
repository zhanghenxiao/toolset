const DOUBLE_TAP_MS = 450;
const tapState = new Map();

async function copyReadUrlToClipboard(readUrl) {
  return new Promise((resolve) => {
    uni.setClipboardData({
      data: readUrl,
      success: async () => {
        const { showReadCopySuccess } = await import('./read-prompt');
        await showReadCopySuccess();
        resolve(true);
      },
      fail: () => {
        uni.showToast({ title: '复制失败，请重试', icon: 'none' });
        resolve(false);
      },
    });
  });
}

/** 弹窗提示 → 观看激励视频 → 看完后复制阅读链接 */
export async function promptWatchAdThenCopyReadUrl(readUrl, bookId) {
  if (!readUrl) {
    uni.showToast({ title: '暂无阅读链接', icon: 'none' });
    return false;
  }

  const { showReadRewardConfirm } = await import('./read-prompt');
  const confirmed = await showReadRewardConfirm();
  if (!confirmed) return false;

  const { showRewardForReadUnlock } = await import('./ad-policy');
  const { shown, isEnded } = await showRewardForReadUnlock(bookId);

  if (!shown) {
    uni.showToast({ title: '广告未能展示，请稍后重试', icon: 'none' });
    return false;
  }

  if (!isEnded) {
    uni.showToast({ title: '未看完广告，无法复制链接', icon: 'none' });
    return false;
  }

  return copyReadUrlToClipboard(readUrl);
}

export function copyQuarkReadUrl(readUrl) {
  if (!readUrl) {
    uni.showToast({
      title: '暂无夸克分享链接',
      icon: 'none',
    });
    return;
  }
  uni.setClipboardData({
    data: readUrl,
    success: () => {
      uni.showToast({
        title: '夸克分享链接已复制',
        icon: 'success',
        duration: 2000,
      });
    },
    fail: () => {
      uni.showToast({
        title: '复制失败，请重试',
        icon: 'none',
      });
    },
  });
}

/** 连续点击两次「最新章节」时复制夸克分享链接 */
export function onLatestChapterTap(bookId, readUrl) {
  const key = String(bookId);
  const now = Date.now();
  const prev = tapState.get(key);

  if (prev && now - prev.time < DOUBLE_TAP_MS) {
    tapState.delete(key);
    copyQuarkReadUrl(readUrl);
    return;
  }

  tapState.set(key, { time: now });
  uni.showToast({
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
