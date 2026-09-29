/**
 * 小原文学网 min-yuan.com 解析与路径工具（v1/v2 共用）
 */
const BASE = 'https://www.min-yuan.com';

function decodeHtml(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function parseBookPath(input) {
  const s = String(input);
  const m = s.match(/\/txt\/([a-z0-9]+)(?:\/|$|\d)/i);
  if (!m) return null;
  return { slug: m[1].toLowerCase() };
}

function parseBookMeta(html) {
  const title = html.match(/property="og:novel:book_name" content="([^"]+)"/)?.[1]?.trim()
    || html.match(/property="og:title" content="([^"]+)"/)?.[1]?.trim();
  const author = html.match(/property="og:novel:author" content="([^"]+)"/)?.[1]?.trim();
  const category = (html.match(/property="og:novel:category" content="([^"]+)"/)?.[1] || '其他')
    .replace(/小说$/, '');
  const statusRaw = html.match(/property="og:novel:status" content="([^"]+)"/)?.[1] || '';
  const status = /完/.test(statusRaw) ? '已完结' : '连载中';
  const latestChapter = html.match(/property="og:novel:latest_chapter_name" content="([^"]+)"/)?.[1] || '';
  let excerpt = html.match(/property="og:description" content="([^"]+)"/)?.[1] || '';
  excerpt = decodeHtml(excerpt.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
    .slice(0, 200);
  const date = html.match(/property="og:novel:update_time" content="([^"]+)"/)?.[1]?.slice(0, 10)
    || new Date().toISOString().slice(0, 10);
  return { title, author, category, status, latestChapter, excerpt, date };
}

function parseLatestChapterNum(html, slug) {
  const ogUrl = html.match(/property="og:novel:latest_chapter_url" content="[^"]*\/(\d+)\.html"/i)?.[1];
  if (ogUrl) return Number(ogUrl);
  const nums = [...html.matchAll(new RegExp(`href="/txt/${slug}/(\\d+)\\.html"`, 'gi'))].map((match) => Number(match[1]));
  return nums.length ? Math.max(...nums) : 0;
}

function parseCatalog(html, slug) {
  const byNum = new Map();
  const re = new RegExp(`href="/txt/${slug}/(\\d+)\\.html"[^>]*title="([^"]+)"`, 'gi');
  let m;
  while ((m = re.exec(html)) !== null) {
    const num = Number(m[1]);
    const name = decodeHtml(m[2].trim());
    if (!num || byNum.has(num)) continue;
    byNum.set(num, { num, name, href: `/txt/${slug}/${num}.html` });
  }

  const maxNum = parseLatestChapterNum(html, slug);
  if (maxNum > 0) {
    for (let n = 1; n <= maxNum; n += 1) {
      if (!byNum.has(n)) {
        byNum.set(n, { num: n, name: `第${n}章`, href: `/txt/${slug}/${n}.html` });
      }
    }
  }

  return [...byNum.values()].sort((a, b) => a.num - b.num);
}

function extractBooktxt(html) {
  const block = html.match(/id="booktxt"[^>]*>([\s\S]*?)<\/div>/i)?.[1] || '';
  let text = block
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<[^>]+>/g, '');
  text = decodeHtml(text).replace(/\u3000/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  if (/正在转码中/.test(text)) return '';
  return text;
}

function parseNextHref(html) {
  return html.match(/rel="next" href="([^"]+)"/)?.[1] || '';
}

module.exports = {
  BASE,
  decodeHtml,
  parseBookPath,
  parseBookMeta,
  parseCatalog,
  extractBooktxt,
  parseNextHref,
};
