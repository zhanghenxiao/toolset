/**
 * 修正书籍文件名中的章节数（含 1-0章、章节数不匹配）
 * 用法: node fix-book-filenames.js [startId] [endId]
 */
const fs = require('fs');
const path = require('path');
const {
  buildBookFilename,
  buildBookDownloadUrl,
  discoverBooks,
  getBookPath,
} = require('./book-paths');

const root = path.resolve(__dirname, '../..');
const booksDataPath = path.join(root, 'csdn/src/data/booksData.js');
const registryPath = path.join(root, 'csdn/src/data/deqixs-batch-registry.json');
const startId = Number(process.argv[2] || 200);
const endId = Number(process.argv[3] || 400);

const CN_NUM = { 零: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10, 百: 100, 千: 1000, 两: 2 };

function cnToInt(text) {
  if (/^\d+$/.test(text)) return Number(text);
  let result = 0;
  let current = 0;
  for (const ch of text) {
    if (ch === '十') {
      current = current === 0 ? 1 : current;
      result += current * 10;
      current = 0;
      continue;
    }
    if (CN_NUM[ch] >= 10) {
      result += (current || 1) * CN_NUM[ch];
      current = 0;
      continue;
    }
    if (CN_NUM[ch] !== undefined) current = CN_NUM[ch];
  }
  return result + current;
}

function findLatestChapterNum(content) {
  let max = 0;
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (!t || t.length > 80) continue;
    let m = t.match(/^第(\d+)章/);
    if (m) {
      const n = Number(m[1]);
      if (n > max && n < 50000) max = n;
      continue;
    }
    m = t.match(/^第([一二三四五六七八九十百千万零两]+)章/);
    if (m) {
      const n = cnToInt(m[1]);
      if (n > max && n < 50000) max = n;
      continue;
    }
    m = t.match(/^(\d+)、/);
    if (m) {
      const n = Number(m[1]);
      if (n > max && n < 50000) max = n;
    }
  }
  return max;
}

function updateBooksData(id, filename, chapters) {
  if (!fs.existsSync(booksDataPath)) return;
  let content = fs.readFileSync(booksDataPath, 'utf8');
  const blockRe = new RegExp(`(\\n  \\{\\n    id: ${id},[\\s\\S]*?\\n  \\},)`, 'm');
  const m = content.match(blockRe);
  if (!m) return;
  let block = m[1];
  block = block.replace(/downloadUrl: "[^"]+"/, `downloadUrl: ${JSON.stringify(buildBookDownloadUrl(filename))}`);
  block = block.replace(/chapters: "[^"]+"/, `chapters: ${JSON.stringify(chapters)}`);
  content = content.replace(blockRe, block);
  fs.writeFileSync(booksDataPath, content, 'utf8');
}

const registry = fs.existsSync(registryPath)
  ? new Map(JSON.parse(fs.readFileSync(registryPath, 'utf8')).map((b) => [b.id, b]))
  : new Map();

let fixed = 0;
for (const book of discoverBooks(path.join(root, 'books'))) {
  if (book.id < startId || book.id > endId) continue;
  const content = fs.readFileSync(book.filePath, 'utf8');
  let actual = findLatestChapterNum(content);
  const reg = registry.get(book.id);
  const regMax = Number(reg?.chapters?.match(/1-(\d+)章/)?.[1] || 0);
  if (!actual && regMax) actual = regMax;
  if (!actual || actual === book.maxChapter) continue;

  const filename = buildBookFilename(book.id, book.title, actual);
  if (filename === book.legacyFilename || filename === book.filename) continue;

  const newPath = getBookPath(root, filename);
  if (fs.existsSync(newPath) && newPath !== book.filePath) {
    console.log(`[${book.id}] 目标已存在，跳过: ${filename}`);
    continue;
  }
  fs.renameSync(book.filePath, newPath);
  updateBooksData(book.id, filename, `1-${actual}章`);
  console.log(`[${book.id}] ${book.filename} → ${filename}`);
  fixed += 1;
}

console.log(`完成，修正 ${fixed} 个文件名`);
