import meta from '../data/meta.js';

/** 与网站同源，需在公众平台配置 request / downloadFile 合法域名 */
export const SITE = meta.site || 'https://toolset.site';

export function bookTxtUrl(downloadUrl) {
  if (!downloadUrl) return '';
  if (/^https?:\/\//i.test(downloadUrl)) return downloadUrl;
  const path = downloadUrl.startsWith('/') ? downloadUrl : `/${downloadUrl}`;
  return SITE + encodeURI(path);
}
