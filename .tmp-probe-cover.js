const fs = require('fs');
const slug = process.argv[2];
const html = fs.readFileSync(`${process.env.TEMP}/${slug}_index.html`, 'utf8');
const imgs = [...html.matchAll(/src="([^"]+\.(?:jpg|jpeg|png))[^"]*"/gi)].map((m) => m[1]);
console.log([...new Set(imgs)].filter((s) => new RegExp(slug, 'i').test(s) || /cover|fengmian|image/i.test(s)).slice(0, 10));
console.log('og:image =', html.match(/og:image"\s+content="([^"]+)"/)?.[1]);
