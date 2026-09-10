/**
 * 修复 books/ 下 towan('xxx') 假书名文件并重命名
 * 用法: node fix-towan-book-names.js [startId] [endId]
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const {
  buildBookFilename,
  buildBookDownloadUrl,
  discoverBooks,
  getBookPath,
  getWorkDir,
} = require('./book-paths');

const root = path.resolve(__dirname, '../..');
const booksDataPath = path.join(root, 'csdn/src/data/booksData.js');
const registryPath = path.join(root, 'csdn/src/data/deqixs-batch-registry.json');
const SOURCE_SHARE_LINE = '更多书源分享，访问网址 https://toolset.site';

const startId = Number(process.argv[2] || 30);
const endId = Number(process.argv[3] || 100);

function curlText(url) {
  return execSync(`curl.exe -sL "${url}"`, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
}

function readBookText(filePath) {
  const buffer = fs.readFileSync(filePath);
  const utf8 = buffer.toString('utf8');
  if (!utf8.includes('\uFFFD')) return utf8;
  return new TextDecoder('gb18030').decode(buffer);
}

function writeBookText(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

function parseTitle(html, id) {
  if (!html || html.length < 500) return null;

  const dirTitle = html.match(new RegExp(`<a href="/${id}/#dir">([^<]+)</a>`))?.[1]?.trim();
  if (dirTitle && !/towan/i.test(dirTitle)) return dirTitle;

  const h1Title = html.match(/<h1[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/)?.[1]?.trim();
  if (h1Title && !/towan/i.test(h1Title)) return h1Title;

  const pageTitle = html.match(/<title>([^<\-]+?)(?:-|最新章节|TXT)/i)?.[1]?.trim();
  if (pageTitle && !/towan/i.test(pageTitle)) return pageTitle;

  return null;
}

function parseAuthor(html) {
  return html.match(/authorarticle\.php\?author=[^"]+">作者：([^<]+)</)?.[1]?.trim()
    || html.match(/作者[：:]\s*([^\n<]+)/)?.[1]?.trim()
    || null;
}

function findLatestChapterNum(content) {
  let max = 0;
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (!t || t.length > 80) continue;
    const m = t.match(/^第(\d+)章/) || t.match(/^(\d+)、/);
    if (m) {
      const n = Number(m[1]);
      if (n > max && n < 20000) max = n;
    }
  }
  return max;
}

function fixHeader(content, title, author) {
  const lines = content.split(/\r?\n/);
  if (/^《/.test(lines[0])) {
    lines[0] = `《${title}》  作者：${author || '未知'}`;
    return lines.join('\n');
  }
  return content;
}

function isTowanFile(name) {
  return /^towan\(/i.test(name);
}

function listMergedTxt(dir) {
  return fs.readdirSync(dir).filter((f) =>
    f.endsWith('.txt') && !f.startsWith('part') && !f.startsWith('_'),
  );
}

function updateBooksData(id, title, filename) {
  let content = fs.readFileSync(booksDataPath, 'utf8');
  const blockRe = new RegExp(`(\\n  \\{\\n    id: ${id},[\\s\\S]*?\\n  \\},)`, 'm');
  const m = content.match(blockRe);
  if (!m) return false;
  let block = m[1];
  block = block.replace(/slug: "[^"]+"/, `slug: ${JSON.stringify(title)}`);
  block = block.replace(/title: "[^"]+"/, `title: ${JSON.stringify(title)}`);
  block = block.replace(/downloadUrl: "[^"]+"/, `downloadUrl: ${JSON.stringify(buildBookDownloadUrl(filename))}`);
  content = content.replace(blockRe, block);
  fs.writeFileSync(booksDataPath, content, 'utf8');
  return true;
}

function updateRegistry(id, title, filename) {
  if (!fs.existsSync(registryPath)) return;
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  const entry = registry.find((b) => b.id === id);
  if (!entry) return;
  entry.title = title;
  entry.slug = title;
  entry.filename = filename;
  entry.downloadUrl = buildBookDownloadUrl(filename);
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n', 'utf8');
}

const results = [];

for (let id = startId; id <= endId; id++) {
  const legacyDir = path.join(root, 'books', String(id));
  const workDir = getWorkDir(root, id);
  const dir = fs.existsSync(legacyDir) ? legacyDir : workDir;
  if (!fs.existsSync(dir)) {
    const flat = discoverBooks(path.join(root, 'books')).find((b) => b.id === id);
    if (!flat) continue;
  }
  const scanDir = fs.existsSync(legacyDir) ? legacyDir : (fs.existsSync(workDir) ? workDir : null);
  if (!scanDir) continue;

  const files = listMergedTxt(scanDir);
  const towanFiles = files.filter(isTowanFile);
  const goodFiles = files.filter((f) => !isTowanFile(f));

  if (towanFiles.length === 0) continue;

  // 已有正确文件名：删除 towan 重复文件
  if (goodFiles.length > 0) {
    for (const f of towanFiles) {
      fs.unlinkSync(path.join(dir, f));
      results.push(`[${id}] 删除重复 towan: ${f}`);
    }
    continue;
  }

  // 仅 towan 文件：拉取书名并重命名
  const towanFile = towanFiles[0];
  const towanPath = path.join(dir, towanFile);
  let title;
  let author;

  try {
    const html = curlText(`https://www.deqixs.org/${id}/txt.html`);
    title = parseTitle(html, id);
    author = parseAuthor(html);
  } catch (e) {
    results.push(`[${id}] 获取元数据失败: ${e.message}`);
    continue;
  }

  if (!title) {
    results.push(`[${id}] 无法解析书名，跳过`);
    continue;
  }

  const content = readBookText(towanPath);
  const maxChapter = findLatestChapterNum(content) || (towanFile.match(/(\d+)章/)?.[1] || '0');
  const newName = buildBookFilename(id, title, maxChapter);
  const newPath = getBookPath(root, newName);

  const fixed = fixHeader(content, title, author || '未知');
  writeBookText(newPath, fixed);
  if (towanPath !== newPath) fs.unlinkSync(towanPath);

  updateBooksData(id, title, newName);
  updateRegistry(id, title, newName);

  results.push(`[${id}] ${towanFile} → ${newName} (${title})`);
}

console.log(results.join('\n') || '无需修复');
console.log(`\n共处理 ${results.length} 项`);
