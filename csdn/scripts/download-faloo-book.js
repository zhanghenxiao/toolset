/**
 * 从飞卢小说网 b.faloo.com 分卷下载 TXT 并合并
 * 用法: node csdn/scripts/download-faloo-book.js <downloadUrl|bookId> [localId如f_1045427]
 *
 * 下载页: https://b.faloo.com/d_{bookId}.html
 * 分卷链接在 .c_con_de_data 内 .c_con_de_d_down 的 href
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const {
  buildBookFilename,
  getBookPath,
  getWorkDir,
  falooLocalId,
  isFalooId,
} = require('./book-paths');
const { buildBookHeader, finalizeBookFile } = require('./source-share-line');

const root = path.resolve(__dirname, '../..');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const DELAY_MS = 400;

const [, , urlOrId, localIdArg] = process.argv;
if (!urlOrId) {
  console.error('用法: node download-faloo-book.js <downloadUrl|bookId> [localId如f_1045427]');
  process.exit(1);
}

const bookId = String(urlOrId).match(/(\d+)/)?.[1];
if (!bookId) {
  console.error('无法解析书籍 ID');
  process.exit(1);
}

const localId = localIdArg
  ? (() => {
    const id = String(localIdArg);
    if (!isFalooId(id)) throw new Error('飞卢书籍 localId 须以 f_ 开头，如 f_1045427');
    return id;
  })()
  : falooLocalId(bookId);

function sleep(ms) {
  if (ms <= 0) return;
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function curl(url, binary = false) {
  const buf = execSync(
    `curl.exe -sL -A "${UA}" -H "Referer: https://b.faloo.com/d_${bookId}.html" "${url}"`,
    {
      encoding: 'buffer',
      maxBuffer: 80 * 1024 * 1024,
      stdio: ['pipe', 'pipe', 'pipe'],
    },
  );
  if (binary) return buf;
  const utf8 = buf.toString('utf8');
  const sample = utf8.slice(0, 4000);
  if (!utf8.includes('\uFFFD') && /《|作者|第\d+章|c_con_de_data/.test(sample)) return utf8;
  return new TextDecoder('gb18030').decode(buf);
}

function absUrl(href) {
  if (href.startsWith('http')) return href;
  return `https:${href}`;
}

function decodeHtml(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function parseDownloadPage(html) {
  const title = html.match(/<h1 class="c_con_t_title">\s*《([^》]+)》/)?.[1]?.trim()
    || html.match(/<title>([^<_]+)/)?.[1]?.trim();
  const author = html.match(/作者：<a[^>]*title="([^"]+)"/)?.[1]?.trim()
    || html.match(/作者：<a[^>]*>([^<]+)</)?.[1]?.trim();
  const status = /已完结/.test(html) ? '已完结' : '连载中';
  const category = html.match(/title="([^"]+)"\s*>\s*都市言情|玄幻奇幻|科幻网游|武侠仙侠|军事历史|推理灵异|青春校园|轻小说|女生小说/)?.[1]
    || '都市';
  const coverMatch = html.match(/background:\s*url\('([^']+)'\)/);
  const coverUrl = coverMatch ? coverMatch[1].replace(/^http:/, 'https:') : '';

  const parts = [];
  const re = /<div class="c_con_de_data">([\s\S]*?)<\/div>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const block = m[1];
    const label = decodeHtml(
      block.match(/class="c_con_de_d_title"[^>]*title="([^"]+)"/)?.[1]
      || block.match(/class="c_con_de_d_title"[^>]*>([^<]+)/)?.[1]
      || '',
    );
    const down = block.match(/class="c_con_de_d_down"[^>]*href="([^"]+)"/)?.[1];
    if (!down) continue;
    const nvid = down.match(/[?&]nvid=(\d+)/)?.[1];
    if (nvid !== '2') continue;
    const range = label.match(/第(\d+)章-(\d+)章/) || label.match(/\(第(\d+)章-(\d+)章\)/);
    parts.push({
      label,
      url: absUrl(down),
      start: range ? Number(range[1]) : parts.length * 20 + 1,
      end: range ? Number(range[2]) : (parts.length + 1) * 20,
      index: parts.length + 1,
    });
  }

  return { title, author, status, category, coverUrl, parts };
}

function readPartText(buffer) {
  const utf8 = buffer.toString('utf8');
  const sample = utf8.slice(0, 4000);
  if (!utf8.includes('\uFFFD') && /第\d+章|《/.test(sample)) return utf8;
  return new TextDecoder('gb18030').decode(buffer);
}

function stripPartHeader(text) {
  let body = text.replace(/^\uFEFF/, '');
  body = body.replace(/<title>[^<]*<\/title>\s*/i, '');
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex((line) => /^第\d+章/.test(line.trim()));
  return start === -1 ? body.trim() : lines.slice(start).join('\n').trim();
}

function maxChapterFromParts(parts) {
  return parts.reduce((max, p) => Math.max(max, p.end), 0);
}

async function main() {
  const downloadUrl = `https://b.faloo.com/d_${bookId}.html`;
  console.log(`抓取飞卢书籍 ${bookId}…`);
  console.log(`下载页: ${downloadUrl}`);

  const pageHtml = curl(downloadUrl);
  const meta = parseDownloadPage(pageHtml);
  if (!meta.title || !meta.author) {
    throw new Error('无法解析书名/作者');
  }
  if (meta.parts.length === 0) {
    throw new Error('未找到正文分卷下载链接（c_con_de_data）');
  }

  const maxChapter = maxChapterFromParts(meta.parts);
  console.log(`《${meta.title}》 作者：${meta.author}  ${meta.status}  共 ${meta.parts.length} 卷 / ${maxChapter} 章`);

  const workDir = path.join(getWorkDir(root, localId), 'parts');
  fs.mkdirSync(workDir, { recursive: true });

  const bodies = [];
  for (let i = 0; i < meta.parts.length; i++) {
    const part = meta.parts[i];
    const partFile = path.join(workDir, `part-${String(i + 1).padStart(3, '0')}.txt`);
    process.stdout.write(`\r  [${i + 1}/${meta.parts.length}] 第${part.start}-${part.end}章…`);

    if (!fs.existsSync(partFile) || fs.statSync(partFile).size < 100) {
      const buf = curl(part.url, true);
      if (!buf || buf.length < 100) {
        throw new Error(`分卷下载失败: ${part.label}`);
      }
      fs.writeFileSync(partFile, buf);
      sleep(DELAY_MS);
    }

    bodies.push(stripPartHeader(readPartText(fs.readFileSync(partFile))));
  }
  process.stdout.write('\n');

  const filename = buildBookFilename(localId, meta.title, maxChapter);
  const outPath = getBookPath(root, filename);
  const merged = buildBookHeader(meta.title, meta.author) + bodies.join('\n\n') + '\n';
  fs.writeFileSync(outPath, merged, 'utf8');
  finalizeBookFile(outPath);

  const coverDir = path.join(root, 'csdn/src/assets/images/books');
  fs.mkdirSync(coverDir, { recursive: true });
  if (meta.coverUrl) {
    try {
      execSync(
        `curl.exe -sL -A "${UA}" -o "${path.join(coverDir, `book-${localId}.jpg`)}" "${meta.coverUrl}"`,
        { stdio: 'pipe' },
      );
    } catch {
      console.warn('封面下载失败');
    }
  }

  const detailHtml = curl(`https://b.faloo.com/${bookId}.html`);
  let excerpt = detailHtml.match(/<div class="c_con_b_intro"[^>]*>([\s\S]*?)<\/div>/i)?.[1]
    || detailHtml.match(/<div[^>]*class="[^"]*intro[^"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1]
    || '';
  excerpt = decodeHtml(excerpt.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()).slice(0, 200);
  const excerptPath = path.join(root, 'csdn/src/data/books', `book-${localId}-excerpt.txt`);
  if (excerpt) fs.writeFileSync(excerptPath, excerpt + '\n', 'utf8');

  console.log(`已写入 ${outPath}`);
  console.log(`localId=${localId} 章节 1-${maxChapter}`);
  console.log(`来源: ${downloadUrl}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
