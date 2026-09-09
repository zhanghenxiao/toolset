/**
 * 书籍 TXT 扁平路径约定：books/{id}{书名}1-{章节}章.txt
 */
const fs = require('fs');
const path = require('path');

const BOOK_FILE_RE = /^(\d+)(.+?)1-(\d+)章\.txt$/;
const LEGACY_BOOK_FILE_RE = /^(.+?)1-(\d+)章\.txt$/;

/** 书名以数字开头时，扁平文件名无法从前缀解析 id */
const FILENAME_ID_OVERRIDES = {
  '1984从破产川菜馆开始1-18699章.txt': 97,
  '1984：从破产川菜馆开始1-18699章.txt': 97,
  '971984：从破产川菜馆开始1-18699章.txt': 97,
};

function buildBookFilename(id, title, maxChapter) {
  return `${id}${title}1-${maxChapter}章.txt`;
}

function buildBookDownloadUrl(filename) {
  return `/books/${filename}`;
}

function parseWithKnownId(filename, id) {
  let rest = filename;
  const prefix = String(id);
  if (rest.startsWith(prefix)) rest = rest.slice(prefix.length);
  const legacy = parseLegacyBookFilename(rest, id);
  if (!legacy) return null;
  return {
    ...legacy,
    filename: buildBookFilename(id, legacy.title, legacy.maxChapter),
  };
}

function parseBookFilename(filename) {
  if (FILENAME_ID_OVERRIDES[filename]) {
    return parseWithKnownId(filename, FILENAME_ID_OVERRIDES[filename]);
  }

  const m = filename.match(BOOK_FILE_RE);
  if (!m) return null;

  const id = Number(m[1]);
  const title = m[2];
  const maxChapter = Number(m[3]);
  return {
    id,
    title,
    maxChapter,
    filename: buildBookFilename(id, title, maxChapter),
  };
}

function parseLegacyBookFilename(filename, id) {
  const m = filename.match(LEGACY_BOOK_FILE_RE);
  if (!m) return null;
  return {
    id,
    title: m[1],
    maxChapter: Number(m[2]),
    filename,
  };
}

function toFlatFilename(id, legacyFilename) {
  const flat = parseBookFilename(legacyFilename);
  if (flat) return legacyFilename;
  const legacy = parseLegacyBookFilename(legacyFilename, id);
  if (!legacy) return null;
  return buildBookFilename(id, legacy.title, legacy.maxChapter);
}

function isBookTxtName(name) {
  return name.endsWith('.txt')
    && !name.startsWith('part')
    && !name.startsWith('_')
    && !name.includes('towan(');
}

function getBookPath(rootDir, filename) {
  return path.join(rootDir, 'books', filename);
}

function getPublicBookPath(rootDir, filename) {
  return path.join(rootDir, 'csdn/public/books', filename);
}

function getWorkDir(rootDir, id) {
  return path.join(rootDir, 'books', '_work', String(id));
}

function syncToPublic(rootDir, filename) {
  const src = getBookPath(rootDir, filename);
  if (!fs.existsSync(src)) return false;
  const pubRoot = path.join(rootDir, 'csdn/public/books');
  fs.mkdirSync(pubRoot, { recursive: true });
  const dst = getPublicBookPath(rootDir, filename);
  fs.copyFileSync(src, dst);
  return true;
}

function discoverBooks(booksRoot) {
  const result = [];
  if (!fs.existsSync(booksRoot)) return result;

  for (const name of fs.readdirSync(booksRoot)) {
    const fp = path.join(booksRoot, name);
    const stat = fs.statSync(fp);

    if (stat.isFile() && isBookTxtName(name)) {
      const overrideId = FILENAME_ID_OVERRIDES[name];
      if (overrideId) {
        const parsed = parseWithKnownId(name, overrideId);
        if (parsed) {
          result.push({ ...parsed, filePath: fp, legacyFilename: name });
        }
        continue;
      }

      const parsed = parseBookFilename(name);
      if (parsed) {
        result.push({ ...parsed, filePath: fp });
      }
      continue;
    }

    if (!stat.isDirectory() || !/^\d+$/.test(name) || name === '_work') continue;
    const id = Number(name);
    for (const file of fs.readdirSync(fp)) {
      if (!isBookTxtName(file)) continue;
      const flatName = toFlatFilename(id, file);
      if (!flatName) continue;
      const legacy = parseLegacyBookFilename(file, id);
      result.push({
        id,
        title: legacy?.title || flatName,
        maxChapter: legacy?.maxChapter || 0,
        filename: flatName,
        filePath: path.join(fp, file),
        legacyFilename: file,
      });
    }
  }

  const byId = new Map();
  for (const book of result.sort((a, b) => a.id - b.id)) {
    if (!byId.has(book.id)) byId.set(book.id, book);
  }
  return [...byId.values()];
}

function discoverBookTxtTargets(rootDir) {
  const targets = [];
  const extra = path.join(rootDir, 'csdn/src/assets/images/books/book-154-1-145.txt');
  if (fs.existsSync(extra)) targets.push(extra);

  for (const book of discoverBooks(path.join(rootDir, 'books'))) {
    targets.push(book.filePath);
    const pub = getPublicBookPath(rootDir, book.filename);
    if (fs.existsSync(pub)) targets.push(pub);
  }
  return targets;
}

module.exports = {
  BOOK_FILE_RE,
  LEGACY_BOOK_FILE_RE,
  buildBookFilename,
  buildBookDownloadUrl,
  parseBookFilename,
  parseLegacyBookFilename,
  toFlatFilename,
  isBookTxtName,
  getBookPath,
  getPublicBookPath,
  getWorkDir,
  syncToPublic,
  discoverBooks,
  discoverBookTxtTargets,
  FILENAME_ID_OVERRIDES,
};
