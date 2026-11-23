/**
 * 撸文小说 lutxt.com 整本抓取（按目录逐章 + 断点续传）。
 *
 * 用法:
 *   node csdn/scripts/download-lutxt-book.js
 *   node csdn/scripts/download-lutxt-book.js --delay 1500
 *   node csdn/scripts/download-lutxt-book.js --max 5        # 只抓前5章(调试)
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '../..');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const INDEX_URL = 'https://www.lutxt.com/txt/30081.html';
const BOOK_ID = '30081';
const TITLE = '在艰苦岁月里当阿姐';
const AUTHOR = '九紫';
const OUT_FILE = path.join(ROOT, 'books', `lutxt_${BOOK_ID}_${TITLE}1-289章.txt`);
const WORK_DIR = path.join(ROOT, 'books/_work/lutxt', BOOK_ID);

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function curl(url) {
  return execFileSync('curl.exe', ['-sS', '-m', '25', '--compressed', '-A', UA, url], {
    encoding: 'utf8', maxBuffer: 8 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'],
  });
}

function stripHtml(s) {
  return s
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/☋[^☋]{0,200}☋/g, '')
    .replace(/撸文.{0,20}最新章节.{0,40}/g, '')
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !/^(setRead\(\)|BookVote|广告|请收藏|手机阅读|返回目录|上一章|下一章)/.test(l))
    .filter((l) => !/温馨提示[:：].*(回车|Enter|书签)/.test(l))
    .filter((l) => !/请来撸文|记住域名.lutxt|看最新章节.完整章节/.test(l))
    .join('\n');
}

function parseIndex(html) {
  const re = /href="(https?:\/\/www\.lutxt\.com\/txt\/30081\/\d+\.html)"[^>]*>([^<]*?)<\/a>/g;
  const map = new Map();
  let m;
  while ((m = re.exec(html))) {
    const url = m[1];
    const label = m[2].trim();
    if (!map.has(url) || label.length > (map.get(url) || '').length) map.set(url, label);
  }
  const chapters = [...map.entries()].map(([url, label]) => {
    const numMatch = label.match(/第\s*(\d+)\s*章/);
    return { url, label, num: numMatch ? Number(numMatch[1]) : 0 };
  });
  chapters.sort((a, b) => a.num - b.num || a.url.localeCompare(b.url));
  return chapters;
}

function parseChapter(html) {
  const titleMatch = html.match(/<h1 class="readTitle">([\s\S]*?)<\/h1>/);
  const title = titleMatch ? stripHtml(titleMatch[1]) : '';
  const start = html.indexOf('id="content"');
  if (start < 0) return { title, text: '' };
  const end = html.indexOf('</div>', html.indexOf('<h1', start));
  // 直接取 content 内所有 <p> 作为正文
  const seg = html.slice(start);
  const pRe = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  const parts = [];
  let p;
  while ((p = pRe.exec(seg))) {
    const t = stripHtml(p[1]);
    if (!t) continue;
    if (/^(在艰苦岁月里当阿姐|作者[:：]|更新|字数|点击|推荐|收藏|本书|起点|撸文|手机|版权|章节目录)/.test(t)) continue;
    // 跳过章节导航条，如 "第1章第1章" / "第289章 返回目录"
    if (/^第\s*\d+\s*章[\s\S]{0,30}$/.test(t) && !/[。！？，]/.test(t)) continue;
    parts.push(t);
  }
  return { title, text: parts.join('\n') };
}

async function main() {
  const args = process.argv.slice(2);
  const delay = args.includes('--delay') ? Number(args[args.indexOf('--delay') + 1]) : 1200;
  const max = args.includes('--max') ? Number(args[args.indexOf('--max') + 1]) : 0;
  const retry = 3;

  fs.mkdirSync(WORK_DIR, { recursive: true });
  console.log(`[${new Date().toLocaleString()}] 读取目录 ${INDEX_URL}`);
  const indexHtml = curl(INDEX_URL);
  const chapters = parseIndex(indexHtml);
  console.log(`目录章节数: ${chapters.length}`);
  if (!chapters.length) throw new Error('目录解析失败');

  const targets = max > 0 ? chapters.slice(0, max) : chapters;
  let ok = 0;
  for (let i = 0; i < targets.length; i++) {
    const ch = targets[i];
    const file = path.join(WORK_DIR, `${String(i + 1).padStart(4, '0')}.txt`);
    if (fs.existsSync(file) && fs.statSync(file).size > 200) {
      ok++;
      continue;
    }
    let success = false;
    for (let attempt = 1; attempt <= retry + 1; attempt++) {
      if (attempt > 1) {
        console.log(`  第 ${attempt} 次重试 ${ch.url}`);
        await sleep(3000 * attempt);
      }
      try {
        const html = curl(ch.url);
        const { title, text } = parseChapter(html);
        if (text.length < 50) throw new Error(`正文过短 (${text.length})`);
        fs.writeFileSync(file, `${title || ch.label}\n\n${text}\n`, 'utf8');
        success = true;
        ok++;
        break;
      } catch (e) {
        console.warn(`  ✗ 第${attempt}次失败: ${e.message}`);
      }
    }
    if ((i + 1) % 10 === 0 || i === targets.length - 1) {
      console.log(`  [${i + 1}/${targets.length}] 成功 ${ok}，正文 ${fs.existsSync(file) ? fs.statSync(file).size : 0}B`);
    }
    await sleep(delay);
  }

  // 合并
  const header = `《${TITLE}》  作者：${AUTHOR}\n来源：lutxt.com/book/${BOOK_ID}\n共 ${targets.length} 章\n\n`;
  const parts = [];
  for (let i = 0; i < targets.length; i++) {
    const file = path.join(WORK_DIR, `${String(i + 1).padStart(4, '0')}.txt`);
    if (fs.existsSync(file)) {
      parts.push(fs.readFileSync(file, 'utf8').trim());
    } else {
      parts.push(`【第 ${i + 1} 章 缺失】`);
    }
  }
  fs.writeFileSync(OUT_FILE, header + parts.join('\n\n\n'), 'utf8');
  console.log(`完成: 成功 ${ok}/${targets.length}，输出 ${OUT_FILE} (${(fs.statSync(OUT_FILE).size / 1024 / 1024).toFixed(2)} MB)`);
}

main().catch((e) => { console.error(e.stack || e.message); process.exit(1); });
