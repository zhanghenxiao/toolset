/**
 * 将 books/ 文件名迁移为 {id}_{书名}1-{章节}章.txt
 * 用法: node migrate-books-underscore.js
 */
const fs = require('fs');
const path = require('path');
const {
  buildBookFilename,
  discoverBooks,
  getBookPath,
  getCoverDirFromBooksRoot,
  resolveFlatBookMeta,
  isBookTxtName,
} = require('./book-paths');

const root = path.resolve(__dirname, '../..');
const booksRoot = path.join(root, 'books');
const coverDir = getCoverDirFromBooksRoot(booksRoot);

const report = [];

for (const name of fs.readdirSync(booksRoot)) {
  const src = path.join(booksRoot, name);
  if (!fs.statSync(src).isFile() || !isBookTxtName(name)) continue;

  const parsed = resolveFlatBookMeta(name, coverDir);
  if (!parsed) {
    report.push(`[skip] 无法解析: ${name}`);
    continue;
  }

  const newName = buildBookFilename(parsed.id, parsed.title, parsed.maxChapter);
  const dst = getBookPath(root, newName);

  if (name !== newName) {
    if (fs.existsSync(dst) && path.resolve(src) !== path.resolve(dst)) {
      fs.unlinkSync(src);
      report.push(`[${parsed.id}] 删除重复旧文件: ${name}`);
    } else {
      fs.renameSync(src, dst);
      report.push(`[${parsed.id}] ${name} → ${newName}`);
    }
  }
}

console.log(report.join('\n') || '所有文件已是新格式');
console.log(`\n完成，共 ${report.length} 项操作`);
