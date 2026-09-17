const fs = require('fs');
const c = fs.readFileSync('d:/work/Web/xiaogj/csdn/src/data/booksData.js', 'utf8');
const BOOK_BLOCK_RE = /\n\{[\s\S]*?\n  \},/g;
const map = new Map();
for (const block of c.match(BOOK_BLOCK_RE) || []) {
  const idRaw = block.match(/^\n\{\n    id: ([^,]+),/m)?.[1]?.trim();
  const id = /^\d+$/.test(idRaw) ? Number(idRaw) : idRaw?.replace(/^"|"$/g, '');
  map.set(id, block);
}
console.log('parsed', map.size, 'has1701', map.has(1701), 'has1', map.has(1));
