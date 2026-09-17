/**
 * 从 uniapp manifest 同步版本号，生成可部署的 app-version.json
 * APK / wgt 托管在 GitHub Releases，见 uniapp-books/app-version.json
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

/** GitHub Releases 资源（固定文件名，latest 始终指向最新 Release） */
const GITHUB_REPO = 'zhanghenxiao/toolset';
const RELEASE_ASSETS = {
  apk: 'shuweitansuo.apk',
  wgt: 'shuweitansuo.wgt',
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function githubReleaseUrl(filename) {
  return `https://github.com/${GITHUB_REPO}/releases/latest/download/${filename}`;
}

function ensureGithubUrls(template) {
  const android = { ...(template.android || {}) };
  if (!android.apkUrl || android.apkUrl.includes('github.com')) {
    android.apkUrl = githubReleaseUrl(RELEASE_ASSETS.apk);
  }
  if (!android.wgtUrl || android.wgtUrl.includes('github.com')) {
    android.wgtUrl = githubReleaseUrl(RELEASE_ASSETS.wgt);
  }
  return { ...template, android };
}

const manifest = readJson(manifestPath);
const template = ensureGithubUrls(readJson(templatePath));

const payload = {
  ...template,
  versionName: manifest.versionName || template.versionName,
  versionCode: Number(manifest.versionCode || template.versionCode),
  updatedAt: new Date().toISOString(),
};

for (const outPath of outPaths) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`已写入 ${outPath}`);
}

console.log(`版本 ${payload.versionName} (${payload.versionCode})`);
console.log(`APK: ${payload.android.apkUrl}`);
