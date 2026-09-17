const cloud = require('wx-server-sdk');
const https = require('https');
const crypto = require('crypto');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// 云存储中的书籍数据文件（重新生成数据后覆盖上传到同一路径即可）
// 如后续调整路径/版本，只需修改此处
const BOOKS_FILE_ID =
  'cloud://cloud1-d7glmnr303314e696.636c-cloud1-d7glmnr303314e696-1452258687/books.js';

// 版本信息在函数实例内缓存，避免每次调用都去探测文件
const VERSION_TTL = 60 * 1000;
let versionCache = null;

/**
 * 通过临时链接的响应头取内容指纹：
 * ETag 由 COS 按文件内容计算（内容变则变），最可靠；退化到 大小 + 修改时间。
 * 只读取响应头，拿到后立刻断开，不下载文件本体。
 */
function fetchVersionByHeader(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      const etag = res.headers.etag;
      const size = res.headers['content-length'];
      const mtime = res.headers['last-modified'];

      if (res.statusCode !== 200) {
        res.destroy();
        reject(new Error(`http ${res.statusCode}`));
        return;
      }

      let fingerprint = '';
      if (etag) fingerprint = String(etag).replace(/"/g, '');
      else if (size) fingerprint = `${size}-${mtime || ''}`;

      res.destroy();

      if (!fingerprint) reject(new Error('no version header'));
      else resolve(fingerprint);
    });

    req.on('error', reject);
    req.setTimeout(10000, () => req.destroy(new Error('http timeout')));
  });
}

// 兜底：完整下载后按内容哈希（仅在响应头拿不到指纹时使用）
async function fetchVersionByHash() {
  const res = await cloud.downloadFile({ fileID: BOOKS_FILE_ID });
  const buf = res && res.fileContent;
  if (!buf) throw new Error('downloadFile empty');
  return crypto.createHash('sha1').update(buf).digest('hex').slice(0, 16);
}

async function resolveVersion(tempFileURL) {
  if (versionCache && Date.now() < versionCache.exp) return versionCache.version;

  let version;
  try {
    version = await fetchVersionByHeader(tempFileURL);
  } catch (e) {
    version = await fetchVersionByHash();
  }

  versionCache = { version, exp: Date.now() + VERSION_TTL };
  return version;
}

exports.main = async () => {
  try {
    const res = await cloud.getTempFileURL({ fileList: [BOOKS_FILE_ID] });
    const info = (res.fileList && res.fileList[0]) || {};

    if (info.status !== 0 || !info.tempFileURL) {
      // status/errMsg 原样带回，便于在客户端直接看到服务端拒绝原因
      return {
        ok: false,
        errMsg: `临时链接获取失败 status=${info.status} ${info.errMsg || 'tempFileURL 为空'}`,
        fileID: BOOKS_FILE_ID,
      };
    }

    // 版本探测失败不影响数据下发，只是退化为「无自动刷新」
    let version = '';
    try {
      version = await resolveVersion(info.tempFileURL);
    } catch (e) {
      console.log('[getBooks] 版本探测失败（不影响下载）：', (e && e.message) || e);
    }

    return {
      ok: true,
      fileID: BOOKS_FILE_ID,
      url: info.tempFileURL,
      // 数据版本：客户端用它判断本地缓存是否可用，数据更新后自动失效，无需手工维护
      version,
    };
  } catch (err) {
    return { ok: false, errMsg: (err && (err.errMsg || err.message)) || String(err) };
  }
};
