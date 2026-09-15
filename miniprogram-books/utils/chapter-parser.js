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

module.exports = {
  parseChapters,
  chapterIndexFromLatest,
};
