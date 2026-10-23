const fs = require('fs');
const files = ['data/books.js', 'data/remot-books.js', 'data/books-remot.js', 'data/meta.js'];
files.forEach((p) => {
  if (!fs.existsSync(p)) {
    console.log(p, '=> NOT FOUND');
    return;
  }
  const s = fs.readFileSync(p, 'utf8');
  const pgyer = (s.match(/pgyer\.com/g) || []).length;
  const quark = (s.match(/pan\.quark\.cn/g) || []).length;
  const baidu = (s.match(/pan\.baidu\.com/g) || []).length;
  const readUrl = (s.match(/"readUrl"\s*:/g) || []).length;
  console.log(`${p} | readUrl:${readUrl} pgyer:${pgyer} quark:${quark} baidu:${baidu} | ${(s.length / 1048576).toFixed(2)}MB`);
});
