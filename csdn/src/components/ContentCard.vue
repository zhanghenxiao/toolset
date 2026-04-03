<template>
  <div class="content-card fade-in">
    <div class="card-image">
      <img :src="item.image" :alt="item.title" />
      <div class="image-overlay"></div>
    </div>
    <div class="card-body">
      <h3 class="card-title">{{ item.title }}</h3>
      <div class="card-meta">
        <div class="meta-item">
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path fill="currentColor"
              d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
          </svg>
          <span>{{ item.date }}</span>
        </div>
        <div class="meta-item">
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path fill="currentColor"
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <span>{{ item.author }}</span>
        </div>
      </div>
      <p class="card-excerpt">{{ item.excerpt }}</p>
      <div class="card-tags">
        <span v-for="tag in item.tags" :key="tag" class="tag" :class="'tag-' + tag.type">{{ tag.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentCard',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.content-card {
  background: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.content-card:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-hover);
}

.card-image {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.content-card:hover .card-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%);
}

.card-body {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 12px;
  line-height: 1.4;
  height: 3.08rem;
  /* 2 lines */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 12px;
  color: var(--text-muted);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-excerpt {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 20px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  margin-top: auto;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
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
</style>
