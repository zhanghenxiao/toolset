/**
 * 重试 00w 书籍 TXT 中下载失败的章节
 * 用法: node csdn/scripts/repair-00w-book.js <txtPath>
 */
const fs = require('fs');
const path = require('path');
const {
  BASE,
  getHtml,
  extractChapterText,
  parseChapterTitle,
  parseNextHref,
} = require('./00w-book-core');

const DELAY_MS = 400;
const RETRIES = 4;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchChapterWithRetry(href, siteBookId) {
  const prefix = `/bxwx_${siteBookId}/`;
  const pageRel = href.startsWith('/') ? href : `${prefix}${href}`;
  const rootId = pageRel.match(/\/(\d+)\.html$/)?.[1];
  if (!rootId) throw new Error(`无法解析章节: ${href}`);

  let lastErr;
  for (let attempt = 0; attempt < RETRIES; attempt += 1) {
    try {
      const parts = [];
      let title = '';
      let current = pageRel;
      const seen = new Set();
      for (let guard = 0; guard < 30; guard += 1) {
        const url = `${BASE}${current}`;
        if (seen.has(url)) break;
        seen.add(url);
        const html = await getHtml(url);
        if (!title) title = parseChapterTitle(html);
        const body = extractChapterText(html);
        if (body) parts.push(body);
        const next = parseNextHref(html);
        if (!next) break;
        const nextRel = next.startsWith('/') ? next : `/${next}`;
        const pageRe = new RegExp(`^${prefix.replace(/\//g, '\\/')}${rootId}_\\d+\\.html$`, 'i');
        if (pageRe.test(nextRel)) {
          current = nextRel;
          await sleep(DELAY_MS);
          continue;
        }
        break;
      }
      const text = parts.join('\n\n').trim();
      if (!text) throw new Error(`正文为空: ${href}`);
      return { title, text };
    } catch (err) {
      lastErr = err;
      await sleep(1500 * (attempt + 1));
    }
  }
  throw lastErr;
}

async function main() {
  const txtPath = path.resolve(process.argv[2] || '');
  if (!txtPath || !fs.existsSync(txtPath)) {
    console.error('用法: node repair-00w-book.js <txtPath>');
    process.exit(1);
  }

  const siteMatch = path.basename(txtPath).match(/^w_(\d+)_/);
  if (!siteMatch) throw new Error('文件名须为 w_{siteBookId}_*.txt');
  const siteBookId = siteMatch[1];

  let content = fs.readFileSync(txtPath, 'utf8');
  const failRe = /([^\n]+)\n\n\[本章下载失败: [^\]]*?(\/bxwx_\d+\/\d+\.html)[^\]]*\]\n\n/g;
  const failures = [...content.matchAll(failRe)];
  if (!failures.length) {
    console.log('没有失败章节');
    return;
  }

  console.log(`发现 ${failures.length} 个失败章节，开始重试…`);
  let fixed = 0;
  for (const m of failures) {
    const oldBlock = m[0];
    const fallbackTitle = m[1].trim();
    const href = m[2];
    process.stdout.write(`  重试 ${href}…`);
    try {
      const { title, text } = await fetchChapterWithRetry(href, siteBookId);
      const newBlock = `${title || fallbackTitle}\n\n${text}\n\n\n`;
      content = content.replace(oldBlock, newBlock);
      fixed += 1;
      process.stdout.write(' OK\n');
    } catch (err) {
      process.stdout.write(` 失败: ${err.message}\n`);
    }
    await sleep(DELAY_MS);
  }

  fs.writeFileSync(txtPath, content, 'utf8');
  console.log(`已修复 ${fixed}/${failures.length} 章`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
