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
const SITE = 'https://toolset.site';

function resolveCoverUrl(id) {
  if (!fs.existsSync(assetsDir)) {
    return `${SITE}/assets/book-${id}.jpg`;
  }
  const files = fs.readdirSync(assetsDir);
  if (id === 145) {
    const wudao = files.find((f) => /^wudao-.*\.jpg$/i.test(f));
    if (wudao) return `${SITE}/assets/${wudao}`;
  }
  const match = files.find((f) => new RegExp(`^book-${id}-[a-f0-9]+\\.jpg$`).test(f));
  return match ? `${SITE}/assets/${match}` : `${SITE}/assets/book-${id}.jpg`;
}

function parseBooksData(content) {
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
      cover: resolveCoverUrl(id),
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

const raw = fs.readFileSync(booksDataPath, 'utf8');
const books = parseBooksData(raw);
const categories = parseMeta(raw, 'allBookCategories');
const tags = parseMeta(raw, 'allBookTags');

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
