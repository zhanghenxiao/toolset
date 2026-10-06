/**
 * 「最新章节」点击解锁状态机
 * 规则：每本书需先看一次激励视频广告解锁，之后连续点击 REQUIRED_CLICKS 次（间隔 < TAP_GAP_MS）才发放资源链接
 * 状态存在内存（app globalData），关掉小程序后重置
 */
function createChapterUnlock({ required = 5, gapMs = 600 } = {}) {
  const adWatched = new Set();
  const tapState = new Map();

  return {
    required,

    /**
     * 每次点击「最新章节」时调用，返回状态分支：
     * - { kind: 'needAd' } 该书还没看过广告
     * - { kind: 'progress', left } 已解锁但还需点击 left 次
     * - { kind: 'copied', book } 已达成条件，调用方应执行复制
     * - { kind: 'invalid' } 书本信息缺失
     */
    handle(book) {
      const id = book && book.id != null ? String(book.id) : '';
      if (!id) return { kind: 'invalid' };

      if (!adWatched.has(id)) return { kind: 'needAd' };

      const now = Date.now();
      const prev = tapState.get(id);
      const count =
        prev && now - prev.lastTime <= gapMs ? prev.count + 1 : 1;

      if (count >= required) {
        tapState.delete(id);
        return { kind: 'copied', book };
      }

      tapState.set(id, { count, lastTime: now });
      return { kind: 'progress', left: required - count };
    },

    /** 广告观看完成后调用，标记该书已解锁并清零计数 */
    markAdWatched(book) {
      const id = book && book.id != null ? String(book.id) : '';
      if (!id) return;
      adWatched.add(id);
      tapState.set(id, { count: 0, lastTime: 0 });
    },
  };
}

module.exports = { createChapterUnlock };