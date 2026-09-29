/**
 * 下载小原文学网分类列表页书籍（如 /wuxia/1.html）
 * 用法:
 *   node csdn/scripts/batch-download-minyuan-category.js <分类路径> [起始页] [结束页]
 *   node csdn/scripts/batch-download-minyuan-category.js /wuxia/ 1 3
 *   node csdn/scripts/batch-download-minyuan-category.js https://www.min-yuan.com/wuxia/1.html
 * 选项: --list-only  --v1
 */
const path = require('path');
const { execSync } = require('child_process');
const { discoverBooks, minyuanLocalId } = require('./book-paths');

const root = path.resolve(__dirname, '../..');
const BASE = 'https://www.min-yuan.com';

function resolveDownloadScript() {
  if (process.argv.includes('--v1')) {
    return path.join(__dirname, 'download-minyuan-book.js');
  }
  return path.join(__dirname, 'download-minyuan-book-v2.js');
}

function curl(url) {
  return execSync(`curl.exe -sL -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0" "${url}"`, {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
}

function parseCategoryInput(args) {
  const positional = args.filter((a) => !a.startsWith('-') && a !== '--v1');
  if (!positional.length) {
    throw new Error('用法: batch-download-minyuan-category.js <分类路径或URL> [起始页] [结束页]');
  }

  const raw = positional[0];
  const pageUrl = raw.startsWith('http') ? raw : null;
  const catMatch = pageUrl
    ? pageUrl.match(/\/([a-z]+)\/(\d+)\.html/i)
    : raw.match(/^\/?([a-z]+)\/?(?:([\d]+)\.html)?$/i);
  if (!catMatch) throw new Error(`无法解析分类: ${raw}`);

  const category = catMatch[1].toLowerCase();
  const startPage = Number(positional[1] || catMatch[2] || 1);
  const endPage = Number(positional[2] || startPage);
  return { category, startPage, endPage };
}

function categoryPageUrl(category, page) {
  return `${BASE}/${category}/${page}.html`;
}

function parseMaxPage(html, category) {
  const nums = [...html.matchAll(new RegExp(`/${category}/(\\d+)\\.html`, 'gi'))].map((m) => Number(m[1]));
  return nums.length ? Math.max(...nums) : 1;
}

function parseBooks(html) {
  const bySlug = new Map();
  const re = /href="\/txt\/([a-z0-9]+)\/"[^>]*title="([^"]+)"/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const slug = m[1].toLowerCase();
    const title = m[2].trim();
    if (!bySlug.has(slug)) bySlug.set(slug, title);
  }
  if (bySlug.size > 0) return bySlug;

  for (const m2 of html.matchAll(/href="\/txt\/([a-z0-9]+)\/"[^>]*>([^<]+)<\/a>/gi)) {
    const slug = m2[1].toLowerCase();
    const title = m2[2].trim();
    if (!title || title.length > 80) continue;
    if (!bySlug.has(slug)) bySlug.set(slug, title);
  }
  return bySlug;
}

function collectBooks(category, startPage, endPage) {
  const all = new Map();
  let maxPage = endPage;
  for (let page = startPage; page <= endPage; page += 1) {
    const url = categoryPageUrl(category, page);
    console.log(`拉取 ${url}…`);
    const html = curl(url);
    if (page === startPage) {
      const detected = parseMaxPage(html, category);
      if (endPage === startPage && detected > 1) {
        console.log(`  检测到共 ${detected} 页（仅下载第 ${startPage} 页，可指定结束页下载更多）`);
      }
      maxPage = Math.max(maxPage, detected);
    }
    const books = parseBooks(html);
    console.log(`  第 ${page} 页: ${books.size} 本`);
    for (const [slug, title] of books) {
      if (!all.has(slug)) all.set(slug, title);
    }
  }
  return all;
}

function main() {
  const listOnly = process.argv.includes('--list-only');
  const downloadScript = resolveDownloadScript();
  const { category, startPage, endPage } = parseCategoryInput(process.argv.slice(2));

  console.log(`分类: ${category}，页码 ${startPage}-${endPage}`);
  const all = collectBooks(category, startPage, endPage);
  if (all.size === 0) throw new Error('未解析到任何书目');

  const existingIds = new Set(discoverBooks(path.join(root, 'books')).map((b) => String(b.id)));
  const slugs = [...all.keys()];
  const pending = slugs.filter((slug) => !existingIds.has(minyuanLocalId(slug)));
  const skipped = slugs.filter((slug) => existingIds.has(minyuanLocalId(slug)));

  console.log(`\n合计去重 ${slugs.length} 本，已存在 ${skipped.length} 本，待下载 ${pending.length} 本`);
  if (skipped.length) console.log(`跳过: ${skipped.map((s) => minyuanLocalId(s)).join(', ')}`);
  if (pending.length === 0) {
    console.log('无需下载');
    return;
  }
  console.log(`待下载:\n${pending.map((s) => `  ${minyuanLocalId(s)} ${all.get(s)}`).join('\n')}\n`);
  if (listOnly) return;

  const results = { success: [], failed: [] };
  for (const slug of pending) {
    const localId = minyuanLocalId(slug);
    console.log(`\n========== [${localId}] ${all.get(slug)} ==========`);
    try {
      execSync(`node "${downloadScript}" "${BASE}/txt/${slug}/"`, {
        cwd: root,
        stdio: 'inherit',
        encoding: 'utf8',
      });
      results.success.push(slug);
    } catch (err) {
      console.error(`[${localId}] 失败:`, err.message || err);
      results.failed.push({ slug, error: String(err.message || err) });
    }
  }

  console.log('\n========== 分类批量下载完成 ==========');
  console.log(`成功: ${results.success.length}`, results.success.map((s) => minyuanLocalId(s)).join(', ') || '-');
  console.log(`失败: ${results.failed.length}`, results.failed.map((f) => minyuanLocalId(f.slug)).join(', ') || '-');

  if (results.success.length > 0) {
    console.log('\n运行清理与同步…');
    execSync('node csdn/scripts/clean-book-txt.js', { cwd: root, stdio: 'inherit' });
    execSync('node csdn/scripts/sync-all-books-data.js', { cwd: root, stdio: 'inherit' });
    execSync('node csdn/scripts/sync-miniprogram-books-data.js', { cwd: root, stdio: 'inherit' });
  }
}

main();
