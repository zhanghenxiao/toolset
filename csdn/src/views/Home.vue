<template>
  <div class="home-page">
    <SiteHeader />
    <main>
      <FilterSection :totalResults="filteredItems.length" @filter-change="handleFilterChange" />

      <section class="container py-40">
        <div v-if="paginatedItems.length > 0">
          <div class="grid fade-in">
            <ContentCard v-for="item in paginatedItems" :key="item.id" :item="item"
              @click.native="goToDetail(item.id)" />
          </div>

          <Pagination :total="totalPages" :current="currentPage" :totalItems="filteredItems.length"
            @change="handlePageChange" />
        </div>
        <div v-else class="no-results fade-in">
          <div class="no-results-content">
            <svg viewBox="0 0 24 24" width="64" height="64">
              <path fill="currentColor"
                d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <p>{{ $t('search.noResults') }}</p>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>

<script>
import SiteHeader from '../components/SiteHeader.vue';
import FilterSection from '../components/FilterSection.vue';
import ContentCard from '../components/ContentCard.vue';
import Pagination from '../components/Pagination.vue';
import SiteFooter from '../components/SiteFooter.vue';
import { contentItems } from '../data/mockData';

export default {
  name: 'Home',
  components: {
    SiteHeader,
    FilterSection,
    ContentCard,
    Pagination,
    SiteFooter,
  },
  data() {
    return {
      contentItems,
      filters: {
        tags: [],
        collections: [],
        types: [],
        keyword: ''
      },
      currentPage: 1,
      pageSize: 8,
    };
  },
  computed: {
    filteredItems() {
      return this.contentItems.filter(item => {
        const keywordMatch = !this.filters.keyword ||
          item.title.toLowerCase().includes(this.filters.keyword.toLowerCase()) ||
          item.excerpt.toLowerCase().includes(this.filters.keyword.toLowerCase());

        const tagMatch = this.filters.tags.length === 0 ||
          item.tags.some(t => this.filters.tags.includes(t.name));

        const collectionMatch = this.filters.collections.length === 0 ||
          this.filters.collections.includes(item.collection);

        const typeMatch = this.filters.types.length === 0 ||
          this.filters.types.includes(item.category);

        return keywordMatch && tagMatch && collectionMatch && typeMatch;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.pageSize) || 1;
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredItems.slice(start, end);
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
    goToDetail(id) {
      const item = this.contentItems.find(i => i.id === id);
      if (item) {
        this.$router.push(`/detail/${item.slug}`);
      }
    }
  }
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex-grow: 1;
}

.content-grid-section {
  padding: 0 0 80px 0;
  background: var(--bg-color);
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
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
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
