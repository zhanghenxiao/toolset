/**
 * 从夸克分享导出 CSV 导入 readUrl 到 booksData.js
 * 用法: node import-quark-share-csv.js <csv路径> [csv路径2 ...]
 */
const fs = require('fs');
const path = require('path');
const { parseBookFilename } = require('./book-paths');

const root = path.resolve(__dirname, '../..');
const booksDataPath = path.join(root, 'csdn/src/data/booksData.js');
const csvPaths = process.argv.slice(2).length
  ? process.argv.slice(2).map((p) => path.resolve(p))
  : [path.join(root, '分享结果导出-1788946051765.csv')];

for (const csvPath of csvPaths) {
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV 不存在: ${csvPath}`);
    process.exit(1);
  }
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

  const idFromShare = shareName.match(/^(\d+)_?/)?.[1];
  if (idFromShare) {
    const byId = books.find((b) => b.id === Number(idFromShare));
    if (byId) return byId;
  }

  const titlePart = shareName.replace(/^\d+_?/, '');
  return books.find((b) => {
    const baseTitle = b.basename.replace(/^\d+_?/, '');
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

function chapterFromShareName(name) {
  const parsed = parseBookFilename(name);
  return parsed?.maxChapter || Number(name.match(/1-(\d+)章/)?.[1] || 0);
}

function mergeShare(target, book) {
  const id = parseBookFilename(book.shareName)?.id
    || Number(book.shareName.match(/^(\d+)_?/)?.[1] || 0);
  if (id) {
    const prev = target.get(id);
    if (!prev || chapterFromShareName(book.shareName) >= chapterFromShareName(prev.shareName)) {
      target.set(id, book);
    }
    return;
  }
  target.set(book.shareName, book);
}

function parseSharesFromCsv(csvPath) {
  const csv = fs.readFileSync(csvPath, 'utf8');
  const shares = new Map();
  const rowRe = /成功,([^,]+\.txt),"[\s\S]*?链接：(https:\/\/pan\.quark\.cn\/s\/[^\s"]+)/g;
  let m;
  while ((m = rowRe.exec(csv)) !== null) {
    mergeShare(shares, { shareName: m[1].trim(), url: m[2].trim() });
  }
  return shares;
}

const shares = new Map();
for (const csvPath of csvPaths) {
  const parsed = parseSharesFromCsv(csvPath);
  console.log(`${path.basename(csvPath)}: ${parsed.size} 条`);
  for (const book of parsed.values()) {
    mergeShare(shares, book);
  }
}
console.log(`合并后 ${shares.size} 条分享记录`);

let content = fs.readFileSync(booksDataPath, 'utf8');
const books = parseBooksData(content);
console.log(`booksData 中 ${books.length} 本书`);

let updated = 0;
const missing = [];
const updatedIds = new Set();

for (const { shareName, url } of shares.values()) {
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
  if (!updatedIds.has(book.id)) {
    updatedIds.add(book.id);
    updated++;
  }
}

fs.writeFileSync(booksDataPath, content, 'utf8');
console.log(`已更新 ${updated} 本书的 readUrl`);
if (missing.length) {
  console.log(`未匹配 ${missing.length} 条:`);
  missing.forEach((name) => console.log(`  - ${name}`));
}
