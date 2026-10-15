/**
 * 客户端网盘直链解析工具
 * 支持夸克网盘和百度网盘
 */

import panConfig from './pan-config.js';
import { SITE } from './config.js';

/**
 * 远程 app-version.json 中的网盘 Cookie 缓存
 */
let remoteCookieCache = null;
let remoteCookiePromise = null;
const COOKIE_CACHE_TTL = 5 * 60 * 1000; // 5 分钟缓存

/**
 * 从远程 app-version.json 获取 panCookies
 * 优先级：远程 panCookies > pan-config.js 中的 cookieUrl > pan-config.js 中的 cookie
 */
async function fetchRemotePanCookies() {
  if (remoteCookieCache && Date.now() - remoteCookieCache.timestamp < COOKIE_CACHE_TTL) {
    return remoteCookieCache.data;
  }
  if (remoteCookiePromise) {
    return remoteCookiePromise;
  }
  remoteCookiePromise = new Promise(async (resolve) => {
    try {
      const res = await new Promise((resolve2, reject2) => {
        uni.request({
          url: `${SITE}/app-version.json`,
          method: 'GET',
          timeout: 10000,
          success: resolve2,
          fail: reject2
        });
      });
      if (res.statusCode === 200 && res.data && res.data.panCookies) {
        remoteCookieCache = { data: res.data.panCookies, timestamp: Date.now() };
        resolve(res.data.panCookies);
        return;
      }
    } catch (e) {
      console.warn('获取远程 panCookies 失败:', e);
    }
    resolve(null);
    remoteCookiePromise = null;
  });
  remoteCookiePromise.then(() => { remoteCookiePromise = null; });
  return remoteCookiePromise;
}

/**
 * 获取夸克 Cookie
 * 优先级：远程 app-version.json > pan-config.js cookieUrl > pan-config.js cookie
 */
async function getQuarkCookie() {
  // 1. 优先从远程 app-version.json 获取
  const remoteCookies = await fetchRemotePanCookies();
  if (remoteCookies && remoteCookies.quark) {
    return remoteCookies.quark;
  }
  // 2. 从 cookieUrl 接口获取
  if (panConfig.quark.cookieUrl) {
    try {
      const res = await uni.request({
        url: panConfig.quark.cookieUrl,
        method: 'GET'
      });
      if (res.statusCode === 200 && res.data) {
        return res.data.trim();
      }
    } catch (error) {
      console.warn('从接口获取夸克 Cookie 失败:', error);
    }
  }
  // 3. 回退到配置文件
  return panConfig.quark.cookie;
}

/**
 * 获取百度 Cookie
 * 优先级：远程 app-version.json > pan-config.js cookieUrl > pan-config.js cookie
 */
async function getBaiduCookie() {
  // 1. 优先从远程 app-version.json 获取
  const remoteCookies = await fetchRemotePanCookies();
  if (remoteCookies && remoteCookies.baidu) {
    return remoteCookies.baidu;
  }
  // 2. 从 cookieUrl 接口获取
  if (panConfig.baidu.cookieUrl) {
    try {
      const res = await uni.request({
        url: panConfig.baidu.cookieUrl,
        method: 'GET'
      });
      if (res.statusCode === 200 && res.data) {
        return res.data.trim();
      }
    } catch (error) {
      console.warn('从接口获取百度 Cookie 失败:', error);
    }
  }
  // 3. 回退到配置文件
  return panConfig.baidu.cookie;
}

/**
 * 构建 query string（兼容小程序环境）
 */
function buildQueryString(params) {
  return Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
}

/**
 * 判断是否为夸克网盘链接
 */
export function isQuarkUrl(url) {
  return /pan\.quark\.cn/i.test(url);
}

/**
 * 判断是否为百度网盘链接
 */
export function isBaiduUrl(url) {
  return /pan\.baidu\.com/i.test(url);
}

/**
 * 从 URL 提取提取码
 */
function extractPassword(url) {
  const match = url.match(/[?&]pwd=([^&]+)/i);
  return match ? match[1] : '';
}

/**
 * 解析夸克网盘直链
 */
export async function parseQuarkDirectUrl(shareUrl, password) {
  try {
    // 0. 获取 Cookie
    const quarkCookie = await getQuarkCookie();
    if (!quarkCookie) {
      throw new Error('未配置夸克网盘 Cookie');
    }

    // 1. 提取 share_id
    const match = shareUrl.match(/pan\.quark\.cn\/s\/([a-zA-Z0-9]+)/);
    if (!match) {
      throw new Error('无效的夸克分享链接');
    }
    const shareId = match[1];
    const pwd = password || extractPassword(shareUrl);

    // 2. 获取 stoken
    const tokenRes = await new Promise((resolve, reject) => {
      uni.request({
        url: 'https://drive-pc.quark.cn/1/clouddrive/share/sharepage/token',
        method: 'POST',
        data: {
          pwd_id: shareId,
          passcode: pwd || ''
        },
        header: {
          'Cookie': quarkCookie,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://pan.quark.cn/',
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        success: resolve,
        fail: reject
      });
    });

    console.log('夸克 token 响应:', tokenRes.data);
    
    if (tokenRes.statusCode !== 200 || !tokenRes.data || tokenRes.data.code !== 0) {
      throw new Error(tokenRes.data?.message || '获取夸克分享 token 失败');
    }
    
    const stoken = tokenRes.data.data?.stoken || '';
    if (!stoken) {
      throw new Error('未能获取到有效的 stoken');
    }

    // 3. 获取分享详情
    const detailParams = buildQueryString({
      pwd_id: shareId,
      passcode: pwd || '',
      stoken: stoken,
      pdir_fid: '0',
      force: '0',
      _page: '1',
      _size: '50',
      _fetch_banner: '1',
      _fetch_share: '1',
      _sort: 'file_type:asc,updated_at:desc'
    });
    
    const detailUrl = `https://drive-pc.quark.cn/1/clouddrive/share/sharepage/detail?${detailParams}`;
    console.log('夸克分享详情请求URL:', detailUrl);
    console.log('夸克Cookie前50字符:', quarkCookie.substring(0, 50));
    
    const detailRes = await new Promise((resolve, reject) => {
      uni.request({
        url: detailUrl,
        method: 'GET',
        header: {
          'Cookie': quarkCookie,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://pan.quark.cn/',
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        success: resolve,
        fail: reject
      });
    });

    if (detailRes.statusCode !== 200 || !detailRes.data || detailRes.data.code !== 0) {
      console.error('夸克分享详情响应:', detailRes.data);
      throw new Error(detailRes.data?.message || '获取夸克分享详情失败');
    }

    const shareData = detailRes.data.data;
    console.log('夸克分享详情完整数据:', JSON.stringify(shareData, null, 2));
    
    const files = shareData?.list || [];
    if (files.length === 0) {
      throw new Error('分享中没有文件');
    }

    const firstFile = files[0];
    console.log('第一个文件信息:', JSON.stringify(firstFile, null, 2));
    const fid = firstFile.fid;
    const shareFidToken = firstFile.share_fid_token || '';

    // 4. 调用下载接口获取真实下载地址
    const downloadRes = await new Promise((resolve, reject) => {
      uni.request({
        url: `https://drive-pc.quark.cn/1/clouddrive/file/download?pr=ucpro&fr=pc&uc_param_str=&__dt=&__t=${Date.now()}`,
        method: 'POST',
        data: {
          fids: [fid],
          share_fid_token_list: [shareFidToken]
        },
        header: {
          'Cookie': quarkCookie,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://pan.quark.cn/',
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        success: resolve,
        fail: reject
      });
    });

    console.log('夸克下载接口响应:', JSON.stringify(downloadRes.data, null, 2));

    if (downloadRes.statusCode !== 200 || !downloadRes.data) {
      throw new Error('调用夸克下载接口失败');
    }

    const downloadData = downloadRes.data.data;
    if (!downloadData || downloadData.length === 0) {
      throw new Error(downloadRes.data.message || '未获取到下载链接');
    }

    const downloadUrl = downloadData[0]?.download_url;
    if (!downloadUrl) {
      throw new Error('下载链接为空');
    }

    console.log('获取到真实下载URL:', downloadUrl);

    return {
      success: true,
      url: downloadUrl,
      filename: firstFile.file_name,
      expires: 3600
    };

  } catch (error) {
    console.error('解析夸克网盘失败:', error);
    return {
      success: false,
      error: error.message || '解析失败'
    };
  }
}

/**
 * 解析百度网盘直链
 */
export async function parseBaiduDirectUrl(shareUrl, password) {
  try {
    // 0. 获取 Cookie
    const baiduCookie = await getBaiduCookie();
    if (!baiduCookie) {
      throw new Error('未配置百度网盘 Cookie');
    }

    // 1. 提取 surl (短链接ID)
    const match = shareUrl.match(/pan\.baidu\.com\/s\/([a-zA-Z0-9_-]+)/);
    if (!match) {
      throw new Error('无效的百度分享链接');
    }
    const surl = match[1];
    const pwd = password || extractPassword(shareUrl);

    console.log('百度网盘 surl:', surl, 'password:', pwd);

    // 2. 访问分享页面，提取 HTML 中的参数
    let bdstoken = '';
    let shareid = '';
    let uk = '';
    
    try {
      const pageRes = await new Promise((resolve, reject) => {
        uni.request({
          url: shareUrl,
          method: 'GET',
          header: {
            'Cookie': baiduCookie,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          },
          success: resolve,
          fail: reject
        });
      });
      
      console.log('已访问分享页面，状态码:', pageRes.statusCode);
      
      if (pageRes.statusCode === 200 && pageRes.data) {
        const html = typeof pageRes.data === 'string' ? pageRes.data : '';
        
        // 提取 bdstoken
        const bdstokenMatch = html.match(/bdstoken["\s:]+["']?([a-z0-9]+)["']?/i);
        if (bdstokenMatch) {
          bdstoken = bdstokenMatch[1];
          console.log('提取到 bdstoken:', bdstoken);
        }
        
        // 提取 shareid
        const shareidMatch = html.match(/shareid["\s:]+["']?(\d+)["']?/i);
        if (shareidMatch) {
          shareid = shareidMatch[1];
          console.log('提取到 shareid:', shareid);
        }
        
        // 提取 uk
        const ukMatch = html.match(/uk["\s:]+["']?(\d+)["']?/i);
        if (ukMatch) {
          uk = ukMatch[1];
          console.log('提取到 uk:', uk);
        }
      }
    } catch (error) {
      console.warn('访问分享页面失败:', error);
    }

    // 3. 验证提取码（如果有）
    if (pwd) {
      try {
        const verifyRes = await new Promise((resolve, reject) => {
          uni.request({
            url: `https://pan.baidu.com/share/verify?surl=${surl}&t=${Date.now()}&channel=chunlei&web=1&app_id=250528&bdstoken=${bdstoken || 'null'}&logid=&clienttype=0`,
            method: 'POST',
            header: {
              'Cookie': baiduCookie,
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Referer': shareUrl,
              'Origin': 'https://pan.baidu.com',
              'X-Requested-With': 'XMLHttpRequest'
            },
            data: `pwd=${pwd}&vcode=&vcode_str=`,
            success: resolve,
            fail: reject
          });
        });

        console.log('百度验证提取码响应:', JSON.stringify(verifyRes.data, null, 2));
        
        if (verifyRes.statusCode === 200 && verifyRes.data.errno === 0) {
          console.log('提取码验证成功，randsk:', verifyRes.data.randsk);
          // 验证成功后，需要更新 Cookie（添加 BDCLND）
          if (verifyRes.data.randsk) {
            baiduCookie += `; BDCLND=${verifyRes.data.randsk}`;
          }
        } else if (verifyRes.data.errno === 105) {
          // errno 105 通常是 Cookie 问题，但如果已经从 HTML 提取到了参数，可以继续尝试
          console.warn('提取码验证返回 105（Cookie问题），但继续尝试使用提取的参数');
          if (!shareid || !uk) {
            throw new Error('Cookie 认证失败（errno 105），且未能从页面提取 shareid/uk 参数');
          }
        } else {
          throw new Error(`提取码验证失败: ${verifyRes.data.err_msg || verifyRes.data.errno}`);
        }
      } catch (error) {
        console.error('百度提取码验证失败:', error);
        // 如果已经有 shareid 和 uk，继续尝试
        if (!shareid || !uk) {
          throw error;
        } else {
          console.warn('虽然验证失败，但已有 shareid/uk，继续尝试获取文件列表');
        }
      }
    }

    // 4. 如果还没有 shareid/uk，尝试从 API 获取
    if (!shareid || !uk) {
      const apiRes = await new Promise((resolve, reject) => {
        uni.request({
          url: `https://pan.baidu.com/share/wxlist`,
          method: 'GET',
          header: {
            'Cookie': baiduCookie,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': shareUrl
          },
          data: {
            channel: 'weixin',
            version: '2.2.2',
            clienttype: 25,
            web: 1,
            shorturl: surl,
            dir: '/',
            root: 1,
            pwd: pwd || '',
            page: 1,
            num: 100
          },
          success: resolve,
          fail: reject
        });
      });

      console.log('百度API响应:', JSON.stringify(apiRes.data, null, 2));

      if (apiRes.statusCode === 200 && apiRes.data && apiRes.data.errno === 0) {
        shareid = shareid || apiRes.data.share_id || apiRes.data.shareid || '';
        uk = uk || apiRes.data.uk || '';
        console.log('从API提取到的参数 - shareid:', shareid, 'uk:', uk);
      } else {
        console.warn('API 获取参数失败，errno:', apiRes.data?.errno);
      }
    }

    if (!shareid || !uk) {
      throw new Error('无法获取百度网盘分享参数（shareid或uk为空）。可能原因：1) Cookie已过期 2) 分享链接已失效 3) 提取码错误');
    }

    console.log('最终使用的参数 - shareid:', shareid, 'uk:', uk, 'bdstoken:', bdstoken);

    console.log('最终使用的参数 - shareid:', shareid, 'uk:', uk, 'bdstoken:', bdstoken);

    // 5. 获取文件列表
    const listRes = await new Promise((resolve, reject) => {
      uni.request({
        url: 'https://pan.baidu.com/share/list',
        method: 'GET',
        header: {
          'Cookie': baiduCookie,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': shareUrl
        },
        data: {
          shareid: shareid,
          uk: uk,
          root: 1,
          page: 1,
          num: 100,
          web: 1,
          channel: 'chunlei',
          clienttype: 0
        },
        success: resolve,
        fail: reject
      });
    });

    console.log('百度文件列表响应:', JSON.stringify(listRes.data, null, 2));

    if (listRes.statusCode !== 200 || !listRes.data || listRes.data.errno !== 0) {
      throw new Error(listRes.data?.show_msg || listRes.data?.errmsg || `获取文件列表失败 errno: ${listRes.data?.errno}`);
    }

    const files = listRes.data.list;
    if (!files || files.length === 0) {
      throw new Error('分享中没有文件');
    }

    const firstFile = files[0];
    const fsId = firstFile.fs_id;

    console.log('第一个文件信息:', JSON.stringify(firstFile, null, 2));

    // 6. 获取下载直链 - 方式1：尝试使用 share/download API
    let downloadUrl = '';
    
    try {
      const downloadRes = await new Promise((resolve, reject) => {
        uni.request({
          url: 'https://pan.baidu.com/share/download',
          method: 'GET',
          header: {
            'Cookie': baiduCookie,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': shareUrl
          },
          data: {
            shareid: shareid,
            uk: uk,
            fid_list: `[${fsId}]`,
            sign: bdstoken || '',
            timestamp: Date.now(),
            channel: 'chunlei',
            web: 1,
            app_id: 250528,
            logid: '',
            clienttype: 0
          },
          success: resolve,
          fail: reject
        });
      });

      console.log('百度下载接口响应 (方式1):', JSON.stringify(downloadRes.data, null, 2));

      if (downloadRes.statusCode === 200 && downloadRes.data && downloadRes.data.errno === 0) {
        downloadUrl = downloadRes.data.dlink ? `https://pan.baidu.com${downloadRes.data.dlink}` : downloadRes.data.list?.[0]?.dlink;
      }
    } catch (error) {
      console.warn('方式1获取下载链接失败:', error);
    }

    // 方式2：优先使用文本文件的 picdocpreview 链接（对文本文件访问限制更少）
    if (!downloadUrl && firstFile.picdocpreview) {
      console.log('使用文本文件预览链接 (picdocpreview)');
      downloadUrl = firstFile.picdocpreview;
    }
    
    // 方式3：如果方式2失败，使用文件的 docpreview 链接
    if (!downloadUrl && firstFile.docpreview) {
      console.log('使用文件预览链接 (docpreview)');
      downloadUrl = firstFile.docpreview;
    }
    
    if (!downloadUrl) {
      throw new Error('无法获取下载链接，所有方法都失败了');
    }
    
    console.log('获取到百度真实下载URL:', downloadUrl);

    return {
      success: true,
      url: downloadUrl,
      filename: firstFile.server_filename,
      expires: 3600
    };

  } catch (error) {
    console.error('解析百度网盘失败:', error);
    return {
      success: false,
      error: error.message || '解析失败'
    };
  }
}

/**
 * 通用解析入口
 */
export async function parseNetdiskUrl(shareUrl, password) {
  if (isQuarkUrl(shareUrl)) {
    return await parseQuarkDirectUrl(shareUrl, password);
  } else if (isBaiduUrl(shareUrl)) {
    return await parseBaiduDirectUrl(shareUrl, password);
  } else {
    // 不是网盘链接，直接返回原始 URL
    return {
      success: true,
      url: shareUrl,
      filename: '',
      expires: 0
    };
  }
}
