/* ---------------- 章节号：阿拉伯 / 全角 / 汉字数字 ---------------- */

const CN_DIGIT = {
  零: 0, 〇: 0, 一: 1, 壹: 1, 二: 2, 两: 2, 贰: 2, 三: 3, 叁: 3, 四: 4, 肆: 4,
  五: 5, 伍: 5, 六: 6, 陆: 6, 七: 7, 柒: 7, 八: 8, 捌: 8, 九: 9, 玖: 9,
};
const CN_UNIT = { 十: 10, 拾: 10, 百: 100, 佰: 100, 千: 1000, 仟: 1000 };
// 正则字符集：半角/全角阿拉伯数字 + 常见汉字数字
const NUM_CLASS = '0-9０-９零〇一二三四五六七八九十百千万两壹贰叁肆伍陆柒捌玖拾佰仟';

/** 汉字数字 → 阿拉伯数字（支持 十/百/千/万，如 一百零八 → 108） */
function cnToArabic(text) {
  let total = 0;
  let section = 0;
  let digit = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (CN_DIGIT[ch] !== undefined) {
      digit = CN_DIGIT[ch];
    } else if (CN_UNIT[ch]) {
      section += (digit || 1) * CN_UNIT[ch];
      digit = 0;
    } else if (ch === '万') {
      total += (section + digit) * 10000;
      section = 0;
      digit = 0;
    } else {
      return NaN;
    }
  }
  return total + section + digit;
}

/** 章节号文本 → 数字；无法识别返回 NaN */
function parseNumText(raw) {
  const s = String(raw || '')
    .replace(/[\s　]/g, '')
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
  if (!s) return NaN;
  if (/^\d+$/.test(s)) return Number(s);
  return cnToArabic(s);
}

// 两种合法标题：
//   1) 第38章 标题 / 第三十八章 标题 / 第 ３８ 章 标题（汉字数字、全角数字也支持）
//      节/回/卷仅在标题后有分隔符时才认，避免正文里的「第三回合…」被误判
//   2) 38.标题 / 38、标题 / 38 标题（纯数字编号式，如《太尊！》的「1.狐妖月见」）
const HEADER_PATTERNS = [
  `(?:^|\\n)([ \\t　]*)(第\\s*([${NUM_CLASS}]{1,12})\\s*(?:章|(?:[节回卷])(?=[\\s　、.．·:：\\-—_]|$))[^\\n]{0,80})`,
  `(?:^|\\n)([ \\t　]*)(([0-9０-９]{1,4})[.．、](?=[^\\d])[^\\n]{0,80})`,
];

/**
 * 从 TXT 正文解析章节（与站点书籍格式一致）
 * 兼容「第38章」「第三十八章」「第 ３８ 章」，以及「1.狐妖月见」「2.淬体术…」这类数字编号式标题。
 */
function parseChapters(text) {
  if (!text || !text.trim()) {
    return [{ title: '正文', content: text || '' }];
  }

  const hits = [];
  HEADER_PATTERNS.forEach((pattern, patternIndex) => {
    const headerRe = new RegExp(pattern, 'g');
    let m;
    while ((m = headerRe.exec(text)) !== null) {
      const title = m[2].trim();
      if (!title || title.length > 80) continue;
      // 只对第二条「数字编号式」规则做排版过滤，别误伤「第39章」
      if (patternIndex === 1) {
        // 纯数字编号式：正文里的编号列表也可能长这样，用「前后排版」排除误判
        // 1) 标题最多 30 字   2) 上一行必须为空行或文件开头   3) 下一行不能也是编号行
        if (title.replace(/^\d+\s*[.．、]\s*/, '').length > 30) continue;
        const lineStart = m.index + (m[0].startsWith('\n') ? 1 : 0);
        if (lineStart > 0) {
          const before = text.slice(0, lineStart - 1);
          const p = before.lastIndexOf('\n');
          const prevLine = p < 0 ? '' : before.slice(p + 1);
          if (prevLine.trim()) continue;
        }
        const rest = text.slice(lineStart + title.length);
        const nextEnd = rest.indexOf('\n');
        const nextLine = nextEnd < 0 ? '' : rest.slice(0, nextEnd).trim();
        if (/^\d{1,4}\s*[.．、]\s*\S/.test(nextLine)) continue;
      }
      let num = parseNumText(m[3]);
      // 解析不出数字时按顺序编号，保证 num 可用
      if (!isFinite(num) || num <= 0) num = hits.length + 1;
      hits.push({ index: m.index + (m[0].startsWith('\n') ? 1 : 0), title, num });
    }
  });
  // 两套正则分别扫描，按在正文中的位置合并、排序
  hits.sort((a, b) => a.index - b.index);
  const merged = [];
  hits.forEach((h) => {
    if (!merged.length || merged[merged.length - 1].index !== h.index) merged.push(h);
  });

  if (merged.length === 0) {
    return [{ title: '正文', content: text.trim() }];
  }

  const chapters = [];
  for (let i = 0; i < merged.length; i++) {
    const start = merged[i].index;
    const end = i + 1 < merged.length ? merged[i + 1].index : text.length;
    chapters.push({
      num: merged[i].num,
      title: merged[i].title,
      content: text.slice(start, end).trim(),
    });
  }
  return chapters;
}

/** 从 latestChapter 字段解析章节号，用于定位阅读进度（同样兼容汉字章节号） */
function chapterIndexFromLatest(latestChapter, chapters) {
  if (!latestChapter || !chapters.length) return 0;
  const m = String(latestChapter).match(
    new RegExp(`第\\s*([${NUM_CLASS}]{1,12})\\s*[章回节卷]`),
  );
  if (!m) return chapters.length - 1;
  const num = parseNumText(m[1]);
  if (!isFinite(num)) return chapters.length - 1;
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
