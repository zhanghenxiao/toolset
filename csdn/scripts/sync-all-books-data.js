/**
 * 从 books/ 目录扫描全部书籍，合并注册表与现有数据，重写 booksData.js
 * 用法: node sync-all-books-data.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const {
  buildBookDownloadUrl,
  discoverBooks,
  toFlatFilename,
  compareBookIds,
  isJcxsId,
  isX33xsId,
  isMinyuanId,
  isLibahaoId,
  isCustomBookId,
  is00wId,
  libahaoBookUrl,
  parseLibahaoLocalId,
} = require('./book-paths');

const root = path.resolve(__dirname, '../..');
const booksDataPath = path.join(root, 'csdn/src/data/booksData.js');
const registryPath = path.join(root, 'csdn/src/data/deqixs-batch-registry.json');
const plainRegistryPath = path.join(root, 'csdn/src/data/plain-books-registry.json');
const excerptDir = path.join(root, 'csdn/src/data/books');
const coverDir = path.join(root, 'csdn/src/assets/images/books');

function readBookText(filePath) {
  const buffer = fs.readFileSync(filePath);
  const utf8 = buffer.toString('utf8');
  if (!utf8.includes('\uFFFD')) return utf8;
  return new TextDecoder('gb18030').decode(buffer);
}

function curlText(url) {
  return execSync(`curl.exe -sL "${url}"`, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
}

function parseMetadata(html, id) {
  if (!html || html.length < 500) return null;
  let title = html.match(new RegExp(`<a href="/${id}/#dir">([^<]+)</a>`))?.[1]?.trim();
  if (!title || /towan/i.test(title)) {
    title = html.match(/<h1[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/)?.[1]?.trim();
  }
  if (!title || /towan/i.test(title)) {
    title = html.match(/<title>([^<\-]+?)(?:-|最新章节|TXT)/i)?.[1]?.trim();
  }
  const author = html.match(/authorarticle\.php\?author=[^"]+">作者：([^<]+)</)?.[1]?.trim()
    || html.match(/作者[：:]\s*([^\n<]+)/)?.[1]?.trim();
  if (!title || !author || /towan/i.test(title)) return null;

  const status = /已完结/.test(html) ? '已完结' : '连载中';
  const categoryMatch = html.match(/(?:连载中|已完结)\s*<\/span>\s*<span>(\S+小说)/)
    || html.match(/(?:连载中|已完结)\s+(\S+小说)/);
  const category = categoryMatch ? categoryMatch[1].replace('小说', '') : '玄幻';

  const excerpt = html.match(/<div class="des bb"[^>]*>([\s\S]*?)<\/div>/i)?.[1]
    ?.replace(/<br\s*\/?>/gi, ' ')
    .replace(/&emsp;/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200) || '';

  const latestMatch = html.match(/<a href="[^"]*\/\d+\/\d+\.html">第(\d+)章\s*([^<]+)</)
    || html.match(/第(\d+)章\s*([^\n<]+)/);
  const latestChapter = latestMatch ? `第${latestMatch[1]}章 ${latestMatch[2].trim()}` : '';

  const dateMatch = html.match(/更新时间[：:]\s*(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] : new Date().toISOString().slice(0, 10);

  return { title, author, status, category, excerpt, latestChapter, date };
}

const READ_URLS = {
  1: 'https://pan.quark.cn/s/4ca43135917a?pwd=A2da',
  2: 'https://pan.quark.cn/s/2ee0af84ba59?pwd=NYQD',
  3: 'https://pan.quark.cn/s/9406c7764851?pwd=KEac',
  17: 'https://pan.quark.cn/s/393fa797268a?pwd=BhHy',
  400: 'https://pan.quark.cn/s/0d05e0d64da1?pwd=DimY',
  1349: 'https://pan.baidu.com/s/1VDACYaOBjaizr7_qppGXXQ?pwd=a86b',
  1487: 'https://pan.baidu.com/s/1rTHk9BDd2dLl-F5UsdIf3w?pwd=wdda',
  1595: 'https://pan.baidu.com/s/1NFJ3gpvcsuCIDmu2geqScg?pwd=kmae',
  1608: 'https://pan.baidu.com/s/1A8Qh3Qotai56etpRIskAaw?pwd=hgwp',
  145: 'https://pan.quark.cn/s/3241f9ad0c8c',
  235: 'https://pan.quark.cn/s/d3bdf735c407',
  l_12492825__660539: 'https://pan.xunlei.com/s/VP21z1UuaMInReHYCDQiGjVAA1?pwd=j2sy',
  l_12492824__660523: 'https://pan.xunlei.com/s/VP21z1Up3-pLu21UXsANl0SUA1?pwd=33k6',
  l_12492841__660536: 'https://pan.xunlei.com/s/VP21z1UsY6kk0D8rD1INfQx5A1?pwd=mnqj',
  l_12492904__660524: 'https://pan.xunlei.com/s/VP21z1Uxp2N7CQBUU4qWSb1WA1?pwd=z4pn',
  l_12492920__660525: 'https://pan.xunlei.com/s/VP21z1V-qFYh599RMvxZGGf5A1?pwd=4y4j',
  l_12492955__660499: 'https://pan.xunlei.com/s/VP21z1V3utMzMLbiNyf2V-kfA1?pwd=d9c6',
  l_12493017__660535: 'https://pan.xunlei.com/s/VP21z1Uy5bMFEwcA3WwjcUPtA1?pwd=st3c',
};

function parseBlockId(block) {
  const fromHead = block.match(/^\n\{\n    id: ([^,]+),/m)?.[1]?.trim();
  if (fromHead) {
    return /^\d+$/.test(fromHead) ? Number(fromHead) : fromHead.replace(/^"|"$/g, '');
  }
  const quoted = block.match(/id: "([^"]+)",/)?.[1];
  if (quoted) return quoted;
  const num = block.match(/id: (\d+),/)?.[1];
  return num ? Number(num) : null;
}

function formatBlockId(id) {
  return typeof id === 'string' ? JSON.stringify(id) : String(id);
}

const BOOK_BLOCK_RE = /\n\{[\s\S]*?\n  \},/g;

function loadExistingReadUrls() {
  if (!fs.existsSync(booksDataPath)) return new Map();
  const content = fs.readFileSync(booksDataPath, 'utf8');
  const map = new Map();
  for (const block of content.match(BOOK_BLOCK_RE) || []) {
    const id = parseBlockId(block);
    const readUrl = block.match(/readUrl: "([^"]+)"/)?.[1];
    if (id != null && readUrl) map.set(id, readUrl);
  }
  return map;
}

const NOCOVER_COVER_VAR = 'nocoverCover';
const NOCOVER_IMPORT_PATH = '../assets/images/books/nocover.jpg';

/** 与 book-2686.jpg → bookCover2686 一致；带前缀 id 只保留数字部分 */
function getCoverVar(id) {
  const s = String(id);
  const digits = s.replace(/\D/g, '');
  if (digits) return `bookCover${digits}`;
  const safe = s.replace(/[^a-zA-Z0-9]/g, '');
  return `bookCover${safe}`;
}

function hasCoverFile(id) {
  if (id === 145) {
    return fs.existsSync(path.join(coverDir, 'wudao-154.jpg'));
  }
  return fs.existsSync(path.join(coverDir, `book-${id}.jpg`));
}

function getCoverVarForBook(id) {
  if (id === 145) return 'wudaoCover';
  if (!hasCoverFile(id)) return NOCOVER_COVER_VAR;
  return getCoverVar(id);
}

function normalizeBlockCover(block, id) {
  const coverVar = getCoverVarForBook(id);
  return block.replace(/(\n    cover: )[^,]+,/, `\n    cover: ${coverVar},`);
}

function coverImportPath(id) {
  if (id === 145) return '../assets/images/books/wudao-154.jpg';
  return `../assets/images/books/book-${id}.jpg`;
}

function libahaoSourceUrl(localId) {
  const fromId = libahaoBookUrl(localId);
  if (fromId) return fromId;
  const parsed = parseLibahaoLocalId(localId);
  if (!parsed?.siteBookId) return '';
  const workDir = path.join(root, 'books/_work/libahao');
  if (!fs.existsSync(workDir)) return '';
  const hit = fs.readdirSync(workDir).find((f) => f.startsWith(`index-${parsed.siteBookId}_`) && f.endsWith('.html'));
  if (!hit) return '';
  const m = hit.match(/^index-(\d+)_(\d+)\.html$/);
  return m ? `https://m.libahao2.com/book/${m[1]}_${m[2]}/` : '';
}

function discoverDiskBooks() {
  const booksDir = path.join(root, 'books');
  const result = [];
  for (const book of discoverBooks(booksDir)) {
    const file = book.legacyFilename || path.basename(book.filePath);
    const fnMatch = file.match(/^(.+?)1-(\d+)章\.txt$/) || book.filename.match(/^(\d+)(.+?)1-(\d+)章\.txt$/);
    const titleFromFile = book.title || fnMatch?.[1] || file.replace(/\.txt$/, '');
    const maxChapter = book.maxChapter || fnMatch?.[2] || '0';
    const flatFilename = book.filename || toFlatFilename(book.id, file);

    const head = readBookText(book.filePath).slice(0, 600);
    const headerMatch = head.match(/^《([^》]+)》\s*作者[：:]\s*(.+)$/m);
    const author = headerMatch?.[2]?.trim() || book.author || '';

    result.push({
      id: book.id,
      title: titleFromFile,
      author,
      filename: flatFilename,
      chapters: `1-${maxChapter}章`,
      downloadUrl: buildBookDownloadUrl(flatFilename),
      sourceUrl: isJcxsId(book.id)
        ? `https://www.jcxs.org/book/${String(book.id).slice(1)}/`
        : isX33xsId(book.id)
          ? `https://www.x33xs6.com/33xs/${Math.floor(Number(String(book.id).slice(1)) / 1000)}/${String(book.id).slice(1)}/`
          : isMinyuanId(book.id)
            ? `https://www.min-yuan.com/txt/${String(book.id).slice(2)}/`
            : isLibahaoId(book.id)
              ? libahaoSourceUrl(book.id)
              : isCustomBookId(book.id)
                ? ''
                : is00wId(book.id)
                  ? `https://www.00w.org/bxwx_${String(book.id).slice(2)}/`
                  : `https://www.deqixs.org/${book.id}/txt.html#dir`,
      latestChapterFromFile: findLatestChapter(readBookText(book.filePath).slice(-50000)),
    });
  }
  return result.sort((a, b) => compareBookIds(a.id, b.id));
}

function loadExcerpt(id) {
  const p = path.join(excerptDir, `book-${id}-excerpt.txt`);
  if (!fs.existsSync(p)) return '';
  return fs.readFileSync(p, 'utf8').trim().replace(/\s+/g, ' ').slice(0, 200);
}

function slugify(title) {
  return title.replace(/[\\/:*?"<>|]/g, '-').trim();
}

function findLatestChapter(content) {
  let max = 0;
  let title = '';
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (!t || t.length > 100) continue;
    const m = t.match(/^第(\d+)章\s*(.*)$/);
    if (m) {
      const n = Number(m[1]);
      if (n > max && n < 20000) {
        max = n;
        title = m[2].trim();
      }
    }
  }
  return max ? `第${max}章${title ? ` ${title}` : ''}` : '';
}

function buildTags(category, status) {
  const tags = [{ name: category, type: 'purple' }];
  tags.push({ name: status === '已完结' ? '完结' : '连载', type: 'blue' });
  return tags;
}

function parseExistingBlocks(content) {
  const map = new Map();
  for (const block of content.match(BOOK_BLOCK_RE) || []) {
    const id = parseBlockId(block);
    if (id != null) map.set(id, block);
  }
  return map;
}

function collectMetaFromBlocks(blocks) {
  const categories = new Set();
  const tags = new Set();
  for (const block of blocks) {
    const cat = block.match(/category: "([^"]+)"/)?.[1];
    if (cat) categories.add(cat);
    for (const m of block.matchAll(/name: "([^"]+)", type: "(?:purple|blue)"/g)) {
      tags.add(m[1]);
    }
  }
  return {
    categories: [...categories].sort(),
    tags: [...tags].sort(),
  };
}

function entryToBlock(id, entry) {
  const coverVar = getCoverVarForBook(id);
  const lines = [
    '{',
    `    id: ${formatBlockId(id)},`,
    `    slug: ${JSON.stringify(entry.slug || slugify(entry.title))},`,
    `    title: ${JSON.stringify(entry.title)},`,
    `    cover: ${coverVar},`,
    `    author: ${JSON.stringify(entry.author || '未知')},`,
    `    date: ${JSON.stringify(entry.date || new Date().toISOString().slice(0, 10))},`,
    `    category: ${JSON.stringify(entry.category || '玄幻')},`,
    `    status: ${JSON.stringify(entry.status || '连载中')},`,
    `    chapters: ${JSON.stringify(entry.chapters)},`,
  ];
  if (entry.latestChapter) lines.push(`    latestChapter: ${JSON.stringify(entry.latestChapter)},`);
  lines.push(`    excerpt: ${JSON.stringify(entry.excerpt || '')},`);
  lines.push(`    tags: [${entry.tags.map((t) => `{ name: ${JSON.stringify(t.name)}, type: ${JSON.stringify(t.type)} }`).join(', ')}],`);
  if (entry.readUrl) lines.push(`    readUrl: ${JSON.stringify(entry.readUrl)},`);
  lines.push(`    downloadUrl: ${JSON.stringify(entry.downloadUrl)},`);
  lines.push(`    sourceUrl: ${JSON.stringify(entry.sourceUrl)},`);
  lines.push('  },');
  return lines.join('\n');
}

// --- main ---
const registry = fs.existsSync(registryPath)
  ? JSON.parse(fs.readFileSync(registryPath, 'utf8'))
  : [];
const plainRegistry = fs.existsSync(plainRegistryPath)
  ? JSON.parse(fs.readFileSync(plainRegistryPath, 'utf8'))
  : [];
const registryMap = new Map([...registry, ...plainRegistry].map((b) => [b.id, b]));

const diskBooks = discoverDiskBooks();
const existingReadUrls = loadExistingReadUrls();
console.log(`磁盘书籍: ${diskBooks.length}`);

const merged = [];
let fetched = 0;

for (const disk of diskBooks) {
  const reg = registryMap.get(disk.id);

  let entry = {
    title: disk.title,
    author: disk.author || reg?.author || '',
    chapters: disk.chapters,
    downloadUrl: disk.downloadUrl,
    sourceUrl: reg?.sourceUrl || disk.sourceUrl,
    excerpt: loadExcerpt(disk.id) || reg?.excerpt || '',
    category: reg?.category || '',
    status: reg?.status || '',
    latestChapter: reg?.latestChapter || disk.latestChapterFromFile || '',
    date: reg?.date || '',
    readUrl: READ_URLS[disk.id] || existingReadUrls.get(disk.id) || reg?.readUrl,
    slug: reg?.slug || slugify(disk.title),
    tags: reg?.tags,
  };

  if (!entry.author || !entry.category) {
    // 本地数据不足时使用默认值；需要完整元数据时可运行 node sync-all-books-data.js --online
  }

  if (!entry.category) entry.category = '玄幻';
  if (!entry.status) entry.status = '连载中';
  if (!entry.author) entry.author = '未知';
  if (!entry.date) entry.date = new Date().toISOString().slice(0, 10);
  if (!entry.tags) entry.tags = buildTags(entry.category, entry.status);

  merged.push({ id: disk.id, entry });
}

if (process.argv.includes('--online')) {
  for (const item of merged) {
    const { id, entry } = item;
    if (isJcxsId(id) || isX33xsId(id) || isMinyuanId(id) || isLibahaoId(id) || isCustomBookId(id) || is00wId(id)) continue;
    if (entry.author && entry.author !== '未知' && entry.category && entry.latestChapter) continue;
    try {
      const meta = parseMetadata(curlText(`https://www.deqixs.org/${id}/txt.html`), id);
      if (!meta) continue;
      if (!entry.author || entry.author === '未知') entry.author = meta.author;
      if (!entry.category) entry.category = meta.category;
      if (!entry.status) entry.status = meta.status;
      if (!entry.latestChapter) entry.latestChapter = meta.latestChapter;
      if (!entry.excerpt) entry.excerpt = meta.excerpt;
      if (!entry.date) entry.date = meta.date;
      entry.tags = buildTags(entry.category, entry.status);
      fetched++;
    } catch (e) {
      console.warn(`[${id}] 拉取元数据失败: ${e.message}`);
    }
  }
}

console.log(`在线补全元数据: ${fetched} 本`);

const existingContent = fs.existsSync(booksDataPath)
  ? fs.readFileSync(booksDataPath, 'utf8')
  : '';
const existingBlocks = parseExistingBlocks(existingContent);
console.log(`已有 booksData 条目: ${existingBlocks.size}`);

for (const { id, entry } of merged) {
  existingBlocks.set(id, entryToBlock(id, entry));
}

// 保留无本地 TXT 的历史条目（如仅网盘、或 TXT 未同步到本机）
const allIds = [...existingBlocks.keys()].sort(compareBookIds);
for (const id of allIds) {
  existingBlocks.set(id, normalizeBlockCover(existingBlocks.get(id), id));
}
const blocks = allIds.map((id) => existingBlocks.get(id)).join('\n');
const { categories, tags } = collectMetaFromBlocks(allIds.map((id) => existingBlocks.get(id)));

const importLines = [];
if (allIds.includes(145)) importLines.push("import wudaoCover from '../assets/images/books/wudao-154.jpg';");
let needsNocover = false;
for (const id of allIds) {
  if (id === 145) continue;
  if (hasCoverFile(id)) {
    importLines.push(`import ${getCoverVar(id)} from '${coverImportPath(id)}';`);
  } else {
    needsNocover = true;
  }
}
if (needsNocover) {
  importLines.push(`import ${NOCOVER_COVER_VAR} from '${NOCOVER_IMPORT_PATH}';`);
}

const output = `${importLines.join('\n')}

export const bookItems = [
${blocks}
];

export const allBookCategories = ${JSON.stringify(categories)};

export const allBookTags = ${JSON.stringify(tags)};
`;

fs.writeFileSync(booksDataPath, output, 'utf8');
console.log(`已写入 ${allIds.length} 本书到 booksData.js（磁盘更新 ${merged.length} 本）`);
