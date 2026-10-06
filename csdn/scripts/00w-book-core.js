/**
 * 零零文学 00w.org 解析（bxwx_{siteBookId}/ 目录）
 */
const https = require('https');

const BASE = 'https://www.00w.org';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0';

let cookie = '';

function decodeResponseBuffer(buf) {
  const utf8 = buf.toString('utf8');
  const sample = utf8.slice(0, 8000);
  if (/charset=["']?(?:gbk|gb2312|gb18030)/i.test(sample)) {
    try {
      const gb = new TextDecoder('gb18030').decode(buf);
      if (/[\u4e00-\u9fff]{8,}/.test(gb)) return gb;
    } catch {
      // ignore
    }
  }
  if (/[\u4e00-\u9fff]{8,}/.test(sample)) return utf8;
  try {
    const gb = new TextDecoder('gb18030').decode(buf);
    if (/[\u4e00-\u9fff]{8,}/.test(gb.slice(0, 8000))) return gb;
  } catch {
    // ignore
  }
  return utf8;
}

function fetchBuffer(url, useCookie = cookie) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Cookie: useCookie,
        Referer: BASE,
      },
    }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        if (res.statusCode >= 400) reject(new Error(`HTTP ${res.statusCode}: ${url}`));
        else resolve(Buffer.concat(chunks));
      });
    }).on('error', reject);
  });
}

async function getHtml(url) {
  let buf = await fetchBuffer(url);
  let html = decodeResponseBuffer(buf);
  const cookieMatch = html.match(/document\.cookie = "([^"]+)"/);
  if (cookieMatch) {
    cookie = cookieMatch[1].split(';')[0];
    buf = await fetchBuffer(url, cookie);
    html = decodeResponseBuffer(buf);
  }
  return html;
}

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
  const m = s.match(/\/bxwx_(\d+)(?:\/|$)/i);
  if (!m) return null;
  return { siteBookId: m[1] };
}

function parseBookMeta(html, siteBookId) {
  const title = html.match(/<title>([^<(]+)/)?.[1]?.trim()
    || html.match(/property="og:title" content="([^"]+)"/)?.[1]?.trim();
  const author = html.match(/lastread\.set\([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*'([^']+)'/)?.[1]?.trim()
    || html.match(/<title>[^<(]+\(([^)]+)\)/)?.[1]?.trim()
    || html.match(/作者[：:]\s*<a[^>]*>([^<]+)</)?.[1]?.trim()
    || '';
  const latestChapter = html.match(/最新章节：<a[^>]*>([^<]+)</)?.[1]?.trim() || '';
  const status = /已完结|完結|全文完/.test(html) ? '已完结' : '连载中';
  let excerpt = html.match(/<meta name="description" content="([^"]+)"/)?.[1] || '';
  excerpt = decodeHtml(excerpt.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
    .slice(0, 200);
  const date = html.match(/最后更新[：:]\s*(\d{4}-\d{2}-\d{2})/)?.[1]
    || new Date().toISOString().slice(0, 10);
  const category = '言情';
  return { title, author, category, status, latestChapter, excerpt, date, coverPath: `/img/${siteBookId}.jpg` };
}

function parseCatalog(html, siteBookId) {
  const prefix = `/bxwx_${siteBookId}/`;
  const re = new RegExp(`href="(${prefix.replace(/\//g, '\\/')}(\\d+)\\.html)"[^>]*>([^<]+)<`, 'g');
  const map = new Map();
  let m;
  while ((m = re.exec(html)) !== null) {
    if (!map.has(m[2])) {
      map.set(m[2], { id: m[2], href: m[1], title: decodeHtml(m[3].trim()) });
    }
  }
  return [...map.values()].sort((a, b) => Number(a.id) - Number(b.id));
}

function extractChapterText(html) {
  const block = html.match(/<div class="word_read">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i)?.[1] || '';
  const parts = [];
  const pRe = /<p>([\s\S]*?)<\/p>/gi;
  let p;
  while ((p = pRe.exec(block)) !== null) {
    const line = decodeHtml(p[1].replace(/<[^>]+>/g, '').trim());
    if (line) parts.push(line);
  }
  return parts.join('\n\n').trim();
}

function parseChapterTitle(html) {
  const raw = html.match(/<div class="word_read">[\s\S]*?<h3>([^<]+)<\/h3>/i)?.[1] || '';
  return decodeHtml(raw.replace(/（第\d+页）/g, '').trim());
}

function parseNextHref(html) {
  return html.match(/<a href="([^"]+)">下一章<\/a>/i)?.[1] || '';
}

module.exports = {
  BASE,
  USER_AGENT,
  decodeHtml,
  decodeResponseBuffer,
  getHtml,
  parseBookPath,
  parseBookMeta,
  parseCatalog,
  extractChapterText,
  parseChapterTitle,
  parseNextHref,
};
