import books from '../data/books.js';
import meta from '../data/meta.js';

export function filterBooks({ categories = [], tags = [], keyword = '' }) {
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

export function getBookById(id) {
  const raw = String(id);
  const num = /^\d+$/.test(raw) ? Number(raw) : raw;
  return books.find((b) => b.id === num || String(b.id) === raw);
}

export { books, meta };
