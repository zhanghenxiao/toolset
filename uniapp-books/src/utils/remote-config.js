/**
 * 远程配置工具
 * 从 app-version.json 获取 readMode、panCookies、useCloud 等动态配置
 * 与版本检查共用同一接口，无需额外服务器
 */

import { SITE } from './config.js';
import booksConfig from '../config/books-config.js';
import {
  AD_FEED_EVERY_CHAPTER,
  AD_REWARD_AD_FREE_MS,
  AD_REWARD_READER_INTERVAL_MS,
  AD_REWARD_READER_TIME_MS,
} from './ad-config.js';

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
  // 广告节奏/奖励参数：远程 app-version.json 的 ad 段可覆盖；以下为本地兜底默认值
  ad: {
    feedEveryChapter: AD_FEED_EVERY_CHAPTER,
    rewardAdFreeMs: AD_REWARD_AD_FREE_MS,
    rewardReaderIntervalMs: AD_REWARD_READER_INTERVAL_MS,
    rewardReaderFirstMs: AD_REWARD_READER_TIME_MS,
  },
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

/** 钳制整数到 [min, max]，非法值回退 fallback */
function clampInt(value, min, max, fallback) {
  const n = parseInt(value, 10);
  if (!isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

/** 钳制「分钟」到 [min, max] 并换算成毫秒，非法值回退 fallbackMs */
function clampMinutes(value, min, max, fallbackMs) {
  const n = parseFloat(value);
  if (!isFinite(n)) return fallbackMs;
  return Math.min(max, Math.max(min, n)) * 60 * 1000;
}

/** 把远程/缓存中的原始数据补全成完整配置 */
function normalize(raw) {
  const src = raw && typeof raw === 'object' ? raw : {};
  const adRaw = src.ad && typeof src.ad === 'object' ? src.ad : {};
  return {
    readMode: src.readMode || FALLBACK.readMode,
    useCloud: parseBool(src.useCloud, FALLBACK.useCloud),
    cloudFileId: src.cloudFileId || FALLBACK.cloudFileId,
    ad: {
      // 信息流广告密度：每 N 章插 1 条（钳制 [1,50] 防 0 导致取模崩溃 / 过大导致几乎不展示）
      feedEveryChapter: clampInt(adRaw.feedEveryChapter, 1, 50, AD_FEED_EVERY_CHAPTER),
      // 看完激励视频送的免广告时长（分钟 → 毫秒，钳制 [0,1440]）
      rewardAdFreeMs: clampMinutes(adRaw.rewardAdFreeMinutes, 0, 1440, AD_REWARD_AD_FREE_MS),
      // 首次触发激励视频的阅读阈值（分钟 → 毫秒，钳制 [1,1440] 防过小狂弹）
      rewardReaderFirstMs: clampMinutes(adRaw.rewardReaderFirstMinutes, 1, 1440, AD_REWARD_READER_TIME_MS),
      // 首次之后每次触发激励视频的阅读间隔（分钟 → 毫秒，钳制 [1,1440]）
      rewardReaderIntervalMs: clampMinutes(adRaw.rewardReaderIntervalMinutes, 1, 1440, AD_REWARD_READER_INTERVAL_MS),
    },
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
          // 部分静态托管以 text/plain / octet-stream 返回 .json，uni.request 不会自动解析，
          // 此时 res.data 是字符串，normalize 收不到对象会回退 FALLBACK → readMode 变 'all'。
          // 这里统一做防御性解析，并对可能携带的 BOM / 前后杂质 / 非纯 JSON 做容错。
          let raw = res.data;
          if (typeof raw === 'string') {
            raw = raw.replace(/^﻿/, '').trim();
            // 非纯 JSON（被 CDN/HTML 包裹等）时，尝试截取首个 { 到末个 } 之间的内容
            if (!raw.startsWith('{') && raw.indexOf('{') >= 0) {
              const start = raw.indexOf('{');
              const end = raw.lastIndexOf('}');
              if (end > start) raw = raw.slice(start, end + 1);
            }
            try {
              raw = JSON.parse(raw);
            } catch (e) {
              console.error('[remote-config] app-version.json 解析失败，前 300 字符：', String(res.data).slice(0, 300), e);
              raw = null;
            }
          }
          if (raw && typeof raw === 'object') {
            const data = normalize(raw);
            cache = { data, timestamp: Date.now() };
            try {
              uni.setStorageSync(STORAGE_KEY, cache);
              console.log('[remote-config] 已写入缓存 readMode =', data.readMode, 'useCloud =', data.useCloud);
            } catch (e) {
              console.error('[remote-config] setStorageSync 失败', e);
            }
            resolve(data);
          } else {
            console.warn('[remote-config] res.data 非对象，回退 FALLBACK', typeof res.data);
            resolve(cache ? cache.data : FALLBACK);
          }
        } else {
          console.warn('[remote-config] 拉取失败 statusCode =', res.statusCode);
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

/**
 * 同步获取缓存的广告配置（无缓存时返回本地兜底）；远程值经 clamp 后存入 cache.data.ad
 * @returns {{feedEveryChapter:number, rewardAdFreeMs:number, rewardReaderFirstMs:number, rewardReaderIntervalMs:number}}
 */
export function getCachedAdConfig() {
  restoreFromStorage();
  const cfg = cache && Date.now() - cache.timestamp < CACHE_TTL ? cache.data : FALLBACK;
  return cfg.ad;
}

/** 信息流广告密度：每 N 章插 1 条 */
export function getCachedFeedEveryChapter() {
  return getCachedAdConfig().feedEveryChapter;
}

/** 看完激励视频送的免广告时长（毫秒） */
export function getCachedRewardAdFreeMs() {
  return getCachedAdConfig().rewardAdFreeMs;
}

/** 首次触发激励视频的阅读阈值（毫秒） */
export function getCachedRewardReaderFirstMs() {
  return getCachedAdConfig().rewardReaderFirstMs;
}

/** 首次之后每次触发激励视频的阅读间隔（毫秒） */
export function getCachedRewardReaderIntervalMs() {
  return getCachedAdConfig().rewardReaderIntervalMs;
}
