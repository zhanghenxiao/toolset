const meta = require('../data/meta');

/** 与网站同源，需在公众平台配置 request / downloadFile 合法域名 */
const SITE = meta.site || 'https://toolset.site';

function bookTxtUrl(downloadUrl) {
  if (!downloadUrl) return '';
  if (/^https?:\/\//i.test(downloadUrl)) return downloadUrl;
  const path = downloadUrl.startsWith('/') ? downloadUrl : `/${downloadUrl}`;
  return SITE + encodeURI(path);
}

module.exports = {
  SITE,
  bookTxtUrl,
};
