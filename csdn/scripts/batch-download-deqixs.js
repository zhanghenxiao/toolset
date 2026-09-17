/**
 * 批量下载得奇小说网书籍
 * 用法: node batch-download-deqixs.js [startId] [endId]
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const {
  buildBookFilename,
  buildBookDownloadUrl,
  getBookPath,
  getWorkDir,
  discoverBooks,
  deqixsCoverUrl,
} = require('./book-paths');

const root = path.resolve(__dirname, '../..');
const { SOURCE_SHARE_LINE } = require('./source-share-line');
const registryPath = path.join(__dirname, '../src/data/deqixs-batch-registry.json');

const MAX_SEGMENT = 500;

const [, , startArg, endArg] = process.argv;
const startId = Number(startArg || 11);
const endId = Number(endArg || 100);

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

function curl(url, outFile) {
  execSync(`curl.exe -sL -o "${outFile}" "${url}"`, { stdio: 'pipe' });
}

function curlText(url) {
  return execSync(`curl.exe -sL "${url}"`, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
}

function readBookText(filePath) {
  const buffer = fs.readFileSync(filePath);
  const utf8 = buffer.toString('utf8');
  const sample = utf8.slice(0, 4000);
  if (!utf8.includes('\uFFFD') && /《|第\d+章|作者：/.test(sample)) return utf8;
  return new TextDecoder('gb18030').decode(buffer);
}

function stripHeader(text) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => /^ 第.+章/.test(line) || /^\d+、/.test(line.trim()));
  return start === -1 ? text : lines.slice(start).join('\n');
}

function hasExistingBook(id) {
  const existingIds = new Set(discoverBooks(path.join(root, 'books')).map((b) => b.id));
  return existingIds.has(id);
}

function parseMetadata(html, id) {
  if (!html || html.length < 500) return null;
  if (/404|不存在|未找到/i.test(html) && !html.includes('作者')) return null;

  let title = html.match(new RegExp(`<a href="/${id}/#dir">([^<]+)</a>`))?.[1]?.trim();
  if (!title || /towan/i.test(title)) {
    title = html.match(/<h1[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/)?.[1]?.trim();
  }
  if (!title || /towan/i.test(title)) {
    title = html.match(/<title>([^<\-]+?)(?:-|最新章节|TXT)/i)?.[1]?.trim();
  }
  const author = html.match(/authorarticle\.php\?author=[^"]+">作者：([^<]+)</)?.[1]?.trim()
    || html.match(/作者[：:]\s*([^\n<]+)/)?.[1]?.trim();
  if (!title || !author || /towan/i.test(title)) return null;

  const status = /已完结/.test(html) ? '已完结' : '连载中';
  const categoryMatch = html.match(/(?:连载中|已完结)\s*<\/span>\s*<span>(\S+小说)/)
    || html.match(/(?:连载中|已完结)\s+(\S+小说)/);
  const category = categoryMatch ? categoryMatch[1].replace('小说', '') : '玄幻';

  const segments = [];
  const seen = new Set();
  for (const m of html.matchAll(new RegExp(`packdown\\.php\\?aid=${id}&start=(\\d+)&end=(\\d+)`, 'g'))) {
    const key = `${m[1]}-${m[2]}`;
    if (seen.has(key)) continue;
    seen.add(key);
    segments.push({ start: Number(m[1]), end: Number(m[2]) });
  }
  if (segments.length === 0) {
    for (const m of html.matchAll(/\((\d+)-(\d+)章\)/g)) {
      const key = `${m[1]}-${m[2]}`;
      if (seen.has(key)) continue;
      seen.add(key);
      segments.push({ start: Number(m[1]), end: Number(m[2]) });
    }
  }
  if (segments.length === 0) return null;
  const normalizedSegments = normalizeSegments(segments);

  const excerpt = html.match(/<div class="des bb"[^>]*>([\s\S]*?)<\/div>/i)?.[1]
    ?.replace(/<br\s*\/?>/gi, ' ')
    .replace(/&emsp;/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200) || '';

  const latestMatch = html.match(/<a href="[^"]*\/\d+\/\d+\.html">第(\d+)章\s*([^<]+)</)
    || html.match(/第(\d+)章\s*([^\n<]+)/);
  const latestChapter = latestMatch
    ? `第${latestMatch[1]}章 ${latestMatch[2].trim()}`
    : '';

  const dateMatch = html.match(/更新时间[：:]\s*(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] : new Date().toISOString().slice(0, 10);

  return { id, title, author, status, category, segments: normalizedSegments, excerpt, latestChapter, date };
}

const CN_NUM = { 零: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10, 百: 100, 千: 1000, 两: 2 };

function cnToInt(text) {
  if (/^\d+$/.test(text)) return Number(text);
  let result = 0;
  let current = 0;
  for (const ch of text) {
    if (ch === '十') {
      current = current === 0 ? 1 : current;
      result += current * 10;
      current = 0;
      continue;
    }
    if (CN_NUM[ch] >= 10) {
      result += (current || 1) * CN_NUM[ch];
      current = 0;
      continue;
    }
    if (CN_NUM[ch] !== undefined) current = CN_NUM[ch];
  }
  return result + current;
}

function findLatestChapterNum(content) {
  let max = 0;
  let lastTitle = '';
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (!t || t.length > 80) continue;
    let m = t.match(/^第(\d+)章[：:\s]?(.*)$/);
    if (m) {
      const n = Number(m[1]);
      if (n > max && n < 50000) { max = n; lastTitle = m[2]; }
      continue;
    }
    m = t.match(/^第([一二三四五六七八九十百千万零两]+)章[：:\s]?(.*)$/);
    if (m) {
      const n = cnToInt(m[1]);
      if (n > max && n < 50000) { max = n; lastTitle = m[2]; }
      continue;
    }
    m = t.match(/^(\d+)、\s*(.*)$/);
    if (m) {
      const n = Number(m[1]);
      if (n > max && n < 50000) { max = n; lastTitle = m[2]; }
    }
  }
  for (const m of content.matchAll(/章节范围：1-(\d+)章/g)) {
    const n = Number(m[1]);
    if (n > max && n < 50000) max = n;
  }
  return { max, lastTitle };
}

function slugify(title) {
  return title
    .replace(/[？！。，、：:；;（）()《》「」【】\s]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .slice(0, 40) || `book-${Date.now()}`;
}

function loadRegistry() {
  if (!fs.existsSync(registryPath)) return [];
  return JSON.parse(fs.readFileSync(registryPath, 'utf8'));
}

function saveRegistry(entries) {
  fs.writeFileSync(registryPath, JSON.stringify(entries, null, 2), 'utf8');
}

function downloadBook(meta) {
  const { id, title, author, segments } = meta;
  const workDir = getWorkDir(root, id);
  const coverPath = path.join(root, 'csdn/src/assets/images/books', `book-${id}.jpg`);
  const excerptPath = path.join(root, 'csdn/src/data/books', `book-${id}-excerpt.txt`);

  fs.mkdirSync(workDir, { recursive: true });
  fs.mkdirSync(path.dirname(coverPath), { recursive: true });

  console.log(`\n[${id}] 下载《${title}》…`);
  curl(deqixsCoverUrl(id), coverPath);
  const coverBuf = fs.readFileSync(coverPath);
  if (coverBuf.length < 500 || coverBuf[0] !== 0xff || coverBuf[1] !== 0xd8) {
    fs.unlinkSync(coverPath);
    console.warn(`  [${id}] 封面无效，已删除`);
  }

  const partFiles = [];
  segments.forEach((seg, idx) => {
    const partName = `part${idx + 1}.txt`;
    const partPath = path.join(workDir, partName);
    const url = `https://www.deqixs.org/modules/article/packdown.php?aid=${id}&start=${seg.start}&end=${seg.end}`;
    curl(url, partPath);
    const size = fs.statSync(partPath).size;
    if (size < 1000) throw new Error(`分段过小(${size}B): ${seg.start}-${seg.end}`);
    partFiles.push(partName);
    console.log(`  ✓ ${seg.start}-${seg.end}章 (${(size / 1024 / 1024).toFixed(1)}MB)`);
  });

  const bodies = partFiles.map((file) => stripHeader(readBookText(path.join(workDir, file))));
  const merged = `《${title}》  作者：${author}\n${SOURCE_SHARE_LINE}\n\n\n${bodies.join('\n')}`;
  const tempOut = path.join(workDir, '_merged-temp.txt');
  fs.writeFileSync(tempOut, merged, 'utf8');

  const { max, lastTitle } = findLatestChapterNum(merged);
  const segEnd = segments[segments.length - 1].end;
  const chapterNum = Number(meta.latestChapter.match(/第(\d+)章/)?.[1] || 0);
  let finalMax = Math.max(chapterNum, max, segEnd);
  if (finalMax > segEnd + 50 && max > 0 && max <= segEnd + 50) {
    finalMax = max;
  } else if (finalMax > segEnd + 50) {
    finalMax = segEnd;
  }
  const filename = buildBookFilename(id, title, finalMax);
  const finalPath = getBookPath(root, filename);
  fs.renameSync(tempOut, finalPath);
  for (const p of partFiles) fs.unlinkSync(path.join(workDir, p));
  if (fs.readdirSync(workDir).length === 0) fs.rmdirSync(workDir);

  if (meta.excerpt) fs.writeFileSync(excerptPath, meta.excerpt + '\n', 'utf8');

  const latestChapter = meta.latestChapter || (lastTitle ? `第${max}章 ${lastTitle}` : `第${max}章`);
  const endChapter = segments[segments.length - 1].end;

  return {
    id,
    slug: slugify(title),
    title,
    author,
    date: meta.date,
    category: meta.category,
    status: meta.status,
    chapters: `1-${endChapter}章`,
    latestChapter,
    excerpt: meta.excerpt,
    filename,
    downloadUrl: buildBookDownloadUrl(filename),
    sourceUrl: `https://www.deqixs.org/${id}/txt.html#dir`,
    tags: [
      { name: meta.category, type: 'purple' },
      { name: meta.status === '已完结' ? '完结' : '连载', type: 'blue' },
    ],
  };
}

function appendCleanTargets() {
  // clean-book-txt.js 已改为自动扫描 books/ 目录，无需再手动追加
}

async function main() {
  const registry = loadRegistry();
  const existingIds = new Set(registry.map((b) => b.id));
  const results = { skipped: [], failed: [], success: [] };

  for (let id = startId; id <= endId; id++) {
    if (hasExistingBook(id)) {
      console.log(`[${id}] 跳过（已存在）`);
      results.skipped.push(id);
      continue;
    }

    try {
      const html = curlText(`https://www.deqixs.org/${id}/txt.html`);
      const meta = parseMetadata(html, id);
      if (!meta) {
        console.log(`[${id}] 跳过（无书籍或无法解析）`);
        results.skipped.push(id);
        continue;
      }

      const entry = downloadBook(meta);
      appendCleanTargets();

      const idx = registry.findIndex((b) => b.id === id);
      if (idx >= 0) registry[idx] = entry;
      else registry.push(entry);
      saveRegistry(registry);

      console.log(`[${id}] ✓ 完成 → ${entry.filename}`);
      results.success.push(id);
    } catch (err) {
      console.error(`[${id}] ✗ 失败: ${err.message}`);
      results.failed.push({ id, error: err.message });
    }
  }

  console.log('\n========== 批量下载完成 ==========');
  console.log(`成功: ${results.success.length}`, results.success.join(', ') || '-');
  console.log(`跳过: ${results.skipped.length}`);
  console.log(`失败: ${results.failed.length}`, results.failed.map((f) => f.id).join(', ') || '-');
  console.log(`注册表: ${registryPath}`);

  if (results.success.length > 0) {
    console.log('\n运行清理脚本…');
    execSync('node csdn/scripts/clean-book-txt.js', { cwd: root, stdio: 'inherit' });
    console.log('同步 booksData.js…');
    execSync('node csdn/scripts/sync-all-books-data.js', { cwd: root, stdio: 'inherit' });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
