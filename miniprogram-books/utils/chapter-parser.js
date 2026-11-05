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

/**
 * 从 TXT 正文解析章节（与站点书籍格式一致）
 * 兼容「第38章」「第三十八章」「第 ３８ 章」三种写法；
 * 节/回/卷仅在标题后有分隔符时才认，避免正文里的「第三回合…」被误判。
 */
function parseChapters(text) {
  if (!text || !text.trim()) {
    return [{ title: '正文', content: text || '' }];
  }

  const headerRe = new RegExp(
    `(?:^|\\n)([ \\t　]*)(第\\s*([${NUM_CLASS}]{1,12})\\s*(?:章|(?:[节回卷])(?=[\\s　、.．·:：\\-—_]|$))[^\\n]{0,80})`,
    'g',
  );
  const hits = [];
  let m;
  let prevNum = NaN;
  while ((m = headerRe.exec(text)) !== null) {
    const title = m[2].trim();
    if (!title || title.length > 80) continue;
    let num = parseNumText(m[3]);
    // 解析不出数字时按上一章顺延，保证 num 单调、进度定位可用
    if (!isFinite(num) || num <= 0) num = isFinite(prevNum) ? prevNum + 1 : hits.length + 1;
    prevNum = num;
    hits.push({ index: m.index + (m[0].startsWith('\n') ? 1 : 0), title, num });
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
