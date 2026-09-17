/**
 * 从 33小说网 x33xs6.com 抓取全书正文
 * 用法: node csdn/scripts/download-x33xs-book.js <bookUrl> [localId如x450111] [startChapter]
 * 本地 id 默认为 x{站点书籍ID}；目录页用 www，阅读页用 m 站（避免 CF）
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const {
  buildBookFilename,
  getBookPath,
  discoverBooks,
  x33xsLocalId,
  isX33xsId,
} = require('./book-paths');

const root = path.resolve(__dirname, '../..');
const { SOURCE_SHARE_LINE } = require('./source-share-line');
const BASE_WWW = 'http://www.x33xs6.com';
const BASE_M = 'http://m.x33xs6.com';
const DELAY_MS = 350;

const [, , urlOrPath, localIdArg, startChapterArg] = process.argv;
if (!urlOrPath) {
  console.error('用法: node download-x33xs-book.js <bookUrl|/33xs/450/450111/> [localId如x450111] [startChapter]');
  process.exit(1);
}
const startChapter = startChapterArg ? Number(startChapterArg) : 0;

function sleep(ms) {
  if (ms <= 0) return;
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function curl(url, mobile = false) {
  const ua = mobile
    ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
    : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0';
  return execSync(`curl.exe -sL -A "${ua}" "${url}"`, {
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

function parseBookPath(input) {
  const m = String(input).match(/\/33xs\/(\d+)\/(\d+)\/?/);
  if (!m) return null;
  return { shard: m[1], bookId: m[2], bookPath: `/33xs/${m[1]}/${m[2]}/` };
}

function parseBookMeta(html) {
  const title = html.match(/property="og:novel:book_name" content="([^"]+)"/)?.[1]
    || html.match(/property="og:title" content="([^"]+)"/)?.[1]?.trim();
  const author = html.match(/property="og:novel:author" content="([^"]+)"/)?.[1]?.trim();
  const category = (html.match(/property="og:novel:category" content="([^"]+)"/)?.[1] || '其他')
    .replace(/小说$/, '');
  const statusRaw = html.match(/property="og:novel:status" content="([^"]+)"/)?.[1] || '';
  const status = /完/.test(statusRaw) ? '已完结' : '连载中';
  const latestChapter = html.match(/property="og:novel:latest_chapter_name" content="([^"]+)"/)?.[1] || '';
  let excerpt = html.match(/property="og:description" content="([^"]+)"/)?.[1] || '';
  if (!excerpt) {
    excerpt = html.match(/<div id="intro"[^>]*>([\s\S]*?)<\/div>/i)?.[1] || '';
  }
  excerpt = decodeHtml(excerpt.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()).slice(0, 200);
  const date = html.match(/property="og:novel:update_time" content="([^"]+)"/)?.[1]?.slice(0, 10)
    || new Date().toISOString().slice(0, 10);
  return { title, author, category, status, latestChapter, excerpt, date };
}

function chapterNumFromName(name) {
  const cn = name.match(/^第(\d+)章/)?.[1];
  if (cn) return Number(cn);
  return Number(name.match(/^(\d+)/)?.[1] || 0);
}

function parseCatalog(html) {
  const chapters = [];
  const re = /<dd><a href="(\/33xs\/\d+\/\d+\/\d+\.html)">([^<]+)<\/a><\/dd>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1];
    const name = decodeHtml(m[2].trim());
    const num = chapterNumFromName(name);
    if (!num) continue;
    if (!chapters.some((c) => c.href === href)) {
      chapters.push({ href, name, num });
    }
  }
  return chapters.sort((a, b) => a.num - b.num);
}

function trimChapterSpam(text) {
  let out = text;
  const cutMarkers = [
    '有的人死了，但没有完全死',
    '无尽的昏迷过后，时宇猛地',
    '下载爱阅小说app',
    '网站已经不更新最新章节内容',
  ];
  for (const marker of cutMarkers) {
    const i = out.indexOf(marker);
    if (i > 80) out = out.slice(0, i).trim();
  }
  return out;
}

function extractChapterBody(html) {
  const block = html.match(/<div id="content"[^>]*>([\s\S]*?)<\/div>\s*<div class="bottem2"/i)?.[1]
    || html.match(/<div id="content"[^>]*>([\s\S]*?)<\/div>/i)?.[1]
    || html.match(/<div id="nr1"[^>]*>([\s\S]*?)<\/div>\s*<div class="nr_page"/i)?.[1]
    || html.match(/<div id="nr1"[^>]*>([\s\S]*?)<\/div>/i)?.[1]
    || '';
  let inner = block.replace(/<script[\s\S]*?<\/script>/gi, '');
  // 正文多在 <p> 标题块之外，以 <br> 分隔
  inner = inner.replace(/<p[^>]*>[\s\S]*?<\/p>/gi, '');
  inner = inner.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '');
  inner = decodeHtml(inner);

  const lines = [];
  for (const raw of inner.split('\n')) {
    let line = raw.replace(/\u3000/g, ' ').trim();
    if (!line) continue;
    if (/^\[?\d+\/\d+页\]?$/.test(line)) continue;
    if (/^第\d+章/.test(line) && line.length < 80 && /\[\d+\/\d+页\]/.test(line)) continue;
    line = line.replace(/\[\d+\/\d+页\]/g, '').trim();
    if (!line) continue;
    if (/继续阅读|下载app|可看《|章节错误|报送|x33小说|33小说网/.test(line)) continue;
    lines.push(line);
  }
  return trimChapterSpam(lines.join('\n\n'));
}

function parseNextHref(html) {
  return html.match(/<a id="pt_next"[^>]*href="([^"]+)"/)?.[1] || '';
}

function chapterFileId(href) {
  return href.match(/\/(\d+)(?:_\d+)?\.html/)?.[1] || '';
}

function fetchChapterText(firstHref, bookPath) {
  const rel = firstHref.startsWith('/') ? firstHref : `/${firstHref}`;

  for (let retry = 0; retry < 5; retry++) {
    const html = curl(`${BASE_WWW}${rel}`, false);
    if (!/Just a moment/.test(html)) {
      const body = extractChapterBody(html);
      if (body.length > 40) return body;
    }
    sleep(1200 * (retry + 1));
  }

  const parts = [];
  let pageRel = rel;
  const rootId = chapterFileId(rel);
  const seen = new Set();

  for (let guard = 0; guard < 30; guard++) {
    const url = `${BASE_M}${pageRel}`;
    if (seen.has(url)) break;
    seen.add(url);

    let html = '';
    for (let retry = 0; retry < 5; retry++) {
      html = curl(url, true);
      if (!/Just a moment/.test(html)) break;
      sleep(1200 * (retry + 1));
    }
    if (/Just a moment/.test(html)) {
      throw new Error(`阅读页被拦截: ${pageRel}`);
    }

    const body = extractChapterBody(html);
    if (body) parts.push(body);

    const next = parseNextHref(html);
    if (!next || next.includes('javascript')) break;
    const nextRel = next.startsWith('/') ? next : `/${next}`;
    if (!nextRel.includes(bookPath.replace(/\/$/, ''))) break;
    const nextRoot = chapterFileId(nextRel);
    if (nextRoot && nextRoot !== rootId && !/_\d+\.html$/i.test(nextRel)) break;
    if (nextRel === pageRel) break;
    pageRel = nextRel;
    sleep(DELAY_MS);
  }

  const merged = parts.join('\n\n');
  if (!merged) throw new Error(`正文为空: ${rel}`);
  return merged;
}

function pickLocalId(bookId) {
  if (localIdArg) {
    const id = String(localIdArg);
    if (!isX33xsId(id)) throw new Error('x33xs 书籍 localId 须以 x 开头，如 x450111');
    return id;
  }
  return x33xsLocalId(bookId);
}

function slugify(title) {
  return title
    .replace(/[？！。，、：:；;（）()《》「」【】\s]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .slice(0, 40) || `book-${Date.now()}`;
}

async function main() {
  const parsed = parseBookPath(urlOrPath);
  if (!parsed) throw new Error('无法解析书籍 URL，需含 /33xs/{shard}/{bookId}/');
  const { shard, bookId, bookPath } = parsed;
  const indexUrl = `${BASE_WWW}${bookPath}`;
  console.log(`抓取 x33xs 书籍 ${bookId}…`);
  const indexHtml = curl(indexUrl, false);
  if (/Just a moment/.test(indexHtml)) {
    throw new Error('目录页被 Cloudflare 拦截，请稍后重试或使用 http://www.x33xs6.com');
  }
  const meta = parseBookMeta(indexHtml);
  if (!meta.title || !meta.author) throw new Error('无法解析书名/作者');

  const chapters = parseCatalog(indexHtml);
  if (chapters.length === 0) throw new Error('目录为空');

  console.log(`《${meta.title}》 作者：${meta.author}`);
  const localId = pickLocalId(bookId);
  const maxChapter = chapters.length;
  let filename = buildBookFilename(localId, meta.title, maxChapter);
  let outPath = getBookPath(root, filename);

  let startIndex = 0;
  if (startChapter > 1) {
    const books = discoverBooks(path.join(root, 'books'));
    const existing = books.find((b) => b.id === localId);
    if (!existing) throw new Error(`续传需要已有 localId=${localId} 的 TXT`);
    outPath = getBookPath(root, existing.filename);
    startIndex = chapters.findIndex((ch) => ch.num >= startChapter);
    if (startIndex < 0) throw new Error(`目录中找不到第 ${startChapter} 章`);
    console.log(`续传 ${outPath}，从第 ${chapters[startIndex].num} 章起…`);
  } else {
    const header = `《${meta.title}》  作者：${meta.author}\n${SOURCE_SHARE_LINE}\n\n\n`;
    fs.writeFileSync(outPath, header, 'utf8');
  }

  const todo = chapters.slice(startIndex);
  console.log(`共 ${chapters.length} 章，待下载 ${todo.length} 章…`);

  let done = startIndex;
  for (const ch of todo) {
    done++;
    process.stdout.write(`\r  [${done}/${chapters.length}] ${ch.name.slice(0, 36)}…`);
    const text = fetchChapterText(ch.href, bookPath);
    fs.appendFileSync(outPath, `${ch.name}\n\n${text}\n\n\n`, 'utf8');
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
  const coverPath = path.join(coverDir, `book-${localId}.jpg`);
  try {
    execSync(`curl.exe -sL -A "Mozilla/5.0" -o "${coverPath}" "${BASE_WWW}/img/${shard}/${bookId}.jpg"`, { stdio: 'pipe' });
    const buf = fs.readFileSync(coverPath);
    if (buf.length < 500) fs.unlinkSync(coverPath);
  } catch {
    console.warn('封面下载失败');
  }

  const excerptPath = path.join(root, 'csdn/src/data/books', `book-${localId}-excerpt.txt`);
  if (meta.excerpt) fs.writeFileSync(excerptPath, meta.excerpt + '\n', 'utf8');

  const registryPath = path.join(root, 'csdn/src/data/deqixs-batch-registry.json');
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  const entry = {
    id: localId,
    slug: slugify(meta.title),
    title: meta.title,
    author: meta.author,
    date: meta.date,
    category: meta.category,
    status: meta.status,
    chapters: `1-${maxChapter}章`,
    latestChapter: meta.latestChapter || chapters[chapters.length - 1].name,
    excerpt: meta.excerpt,
    filename,
    downloadUrl: `/books/${filename}`,
    sourceUrl: `https://www.x33xs6.com${bookPath}`,
    tags: [
      { name: meta.category, type: 'purple' },
      { name: meta.status === '已完结' ? '完结' : '连载', type: 'blue' },
    ],
  };
  const idx = registry.findIndex((b) => b.id === localId);
  if (idx >= 0) registry[idx] = entry;
  else registry.push(entry);
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf8');

  console.log(`已写入 ${outPath}`);
  console.log(`localId=${localId} 章节 1-${maxChapter}`);
  console.log(`来源: https://www.x33xs6.com${bookPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
