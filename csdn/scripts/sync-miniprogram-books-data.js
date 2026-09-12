/**
 * 从 booksData.js 生成微信小程序书籍数据
 * 用法: node csdn/scripts/sync-miniprogram-books-data.js
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const booksDataPath = path.join(root, 'csdn/src/data/booksData.js');
const outDir = path.join(root, 'miniprogram-books/data');
const assetsDir = path.join(root, 'assets');
const sourceCoverDir = path.join(root, 'csdn/src/assets/images/books');
const SITE = 'https://toolset.site';

/** 从打包产物 assets/ 构建 id -> 封面文件名 映射 */
function buildCoverMap() {
  const map = new Map();
  if (!fs.existsSync(assetsDir)) return map;

  for (const file of fs.readdirSync(assetsDir)) {
    const bookMatch = file.match(/^book-(\d+)-[a-f0-9]+\.jpg$/);
    if (bookMatch) {
      map.set(Number(bookMatch[1]), file);
      continue;
    }
    if (/^wudao-.*\.jpg$/i.test(file)) {
      map.set(145, file);
    }
  }

  const bundleFile = fs.readdirSync(assetsDir).find((f) => /^index-[a-f0-9]+\.js$/.test(f));
  if (bundleFile) {
    const content = fs.readFileSync(path.join(assetsDir, bundleFile), 'utf8');
    for (const m of content.matchAll(/book-(\d+)-[a-f0-9]{8}\.jpg/g)) {
      const id = Number(m[1]);
      if (!map.has(id)) map.set(id, m[0]);
    }
  }

  return map;
}

function resolveCoverUrl(id, coverMap) {
  const hashed = coverMap.get(id);
  if (hashed) return `${SITE}/assets/${hashed}`;

  const sourceCover = path.join(sourceCoverDir, id === 145 ? 'wudao-154.jpg' : `book-${id}.jpg`);
  if (fs.existsSync(sourceCover)) {
    console.warn(`[${id}] 封面未在 assets/ 找到打包文件，请先 npm run build：${sourceCover}`);
  }

  return '';
}

function parseBooksData(content, coverMap) {
  const books = [];
  const blockRe = /\{\s*id:\s*(\d+),[\s\S]*?\n  \},/g;
  let m;
  while ((m = blockRe.exec(content)) !== null) {
    const block = m[0];
    const id = Number(m[1]);
    const getStr = (key) => block.match(new RegExp(`${key}:\\s*"([^"]*)"`))?.[1] || '';
    const tags = [];
    const tagRe = /\{\s*name:\s*"([^"]+)",\s*type:\s*"([^"]+)"\s*\}/g;
    let tm;
    while ((tm = tagRe.exec(block)) !== null) {
      tags.push({ name: tm[1], type: tm[2] });
    }
    books.push({
      id,
      title: getStr('title'),
      author: getStr('author'),
      category: getStr('category'),
      status: getStr('status'),
      chapters: getStr('chapters'),
      latestChapter: getStr('latestChapter'),
      excerpt: getStr('excerpt'),
      readUrl: getStr('readUrl'),
      tags,
      cover: resolveCoverUrl(id, coverMap),
    });
  }
  return books.sort((a, b) => a.id - b.id);
}

function parseMeta(content, name) {
  const re = new RegExp(`export const ${name} = (\\[[\\s\\S]*?\\]);`);
  const match = content.match(re);
  if (!match) return [];
  return JSON.parse(match[1].replace(/'/g, '"'));
}

const coverMap = buildCoverMap();
const raw = fs.readFileSync(booksDataPath, 'utf8');
const books = parseBooksData(raw, coverMap);
const categories = parseMeta(raw, 'allBookCategories');
const tags = parseMeta(raw, 'allBookTags');

const missingCovers = books.filter((b) => !b.cover).map((b) => b.id);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, 'books.js'),
  `module.exports = ${JSON.stringify(books, null, 2)};\n`,
  'utf8',
);
fs.writeFileSync(
  path.join(outDir, 'meta.js'),
  `module.exports = ${JSON.stringify({ categories, tags, site: SITE, totalDisplay: 29991 }, null, 2)};\n`,
  'utf8',
);

console.log(`已写入 ${books.length} 本书 -> miniprogram-books/data/books.js`);
console.log(`封面映射: ${coverMap.size} 个打包资源`);
if (missingCovers.length > 0) {
  console.warn(`缺少封面 URL: ${missingCovers.length} 本`, missingCovers.slice(0, 20).join(', '));
}
