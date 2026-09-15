<template>
    <div class="pagination-container fade-in">
        <div class="pagination">
            <button class="page-btn prev" :disabled="current === 1" :aria-label="$t('pagination.prev')"
                @click="changePage(current - 1)">
                <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
            </button>

            <div class="page-numbers">
                <template v-for="(item, index) in displayedPages">
                    <span v-if="item === 'ellipsis'" :key="pageItemKey(item, index)" class="page-ellipsis"
                        aria-hidden="true">...</span>
                    <button v-else :key="pageItemKey(item, index)" class="page-number"
                        :class="{ active: item === current }" @click="changePage(item)">
                        {{ item }}
                    </button>
                </template>
            </div>

            <button class="page-btn next" :disabled="current === total" :aria-label="$t('pagination.next')"
                @click="changePage(current + 1)">
                <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
            </button>
        </div>

        <div v-if="showInfo" class="pagination-info">
            {{ $t('pagination.info', { total: totalItems, current: current, pages: total }) }}
        </div>
    </div>
</template>

<script>
/** 页码 + 省略号，避免总页数过多时撑破布局 */
function buildDisplayedPages(total, current, siblingCount = 1) {
    if (total <= 1) return total === 1 ? [1] : [];
    const maxWithoutEllipsis = siblingCount * 2 + 5;
    if (total <= maxWithoutEllipsis) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = new Set([1, total]);
    for (let i = current - siblingCount; i <= current + siblingCount; i++) {
        if (i >= 1 && i <= total) pages.add(i);
    }

    const sorted = [...pages].sort((a, b) => a - b);
    const result = [];
    let prev = null;
    for (const p of sorted) {
        if (prev !== null && p - prev > 1) result.push('ellipsis');
        result.push(p);
        prev = p;
    }
    return result;
}

export default {
    name: 'Pagination',
    props: {
        total: { type: Number, required: true },
        current: { type: Number, required: true },
        totalItems: { type: Number, required: true },
        showInfo: { type: Boolean, default: false },
        /** 当前页两侧各展示几个页码 */
        siblingCount: { type: Number, default: 1 }
    },
    computed: {
        displayedPages() {
            return buildDisplayedPages(this.total, this.current, this.siblingCount);
        }
    },
    methods: {
        pageItemKey(item, index) {
            return item === 'ellipsis' ? `ellipsis-${index}` : `page-${item}`;
        },
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
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
}

.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    max-width: 100%;
}

.page-numbers {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.page-btn,
.page-number {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
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
    font-size: 14px;
}

.page-ellipsis {
    min-width: 24px;
    height: 40px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    font-size: 14px;
    letter-spacing: 1px;
    user-select: none;
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
    text-align: center;
}

@media (max-width: 480px) {

    .page-btn,
    .page-number {
        width: 36px;
        height: 36px;
    }

    .page-ellipsis {
        width: 20px;
        height: 36px;
    }
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
