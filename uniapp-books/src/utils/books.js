/**
 * 书籍数据模块（云存储版）
 *
 * - 默认导出空数组 books，组件以 reactive 形式访问（见 booksRef / useBooks）
 * - 提供 loadBooksFromCloud() 异步从 uniCloud 云函数 get-books-file 拉取并解析
 * - 提供 ensureBooksLoaded() 单次加载 Promise
 * - 提供 onBooksChanged / offBooksChanged 监听数据变更
 * - 旧的 filterBooks / getBookById 保持同步接口（在数据加载后能立即生效）
 */

import meta from '../data/meta.js';
import fallbackBooks from '../data/books.js';
import booksConfig from '../config/books-config.js';

export { meta };

// 根据配置决定是否使用云端
const USE_CLOUD = booksConfig.dataSource === 'cloud';
const FILE_ID = USE_CLOUD ? 'cloud://env-00jy6try6x00/books.js' : '';
const STORAGE_KEY = 'cloud_books_cache_v1';
const STORAGE_META_KEY = 'cloud_books_cache_meta_v1';

/** 响应式数据源（响应式数组） */
export const books = reactiveLoad([]);

const listeners = new Set();
let loadPromise = null;

/** 同步导出（兼容老代码：直接 import books） */
export { books as default };

// ---------- 工具 ----------

function reactiveLoad(initial) {
  // 让引用可通过 push / splice 等方法就地变更，组件 watch 仍可触发
  return initial.slice();
}

function notifyChanged() {
  listeners.forEach((fn) => {
    try {
      fn(books);
    } catch (e) {
      console.warn('[books] 监听器执行失败', e);
    }
  });
}

function isBooksArray(arr) {
  return Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'object' && arr[0] !== null;
}

/**
 * 云函数返回的 content 是整段 export default [ ... ] JS 源码，
 * 不能直接 JSON.parse，需要把 export default ... 去掉后再 eval 出真实数组。
 */
function parseBooksSource(text) {
  if (!text) return [];
  if (typeof text !== 'string') return [];

  // 直接 JSON 数组
  const trimmed = text.trim();
  if (trimmed.startsWith('[')) {
    try {
      const arr = JSON.parse(trimmed);
      return Array.isArray(arr) ? arr : [];
    } catch {
      // fallthrough
    }
  }

  // export default [...] / module.exports = [...]
  let src = trimmed
    .replace(/^export\s+default\s+/m, '')
    .replace(/^module\.exports\s*=\s*/m, '')
    .replace(/;?\s*$/, '');

  try {
    // 把裸数组表达式包成 return 语句，避免末尾分号/语法歧义
    // eslint-disable-next-line no-new-func
    const fn = new Function(`return (${src});`);
    const parsed = fn();
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('[books] 解析 content 失败', e);
    return [];
  }
}

function replaceBooks(next) {
  if (!Array.isArray(next)) return;
  books.splice(0, books.length, ...next);
}

function persistCache(list) {
  try {
    uni.setStorageSync(STORAGE_KEY, list);
    uni.setStorageSync(STORAGE_META_KEY, { updatedAt: Date.now(), count: list.length });
  } catch (e) {
    console.warn('[books] 缓存写入失败', e);
  }
}

function loadCache() {
  try {
    const cached = uni.getStorageSync(STORAGE_KEY);
    return Array.isArray(cached) ? cached : null;
  } catch {
    return null;
  }
}

// ---------- 对外 API ----------

export function onBooksChanged(fn) {
  if (typeof fn === 'function') listeners.add(fn);
  return () => offBooksChanged(fn);
}

export function offBooksChanged(fn) {
  listeners.delete(fn);
}

/**
 * 等待首次加载完成。已加载或正在加载时直接复用同一 Promise。
 */
export function ensureBooksLoaded() {
  if (books.length > 0) return Promise.resolve(books);
  if (loadPromise) return loadPromise;
  
  // 如果配置为本地数据源，直接返回本地数据
  if (!USE_CLOUD) {
    if (books.length === 0 && isBooksArray(fallbackBooks)) {
      replaceBooks(fallbackBooks);
      notifyChanged();
    }
    return Promise.resolve(books);
  }
  
  return loadBooksFromCloud({ silent: true });
}

/**
 * 主动从云端拉取一次；force=true 时忽略本地缓存重新拉取。
 * 失败时返回当前内存中的数据（启动时已注入本地兜底）。
 */
export function loadBooksFromCloud(options = {}) {
  const { force = false, silent = false } = options;

  if (loadPromise && !force) return loadPromise;

  if (!silent && !loadPromise && books.length === 0) {
    const cached = loadCache();
    if (cached && cached.length) {
      replaceBooks(cached);
      notifyChanged();
    }
  }

  loadPromise = (async () => {
    if (!silent) uni.showLoading?.({ title: '更新书单…', mask: true });
    try {
      // #ifdef APP-PLUS || MP-WEIXIN || H5
      // 优先用 uniCloud.callFunction 调云函数 get-books-file
      let text = '';
      try {
        if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
          const res = await uniCloud.callFunction({
            name: 'get-books-file',
            data: { fileID: FILE_ID },
          });
          const payload = res && res.result ? res.result : {};
          if (payload.code === 0 && typeof payload.content === 'string') {
            text = payload.content;
          } else {
            console.warn('[books] 云函数返回异常', payload);
          }
        } else {
          console.warn('[books] uniCloud 不可用，回退到本地缓存/兜底');
        }
      } catch (e) {
        console.warn('[books] callFunction 失败', e);
      }

      // #endif

      if (!text) {
        // 没有拿到云端文本时保留现有数据（可能是本地缓存或空）
        if (books.length === 0) {
          // 注入本地兜底，避免页面长时间空白
          if (isBooksArray(fallbackBooks)) {
            replaceBooks(fallbackBooks);
            notifyChanged();
          }
        }
        return books;
      }

      const parsed = parseBooksSource(text);
      if (!isBooksArray(parsed)) {
        console.warn('[books] 云端数据解析为空数组，保留现状');
        return books;
      }

      replaceBooks(parsed);
      persistCache(parsed);
      notifyChanged();
      return books;
    } finally {
      if (!silent) uni.hideLoading?.();
      loadPromise = null;
    }
  })();

  return loadPromise;
}

// ---------- 同步过滤函数（保持与老接口一致）----------

export function filterBooks({ categories = [], tags = [], keyword = '' } = {}) {
  const kw = String(keyword || '').trim().toLowerCase();
  return books.filter((item) => {
    if (!item) return false;
    const title = String(item.title || '').toLowerCase();
    const author = String(item.author || '').toLowerCase();
    const excerpt = String(item.excerpt || '').toLowerCase();

    const keywordMatch =
      !kw || title.includes(kw) || author.includes(kw) || excerpt.includes(kw);

    const categoryMatch =
      categories.length === 0 ||
      (Array.isArray(categories) && categories.includes(item.category));

    const tagMatch =
      tags.length === 0 ||
      (Array.isArray(item.tags) && item.tags.some((t) => tags.includes(t.name)));

    return keywordMatch && categoryMatch && tagMatch;
  });
}

export function getBookById(id) {
  if (id === undefined || id === null) return undefined;
  const raw = String(id);
  const num = /^\d+$/.test(raw) ? Number(raw) : raw;
  return books.find((b) => b && (b.id === num || String(b.id) === raw));
}

// ---------- 启动期自动注入本地兜底 ----------
// 在 App.vue onLaunch 调用 loadBooksFromCloud() 之前，先让 API 可用，避免空白。
if (books.length === 0 && isBooksArray(fallbackBooks)) {
  replaceBooks(fallbackBooks);
}
