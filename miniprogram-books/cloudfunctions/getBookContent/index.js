/**
 * getBookContent 云函数
 *
 * 小程序客户端无法直连夸克/百度网盘（域名白名单限制），因此把「解析网盘分享 → 下载正文」
 * 放到服务端执行。本函数返回云存储中正文文件的 fileID / 临时链接，客户端用 wx.cloud.downloadFile
 * 拉取（不占 downloadFile 白名单配额），本地再用 chapter-parser 切章。
 *
 * 入参：{ readUrl: string, password?: string }
 * 出参：{ ok, fileID, url, cached, errMsg? }
 */
const cloud = require('wx-server-sdk');
const https = require('https');
const http = require('http');
const url = require('url');
const zlib = require('zlib');
const crypto = require('crypto');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const cfg = require('./config');

// 网盘 Cookie 优先级：云数据库 app_config > 环境变量 > config.js 默认值
// 数据库改 Cookie 无需重新部署云函数
const COOKIE_COLLECTION = 'app_config';
const COOKIE_DOC_KEY = 'netdisk';
const COOKIE_CACHE_MS = 60 * 1000;
let cookieCache = { data: null, ts: 0 };
// 当前实例生效的 Cookie（main 入口加载后供解析函数使用）
let cookies = { quarkCookie: '', baiduCookie: '' };

async function loadCookieConfig() {
  // 短缓存：云函数实例复用时避免每次都查库（改库后最多 60 秒生效）
  if (cookieCache.data && Date.now() - cookieCache.ts < COOKIE_CACHE_MS) {
    return cookieCache.data;
  }
  const fallback = {
    quarkCookie: process.env.QUARK_COOKIE || cfg.quarkCookie || '',
    baiduCookie: process.env.BAIDU_COOKIE || cfg.baiduCookie || '',
  };
  try {
    const db = cloud.database();
    const res = await db
      .collection(COOKIE_COLLECTION)
      .where({ key: COOKIE_DOC_KEY })
      .limit(1)
      .get();
    const doc = res.data && res.data[0];
    const merged = doc
      ? {
          quarkCookie: doc.quarkCookie || fallback.quarkCookie,
          baiduCookie: doc.baiduCookie || fallback.baiduCookie,
        }
      : fallback;
    cookieCache = { data: merged, ts: Date.now() };
    return merged;
  } catch (e) {
    // 集合不存在 / 无权限等：静默回退环境变量
    cookieCache = { data: fallback, ts: Date.now() };
    return fallback;
  }
}

// 云存储文件前缀（与 getBooks 同环境，从 getBooks 的 BOOKS_FILE_ID 提取）
const CLOUD_PREFIX = 'cloud://cloud1-d7glmnr303314e696.636c-cloud1-d7glmnr303314e696-1452258687';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/* ---------------- 基础 HTTP 请求（内置重定向/gzip/br 处理） ---------------- */

function httpRequest(method, urlStr, { headers = {}, json, form, timeout = 15000, redirects = 5 } = {}) {
  return new Promise((resolve, reject) => {
    const parsed = url.parse(urlStr);
    const lib = parsed.protocol === 'http:' ? http : https;
    const reqHeaders = Object.assign({ 'User-Agent': UA, Accept: 'application/json, text/plain, */*' }, headers);

    let body = null;
    if (json !== undefined) {
      body = JSON.stringify(json);
      reqHeaders['Content-Type'] = 'application/json';
    } else if (form !== undefined) {
      body = Object.keys(form)
        .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(form[k])}`)
        .join('&');
      reqHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    const options = {
      method,
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'http:' ? 80 : 443),
      path: parsed.path,
      headers: reqHeaders,
      timeout,
    };

    const req = lib.request(options, (res) => {
      const { statusCode, headers: h } = res;
      if (redirects > 0 && [301, 302, 303, 307, 308].includes(statusCode) && h.location) {
        res.resume();
        const next = url.resolve(urlStr, h.location);
        const nextMethod = statusCode === 307 || statusCode === 308 ? method : 'GET';
        return resolve(httpRequest(nextMethod, next, { headers, json, form, timeout, redirects: redirects - 1 }));
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        let buffer = Buffer.concat(chunks);
        const enc = (h['content-encoding'] || '').toLowerCase();
        try {
          if (enc === 'gzip') buffer = zlib.gunzipSync(buffer);
          else if (enc === 'deflate') buffer = zlib.inflateSync(buffer);
          else if (enc === 'br') buffer = zlib.brotliDecompressSync(buffer);
        } catch (e) {
          // 解压失败则保留原始内容
        }
        resolve({ statusCode, headers: h, body: buffer.toString('utf8'), raw: buffer });
      });
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('http timeout')));
    if (body) req.write(body);
    req.end();
  });
}

/* ---------------- 网盘解析（移植自 uniapp-books pan-parser.js） ---------------- */

function extractPassword(u) {
  const m = u.match(/[?&]pwd=([^&]+)/i);
  return m ? m[1] : '';
}

function isQuarkUrl(u) {
  return /pan\.quark\.cn/i.test(u);
}
function isBaiduUrl(u) {
  return /pan\.baidu\.com|pcs\.baidu\.com|pcsdata\.baidu\.com/i.test(u);
}

async function parseQuarkDirectUrl(shareUrl, password) {
  const quarkCookie = cookies.quarkCookie;
  if (!quarkCookie) throw new Error('未配置夸克网盘 Cookie（请在云数据库 app_config 或环境变量 QUARK_COOKIE 中设置）');

  const m = shareUrl.match(/pan\.quark\.cn\/s\/([a-zA-Z0-9]+)/);
  if (!m) throw new Error('无效的夸克分享链接');
  const pwdId = m[1];
  const pwd = password || extractPassword(shareUrl);

  const tokenRes = await httpRequest('POST', 'https://drive-pc.quark.cn/1/clouddrive/share/sharepage/token', {
    headers: { Cookie: quarkCookie, Referer: shareUrl, Origin: 'https://pan.quark.cn' },
    json: { pwd_id: pwdId, passcode: pwd || '' },
  });
  if (tokenRes.statusCode !== 200 || !tokenRes.body) {
    throw new Error(`获取夸克分享 token 失败 http ${tokenRes.statusCode}（Cookie 可能过期）`);
  }
  const tokenJson = safeJson(tokenRes.body);
  if (!tokenJson || tokenJson.code !== 0) {
    throw new Error(tokenJson?.message || '获取夸克分享 token 失败（Cookie 可能过期或链接失效）');
  }
  const stoken = tokenJson.data?.stoken;
  if (!stoken) throw new Error('未能获取有效的夸克 stoken');

  const detailParams = [
    'pwd_id=' + encodeURIComponent(pwdId),
    'passcode=' + encodeURIComponent(pwd || ''),
    'stoken=' + encodeURIComponent(stoken),
    'pdir_fid=0',
    'force=0',
    '_page=1',
    '_size=50',
    '_fetch_banner=1',
    '_fetch_share=1',
    '_sort=file_type:asc,updated_at:desc',
  ].join('&');
  const detailRes = await httpRequest(
    'GET',
    `https://drive-pc.quark.cn/1/clouddrive/share/sharepage/detail?${detailParams}`,
    { headers: { Cookie: quarkCookie, Referer: shareUrl, Origin: 'https://pan.quark.cn' } },
  );
  if (detailRes.statusCode !== 200) throw new Error('获取夸克分享详情失败（网络）');
  const detailJson = safeJson(detailRes.body);
  if (!detailJson || detailJson.code !== 0) throw new Error(detailJson?.message || '获取夸克分享详情失败');

  const files = detailJson.data?.list || [];
  if (!files.length) throw new Error('分享中没有文件');
  const first = files[0];
  const fid = first.fid;
  const shareFidToken = first.share_fid_token || '';

  const dlRes = await httpRequest('POST', `https://drive-pc.quark.cn/1/clouddrive/file/download?pr=ucpro&fr=pc&uc_param_str=&__dt=&__t=${Date.now()}`, {
    headers: { Cookie: quarkCookie, Referer: shareUrl, Origin: 'https://pan.quark.cn' },
    json: { fids: [fid], share_fid_token_list: [shareFidToken] },
  });
  if (dlRes.statusCode !== 200 || !dlRes.body) throw new Error('调用夸克下载接口失败');
  const dlJson = safeJson(dlRes.body);
  const downloadData = dlJson?.data;
  if (!downloadData || !downloadData.length) throw new Error(dlJson?.message || '未获取到下载链接');
  const downloadUrl = downloadData[0]?.download_url;
  if (!downloadUrl) throw new Error('下载链接为空');
  return downloadUrl;
}

async function parseBaiduDirectUrl(shareUrl, password) {
  const baiduCookie = cookies.baiduCookie;
  if (!baiduCookie) throw new Error('未配置百度网盘 Cookie（请在云数据库 app_config 或环境变量 BAIDU_COOKIE 中设置）');

  const m = shareUrl.match(/pan\.baidu\.com\/s\/([a-zA-Z0-9_-]+)/);
  if (!m) throw new Error('无效的百度分享链接');
  const surl = m[1];
  const pwd = password || extractPassword(shareUrl);

  let bdstoken = '';
  let shareid = '';
  let uk = '';

  // 1. 抓取分享页 HTML，提取参数
  try {
    const pageRes = await httpRequest('GET', shareUrl, { headers: { Cookie: baiduCookie } });
    if (pageRes.statusCode === 200) {
      const html = pageRes.body || '';
      const bt = html.match(/bdstoken["\s:]+["']?([a-z0-9]+)["']?/i);
      if (bt) bdstoken = bt[1];
      const si = html.match(/shareid["\s:]+["']?(\d+)["']?/i);
      if (si) shareid = si[1];
      const ukM = html.match(/uk["\s:]+["']?(\d+)["']?/i);
      if (ukM) uk = ukM[1];
    }
  } catch (e) {
    // 忽略页面抓取失败，后面尝试用 API
  }

  // 2. 提取码验证
  if (pwd) {
    try {
      const vRes = await httpRequest('POST', `https://pan.baidu.com/share/verify?surl=${surl}&t=${Date.now()}&channel=chunlei&web=1&app_id=250528&bdstoken=${bdstoken || 'null'}&logid=&clienttype=0`, {
        headers: { Cookie: baiduCookie, Referer: shareUrl, Origin: 'https://pan.baidu.com', 'X-Requested-With': 'XMLHttpRequest' },
        form: { pwd, vcode: '', vcode_str: '' },
      });
      const vJson = safeJson(vRes.body);
      if (vRes.statusCode === 200 && vJson?.errno === 0 && vJson.randsk) {
        baiduCookieForDownload = `${baiduCookie}; BDCLND=${vJson.randsk}`;
      } else if (vJson?.errno === 105 && (!shareid || !uk)) {
        throw new Error('Cookie 认证失败（errno 105），且未能从页面提取 shareid/uk');
      }
    } catch (e) {
      if (!shareid || !uk) throw e;
    }
  }

  // 3. 若仍缺参数，用 wxlist 接口补充
  if (!shareid || !uk) {
    const apiRes2 = await httpRequest('GET', `https://pan.baidu.com/share/wxlist?channel=weixin&version=2.2.2&clienttype=25&web=1&shorturl=${surl}&dir=/&root=1&pwd=${pwd || ''}&page=1&num=100`, {
      headers: { Cookie: baiduCookieForDownload, Referer: shareUrl },
    });
    const aJson = safeJson(apiRes2.body);
    if (aJson?.errno === 0) {
      shareid = shareid || aJson.share_id || aJson.shareid || '';
      uk = uk || aJson.uk || '';
    }
  }

  if (!shareid || !uk) {
    throw new Error('无法获取百度网盘分享参数（Cookie 可能过期 / 链接失效 / 提取码错误）');
  }

  // 4. 文件列表
  const listRes = await httpRequest('GET', `https://pan.baidu.com/share/list?shareid=${shareid}&uk=${uk}&root=1&page=1&num=100&web=1&channel=chunlei&clienttype=0`, {
    headers: { Cookie: baiduCookieForDownload, Referer: shareUrl },
  });
  const lJson = safeJson(listRes.body);
  if (listRes.statusCode !== 200 || !lJson || lJson.errno !== 0) {
    throw new Error(lJson?.show_msg || lJson?.errmsg || `获取文件列表失败 errno: ${lJson?.errno}`);
  }
  const files = lJson.list;
  if (!files || !files.length) throw new Error('分享中没有文件');
  const first = files[0];
  const fsId = first.fs_id;

  // 5. 下载直链
  let downloadUrl = '';
  try {
    const dlRes = await httpRequest('GET', `https://pan.baidu.com/share/download?shareid=${shareid}&uk=${uk}&fid_list=[${fsId}]&sign=${bdstoken || ''}&timestamp=${Date.now()}&channel=chunlei&web=1&app_id=250528&logid=&clienttype=0`, {
      headers: { Cookie: baiduCookieForDownload, Referer: shareUrl },
    });
    const dJson = safeJson(dlRes.body);
    if (dlRes.statusCode === 200 && dJson?.errno === 0) {
      downloadUrl = dJson.dlink ? `https://pan.baidu.com${dJson.dlink}` : dJson.list?.[0]?.dlink;
    }
  } catch (e) {
    // 忽略，尝试预览链接兜底
  }
  if (!downloadUrl && first.picdocpreview) downloadUrl = first.picdocpreview;
  if (!downloadUrl && first.docpreview) downloadUrl = first.docpreview;
  if (!downloadUrl) throw new Error('无法获取百度下载链接');
  return downloadUrl;
}

// 百度下载用的 Cookie（验证后可能追加 BDCLND）
let baiduCookieForDownload = '';

function safeJson(str) {
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
}

async function parseNetdiskUrl(shareUrl, password) {
  if (isQuarkUrl(shareUrl)) return parseQuarkDirectUrl(shareUrl, password);
  if (isBaiduUrl(shareUrl)) return parseBaiduDirectUrl(shareUrl, password);
  // 非网盘链接：原样返回（理论上不会发生）
  return shareUrl;
}

/* ---------------- 下载正文 ---------------- */

/**
 * 下载正文
 * 夸克/百度的直链都带有防盗链校验：缺 Referer 会直接 403。
 * 这里按「Cookie + Referer → 带 Range → 仅 Cookie → 裸请求」依次尝试，
 * 只有 403 才继续换请求头重试，其它状态码直接失败。
 */
async function downloadText(downloadUrl, cookie, referer) {
  const attempts = [];
  if (cookie) attempts.push({ Cookie: cookie, Referer: referer });
  if (cookie) attempts.push({ Cookie: cookie, Referer: referer, Range: 'bytes=0-' });
  if (cookie) attempts.push({ Cookie: cookie });
  attempts.push({ Referer: referer, Range: 'bytes=0-' });
  attempts.push({});

  let last = null;
  for (let i = 0; i < attempts.length; i++) {
    const res = await httpRequest('GET', downloadUrl, {
      headers: Object.assign({ Accept: '*/*' }, attempts[i]),
      timeout: 30000,
      redirects: 5,
    });
    last = res;
    if (res.statusCode === 200 || res.statusCode === 206) {
      let text = res.body || '';
      if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // 去 BOM
      return text;
    }
    // 非 403（如 404 / 451）再换头也没用，直接跳出
    if (res.statusCode !== 403) break;
  }

  const snippet = ((last && last.body) || '').replace(/\s+/g, ' ').slice(0, 120);
  throw new Error(
    `下载正文失败 http ${last ? last.statusCode : 'unknown'}${snippet ? `｜响应：${snippet}` : ''}`,
  );
}

/* ---------------- 云存储缓存 ---------------- */

function contentFileID(hash) {
  return `${CLOUD_PREFIX}/parsed/${hash}.txt`;
}

async function getCachedUrl(fileID) {
  try {
    const res = await cloud.getTempFileURL({ fileList: [fileID] });
    const info = res.fileList && res.fileList[0];
    if (info && info.status === 0 && info.tempFileURL) return info.tempFileURL;
  } catch (e) {
    // 缓存未命中
  }
  return '';
}

async function uploadAndGetUrl(fileID, content) {
  await cloud.uploadFile({ cloudPath: fileID.replace(CLOUD_PREFIX + '/', ''), fileContent: Buffer.from(content, 'utf8') });
  const res = await cloud.getTempFileURL({ fileList: [fileID] });
  const info = res.fileList && res.fileList[0];
  return (info && info.tempFileURL) || '';
}

/* ---------------- 入口 ---------------- */

exports.main = async (event = {}) => {
  try {
    const readUrl = (event.readUrl || '').trim();
    const password = event.password || '';
    if (!readUrl) return { ok: false, errMsg: '缺少 readUrl' };

    const hash = crypto.createHash('md5').update(readUrl).digest('hex');
    const fileID = contentFileID(hash);

    // 命中缓存则直接返回（云存储按 readUrl 哈希存储，正文更新需换链接或清缓存）
    const cachedUrl = await getCachedUrl(fileID);
    if (cachedUrl) {
      return { ok: true, fileID, url: cachedUrl, cached: true };
    }

    cookies = await loadCookieConfig();
    baiduCookieForDownload = cookies.baiduCookie; // 重置（云函数实例复用）
    const downloadUrl = await parseNetdiskUrl(readUrl, password);
    const cookie = isQuarkUrl(readUrl) ? cookies.quarkCookie : baiduCookieForDownload;
    const referer = isQuarkUrl(readUrl) ? 'https://pan.quark.cn/' : 'https://pan.baidu.com/';
    const text = await downloadText(downloadUrl, cookie, referer);

    if (!text || !text.trim()) {
      return { ok: false, errMsg: '解析成功但正文为空（链接可能已失效）' };
    }

    const url = await uploadAndGetUrl(fileID, text);
    if (!url) return { ok: false, errMsg: '正文已解析，但写入云存储失败' };
    return { ok: true, fileID, url, cached: false };
  } catch (err) {
    return { ok: false, errMsg: (err && (err.errMsg || err.message)) || String(err) };
  }
};
