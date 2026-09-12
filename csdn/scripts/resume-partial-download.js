/**
 * 续传分段下载失败的书籍（_work 中已有部分 part 文件）
 * 用法: node resume-partial-download.js <id> [id2 ...]
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const {
  buildBookFilename,
  getBookPath,
  getWorkDir,
  discoverBooks,
} = require('./book-paths');

const root = path.resolve(__dirname, '../..');
const SOURCE_SHARE_LINE = '更多书源分享，访问网址 https://toolset.site';
const MAX_SEGMENT = 500;
const ids = process.argv.slice(2).map(Number).filter(Boolean);

if (ids.length === 0) {
  console.error('用法: node resume-partial-download.js <id> [id2 ...]');
  process.exit(1);
}

function curl(url, outFile) {
  execSync(`curl.exe -sL -o "${outFile}" "${url}"`, { stdio: 'pipe' });
}

function curlText(url) {
  return execSync(`curl.exe -sL "${url}"`, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
}

function readBookText(filePath) {
  const buffer = fs.readFileSync(filePath);
  const utf8 = buffer.toString('utf8');
  if (!utf8.includes('\uFFFD')) return utf8;
  return new TextDecoder('gb18030').decode(buffer);
}

function stripHeader(text) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => /^ 第.+章/.test(line) || /^\d+、/.test(line.trim()));
  return start === -1 ? text : lines.slice(start).join('\n');
}

function normalizeSegments(segments) {
  const result = [];
  for (const seg of segments) {
    const span = seg.end - seg.start + 1;
    if (span <= MAX_SEGMENT) {
      result.push(seg);
      continue;
    }
    for (let start = seg.start; start <= seg.end; start += MAX_SEGMENT) {
      result.push({ start, end: Math.min(start + MAX_SEGMENT - 1, seg.end) });
    }
  }
  return result;
}

function parseMetadata(html, id) {
  if (!html || html.length < 500) return null;
  let title = html.match(new RegExp(`<a href="/${id}/#dir">([^<]+)</a>`))?.[1]?.trim();
  if (!title || /towan/i.test(title)) {
    title = html.match(/<h1[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/)?.[1]?.trim();
  }
  const author = html.match(/authorarticle\.php\?author=[^"]+">作者：([^<]+)</)?.[1]?.trim()
    || html.match(/作者[：:]\s*([^\n<]+)/)?.[1]?.trim();
  if (!title || !author || /towan/i.test(title)) return null;

  const segments = [];
  const seen = new Set();
  for (const m of html.matchAll(new RegExp(`packdown\\.php\\?aid=${id}&start=(\\d+)&end=(\\d+)`, 'g'))) {
    const key = `${m[1]}-${m[2]}`;
    if (seen.has(key)) continue;
    seen.add(key);
    segments.push({ start: Number(m[1]), end: Number(m[2]) });
  }
  if (segments.length === 0) return null;

  const latestMatch = html.match(/<a href="[^"]*\/\d+\/\d+\.html">第(\d+)章\s*([^<]+)</);
  const latestChapter = latestMatch ? `第${latestMatch[1]}章 ${latestMatch[2].trim()}` : '';

  return { id, title, author, segments: normalizeSegments(segments), latestChapter };
}

function findLatestChapterNum(content) {
  let max = 0;
  let lastTitle = '';
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (!t || t.length > 80) continue;
    let m = t.match(/^第(\d+)章\s*(.*)$/);
    if (m) {
      const n = Number(m[1]);
      if (n > max && n < 50000) { max = n; lastTitle = m[2]; }
      continue;
    }
    m = t.match(/^(\d+)、\s*(.*)$/);
    if (m) {
      const n = Number(m[1]);
      if (n > max && n < 50000) { max = n; lastTitle = m[2]; }
    }
  }
  return { max, lastTitle };
}

function getExistingParts(workDir) {
  if (!fs.existsSync(workDir)) return [];
  return fs.readdirSync(workDir)
    .filter((f) => /^part\d+\.txt$/.test(f))
    .map((f) => {
      const size = fs.statSync(path.join(workDir, f)).size;
      const idx = Number(f.match(/\d+/)[0]);
      return { name: f, idx, size, path: path.join(workDir, f) };
    })
    .filter((p) => p.size >= 1000)
    .sort((a, b) => a.idx - b.idx);
}

function hasExistingBook(id) {
  return discoverBooks(path.join(root, 'books')).some((b) => b.id === id);
}

for (const id of ids) {
  if (hasExistingBook(id)) {
    console.log(`[${id}] 跳过（最终文件已存在）`);
    continue;
  }

  try {
    const html = curlText(`https://www.deqixs.org/${id}/txt.html`);
    const meta = parseMetadata(html, id);
    if (!meta) {
      console.log(`[${id}] 无法解析元数据`);
      continue;
    }

    const workDir = getWorkDir(root, id);
    fs.mkdirSync(workDir, { recursive: true });
    const existingParts = getExistingParts(workDir);
    console.log(`\n[${id}] 续传《${meta.title}》（已有 ${existingParts.length} 段，待下 ${meta.segments.length - existingParts.length} 段）`);

    const pendingSegments = meta.segments.slice(existingParts.length);
    for (const seg of pendingSegments) {
      const partIdx = existingParts.length + 1;
      const partName = `part${partIdx}.txt`;
      const partPath = path.join(workDir, partName);
      const url = `https://www.deqixs.org/modules/article/packdown.php?aid=${id}&start=${seg.start}&end=${seg.end}`;
      curl(url, partPath);
      const size = fs.statSync(partPath).size;
      if (size < 1000) {
        fs.unlinkSync(partPath);
        throw new Error(`分段过小(${size}B): ${seg.start}-${seg.end}`);
      }
      existingParts.push({ name: partName, idx: partIdx, size, path: partPath });
      console.log(`  ✓ ${seg.start}-${seg.end}章 (${(size / 1024 / 1024).toFixed(1)}MB)`);
    }

    const allParts = getExistingParts(workDir);
    const bodies = allParts.map((p) => stripHeader(readBookText(p.path)));
    const merged = `《${meta.title}》  作者：${meta.author}\n${SOURCE_SHARE_LINE}\n\n\n${bodies.join('\n')}`;
    const tempOut = path.join(workDir, '_merged-temp.txt');
    fs.writeFileSync(tempOut, merged, 'utf8');

    const { max, lastTitle } = findLatestChapterNum(merged);
    const segEnd = meta.segments[meta.segments.length - 1].end;
    const chapterNum = meta.latestChapter.match(/第(\d+)章/)?.[1];
    let finalMax = chapterNum ? Number(chapterNum) : max;
    if (!finalMax || finalMax > segEnd + 50) finalMax = max > 0 ? max : segEnd;

    const filename = buildBookFilename(id, meta.title, finalMax);
    const finalPath = getBookPath(root, filename);
    fs.renameSync(tempOut, finalPath);

    for (const p of allParts) fs.unlinkSync(p.path);
    if (fs.readdirSync(workDir).length === 0) fs.rmdirSync(workDir);

    console.log(`[${id}] ✓ 完成 → ${filename}`);
  } catch (err) {
    console.error(`[${id}] ✗ 失败: ${err.message}`);
  }
}

console.log('\n运行清理脚本…');
execSync('node csdn/scripts/clean-book-txt.js', { cwd: root, stdio: 'inherit' });
console.log('同步 booksData.js…');
execSync('node csdn/scripts/sync-all-books-data.js', { cwd: root, stdio: 'inherit' });
