/**
 * 抓取篱笆好文学书单
 *
 * 用法:
 *   node csdn/scripts/fetch-libahao-books.js
 *   node csdn/scripts/fetch-libahao-books.js --url https://libahao2.com/book
 *   node csdn/scripts/fetch-libahao-books.js --html books/_work/libahao/book.html
 *   node csdn/scripts/fetch-libahao-books.js --cookie "你的Cookie"
 *   node csdn/scripts/fetch-libahao-books.js --category xuanhuan --pages 3
 *   node csdn/scripts/fetch-libahao-books.js --all-categories --pages 20 --delay 3000
 *   默认续传合并旧数据；全量重抓请加 --fresh
 *   node csdn/scripts/fetch-libahao-books.js --help
 *
 * 获取 Cookie（推荐）:
 *   1. 浏览器先打开空白页 about:blank
 *   2. 按 F12 打开开发者工具，切到 Network
 *   3. 地址栏输入 https://libahao2.com/xuanhuan/ 并访问
 *   4. 在 Network 里点该请求 -> Request Headers -> 复制 Cookie 整段
 *   5. 粘贴到 books/_work/libahao/cookie.txt，或 --cookie "..."
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const ROOT = path.resolve(__dirname, '../..');
const OUT_DIR = path.join(ROOT, 'books/_work/libahao');
const DEFAULT_OUT = path.join(OUT_DIR, 'book-list.json');
const COOKIE_FILE = path.join(OUT_DIR, 'cookie.txt');

const MOBILE_UA = 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36';
const DESKTOP_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function printCookieHelp() {
  console.log(`
获取 Cookie 步骤:
  1. 浏览器先打开空白页 (about:blank)
  2. 按 F12，切换到 Network（网络）面板
  3. 地址栏输入并访问: https://libahao2.com/xuanhuan/
  4. 在 Network 列表点击 xuanhuan 请求
  5. 找到 Request Headers 里的 Cookie，复制整段
  6. 写入 books/_work/libahao/cookie.txt
     或执行: node csdn/scripts/fetch-libahao-books.js --cookie "粘贴Cookie"

然后抓取:
  node csdn/scripts/fetch-libahao-books.js --all-categories --pages 20 --delay 3000
`);
}

const CATEGORIES = [
  { name: '玄幻魔法', slug: 'xuanhuan' },
  { name: '武侠修真', slug: 'xiuzhen' },
  { name: '都市言情', slug: 'dushi' },
  { name: '历史军事', slug: 'lishi' },
  { name: '游戏竞技', slug: 'wangyou' },
  { name: '科幻灵异', slug: 'kehuan' },
  { name: '女生言情', slug: 'nvpin' },
  { name: '其他小说', slug: 'qita' },
];

function parseArgs(argv) {
  const args = {
    url: 'https://libahao2.com/book',
    html: '',
    cookie: process.env.LIBAHAO_COOKIE || '',
    category: '',
    pages: 1,
    out: DEFAULT_OUT,
    mobile: false,
    allCategories: false,
    dumpHtml: '',
    delay: 0,
    resume: true,
    fresh: false,
    retries: 3,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const val = argv[i + 1];
    if (key === '--url' && val) {
      args.url = val;
      i += 1;
    } else if (key === '--html' && val) {
      args.html = path.resolve(ROOT, val);
      i += 1;
    } else if (key === '--cookie' && val) {
      args.cookie = val;
      i += 1;
    } else if (key === '--category' && val) {
      args.category = val;
      i += 1;
    } else if (key === '--pages' && val) {
      args.pages = Math.max(1, Number(val) || 1);
      i += 1;
    } else if (key === '--out' && val) {
      args.out = path.resolve(ROOT, val);
      i += 1;
    } else if (key === '--mobile') {
      args.mobile = true;
    } else if (key === '--all-categories') {
      args.allCategories = true;
      args.mobile = true;
    } else if (key === '--dump-html' && val) {
      args.dumpHtml = path.resolve(ROOT, val);
      i += 1;
    } else if (key === '--delay' && val) {
      args.delay = Math.max(0, Number(val) || 0);
      i += 1;
    } else if (key === '--resume') {
      args.resume = true;
    } else if (key === '--fresh') {
      args.fresh = true;
    } else if (key === '--retries' && val) {
      args.retries = Math.max(1, Number(val) || 1);
      i += 1;
    } else if (key === '--help' || key === '-h') {
      printCookieHelp();
      process.exit(0);
    }
  }

  if (args.allCategories && !args.delay) {
    args.delay = 2500;
  }

  if (!args.cookie && fs.existsSync(COOKIE_FILE)) {
    args.cookie = fs.readFileSync(COOKIE_FILE, 'utf8').trim();
  }

  return args;
}

function decodeHtml(text) {
  return String(text || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripTags(text) {
  return decodeHtml(String(text || '').replace(/<[^>]+>/g, ' '));
}

function absUrl(href, baseUrl) {
  if (!href) return '';
  if (/^https?:\/\//i.test(href)) return href;
  const base = new URL(baseUrl);
  return new URL(href, base).href;
}

function parseMobileItems(html, baseUrl) {
  const books = [];
  const re = /<a[^>]*class="[^"]*book-item[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    const url = absUrl(match[1], baseUrl);
    const block = match[2];
    const title = stripTags((block.match(/class="[^"]*book-title[^"]*"[^>]*>([\s\S]*?)<\//i) || [])[1]);
    const author = stripTags((block.match(/class="[^"]*book-author[^"]*"[^>]*>([\s\S]*?)<\//i) || [])[1]);
    const intro = stripTags((block.match(/class="[^"]*book-description[^"]*"[^>]*>([\s\S]*?)<\//i) || [])[1]);
    const cover = absUrl((block.match(/class="[^"]*book-cover[^"]*"[^>]*src="([^"]+)"/i) || [])[1], baseUrl);
    if (!title || !url) continue;
    books.push({ title, author, intro, cover, url, source: 'mobile' });
  }
  return books;
}

function parseDesktopTable(html, baseUrl) {
  const books = [];
  const tableMatch = html.match(/<table[^>]*class="[^"]*latest-updates[^"]*"[\s\S]*?<\/table>/i);
  if (!tableMatch) return books;

  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let row;
  while ((row = rowRe.exec(tableMatch[0])) !== null) {
    const cells = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((m) => m[1]);
    if (cells.length < 4) continue;
    const titleLink = cells[1].match(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
    const chapterLink = cells[2].match(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
    if (!titleLink) continue;
    books.push({
      title: stripTags(titleLink[2]),
      url: absUrl(titleLink[1], baseUrl),
      lastChapter: chapterLink ? stripTags(chapterLink[2]) : stripTags(cells[2]),
      author: stripTags(cells[3]),
      category: stripTags(cells[0]),
      source: 'desktop-table',
    });
  }
  return books;
}

function splitTitleAuthorIntro(text) {
  const raw = decodeHtml(text);
  if (!raw) return { title: '', author: '', intro: '' };

  const parts = raw.split(/\s{2,}/).map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return {
      title: parts[0],
      author: parts[1],
      intro: parts.slice(2).join(' '),
    };
  }

  const m = raw.match(/^(.{2,40}?)\s+([^\s]{2,12})\s+(.+)$/);
  if (m) {
    return { title: m[1].trim(), author: m[2].trim(), intro: m[3].trim() };
  }

  return { title: raw.slice(0, 60), author: '', intro: raw };
}

function parseGenericBookLinks(html, baseUrl) {
  const books = [];
  const seen = new Set();
  const re = /<a[^>]*href="(\/book\/[^"#?]+|https?:\/\/[^"]*\/book\/[^"#?]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    const url = absUrl(match[1], baseUrl);
    const parsed = splitTitleAuthorIntro(stripTags(match[2]));
    if (!parsed.title || parsed.title.length < 2 || seen.has(url)) continue;
    seen.add(url);
    books.push({
      title: parsed.title,
      author: parsed.author,
      intro: parsed.intro,
      url,
      source: 'generic-link',
    });
  }
  return books;
}

function parseBookList(html, baseUrl) {
  const mobile = parseMobileItems(html, baseUrl);
  if (mobile.length) return mobile;
  const desktop = parseDesktopTable(html, baseUrl);
  if (desktop.length) return desktop;
  return parseGenericBookLinks(html, baseUrl);
}

function fetchHtml(url, cookie, mobile) {
  const headers = {
    'User-Agent': mobile ? MOBILE_UA : DESKTOP_UA,
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    Referer: mobile ? 'https://m.libahao2.com/' : 'https://libahao2.com/',
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
      const req = lib.request(
        parsed,
        { method: 'GET', headers },
        (res) => {
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
              reject(new Error(`被站点拦截(403/区域限制): ${targetUrl}`));
              return;
            }
            resolve(text);
          });
        },
      );
      req.on('error', reject);
      req.end();
    };
    get(url);
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadExistingResult(outPath) {
  if (!fs.existsSync(outPath)) {
    return { books: [], fetchedPages: [] };
  }
  try {
    const data = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    return {
      books: Array.isArray(data.books) ? data.books : [],
      fetchedPages: Array.isArray(data.fetchedPages) ? data.fetchedPages : [],
    };
  } catch {
    return { books: [], fetchedPages: [] };
  }
}

function saveResult(outPath, books, fetchedPages) {
  const uniqueBooks = dedupeBooks(books);
  const result = {
    fetchedAt: new Date().toISOString(),
    total: uniqueBooks.length,
    fetchedPages,
    books: uniqueBooks,
  };
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
  return result;
}

async function fetchHtmlWithRetry(url, cookie, mobile, retries) {
  let lastErr;
  for (let i = 0; i < retries; i += 1) {
    try {
      return await fetchHtml(url, cookie, mobile);
    } catch (err) {
      lastErr = err;
      const waitMs = 3000 * (i + 1);
      console.warn(`  重试 ${i + 1}/${retries} (${waitMs}ms): ${err.message}`);
      await sleep(waitMs);
    }
  }
  throw lastErr;
}

function dedupeBooks(books) {
  const map = new Map();
  for (const book of books) {
    const key = book.url || `${book.title}::${book.author || ''}`;
    if (!map.has(key)) map.set(key, book);
  }
  return [...map.values()];
}

function buildTargets(args) {
  if (args.html) {
    return [{ url: args.url, file: args.html }];
  }

  if (args.allCategories) {
    const targets = [];
    for (const cat of CATEGORIES) {
      // 移动端分类页每页仅 6 本，且 /{slug}/{page}/ 翻页常返回相同内容，默认只抓第 1 页
      const maxPage = args.pages > 1 ? args.pages : 1;
      for (let page = 1; page <= maxPage; page += 1) {
        targets.push({
          url: `https://m.libahao2.com/${cat.slug}/${page}/`,
          category: cat.name,
        });
      }
    }
    return targets;
  }

  if (args.category) {
    const cat = CATEGORIES.find((c) => c.slug === args.category);
    if (!cat) {
      throw new Error(`未知分类: ${args.category}，可选: ${CATEGORIES.map((c) => c.slug).join(', ')}`);
    }
    const targets = [];
    for (let page = 1; page <= args.pages; page += 1) {
      targets.push({
        url: `https://m.libahao2.com/${cat.slug}/${page}/`,
        category: cat.name,
      });
    }
    return targets;
  }

  return [{ url: args.url, mobile: args.mobile }];
}

async function main() {
  const args = parseArgs(process.argv);
  fs.mkdirSync(path.dirname(args.out), { recursive: true });

  if (!args.html && !args.cookie) {
    console.warn('未找到 Cookie，请先按 --help 说明获取并写入 cookie.txt\n');
  }

  const shouldMerge = args.resume && !args.fresh;
  const existing = shouldMerge ? loadExistingResult(args.out) : { books: [], fetchedPages: [] };
  const fetchedSet = new Set(existing.fetchedPages);
  const allBooks = [...existing.books];
  const targets = buildTargets(args).filter((target) => !fetchedSet.has(target.url));

  if (args.fresh) {
    console.log('全新抓取: 忽略旧数据');
  } else if (fetchedSet.size) {
    console.log(`续传: 已有 ${existing.books.length} 本，跳过 ${fetchedSet.size} 个页面，剩余 ${targets.length} 个`);
  }

  let failed = 0;
  for (const target of targets) {
    if (args.delay) await sleep(args.delay);

    try {
      let html;
      const baseUrl = target.url;
      if (target.file) {
        html = fs.readFileSync(target.file, 'utf8');
        console.log(`解析本地 HTML: ${target.file}`);
      } else {
        console.log(`抓取: ${target.url}`);
        const useMobile = target.mobile ?? args.mobile ?? /m\.libahao2\.com/i.test(target.url);
        html = await fetchHtmlWithRetry(target.url, args.cookie, useMobile, args.retries);
        if (args.dumpHtml) {
          fs.writeFileSync(args.dumpHtml, html, 'utf8');
          console.log(`  HTML 已保存: ${args.dumpHtml}`);
        }
      }

      const books = parseBookList(html, baseUrl).map((book) => ({
        ...book,
        category: book.category || target.category || '',
        pageUrl: target.url,
      }));
      console.log(`  -> ${books.length} 本`);
      allBooks.push(...books);
      fetchedSet.add(target.url);
      const result = saveResult(args.out, allBooks, [...fetchedSet]);
      console.log(`  累计 ${result.total} 本`);
    } catch (err) {
      failed += 1;
      console.warn(`  跳过: ${err.message}`);
    }
  }

  const result = saveResult(args.out, allBooks, [...fetchedSet]);
  if (failed) {
    console.warn(`完成，共 ${result.total} 本书，${failed} 个页面失败，稍后重跑同一命令续传`);
  } else {
    console.log(`完成，共 ${result.total} 本书 -> ${args.out}`);
  }
}

main().catch((err) => {
  console.error(`抓取失败: ${err.message}`);
  console.error('');
  printCookieHelp();
  console.error('备选: 浏览器另存为 HTML 后解析:');
  console.error('  node csdn/scripts/fetch-libahao-books.js --html books/_work/libahao/book.html');
  process.exit(1);
});
