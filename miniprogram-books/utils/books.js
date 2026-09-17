// 书籍数据全部来自云端（云函数 getBooks + 云存储），data/books.js 已随包移除
// data/meta.js 仅保留 site / totalDisplay 等静态配置，体积极小
const localMeta = require('../data/meta');

const CACHE_INDEX_KEY = 'swts_books_index';
const CACHE_CHUNK_PREFIX = 'swts_books_chunk_';
// 小程序单个 storage key 上限 1MB，按 800KB 分片留出余量
const MAX_CHUNK_BYTES = 800 * 1024;

let books = [];
let meta = localMeta;
// 当前数据对应的云端版本（由云函数按云文件内容指纹生成），数据更新后自动失效，无需手工维护
let version = '';
let ready = false;
let pending = null;
let failed = false;
// 最近一次加载失败的原因，供页面展示/排查
let lastError = '';

const listeners = [];

/** 数据在后台刷新后回调，页面可借此重新渲染；返回取消订阅函数 */
function onDataChange(fn) {
  if (typeof fn !== 'function') return () => {};
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i > -1) listeners.splice(i, 1);
  };
}

function notifyDataChange() {
  listeners.slice().forEach((fn) => {
    try {
      fn({ books, meta, version });
    } catch (e) {
      // 单个监听器异常不影响其它监听器
    }
  });
}

function buildMeta(list) {
  const categories = [];
  const tags = [];
  (list || []).forEach((b) => {
    if (b.category && categories.indexOf(b.category) === -1) {
      categories.push(b.category);
    }
    (b.tags || []).forEach((t) => {
      const name = t && t.name;
      if (name && tags.indexOf(name) === -1) tags.push(name);
    });
  });
  return Object.assign({}, localMeta, { categories, tags });
}

function applyData(list, ver) {
  books = list;
  meta = buildMeta(list);
  version = ver || '';
}

/* ---------- 本地分片缓存 ---------- */

function clearCache() {
  try {
    const index = wx.getStorageSync(CACHE_INDEX_KEY);
    if (index && index.chunks) {
      for (let i = 0; i < index.chunks; i++) {
        wx.removeStorageSync(CACHE_CHUNK_PREFIX + i);
      }
    }
    wx.removeStorageSync(CACHE_INDEX_KEY);
  } catch (e) {
    // 忽略清理失败
  }
}

function loadCache() {
  try {
    const index = wx.getStorageSync(CACHE_INDEX_KEY);
    if (!index || !index.chunks) return null;
    const list = [];
    for (let i = 0; i < index.chunks; i++) {
      const chunk = wx.getStorageSync(CACHE_CHUNK_PREFIX + i);
      if (!Array.isArray(chunk)) return null;
      for (let j = 0; j < chunk.length; j++) list.push(chunk[j]);
    }
    if (!list.length) return null;
    return { list, version: index.version || '' };
  } catch (e) {
    return null;
  }
}

function saveCache(list, ver) {
  try {
    const chunks = [];
    let current = [];
    let size = 2;

    for (let i = 0; i < list.length; i++) {
      const need = JSON.stringify(list[i]).length + 1;
      if (current.length && size + need > MAX_CHUNK_BYTES) {
        chunks.push(current);
        current = [];
        size = 2;
      }
      current.push(list[i]);
      size += need;
    }
    if (current.length) chunks.push(current);

    for (let i = 0; i < chunks.length; i++) {
      wx.setStorageSync(CACHE_CHUNK_PREFIX + i, chunks[i]);
    }
    wx.setStorageSync(CACHE_INDEX_KEY, {
      version: ver || '',
      chunks: chunks.length,
      count: list.length,
      ts: Date.now(),
    });
  } catch (e) {
    clearCache();
  }
}

/* ---------- 云端加载 ---------- */

function readTempFile(tempFilePath) {
  return new Promise((resolve, reject) => {
    wx.getFileSystemManager().readFile({
      filePath: tempFilePath,
      encoding: 'utf8',
      success: (res) => resolve(res.data),
      fail: reject,
    });
  });
}

// 兼容 books.js（module.exports = [...];）与 books.json 两种文件内容
function parseBooksText(text) {
  const json = String(text)
    .trim()
    .replace(/^module\.exports\s*=\s*/, '')
    .replace(/;\s*$/, '');
  const list = JSON.parse(json);
  if (!Array.isArray(list) || !list.length) {
    throw new Error('empty books data');
  }
  return list;
}

// 通过云函数签发的临时链接下载（云存储权限为「仅创建者可读写」时，
// wx.cloud.downloadFile 无读取权限，须走带签名的临时链接）
function downloadByUrl(url) {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url,
      success: (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`http ${res.statusCode}`));
          return;
        }
        // 与 wx.cloud.downloadFile 的返回结构保持一致
        resolve({ tempFilePath: res.tempFilePath });
      },
      fail: reject,
    });
  });
}

// 下载书籍数据：优先临时链接，失败再退回 wx.cloud.downloadFile（存储权限放开时可用）
function downloadBooksFile(result) {
  const viaCloud = () => wx.cloud.downloadFile({ fileID: result.fileID });
  const attempt = result.url
    ? downloadByUrl(result.url).catch((err) =>
        // 两种方式都失败时，报更主要的那个（临时链接）错误
        viaCloud().catch(() => {
          throw err;
        }),
      )
    : viaCloud();
  return attempt.then((dl) => readTempFile(dl.tempFilePath));
}

// 向云函数取 fileID 与数据版本，再直连云存储下载数据本体
function fetchRemote() {
  if (!wx.cloud || !wx.cloud.callFunction) {
    return Promise.reject(new Error('当前环境不支持云开发（请升级微信基础库）'));
  }
  let result = null;
  let stage = '调用云函数 getBooks';
  return wx.cloud
    .callFunction({ name: 'getBooks' })
    .then((res) => {
      result = res.result || {};
      // 兼容旧版云函数返回（只有 fileID、没有 ok 字段）
      if (result.ok === false || !result.fileID) {
        throw new Error(result.errMsg || '云函数 getBooks 未返回数据文件');
      }
      stage = '下载云存储文件';
      return downloadBooksFile(result);
    })
    .then((text) => {
      stage = '解析数据';
      return { list: parseBooksText(text), version: result.version || '' };
    })
    .catch((err) => {
      const msg = (err && (err.errMsg || err.message)) || String(err);
      throw new Error(`${stage}失败：${msg}`);
    });
}

// 静默校验：已用缓存启动时，若云端版本变了就替换数据并通知页面
function refreshInBackground() {
  wx.cloud
    .callFunction({ name: 'getBooks' })
    .then((res) => {
      const result = res.result || {};
      // 拿不到版本时不做全量刷新，避免每次冷启动都重新下载
      if (result.ok === false || !result.fileID || !result.version) return null;
      if (result.version === version) return null;

      return downloadBooksFile(result)
        .then((text) => {
          const list = parseBooksText(text);
          applyData(list, result.version);
          saveCache(list, result.version);
          notifyDataChange();
        });
    })
    .catch(() => {
      // 后台刷新失败静默处理，继续用已有数据
    });
}

/**
 * 确保书籍数据就绪：
 * 1. 已加载 -> 直接返回
 * 2. 本地缓存 -> 立即使用，并后台校验云端版本（变了则替换并通知）
 * 3. 云函数取版本 + 云存储下载 -> 解析并写缓存
 * 4. 全部失败 -> 返回空列表，由页面提示重试（可通过 reload() 重试）
 */
function ensureLoaded() {
  if (ready) return Promise.resolve(books);
  if (pending) return pending;

  const cached = loadCache();
  if (cached) {
    applyData(cached.list, cached.version);
    ready = true;
    failed = false;
    lastError = '';
    refreshInBackground();
    return Promise.resolve(books);
  }

  let remote;
  try {
    remote = fetchRemote();
  } catch (e) {
    remote = Promise.reject(e);
  }

  pending = remote
    .then(({ list, version: ver }) => {
      applyData(list, ver);
      ready = true;
      failed = false;
      lastError = '';
      saveCache(list, ver);
      return books;
    })
    .catch((err) => {
      books = [];
      meta = localMeta;
      ready = true;
      failed = true;
      lastError = (err && (err.errMsg || err.message)) || String(err);
      console.error('[books] 云端数据加载失败：', lastError);
      return books;
    })
    .then((list) => {
      pending = null;
      return list;
    });
  return pending;
}

/** 清空缓存并重新拉取云端数据（用于加载失败后重试） */
function reload() {
  clearCache();
  books = [];
  meta = localMeta;
  ready = false;
  failed = false;
  lastError = '';
  pending = null;
  return ensureLoaded();
}

/** 是否处于「云端数据加载失败」状态 */
function isFailed() {
  return failed;
}

/** 最近一次加载失败的原因（空字符串表示无错误） */
function getLastError() {
  return lastError;
}

/* ---------- 查询 ---------- */

function filterBooks({ categories = [], tags = [], keyword = '' }) {
  const kw = keyword.trim().toLowerCase();
  return books.filter((item) => {
    const keywordMatch =
      !kw ||
      item.title.toLowerCase().includes(kw) ||
      item.author.toLowerCase().includes(kw) ||
      (item.excerpt || '').toLowerCase().includes(kw);

    const categoryMatch =
      categories.length === 0 || categories.includes(item.category);

    const tagMatch =
      tags.length === 0 ||
      item.tags.some((t) => tags.includes(t.name));

    return keywordMatch && categoryMatch && tagMatch;
  });
}

function getBookById(id) {
  return books.find((b) => b.id === Number(id));
}

module.exports = {
  ensureLoaded,
  reload,
  isFailed,
  getLastError,
  onDataChange,
  getBooks: () => books,
  getMeta: () => meta,
  getVersion: () => version,
  filterBooks,
  getBookById,
};
