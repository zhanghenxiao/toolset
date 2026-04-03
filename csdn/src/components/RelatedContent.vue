<template>
    <aside class="sidebar">
        <div class="sidebar-header">
            <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="var(--primary-color)"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-4h2v4zm0-6h-2V7h2v4z" />
            </svg>
            <span>关联内容</span>
        </div>
        <div class="related-list">
            <div v-for="related in items" :key="related.id" class="related-item" @click="handleItemClick(related.id)">
                <div class="related-thumb">
                    <img :src="related.image" alt="Thumbnail" />
                </div>
                <div class="related-info">
                    <h4 class="related-title">{{ related.title }}</h4>
                    <div class="related-meta">
                        <span>时长: {{ related.duration }}</span>
                        <span class="author">| {{ related.author }}</span>
                    </div>
                    <div class="related-tags">
                        <span v-for="tag in related.tags.slice(0, 2)" :key="tag.name" class="mini-tag">{{ tag.name
                        }}</span>
                    </div>
                </div>
            </div>
        </div>
    </aside>
</template>

<script>
export default {
    name: 'RelatedContent',
    props: {
        items: {
            type: Array,
            required: true
        }
    },
    methods: {
        handleItemClick(id) {
            this.$emit('select', id);
        }
    }
};
</script>

<style scoped>
.sidebar {
    display: flex;
    flex-direction: column;
}

.sidebar-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    padding: 16px;
    background: white;
    border-radius: 12px 12px 0 0;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-main);
}

.related-list {
    background: white;
    border-radius: 0 0 12px 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: var(--shadow);
}

.related-item {
    display: flex;
    gap: 12px;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: background 0.3s;
}

.related-item:hover {
    background: #f8f9fa;
}

.related-thumb {
    width: 100px;
    height: 56px;
    border-radius: 4px;
    overflow: hidden;
    flex-shrink: 0;
    border: 1px solid var(--border-color);
}

.related-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.related-title {
    font-size: 13px;
    font-weight: 600;
    line-height: 1.4;
    margin-bottom: 4px;
    color: var(--text-main);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.related-meta {
    font-size: 11px;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 4px;
}

.related-tags {
    display: flex;
    gap: 4px;
    margin-top: 4px;
}

.mini-tag {
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    background: rgba(26, 115, 232, 0.1);
    color: var(--primary-color);
    border: 1px solid rgba(26, 115, 232, 0.2);
}

/* Dark Mode Overrides */
[data-theme="dark"] .sidebar-header,
[data-theme="dark"] .related-list {
    background: var(--card-bg);
    border-color: var(--border-color);
}

[data-theme="dark"] .related-item:hover {
    background: rgba(255, 255, 255, 0.05);
}
</style>
