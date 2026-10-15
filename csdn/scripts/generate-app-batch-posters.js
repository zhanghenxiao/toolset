/**
 * APP 书单批量宣传：标题页 + 封面九宫格 SVG（81 本封面 → 约 12 张）
 *
 * 用法:
 *   node csdn/scripts/generate-app-batch-posters.js
 *   node csdn/scripts/generate-app-batch-posters.js --new-count 1249 --cover-limit 81 --per-page 7
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const booksDataPath = path.join(root, 'csdn/src/data/booksData.js');
const coverDir = path.join(root, 'csdn/src/assets/images/books');
const wuxiaJsonPath = path.join(root, 'books/_work/wuxia-batch-books.json');
const outDir = path.join(root, 'books/_work/app-batch-1249');
const versionPath = path.join(root, 'app-version.json');

const W = 750;
const H = 1334;
const BG = '#141c28';
const GOLD = '#c9a962';
const TEXT = '#f2efe6';
const MUTED = '#9aa8b8';

function parseArgs(argv) {
  const opts = {
    newCount: 1249,
    coverLimit: 81,
    perPage: 7,
    version: null,
    date: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === '--new-count') opts.newCount = Number(next());
    else if (a === '--cover-limit') opts.coverLimit = Number(next());
    else if (a === '--per-page') opts.perPage = Number(next());
    else if (a === '--version') opts.version = String(next());
    else if (a === '--date') opts.date = String(next());
  }
  return opts;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function chapterCountFromFields(chapters, downloadUrl) {
  const m = String(chapters || '').match(/(?:^|\D)(\d+)\s*章/);
  if (m) return Number(m[1]);
  const m2 = String(downloadUrl || '').match(/1-(\d+)章/);
  if (m2) return Number(m2[1]);
  return 0;
}

function loadAllBooks() {
  const text = fs.readFileSync(booksDataPath, 'utf8');
  const books = [];
  const blockRe = /\{[\s\S]*?\n  \},?\n/g;
  let m;
  while ((m = blockRe.exec(text)) !== null) {
    const block = m[0];
    const idM = block.match(/\bid:\s*("([^"]+)"|(\d+)),/);
    const titleM = block.match(/\btitle:\s*"((?:[^"\\]|\\.)*)"/);
    if (!idM || !titleM) continue;
    const id = idM[2] != null ? idM[2] : Number(idM[3]);
    const title = JSON.parse(`"${titleM[1]}"`);
    const authorM = block.match(/\bauthor:\s*"((?:[^"\\]|\\.)*)"/);
    const chaptersM = block.match(/\bchapters:\s*"((?:[^"\\]|\\.)*)"/);
    const downloadM = block.match(/\bdownloadUrl:\s*"((?:[^"\\]|\\.)*)"/);
    const author = authorM ? JSON.parse(`"${authorM[1]}"`) : '';
    const chapters = chaptersM ? JSON.parse(`"${chaptersM[1]}"`) : '';
    const downloadUrl = downloadM ? JSON.parse(`"${downloadM[1]}"`) : '';
    const ch = chapterCountFromFields(chapters, downloadUrl);
    const idStr = String(id);
    const hasCover = fs.existsSync(path.join(coverDir, `book-${idStr}.jpg`));
    books.push({ id, idStr, title, author, chapters, downloadUrl, ch, hasCover });
  }
  return books;
}

function coverDataUri(idStr) {
  const file = path.join(coverDir, `book-${idStr}.jpg`);
  if (!fs.existsSync(file)) return null;
  const b64 = fs.readFileSync(file).toString('base64');
  return `data:image/jpeg;base64,${b64}`;
}

function measureText(text, fontSize) {
  let w = 0;
  for (const ch of String(text)) {
    w += ch.codePointAt(0) > 0x2e80 ? fontSize : fontSize * 0.55;
  }
  return w;
}

function wrapTitle(text, maxWidth, fontSize, maxLines = 2) {
  const clean = String(text || '').trim();
  if (!clean) return [''];
  const lines = [];
  let line = '';
  for (const ch of clean) {
    if (measureText(line + ch, fontSize) > maxWidth && line) {
      lines.push(line);
      line = ch;
      if (lines.length >= maxLines) break;
    } else line += ch;
  }
  if (lines.length < maxLines && line) lines.push(line);
  if (lines.length === maxLines && clean.length > line.length + lines.slice(0, -1).join('').length) {
    let last = lines[maxLines - 1];
    while (last && measureText(`${last}…`, fontSize) > maxWidth) last = last.slice(0, -1);
    lines[maxLines - 1] = `${last}…`;
  }
  return lines;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function posterHeaderSvg(opts, subtitle) {
  const yHeadline = 118;
  return `
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect x="28" y="36" width="220" height="36" fill="none" stroke="${GOLD}" stroke-width="1.5"/>
  <text x="138" y="60" text-anchor="middle" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="${GOLD}" letter-spacing="3">小程序·数维探索</text>
  <text x="28" y="${yHeadline}" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="26" font-weight="bold" fill="${TEXT}">本次APP书单新增${opts.newCount} 本，更新版本 ${opts.versionName}  |  ${opts.dateLabel}</text>
  <text x="28" y="${yHeadline + 36}" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="14" fill="${MUTED}">${escapeXml(subtitle)}</text>
  <line x1="28" y1="${yHeadline + 52}" x2="${W - 28}" y2="${yHeadline + 52}" stroke="${GOLD}" stroke-opacity="0.45"/>
  <text x="28" y="${yHeadline + 82}" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="15" font-weight="600" fill="${GOLD}" letter-spacing="4">热门推荐</text>`;
}

function buildTitleListSvg(books, opts) {
  const cols = 3;
  const colW = (W - 56 - 20) / cols;
  const startY = 220;
  const rowH = 34;
  const fontSize = 11;
  let cells = '';
  books.forEach((b, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 28 + col * (colW + 10);
    const y = startY + row * rowH;
    const label = b.title.length > 22 ? `${b.title.slice(0, 21)}…` : b.title;
    cells += `<text x="${x}" y="${y}" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="${fontSize}" fill="${TEXT}">${escapeXml(label)}</text>\n`;
  });
  const footerY = H - 40;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${posterHeaderSvg(opts, '小程序·数维探索 ·内有联系方式· 获取最新资源方式')}
  ${cells}
  <text x="${W / 2}" y="${footerY}" text-anchor="middle" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="13" fill="${MUTED}">数维探索 · 欢迎订阅 · 共 ${books.length} 本精选书名</text>
</svg>`;
}

function buildCoverGridSvg(pageBooks, pageIndex, pageTotal, opts) {
  const cols = 3;
  const padX = 36;
  const padTop = 200;
  const gap = 16;
  const cellW = (W - padX * 2 - gap * (cols - 1)) / cols;
  const coverH = Math.floor(cellW * 1.33);
  const titleH = 44;
  const cellH = coverH + titleH;
  let defs = '';
  let body = '';
  pageBooks.forEach((b, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = padX + col * (cellW + gap);
    const y = padTop + row * (cellH + gap);
    const href = coverDataUri(b.idStr);
    if (href) {
      defs += `<clipPath id="c${pageIndex}_${i}"><rect x="${x}" y="${y}" width="${cellW}" height="${coverH}" rx="6"/></clipPath>`;
      body += `<image x="${x}" y="${y}" width="${cellW}" height="${coverH}" preserveAspectRatio="xMidYMid slice" clip-path="url(#c${pageIndex}_${i})" href="${href}"/>`;
    } else {
      body += `<rect x="${x}" y="${y}" width="${cellW}" height="${coverH}" rx="6" fill="#1e2a3a"/>`;
    }
    body += `<rect x="${x}" y="${y}" width="${cellW}" height="${coverH}" rx="6" fill="none" stroke="${GOLD}" stroke-opacity="0.25"/>`;
    const lines = wrapTitle(b.title, cellW - 4, 11, 2);
    lines.forEach((line, li) => {
      body += `<text x="${x + cellW / 2}" y="${y + coverH + 16 + li * 14}" text-anchor="middle" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="11" fill="${TEXT}">${escapeXml(line)}</text>`;
    });
  });
  const sub = `封面推荐 ${pageIndex}/${pageTotal} · 本页 ${pageBooks.length} 本`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>${defs}</defs>
  ${posterHeaderSvg(opts, sub)}
  ${body}
  <text x="${W / 2}" y="${H - 28}" text-anchor="middle" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="12" fill="${MUTED}">扫码小程序「数维探索」免费阅读</text>
</svg>`;
}

function buildTitlePagesHtml(pages, opts) {
  const pageBlocks = pages
    .map(
      (titles, i) => `
    <section class="poster" id="titles-${i + 1}">
      <span class="tag">小程序·数维探索</span>
      <h1>本次APP书单新增${opts.newCount} 本 · 书目 ${i + 1}/${pages.length}</h1>
      <p class="sub">${opts.versionName} · ${opts.dateLabel} · 本页 ${titles.length} 本</p>
      <ul class="cols">${titles.map((t) => `<li>${escapeXml(t)}</li>`).join('')}</ul>
    </section>`
    )
    .join('\n');
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<title>书单新增 ${opts.newCount} 本 · 目录</title>
<style>
  body { background:#0d1117; color:#f2efe6; font-family:"PingFang SC","Microsoft YaHei",sans-serif; padding:20px; }
  .poster { max-width:720px; margin:0 auto 32px; background:#141c28; border:1px solid rgba(201,169,98,.35); padding:28px; }
  .tag { display:inline-block; color:#c9a962; border:1px solid #c9a962; padding:4px 10px; font-size:14px; letter-spacing:.15em; margin-bottom:16px; }
  h1 { font-size:22px; margin:0 0 8px; }
  .sub { color:#9aa8b8; font-size:13px; margin-bottom:16px; }
  .cols { columns:3; column-gap:12px; font-size:11px; padding:0; margin:0; list-style:none; }
  .cols li { break-inside:avoid; padding:2px 0 2px 8px; border-left:2px solid rgba(91,141,239,.4); margin-bottom:4px; }
  @media (max-width:560px) { .cols { columns:2; } }
</style>
</head>
<body>
${pageBlocks}
</body>
</html>`;
}

function buildIndexHtml(files, opts, coverBooks, titlePageCount) {
  const coverLinks = files
    .filter((f) => f.startsWith('poster-covers-'))
    .map((f) => `<li><a href="${f}">${f}</a></li>`)
    .join('\n');
  const preview = files
    .filter((f) => f.endsWith('.svg'))
    .map((f) => `<figure><img src="${f}" alt=""/><figcaption>${f}</figcaption></figure>`)
    .join('');
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="utf-8"/><title>APP 书单宣传 ${opts.newCount} 本</title>
<style>
body{font-family:"Microsoft YaHei",sans-serif;background:#0d1117;color:#eee;padding:24px;max-width:900px;margin:0 auto;}
a{color:#5b8def;} img{max-width:220px;border-radius:8px;margin:8px;}
.grid{display:flex;flex-wrap:wrap;gap:12px;}
h2{color:#c9a962;margin-top:28px;}
</style></head>
<body>
<h1>书单新增 ${opts.newCount} 本 · 封面 ${coverBooks.length} 本</h1>
<p>${opts.versionName} · ${opts.dateLabel}</p>
<h2>标题精选（81 书名 · SVG）</h2>
<ul><li><a href="poster-titles-81.svg">poster-titles-81.svg</a></li></ul>
<h2>封面网格（${files.filter((f) => f.startsWith('poster-covers-')).length} 张）</h2>
<ul>${coverLinks}</ul>
<h2>完整书名分页 HTML（${titlePageCount} 页）</h2>
<p><a href="title-list-pages.html">title-list-pages.html</a></p>
<h2>预览</h2>
<div class="grid">${preview}</div>
</body></html>`;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const ver = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
  opts.versionName = opts.version || `v${ver.versionName}`;
  if (!opts.versionName.startsWith('v')) opts.versionName = `v${opts.versionName}`;
  opts.dateLabel =
    opts.date ||
    new Date(ver.updatedAt || Date.now()).toISOString().slice(0, 10);

  const all = loadAllBooks();
  const stringBooks = all.filter((b) => typeof b.id === 'string');
  stringBooks.sort((a, b) => b.ch - a.ch);
  const newBatch = stringBooks.slice(0, opts.newCount);
  if (newBatch.length < opts.newCount) {
    console.warn(`警告：前缀书目仅 ${newBatch.length} 本，少于 --new-count ${opts.newCount}`);
  }

  let coverCandidates;
  if (fs.existsSync(wuxiaJsonPath)) {
    const wuxia = JSON.parse(fs.readFileSync(wuxiaJsonPath, 'utf8'));
    const byId = new Map(all.map((b) => [b.idStr, b]));
    coverCandidates = wuxia.books
      .map((w) => byId.get(w.id))
      .filter((b) => b && b.hasCover);
  } else {
    coverCandidates = newBatch.filter((b) => b.hasCover);
  }
  const coverBooks = coverCandidates.slice(0, opts.coverLimit);

  fs.mkdirSync(outDir, { recursive: true });

  const title81 = coverBooks.map((b) => b.title);
  fs.writeFileSync(path.join(outDir, 'poster-titles-81.svg'), buildTitleListSvg(coverBooks, opts), 'utf8');

  const coverPages = chunk(coverBooks, opts.perPage);
  const coverFiles = [];
  coverPages.forEach((page, i) => {
    const name = `poster-covers-${String(i + 1).padStart(2, '0')}.svg`;
    fs.writeFileSync(
      path.join(outDir, name),
      buildCoverGridSvg(page, i + 1, coverPages.length, opts),
      'utf8'
    );
    coverFiles.push(name);
  });

  const titlesForPages = newBatch.map((b) => b.title);
  const titlePages = chunk(titlesForPages, 100);
  fs.writeFileSync(path.join(outDir, 'title-list-pages.html'), buildTitlePagesHtml(titlePages, opts), 'utf8');

  const manifest = {
    newCount: opts.newCount,
    versionName: opts.versionName,
    dateLabel: opts.dateLabel,
    coverBookCount: coverBooks.length,
    coverPosterPages: coverPages.length,
    perCoverPage: opts.perPage,
    titleListPages: titlePages.length,
    coverBooks: coverBooks.map((b) => ({ id: b.idStr, title: b.title, chapters: b.ch })),
    newBatchCount: newBatch.length,
  };
  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

  const allSvg = ['poster-titles-81.svg', ...coverFiles];
  fs.writeFileSync(
    path.join(outDir, 'index.html'),
    buildIndexHtml(allSvg, opts, coverBooks, titlePages.length),
    'utf8'
  );

  const posterHtmlPath = path.join(root, 'books/_work/wuxia-batch-poster.html');
  if (fs.existsSync(posterHtmlPath)) {
    let html = fs.readFileSync(posterHtmlPath, 'utf8');
    html = html.replace(
      /本次APP书单新增\d+\s*本，更新版本 [^|]+ \|[^<]+/,
      `本次APP书单新增${opts.newCount} 本，更新版本 ${opts.versionName}  |  ${opts.dateLabel}`
    );
    fs.writeFileSync(posterHtmlPath, html, 'utf8');
    const hlPath = path.join(root, 'books/_work/wuxia-batch-books.json');
    if (fs.existsSync(hlPath)) {
      const j = JSON.parse(fs.readFileSync(hlPath, 'utf8'));
      j.total = opts.newCount;
      j.highlights = title81;
      fs.writeFileSync(hlPath, JSON.stringify(j, null, 2), 'utf8');
    }
  }

  console.log(`新增文案: ${opts.newCount} 本 · ${opts.versionName} · ${opts.dateLabel}`);
  console.log(`封面书目: ${coverBooks.length} 本 → ${coverPages.length} 张网格 SVG（每页 ${opts.perPage} 本）`);
  console.log(`标题精选 SVG: poster-titles-81.svg`);
  console.log(`完整书名 HTML: ${titlePages.length} 页`);
  console.log(`输出目录: ${outDir}`);
}

main();
