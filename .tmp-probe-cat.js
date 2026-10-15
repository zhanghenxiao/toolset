const fs = require('fs');
const slug = process.argv[2];
const html = fs.readFileSync(`${process.env.TEMP}/${slug}_index.html`, 'utf8');
const re = new RegExp(`href="/txt/${slug}/(\\d+)\\.html"[^>]*title="([^"]+)"`, 'gi');
const hits = [];
let m;
while ((m = re.exec(html)) !== null) {
  hits.push({ num: Number(m[1]), title: m[2].trim(), at: m.index });
}
console.log('文档顺序前 12 条:');
for (const h of hits.slice(0, 12)) console.log(h.at, h.num, h.title);
console.log('文档顺序末 12 条:');
for (const h of hits.slice(-12)) console.log(h.at, h.num, h.title);
console.log('--- href=1 上下文 ---');
const i = hits.find((h) => h.num === 1).at;
console.log(html.slice(Math.max(0, i - 400), i + 200));
console.log('--- href=6..9 是否存在 ---');
for (const h of hits.filter((x) => x.num <= 10)) console.log(h.num, h.title, h.at);
