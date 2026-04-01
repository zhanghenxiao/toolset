<template>
  <section class="filter-section">
    <div class="container">
      <div class="filter-card fade-in">
        <div class="filter-grid">
          <div class="filter-item">
            <span class="filter-label">{{ $t('search.tagLabel') }}</span>
            <DropdownFilter :placeholder="$t('search.tagPlaceholder')" :options="allTags" v-model="filters.tags"
              :showChips="true" />
          </div>
          <div class="filter-item">
            <span class="filter-label">{{ $t('search.collectionLabel') }}</span>
            <DropdownFilter :placeholder="$t('search.collectionPlaceholder')" :options="allCollections"
              v-model="filters.collections" />
          </div>
          <div class="filter-item">
            <span class="filter-label">{{ $t('search.typeLabel') }}</span>
            <DropdownFilter :placeholder="$t('search.typePlaceholder')" :options="allTypes" v-model="filters.types" />
          </div>
          <div class="filter-item search-box-wrapper">
            <span class="filter-label">{{ $t('search.keywordLabel') }}</span>
            <div class="search-box">
              <input type="text" :placeholder="$t('search.keywordPlaceholder')" class="search-input"
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
          <div class="results-count"
            v-html="$t('search.resultsCount', { total: `<span class='highlight'>${totalResults}</span>` })">
          </div>
          <button v-if="hasFilters" class="clear-btn" @click="clearFilters">{{ $t('search.clear') }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import DropdownFilter from './DropdownFilter.vue';
import { allTags, allCollections, allTypes } from '../data/mockData';

export default {
  name: 'FilterSection',
  components: { DropdownFilter },
  props: {
    totalResults: { type: Number, default: 0 }
  },
  data() {
    return {
      allTags,
      allCollections,
      allTypes,
      filters: {
        tags: [],
        collections: [],
        types: [],
        keyword: ''
      }
    };
  },
  computed: {
    hasFilters() {
      return this.filters.tags.length > 0 ||
        this.filters.collections.length > 0 ||
        this.filters.types.length > 0 ||
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
        tags: [],
        collections: [],
        types: [],
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
  /* z-index: 100; */
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
  grid-template-columns: repeat(2, 1fr);
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
}

.highlight {
  color: var(--primary-color);
  font-weight: 700;
  margin: 0 2px;
  font-size: 16px;
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

/* Dark Mode */
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
