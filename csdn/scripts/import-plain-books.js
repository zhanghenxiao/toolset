/**
 * 将 books/ 下「书名.txt」扁平文件注册为 u_ 随机 id，重命名并写入 plain-books-registry.json
 * 用法: node csdn/scripts/import-plain-books.js
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {
  BOOK_FILE_RE,
  buildBookFilename,
  buildBookDownloadUrl,
  discoverBooks,
} = require('./book-paths');

const root = path.resolve(__dirname, '../..');
const booksDir = path.join(root, 'books');
const registryPath = path.join(root, 'csdn/src/data/plain-books-registry.json');

function readBookText(filePath) {
  const buffer = fs.readFileSync(filePath);
  const utf8 = buffer.toString('utf8');
  if (!utf8.includes('\uFFFD')) return utf8;
  return new TextDecoder('gb18030').decode(buffer);
}

function slugify(title) {
  return String(title)
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80) || 'book';
}

function findMaxChapter(text) {
  let max = 0;
  for (const m of text.matchAll(/第(\d+)章/g)) {
    const n = Number(m[1]);
    if (n > max) max = n;
  }
  return max || 1;
}

function findLatestChapter(text) {
  const matches = [...text.matchAll(/第(\d+)章\s*[,，]?\s*([^\n]{0,60})/g)];
  if (!matches.length) return '';
  const last = matches[matches.length - 1];
  const title = last[2].replace(/\s+/g, ' ').trim();
  return title ? `第${last[1]}章 ${title}` : `第${last[1]}章`;
}

function parseMeta(text, titleFromFile) {
  const head = text.slice(0, 800);
  const headerMatch = head.match(/^《([^》]+)》\s*作者[：:]\s*(.+)$/m);
  const title = headerMatch?.[1]?.trim() || titleFromFile;
  const author = headerMatch?.[2]?.trim() || '未知';
  const maxChapter = findMaxChapter(text);
  const tail = text.slice(-80000);
  const status = /【终】|大结局|全文完|全书完|完本/.test(tail) ? '已完结' : '连载中';
  return { title, author, maxChapter, latestChapter: findLatestChapter(text), status };
}

function loadRegistry() {
  if (!fs.existsSync(registryPath)) return [];
  return JSON.parse(fs.readFileSync(registryPath, 'utf8'));
}

function saveRegistry(list) {
  fs.writeFileSync(registryPath, JSON.stringify(list, null, 2), 'utf8');
}

function randomId(used) {
  let id;
  do {
    id = `u_${crypto.randomBytes(4).toString('hex')}`;
  } while (used.has(id));
  used.add(id);
  return id;
}

function isPlainBookFile(name) {
  if (!name.endsWith('.txt') || name.startsWith('_')) return false;
  if (BOOK_FILE_RE.test(name)) return false;
  if (/^\d+.+1-\d+章\.txt$/.test(name)) return false;
  return true;
}

function main() {
  const registry = loadRegistry();
  const usedIds = new Set([
    ...registry.map((b) => b.id),
    ...discoverBooks(booksDir).map((b) => String(b.id)),
  ]);
  const byTitle = new Map(registry.map((b) => [b.title, b]));

  const plainFiles = fs.readdirSync(booksDir).filter(isPlainBookFile);
  if (!plainFiles.length) {
    console.log('无待导入的扁平书名.txt');
    return;
  }

  let added = 0;
  for (const name of plainFiles) {
    const titleFromFile = name.replace(/\.txt$/i, '');
    if (byTitle.has(titleFromFile)) {
      console.log(`跳过（已在 registry）: ${titleFromFile}`);
      continue;
    }

    const srcPath = path.join(booksDir, name);
    const text = readBookText(srcPath);
    const meta = parseMeta(text, titleFromFile);
    const id = randomId(usedIds);
    const filename = buildBookFilename(id, meta.title, meta.maxChapter);
    const destPath = path.join(booksDir, filename);

    fs.renameSync(srcPath, destPath);
    const entry = {
      id,
      slug: slugify(meta.title),
      title: meta.title,
      author: meta.author,
      date: new Date().toISOString().slice(0, 10),
      category: '其他',
      status: meta.status,
      chapters: `1-${meta.maxChapter}章`,
      latestChapter: meta.latestChapter,
      excerpt: '',
      filename,
      downloadUrl: buildBookDownloadUrl(filename),
      sourceUrl: '',
      tags: [{ name: '其他', type: 'purple' }, { name: meta.status === '已完结' ? '完结' : '连载', type: 'blue' }],
    };
    registry.push(entry);
    byTitle.set(meta.title, entry);
    console.log(`✓ ${id} ${meta.title} → ${filename}`);
    added += 1;
  }

  saveRegistry(registry);
  console.log(`\n新增 ${added} 本，registry 共 ${registry.length} 本 → ${registryPath}`);
  console.log('请运行: node csdn/scripts/sync-all-books-data.js');
}

main();
