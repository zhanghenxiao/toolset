/**
 * 从 uniapp manifest 同步 versionCode / versionName 到 app-version.json
 * apkUrl 在 uniapp-books/app-version.json 中配置（蒲公英直链），sync 不会覆盖
 * 用法: node csdn/scripts/sync-app-version.js
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const manifestPath = path.join(root, 'uniapp-books/src/manifest.json');
const templatePath = path.join(root, 'uniapp-books/app-version.json');
const outPaths = [
  path.join(root, 'app-version.json'),
  path.join(root, 'csdn/static/app-version.json'),
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const manifest = readJson(manifestPath);
const template = readJson(templatePath);

const versionName = manifest.versionName || template.versionName;
const versionCode = Number(manifest.versionCode || template.versionCode);

const payload = {
  ...template,
  versionName,
  versionCode,
  android: {
    wgtUrl: '',
    inAppInstall: true,
    ...template.android,
  },
  updatedAt: new Date().toISOString(),
};

for (const outPath of outPaths) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`已写入 ${outPath}`);
}

console.log(`版本 ${payload.versionName} (versionCode ${payload.versionCode})`);
console.log(`APK: ${payload.android.apkUrl || '(未配置)'}`);
