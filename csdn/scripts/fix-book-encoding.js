/**
 * 重新下载并合并单本书籍（强制 GB18030 解码）
 * 用法: node fix-book-encoding.js <id> <书名> <作者> <seg1-end> [seg2-end ...]
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const {
  buildBookFilename,
  getBookPath,
  getWorkDir,
} = require('./book-paths');

const SOURCE_SHARE_LINE = '更多书源分享，访问网址 https://toolset.site';

const [, , idArg, title, author, ...segmentEnds] = process.argv;
if (!idArg || !title || !author || segmentEnds.length === 0) {
  console.error('用法: node fix-book-encoding.js <id> <书名> <作者> <end1> [end2 ...]');
  process.exit(1);
}

const id = String(idArg);
const root = path.resolve(__dirname, '../..');
const workDir = getWorkDir(root, id);

function curl(url, outFile) {
  execSync(`curl.exe -sL -o "${outFile}" "${url}"`, { stdio: 'inherit' });
}

function readBookText(filePath) {
  const buffer = fs.readFileSync(filePath);
  const utf8 = buffer.toString('utf8');
  const sample = utf8.slice(0, 4000);
  if (!utf8.includes('\uFFFD') && /《|第\d+章|作者：/.test(sample)) {
    return utf8;
  }
  return new TextDecoder('gb18030').decode(buffer);
}

function stripHeader(text) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => /^ 第.+章/.test(line) || /^\d+、/.test(line.trim()));
  return start === -1 ? text : lines.slice(start).join('\n');
}

function findMaxChapter(text) {
  let max = 0;
  for (const line of text.split('\n')) {
    const t = line.trim();
    const m = t.match(/^第(\d+)章/) || t.match(/^(\d+)、/);
    if (m) {
      const n = Number(m[1]);
      if (n > max && n < 50000) max = n;
    }
  }
  return max;
}

fs.mkdirSync(workDir, { recursive: true });

const bodies = [];
let start = 1;
for (const endStr of segmentEnds) {
  const end = Number(endStr);
  const partName = `part-${start}-${end}.txt`;
  const partPath = path.join(workDir, partName);
  const url = `https://www.deqixs.org/modules/article/packdown.php?aid=${id}&start=${start}&end=${end}`;
  console.log(`下载 ${start}-${end}…`);
  curl(url, partPath);
  const size = fs.statSync(partPath).size;
  if (size < 1000) throw new Error(`分段过小: ${partName} (${size}B)`);
  bodies.push(stripHeader(readBookText(partPath)));
  fs.unlinkSync(partPath);
  start = end + 1;
}

const header = `《${title}》  作者：${author}\n${SOURCE_SHARE_LINE}\n\n\n`;
const merged = header + bodies.join('\n');
const maxChapter = findMaxChapter(merged);
if (!maxChapter) throw new Error('未识别到章节号');

const filename = buildBookFilename(Number(id), title, maxChapter);
const outPath = getBookPath(root, filename);
const head = merged.slice(0, 120);
if (!/《.+》/.test(head) || !/第\d+章/.test(merged.slice(0, 5000))) {
  throw new Error(`合并后仍疑似乱码: ${head}`);
}

const booksDir = path.join(root, 'books');
for (const name of fs.readdirSync(booksDir)) {
  if (name.startsWith(`${id}_`) && name.endsWith('.txt') && name !== filename) {
    fs.unlinkSync(path.join(booksDir, name));
    console.log(`删除旧文件: ${name}`);
  }
}

fs.writeFileSync(outPath, merged, 'utf8');
console.log(`已写入 ${outPath} (${merged.length} 字符, 1-${maxChapter}章)`);
console.log(merged.slice(0, 80).replace(/\n/g, ' '));
