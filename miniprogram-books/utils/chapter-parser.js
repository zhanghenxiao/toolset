/**
 * 从 TXT 正文解析章节（与站点书籍格式一致）
 */
function parseChapters(text) {
  if (!text || !text.trim()) {
    return [{ title: '正文', content: text || '' }];
  }

  const headerRe = /(?:^|\n)([ \t　]*)(第(\d+)章[^\n]{0,80})/g;
  const hits = [];
  let m;
  while ((m = headerRe.exec(text)) !== null) {
    const title = m[2].trim();
    if (title.length > 80) continue;
    hits.push({ index: m.index + (m[0].startsWith('\n') ? 1 : 0), title, num: Number(m[3]) });
  }

  if (hits.length === 0) {
    return [{ title: '正文', content: text.trim() }];
  }

  const chapters = [];
  for (let i = 0; i < hits.length; i++) {
    const start = hits[i].index;
    const end = i + 1 < hits.length ? hits[i + 1].index : text.length;
    chapters.push({
      num: hits[i].num,
      title: hits[i].title,
      content: text.slice(start, end).trim(),
    });
  }
  return chapters;
}

/** 从 latestChapter 字段解析章节号，用于定位阅读进度 */
function chapterIndexFromLatest(latestChapter, chapters) {
  if (!latestChapter || !chapters.length) return 0;
  const m = latestChapter.match(/第(\d+)章/);
  if (!m) return chapters.length - 1;
  const num = Number(m[1]);
  const idx = chapters.findIndex((c) => c.num === num);
  return idx >= 0 ? idx : Math.min(chapters.length - 1, Math.max(0, num - 1));
}

/**
 * 把一章正文按「每页可容纳字数」切成多页（用于左右翻页模式）
 * 优先按整行（\n）切分，避免把一行截断；超长行再按字数硬切。
 * @param {string} text 章节正文
 * @param {number} charsPerPage 每页可容纳字数
 * @returns {string[]} 分页后的正文数组
 */
function paginateContent(text, charsPerPage) {
  const src = String(text || '');
  if (!src) return [''];
  const limit = Math.max(50, Math.floor(charsPerPage) || 50);
  const pages = [];
  let buf = '';

  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // 单行就超过一页：先落盘已有内容，再按字数硬切
    if (line.length > limit) {
      if (buf) {
        pages.push(buf);
        buf = '';
      }
      while (line.length > limit) {
        pages.push(line.slice(0, limit));
        line = line.slice(limit);
      }
      buf = line;
      continue;
    }

    const cost = line.length + (buf ? 1 : 0); // +1 计换行
    if (buf && buf.length + cost > limit) {
      pages.push(buf);
      buf = line;
    } else {
      buf = buf ? buf + '\n' + line : line;
    }
  }
  if (buf) pages.push(buf);
  return pages.length ? pages : [''];
}

module.exports = {
  parseChapters,
  chapterIndexFromLatest,
  paginateContent,
};
