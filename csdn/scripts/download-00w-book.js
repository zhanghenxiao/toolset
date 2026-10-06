/**
 * 零零文学 00w.org 全书下载
 * 用法: node csdn/scripts/download-00w-book.js <bookUrl|chapterUrl> [localId]
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const {
  buildBookFilename,
  getBookPath,
  oowLocalId,
  is00wId,
} = require('./book-paths');
const {
  BASE,
  getHtml,
  parseBookPath,
  parseBookMeta,
  parseCatalog,
  extractChapterText,
  parseChapterTitle,
  parseNextHref,
} = require('./00w-book-core');
const { buildBookHeader, finalizeBookFile } = require('./source-share-line');

const root = path.resolve(__dirname, '../..');
const DELAY_MS = 200;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchChapterText(chapter, siteBookId) {
  const prefix = `/bxwx_${siteBookId}/`;
  let pageRel = chapter.href.startsWith('/') ? chapter.href : `${prefix}${chapter.id}.html`;
  const rootId = chapter.id;
  const parts = [];
  let title = chapter.title === '开始阅读' ? '' : chapter.title;
  const seen = new Set();

  for (let guard = 0; guard < 30; guard += 1) {
    const url = `${BASE}${pageRel}`;
    if (seen.has(url)) break;
    seen.add(url);

    const html = await getHtml(url);
    if (!title) title = parseChapterTitle(html) || chapter.title;
    const body = extractChapterText(html);
    if (body) parts.push(body);

    const next = parseNextHref(html);
    if (!next) break;
    const nextRel = next.startsWith('/') ? next : `/${next}`;
    const pageRe = new RegExp(`^${prefix.replace(/\//g, '\\/')}${rootId}_\\d+\\.html$`, 'i');
    if (pageRe.test(nextRel)) {
      pageRel = nextRel;
      await sleep(DELAY_MS);
      continue;
    }
    break;
  }

  const merged = parts.join('\n\n');
  if (!merged) throw new Error(`正文为空: ${chapter.href}`);
  return { title, text: merged };
}

async function main() {
  const urlOrPath = process.argv[2];
  const localIdArg = process.argv[3];
  if (!urlOrPath) {
    console.error('用法: node download-00w-book.js <bookUrl|chapterUrl> [localId]');
    process.exit(1);
  }

  const parsed = parseBookPath(urlOrPath);
  if (!parsed) throw new Error('无法解析书籍 URL，需含 /bxwx_{id}/');
  const { siteBookId } = parsed;
  const indexUrl = `${BASE}/bxwx_${siteBookId}/`;
  console.log(`抓取 00w 书籍 bxwx_${siteBookId}…`);

  const indexHtml = await getHtml(indexUrl);
  const meta = parseBookMeta(indexHtml, siteBookId);
  if (!meta.title) throw new Error('无法解析书名');

  const chapters = parseCatalog(indexHtml, siteBookId);
  if (!chapters.length) throw new Error('目录为空');

  const localId = localIdArg || oowLocalId(siteBookId);
  if (!is00wId(localId)) throw new Error('localId 须为 w_{siteBookId} 格式');

  console.log(`《${meta.title}》 作者：${meta.author || '未知'}，共 ${chapters.length} 章`);

  const maxChapter = chapters.length;
  const filename = buildBookFilename(localId, meta.title, maxChapter);
  const outPath = getBookPath(root, filename);
  fs.writeFileSync(outPath, buildBookHeader(meta.title, meta.author || '未知'), 'utf8');

  let failed = 0;
  for (let i = 0; i < chapters.length; i += 1) {
    const ch = chapters[i];
    process.stdout.write(`\r  [${i + 1}/${chapters.length}] ${ch.title.slice(0, 30)}…`);
    try {
      const { title, text } = await fetchChapterText(ch, siteBookId);
      fs.appendFileSync(outPath, `${title}\n\n${text}\n\n\n`, 'utf8');
    } catch (err) {
      failed += 1;
      fs.appendFileSync(outPath, `${ch.title}\n\n[本章下载失败: ${err.message}]\n\n\n`, 'utf8');
    }
    await sleep(DELAY_MS);
  }
  process.stdout.write('\n');

  finalizeBookFile(outPath);

  const coverDir = path.join(root, 'csdn/src/assets/images/books');
  fs.mkdirSync(coverDir, { recursive: true });
  const coverPath = path.join(coverDir, `book-${localId}.jpg`);
  try {
    execSync(`curl.exe -sL -A "Mozilla/5.0" -o "${coverPath}" "${BASE}${meta.coverPath}"`, { stdio: 'pipe' });
    const buf = fs.readFileSync(coverPath);
    if (buf.length < 500) fs.unlinkSync(coverPath);
  } catch {
    console.warn('封面下载失败');
  }

  const excerptPath = path.join(root, 'csdn/src/data/books', `book-${localId}-excerpt.txt`);
  if (meta.excerpt) fs.writeFileSync(excerptPath, `${meta.excerpt}\n`, 'utf8');

  console.log(`已写入 ${outPath}`);
  console.log(`localId=${localId} 章节 1-${maxChapter}${failed ? `（失败 ${failed} 章）` : ''}`);
  console.log('运行: node csdn/scripts/clean-book-txt.js');
  console.log('运行: node csdn/scripts/sync-all-books-data.js');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
