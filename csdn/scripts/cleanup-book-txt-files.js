/**
 * 每个 books/ 只保留扁平 TXT：{id}{书名}1-{章节}章.txt
 * 删除 part*.txt、towan*.txt 及多余副本，并同步 csdn/public/books/
 */
const fs = require('fs');
const path = require('path');
const {
  discoverBooks,
  getBookPath,
  getPublicBookPath,
  isBookTxtName,
  syncToPublic,
  toFlatFilename,
} = require('./book-paths');

const root = path.resolve(__dirname, '../..');
const booksRoot = path.join(root, 'books');
const publicRoot = path.join(root, 'csdn/public/books');
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
    const dst = getBookPath(root, flatName);
    fs.renameSync(path.join(full, kept), dst);
    syncToPublic(root, flatName);
    if (fs.readdirSync(full).length === 0) fs.rmdirSync(full);
  }
}

for (const book of discoverBooks(booksRoot)) {
  syncToPublic(root, book.filename);
}

if (fs.existsSync(publicRoot)) {
  for (const name of fs.readdirSync(publicRoot)) {
    const full = path.join(publicRoot, name);
    if (fs.statSync(full).isDirectory() && /^\d+$/.test(name)) {
      for (const f of fs.readdirSync(full)) {
        fs.unlinkSync(path.join(full, f));
        totalDeleted++;
      }
      fs.rmdirSync(full);
      report.push(`[public/${name}] 删除旧目录`);
    }
  }
}

const flatNames = new Set(discoverBooks(booksRoot).map((b) => b.filename));
for (const name of fs.existsSync(publicRoot) ? fs.readdirSync(publicRoot) : []) {
  const full = path.join(publicRoot, name);
  if (!fs.statSync(full).isFile() || !isBookTxtName(name)) continue;
  if (!flatNames.has(name)) {
    fs.unlinkSync(full);
    totalDeleted++;
    report.push(`[public] 删除孤立文件 ${name}`);
  }
}

console.log(report.join('\n') || '所有目录已符合要求，无需删除');
console.log(`\n共删除 ${totalDeleted} 个文件`);
