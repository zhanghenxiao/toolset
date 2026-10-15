const BOOKSHELF_KEY = 'bookshelf';

function normalizeItem(item) {
  if (item === undefined || item === null) return null;
  if (typeof item === 'object') {
    if (item.id === undefined || item.id === null) return null;
    return {
      id: item.id,
      addedAt: Number(item.addedAt) || Date.now(),
    };
  }
  return { id: item, addedAt: Date.now() };
}

export function getBookshelf() {
  const stored = uni.getStorageSync(BOOKSHELF_KEY);
  if (!Array.isArray(stored)) return [];
  return stored.map(normalizeItem).filter(Boolean);
}

export function addToBookshelf(bookId) {
  if (bookId === undefined || bookId === null || bookId === '') return false;
  const shelf = getBookshelf();
  if (shelf.some((item) => String(item.id) === String(bookId))) return false;
  shelf.unshift({ id: bookId, addedAt: Date.now() });
  uni.setStorageSync(BOOKSHELF_KEY, shelf);
  return true;
}

export function removeFromBookshelf(bookId) {
  const shelf = getBookshelf();
  const next = shelf.filter((item) => String(item.id) !== String(bookId));
  if (next.length === shelf.length) return false;
  uni.setStorageSync(BOOKSHELF_KEY, next);
  return true;
}

export function isInBookshelf(bookId) {
  return getBookshelf().some((item) => String(item.id) === String(bookId));
}

export function getReadingProgress(bookId) {
  const progress = uni.getStorageSync(`reading_progress_${bookId}`);
  return progress && typeof progress === 'object' ? progress : null;
}

export { BOOKSHELF_KEY };
