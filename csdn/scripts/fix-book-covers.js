/**
 * 重新下载损坏的书籍封面（非 JPEG 或过小文件）
 * 用法: node csdn/scripts/fix-book-covers.js [startId] [endId]
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { discoverBooks, isJcxsId, deqixsCoverUrl } = require('./book-paths');

const root = path.resolve(__dirname, '../..');
const coverDir = path.join(root, 'csdn/src/assets/images/books');
const startId = Number(process.argv[2] || 1000);
const endId = Number(process.argv[3] || 9999);
const DELAY_MS = 200;

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function isValidJpeg(filePath) {
  if (!fs.existsSync(filePath)) return false;
  const buf = fs.readFileSync(filePath);
  return buf.length > 500 && buf[0] === 0xff && buf[1] === 0xd8;
}

function curlCover(url, dest) {
  execSync(`curl.exe -sL -o "${dest}" "${url}"`, { stdio: 'pipe' });
}

function coverUrlForId(id) {
  if (isJcxsId(id)) {
    const siteId = String(id).slice(1);
    return `https://www.jcxs.org/img/${siteId}.jpg`;
  }
  return deqixsCoverUrl(id);
}

const idSet = new Set();
for (const book of discoverBooks(path.join(root, 'books'))) {
  if (isJcxsId(book.id)) idSet.add(book.id);
  else {
    const n = Number(book.id);
    if (n >= startId && n <= endId) idSet.add(n);
  }
}
for (const file of fs.readdirSync(coverDir)) {
  const m = file.match(/^book-((?:s\d+|\d+))\.jpg$/);
  if (!m) continue;
  const id = /^s/.test(m[1]) ? m[1] : Number(m[1]);
  if (isJcxsId(id) || (Number(id) >= startId && Number(id) <= endId)) {
    idSet.add(id);
  }
}
const targets = [...idSet].sort((a, b) => {
  const sa = String(a);
  const sb = String(b);
  const aj = /^s/.test(sa);
  const bj = /^s/.test(sb);
  if (aj !== bj) return aj ? 1 : -1;
  if (aj) return sa.localeCompare(sb);
  return Number(sa) - Number(sb);
});

let fixed = 0;
let skipped = 0;
let failed = 0;

for (const id of targets) {
  const dest = path.join(coverDir, `book-${id}.jpg`);
  if (isValidJpeg(dest)) {
    skipped++;
    continue;
  }
  const url = coverUrlForId(id);
  try {
    curlCover(url, dest);
    if (!isValidJpeg(dest)) {
      console.warn(`  [${id}] 仍无效: ${url}`);
      failed++;
    } else {
      console.log(`  [${id}] 已修复`);
      fixed++;
    }
  } catch (e) {
    console.warn(`  [${id}] 失败: ${e.message}`);
    failed++;
  }
  sleep(DELAY_MS);
}

console.log(`完成: 修复 ${fixed}，跳过 ${skipped}，失败 ${failed}`);
