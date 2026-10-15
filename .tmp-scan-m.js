/**
 * 临时：扫描 min-yuan（m_ 开头）书籍中正文缺失的章节
 */
const fs = require('fs');
const path = require('path');
const booksDir = path.join(__dirname, 'books');

for (const name of fs.readdirSync(booksDir)) {
  if (!name.startsWith('m_') || !name.endsWith('.txt')) continue;
  const txt = fs.readFileSync(path.join(booksDir, name), 'utf8');
  const expected = Number(name.match(/1-(\d+)章\.txt$/)?.[1] || 0);
  const lines = txt.split('\n');
  let total = 0;
  let empty = 0;
  for (let i = 0; i < lines.length; i += 1) {
    const t = lines[i].trim();
    if (!/^第[0-9一二三四五六七八九十百千零两]+[章节]/.test(t)) continue;
    total += 1;
    let body = '';
    for (let j = i + 1; j < lines.length; j += 1) {
      const n = lines[j].trim();
      if (/^第[0-9一二三四五六七八九十百千零两]+[章节]/.test(n)) break;
      body += n;
    }
    if (body.replace(/更多书源分享.*$/, '').length < 30) empty += 1;
  }
  if (empty > 0 || (expected && total < expected)) {
    console.log(`${name} | 标题 ${total}/${expected || '?'} | 空章 ${empty}`);
  }
}
