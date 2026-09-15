/**
 * 将书籍封面复制到站点根目录 book-covers/（稳定 URL，供小程序与 Pages 使用）
 * 用法: node csdn/scripts/sync-book-covers.js
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const sourceCoverDir = path.join(root, 'csdn/src/assets/images/books');
const outDir = path.join(root, 'book-covers');

function sourcePathForId(id) {
  if (id === 145) {
    const wudao = path.join(sourceCoverDir, 'wudao-154.jpg');
    if (fs.existsSync(wudao)) return wudao;
  }
  return path.join(sourceCoverDir, `book-${id}.jpg`);
}

function main() {
  if (!fs.existsSync(sourceCoverDir)) {
    console.error('源封面目录不存在:', sourceCoverDir);
    process.exit(1);
  }

  fs.mkdirSync(outDir, { recursive: true });

  let copied = 0;
  let skipped = 0;
  let missing = 0;

  const files = fs.readdirSync(sourceCoverDir);
  const ids = new Set();
  for (const file of files) {
    const m = file.match(/^book-((?:s\d+|\d+))\.jpg$/);
    if (m) ids.add(m[1]);
  }
  if (fs.existsSync(path.join(sourceCoverDir, 'wudao-154.jpg'))) {
    ids.add(145);
  }

  for (const id of [...ids].sort((a, b) => {
    const sa = String(a);
    const sb = String(b);
    const aj = /^s\d+$/.test(sa);
    const bj = /^s\d+$/.test(sb);
    if (aj !== bj) return aj ? 1 : -1;
    if (aj) return sa.localeCompare(sb);
    return Number(sa) - Number(sb);
  })) {
    const src = sourcePathForId(id);
    const dest = path.join(outDir, `book-${id}.jpg`);
    if (!fs.existsSync(src)) {
      missing++;
      continue;
    }
    const srcStat = fs.statSync(src);
    if (fs.existsSync(dest)) {
      const destStat = fs.statSync(dest);
      if (destStat.mtimeMs >= srcStat.mtimeMs && destStat.size === srcStat.size) {
        skipped++;
        continue;
      }
    }
    fs.copyFileSync(src, dest);
    copied++;
  }

  console.log(`book-covers: 新增/更新 ${copied}，已是最新 ${skipped}，源缺失 ${missing}`);
  console.log(`输出目录: ${outDir}`);
}

main();
