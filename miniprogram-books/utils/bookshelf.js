/**
 * 书架：本地存储（storage），记录「加入书架的书 + 阅读进度」
 * 数据来源：阅读页翻章时同步进度；读满 AUTO_ADD_CHAPTERS 章自动加入。
 */
const SHELF_KEY = 'swts_bookshelf';
// 默认读满多少章自动加入书架（第 N 章，从 1 开始计数）
const AUTO_ADD_CHAPTERS = 5;
// 书架容量上限，避免无限增长撑爆 storage
const MAX_SHELF = 300;

const listeners = [];

function notify() {
  listeners.slice().forEach((fn) => {
    try {
      fn(getShelf());
    } catch (e) {
      // 单个监听器异常不影响其它监听器
    }
  });
}

function getShelf() {
  try {
    const list = wx.getStorageSync(SHELF_KEY);
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

function saveShelf(list) {
  try {
    wx.setStorageSync(SHELF_KEY, list);
  } catch (e) {
    // 写入失败时不阻断阅读
  }
  notify();
  return list;
}

function findIndex(list, id) {
  const key = String(id);
  return list.findIndex((it) => String(it && it.id) === key);
}

/** 该书是否已在书架 */
function isInShelf(id) {
  return findIndex(getShelf(), id) >= 0;
}

/**
 * 加入书架（已存在则只更新进度）
 * @param {object} book utils/books 里的书对象
 * @param {object} progress { chapterIndex, chapterTitle, chapterCount }
 * @param {string} source 'auto' 自动加入 | 'manual' 手动加入
 * @returns {boolean} true = 新加入；false = 原已在书架
 */
function addToShelf(book, progress, source) {
  if (!book) return false;
  const list = getShelf();
  const i = findIndex(list, book.id);
  const item = {
    id: book.id,
    title: book.title || '',
    author: book.author || '',
    cover: book.cover || '',
    category: book.category || '',
    readUrl: book.readUrl || '',
    chapterIndex: (progress && progress.chapterIndex) || 0,
    chapterTitle: (progress && progress.chapterTitle) || '',
    chapterCount: (progress && progress.chapterCount) || 0,
    updatedAt: Date.now(),
  };

  if (i >= 0) {
    // 已在书架：保留加入方式，只刷新书目信息与进度
    const prev = list[i];
    const source2 = prev.source || source || 'manual';
    const addedAt = prev.addedAt || prev.updatedAt || item.updatedAt;
    list.splice(i, 1);
    list.unshift(Object.assign({}, item, { source: source2, addedAt }));
    saveShelf(list);
    return false;
  }

  list.unshift(Object.assign({}, item, {
    source: source || 'manual',
    addedAt: item.updatedAt,
  }));
  if (list.length > MAX_SHELF) list.length = MAX_SHELF;
  saveShelf(list);
  return true;
}

/** 仅更新阅读进度（不在书架则忽略） */
function updateProgress(id, progress) {
  const list = getShelf();
  const i = findIndex(list, id);
  if (i < 0) return false;
  const it = list[i];
  it.chapterIndex = (progress && progress.chapterIndex) || 0;
  it.chapterTitle = (progress && progress.chapterTitle) || '';
  it.chapterCount = (progress && progress.chapterCount) || it.chapterCount || 0;
  it.updatedAt = Date.now();
  list.splice(i, 1);
  list.unshift(it);
  saveShelf(list);
  return true;
}

function removeFromShelf(id) {
  const list = getShelf();
  const i = findIndex(list, id);
  if (i < 0) return false;
  list.splice(i, 1);
  saveShelf(list);
  return true;
}

/** 订阅书架变化，返回取消订阅函数 */
function onShelfChange(fn) {
  if (typeof fn !== 'function') return () => {};
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i > -1) listeners.splice(i, 1);
  };
}

module.exports = {
  AUTO_ADD_CHAPTERS,
  getShelf,
  isInShelf,
  addToShelf,
  updateProgress,
  removeFromShelf,
  onShelfChange,
};
