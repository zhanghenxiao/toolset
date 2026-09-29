import { SITE } from './config';

/** 蒲公英 App 分享页（扫码/浏览器安装） */
export const SHARE_APP_URL = 'https://www.pgyer.com/shuweitansuo';

export const SHARE_APP_TEXT = [
  '【数维探索】精选小说书单',
  `下载安装：${SHARE_APP_URL}`,
  '小程序搜：数维探索',
  '最新资源获取：加入官方反馈群 1041698859',
  `官网：${SITE}`,
].join('\n');

export function copyShareAppText() {
  return new Promise((resolve, reject) => {
    uni.setClipboardData({
      data: SHARE_APP_TEXT,
      success: () => resolve(true),
      fail: (err) => reject(err),
    });
  });
}
