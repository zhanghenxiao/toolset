/**
 * 从「文件名|链接|提取码」文本导入 readUrl
 * 用法: node csdn/scripts/import-xunlei-share-lines.js <文件路径>
 */
const fs = require('fs');
const path = require('path');
const { parseBookFilename, isMinyuanId, isLibahaoId, isPrefixedSiteBookId } = require('./book-paths');

const root = path.resolve(__dirname, '../..');
const booksDataPath = path.join(root, 'csdn/src/data/booksData.js');
const inputPath = path.resolve(process.argv[2] || path.join(__dirname, '_tmp-minyuan-xunlei-shares.txt'));

function normalizeKey(name) {
  return name.replace(/\.txt$/i, '').replace(/[：:]/g, '').toLowerCase();
}

function parseBooksData(content) {
  const books = [];
  const blockRe = /\n\{[\s\S]*?\n  \},/g;
  for (const block of content.match(blockRe) || []) {
    const idRaw = block.match(/^\n\{\n    id: ([^,]+),/m)?.[1]?.trim();
    const downloadUrl = block.match(/downloadUrl: "([^"]+)"/)?.[1];
    if (!idRaw || !downloadUrl) continue;
    const id = /^\d+$/.test(idRaw) ? Number(idRaw) : idRaw.replace(/^"|"$/g, '');
    books.push({ id, downloadUrl, basename: path.basename(downloadUrl) });
  }
  return books;
}

function findBook(books, shareName) {
  const exact = books.find((b) => b.basename === shareName);
  if (exact) return exact;
  const parsed = parseBookFilename(shareName);
  if (parsed) {
    const byId = books.find((b) => b.id === parsed.id);
    if (byId) return byId;
  }
  const normShare = normalizeKey(shareName);
  return books.find((b) => normalizeKey(b.basename) === normShare);
}

function updateReadUrl(content, id, url) {
  const idLine = `\n    id: ${typeof id === 'number' ? id : JSON.stringify(id)},`;
  const blockRe = /\n\{[\s\S]*?\n  \},/g;
  const blocks = content.match(blockRe) || [];
  const block = blocks.find((b) => b.includes(idLine));
  if (!block) return { content, ok: false };
  let next = block;
  if (/readUrl:/.test(next)) {
    next = next.replace(/readUrl: "[^"]*"/, `readUrl: ${JSON.stringify(url)}`);
  } else {
    next = next.replace(/(\n    downloadUrl:)/, `\n    readUrl: ${JSON.stringify(url)},$1`);
  }
  return { content: content.replace(block, next), ok: true };
}

function toReadUrl(url, pwd) {
  const base = url.replace(/[#?].*$/, '');
  return pwd && !base.includes('?pwd=') ? `${base}?pwd=${pwd}` : base;
}

function parseShares(filePath) {
  const shares = new Map();
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [shareName, url, pwd] = trimmed.split('|');
    if (!shareName?.endsWith('.txt') || !url) continue;
    const parsed = parseBookFilename(shareName.trim());
    const key = parsed?.id || shareName.trim();
    shares.set(key, {
      shareName: shareName.trim(),
      url: toReadUrl(url.trim(), pwd?.trim()),
    });
  }
  return shares;
}

const shares = parseShares(inputPath);
console.log(`分享记录: ${shares.size} 条`);

let content = fs.readFileSync(booksDataPath, 'utf8');
const books = parseBooksData(content);
let updated = 0;
const missing = [];

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
  updated += 1;
  console.log(`✓ ${book.id} → ${url}`);
}

fs.writeFileSync(booksDataPath, content, 'utf8');
console.log(`已更新 ${updated} 本书 readUrl`);
if (missing.length) {
  console.log(`未匹配 ${missing.length} 条:`);
  missing.forEach((name) => console.log(`  - ${name}`));
}
