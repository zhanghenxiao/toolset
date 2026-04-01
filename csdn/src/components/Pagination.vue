<template>
    <div class="pagination-container fade-in">
        <div class="pagination">
            <button class="page-btn prev" :disabled="current === 1" @click="changePage(current - 1)">
                <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
            </button>

            <div class="page-numbers">
                <button v-for="page in displayedPages" :key="page" class="page-number"
                    :class="{ active: page === current }" @click="changePage(page)">
                    {{ page }}
                </button>
            </div>

            <button class="page-btn next" :disabled="current === total" @click="changePage(current + 1)">
                <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
            </button>
        </div>

        <div class="pagination-info">
            {{ $t('pagination.info', { total: totalItems, current: current, pages: total }) }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'Pagination',
    props: {
        total: { type: Number, required: true },
        current: { type: Number, required: true },
        totalItems: { type: Number, required: true }
    },
    computed: {
        displayedPages() {
            const pages = [];
            for (let i = 1; i <= this.total; i++) {
                pages.push(i);
            }
            return pages;
        }
    },
    methods: {
        changePage(page) {
            if (page >= 1 && page <= this.total) {
                this.$emit('change', page);
            }
        }
    }
};
</script>

<style scoped>
.pagination-container {
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.pagination {
    display: flex;
    align-items: center;
    gap: 8px;
}

.page-numbers {
    display: flex;
    gap: 8px;
}

.page-btn,
.page-number {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-main);
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 500;
}

.page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-btn:not(:disabled):hover,
.page-number:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    background: rgba(26, 115, 232, 0.05);
}

.page-number.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px rgba(26, 115, 232, 0.3);
}

.pagination-info {
    font-size: 14px;
    color: var(--text-muted);
    margin-bottom: 10px;
}

/* Dark Mode */
[data-theme="dark"] .page-btn,
[data-theme="dark"] .page-number {
    background: var(--card-bg);
    border-color: var(--border-color);
    color: var(--text-main);
}

[data-theme="dark"] .page-number.active {
    background: var(--primary-color);
    color: white;
}
</style>
