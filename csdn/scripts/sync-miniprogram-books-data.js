/**
 * 从 booksData.js 生成微信小程序书籍数据
 * 用法: node csdn/scripts/sync-miniprogram-books-data.js
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const booksDataPath = path.join(root, 'csdn/src/data/booksData.js');
const outDir = path.join(root, 'miniprogram-books/data');
const uniappOutDir = path.join(root, 'uniapp-books/src/data');
const assetsDir = path.join(root, 'assets');
const sourceCoverDir = path.join(root, 'csdn/src/assets/images/books');
const SITE = 'https://toolset.site';
const bookCoversDir = path.join(root, 'book-covers');
const { deqixsCoverUrl } = require('./book-paths');
const DEQIXS_COVER = (id) => deqixsCoverUrl(id);

function sourceCoverPath(id) {
  if (id === 145) {
    const wudao = path.join(sourceCoverDir, 'wudao-154.jpg');
    if (fs.existsSync(wudao)) return wudao;
  }
  return path.join(sourceCoverDir, `book-${id}.jpg`);
}

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
  const idStr = String(id);
  const hashed = coverMap.get(id) || coverMap.get(Number(idStr));
  if (hashed) return `${SITE}/assets/${hashed}`;

  const stable = `book-${idStr}.jpg`;
  const published = path.join(bookCoversDir, stable);
  const hasLocal = fs.existsSync(published) || fs.existsSync(sourceCoverPath(id));

  if (/^[sx]\d+$/.test(idStr)) {
    if (process.env.MINIPROGRAM_COVER === 'stable' && hasLocal) {
      return `${SITE}/book-covers/${stable}`;
    }
    if (hasLocal) return `${SITE}/book-covers/${stable}`;
    return '';
  }

  // 稳定路径需先部署 book-covers/；部署前用得奇封面保证小程序可显示
  if (process.env.MINIPROGRAM_COVER === 'stable' && hasLocal) {
    return `${SITE}/book-covers/${stable}`;
  }
  if (hasLocal) return DEQIXS_COVER(id);

  return DEQIXS_COVER(id);
}

function parseBooksData(content, coverMap) {
  const books = [];
  const blockRe = /\{\s*id:\s*(?:"([^"]+)"|(\d+)),[\s\S]*?\n  \},/g;
  let m;
  while ((m = blockRe.exec(content)) !== null) {
    const block = m[0];
    const id = m[1] || Number(m[2]);
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
      downloadUrl: getStr('downloadUrl'),
      tags,
      cover: resolveCoverUrl(id, coverMap),
    });
  }
  return books.sort((a, b) => {
    const sa = String(a.id);
    const sb = String(b.id);
    const aj = /^[sx]\d+$/.test(sa);
    const bj = /^[sx]\d+$/.test(sb);
    if (aj !== bj) return aj ? 1 : -1;
    if (aj) return sa.localeCompare(sb);
    return Number(sa) - Number(sb);
  });
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

const metaPayload = { categories, tags, site: SITE, totalDisplay: 29991 };

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, 'books.js'),
  `module.exports = ${JSON.stringify(books, null, 2)};\n`,
  'utf8',
);
fs.writeFileSync(
  path.join(outDir, 'meta.js'),
  `module.exports = ${JSON.stringify(metaPayload, null, 2)};\n`,
  'utf8',
);

fs.mkdirSync(uniappOutDir, { recursive: true });
fs.writeFileSync(
  path.join(uniappOutDir, 'books.js'),
  `export default ${JSON.stringify(books, null, 2)};\n`,
  'utf8',
);
fs.writeFileSync(
  path.join(uniappOutDir, 'meta.js'),
  `export default ${JSON.stringify(metaPayload, null, 2)};\n`,
  'utf8',
);

console.log(`已写入 ${books.length} 本书 -> miniprogram-books/data/books.js`);
console.log(`已写入 ${books.length} 本书 -> uniapp-books/src/data/books.js`);
console.log(`封面映射: ${coverMap.size} 个打包资源`);
if (missingCovers.length > 0) {
  console.warn(`缺少封面 URL: ${missingCovers.length} 本`, missingCovers.slice(0, 20).join(', '));
}
