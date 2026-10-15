/**
 * 书籍数据加载器
 * 根据配置动态加载本地或云端数据
 */

import booksConfig from '@/config/books-config';
import localBooksData from '@/data/books.js';

// 数据缓存
let booksCache = null;
let lastLoadTime = 0;

/**
 * 从本地加载书籍数据
 */
async function loadFromLocal() {
  try {
    return localBooksData.default || localBooksData;
  } catch (error) {
    console.error('加载本地书籍数据失败：', error);
    return [];
  }
}

/**
 * 从云端加载书籍数据（通过云函数）
 */
async function loadFromCloudFunction() {
  try {
    const res = await uniCloud.callFunction({
      name: booksConfig.cloud.functionName,
      data: {}
    });
    
    if (res.result && res.result.success) {
      return res.result.data || [];
    }
    
    console.error('云函数返回错误：', res.result);
    return [];
  } catch (error) {
    console.error('调用云函数失败：', error);
    return [];
  }
}

/**
 * 从云存储加载书籍数据（直接下载文件）
 */
async function loadFromCloudStorage() {
  try {
    const downloadRes = await uniCloud.downloadFile({
      fileID: booksConfig.cloud.fileId
    });
    
    if (downloadRes.fileContent) {
      const content = downloadRes.fileContent.toString('utf-8');
      return JSON.parse(content);
    }
    
    return [];
  } catch (error) {
    console.error('从云存储加载失败：', error);
    return [];
  }
}

/**
 * 从缓存加载数据
 */
function loadFromCache() {
  if (!booksConfig.cloud.enableCache) return null;
  
  try {
    const cached = uni.getStorageSync(booksConfig.cloud.cacheKey);
    if (cached && cached.data && cached.timestamp) {
      const now = Date.now();
      const elapsed = now - cached.timestamp;
      
      // 检查缓存是否过期
      if (elapsed < booksConfig.cloud.cacheTime) {
        console.log('使用缓存数据，剩余有效时间：', Math.floor((booksConfig.cloud.cacheTime - elapsed) / 1000), '秒');
        return cached.data;
      }
    }
  } catch (error) {
    console.error('读取缓存失败：', error);
  }
  
  return null;
}

/**
 * 保存数据到缓存
 */
function saveToCache(data) {
  if (!booksConfig.cloud.enableCache) return;
  
  try {
    uni.setStorageSync(booksConfig.cloud.cacheKey, {
      data: data,
      timestamp: Date.now()
    });
    console.log('数据已缓存');
  } catch (error) {
    console.error('保存缓存失败：', error);
  }
}

/**
 * 从云端加载数据（优先使用缓存）
 */
async function loadFromCloud() {
  // 先尝试从缓存加载
  const cached = loadFromCache();
  if (cached) {
    return cached;
  }
  
  // 缓存未命中或过期，从云端加载
  console.log('从云端加载书籍数据...');
  
  let data = [];
  
  // 如果配置了云存储文件ID，直接下载文件
  if (booksConfig.cloud.fileId && booksConfig.cloud.fileId !== 'cloud://your-env-id.xxxx/data/books.json') {
    data = await loadFromCloudStorage();
  } else {
    // 否则通过云函数获取
    data = await loadFromCloudFunction();
  }
  
  // 保存到缓存
  if (data && data.length > 0) {
    saveToCache(data);
  }
  
  return data;
}

/**
 * 主加载函数
 * @param {boolean} forceReload - 是否强制重新加载
 * @returns {Promise<Array>} 书籍数据数组
 */
export async function loadBooks(forceReload = false) {
  // 如果有缓存且不强制重新加载，直接返回
  if (!forceReload && booksCache) {
    return booksCache;
  }
  
  let books = [];
  
  try {
    switch (booksConfig.dataSource) {
      case 'local':
        console.log('使用本地数据源');
        books = await loadFromLocal();
        break;
        
      case 'cloud':
        console.log('使用云端数据源');
        books = await loadFromCloud();
        
        // 云端加载失败，回退到本地
        if (!books || books.length === 0) {
          console.warn('云端数据加载失败，回退到本地数据');
          books = await loadFromLocal();
        }
        break;
        
      default:
        console.warn('未知的数据源类型，使用本地数据');
        books = await loadFromLocal();
    }
    
    // 更新缓存
    booksCache = books;
    lastLoadTime = Date.now();
    
    console.log(`成功加载 ${books.length} 本书籍`);
    
  } catch (error) {
    console.error('加载书籍数据失败：', error);
    
    // 发生错误时，尝试从本地加载作为后备
    if (booksConfig.dataSource === 'cloud') {
      console.log('尝试加载本地数据作为后备');
      books = await loadFromLocal();
      booksCache = books;
    }
  }
  
  return books;
}

/**
 * 清除缓存
 */
export function clearBooksCache() {
  booksCache = null;
  lastLoadTime = 0;
  
  try {
    uni.removeStorageSync(booksConfig.cloud.cacheKey);
    console.log('缓存已清除');
  } catch (error) {
    console.error('清除缓存失败：', error);
  }
}

/**
 * 获取缓存信息
 */
export function getCacheInfo() {
  return {
    hasCacheInMemory: !!booksCache,
    lastLoadTime: lastLoadTime,
    dataSource: booksConfig.dataSource,
    itemCount: booksCache ? booksCache.length : 0
  };
}

/**
 * 手动刷新数据
 */
export async function refreshBooks() {
  console.log('手动刷新书籍数据...');
  clearBooksCache();
  return await loadBooks(true);
}
