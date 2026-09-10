const books = require('../data/books');
const meta = require('../data/meta');

function filterBooks({ categories = [], tags = [], keyword = '' }) {
  const kw = keyword.trim().toLowerCase();
  return books.filter((item) => {
    const keywordMatch =
      !kw ||
      item.title.toLowerCase().includes(kw) ||
      item.author.toLowerCase().includes(kw) ||
      (item.excerpt || '').toLowerCase().includes(kw);

    const categoryMatch =
      categories.length === 0 || categories.includes(item.category);

    const tagMatch =
      tags.length === 0 ||
      item.tags.some((t) => tags.includes(t.name));

    return keywordMatch && categoryMatch && tagMatch;
  });
}

function getBookById(id) {
  return books.find((b) => b.id === Number(id));
}

module.exports = {
  books,
  meta,
  filterBooks,
  getBookById,
};
