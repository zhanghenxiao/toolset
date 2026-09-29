/**
 * 下载小原文学网首页分类区块书籍
 * 默认：玄幻、武侠、都市、历史、科幻、游戏、最新入库小说
 * 用法: node csdn/scripts/batch-download-minyuan-home.js [区块...]
 * 区块: xuanhuan wuxia dushi lishi kehuan youxi latest
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

const SECTIONS = {
  xuanhuan: { label: '玄幻', href: '/xuanhuan/' },
  wuxia: { label: '武侠', href: '/wuxia/' },
  dushi: { label: '都市', href: '/dushi/' },
  lishi: { label: '历史', href: '/lishi/' },
  kehuan: { label: '科幻', href: '/kehuan/' },
  youxi: { label: '游戏', href: '/youxi/' },
  latest: { label: '最新入库小说', heading: '最新入库小说' },
};

const DEFAULT_KEYS = ['xuanhuan', 'wuxia', 'dushi', 'lishi', 'kehuan', 'youxi', 'latest'];

function curl(url) {
  return execSync(`curl.exe -sL -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0" "${url}"`, {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
}

function extractSlugs(block) {
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

function parseSection(html, section) {
  if (section.href) {
    const esc = section.href.replace(/\//g, '\\/');
    const block = html.match(
      new RegExp(`<h2><a href="${esc}">[\\s\\S]*?</a></h2>\\s*<ul[^>]*>([\\s\\S]*?)</ul>`, 'i'),
    )?.[1];
    return extractSlugs(block || '');
  }
  const block = html.match(
    new RegExp(`<h2>${section.heading}</h2>\\s*<ul[^>]*>([\\s\\S]*?)</ul>`, 'i'),
  )?.[1];
  return extractSlugs(block || '');
}

function collectSlugs(html, keys) {
  const bySection = {};
  const all = [];
  const seen = new Set();
  for (const key of keys) {
    const section = SECTIONS[key];
    if (!section) {
      console.warn(`未知区块: ${key}`);
      continue;
    }
    const slugs = parseSection(html, section);
    bySection[key] = slugs;
    for (const slug of slugs) {
      if (!seen.has(slug)) {
        seen.add(slug);
        all.push(slug);
      }
    }
    console.log(`  ${section.label}: ${slugs.length} 本`);
  }
  return { all, bySection };
}

function main() {
  const listOnly = process.argv.includes('--list-only');
  const downloadScript = resolveDownloadScript();
  const argKeys = process.argv.slice(2).filter((a) => !a.startsWith('-') && a !== '--v1');
  const keys = argKeys.length > 0 ? argKeys : DEFAULT_KEYS;
  for (const key of keys) {
    if (!SECTIONS[key]) {
      console.error(`未知区块 "${key}"，可选: ${Object.keys(SECTIONS).join(', ')}`);
      process.exit(1);
    }
  }

  console.log('拉取首页…');
  const html = curl(`${BASE}/`);
  console.log('解析区块:');
  const { all: slugs } = collectSlugs(html, keys);
  if (slugs.length === 0) {
    throw new Error('未解析到任何书目');
  }

  const existingIds = new Set(discoverBooks(path.join(root, 'books')).map((b) => String(b.id)));
  const pending = slugs.filter((slug) => !existingIds.has(minyuanLocalId(slug)));
  const skipped = slugs.filter((slug) => existingIds.has(minyuanLocalId(slug)));

  console.log(`\n合计去重 ${slugs.length} 本，已存在 ${skipped.length} 本，待下载 ${pending.length} 本`);
  if (skipped.length) console.log(`跳过: ${skipped.map((s) => minyuanLocalId(s)).join(', ')}`);
  if (pending.length === 0) {
    console.log('无需下载');
    return;
  }
  console.log(`待下载: ${pending.map((s) => minyuanLocalId(s)).join(', ')}\n`);
  if (listOnly) return;

  const results = { success: [], failed: [] };
  for (const slug of pending) {
    const localId = minyuanLocalId(slug);
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

  console.log('\n========== 首页分类批量下载完成 ==========');
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
