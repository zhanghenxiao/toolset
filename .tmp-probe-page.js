const { execSync } = require('child_process');
const slug = process.argv[2] || 'eocj';
for (const n of process.argv.slice(3)) {
  const html = execSync(`curl.exe -sL -A "Mozilla/5.0" "https://www.min-yuan.com/txt/${slug}/${n}.html"`, {
    encoding: 'utf8',
    maxBuffer: 1e8,
  });
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || '';
  const prev = html.match(/rel="prev" href="([^"]+)"/)?.[1] || '';
  const next = html.match(/rel="next" href="([^"]+)"/)?.[1] || '';
  const body = (html.match(/id="booktxt"[^>]*>([\s\S]*?)<\/div>/i)?.[1] || '').replace(/<[^>]+>/g, '').trim();
  console.log(`${n}: h1="${h1}" prev=${prev} next=${next} bodyLen=${body.length} head="${body.slice(0, 30)}"`);
}
