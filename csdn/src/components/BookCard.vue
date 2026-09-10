<template>
  <component
    :is="bookUrl ? 'a' : 'div'"
    class="book-card fade-in"
    :href="bookUrl || undefined"
    :target="bookUrl ? '_blank' : undefined"
    :rel="bookUrl ? 'noopener noreferrer' : undefined"
  >
    <div class="card-cover">
      <img :src="book.cover" :alt="book.title" />
      <span class="category-badge">{{ book.category }}</span>
      <span v-if="book.latestChapter" class="chapter-badge">{{ $t('books.latestChapter', { chapter: book.latestChapter }) }}</span>
    </div>
    <div class="card-body">
      <h3 class="card-title">{{ book.title }}</h3>
      <div class="card-meta">
        <div class="meta-item">
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path fill="currentColor"
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <span>{{ book.author }}</span>
        </div>
      </div>
      <p class="card-excerpt">{{ book.excerpt }}</p>
      <div class="card-tags">
        <span v-for="tag in book.tags" :key="tag.name" class="tag" :class="'tag-' + tag.type">{{ tag.name }}</span>
      </div>
      <span v-if="bookUrl" class="read-btn">{{ $t('books.read') }}</span>
    </div>
  </component>
</template>

<script>
export default {
  name: 'BookCard',
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
  computed: {
    bookUrl() {
      return this.book.readUrl || this.book.downloadUrl || '';
    },
  },
};
</script>

<style scoped>
.book-card {
  background: var(--card-bg);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
  text-decoration: none;
  color: inherit;
}

.book-card:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-hover);
}

.card-cover {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  width: 68%;
  max-width: 160px;
  margin: 10px auto 0;
  border-radius: 6px;
  flex-shrink: 0;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.book-card:hover .card-cover img {
  transform: scale(1.05);
}

.category-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(26, 115, 232, 0.9);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.chapter-badge {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 6px 8px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
  color: white;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-body {
  padding: 10px 14px 14px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 6px;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
  font-size: 11px;
  color: var(--text-muted);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-excerpt {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 10px;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  margin-top: auto;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid transparent;
}

.tag-blue {
  background: rgba(26, 115, 232, 0.05);
  border-color: rgba(26, 115, 232, 0.3);
  color: var(--primary-color);
}

.tag-green {
  background: rgba(52, 168, 83, 0.05);
  border-color: rgba(52, 168, 83, 0.3);
  color: #34a853;
}

.tag-purple {
  background: rgba(161, 68, 255, 0.05);
  border-color: rgba(161, 68, 255, 0.3);
  color: #a144ff;
}

.read-btn {
  display: block;
  margin-top: 8px;
  padding: 6px 12px;
  background: var(--primary-color);
  color: white;
  text-align: center;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.3s;
}

.read-btn:hover {
  background: var(--primary-hover);
}
</style>
