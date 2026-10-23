const meta = require('../data/meta');

/** 与网站同源，需在公众平台配置 request / downloadFile 合法域名 */
const SITE = meta.site || 'https://toolset.site';

/**
 * 详情页「开始阅读」按钮：是否显示
 * 仅作为云端开关（云函数 getConfig 的环境变量 START_READ）不可用时的兜底
 */
const START_READ = false;

function startReadEnabled() {
  return !!START_READ;
}

function bookTxtUrl(downloadUrl) {
  if (!downloadUrl) return '';
  if (/^https?:\/\//i.test(downloadUrl)) return downloadUrl;
  const path = downloadUrl.startsWith('/') ? downloadUrl : `/${downloadUrl}`;
  return SITE + encodeURI(path);
}

module.exports = {
  SITE,
  bookTxtUrl,
  START_READ,
  startReadEnabled,
};
