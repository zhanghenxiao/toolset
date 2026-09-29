/**
 * 下载小原文学网首页「人气小说榜」全部书籍
 * 用法: node csdn/scripts/batch-download-minyuan-popular.js
 */
const fs = require('fs');
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

function parsePopularSlugs(html) {
  const block = html.match(/<h2>人气小说榜<\/h2>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i)?.[1];
  if (!block) return [];
  const slugs = [];
  const seen = new Set();
  for (const m of block.matchAll(/href="\/txt\/([a-z0-9]+)\/"/gi)) {
    const slug = m[1].toLowerCase();
    if (seen.has(slug)) continue;
    seen.add(slug);
    slugs.push(slug);
  }
  return slugs;
}

function main() {
  const downloadScript = resolveDownloadScript();
  console.log('拉取首页人气小说榜…');
  const html = curl(`${BASE}/`);
  const slugs = parsePopularSlugs(html);
  if (slugs.length === 0) {
    throw new Error('未解析到人气小说榜书目');
  }

  const existingIds = new Set(discoverBooks(path.join(root, 'books')).map((b) => String(b.id)));
  console.log(`人气榜共 ${slugs.length} 本: ${slugs.join(', ')}`);
  const results = { skipped: [], success: [], failed: [] };

  for (const slug of slugs) {
    const localId = minyuanLocalId(slug);
    if (existingIds.has(String(localId))) {
      console.log(`\n[${localId}] 跳过（已存在）`);
      results.skipped.push(slug);
      continue;
    }

    console.log(`\n========== [${localId}] /txt/${slug}/ ==========`);
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

  console.log('\n========== 人气榜批量下载完成 ==========');
  console.log(`成功: ${results.success.length}`, results.success.join(', ') || '-');
  console.log(`跳过: ${results.skipped.length}`, results.skipped.join(', ') || '-');
  console.log(`失败: ${results.failed.length}`, results.failed.map((f) => f.slug).join(', ') || '-');

  if (results.success.length > 0) {
    console.log('\n运行清理与同步…');
    execSync('node csdn/scripts/clean-book-txt.js', { cwd: root, stdio: 'inherit' });
    execSync('node csdn/scripts/sync-all-books-data.js', { cwd: root, stdio: 'inherit' });
  }
}

main();
