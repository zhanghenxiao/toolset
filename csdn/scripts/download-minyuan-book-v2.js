/**
 * 小原文学网 min-yuan.com 全书下载 v2.0
 * - https keep-alive 复用连接（替代 curl.exe 子进程）
 * - 有限章节并发 + 全局限流，尽量快且降低被封风险
 *
 * 用法:
 *   node csdn/scripts/download-minyuan-book-v2.js <bookUrl|/txt/slug/> [localId] [startChapter]
 *   node csdn/scripts/download-minyuan-book-v2.js /txt/syr/ m_syr --concurrency 4 --delay 100
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');
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
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0';

function parseCli(argv) {
  const opts = {
    urlOrPath: '',
    localId: '',
    startChapter: 0,
    concurrency: 4,
    delayMs: 100,
    jitterMs: 40,
    retries: 3,
  };
  const positional = [];
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    if (key === '--concurrency') {
      opts.concurrency = Math.max(1, Number(argv[++i] || 4));
    } else if (key === '--delay') {
      opts.delayMs = Math.max(0, Number(argv[++i] || 100));
    } else if (key === '--jitter') {
      opts.jitterMs = Math.max(0, Number(argv[++i] || 40));
    } else if (key === '--retries') {
      opts.retries = Math.max(1, Number(argv[++i] || 3));
    } else {
      positional.push(key);
    }
  }
  [opts.urlOrPath, opts.localId, opts.startChapterArg] = positional;
  opts.startChapter = opts.startChapterArg ? Number(opts.startChapterArg) : 0;
  return opts;
}

const cli = parseCli(process.argv);
if (!cli.urlOrPath) {
  console.error('用法: node download-minyuan-book-v2.js <bookUrl|/txt/slug/> [localId] [startChapter] [--concurrency N] [--delay MS]');
  process.exit(1);
}

const agent = new https.Agent({
  keepAlive: true,
  maxSockets: cli.concurrency + 2,
  maxFreeSockets: cli.concurrency + 2,
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class RateLimiter {
  constructor(minGapMs) {
    this.minGapMs = minGapMs;
    this.chain = Promise.resolve();
    this.lastAt = 0;
  }

  wait() {
    this.chain = this.chain.then(async () => {
      const now = Date.now();
      const gap = this.minGapMs + (cli.jitterMs > 0 ? Math.floor(Math.random() * cli.jitterMs) : 0);
      const waitMs = Math.max(0, this.lastAt + gap - now);
      if (waitMs > 0) await sleep(waitMs);
      this.lastAt = Date.now();
    });
    return this.chain;
  }

  pause(ms) {
    this.chain = this.chain.then(async () => {
      await sleep(ms);
      this.lastAt = Date.now() + ms;
    });
    return this.chain;
  }
}

const limiter = new RateLimiter(cli.delayMs);

function fetchHtml(url, referer = `${BASE}/`) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = https.request(parsed, {
      method: 'GET',
      agent,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        Referer: referer,
      },
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchHtml(new URL(res.headers.location, parsed).href, referer).then(resolve, reject);
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        if (res.statusCode === 429 || res.statusCode === 503) {
          reject(new Error(`HTTP ${res.statusCode} 限流: ${url}`));
          return;
        }
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${url}`));
          return;
        }
        resolve(text);
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => req.destroy(new Error(`请求超时: ${url}`)));
    req.end();
  });
}

async function fetchHtmlWithRetry(url, referer = `${BASE}/`) {
  let lastErr;
  for (let i = 0; i < cli.retries; i += 1) {
    await limiter.wait();
    try {
      return await fetchHtml(url, referer);
    } catch (err) {
      lastErr = err;
      const isRateLimit = /HTTP 429|HTTP 503|限流|超时|ECONNRESET|ETIMEDOUT/i.test(String(err.message));
      if (isRateLimit) {
        const backoff = 3000 * (i + 1);
        console.warn(`\n  限流/网络异常，暂停 ${backoff}ms 后重试…`);
        await limiter.pause(backoff);
      } else if (i < cli.retries - 1) {
        await sleep(800 * (i + 1));
      }
    }
  }
  throw lastErr;
}

async function fetchChapterText(firstHref, slug) {
  const rel = firstHref.startsWith('/') ? firstHref : `/${firstHref}`;
  const rootId = rel.match(/\/(\d+)\.html$/)?.[1];
  if (!rootId) throw new Error(`无法解析章节路径: ${rel}`);

  const parts = [];
  let pageRel = rel;
  const seen = new Set();
  let referer = `${BASE}/txt/${slug}/`;

  for (let guard = 0; guard < 40; guard++) {
    const url = `${BASE}${pageRel}`;
    if (seen.has(url)) break;
    seen.add(url);

    const html = await fetchHtmlWithRetry(url, referer);
    const body = extractBooktxt(html);
    if (body) parts.push(body);

    const next = parseNextHref(html);
    if (!next || next.includes('javascript')) break;
    const nextRel = next.startsWith('/') ? next : `/${next}`;
    const pageRe = new RegExp(`^/txt/${slug}/${rootId}_\\d+\\.html$`, 'i');
    if (pageRe.test(nextRel)) {
      referer = url;
      pageRel = nextRel;
      continue;
    }
    break;
  }

  const merged = parts.join('\n\n');
  if (!merged) throw new Error(`正文为空或转码中: ${rel}`);
  return merged;
}

function pickLocalId(slug) {
  if (cli.localId) {
    const id = String(cli.localId);
    if (!isMinyuanId(id)) throw new Error('min-yuan 书籍 localId 须以 m_ 开头，如 m_syr');
    return id;
  }
  return minyuanLocalId(slug);
}

async function downloadChaptersParallel(chapters, slug, startIndex, outPath) {
  const concurrency = cli.concurrency;
  let failed = 0;
  let completed = startIndex;
  let nextWrite = startIndex;
  const buffer = new Map();
  let cursor = startIndex;

  function tryFlush() {
    while (buffer.has(nextWrite)) {
      const item = buffer.get(nextWrite);
      buffer.delete(nextWrite);
      if (item.error) {
        failed += 1;
        fs.appendFileSync(
          outPath,
          `${item.ch.name}\n\n[本章下载失败: ${item.error}]\n\n\n`,
          'utf8',
        );
      } else {
        fs.appendFileSync(outPath, `${item.ch.name}\n\n${item.text}\n\n\n`, 'utf8');
      }
      nextWrite += 1;
      completed += 1;
      process.stdout.write(`\r  [${completed}/${chapters.length}] ${item.ch.name.slice(0, 36)}…`);
    }
  }

  async function worker() {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= chapters.length) break;
      const ch = chapters[index];
      try {
        const text = await fetchChapterText(ch.href, slug);
        buffer.set(index, { ch, text });
      } catch (err) {
        buffer.set(index, { ch, error: err.message });
      }
      tryFlush();
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  tryFlush();
  process.stdout.write('\n');
  return failed;
}

async function main() {
  const parsed = parseBookPath(cli.urlOrPath);
  if (!parsed) throw new Error('无法解析书籍 URL，需含 /txt/{slug}/');
  const { slug } = parsed;
  const indexUrl = `${BASE}/txt/${slug}/`;
  console.log(`抓取 min-yuan 书籍 ${slug}（v2 并发=${cli.concurrency} 间隔=${cli.delayMs}ms）…`);

  const indexHtml = await fetchHtmlWithRetry(indexUrl);
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
  if (cli.startChapter > 1) {
    const books = discoverBooks(path.join(root, 'books'));
    const existing = books.find((b) => String(b.id) === String(localId));
    if (!existing) throw new Error(`续传需要已有 localId=${localId} 的 TXT`);
    outPath = getBookPath(root, existing.filename);
    startIndex = chapters.findIndex((ch) => ch.num >= cli.startChapter);
    if (startIndex < 0) throw new Error(`目录中找不到第 ${cli.startChapter} 章`);
    console.log(`续传 ${outPath}，从第 ${chapters[startIndex].num} 章起…`);
  } else {
    const header = buildBookHeader(meta.title, meta.author);
    fs.writeFileSync(outPath, header, 'utf8');
  }

  const todo = chapters.slice(startIndex);
  console.log(`共 ${chapters.length} 章，待下载 ${todo.length} 章…`);

  const failed = await downloadChaptersParallel(chapters, slug, startIndex, outPath);

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

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
