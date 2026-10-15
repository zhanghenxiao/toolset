/**
 * 临时修复：补抓 min-yuan 书籍中下载失败的章节，替换 TXT 内的占位符
 * 用法: node .tmp-repair-jrhs.js <slug> <txtFileAbsPath>
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { BASE, extractBooktxt, parseNextHref } = require('./csdn/scripts/minyuan-book-core');

const [, , slug, fileArg] = process.argv;
if (!slug || !fileArg) {
  console.error('用法: node .tmp-repair-jrhs.js <slug> <txtFile>');
  process.exit(1);
}
const file = path.resolve(fileArg);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0';

function sleep(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) { /* wait */ }
}

function curl(url) {
  return execSync(`curl.exe -sL --connect-timeout 60 --max-time 180 -A "${UA}" -H "Referer: ${BASE}/txt/${slug}/" "${url}"`, {
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
}

function fetchChapterText(rootId) {
  const parts = [];
  let pageRel = `/txt/${slug}/${rootId}.html`;
  const seen = new Set();
  for (let guard = 0; guard < 40; guard++) {
    const url = `${BASE}${pageRel}`;
    if (seen.has(url)) break;
    seen.add(url);
    const html = curl(url);
    const body = extractBooktxt(html);
    if (body) parts.push(body);
    const next = parseNextHref(html);
    if (!next || next.includes('javascript')) break;
    const nextRel = next.startsWith('/') ? next : `/${next}`;
    if (new RegExp(`^/txt/${slug}/${rootId}_\\d+\\.html$`, 'i').test(nextRel)) {
      pageRel = nextRel;
      sleep(400);
      continue;
    }
    break;
  }
  const merged = parts.join('\n\n');
  if (!merged) throw new Error('正文为空或转码中');
  return merged;
}

let content = fs.readFileSync(file, 'utf8');
const re = /\[本章下载失败: [^\]]*\/txt\/[a-z0-9]+\/(\d+)\.html\]/gi;
const targets = [];
let m;
while ((m = re.exec(content)) !== null) {
  if (!targets.some((t) => t.placeholder === m[0])) targets.push({ placeholder: m[0], rootId: m[1] });
}
console.log(`待补抓 ${targets.length} 章…`);

let fixed = 0;
let stillFailed = 0;
for (const [i, t] of targets.entries()) {
  process.stdout.write(`\r  补抓 ${i + 1}/${targets.length}: ${t.rootId}…`);
  let text = '';
  for (let attempt = 0; attempt < 4 && !text; attempt++) {
    try {
      text = fetchChapterText(t.rootId);
    } catch (err) {
      if (attempt < 3) sleep(2000 * (attempt + 1));
      else console.warn(`\n  仍失败 ${t.rootId}: ${err.message}`);
    }
  }
  if (text) {
    content = content.replace(t.placeholder, text);
    fixed++;
  } else {
    stillFailed++;
  }
  sleep(600);
}
process.stdout.write('\n');

fs.writeFileSync(file, content, 'utf8');
console.log(`已补 ${fixed} 章，仍失败 ${stillFailed} 章 → ${file}`);
