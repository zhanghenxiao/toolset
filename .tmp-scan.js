/**
 * 检测 books 目录下 UTF-8 被误按 GB18030 解码造成的乱码书籍
 * 判据：常见汉字对应的典型乱码字（鐨=的 涓=一 鏄=是 鎴=我 鍦=在 笉=不 釜=个 浠=他/们）占比过高
 * 参考：已知乱码文件 2.47%，正常文件 <0.01%
 */
const fs = require('fs');
const path = require('path');
const dir = 'd:/toolset/books';
const SIG = /[鐨涓鏄鎴鍦笉釜浠拷锟]/g;
const SAMPLE = 400000;
const THRESHOLD = 0.005;

function headText(p) {
  const fd = fs.openSync(p, 'r');
  const buf = Buffer.alloc(Math.min(SAMPLE, fs.statSync(p).size));
  fs.readSync(fd, buf, 0, buf.length, 0);
  fs.closeSync(fd);
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(buf);
  } catch {
    return buf.toString('utf8');
  }
}

const files = fs.readdirSync(dir).filter((n) => n.endsWith('.txt')).map((n) => path.join(dir, n));
const bad = [];
for (const f of files) {
  const t = headText(f);
  const cjk = (t.match(/[\u4e00-\u9fa5]/g) || []).length;
  if (cjk < 2000) continue;
  const sig = (t.match(SIG) || []).length;
  const ratio = sig / cjk;
  if (ratio > THRESHOLD) bad.push({ f: path.basename(f), ratio });
}
console.log(`扫描 ${files.length} 个文件，疑似乱码 ${bad.length} 个`);
bad.sort((a, b) => b.ratio - a.ratio)
  .forEach((b) => console.log(`  ${(b.ratio * 100).toFixed(2)}%  ${b.f}`));
