/**
 * 远程配置工具
 * 从 app-version.json 获取 readMode、panCookies、useCloud 等动态配置
 * 与版本检查共用同一接口，无需额外服务器
 */

import { SITE } from './config.js';
import booksConfig from '../config/books-config.js';

const CACHE_TTL = 5 * 60 * 1000; // 5 分钟缓存
const STORAGE_KEY = 'remote_config_cache';

let cache = null;
let fetchPromise = null;

/** 本地兜底配置 */
const FALLBACK = {
  readMode: 'all', // all | online | link
  // 是否使用云端数据源：未取到远程配置时，沿用本地 books-config.js 的设置
  useCloud: booksConfig.dataSource === 'cloud',
  // 云端书籍文件 ID（留空则使用 books.js 内的默认值）
  cloudFileId: '',
};

/** 兼容布尔/字符串/数字形式的配置值 */
function parseBool(value, fallback) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    if (v === 'true' || v === '1') return true;
    if (v === 'false' || v === '0') return false;
  }
  return fallback;
}

/** 把远程/缓存中的原始数据补全成完整配置 */
function normalize(raw) {
  const src = raw && typeof raw === 'object' ? raw : {};
  return {
    readMode: src.readMode || FALLBACK.readMode,
    useCloud: parseBool(src.useCloud, FALLBACK.useCloud),
    cloudFileId: src.cloudFileId || FALLBACK.cloudFileId,
  };
}

/** 从本地存储恢复缓存 */
function restoreFromStorage() {
  if (cache) return;
  try {
    const stored = uni.getStorageSync(STORAGE_KEY);
    if (stored && stored.timestamp && Date.now() - stored.timestamp < CACHE_TTL) {
      cache = { data: normalize(stored.data), timestamp: stored.timestamp };
    }
  } catch (e) {
    // ignore
  }
}

/**
 * 获取远程配置（带缓存）
 * @returns {Promise<{readMode: string, useCloud: boolean, cloudFileId: string}>}
 */
export function getRemoteConfig() {
  restoreFromStorage();

  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return Promise.resolve(normalize(cache.data));
  }

  if (fetchPromise) return fetchPromise;

  fetchPromise = new Promise((resolve) => {
    uni.request({
      url: `${SITE}/app-version.json`,
      method: 'GET',
      timeout: 10000,
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          const data = normalize(res.data);
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

/**
 * 同步获取缓存的 useCloud（无缓存时返回本地兜底值）
 */
export function getCachedUseCloud() {
  restoreFromStorage();
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return parseBool(cache.data.useCloud, FALLBACK.useCloud);
  }
  return FALLBACK.useCloud;
}

/**
 * 同步获取缓存的云端文件 ID（无缓存时返回空串）
 */
export function getCachedCloudFileId() {
  restoreFromStorage();
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.data.cloudFileId || '';
  }
  return '';
}

/**
 * 是否启用云端数据源：以远程 app-version.json 的 useCloud 为准
 */
export async function isCloudEnabled() {
  const config = await getRemoteConfig();
  return !!config.useCloud;
}
