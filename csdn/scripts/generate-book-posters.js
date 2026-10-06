/**
 * 生成书籍分享海报（竖版 SVG，零第三方依赖）
 *
 * 海报内容：封面 + 书名/作者/分类/状态/章节 + 简介 + 二维码 + 数维探索推广语
 *
 * 用法:
 *   node csdn/scripts/generate-book-posters.js                 # 默认前 8 本做样张
 *   node csdn/scripts/generate-book-posters.js --limit 10
 *   node csdn/scripts/generate-book-posters.js --ids m_aa,m_ab
 *   node csdn/scripts/generate-book-posters.js --all           # 全部书籍
 *   node csdn/scripts/generate-book-posters.js --prefix m_     # 只处理 m_ 批次
 *   node csdn/scripts/generate-book-posters.js --qr-mode book  # 二维码指向本书下载页
 *   node csdn/scripts/generate-book-posters.js --out posters   # 自定义输出目录
 *   node csdn/scripts/generate-book-posters.js --link          # 封面用相对路径引用（SVG 体积更小）
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '../..');
const coverDir = path.join(root, 'csdn/src/assets/images/books');
const booksDataPath = path.join(root, 'csdn/src/data/booksData.js');
const cacheDir = path.join(__dirname, '.cache', 'qr');

const SITE_HOST = 'https://toolset.site';
const DEFAULT_QR_URL = `${SITE_HOST}/books`;
const PROMO_LINES = [
  '小程序搜：数维探索',
  '官方反馈群：1041698859',
  `官网：${SITE_HOST}`,
];

const W = 750;
const H = 1334;

const CATEGORY_COLORS = {
  玄幻: ['#6d5efc', '#2b1d6b'],
  奇幻: ['#7c5cff', '#2b1d6b'],
  仙侠: ['#12b886', '#0a3d33'],
  武侠: ['#20c997', '#0a3d33'],
  都市: ['#ff7a45', '#5c2311'],
  现实: ['#ff922b', '#5c2311'],
  历史: ['#f59f00', '#5c3a00'],
  军事: ['#e8590c', '#5c3a00'],
  科幻: ['#4dabf7', '#123a5c'],
  灵异: ['#845ef7', '#2b1d6b'],
  游戏: ['#e64980', '#5c1123'],
  竞技: ['#f06595', '#5c1123'],
  轻小说: ['#ffa8d4', '#5c1123'],
  悬疑: ['#495057', '#111418'],
  其他: ['#5c7cfa', '#1b2559'],
};
const DEFAULT_COLORS = ['#5c7cfa', '#1b2559'];

// ─────────────────────────── 参数解析
function parseArgs(argv) {
  const opts = {
    limit: 8,
    ids: null,
    all: false,
    prefix: 'm_',
    qrMode: 'site',
    out: path.join(root, 'book-posters'),
    link: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === '--limit') opts.limit = Number(next());
    else if (a === '--ids') opts.ids = String(next()).split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--all') opts.all = true;
    else if (a === '--prefix') opts.prefix = String(next());
    else if (a === '--qr-mode') opts.qrMode = String(next());
    else if (a === '--out') opts.out = path.resolve(root, String(next()));
    else if (a === '--link') opts.link = true;
  }
  return opts;
}

// ─────────────────────────── 书籍元数据
const ID_OK_RE = /^(?:l_\d+(?:__\d+)?|u_[a-z0-9]+|m_[a-z0-9]+|[xs]\d+|\d+)$/i;
const ENTRY_RE = /id:\s*"([^"]+)"[\s\S]{0,200}?title:\s*"([^"]*)"[\s\S]{0,200}?author:\s*"([^"]*)"[\s\S]{0,200}?category:\s*"([^"]*)"[\s\S]{0,200}?status:\s*"([^"]*)"[\s\S]{0,200}?chapters:\s*"([^"]*)"[\s\S]{0,400}?excerpt:\s*"((?:[^"\\]|\\.)*)"[\s\S]{0,600}?downloadUrl:\s*"([^"]*)"/g;

function unescapeJsString(s) {
  try {
    return JSON.parse(`"${s}"`);
  } catch {
    return s;
  }
}

function loadBooks() {
  if (!fs.existsSync(booksDataPath)) {
    console.error('未找到书籍数据:', booksDataPath);
    process.exit(1);
  }
  const text = fs.readFileSync(booksDataPath, 'utf8');
  const books = [];
  const seen = new Set();
  let m;
  ENTRY_RE.lastIndex = 0;
  while ((m = ENTRY_RE.exec(text)) !== null) {
    const id = m[1];
    if (!ID_OK_RE.test(id) || seen.has(id)) continue;
    seen.add(id);
    books.push({
      id,
      title: unescapeJsString(m[2]),
      author: unescapeJsString(m[3]),
      category: unescapeJsString(m[4]),
      status: unescapeJsString(m[5]),
      chapters: unescapeJsString(m[6]),
      excerpt: unescapeJsString(m[7]),
      downloadUrl: unescapeJsString(m[8]),
    });
  }
  return books;
}

// ─────────────────────────── 文本排版
function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** 估算文本宽度：中日韩全角按 1em，其余按 0.55em */
function measureText(text, fontSize) {
  let w = 0;
  for (const ch of String(text)) {
    w += ch.codePointAt(0) > 0x2e80 ? fontSize : fontSize * 0.55;
  }
  return w;
}

function wrapText(text, maxWidth, fontSize, maxLines = 99) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  const lines = [];
  let line = '';
  for (const ch of clean) {
    if (measureText(line + ch, fontSize) > maxWidth && line) {
      lines.push(line);
      line = ch;
      if (lines.length === maxLines) break;
    } else {
      line += ch;
    }
  }
  if (lines.length < maxLines && line) lines.push(line);
  if (lines.length === maxLines) {
    let last = lines[maxLines - 1];
    while (last && measureText(`${last}…`, fontSize) > maxWidth) last = last.slice(0, -1);
    lines[maxLines - 1] = `${last}…`;
  }
  return lines;
}

// ─────────────────────────── 资源
function imageMime(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  return 'image/jpeg';
}

function coverHref(id, opts) {
  const file = path.join(coverDir, `book-${id}.jpg`);
  if (!fs.existsSync(file)) return null;
  if (opts.link) return `../csdn/src/assets/images/books/book-${id}.jpg`;
  const b64 = fs.readFileSync(file).toString('base64');
  return `data:${imageMime(file)};base64,${b64}`;
}

function qrDataUri(url) {
  fs.mkdirSync(cacheDir, { recursive: true });
  const cache = path.join(cacheDir, `${crypto.createHash('sha1').update(url).digest('hex')}.png`);
  if (!fs.existsSync(cache)) {
    const api = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    try {
      execFileSync('curl.exe', ['-sL', '-m', '20', '-o', cache, api], { stdio: 'pipe' });
    } catch {
      return null;
    }
  }
  const buf = fs.existsSync(cache) ? fs.readFileSync(cache) : Buffer.alloc(0);
  if (buf.length < 100 || buf[0] !== 0x89) return null;
  return `data:image/png;base64,${buf.toString('base64')}`;
}

// ─────────────────────────── SVG 拼装
function chip(x, y, text, fill, fontSize = 22) {
  const padX = 18;
  const w = measureText(text, fontSize) + padX * 2;
  const h = fontSize + 20;
  return `<g><rect x="${x}" y="${y}" width="${w.toFixed(1)}" height="${h}" rx="${h / 2}" fill="#ffffff" fill-opacity="0.16" stroke="#ffffff" stroke-opacity="0.35"/><text x="${(x + w / 2).toFixed(1)}" y="${(y + h / 2 + fontSize * 0.36).toFixed(1)}" text-anchor="middle" font-family="Microsoft YaHei, PingFang SC, Hiragino Sans GB, sans-serif" font-size="${fontSize}" fill="${fill}">${escapeXml(text)}</text></g>`;
}

function buildPosterSvg(book, opts, qr) {
  const [c1, c2] = CATEGORY_COLORS[book.category] || DEFAULT_COLORS;
  const coverUrl = coverHref(book.id, opts);
  const hasCover = Boolean(coverUrl);

  const coverW = 430;
  const coverH = 574;
  const coverX = (W - coverW) / 2;
  const coverY = 150;

  const titleLines = wrapText(book.title, W - 120, 44, 2);
  let y = coverY + coverH + 78;
  const titleSvg = titleLines
    .map((line, i) => `<text x="${W / 2}" y="${y + i * 58}" text-anchor="middle" font-family="Microsoft YaHei, PingFang SC, Hiragino Sans GB, sans-serif" font-size="44" font-weight="bold" fill="#ffffff">${escapeXml(line)}</text>`)
    .join('\n    ');
  y += Math.max(titleLines.length, 1) * 58 - 12;

  const authorLine = `<text x="${W / 2}" y="${y + 26}" text-anchor="middle" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="26" fill="#ffffff" fill-opacity="0.85">作者：${escapeXml(book.author || '未知')}</text>`;
  y += 66;

  const chips = [book.category, book.status, book.chapters].filter(Boolean);
  const chipSizes = chips.map((t) => measureText(t, 22) + 36 + 12);
  const chipsW = chipSizes.reduce((a, b) => a + b, 0) - (chipSizes.length ? 12 : 0);
  let cx = (W - chipsW) / 2;
  const chipsSvg = chips
    .map((t, i) => {
      const g = chip(cx, y + 6, t, '#ffffff');
      cx += chipSizes[i] + 12;
      return g;
    })
    .join('\n    ');
  y += 64;

  const excerptLines = wrapText(book.excerpt, W - 150, 24, 3);
  const excerptSvg = excerptLines
    .map((line, i) => `<text x="${W / 2}" y="${y + 24 + i * 38}" text-anchor="middle" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="24" fill="#ffffff" fill-opacity="0.72">${escapeXml(line)}</text>`)
    .join('\n    ');

  const cardX = 60;
  const cardY = 1108;
  const cardW = W - 120;
  const cardH = 168;

  const qrSize = 132;
  const qrX = cardX + 28;
  const qrY = cardY + 18;
  const qrSvg = qr
    ? `<image x="${qrX}" y="${qrY}" width="${qrSize}" height="${qrSize}" href="${qr}" />`
    : `<rect x="${qrX}" y="${qrY}" width="${qrSize}" height="${qrSize}" rx="10" fill="#f1f3f5"/><text x="${qrX + qrSize / 2}" y="${qrY + qrSize / 2 + 8}" text-anchor="middle" font-family="Microsoft YaHei, sans-serif" font-size="20" fill="#868e96">二维码</text>`;

  const textX = qrX + qrSize + 28;
  const promoSvg = [
    `<text x="${textX}" y="${cardY + 56}" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="28" font-weight="bold" fill="#1b2559">扫码免费看全书</text>`,
    ...PROMO_LINES.map(
      (line, i) => `<text x="${textX}" y="${cardY + 92 + i * 32}" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="23" fill="#495057">${escapeXml(line)}</text>`
    ),
  ].join('\n    ');

  const coverSvg = hasCover
    ? `<image x="${coverX}" y="${coverY}" width="${coverW}" height="${coverH}" preserveAspectRatio="xMidYMid slice" clip-path="url(#coverClip)" href="${coverUrl}" />`
    : `<rect x="${coverX}" y="${coverY}" width="${coverW}" height="${coverH}" rx="18" fill="#ffffff" fill-opacity="0.12"/><text x="${W / 2}" y="${coverY + coverH / 2}" text-anchor="middle" font-family="Microsoft YaHei, sans-serif" font-size="40" font-weight="bold" fill="#ffffff" fill-opacity="0.9">${escapeXml(wrapText(book.title, coverW - 60, 40, 3).join(''))}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <clipPath id="coverClip"><rect x="${coverX}" y="${coverY}" width="${coverW}" height="${coverH}" rx="18"/></clipPath>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="70" cy="120" r="150" fill="#ffffff" fill-opacity="0.06"/>
  <circle cx="${W - 40}" cy="${H - 120}" r="190" fill="#ffffff" fill-opacity="0.05"/>
  <text x="${W / 2}" y="96" text-anchor="middle" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="30" font-weight="bold" fill="#ffffff" fill-opacity="0.95">数维探索 · 精选书单</text>
  <g filter="url(#shadow)">
    ${coverSvg}
  </g>
  <rect x="${coverX}" y="${coverY}" width="${coverW}" height="${coverH}" rx="18" fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="3"/>
  ${titleSvg}
  ${authorLine}
  ${chipsSvg}
  ${excerptSvg}
  <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="20" fill="#ffffff" fill-opacity="0.96"/>
  ${qrSvg}
  ${promoSvg}
  <text x="${W / 2}" y="${H - 22}" text-anchor="middle" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="20" fill="#ffffff" fill-opacity="0.7">更多书源分享 · ${SITE_HOST}</text>
</svg>
`;
}

function writeGallery(outDir, files) {
  const items = files
    .map((f) => `    <figure><img src="${encodeURIComponent(f.name)}" alt="${escapeXml(f.title)}"/><figcaption>${escapeXml(f.title)}（${escapeXml(f.id)}）</figcaption></figure>`)
    .join('\n');
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"/>
<title>书籍海报样张预览</title>
<style>
  body { background:#f5f6f8; font-family:"Microsoft YaHei",sans-serif; margin:0; padding:24px; }
  h1 { font-size:20px; margin:0 0 16px; }
  .grid { display:flex; flex-wrap:wrap; gap:20px; }
  figure { margin:0; width:240px; text-align:center; }
  img { width:240px; border-radius:12px; box-shadow:0 6px 18px rgba(0,0,0,.15); background:#fff; }
  figcaption { font-size:13px; color:#555; margin-top:8px; word-break:break-all; }
</style>
</head>
<body>
<h1>书籍海报样张（共 ${files.length} 张）</h1>
<div class="grid">
${items}
  </div>
</body>
</html>
`;
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
}

// ─────────────────────────── 主流程
function main() {
  const opts = parseArgs(process.argv.slice(2));
  const books = loadBooks();

  let targets;
  if (opts.ids && opts.ids.length) {
    const map = new Map(books.map((b) => [b.id, b]));
    targets = opts.ids.map((id) => map.get(id)).filter(Boolean);
  } else if (opts.all) {
    targets = books;
  } else {
    targets = books.filter((b) => b.id.startsWith(opts.prefix));
    if (opts.limit > 0) targets = targets.slice(0, opts.limit);
  }

  if (!targets.length) {
    console.log('没有匹配的书籍');
    return;
  }

  fs.mkdirSync(opts.out, { recursive: true });

  const qr = qrDataUri(DEFAULT_QR_URL);
  if (!qr) console.warn('警告：二维码获取失败，海报中将使用占位二维码');

  const files = [];
  let done = 0;
  let missingCover = 0;
  for (const book of targets) {
    const outFile = path.join(opts.out, `poster-${book.id}.svg`);
    fs.writeFileSync(outFile, buildPosterSvg(book, opts, opts.qrMode === 'book' ? qrDataUri(qrUrlForBook(book)) || qr : qr), 'utf8');
    if (!fs.existsSync(path.join(coverDir, `book-${book.id}.jpg`))) missingCover++;
    files.push({ name: path.basename(outFile), title: book.title, id: book.id });
    done++;
    console.log(`  ✓ ${path.basename(outFile)}  ${book.title}`);
  }

  writeGallery(opts.out, files);
  console.log(`完成：生成 ${done} 张海报${missingCover ? `，其中 ${missingCover} 本缺封面（已用文字占位）` : ''}`);
  console.log(`输出目录: ${opts.out}`);
  console.log(`预览: ${path.join(opts.out, 'index.html')}`);
}

function qrUrlForBook(book) {
  if (!book.downloadUrl) return DEFAULT_QR_URL;
  return `${SITE_HOST}${book.downloadUrl.startsWith('/') ? '' : '/'}${encodeURI(book.downloadUrl)}`;
}

main();
