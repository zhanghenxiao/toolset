/**
 * 上传小程序书籍数据到云存储（覆盖同名文件，云函数 getBooks 按内容指纹自动识别版本）
 *
 * 用法（PowerShell）:
 *   $env:TENCENTCLOUD_SECRETID="AKIDxxx"
 *   $env:TENCENTCLOUD_SECRETKEY="xxx"
 *   npm run publish:books
 *
 * 也可用 TCB_SECRETID / TCB_SECRETKEY，环境 ID 可用 TCB_ENV_ID 覆盖。
 * 密钥请使用腾讯云访问管理（CAM）子账号，仅授予该云开发环境的存储权限，不要提交到仓库。
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const filePath = path.join(root, 'miniprogram-books/data/books.js');

const ENV_ID = process.env.TCB_ENV_ID || 'cloud1-d7glmnr303314e696';
const CLOUD_PATH = process.env.TCB_BOOKS_CLOUD_PATH || 'books.js';
const SECRET_ID = process.env.TENCENTCLOUD_SECRETID || process.env.TCB_SECRETID || '';
const SECRET_KEY = process.env.TENCENTCLOUD_SECRETKEY || process.env.TCB_SECRETKEY || '';

function fail(msg) {
  console.error(`\n[upload-books] ${msg}\n`);
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  fail(`未找到数据文件：${filePath}\n请先执行 node scripts/sync-miniprogram-books-data.js 生成数据。`);
}

if (!SECRET_ID || !SECRET_KEY) {
  fail(
    [
      '缺少腾讯云 API 密钥，未执行上传。',
      '',
      'PowerShell 临时设置（仅当前窗口有效）：',
      '  $env:TENCENTCLOUD_SECRETID="AKIDxxx"',
      '  $env:TENCENTCLOUD_SECRETKEY="xxx"',
      '',
      '密钥获取：腾讯云控制台 -> 访问管理 -> API 密钥管理，建议用子账号并只授予该环境的存储权限。',
    ].join('\n'),
  );
}

/** 依次尝试多个安装位置，便于「只装这一个包」的轻量用法 */
function loadCloudbaseSdk() {
  const candidates = [
    process.env.TCB_SDK_PATH,
    '@cloudbase/node-sdk',
    path.join(root, 'csdn/.tools/node_modules/@cloudbase/node-sdk'),
    path.join(root, '.tools/node_modules/@cloudbase/node-sdk'),
    path.join(__dirname, '../node_modules/@cloudbase/node-sdk'),
  ].filter(Boolean);

  for (let i = 0; i < candidates.length; i++) {
    try {
      return require(candidates[i]);
    } catch (e) {
      // 继续尝试下一个候选路径
    }
  }
  return null;
}

const cloudbase = loadCloudbaseSdk();
if (!cloudbase) {
  fail(
    [
      '缺少依赖 @cloudbase/node-sdk，未执行上传。三选一：',
      '',
      'A. 在 csdn 目录正常安装（会一并安装 csdn 全部依赖）',
      '   cd d:\\work\\Web\\xiaogj\\csdn',
      '   npm install --no-fund --no-audit',
      '',
      'B. 只装这一个包（体积小，脚本会自动加载）',
      '   mkdir d:\\work\\Web\\xiaogj\\csdn\\.tools',
      '   cd d:\\work\\Web\\xiaogj\\csdn\\.tools',
      '   npm init -y',
      '   npm i @cloudbase/node-sdk --no-fund --no-audit',
      '',
      'C. 手动上传（不装任何东西）',
      '   微信开发者工具 -> 云开发控制台 -> 存储 -> 上传 miniprogram-books/data/books.js 覆盖同名文件',
    ].join('\n'),
  );
}

async function main() {
  const content = fs.readFileSync(filePath);
  const app = cloudbase.init({ env: ENV_ID, secretId: SECRET_ID, secretKey: SECRET_KEY });

  console.log(`[upload-books] 环境 ${ENV_ID}，目标路径 ${CLOUD_PATH}`);
  console.log(`[upload-books] 文件大小 ${(content.length / 1024 / 1024).toFixed(2)} MB`);

  const started = Date.now();
  const res = await app.uploadFile({ cloudPath: CLOUD_PATH, fileContent: content });
  const fileID = (res && res.fileID) || '';

  console.log(`[upload-books] 上传成功，耗时 ${Date.now() - started} ms`);
  if (fileID) console.log(`[upload-books] fileID: ${fileID}`);
  console.log('[upload-books] 云函数内版本缓存 60s 后自动刷新，无需改代码或重新发版。');
}

main().catch((err) => {
  fail(`上传失败：${(err && err.message) || String(err)}`);
});
