/**
 * 找出下载中断（未完结）的 libahao 书籍
 *
 * 判定依据：downloader 成功跑完会删除 books/_work/libahao/chapters/<bookPath>/.progress.json，
 * 因此仍存在 .progress.json 即代表该书未抓完（completedChapterNums 为已完成章节数）。
 * 注意：不能按 TXT 尾部书源分享水印判断——残缺文件也会被 clean-book-txt 补上水印。
 *
 * 用法:
 *   node csdn/scripts/libahao-incomplete.js [--json]
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const booksDir = path.join(root, 'books');
const progressRoot = path.join(root, 'books/_work/libahao/chapters');

function localIdToBookPath(localId) {
  return String(localId).replace(/^l_/, '').replace('__', '_');
}

/** 用缓存的目录页取最后一章标题，再回查 TXT 是否已包含（离线、可靠） */
function hasLastChapter(localId, bookPath, txtCache) {
  const indexHtml = path.join(root, 'books/_work/libahao', `index-${bookPath}.html`);
  if (!fs.existsSync(indexHtml)) return null;
  const html = fs.readFileSync(indexHtml, 'utf8');
  const re = new RegExp(`href="(/book/${bookPath}/(\\d+)(?:_\\d+)?\\.html)"[^>]*>([\\s\\S]*?)</a>`, 'gi');
  let best = null;
  let m;
  while ((m = re.exec(html)) !== null) {
    const num = Number(m[2]);
    const name = m[3].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
    if (!name) continue;
    if (!best || num > best.num) best = { num, name };
  }
  if (!best) return null;
  if (txtCache.includes(best.name)) return true;
  // 标题可能被正文换行/空格切碎，退化为按序号关键词再试一次
  return new RegExp(`第?\\s*${best.num}\\s*[章、]`).test(txtCache);
}

function expectedChapters(filename) {
  const m = filename.match(/1-(\d+)章\.txt$/);
  return m ? Number(m[1]) : 0;
}

function findIncomplete() {
  if (!fs.existsSync(booksDir)) return [];
  const result = [];
  for (const name of fs.readdirSync(booksDir)) {
    const m = name.match(/^(l_\d+(?:__\d+)?)/);
    if (!m || !name.endsWith('.txt')) continue;
    const localId = m[1];
    const bookPath = localIdToBookPath(localId);
    const progressFile = path.join(progressRoot, bookPath, '.progress.json');
    const txt = fs.readFileSync(path.join(booksDir, name), 'utf8');
    const lastChapterOk = hasLastChapter(localId, bookPath, txt);
    if (!fs.existsSync(progressFile) && lastChapterOk !== false) continue;
    let done = 0;
    let partial = 0;
    try {
      const j = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
      done = (j.completedChapterNums || []).length;
      partial = (j.partialChapterNums || []).length;
    } catch {
      // ignore
    }
    result.push({
      localId,
      title: name.replace(/^l_\d+(?:__\d+)?_/, '').replace(/1-\d+章\.txt$/, ''),
      filename: name,
      done,
      partial,
      expected: expectedChapters(name),
      url: `https://m.libahao2.com/book/${bookPath}/`,
    });
  }
  return result.sort((a, b) => a.localId.localeCompare(b.localId));
}

module.exports = { findIncomplete, localIdToBookPath, expectedChapters };

if (require.main === module) {
  const list = findIncomplete();
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(list, null, 2));
  } else {
    console.log(`未完结书籍 ${list.length} 本：`);
    for (const b of list) {
      console.log(`  ${b.localId} | ${b.title} | ${b.done}/${b.expected} 章${b.partial ? ` （${b.partial} 章缺续页）` : ''}`);
    }
    console.log(`\n合计中断 ${list.length} 本，累计已抓 ${list.reduce((s, b) => s + b.done, 0)} 章，尚缺 ${list.reduce((s, b) => s + Math.max(0, b.expected - b.done), 0)} 章`);
  }
}
