const fs = require('fs');
const path = require('path');
const { buildBookFilename, getBookPath, getWorkDir, syncToPublic } = require('./book-paths');

const root = path.resolve(__dirname, '../..');
const workDir = getWorkDir(root, 235);
const legacyDir = path.join(root, 'books/235');

function readBookText(filePath) {
  const buffer = fs.readFileSync(filePath);
  const utf8 = buffer.toString('utf8');
  if (!utf8.includes('\uFFFD')) {
    return utf8;
  }
  return new TextDecoder('gb18030').decode(buffer);
}

function stripHeader(text) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => /^ 第.+章/.test(line));
  return start === -1 ? text : lines.slice(start).join('\n');
}

const sourceDir = fs.existsSync(workDir) ? workDir : legacyDir;
const part1 = readBookText(path.join(sourceDir, 'part1-1-500.txt'));
const part2 = readBookText(path.join(sourceDir, 'part2-501-837.txt'));

const header = '《我命令你成为密教教主》  作者：刀如故\n章节范围：1-837章\n\n\n';
const merged = header + stripHeader(part1) + '\n' + stripHeader(part2);

const filename = buildBookFilename(235, '我命令你成为密教教主', 835);
const out = getBookPath(root, filename);
fs.writeFileSync(out, merged, 'utf8');
syncToPublic(root, filename);
console.log(`Merged ${merged.length} chars -> ${out}`);
