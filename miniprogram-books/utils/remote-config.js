/**
 * 云函数下发的线上开关（见 cloudfunctions/getConfig）
 * 云函数不可用时，回退到 utils/config.js 的本地配置
 */
const { startReadEnabled } = require('./config');

const CACHE_TTL = 5 * 60 * 1000;
let cache = null;

/** 是否显示「开始阅读」按钮：先本地值渲染，再用云端值校正 */
function getStartReadEnabled() {
  return new Promise((resolve) => {
    const fallback = startReadEnabled();
    if (cache && Date.now() < cache.exp) {
      resolve(cache.value);
      return;
    }
    if (!wx.cloud || !wx.cloud.callFunction) {
      resolve(fallback);
      return;
    }
    wx.cloud.callFunction({
      name: 'getConfig',
      success: (res) => {
        const r = res.result || {};
        const value = r.ok === false || typeof r.startRead !== 'boolean' ? fallback : r.startRead;
        cache = { value, exp: Date.now() + CACHE_TTL };
        resolve(value);
      },
      fail: (err) => {
        console.warn('[config] getConfig 失败，使用本地配置', err && (err.errMsg || err));
        resolve(fallback);
      },
    });
  });
}

module.exports = { getStartReadEnabled };
