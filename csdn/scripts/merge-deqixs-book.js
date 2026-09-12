/**
 * 合并得奇小说网分段 TXT（GBK → UTF-8）
 * 用法: node merge-deqixs-book.js <localId> <书名> <作者> <part1> <part2> ...
 */
const fs = require('fs');
const path = require('path');
const { getWorkDir } = require('./book-paths');

const [, , localId, title, author, ...partFiles] = process.argv;
if (!localId || !title || !author || partFiles.length === 0) {
  console.error('用法: node merge-deqixs-book.js <localId> <书名> <作者> <part1.txt> [part2.txt ...]');
  process.exit(1);
}

const root = path.resolve(__dirname, '../..');
const workDir = getWorkDir(root, localId);
const legacyDir = path.join(root, 'books', localId);

const SOURCE_SHARE_LINE = '更多书源分享，访问网址 https://toolset.site';

function readBookText(filePath) {
  const buffer = fs.readFileSync(filePath);
  const utf8 = buffer.toString('utf8');
  const sample = utf8.slice(0, 4000);
  if (!utf8.includes('\uFFFD') && /《|第\d+章|作者：/.test(sample)) return utf8;
  return new TextDecoder('gb18030').decode(buffer);
}

function stripHeader(text) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => /^ 第.+章/.test(line));
  return start === -1 ? text : lines.slice(start).join('\n');
}

const bodies = partFiles.map((file) => {
  const candidates = [
    path.join(workDir, file),
    path.join(legacyDir, file),
    path.isAbsolute(file) ? file : path.join(root, file),
  ];
  const filePath = candidates.find((p) => fs.existsSync(p));
  if (!filePath) {
    console.error(`文件不存在: ${file}`);
    process.exit(1);
  }
  return stripHeader(readBookText(filePath));
});

const header = `《${title}》  作者：${author}\n${SOURCE_SHARE_LINE}\n\n\n`;
const merged = header + bodies.join('\n');

fs.mkdirSync(workDir, { recursive: true });
const tempOut = path.join(workDir, '_merged-temp.txt');
fs.writeFileSync(tempOut, merged, 'utf8');
console.log(`Merged ${merged.length} chars -> ${tempOut}`);
