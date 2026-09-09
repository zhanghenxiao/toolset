/**
 * 将 books/{id}/{书名}1-{章节}章.txt 迁移为 books/{id}{书名}1-{章节}章.txt
 * 用法: node migrate-books-flat.js
 */
const fs = require('fs');
const path = require('path');
const {
  toFlatFilename,
  isBookTxtName,
  getBookPath,
  getPublicBookPath,
  parseBookFilename,
  syncToPublic,
} = require('./book-paths');

const root = path.resolve(__dirname, '../..');
const booksRoot = path.join(root, 'books');
const publicRoot = path.join(root, 'csdn/public/books');

function removeDirIfEmpty(dir) {
  if (!fs.existsSync(dir)) return;
  if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
}

function removeLegacyPublicDir(id) {
  const legacyDir = path.join(publicRoot, String(id));
  if (!fs.existsSync(legacyDir)) return;
  for (const f of fs.readdirSync(legacyDir)) {
    fs.unlinkSync(path.join(legacyDir, f));
  }
  removeDirIfEmpty(legacyDir);
}

function pickMainTxt(dir, id) {
  const txts = fs.readdirSync(dir).filter(isBookTxtName);
  if (txts.length === 0) return null;
  const expected = txts.find((f) => parseBookFilename(toFlatFilename(id, f) || f));
  if (expected) return expected;
  return txts.sort(
    (a, b) => fs.statSync(path.join(dir, b)).size - fs.statSync(path.join(dir, a)).size,
  )[0];
}

const report = [];

for (const name of fs.readdirSync(booksRoot)) {
  const legacyDir = path.join(booksRoot, name);
  if (!fs.statSync(legacyDir).isDirectory() || !/^\d+$/.test(name) || name === '_work') continue;

  const id = Number(name);
  const file = pickMainTxt(legacyDir, id);
  if (!file) {
    removeDirIfEmpty(legacyDir);
    continue;
  }

  const flatName = toFlatFilename(id, file);
  if (!flatName) {
    report.push(`[${id}] 跳过无法解析: ${file}`);
    continue;
  }

  const src = path.join(legacyDir, file);
  const dst = getBookPath(root, flatName);

  if (!fs.existsSync(dst)) {
    fs.renameSync(src, dst);
    report.push(`[${id}] ${file} → ${flatName}`);
  } else if (src !== dst) {
    fs.unlinkSync(src);
    report.push(`[${id}] 删除重复: ${file}（已存在 ${flatName}）`);
  }

  syncToPublic(root, flatName);
  removeLegacyPublicDir(id);

  for (const leftover of fs.readdirSync(legacyDir)) {
    if (isBookTxtName(leftover)) {
      fs.unlinkSync(path.join(legacyDir, leftover));
      report.push(`[${id}] 删除多余: ${leftover}`);
    }
  }
  removeDirIfEmpty(legacyDir);
}

// 清理 public 下遗留的 id 子目录
if (fs.existsSync(publicRoot)) {
  for (const name of fs.readdirSync(publicRoot)) {
    const dir = path.join(publicRoot, name);
    if (fs.statSync(dir).isDirectory() && /^\d+$/.test(name)) {
      removeLegacyPublicDir(name);
      report.push(`[public/${name}] 删除旧目录`);
    }
  }
}

console.log(report.join('\n') || '无需迁移');
console.log(`\n完成，共 ${report.length} 项操作`);
