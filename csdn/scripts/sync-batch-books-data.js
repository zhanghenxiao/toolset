/**
 * 将 batch-download 注册表同步到 booksData.js
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const registryPath = path.join(root, 'src/data/deqixs-batch-registry.json');
const booksDataPath = path.join(root, 'src/data/booksData.js');

if (!fs.existsSync(registryPath)) {
  console.log('无注册表，跳过');
  process.exit(0);
}

const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
if (registry.length === 0) {
  console.log('注册表为空');
  process.exit(0);
}

let content = fs.readFileSync(booksDataPath, 'utf8');

for (const book of registry) {
  const importLine = `import book${book.id}Cover from '../assets/images/books/book-${book.id}.jpg';`;
  if (!content.includes(importLine)) {
    content = content.replace(
      /(import wudaoCover[^\n]+\n)/,
      `$1${importLine}\n`,
    );
  }
}

const entryBlocks = registry.map((book) => {
  const tagsStr = book.tags
    .map((t) => `{ name: ${JSON.stringify(t.name)}, type: ${JSON.stringify(t.type)} }`)
    .join(', ');
  return `  {
    id: ${book.id},
    slug: ${JSON.stringify(book.slug)},
    title: ${JSON.stringify(book.title)},
    cover: book${book.id}Cover,
    author: ${JSON.stringify(book.author)},
    date: ${JSON.stringify(book.date)},
    category: ${JSON.stringify(book.category)},
    status: ${JSON.stringify(book.status)},
    chapters: ${JSON.stringify(book.chapters)},
    latestChapter: ${JSON.stringify(book.latestChapter)},
    excerpt: ${JSON.stringify(book.excerpt || '')},
    tags: [${tagsStr}],
    downloadUrl: ${JSON.stringify(book.downloadUrl)},
    sourceUrl: ${JSON.stringify(book.sourceUrl)},
  },`;
}).join('\n');

const registryIds = new Set(registry.map((b) => b.id));
const bookItemsMatch = content.match(/export const bookItems = \[\n([\s\S]*?)\n\];/);
if (!bookItemsMatch) throw new Error('无法解析 bookItems');

let itemsBody = bookItemsMatch[1];
for (const id of registryIds) {
  itemsBody = itemsBody.replace(
    new RegExp(`\\n  \\{\\n    id: ${id},[\\s\\S]*?\\n  \\},`, 'g'),
    '',
  );
}
itemsBody = itemsBody.replace(/^\n+/, '');
content = content.replace(
  /export const bookItems = \[\n[\s\S]*?\n\];/,
  `export const bookItems = [\n${entryBlocks}\n${itemsBody}\n];`,
);

const newCategories = [...new Set(registry.map((b) => b.category))];
const newTags = [...new Set(registry.flatMap((b) => b.tags.map((t) => t.name)))];

for (const cat of newCategories) {
  if (!content.includes(`'${cat}'`)) {
    content = content.replace(
      /export const allBookCategories = \[([^\]]+)\]/,
      (m, inner) => `export const allBookCategories = [${inner.trim()}, '${cat}']`,
    );
  }
}

for (const tag of newTags) {
  if (!content.match(new RegExp(`'${tag}'`))) {
    content = content.replace(
      /export const allBookTags = \[([^\]]+)\]/,
      (m, inner) => `export const allBookTags = [${inner.trim()}, '${tag}']`,
    );
  }
}

fs.writeFileSync(booksDataPath, content, 'utf8');
console.log(`已同步 ${registry.length} 本书到 booksData.js`);
