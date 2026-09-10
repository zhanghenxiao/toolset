<template>
  <div class="books-page">
    <SiteHeader />
    <main>
      <BookFilterSection @filter-change="handleFilterChange" />

      <section class="container py-40">
        <div v-if="paginatedItems.length > 0">
          <div class="grid fade-in">
            <BookCard v-for="item in paginatedItems" :key="item.id" :book="item" />
          </div>

          <Pagination :total="totalPages" :current="currentPage" :totalItems="filteredItems.length"
            :show-info="false" @change="handlePageChange" />
        </div>
        <div v-else class="no-results fade-in">
          <div class="no-results-content">
            <svg viewBox="0 0 24 24" width="64" height="64">
              <path fill="currentColor"
                d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
            </svg>
            <p>{{ $t('books.noResults') }}</p>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>

<script>
import SiteHeader from '../components/SiteHeader.vue';
import BookFilterSection from '../components/BookFilterSection.vue';
import BookCard from '../components/BookCard.vue';
import Pagination from '../components/Pagination.vue';
import SiteFooter from '../components/SiteFooter.vue';
import { bookItems } from '../data/booksData';

export default {
  name: 'Books',
  components: {
    SiteHeader,
    BookFilterSection,
    BookCard,
    Pagination,
    SiteFooter,
  },
  data() {
    return {
      bookItems,
      filters: {
        categories: [],
        tags: [],
        keyword: ''
      },
      currentPage: 1,
      pageSize: 10,
    };
  },
  computed: {
    filteredItems() {
      return this.bookItems.filter(item => {
        const keyword = this.filters.keyword.toLowerCase();
        const keywordMatch = !keyword ||
          item.title.toLowerCase().includes(keyword) ||
          item.author.toLowerCase().includes(keyword) ||
          (item.publisher || '').toLowerCase().includes(keyword) ||
          (item.excerpt || '').toLowerCase().includes(keyword);

        const categoryMatch = this.filters.categories.length === 0 ||
          this.filters.categories.includes(item.category);

        const tagMatch = this.filters.tags.length === 0 ||
          item.tags.some(t => this.filters.tags.includes(t.name));

        return keywordMatch && categoryMatch && tagMatch;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.pageSize) || 1;
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredItems.slice(start, start + this.pageSize);
    }
  },
  methods: {
    handleFilterChange(newFilters) {
      this.filters = { ...newFilters };
      this.currentPage = 1;
    },
    handlePageChange(page) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  }
};
</script>

<style scoped>
.books-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex-grow: 1;
}

.grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  justify-items: center;
}

.no-results {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px 0;
  color: var(--text-muted);
}

.no-results-content {
  text-align: center;
}

.no-results-content svg {
  margin-bottom: 20px;
  opacity: 0.2;
}

@media (max-width: 1200px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}
</style>
