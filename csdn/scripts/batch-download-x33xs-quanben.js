/**
 * 批量下载 33小说网全本列表 http://www.x33xs6.com/quanben/
 * 用法:
 *   node csdn/scripts/batch-download-x33xs-quanben.js [--list-only] [--limit N]
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { discoverBooks, x33xsLocalId } = require('./book-paths');

const root = path.resolve(__dirname, '../..');
const BASE = 'http://www.x33xs6.com';
const downloadScript = path.join(__dirname, 'download-x33xs-book.js');

function curl(url) {
  return execSync(`curl.exe -sL -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0" "${url}"`, {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
}

function parseQuanbenBooks(html) {
  const books = [];
  const seen = new Set();
  const re = /<span class="s2"><a href="(\/33xs\/(\d+)\/(\d+)\/)"[^>]*>([^<]+)<\/a><\/span>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const bookPath = m[1];
    const shard = m[2];
    const bookId = m[3];
    const title = m[4].trim();
    const localId = x33xsLocalId(bookId);
    if (seen.has(localId)) continue;
    seen.add(localId);
    books.push({ shard, bookId, bookPath, title, localId, url: `${BASE}${bookPath}` });
  }
  return books;
}

function fetchAllQuanbenBooks() {
  console.log('拉取全本列表…');
  const html = curl(`${BASE}/quanben/`);
  if (/Just a moment/.test(html)) {
    throw new Error('全本页被 Cloudflare 拦截，请稍后重试');
  }
  const books = parseQuanbenBooks(html);
  if (books.length === 0) throw new Error('未解析到任何书目');
  return books;
}

function main() {
  const listOnly = process.argv.includes('--list-only');
  const limitArg = process.argv.find((a) => a.startsWith('--limit='))
    || (process.argv.includes('--limit') ? `--limit=${process.argv[process.argv.indexOf('--limit') + 1]}` : null);
  const limit = limitArg ? Number(String(limitArg).split('=').pop()) : 0;

  const all = fetchAllQuanbenBooks();
  console.log(`全本列表: ${all.length} 本`);

  const existingIds = new Set(discoverBooks(path.join(root, 'books')).map((b) => String(b.id)));
  const pending = all;
  const partial = all.filter((b) => existingIds.has(b.localId));

  console.log(`全本 ${all.length} 本，本地已有 ${partial.length} 本（将自动续传），待处理 ${pending.length} 本`);
  if (partial.length) {
    console.log(`续传: ${partial.map((b) => b.localId).join(', ')}`);
  }

  const todo = limit > 0 ? pending.slice(0, limit) : pending;
  if (todo.length === 0) {
    console.log('无需下载');
    return;
  }

  console.log(`待下载: ${todo.map((b) => `${b.localId} ${b.title}`).join('\n  ')}\n`);
  if (listOnly) return;

  const results = { success: [], failed: [] };
  for (const book of todo) {
    console.log(`\n========== [${book.localId}] ${book.title} ==========`);
    try {
      execSync(`node "${downloadScript}" "${book.url}" ${book.localId}`, {
        cwd: root,
        stdio: 'inherit',
        encoding: 'utf8',
      });
      results.success.push(book);
    } catch (err) {
      console.error(`[${book.localId}] 失败:`, err.message || err);
      results.failed.push({ book, error: String(err.message || err) });
    }
  }

  console.log('\n========== 全本批量下载完成 ==========');
  console.log(`成功: ${results.success.length}`, results.success.map((b) => b.localId).join(', ') || '-');
  console.log(`失败: ${results.failed.length}`, results.failed.map((f) => f.book.localId).join(', ') || '-');

  if (results.success.length > 0) {
    console.log('\n运行清理与同步…');
    execSync('node csdn/scripts/clean-book-txt.js', { cwd: root, stdio: 'inherit' });
    execSync('node csdn/scripts/sync-all-books-data.js', { cwd: root, stdio: 'inherit' });
    execSync('node csdn/scripts/sync-miniprogram-books-data.js', { cwd: root, stdio: 'inherit' });
  }
}

main();
