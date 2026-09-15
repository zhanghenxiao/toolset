/**
 * 书籍 TXT 扁平路径约定：books/{id}_{书名}1-{章节}章.txt
 * jcxs.org 来源 id 以 s 前缀区分，如 s52266
 */
const fs = require('fs');
const path = require('path');

const BOOK_FILE_RE = /^((?:s\d+|\d+))_(.+?)1-(\d+)章\.txt$/;
const JCXS_ID_RE = /^s\d+$/;

function isJcxsId(id) {
  return JCXS_ID_RE.test(String(id));
}

function jcxsLocalId(siteBookId) {
  return `s${siteBookId}`;
}

function parseBookId(raw) {
  const s = String(raw);
  return isJcxsId(s) ? s : Number(s);
}

function compareBookIds(a, b) {
  const sa = String(a);
  const sb = String(b);
  const aj = isJcxsId(sa);
  const bj = isJcxsId(sb);
  if (aj !== bj) return aj ? 1 : -1;
  if (aj) return sa.localeCompare(sb);
  return Number(sa) - Number(sb);
}
const LEGACY_BOOK_FILE_RE = /^(.+?)1-(\d+)章\.txt$/;
/** 旧格式（无下划线）：{id}{书名}1-{章节}章.txt */
const LEGACY_FLAT_FILE_RE = /^(\d+)(.+?)1-(\d+)章\.txt$/;

function sanitizeBookTitle(title) {
  return String(title)
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildBookFilename(id, title, maxChapter) {
  return `${id}_${sanitizeBookTitle(title)}1-${maxChapter}章.txt`;
}

function buildBookDownloadUrl(filename) {
  return `/books/${filename}`;
}

function deqixsCoverUrl(id) {
  const n = Number(id);
  const shard = Math.floor(n / 1000);
  return `https://www.deqixs.org/files/article/image/${shard}/${n}/${n}s.jpg`;
}

function parseNewFormat(filename) {
  const m = filename.match(BOOK_FILE_RE);
  if (!m) return null;
  const id = parseBookId(m[1]);
  const title = m[2];
  const maxChapter = Number(m[3]);
  return {
    id,
    title,
    maxChapter,
    filename: buildBookFilename(id, title, maxChapter),
  };
}

function hasCoverForId(coverDir, id) {
  if (!coverDir) return false;
  if (id === 145) {
    return fs.existsSync(path.join(coverDir, 'wudao-154.jpg'));
  }
  return fs.existsSync(path.join(coverDir, `book-${id}.jpg`));
}

/** 解析旧格式无下划线文件名（迁移用） */
function resolveLegacyFlatMeta(filename, coverDir) {
  if (filename.includes('_') && BOOK_FILE_RE.test(filename)) {
    return parseNewFormat(filename);
  }

  const legacy = filename.match(LEGACY_BOOK_FILE_RE);
  if (!legacy) return null;

  const body = legacy[1];
  const maxChapter = Number(legacy[2]);

  if (coverDir) {
    for (let len = Math.min(3, body.length); len >= 1; len--) {
      const idPart = body.slice(0, len);
      if (!/^\d+$/.test(idPart)) continue;
      const id = Number(idPart);
      const title = body.slice(len);
      if (!title) continue;
      if (hasCoverForId(coverDir, id)) {
        return {
          id,
          title,
          maxChapter,
          filename: buildBookFilename(id, title, maxChapter),
        };
      }
    }
  }

  const m = filename.match(LEGACY_FLAT_FILE_RE);
  if (!m) return null;
  const id = Number(m[1]);
  const title = m[2];
  return {
    id,
    title,
    maxChapter: Number(m[3]),
    filename: buildBookFilename(id, title, Number(m[3])),
  };
}

function resolveFlatBookMeta(filename, coverDir) {
  const newFmt = parseNewFormat(filename);
  if (newFmt) return newFmt;
  return resolveLegacyFlatMeta(filename, coverDir);
}

function getCoverDirFromBooksRoot(booksRoot) {
  return path.join(path.dirname(booksRoot), 'csdn/src/assets/images/books');
}

function parseBookFilename(filename, coverDir) {
  return resolveFlatBookMeta(filename, coverDir);
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
  const flat = parseNewFormat(legacyFilename);
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

function getWorkDir(rootDir, id) {
  return path.join(rootDir, 'books', '_work', String(id));
}

function discoverBooks(booksRoot) {
  const result = [];
  if (!fs.existsSync(booksRoot)) return result;
  const coverDir = getCoverDirFromBooksRoot(booksRoot);

  for (const name of fs.readdirSync(booksRoot)) {
    const fp = path.join(booksRoot, name);
    const stat = fs.statSync(fp);

    if (stat.isFile() && isBookTxtName(name)) {
      const parsed = resolveFlatBookMeta(name, coverDir);
      if (parsed) {
        result.push({ ...parsed, filePath: fp, legacyFilename: name });
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
  for (const book of result.sort((a, b) => compareBookIds(a.id, b.id))) {
    const prev = byId.get(book.id);
    if (!prev || book.maxChapter > prev.maxChapter) {
      byId.set(book.id, book);
    }
  }
  return [...byId.values()].sort((a, b) => compareBookIds(a.id, b.id));
}

function discoverBookTxtTargets(rootDir) {
  const targets = [];
  const extra = path.join(rootDir, 'csdn/src/assets/images/books/book-154-1-145.txt');
  if (fs.existsSync(extra)) targets.push(extra);

  for (const book of discoverBooks(path.join(rootDir, 'books'))) {
    targets.push(book.filePath);
  }
  return targets;
}

module.exports = {
  BOOK_FILE_RE,
  JCXS_ID_RE,
  LEGACY_BOOK_FILE_RE,
  LEGACY_FLAT_FILE_RE,
  isJcxsId,
  jcxsLocalId,
  parseBookId,
  compareBookIds,
  buildBookFilename,
  buildBookDownloadUrl,
  deqixsCoverUrl,
  parseNewFormat,
  resolveFlatBookMeta,
  resolveLegacyFlatMeta,
  getCoverDirFromBooksRoot,
  parseBookFilename,
  parseLegacyBookFilename,
  toFlatFilename,
  isBookTxtName,
  getBookPath,
  getWorkDir,
  discoverBooks,
  discoverBookTxtTargets,
};
