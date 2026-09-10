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
  parseBookFilename,
} = require('./book-paths');

const root = path.resolve(__dirname, '../..');
const booksRoot = path.join(root, 'books');

function removeDirIfEmpty(dir) {
  if (!fs.existsSync(dir)) return;
  if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
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

  for (const leftover of fs.readdirSync(legacyDir)) {
    if (isBookTxtName(leftover)) {
      fs.unlinkSync(path.join(legacyDir, leftover));
      report.push(`[${id}] 删除多余: ${leftover}`);
    }
  }
  removeDirIfEmpty(legacyDir);
}

console.log(report.join('\n') || '无需迁移');
console.log(`\n完成，共 ${report.length} 项操作`);
