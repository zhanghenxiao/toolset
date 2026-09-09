/**
 * 从夸克分享导出 CSV 导入 readUrl 到 booksData.js
 * 用法: node import-quark-share-csv.js <csv路径>
 */
const fs = require('fs');
const path = require('path');
const { parseBookFilename } = require('./book-paths');

const root = path.resolve(__dirname, '../..');
const booksDataPath = path.join(root, 'csdn/src/data/booksData.js');
const csvPath = process.argv[2] || path.join(root, '分享结果导出-1788946051765.csv');

if (!fs.existsSync(csvPath)) {
  console.error(`CSV 不存在: ${csvPath}`);
  process.exit(1);
}

function normalizeKey(name) {
  return name.replace(/\.txt$/i, '').replace(/[：:]/g, '').toLowerCase();
}

function parseBooksData(content) {
  const books = [];
  const blockRe = /\n  \{[\s\S]*?\n  \},/g;
  for (const block of content.match(blockRe) || []) {
    const id = block.match(/^\n  \{\n    id: (\d+),/m)?.[1];
    const downloadUrl = block.match(/downloadUrl: "([^"]+)"/)?.[1];
    if (!id || !downloadUrl) continue;
    const basename = path.basename(downloadUrl);
    books.push({ id: Number(id), downloadUrl, basename });
  }
  return books;
}

function findBook(books, shareName) {
  const exact = books.find((b) => b.basename === shareName);
  if (exact) return exact;

  const normShare = normalizeKey(shareName);
  const byNorm = books.find((b) => normalizeKey(b.basename) === normShare);
  if (byNorm) return byNorm;

  const parsed = parseBookFilename(shareName);
  if (parsed) {
    const byId = books.find((b) => b.id === parsed.id);
    if (byId) return byId;
    const byFlat = books.find((b) => normalizeKey(b.basename) === normalizeKey(parsed.filename));
    if (byFlat) return byFlat;
  }

  const titlePart = shareName.replace(/^\d+/, '');
  return books.find((b) => {
    const baseTitle = b.basename.replace(/^\d+/, '');
    return normalizeKey(baseTitle) === normalizeKey(titlePart);
  });
}

function updateReadUrl(content, id, url) {
  const blockRe = new RegExp(`(\\n  \\{\\n    id: ${id},[\\s\\S]*?\\n  \\},)`, 'm');
  const match = content.match(blockRe);
  if (!match) return { content, ok: false };

  let block = match[1];
  if (/readUrl:/.test(block)) {
    block = block.replace(/readUrl: "[^"]*"/, `readUrl: ${JSON.stringify(url)}`);
  } else {
    block = block.replace(
      /(\n    downloadUrl:)/,
      `\n    readUrl: ${JSON.stringify(url)},$1`,
    );
  }

  return { content: content.replace(match[1], block), ok: true };
}

const csv = fs.readFileSync(csvPath, 'utf8');
const shares = new Map();
const rowRe = /成功,([^,]+\.txt),"[\s\S]*?链接：(https:\/\/pan\.quark\.cn\/s\/[^\s"]+)/g;
let m;
while ((m = rowRe.exec(csv)) !== null) {
  shares.set(m[1].trim(), m[2].trim());
}

console.log(`解析到 ${shares.size} 条分享记录`);

let content = fs.readFileSync(booksDataPath, 'utf8');
const books = parseBooksData(content);
console.log(`booksData 中 ${books.length} 本书`);

let updated = 0;
const missing = [];

for (const [shareName, url] of shares) {
  const book = findBook(books, shareName);
  if (!book) {
    missing.push(shareName);
    continue;
  }

  const result = updateReadUrl(content, book.id, url);
  if (!result.ok) {
    missing.push(shareName);
    continue;
  }
  content = result.content;
  updated++;
}

fs.writeFileSync(booksDataPath, content, 'utf8');
console.log(`已更新 ${updated} 本书的 readUrl`);
if (missing.length) {
  console.log(`未匹配 ${missing.length} 条:`);
  missing.forEach((name) => console.log(`  - ${name}`));
}
