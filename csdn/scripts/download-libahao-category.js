/**
 * 按篱笆好文学分类页批量下载书籍（latest-updates 区块）
 *
 * 自动跳过 booksData.js 中已存在同名书籍、以及 books/ 中已下载的 localId。
 * 逐本调用 csdn/scripts/download-libahao-book.js。
 *
 * 用法:
 *   node csdn/scripts/download-libahao-category.js https://www.libahao2.com/xiuzhen/
 *   node csdn/scripts/download-libahao-category.js <url> --dry-run          # 只列出计划
 *   node csdn/scripts/download-libahao-category.js <url> --limit 5 --delay 1500
 *   node csdn/scripts/download-libahao-category.js <url> --ids l_6267658__652554
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '../..');
const booksDataPath = path.join(root, 'csdn/src/data/booksData.js');
const booksDir = path.join(root, 'books');
const DOWNLOADER = path.join(__dirname, 'download-libahao-book.js');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function parseArgs(argv) {
  const opts = { url: '', dryRun: false, limit: 0, delay: 3000, ids: null, force: false, retry: 0, onlyFailed: false };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--force') opts.force = true;
    else if (a === '--limit') opts.limit = Number(argv[++i]);
    else if (a === '--delay') opts.delay = Number(argv[++i]);
    else if (a === '--retry') opts.retry = Number(argv[++i]);
    else if (a === '--ids') opts.ids = String(argv[++i]).split(',').map((s) => s.trim()).filter(Boolean);
    else positional.push(a);
  }
  opts.url = positional[0] || 'https://www.libahao2.com/xiuzhen/';
  return opts;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const get = (target, redirects = 0) => {
      if (redirects > 5) return reject(new Error('重定向过多'));
      const parsed = new URL(target);
      const lib = parsed.protocol === 'http:' ? http : https;
      const req = lib.request(parsed, { method: 'GET', headers: { 'User-Agent': UA, 'Accept-Language': 'zh-CN,zh;q=0.9' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          get(new URL(res.headers.location, parsed).href, redirects + 1);
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          if (res.statusCode >= 400) reject(new Error(`HTTP ${res.statusCode}`));
          else resolve(text);
        });
      });
      req.on('error', reject);
      req.setTimeout(30000, () => req.destroy(new Error('请求超时')));
      req.end();
    };
    get(url);
  });
}

async function fetchPageWithRetry(url, retries = 4) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchPage(url);
    } catch (err) {
      lastErr = err;
      console.warn(`  分类页抓取失败(${err.message})，${Math.round(5000 * (i + 1) / 1000)}s 后重试 ${i + 1}/${retries}`);
      await sleep(5000 * (i + 1));
    }
  }
  throw lastErr;
}

function parseLatestUpdates(html) {
  const start = html.indexOf('class="latest-updates"');
  if (start < 0) throw new Error('页面中未找到 class="latest-updates"');
  const end = html.indexOf('</table>', start);
  const block = html.slice(start, end < 0 ? undefined : end);
  const rows = block.match(/<tr>[\s\S]*?<\/tr>/g) || [];
  const books = [];
  const seen = new Set();
  for (const row of rows) {
    const link = row.match(/<td><a href="\/book\/(\d+)_(\d+)\/">([^<]+)<\/a><\/td>/);
    if (!link) continue;
    const localId = `l_${link[1]}__${link[2]}`;
    if (seen.has(localId)) continue;
    seen.add(localId);
    const plain = row.match(/<td>([^<]*)<\/td>/g) || [];
    const author = (plain[0] || '').replace(/<\/?td>/g, '').trim();
    books.push({
      localId,
      siteBookId: link[1],
      imageId: link[2],
      title: link[3].trim(),
      author,
      url: `https://m.libahao2.com/book/${link[1]}_${link[2]}/`,
    });
  }
  return books;
}

function normalizeTitle(t) {
  return String(t || '')
    .replace(/[\s\u3000]/g, '')
    .replace(/[：:！!？?，,。.、·…—\-—_"'"'（）()《》【】\[\]]/g, '')
    .toLowerCase();
}

function loadExistingTitles() {
  if (!fs.existsSync(booksDataPath)) return new Set();
  const text = fs.readFileSync(booksDataPath, 'utf8');
  const set = new Set();
  const re = /title:\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    set.add(normalizeTitle(m[1]));
  }
  return set;
}

function alreadyDownloaded(localId) {
  if (!fs.existsSync(booksDir)) return false;
  return fs.readdirSync(booksDir).some((name) => name.startsWith(`${localId}_`) && name.endsWith('.txt'));
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  console.log(`分类页: ${opts.url}`);
  const html = await fetchPageWithRetry(opts.url);
  let books = parseLatestUpdates(html);
  console.log(`latest-updates 共 ${books.length} 本`);

  if (opts.ids) {
    const wanted = new Set(opts.ids);
    books = books.filter((b) => wanted.has(b.localId));
  }
  if (opts.limit > 0) books = books.slice(0, opts.limit);

  const existing = loadExistingTitles();
  const plan = [];
  const skipped = [];
  for (const b of books) {
    if (!opts.force) {
      if (existing.has(normalizeTitle(b.title))) {
        skipped.push({ ...b, reason: 'booksData.js 已存在同名' });
        continue;
      }
      if (alreadyDownloaded(b.localId)) {
        skipped.push({ ...b, reason: `books/ 已存在 ${b.localId}` });
        continue;
      }
    }
    plan.push(b);
  }

  console.log(`待下载 ${plan.length} 本，跳过 ${skipped.length} 本`);
  for (const s of skipped) console.log(`  - 跳过 ${s.title}（${s.reason}）`);
  for (const p of plan) console.log(`  ▶ ${p.title} | ${p.author} | ${p.localId}`);

  if (opts.dryRun) {
    console.log('--dry-run，未执行下载');
    return;
  }

  let ok = 0;
  const failed = [];
  const maxAttempts = Math.max(1, opts.retry + 1);
  for (let i = 0; i < plan.length; i++) {
    const b = plan[i];
    console.log(`\n[${i + 1}/${plan.length}] 《${b.title}》 ${b.localId}`);
    let succeeded = false;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      if (attempt > 1) {
        const waitSec = Math.round((20000 * attempt) / 1000);
        console.log(`  第 ${attempt}/${maxAttempts} 次尝试（等待 ${waitSec}s 规避限流）…`);
        await sleep(20000 * attempt);
      }
      const res = spawnSync(process.execPath, [DOWNLOADER, b.url, b.localId, '', '--delay', String(opts.delay)], {
        stdio: 'inherit',
        cwd: root,
      });
      if (res.status === 0) {
        succeeded = true;
        break;
      }
      console.warn(`  ✗ 第 ${attempt} 次失败（exit ${res.status}）`);
    }
    if (succeeded) {
      ok += 1;
    } else {
      failed.push(b);
      console.warn(`  ✗ 放弃《${b.title}》，继续下一本`);
    }
  }

  console.log(`\n完成：成功 ${ok} 本，失败 ${failed.length} 本`);
  for (const f of failed) console.log(`  ✗ ${f.title} ${f.localId} ${f.url}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
