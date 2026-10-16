/**
 * 书籍数据源配置
 * 可以选择使用本地 books.js 或云存储的 books.json
 */

export default {
  // 数据源类型：'local' | 'cloud'
  dataSource: 'cloud',

  
  // 本地数据源配置
  local: {
    // 本地 books.js 文件路径
    path: '@/data/books.js',
    // 是否启用本地缓存
    enableCache: true
  },
  
  // 云端数据源配置
  cloud: {
    // 云函数名称
    functionName: 'get-books-data',
    // 云存储文件ID（如果使用云存储文件）
    fileId: 'cloud://your-env-id.xxxx/data/books.json',
    // 缓存时长（毫秒），默认1小时
    cacheTime: 60 * 60 * 1000,
    // 是否启用本地缓存
    enableCache: true,
    // 缓存键名
    cacheKey: 'books_data_cache'
  },
  
  // 混合模式配置（本地 + 云端增量更新）
  hybrid: {
    // 是否启用混合模式
    enabled: false,
    // 本地数据作为基础
    useLocalAsBase: true,
    // 云端增量更新间隔（毫秒），默认5分钟
    updateInterval: 5 * 60 * 1000
  }
};
