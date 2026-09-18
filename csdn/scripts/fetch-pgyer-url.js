const fs = require('fs');
const path = require('path');
const https = require('https');

const root = path.resolve(__dirname, '../..');
const args = process.argv.slice(2);
const writeMode = args.includes('--write');
const pageUrl = args.find((a) => !a.startsWith('--')) || 'https://www.pgyer.com/shuweitansuo';

const appVersionJsonPath = path.join(root, 'uniapp-books/app-version.json');
const appVersionJsPath = path.join(root, 'uniapp-books/src/utils/app-version.js');

function get(url, opts = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 12)' }, ...opts }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : `https://www.pgyer.com${res.headers.location}`;
        return resolve(get(next, opts));
      }
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

(async () => {
  const { body } = await get(pageUrl);
  const appKey = body.match(/aKey\s*=\s*'([a-f0-9]+)'/i)?.[1]
    || body.match(/appKey\s*[:=]\s*['"]([a-f0-9]+)['"]/i)?.[1];
  const buildKey = body.match(/buildKey\s*[:=]\s*['"]([a-f0-9]+)['"]/i)?.[1]
    || body.match(/bKey\s*=\s*'([a-f0-9]+)'/i)?.[1];
  const buildPassword = body.match(/authCode\s*=\s*'([^']*)'/)?.[1] || '';

  console.log('页面:', pageUrl);
  console.log('appKey:', appKey || '(未找到)');
  console.log('buildKey:', buildKey || '(未找到)');
  console.log('安装密码:', buildPassword ? '(有)' : '(无)');

  const downloadUrls = [...body.matchAll(/https?:\/\/download\.pgyer\.com\/[^\s"'<>]+/g)].map((m) => m[0]);
  if (downloadUrls.length) {
    console.log('\n页面内 APK CDN 直链:');
    [...new Set(downloadUrls)].forEach((u) => console.log(' ', u));
  }

  console.log('\n--- 说明 ---');
  console.log('https://www.pgyer.com/shuweitansuo 是「安装页」，不是 APK 文件直链。');
  console.log('点「安装」时，浏览器会走蒲公英接口再 302 到 oss.pgyer.com（每次可能不同）。');
  console.log('上传新版本后 aKey 可能变化，请用本脚本重新解析并更新 app-version.json 的 apkUrl。');

  const installUrl = appKey ? `https://www.pgyer.com/app/install/${appKey}` : '';

  if (installUrl) {
    console.log('\n应用内自动更新推荐配置（Web 安装接口，302 到最新 APK，无需 API Key）:');
    console.log(installUrl);
    console.log('下载时建议追加 ?time= 时间戳；App 内 downloadFile 会跟随 302 到 oss.pgyer.com');
  }

  if (writeMode && installUrl) {
    writeApkUrl(installUrl);
  } else if (writeMode && !installUrl) {
    console.error('\n未解析到 appKey，无法写入。');
    process.exit(1);
  } else if (installUrl) {
    console.log('\n写入配置: node csdn/scripts/fetch-pgyer-url.js --write', pageUrl);
    console.log('然后: node csdn/scripts/sync-app-version.js  （同步到 toolset.site/app-version.json）');
  }

  // 尝试公开 view 接口
  if (appKey) {
    for (const path of [
      `/apiv2/app/view?appKey=${appKey}`,
      `/apiv2/app/check?appKey=${appKey}`,
    ]) {
      try {
        const r = await get(`https://www.pgyer.com${path}`);
        console.log(`\n${path} => HTTP ${r.status}`);
        console.log(r.body.slice(0, 400));
      } catch (e) {
        console.log(path, e.message);
      }
    }
  }
})();

function writeApkUrl(installUrl) {
  const appVersion = JSON.parse(fs.readFileSync(appVersionJsonPath, 'utf8'));
  appVersion.android = { wgtUrl: '', inAppInstall: true, ...appVersion.android, apkUrl: installUrl };
  fs.writeFileSync(appVersionJsonPath, `${JSON.stringify(appVersion, null, 2)}\n`, 'utf8');
  console.log(`\n已写入 ${appVersionJsonPath}`);
  console.log(`  android.apkUrl = ${installUrl}`);

  let js = fs.readFileSync(appVersionJsPath, 'utf8');
  const next = js.replace(
    /export const DEFAULT_ANDROID_APK_URL\s*=\s*\n?\s*'[^']*';/,
    `export const DEFAULT_ANDROID_APK_URL =\n  '${installUrl}';`,
  );
  if (next === js) {
    console.warn(`未匹配到 DEFAULT_ANDROID_APK_URL，请手动更新 ${appVersionJsPath}`);
  } else {
    fs.writeFileSync(appVersionJsPath, next, 'utf8');
    console.log(`已写入 ${appVersionJsPath}`);
    console.log('  DEFAULT_ANDROID_APK_URL');
  }

  console.log('\n下一步: node csdn/scripts/sync-app-version.js');
  console.log('然后 deploy 网站，使 toolset.site/app-version.json 生效');
}
