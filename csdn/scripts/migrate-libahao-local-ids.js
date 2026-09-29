/**
 * 将旧 libahao localId（l_{siteBookId}）迁移为 l_{siteBookId}__{imageId}
 * 依据 booksData.js 中 sourceUrl 或 index 缓存解析 imageId
 */
const fs = require('fs');
const path = require('path');
const {
  libahaoLocalId,
  parseLibahaoLocalId,
  isLibahaoId,
} = require('./book-paths');

const root = path.resolve(__dirname, '../..');
const booksDataPath = path.join(root, 'csdn/src/data/booksData.js');
const booksDir = path.join(root, 'books');
const coverDir = path.join(root, 'csdn/src/assets/images/books');
const excerptDir = path.join(root, 'csdn/src/data/books');
const workDir = path.join(root, 'books/_work/libahao');

/** 旧 id -> 新 id（含 imageId） */
const KNOWN_MIGRATIONS = {
  l_12492824: 'l_12492824__660523',
  l_12492825: 'l_12492825__660539',
  l_12492841: 'l_12492841__660536',
  l_12492904: 'l_12492904__660524',
  l_12492920: 'l_12492920__660525',
  l_12492955: 'l_12492955__660499',
  l_12493017: 'l_12493017__660535',
};

function imageIdFromSourceUrl(sourceUrl) {
  const m = String(sourceUrl || '').match(/\/book\/(\d+)_(\d+)\/?/i);
  return m ? m[2] : '';
}

function imageIdFromCache(siteBookId) {
  if (!fs.existsSync(workDir)) return '';
  const hit = fs.readdirSync(workDir).find((f) => f === `index-${siteBookId}_` || f.startsWith(`index-${siteBookId}_`));
  if (!hit) return '';
  const m = hit.match(/^index-\d+_(\d+)\.html$/);
  return m ? m[1] : '';
}

function resolveNewId(oldId, sourceUrl) {
  const parsed = parseLibahaoLocalId(oldId);
  if (!parsed || parsed.imageId) return null;
  const imageId = imageIdFromSourceUrl(sourceUrl) || imageIdFromCache(parsed.siteBookId);
  if (!imageId) return null;
  return libahaoLocalId(parsed.siteBookId, imageId);
}

function renameIfExists(from, to) {
  if (!from || !to || from === to) return false;
  if (!fs.existsSync(from)) return false;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (fs.existsSync(to)) fs.unlinkSync(to);
  fs.renameSync(from, to);
  return true;
}

function migrateFilePrefix(oldId, newId) {
  if (!fs.existsSync(booksDir)) return 0;
  let n = 0;
  for (const name of fs.readdirSync(booksDir)) {
    if (!name.startsWith(`${oldId}_`) || !name.endsWith('.txt')) continue;
    const next = `${newId}_${name.slice(oldId.length + 1)}`;
    renameIfExists(path.join(booksDir, name), path.join(booksDir, next));
    n += 1;
    console.log(`TXT: ${name} -> ${next}`);
  }
  return n;
}

function main() {
  let content = fs.existsSync(booksDataPath)
    ? fs.readFileSync(booksDataPath, 'utf8')
    : '';
  const blockRe = /\n\{[\s\S]*?\n  \},/g;
  const blocks = content.match(blockRe) || [];
  const migrations = [];
  const seen = new Set();

  for (const block of blocks) {
    const id = block.match(/^\n\{\n    id: "([^"]+)",/m)?.[1];
    if (!id || !/^l_\d+$/.test(id)) continue;
    const sourceUrl = block.match(/sourceUrl: "([^"]+)"/)?.[1] || '';
    const newId = resolveNewId(id, sourceUrl) || KNOWN_MIGRATIONS[id];
    if (!newId || newId === id) {
      console.warn(`跳过 ${id}：无法解析 imageId`);
      continue;
    }
    if (!seen.has(id)) {
      migrations.push({ oldId: id, newId, sourceUrl });
      seen.add(id);
    }
  }

  for (const [oldId, newId] of Object.entries(KNOWN_MIGRATIONS)) {
    if (seen.has(oldId)) continue;
    const hasTxt = fs.existsSync(booksDir)
      && fs.readdirSync(booksDir).some((n) => n.startsWith(`${oldId}_`) && n.endsWith('.txt'));
    const hasCover = fs.existsSync(path.join(coverDir, `book-${oldId}.jpg`));
    const hasExcerpt = fs.existsSync(path.join(excerptDir, `book-${oldId}-excerpt.txt`));
    if (hasTxt || hasCover || hasExcerpt) {
      migrations.push({ oldId, newId, sourceUrl: '' });
      seen.add(oldId);
    }
  }

  if (migrations.length === 0) {
    console.log('无需迁移');
    return;
  }

  for (const { oldId, newId } of migrations) {
    migrateFilePrefix(oldId, newId);
    renameIfExists(
      path.join(coverDir, `book-${oldId}.jpg`),
      path.join(coverDir, `book-${newId}.jpg`),
    );
    renameIfExists(
      path.join(excerptDir, `book-${oldId}-excerpt.txt`),
      path.join(excerptDir, `book-${newId}-excerpt.txt`),
    );
  }

  for (const { oldId, newId } of migrations) {
    content = content.replace(
      new RegExp(`import book${oldId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}Cover`, 'g'),
      `import book${newId}Cover`,
    );
    content = content.replace(
      new RegExp(`book${oldId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}Cover`, 'g'),
      `book${newId}Cover`,
    );
    content = content.replace(
      new RegExp(`from '../assets/images/books/book-${oldId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.jpg'`, 'g'),
      `from '../assets/images/books/book-${newId}.jpg'`,
    );
    content = content.replace(new RegExp(`id: "${oldId}"`, 'g'), `id: "${newId}"`);
    content = content.replace(new RegExp(`/books/${oldId}_`, 'g'), `/books/${newId}_`);
    content = content.replace(new RegExp(`\\b${oldId}: '`, 'g'), `${newId}: '`);
    console.log(`数据: ${oldId} -> ${newId}`);
  }

  if (content) {
    fs.writeFileSync(booksDataPath, content, 'utf8');
  }
  console.log(`已迁移 ${migrations.length} 本 libahao 书籍 id`);
}

main();
