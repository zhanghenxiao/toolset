/**
 * 阅读页广告状态（对齐《阅读页广告规则.md》）
 *  - 累计阅读时长里程碑（跨会话持久化）
 *  - 免广告时段
 *  - 激励视频未看完导致的「后续章节锁定」（按书记账）
 */
const {
  REWARD_AD_FREE_MS,
  REWARD_PENDING_TTL_MS,
  REWARD_READER_FIRST_MS,
  REWARD_READER_INTERVAL_MS,
} = require('./ad-config');

const TIME_KEY = 'reader_reading_time_v1';
const FREE_KEY = 'swts_ad_free_until';
const LOCK_KEY = 'swts_reader_lock_v1';
const PENDING_KEY = 'swts_reward_pending_v1';

/* ---------- 累计阅读时长 ---------- */

function getReadingState() {
  try {
    const s = wx.getStorageSync(TIME_KEY) || {};
    const total = Number(s.total) || 0;
    const next = Number(s.next) > 0 ? Number(s.next) : REWARD_READER_FIRST_MS;
    return { total, next, updatedAt: Number(s.updatedAt) || 0 };
  } catch (e) {
    return { total: 0, next: REWARD_READER_FIRST_MS, updatedAt: 0 };
  }
}

function saveReadingState(state) {
  try {
    wx.setStorageSync(TIME_KEY, state);
  } catch (e) {
    // 忽略写入失败
  }
}

/** 累加阅读时长（毫秒），返回最新状态 */
function addReadingMs(ms) {
  const state = getReadingState();
  if (ms > 0) {
    state.total += ms;
    state.updatedAt = Date.now();
    saveReadingState(state);
  }
  return state;
}

/** 是否已到达本次里程碑 */
function isMilestoneReached() {
  const state = getReadingState();
  return state.total >= state.next;
}

/** 完整看完激励视频后才推进里程碑：下一次阈值 = 当前总时长 + 间隔 */
function advanceMilestone() {
  const state = getReadingState();
  state.next = state.total + REWARD_READER_INTERVAL_MS;
  state.updatedAt = Date.now();
  saveReadingState(state);
  return state;
}

/* ---------- 免广告时段 ---------- */

function getAdFreeUntil() {
  try {
    return Number(wx.getStorageSync(FREE_KEY) || 0) || 0;
  } catch (e) {
    return 0;
  }
}

function isAdFree() {
  return getAdFreeUntil() > Date.now();
}

function getAdFreeLeftMs() {
  return Math.max(0, getAdFreeUntil() - Date.now());
}

/** 看完激励视频：从现在起延长免广告时长 */
function extendAdFree(ms) {
  const until = Date.now() + (ms || REWARD_AD_FREE_MS);
  try {
    wx.setStorageSync(FREE_KEY, until);
  } catch (e) {
    // 忽略写入失败
  }
  return until;
}

/* ---------- 章节锁定（未看完激励视频） ---------- */

function readLocks() {
  try {
    const map = wx.getStorageSync(LOCK_KEY);
    return map && typeof map === 'object' ? map : {};
  } catch (e) {
    return {};
  }
}

function writeLocks(map) {
  try {
    wx.setStorageSync(LOCK_KEY, map);
  } catch (e) {
    // 忽略写入失败
  }
}

/** 该书是否被锁定；返回 { chapterIndex } 或 null */
function getLock(bookId) {
  const map = readLocks();
  const item = map[String(bookId)];
  return item && typeof item.chapterIndex === 'number' ? item : null;
}

/** 锁定该书 chapterIndex 之后的章节 */
function setLock(bookId, chapterIndex) {
  const map = readLocks();
  map[String(bookId)] = { chapterIndex, ts: Date.now() };
  writeLocks(map);
}

function clearLock(bookId) {
  const map = readLocks();
  if (!map[String(bookId)]) return;
  delete map[String(bookId)];
  writeLocks(map);
}

/* ---------- 激励视频「播放中」标记（防切后台 / 杀进程作弊） ---------- */

/**
 * 开始播放激励视频时落盘标记。
 * 正常看完或关闭时在 finally 里清除；若用户中途切后台后杀进程，
 * 标记会残留在 storage，下次启动据此判定「未完成」，不发放免广告。
 */
function startRewardPending(info) {
  try {
    wx.setStorageSync(PENDING_KEY, Object.assign({ ts: Date.now() }, info || {}));
  } catch (e) {
    // 忽略写入失败
  }
}

// 取出未完成的播放标记；过期残留直接丢弃，避免误判
function getRewardPending() {
  try {
    const p = wx.getStorageSync(PENDING_KEY);
    if (!p || typeof p !== 'object' || !p.ts) return null;
    if (Date.now() - Number(p.ts) > REWARD_PENDING_TTL_MS) {
      clearRewardPending();
      return null;
    }
    return p;
  } catch (e) {
    return null;
  }
}

function clearRewardPending() {
  try {
    wx.removeStorageSync(PENDING_KEY);
  } catch (e) {
    // 忽略清理失败
  }
}

module.exports = {
  getReadingState,
  addReadingMs,
  isMilestoneReached,
  advanceMilestone,
  getAdFreeUntil,
  isAdFree,
  getAdFreeLeftMs,
  extendAdFree,
  getLock,
  setLock,
  clearLock,
  startRewardPending,
  getRewardPending,
  clearRewardPending,
};
