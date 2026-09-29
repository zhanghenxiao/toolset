/**
 * 从篱笆好文学 libahao2.com 抓取全书正文
 * 用法:
 *   node csdn/scripts/download-libahao-book.js <bookUrl> [localId如l_12492955__660499] [startChapter]
 *   node csdn/scripts/download-libahao-book.js --from-list [index] [localId]
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');
const { execSync } = require('child_process');
const {
  buildBookFilename,
  getBookPath,
  libahaoLocalId,
  isLibahaoId,
  parseLibahaoBookUrl,
} = require('./book-paths');

const root = path.resolve(__dirname, '../..');
const { buildBookHeader, finalizeBookFile } = require('./source-share-line');
const COOKIE_FILE = path.join(root, 'books/_work/libahao/cookie.txt');
const LIST_FILE = path.join(root, 'books/_work/libahao/book-list.json');
const BASE = 'https://m.libahao2.com';
const MOBILE_UA = 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36';
const INDEX_CACHE = path.join(root, 'books/_work/libahao/book-detail.html');
const CHAPTER_CACHE_DIR = path.join(root, 'books/_work/libahao/chapters');

function parseCliArgs(argv) {
  const args = {
    urlOrFlag: '',
    arg2: '',
    arg3: '',
    delayMs: 3000,
    importHtml: '',
    importPage: '',
    cacheOnly: false,
    coverOnly: false,
  };
  const positional = [];
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    if (key === '--cover-only') {
      args.coverOnly = true;
    } else if (key === '--delay') {
      args.delayMs = Number(argv[i + 1] || 3000);
      i += 1;
    } else if (key === '--import-html') {
      args.importHtml = argv[i + 1] || '';
      i += 1;
    } else if (key === '--import-page') {
      args.importPage = argv[i + 1] || '';
      i += 1;
    } else if (key === '--cache-only') {
      args.cacheOnly = true;
    } else {
      positional.push(key);
    }
  }
  [args.urlOrFlag, args.arg2, args.arg3] = positional;
  return args;
}

const cli = parseCliArgs(process.argv);
const { urlOrFlag, arg2, arg3, delayMs: DELAY_MS, importHtml, importPage, cacheOnly, coverOnly } = cli;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.max(0, ms));
  });
}

function loadCookie() {
  if (process.env.LIBAHAO_COOKIE) return process.env.LIBAHAO_COOKIE.trim();
  if (fs.existsSync(COOKIE_FILE)) return fs.readFileSync(COOKIE_FILE, 'utf8').trim();
  return '';
}

function fetchHtml(url, referer = `${BASE}/`) {
  const cookie = loadCookie();
  const headers = {
    'User-Agent': MOBILE_UA,
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    Referer: referer,
  };
  if (cookie) headers.Cookie = cookie;

  return new Promise((resolve, reject) => {
    const get = (targetUrl, redirects = 0) => {
      if (redirects > 5) {
        reject(new Error(`重定向过多: ${url}`));
        return;
      }
      const parsed = new URL(targetUrl);
      const lib = parsed.protocol === 'http:' ? http : https;
      const req = lib.request(parsed, { method: 'GET', headers }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          get(new URL(res.headers.location, parsed).href, redirects + 1);
          return;
        }
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode} ${targetUrl}`));
            return;
          }
          if (/403 Forbidden|你的区域被禁止访问/i.test(text)) {
            reject(new Error(`被站点拦截: ${targetUrl}`));
            return;
          }
          resolve(text);
        });
      });
      req.on('error', reject);
      req.setTimeout(30000, () => {
        req.destroy(new Error(`请求超时: ${targetUrl}`));
      });
      req.end();
    };
    get(url);
  });
}

async function fetchHtmlWithRetry(url, referer = `${BASE}/`, retries = 3) {
  let lastErr;
  for (let i = 0; i < retries; i += 1) {
    try {
      return await fetchHtml(url, referer);
    } catch (err) {
      lastErr = err;
      await sleep(2500 * (i + 1));
    }
  }
  throw lastErr;
}

function chapterCachePath(bookPath, pageHref) {
  const safe = pageHref.replace(/[^\w.-]+/g, '_').replace(/\.html$/i, '');
  return path.join(CHAPTER_CACHE_DIR, bookPath, `${safe}.html`);
}

function progressPath(bookPath) {
  return path.join(CHAPTER_CACHE_DIR, bookPath, '.progress.json');
}

function loadProgress(bookPath) {
  const file = progressPath(bookPath);
  if (!fs.existsSync(file)) return { completedChapterNums: [], partialChapterNums: [] };
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return { completedChapterNums: [], partialChapterNums: [] };
  }
}

function saveProgress(bookPath, progress) {
  fs.mkdirSync(path.dirname(progressPath(bookPath)), { recursive: true });
  fs.writeFileSync(progressPath(bookPath), `${JSON.stringify(progress, null, 2)}\n`, 'utf8');
}

function importHtmlToCache(bookPath, pageHref, srcFile) {
  const cachePath = chapterCachePath(bookPath, pageHref);
  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  fs.copyFileSync(srcFile, cachePath);
  console.log(`已导入缓存: ${pageHref} <- ${srcFile}`);
}

async function loadChapterHtml(bookPath, pageHref, referer) {
  const cachePath = chapterCachePath(bookPath, pageHref);
  if (fs.existsSync(cachePath)) {
    return fs.readFileSync(cachePath, 'utf8');
  }
  if (cacheOnly) {
    throw new Error(`无本地缓存: ${pageHref}`);
  }
  const url = `${BASE}${pageHref.startsWith('/') ? pageHref : `/${pageHref}`}`;
  const html = await fetchHtmlWithRetry(url, referer);
  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  fs.writeFileSync(cachePath, html, 'utf8');
  return html;
}

function countDownloadedChapters(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  const content = fs.readFileSync(filePath, 'utf8');
  return (content.match(/^\s{2}[^\n]+$/gm) || []).length;
}

function findExistingBookFile(localId) {
  const booksDir = path.join(root, 'books');
  if (!fs.existsSync(booksDir)) return null;
  const prefix = `${localId}_`;
  const hit = fs.readdirSync(booksDir).find((name) => name.startsWith(prefix) && name.endsWith('.txt'));
  return hit ? path.join(booksDir, hit) : null;
}

function decodeHtml(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function parseBookMeta(html) {
  const title = html.match(/property="og:novel:book_name" content="([^"]+)"/)?.[1]?.trim()
    || html.match(/class="book-info-title">([^<]+)</)?.[1]?.trim();
  const author = html.match(/property="og:novel:author" content="([^"]+)"/)?.[1]?.trim()
    || html.match(/作者:\s*([^<]+)</)?.[1]?.trim();
  const category = (html.match(/property="og:novel:category" content="([^"]+)"/)?.[1] || '其他')
    .replace(/小说$/, '');
  const statusRaw = html.match(/property="og:novel:status" content="([^"]+)"/)?.[1] || '';
  const status = /完/.test(statusRaw) ? '已完结' : '连载中';
  const latestChapter = html.match(/property="og:novel:lastest_chapter_name" content="([^"]+)"/)?.[1] || '';
  let excerpt = html.match(/property="og:description" content="([^"]+)"/)?.[1] || '';
  excerpt = decodeHtml(excerpt.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()).slice(0, 200);
  const date = html.match(/property="og:novel:update_time" content="([^"]+)"/)?.[1]?.slice(0, 10)
    || new Date().toISOString().slice(0, 10);
  const coverUrl = extractCoverFromBookInfo(html);
  return { title, author, category, status, latestChapter, excerpt, date, coverUrl };
}

function extractCoverFromBookInfo(html) {
  const bookInfoRe = /<div[^>]*class="[^"]*\bbook-info\b[^"]*"[^>]*>([\s\S]*?)(?=<div[^>]*class="(?:book-|chapter|catalog)|章节列表)/gi;
  let m;
  while ((m = bookInfoRe.exec(html)) !== null) {
    const img = m[1].match(/<img[^>]+src="([^"]+)"/i)?.[1];
    if (img && !/logo|avatar|default/i.test(img)) {
      return img;
    }
  }
  const loose = html.match(/class="[^"]*\bbook-info\b[^"]*"[\s\S]{0,8000}?<img[^>]+src="([^"]+)"/i)?.[1];
  if (loose) return loose;
  return html.match(/class="book-info-cover"[^>]*src="([^"]+)"/)?.[1]
    || html.match(/<img[^>]*class="book-info-cover"[^>]*src="([^"]+)"/)?.[1]
    || '';
}

function parseCatalog(html, bookPath) {
  const section = html.includes('章节列表:</h3>')
    ? html.split('章节列表:</h3>')[1].split(/<div class="chapter-list">/)[0]
    : html;
  const chapters = [];
  const seenHref = new Set();
  const re = new RegExp(`href="(/book/${bookPath}/(\\d+)(?:_\\d+)?\\.html)"[^>]*>([\\s\\S]*?)</a>`, 'gi');
  let m;
  while ((m = re.exec(section)) !== null) {
    const href = m[1];
    const chapterNum = Number(m[2]);
    const name = decodeHtml(m[3].replace(/<[^>]+>/g, '').trim());
    if (!name || !chapterNum) continue;
    if (seenHref.has(href)) continue;
    seenHref.add(href);
    chapters.push({ name, href, chapterNum });
  }
  chapters.sort((a, b) => a.chapterNum - b.chapterNum);

  const nums = chapters.map((c) => c.chapterNum);
  const maxNum = Math.max(...nums, 0);
  for (let n = 1; n <= maxNum; n++) {
    const href = `/book/${bookPath}/${n}.html`;
    if (!seenHref.has(href)) {
      chapters.push({ name: `第${n}章`, href, chapterNum: n });
      seenHref.add(href);
    }
  }
  return chapters.sort((a, b) => a.chapterNum - b.chapterNum);
}

function extractChapterHtml(html) {
  const block = html.match(/id="chapterContent"[^>]*>([\s\S]*?)<\/div>/i)?.[1] || '';
  return block
    .replace(/<b[^>]*color:\s*#ff0000[^>]*>[\s\S]*?<\/b>/gi, '')
    .replace(/<a[^>]*rel="next"[^>]*>[\s\S]*?<\/a>/gi, '')
    .replace(/<a[^>]*>[\s\S]*?本章未完[\s\S]*?<\/a>/gi, '');
}

function htmlToText(html) {
  let text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<[^>]+>/g, '');
  return decodeHtml(text).replace(/\u3000/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

function parseNextPageHref(html, bookPath, currentHref) {
  const relNext = html.match(/rel="next"[^>]*href="([^"]+)"/i)?.[1];
  if (relNext && relNext.includes(bookPath)) return relNext;
  const footerNext = html.match(/class="footer-nav"[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>下一页<\/a>/i)?.[1];
  if (footerNext && footerNext.includes(bookPath)) return footerNext;
  const base = currentHref.replace(/_\d+\.html$/i, '.html').replace(/\.html$/i, '');
  const pageNext = html.match(new RegExp(`href="(/book/${bookPath}/${base.match(/\/(\d+)(?:_\d+)?\.html$/)?.[1] || '\\d+'}_\\d+\\.html)"`, 'i'))?.[1];
  return pageNext || '';
}

async function fetchChapterText(bookPath, href) {
  const parts = [];
  let pageHref = href.startsWith('/') ? href : `/${href}`;
  const seen = new Set();
  const referer = `${BASE}/book/${bookPath}/`;
  let partial = false;

  for (let guard = 0; guard < 20; guard++) {
    if (seen.has(pageHref)) break;
    seen.add(pageHref);

    let html = '';
    try {
      html = await loadChapterHtml(bookPath, pageHref, referer);
    } catch (err) {
      const cachePath = chapterCachePath(bookPath, pageHref);
      if (fs.existsSync(cachePath)) {
        html = fs.readFileSync(cachePath, 'utf8');
      } else if (parts.length > 0) {
        partial = true;
        break;
      } else {
        throw err;
      }
    }

    const body = htmlToText(extractChapterHtml(html));
    if (body) parts.push(body);

    const next = parseNextPageHref(html, bookPath, pageHref);
    if (!next || next === pageHref) break;
    pageHref = next.startsWith('/') ? next : `/${next}`;
    await sleep(DELAY_MS);
  }

  const merged = parts.join('\n\n');
  if (!merged) throw new Error(`正文为空: ${href}`);
  return { text: merged, partial };
}

function pickLocalId(siteBookId, imageId, customId) {
  if (customId) {
    const id = String(customId);
    if (!isLibahaoId(id)) throw new Error('libahao 书籍 localId 须以 l_ 开头，如 l_12492955__660499');
    return id;
  }
  return libahaoLocalId(siteBookId, imageId);
}

function resolveInput() {
  if (urlOrFlag === '--from-list') {
    const index = Number(arg2 || 0);
    const list = JSON.parse(fs.readFileSync(LIST_FILE, 'utf8'));
    const book = list.books[index];
    if (!book) throw new Error(`book-list.json 中无 index=${index} 的书籍`);
    return { bookUrl: book.url, localIdArg: arg3, metaFromList: book };
  }
  if (!urlOrFlag) {
    console.error('用法: node download-libahao-book.js <bookUrl> [localId] [startChapter]');
    console.error('      node download-libahao-book.js --from-list [index] [localId]');
    process.exit(1);
  }
  return { bookUrl: urlOrFlag, localIdArg: arg2, startChapterArg: arg3 };
}

async function main() {
  if (importHtml) {
    if (!importPage) {
      throw new Error('--import-html 需配合 --import-page，如 --import-page /book/12492955_660499/1_1.html');
    }
    const parsed = parseLibahaoBookUrl(importPage.includes('/book/') ? `${BASE}${importPage}` : importPage);
    if (!parsed) throw new Error(`无法解析 --import-page: ${importPage}`);
    const src = path.isAbsolute(importHtml) ? importHtml : path.join(root, importHtml);
    if (!fs.existsSync(src)) throw new Error(`文件不存在: ${src}`);
    importHtmlToCache(parsed.bookPath, importPage.startsWith('/') ? importPage : `/${importPage}`, src);
    return;
  }

  const { bookUrl, localIdArg, startChapterArg, metaFromList } = resolveInput();
  const startChapter = startChapterArg ? Number(startChapterArg) : 0;
  const parsed = parseLibahaoBookUrl(bookUrl);
  if (!parsed) throw new Error(`无法解析书籍 URL: ${bookUrl}`);

  const { siteBookId, imageId, bookPath } = parsed;
  const indexUrl = `${BASE}/book/${bookPath}/`;
  console.log(`抓取 libahao 书籍 ${bookPath}…`);

  const indexCache = path.join(root, 'books/_work/libahao', `index-${bookPath}.html`);
  let indexHtml;
  if (fs.existsSync(indexCache)) {
    indexHtml = fs.readFileSync(indexCache, 'utf8');
    console.log(`使用目录缓存: ${indexCache}`);
  } else {
    indexHtml = await fetchHtmlWithRetry(indexUrl);
    fs.mkdirSync(path.dirname(indexCache), { recursive: true });
    fs.writeFileSync(indexCache, indexHtml, 'utf8');
  }

  let chapters = parseCatalog(indexHtml, bookPath);
  if (chapters.length === 0) {
    console.warn('目录缓存无效或为空，重新抓取目录…');
    indexHtml = await fetchHtmlWithRetry(indexUrl);
    fs.mkdirSync(path.dirname(indexCache), { recursive: true });
    fs.writeFileSync(indexCache, indexHtml, 'utf8');
    chapters = parseCatalog(indexHtml, bookPath);
  }

  if (chapters.length === 0) throw new Error('目录为空');

  const meta = parseBookMeta(indexHtml);
  if (!meta.title || !meta.author) throw new Error('无法解析书名/作者');

  console.log(`《${meta.title}》 作者：${meta.author}，共 ${chapters.length} 章`);
  const localId = pickLocalId(siteBookId, imageId, localIdArg);

  if (coverOnly) {
    if (!meta.coverUrl) throw new Error('未在 .book-info 中找到封面 img');
    const coverDir = path.join(root, 'csdn/src/assets/images/books');
    fs.mkdirSync(coverDir, { recursive: true });
    const coverPath = path.join(coverDir, `book-${localId}.jpg`);
    const coverSrc = meta.coverUrl.startsWith('http') ? meta.coverUrl : `${BASE}${meta.coverUrl}`;
    execSync(`curl.exe -sL -o "${coverPath}" "${coverSrc}"`, { stdio: 'pipe' });
    console.log(`封面 -> ${coverPath}`);
    console.log(`localId=${localId}`);
    return;
  }

  const maxChapter = chapters.length;
  const filename = buildBookFilename(localId, meta.title, maxChapter);
  const existingPath = findExistingBookFile(localId);
  let outPath = existingPath || getBookPath(root, filename);

  const progress = loadProgress(bookPath);
  let startIndex = 0;
  if (startChapter > 1) {
    if (!existingPath) throw new Error(`续传需要已有 localId=${localId} 的 TXT`);
    startIndex = startChapter - 1;
    if (startIndex < 0 || startIndex >= chapters.length) {
      throw new Error(`起始章节无效: ${startChapter}`);
    }
    console.log(`续传 ${outPath}，从第 ${startChapter} 章起…`);
  } else if (progress.completedChapterNums.length > 0) {
    startIndex = progress.completedChapterNums.length;
    console.log(`续传 ${outPath}，已完成 ${startIndex} 章，从第 ${startIndex + 1} 章起…`);
  } else if (existingPath && countDownloadedChapters(existingPath) > 0) {
    startIndex = countDownloadedChapters(existingPath);
    console.log(`续传 ${outPath}，已完成 ${startIndex} 章，从第 ${startIndex + 1} 章起…`);
  } else {
    const header = buildBookHeader(meta.title, meta.author);
    fs.writeFileSync(outPath, header, 'utf8');
  }

  const excerptPath = path.join(root, 'csdn/src/data/books', `book-${localId}-excerpt.txt`);
  fs.mkdirSync(path.dirname(excerptPath), { recursive: true });
  const excerptText = metaFromList?.intro || meta.excerpt || '';
  if (excerptText) fs.writeFileSync(excerptPath, excerptText, 'utf8');

  if (meta.coverUrl) {
    const coverDir = path.join(root, 'csdn/src/assets/images/books');
    fs.mkdirSync(coverDir, { recursive: true });
    const coverPath = path.join(coverDir, `book-${localId}.jpg`);
    const coverSrc = meta.coverUrl.startsWith('http') ? meta.coverUrl : `${BASE}${meta.coverUrl}`;
    try {
      execSync(`curl.exe -sL -o "${coverPath}" "${coverSrc}"`, { stdio: 'pipe' });
      console.log(`封面 -> ${coverPath}`);
    } catch {
      console.warn('封面下载失败，跳过');
    }
  }

  const todo = chapters.slice(startIndex);
  let failed = 0;
  for (let i = 0; i < todo.length; i++) {
    const ch = todo[i];
    const chapterNo = startIndex + i + 1;
    process.stdout.write(`[${chapterNo}/${maxChapter}] ${ch.name} … `);
    try {
      const { text: body, partial } = await fetchChapterText(bookPath, ch.href);
      if (partial) {
        progress.partialChapterNums = [...new Set([...progress.partialChapterNums, ch.chapterNum])];
        saveProgress(bookPath, progress);
        console.log('partial (缺续页，请浏览器另存 HTML 后 --import-html 导入)');
        console.warn(`章节 ${ch.name} 不完整。续页路径示例: ${ch.href.replace(/\.html$/, '_1.html')}`);
        console.warn(`已保存 ${progress.completedChapterNums.length} 完整章，稍后重跑同一命令续传`);
        process.exit(1);
      }
      fs.appendFileSync(outPath, `  ${ch.name}\n\n${body}\n\n`, 'utf8');
      progress.completedChapterNums.push(ch.chapterNum);
      progress.partialChapterNums = progress.partialChapterNums.filter((n) => n !== ch.chapterNum);
      saveProgress(bookPath, progress);
      console.log('ok');
    } catch (err) {
      failed += 1;
      console.log(`fail: ${err.message}`);
      console.warn(`已保存 ${progress.completedChapterNums.length} 章，稍后重跑同一命令续传`);
      if (/ECONNRESET|超时|被站点拦截|HTTP 403/i.test(err.message)) {
        console.warn('站点可能限流。请稍后再试，或浏览器打开章节页另存 HTML，再用 --import-html 导入。');
      }
      process.exit(1);
    }
    await sleep(DELAY_MS);
  }

  if (failed) {
    console.warn(`部分章节失败，已下载 ${progress.completedChapterNums.length} 章`);
  } else {
    finalizeBookFile(outPath);
    console.log(`完成: ${outPath}`);
    if (fs.existsSync(progressPath(bookPath))) fs.unlinkSync(progressPath(bookPath));
  }
  console.log(`localId=${localId} imageId=${imageId}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
