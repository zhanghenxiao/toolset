/**
 * 每个 books/ 只保留扁平 TXT：{id}_{书名}1-{章节}章.txt
 * 删除 part*.txt、towan*.txt 及多余副本
 */
const fs = require('fs');
const path = require('path');
const {
  discoverBooks,
  getBookPath,
  isBookTxtName,
  toFlatFilename,
} = require('./book-paths');

const root = path.resolve(__dirname, '../..');
const booksRoot = path.join(root, 'books');
const booksDataPath = path.join(root, 'csdn/src/data/booksData.js');

const data = fs.readFileSync(booksDataPath, 'utf8');
const expectedById = new Map(
  [...data.matchAll(/id: (\d+),[\s\S]*?downloadUrl: "([^"]+)"/g)]
    .map((m) => [Number(m[1]), path.basename(m[2])]),
);

function cleanupLegacyDir(dir, id) {
  if (!fs.existsSync(dir)) return { deleted: [], kept: null };
  const txts = fs.readdirSync(dir).filter(isBookTxtName);
  const expected = expectedById.get(id);
  const keepLegacy = expected
    ? txts.find((f) => toFlatFilename(id, f) === expected || f === expected)
    : null;
  const keep = keepLegacy || txts.sort(
    (a, b) => fs.statSync(path.join(dir, b)).size - fs.statSync(path.join(dir, a)).size,
  )[0] || null;

  const deleted = [];
  for (const f of txts) {
    if (f !== keep) {
      fs.unlinkSync(path.join(dir, f));
      deleted.push(f);
    }
  }
  return { deleted, kept: keep };
}

let totalDeleted = 0;
const report = [];

for (const name of fs.readdirSync(booksRoot)) {
  const full = path.join(booksRoot, name);
  if (!fs.statSync(full).isDirectory() || !/^\d+$/.test(name) || name === '_work') continue;

  const id = Number(name);
  const { deleted, kept } = cleanupLegacyDir(full, id);
  if (deleted.length) {
    report.push(`[${id}] 删除 ${deleted.join(', ')}，保留 ${kept || '(无)'}`);
    totalDeleted += deleted.length;
  }

  if (kept) {
    const flatName = toFlatFilename(id, kept);
    fs.renameSync(path.join(full, kept), getBookPath(root, flatName));
    if (fs.readdirSync(full).length === 0) fs.rmdirSync(full);
  }
}

console.log(report.join('\n') || '所有目录已符合要求，无需删除');
console.log(`\n共删除 ${totalDeleted} 个文件`);
console.log(`扁平 TXT 共 ${discoverBooks(booksRoot).length} 本`);
