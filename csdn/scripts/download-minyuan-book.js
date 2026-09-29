/**
 * 从小原文学网 min-yuan.com 抓取全书正文（v1.0：curl 串行，稳定优先）
 * 用法: node csdn/scripts/download-minyuan-book.js <bookUrl|/txt/slug/> [localId如m_syr] [startChapter]
 * 本地 id 默认为 m_{slug}
 * 加速版见 download-minyuan-book-v2.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const {
  buildBookFilename,
  getBookPath,
  discoverBooks,
  minyuanLocalId,
  isMinyuanId,
} = require('./book-paths');
const {
  BASE,
  parseBookPath,
  parseBookMeta,
  parseCatalog,
  extractBooktxt,
  parseNextHref,
} = require('./minyuan-book-core');

const root = path.resolve(__dirname, '../..');
const { buildBookHeader, finalizeBookFile } = require('./source-share-line');
const DELAY_MS = 300;

const [, , urlOrPath, localIdArg, startChapterArg] = process.argv;
if (!urlOrPath) {
  console.error('用法: node download-minyuan-book.js <bookUrl|/txt/syr/> [localId如m_syr] [startChapter]');
  process.exit(1);
}
const startChapter = startChapterArg ? Number(startChapterArg) : 0;

function sleep(ms) {
  if (ms <= 0) return;
  const end = Date.now() + ms;
  while (Date.now() < end) {
    /* wait */
  }
}

function curl(url, retries = 6) {
  const cmd = `curl.exe -sL --connect-timeout 60 --max-time 180 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0" "${url.replace(/"/g, '%22')}"`;
  let lastErr;
  for (let i = 0; i < retries; i += 1) {
    try {
      return execSync(cmd, {
        encoding: 'utf8',
        maxBuffer: 50 * 1024 * 1024,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } catch (err) {
      const body = err.stdout || err.output?.[1];
      if (body && String(body).length > 200) return String(body);
      lastErr = err;
      if (i < retries - 1) {
        const waitMs = 3000 * (i + 1);
        console.warn(`\n  网络异常，${Math.round(waitMs / 1000)}s 后重试 (${i + 1}/${retries - 1})…`);
        sleep(waitMs);
      }
    }
  }
  throw lastErr;
}

function fetchChapterText(firstHref, slug) {
  const rel = firstHref.startsWith('/') ? firstHref : `/${firstHref}`;
  const rootId = rel.match(/\/(\d+)\.html$/)?.[1];
  if (!rootId) throw new Error(`无法解析章节路径: ${rel}`);

  const parts = [];
  let pageRel = rel;
  const seen = new Set();

  for (let guard = 0; guard < 40; guard++) {
    const url = `${BASE}${pageRel}`;
    if (seen.has(url)) break;
    seen.add(url);

    const html = curl(url);
    const body = extractBooktxt(html);
    if (body) parts.push(body);

    const next = parseNextHref(html);
    if (!next || next.includes('javascript')) break;
    const nextRel = next.startsWith('/') ? next : `/${next}`;
    const pageRe = new RegExp(`^/txt/${slug}/${rootId}_\\d+\\.html$`, 'i');
    if (pageRe.test(nextRel)) {
      pageRel = nextRel;
      sleep(DELAY_MS);
      continue;
    }
    break;
  }

  const merged = parts.join('\n\n');
  if (!merged) throw new Error(`正文为空或转码中: ${rel}`);
  return merged;
}

function pickLocalId(slug) {
  if (localIdArg) {
    const id = String(localIdArg);
    if (!isMinyuanId(id)) throw new Error('min-yuan 书籍 localId 须以 m_ 开头，如 m_syr');
    return id;
  }
  return minyuanLocalId(slug);
}

function main() {
  const parsed = parseBookPath(urlOrPath);
  if (!parsed) throw new Error('无法解析书籍 URL，需含 /txt/{slug}/');
  const { slug } = parsed;
  const indexUrl = `${BASE}/txt/${slug}/`;
  console.log(`抓取 min-yuan 书籍 ${slug}…`);

  const indexHtml = curl(indexUrl, 8);
  const meta = parseBookMeta(indexHtml);
  if (!meta.title || !meta.author) throw new Error('无法解析书名/作者');

  const chapters = parseCatalog(indexHtml, slug);
  if (chapters.length === 0) throw new Error('目录为空');

  console.log(`《${meta.title}》 作者：${meta.author}`);
  const localId = pickLocalId(slug);
  const maxChapter = chapters.length;
  let filename = buildBookFilename(localId, meta.title, maxChapter);
  let outPath = getBookPath(root, filename);

  let startIndex = 0;
  if (startChapter > 1) {
    const books = discoverBooks(path.join(root, 'books'));
    const existing = books.find((b) => String(b.id) === String(localId));
    if (!existing) throw new Error(`续传需要已有 localId=${localId} 的 TXT`);
    outPath = getBookPath(root, existing.filename);
    startIndex = chapters.findIndex((ch) => ch.num >= startChapter);
    if (startIndex < 0) throw new Error(`目录中找不到第 ${startChapter} 章`);
    console.log(`续传 ${outPath}，从第 ${chapters[startIndex].num} 章起…`);
  } else {
    const header = buildBookHeader(meta.title, meta.author);
    fs.writeFileSync(outPath, header, 'utf8');
  }

  const todo = chapters.slice(startIndex);
  console.log(`共 ${chapters.length} 章，待下载 ${todo.length} 章…`);

  let failed = 0;
  let done = startIndex;
  for (const ch of todo) {
    done++;
    process.stdout.write(`\r  [${done}/${chapters.length}] ${ch.name.slice(0, 36)}…`);
    try {
      const text = fetchChapterText(ch.href, slug);
      fs.appendFileSync(outPath, `${ch.name}\n\n${text}\n\n\n`, 'utf8');
    } catch (err) {
      failed++;
      console.warn(`\n  跳过 ${ch.name}: ${err.message}`);
      fs.appendFileSync(outPath, `${ch.name}\n\n[本章下载失败: ${err.message}]\n\n\n`, 'utf8');
    }
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

  finalizeBookFile(outPath);

  const coverDir = path.join(root, 'csdn/src/assets/images/books');
  fs.mkdirSync(coverDir, { recursive: true });
  const coverPath = path.join(coverDir, `book-${localId}.jpg`);
  try {
    execSync(`curl.exe -sL -A "Mozilla/5.0" -o "${coverPath}" "${BASE}/images/${slug}.jpg"`, { stdio: 'pipe' });
    const buf = fs.readFileSync(coverPath);
    if (buf.length < 500) fs.unlinkSync(coverPath);
  } catch {
    console.warn('封面下载失败');
  }

  const excerptPath = path.join(root, 'csdn/src/data/books', `book-${localId}-excerpt.txt`);
  if (meta.excerpt) fs.writeFileSync(excerptPath, meta.excerpt + '\n', 'utf8');

  console.log(`已写入 ${outPath}`);
  console.log(`localId=${localId} 章节 1-${maxChapter}${failed ? `（失败 ${failed} 章）` : ''}`);
  console.log('运行: node csdn/scripts/clean-book-txt.js');
  console.log('运行: node csdn/scripts/sync-all-books-data.js');
}

main();
