/**
 * 从精彩小说网 jcxs.org 抓取全书正文
 * 用法: node csdn/scripts/download-jcxs-book.js <bookId|bookUrl> [localId如s52266] [startChapter]
 * jcxs 书籍 localId 默认为 s{站点bookId}，与得奇 numeric id 区分
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const {
  buildBookFilename,
  getBookPath,
  discoverBooks,
  jcxsLocalId,
  isJcxsId,
} = require('./book-paths');

const root = path.resolve(__dirname, '../..');
const { SOURCE_SHARE_LINE } = require('./source-share-line');
const BASE = 'https://www.jcxs.org';
const DELAY_MS = 350;

const [, , urlOrId, localIdArg, startChapterArg] = process.argv;
if (!urlOrId) {
  console.error('用法: node download-jcxs-book.js <bookId|bookUrl> [localId如s52266] [startChapter]');
  process.exit(1);
}
const startChapter = startChapterArg ? Number(startChapterArg) : 0;

const bookId = String(urlOrId).match(/(\d+)/)?.[1];
if (!bookId) {
  console.error('无法解析书籍 ID');
  process.exit(1);
}

function sleep(ms) {
  if (ms <= 0) return;
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function curl(url) {
  return execSync(`curl.exe -sL "${url}"`, {
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
}

function decodeHtml(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function cleanJcxsTitle(title) {
  if (!title) return title;
  return title
    .replace(/^\[完结\]/, '')
    .replace(/\s*作者[：:][^\s].*$/u, '')
    .trim();
}

function parseBookMeta(html) {
  let title = html.match(/property="og:novel:book_name" content="([^"]+)"/)?.[1]
    || html.match(/<h1>([^<]+)<\/h1>/)?.[1]?.trim();
  title = cleanJcxsTitle(title);
  const author = html.match(/property="og:novel:author" content="([^"]+)"/)?.[1]
    || html.match(/作者：<a[^>]*>([^<]+)<\/a>/)?.[1]?.trim();
  const category = html.match(/property="og:novel:category" content="([^"]+)"/)?.[1] || '其他';
  const status = /property="og:novel:status" content="连载中"/.test(html) ? '连载中' : '已完结';
  const latestChapter = html.match(/property="og:novel:latest_chapter_name" content="([^"]+)"/)?.[1] || '';
  let excerpt = html.match(/<div id="intro_pc"[^>]*>[\s\S]*?<p>([\s\S]*?)<\/p>/)?.[1] || '';
  excerpt = decodeHtml(excerpt.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()).slice(0, 200);
  return { title, author, category, status, latestChapter, excerpt };
}

function chapterNumFromName(name) {
  const cn = name.match(/^第(\d+)章/)?.[1];
  if (cn) return Number(cn);
  return Number(name.match(/^(\d+)/)?.[1] || 0);
}

function parseCatalogPage(html) {
  const chapters = [];
  const re = /<a href="(\/read\/\d+\/\d+\/)">([^<]+)<\/a>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1];
    const name = decodeHtml(m[2].trim());
    if (name === '点击阅读' || /点击/.test(name)) continue;
    const num = chapterNumFromName(name);
    if (!num) continue;
    if (!chapters.some((c) => c.href === href)) {
      chapters.push({ href, name, num });
    }
  }
  return chapters;
}

function maxCatalogPageFromSelect(html, bookId) {
  let max = 0;
  const re = new RegExp(`value="/book/${bookId}/(\\d+)/"`, 'g');
  let m;
  while ((m = re.exec(html)) !== null) {
    const n = Number(m[1]);
    if (n > max) max = n;
  }
  return max;
}

function catalogPageUrls(bookId, indexHtml) {
  let max = maxCatalogPageFromSelect(indexHtml, bookId);
  if (max === 0) {
    const page1 = curl(`${BASE}/book/${bookId}/1/`);
    max = maxCatalogPageFromSelect(page1, bookId);
  }
  const urls = [`${BASE}/book/${bookId}/`];
  for (let p = 1; p <= max; p++) {
    urls.push(`${BASE}/book/${bookId}/${p}/`);
  }
  return urls;
}

function chapterNum(ch) {
  return ch.num || chapterNumFromName(ch.name);
}

function extractChapterBody(html) {
  const block = html.match(/<article id="novelcontent"[^>]*>([\s\S]*?)<\/article>/i)?.[1] || '';
  const lines = [];
  for (const m of block.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    let line = decodeHtml(m[1].replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim());
    if (!line) continue;
    if (/一秒记住本站|请关闭浏览器阅读模式|无法翻页或章节内容丢失/.test(line)) continue;
    if (/^https?:\/\/www\.jcxs\.org/i.test(line)) continue;
    lines.push(line);
  }
  return lines.join('\n\n');
}

function parseReadNav(html) {
  const next = html.match(/<a id="next"[^>]*href="([^"]+)"/)?.[1]
    || html.match(/<a id="next1"[^>]*href="([^"]+)"/)?.[1]
    || '';
  const chapterName = html.match(/<h1 id="chaptername">([^<]+)<\/h1>/)?.[1]?.trim() || '';
  return { next, chapterName };
}

function fetchChapterText(readPath) {
  const parts = [];
  let url = readPath.startsWith('http') ? readPath : `${BASE}${readPath}`;
  const baseMatch = url.match(/\/read\/\d+\/(\d+)\//);
  const chapterKey = baseMatch?.[1]?.replace(/_\d+$/, '') || '';

  for (let guard = 0; guard < 50; guard++) {
    const html = curl(url);
    const body = extractChapterBody(html);
    if (body) parts.push(body);

    const { next } = parseReadNav(html);
    if (!next || next.includes('/book/')) break;

    const nextUrl = next.startsWith('http') ? next : `${BASE}${next}`;
    const nextKey = next.match(/\/read\/\d+\/(\d+)(?:_\d+)?\//)?.[1]?.replace(/_\d+$/, '');
    if (nextKey && nextKey !== chapterKey && !next.includes(`${chapterKey}_`)) {
      break;
    }
    if (nextUrl === url) break;
    url = nextUrl;
    sleep(DELAY_MS);
  }

  return parts.join('\n\n');
}

function pickLocalId() {
  if (localIdArg) {
    const id = String(localIdArg);
    if (!isJcxsId(id)) throw new Error('jcxs 书籍 localId 须以 s 开头，如 s52266');
    return id;
  }
  return jcxsLocalId(bookId);
}

async function main() {
  console.log(`抓取 jcxs 书籍 ${bookId}…`);
  const indexHtml = curl(`${BASE}/book/${bookId}/`);
  const meta = parseBookMeta(indexHtml);
  if (!meta.title || !meta.author) {
    throw new Error('无法解析书名/作者');
  }
  console.log(`《${meta.title}》 作者：${meta.author}`);

  const allChapters = [];
  const seenHref = new Set();
  for (const url of catalogPageUrls(bookId, indexHtml)) {
    const html = curl(url);
    for (const ch of parseCatalogPage(html)) {
      if (seenHref.has(ch.href)) continue;
      seenHref.add(ch.href);
      allChapters.push(ch);
    }
    sleep(DELAY_MS);
  }
  const byNum = new Map();
  for (const ch of allChapters) {
    const n = chapterNum(ch);
    if (!byNum.has(n)) byNum.set(n, ch);
  }
  const sortedChapters = [...byNum.values()].sort((a, b) => chapterNum(a) - chapterNum(b));
  allChapters.length = 0;
  allChapters.push(...sortedChapters);

  const localId = pickLocalId();
  const maxChapter = allChapters.length;
  let filename = buildBookFilename(localId, meta.title, maxChapter);
  let outPath = getBookPath(root, filename);

  const resumeFrom = startChapter > 0 ? startChapter : 0;
  let startIndex = 0;
  if (resumeFrom > 1) {
    const books = discoverBooks(path.join(root, 'books'));
    const existing = books.find((b) => b.id === localId);
    if (!existing) {
      throw new Error(`续传需要已有 localId=${localId} 的 TXT`);
    }
    outPath = getBookPath(root, existing.filename);
    startIndex = allChapters.findIndex((ch) => chapterNum(ch) >= resumeFrom);
    if (startIndex < 0) throw new Error(`目录中找不到第 ${resumeFrom} 章`);
    console.log(`续传 ${outPath}，从第 ${chapterNum(allChapters[startIndex])} 章起…`);
  } else {
    const header = `《${meta.title}》  作者：${meta.author}\n${SOURCE_SHARE_LINE}\n\n\n`;
    fs.writeFileSync(outPath, header, 'utf8');
  }

  const todo = allChapters.slice(startIndex);
  console.log(`共 ${allChapters.length} 章，待下载 ${todo.length} 章…`);

  let done = startIndex;
  for (const ch of todo) {
    done++;
    process.stdout.write(`\r  [${done}/${allChapters.length}] ${ch.name.slice(0, 40)}…`);
    const text = fetchChapterText(ch.href);
    const titleLine = ch.name.replace(/^\d+\s*/, '').trim() || ch.name;
    fs.appendFileSync(outPath, `${titleLine}\n\n${text}\n\n\n`, 'utf8');
    sleep(DELAY_MS);
  }
  process.stdout.write('\n');

  const finalName = buildBookFilename(localId, meta.title, maxChapter);
  const finalPath = getBookPath(root, finalName);
  if (path.resolve(finalPath) !== path.resolve(outPath)) {
    if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath);
    fs.renameSync(outPath, finalPath);
    outPath = finalPath;
    filename = finalName;
  }

  const coverDir = path.join(root, 'csdn/src/assets/images/books');
  fs.mkdirSync(coverDir, { recursive: true });
  try {
    execSync(`curl.exe -sL -o "${path.join(coverDir, `book-${localId}.jpg`)}" "${BASE}/img/${bookId}.jpg"`, { stdio: 'pipe' });
  } catch {
    console.warn('封面下载失败');
  }

  const excerptPath = path.join(root, 'csdn/src/data/books', `book-${localId}-excerpt.txt`);
  if (meta.excerpt) fs.writeFileSync(excerptPath, meta.excerpt + '\n', 'utf8');

  console.log(`已写入 ${outPath}`);
  console.log(`localId=${localId} 章节 1-${maxChapter}`);
  console.log(`来源: ${BASE}/book/${bookId}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
