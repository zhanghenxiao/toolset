<template>
  <section class="filter-section">
    <div class="container">
      <div class="filter-card fade-in">
        <div class="filter-grid">
          <div class="filter-item">
            <span class="filter-label">{{ $t('books.categoryLabel') }}</span>
            <DropdownFilter :placeholder="$t('books.categoryPlaceholder')" :options="allBookCategories"
              v-model="filters.categories" />
          </div>
          <div class="filter-item">
            <span class="filter-label">{{ $t('books.tagLabel') }}</span>
            <DropdownFilter :placeholder="$t('books.tagPlaceholder')" :options="allBookTags" v-model="filters.tags"
              :showChips="true" />
          </div>
          <div class="filter-item search-box-wrapper">
            <span class="filter-label">{{ $t('books.keywordLabel') }}</span>
            <div class="search-box">
              <input type="text" :placeholder="$t('books.keywordPlaceholder')" class="search-input"
                v-model="filters.keyword" @keyup.enter="handleSearch" />
              <button class="search-btn" @click="handleSearch">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor"
                    d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="results-bar">
          <div class="results-count" v-html="$t('books.resultsCount')">
          </div>
          <button v-if="hasFilters" class="clear-btn" @click="clearFilters">{{ $t('books.clear') }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import DropdownFilter from './DropdownFilter.vue';
import { allBookCategories, allBookTags } from '../data/booksData';

export default {
  name: 'BookFilterSection',
  components: { DropdownFilter },
  props: {},
  data() {
    return {
      allBookCategories,
      allBookTags,
      filters: {
        categories: [],
        tags: [],
        keyword: ''
      }
    };
  },
  computed: {
    hasFilters() {
      return this.filters.categories.length > 0 ||
        this.filters.tags.length > 0 ||
        this.filters.keyword !== '';
    }
  },
  watch: {
    filters: {
      deep: true,
      handler(val) {
        this.$emit('filter-change', { ...val });
      }
    }
  },
  methods: {
    handleSearch() {
      this.$emit('filter-change', { ...this.filters });
    },
    clearFilters() {
      this.filters = {
        categories: [],
        tags: [],
        keyword: ''
      };
    }
  }
};
</script>

<style scoped>
.filter-section {
  padding: 40px 0;
  background: var(--bg-color);
  position: relative;
  overflow: visible;
}

.filter-card {
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.02);
  position: relative;
  z-index: 20;
  overflow: visible;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  padding-left: 4px;
}

.search-box {
  display: flex;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  overflow: hidden;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-right: none;
  font-size: 14px;
  outline: none;
  border-radius: 8px 0 0 8px;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: var(--primary-color);
}

.search-btn {
  background: var(--primary-color);
  color: white;
  padding: 0 24px;
  cursor: pointer;
  transition: background 0.3s;
  border-radius: 0 8px 8px 0;
}

.search-btn:hover {
  background: var(--primary-hover);
}

.results-bar {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.results-count {
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.5;
}

.results-count :deep(.highlight),
.results-count :deep(.highlight-link) {
  color: var(--primary-color);
  font-weight: 800;
  font-size: 18px;
  margin: 0 2px;
}

.results-count :deep(.highlight-link) {
  text-decoration: none;
}

.results-count :deep(.highlight-link:hover) {
  text-decoration: underline;
}

.clear-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.3s;
}

.clear-btn:hover {
  color: var(--primary-color);
  border-color: var(--primary-color);
  background: rgba(26, 115, 232, 0.05);
}

[data-theme="dark"] .filter-card {
  background: var(--card-bg);
  border-color: var(--border-color);
}

[data-theme="dark"] .search-input {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--border-color);
  color: var(--text-main);
}

[data-theme="dark"] .results-bar {
  border-color: var(--border-color);
}

@media (max-width: 768px) {
  .filter-grid {
    grid-template-columns: 1fr;
  }
}
</style>
