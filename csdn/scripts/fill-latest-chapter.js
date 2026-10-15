/**
 * 为 booksData.js 中缺少 latestChapter 的条目补全
 * 用法: node csdn/scripts/fill-latest-chapter.js [--online] [--chapters-only]
 *   --online        从源站拉取最新章名（m_→小原，数字 id→得奇，w_→00w）
 *   --chapters-only 仅用 chapters 字段生成「第N章」（不请求网络）
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const {
  isMinyuanId,
  is00wId,
  isJcxsId,
  isX33xsId,
  isLibahaoId,
  isCustomBookId,
} = require('./book-paths');
const { parseBookMeta: parseMinyuanMeta, BASE: MIN_BASE } = require('./minyuan-book-core');
const { parseBookMeta: parse00wMeta, getHtml: get00wHtml } = require('./00w-book-core');

const root = path.resolve(__dirname, '../..');
const booksDataPath = path.join(root, 'csdn/src/data/booksData.js');
const BOOK_BLOCK_RE = /\r?\n\{[\s\S]*?\r?\n  \},/g;

const online = process.argv.includes('--online');
const chaptersOnly = process.argv.includes('--chapters-only');

function parseBlockId(block) {
  const fromHead = block.match(/^\r?\n\{\r?\n    id: ([^,]+),/m)?.[1]?.trim();
  if (!fromHead) return null;
  return /^\d+$/.test(fromHead) ? Number(fromHead) : fromHead.replace(/^"|"$/g, '');
}

function latestFromDownloadUrl(block) {
  const url = block.match(/downloadUrl: "([^"]+)"/)?.[1] || '';
  const base = path.basename(url);
  const m = base.match(/1-(\d+)章\.txt$/i);
  return m ? `第${m[1]}章` : '';
}

function latestFromChapters(chapters) {
  const m = String(chapters || '').match(/1-(\d+)章/);
  return m ? `第${m[1]}章` : '';
}

function latestFromDownloadOrChapters(block) {
  return latestFromDownloadUrl(block)
    || latestFromChapters(block.match(/chapters: "([^"]+)"/)?.[1]);
}

function insertLatestChapter(block, latestChapter) {
  if (!latestChapter) return block;
  if (/latestChapter:/.test(block)) {
    return block.replace(/latestChapter: "[^"]*"/, `latestChapter: ${JSON.stringify(latestChapter)}`);
  }
  return block.replace(
    /(\r?\n    chapters: "[^"]+",)/,
    (m) => `${m}${m.includes('\r') ? '\r\n' : '\n'}    latestChapter: ${JSON.stringify(latestChapter)},`,
  );
}

function curlText(url) {
  return execSync(`curl.exe -sL -A "Mozilla/5.0" "${url}"`, {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
}

function parseDeqixsLatest(html, id) {
  const latestMatch = html.match(/<a href="[^"]*\/\d+\/\d+\.html">第(\d+)章\s*([^<]+)</)
    || html.match(/第(\d+)章\s*([^\n<]+)/);
  return latestMatch ? `第${latestMatch[1]}章 ${latestMatch[2].trim()}` : '';
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchLatestForBook(id, block) {
  const fallback = latestFromDownloadOrChapters(block);

  if (chaptersOnly || !online) {
    return fallback;
  }

  try {
    if (isMinyuanId(id)) {
      const slug = String(id).slice(2);
      const html = curlText(`${MIN_BASE}/txt/${slug}/`);
      const meta = parseMinyuanMeta(html);
      if (meta?.latestChapter) return meta.latestChapter;
    } else if (typeof id === 'number') {
      const html = curlText(`https://www.deqixs.org/${id}/txt.html`);
      const latest = parseDeqixsLatest(html, id);
      if (latest) return latest;
    } else if (is00wId(id)) {
      const siteBookId = String(id).slice(2);
      const html = await get00wHtml(`https://www.00w.org/bxwx_${siteBookId}/`);
      const meta = parse00wMeta(html, siteBookId);
      if (meta?.latestChapter) return meta.latestChapter;
    } else if (isJcxsId(id) || isX33xsId(id) || isLibahaoId(id) || isCustomBookId(id)) {
      return fallback;
    }
  } catch (e) {
    // fall through
  }
  return fallback;
}

async function main() {
  let content = fs.readFileSync(booksDataPath, 'utf8');
  const blocks = content.match(BOOK_BLOCK_RE) || [];
  const todo = [];

  for (const block of blocks) {
    const hasVal = block.match(/latestChapter: "([^"]+)"/)?.[1];
    if (hasVal) continue;
    const id = parseBlockId(block);
    if (id == null) continue;
    todo.push({ id, block });
  }

  console.log(`缺少 latestChapter: ${todo.length} 本`);
  if (!todo.length) return;

  let updated = 0;
  let i = 0;
  for (const item of todo) {
    i += 1;
    const latest = await fetchLatestForBook(item.id, item.block);
    if (!latest) continue;
    const newBlock = insertLatestChapter(item.block, latest);
    if (newBlock === item.block) continue;
    content = content.replace(item.block, newBlock);
    item.block = newBlock;
    updated += 1;
    if (i % 25 === 0 || i === todo.length) {
      process.stdout.write(`\r  进度 ${i}/${todo.length}，已写入 ${updated}…`);
    }
    if (online && !chaptersOnly && isMinyuanId(item.id)) {
      await sleep(120);
    } else if (online && !chaptersOnly && typeof item.id === 'number') {
      await sleep(200);
    }
  }
  process.stdout.write('\n');

  fs.writeFileSync(booksDataPath, content, 'utf8');
  console.log(`已补全 ${updated} 本的 latestChapter`);
  if (!online && !chaptersOnly) {
    console.log('提示: 加 --online 从源站拉取章名，或 --chapters-only 仅用章节数生成「第N章」');
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
