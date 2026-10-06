const https = require('https');
const fs = require('fs');

function fetchHtml(url, cookie = '') {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', Cookie: cookie } }, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function getWithCookie(url) {
  let html = await fetchHtml(url);
  const cookieMatch = html.match(/document\.cookie = "([^"]+)"/);
  if (cookieMatch) {
    const cookie = cookieMatch[1].split(';')[0];
    html = await fetchHtml(url, cookie);
  }
  return html;
}

(async () => {
  const html = await getWithCookie('https://www.00w.org/bxwx_139814/');
  fs.writeFileSync('books/_work/00w-index.html', html, 'utf8');

  const listBlock = html.match(/<div class="section-box">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/);
  console.log('has section-box', !!listBlock);

  const ddRe = /<dd><a href="(\/bxwx_139814\/\d+\.html)">([^<]+)<\/a><\/dd>/g;
  const chapters = [];
  let m;
  while ((m = ddRe.exec(html)) !== null) {
    chapters.push({ href: m[1], title: m[2].trim() });
  }
  console.log('dd chapters', chapters.length);
  console.log('first3', chapters.slice(0, 3));
  console.log('last3', chapters.slice(-3));

  const pageLinks = [...html.matchAll(/href="(\/bxwx_139814\/index_\d+\.html)"/g)].map((x) => x[1]);
  console.log('page links', pageLinks.length, pageLinks);

  const chHtml = await getWithCookie('https://www.00w.org/bxwx_139814/36151435.html');
  const paras = [...chHtml.matchAll(/<div class="word_read">[\s\S]*?<h3>[^<]+<\/h3>[\s\S]*?<\/div>\s*<div class="read_btn">/g)];
  console.log('chapter body blocks', paras.length);
  const pTags = [...chHtml.matchAll(/<p>([^<]*)<\/p>/g)].map((x) => x[1]).filter(Boolean);
  console.log('p count', pTags.length, 'sample', pTags[0]?.slice(0, 40));
  const next = chHtml.match(/<a href="(\/bxwx_139814\/[^"]+)">下一章<\/a>/);
  console.log('next', next?.[1]);
})();
