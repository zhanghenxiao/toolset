/**
 * 远程配置工具
 * 从 app-version.json 获取 readMode、panCookies 等动态配置
 * 与版本检查共用同一接口，无需额外服务器
 */

import { SITE } from './config.js';

const CACHE_TTL = 5 * 60 * 1000; // 5 分钟缓存
const STORAGE_KEY = 'remote_config_cache';

let cache = null;
let fetchPromise = null;

/** 本地兜底配置 */
const FALLBACK = {
  readMode: 'all', // all | online | link
};

/** 从本地存储恢复缓存 */
function restoreFromStorage() {
  if (cache) return;
  try {
    const stored = uni.getStorageSync(STORAGE_KEY);
    if (stored && stored.timestamp && Date.now() - stored.timestamp < CACHE_TTL) {
      cache = stored;
    }
  } catch (e) {
    // ignore
  }
}

/**
 * 获取远程配置（带缓存）
 * @returns {Promise<{readMode: string}>}
 */
export function getRemoteConfig() {
  restoreFromStorage();

  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return Promise.resolve(cache.data);
  }

  if (fetchPromise) return fetchPromise;

  fetchPromise = new Promise((resolve) => {
    uni.request({
      url: `${SITE}/app-version.json`,
      method: 'GET',
      timeout: 10000,
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          const data = {
            readMode: res.data.readMode || FALLBACK.readMode,
          };
          cache = { data, timestamp: Date.now() };
          try {
            uni.setStorageSync(STORAGE_KEY, cache);
          } catch (e) {
            // ignore
          }
          resolve(data);
        } else {
          resolve(cache ? cache.data : FALLBACK);
        }
      },
      fail: () => {
        resolve(cache ? cache.data : FALLBACK);
      },
    });
  });

  fetchPromise.then(() => {
    fetchPromise = null;
  });

  return fetchPromise;
}

/**
 * 同步获取缓存的 readMode（如果缓存未过期）
 * 如果没有缓存，返回默认值 'all'
 */
export function getCachedReadMode() {
  restoreFromStorage();
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.data.readMode || 'all';
  }
  return 'all';
}

/**
 * 获取 readMode（优先用同步缓存，无缓存时返回 'all' 并触发异步刷新）
 */
export function getReadMode() {
  return getCachedReadMode();
}
