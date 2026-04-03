<template>
  <div class="content-detail-page">
    <SiteHeader />

    <main class="container detail-container fade-in">
      <div v-if="item" class="detail-layout">
        <!-- Main Content (Left) -->
        <div class="main-content">
          <!-- Video Player Placeholder -->
          <div class="video-player">
            <img :src="item.image" alt="Thumbnail" />
            <div class="player-overlay">
              <div class="play-btn-large">
                <svg viewBox="0 0 24 24" width="48" height="48">
                  <path fill="white" d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="content-info">
            <h1 class="detail-title">{{ item.title }}</h1>

            <div class="social-links-bar">
              <button class="social-btn douyin"><span>DouYin</span></button>
              <button class="social-btn bilibili"><span>BiliBili</span></button>
              <button class="social-btn youtube"><span>Youtube</span></button>
            </div>

            <div class="meta-data-section">
              <div class="full-meta">
                <div class="meta-row">
                  <span class="meta-label">发布时间:</span>
                  <span class="meta-value">{{ item.date }}</span>
                  <span class="meta-label ml-20">作者:</span>
                  <span class="meta-value">{{ item.author }}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-label">浏览数:</span>
                  <span class="meta-value">{{ item.views }} 次</span>
                  <span class="meta-label ml-20">分类:</span>
                  <span class="meta-value">{{ item.category }}</span>
                </div>
              </div>

              <div class="interaction-bar">
                <div class="stats-group">
                  <button class="stat-btn">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path fill="currentColor"
                        d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                    </svg>
                    <span>0</span>
                  </button>
                  <button class="stat-btn">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path fill="currentColor"
                        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span>0</span>
                  </button>
                  <button class="stat-btn">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path fill="currentColor"
                        d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                    </svg>
                    <span>0</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="detail-tags">
              <span v-for="tag in item.tags" :key="tag.name" class="tag" :class="'tag-' + tag.type">{{ tag.name
              }}</span>
            </div>

            <section class="markdown-section">
              <div class="section-header">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor"
                    d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                </svg>
                <span>支持内容</span>
              </div>
              <div class="markdown-content-card">
                <MarkdownRenderer :content="item.markdownContent" />
              </div>
            </section>
          </div>
        </div>

        <!-- Sidebar (Right) -->
        <RelatedContent :items="relatedItems" @select="goToDetail" />
      </div>
      <div v-else class="not-found">
        Loading...
      </div>

      <section class="recommendations">
        <div class="section-header">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.13-14.71a.5.5 0 0 0-.58.12l-3 4a.5.5 0 0 0 .4.8h1.55l-2.07 4.14a.5.5 0 0 0 .45.72h2l-2.22 4.44a.5.5 0 0 0 .89.44l7-14a.5.5 0 0 0-.42-.66z" />
          </svg>
          <span>相关推荐</span>
        </div>
        <div class="grid">
          <ContentCard v-for="rec in recommendationItems" :key="rec.id" :item="rec"
            @click.native="goToDetail(rec.id)" />
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<script>
import SiteHeader from '../components/SiteHeader.vue';
import SiteFooter from '../components/SiteFooter.vue';
import ContentCard from '../components/ContentCard.vue';
import RelatedContent from '../components/RelatedContent.vue';
import MarkdownRenderer from '../components/MarkdownRenderer.vue';
import { contentItems } from '../data/mockData';

export default {
  name: 'ContentDetail',
  components: {
    SiteHeader,
    SiteFooter,
    ContentCard,
    RelatedContent,
    MarkdownRenderer,
  },
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      item: null,
      relatedItems: [],
      recommendationItems: [],
    };
  },
  watch: {
    slug: {
      handler: 'loadItem',
      immediate: true,
    }
  },
  methods: {
    loadItem() {
      this.item = contentItems.find(i => i.slug === this.slug);
      if (this.item) {
        // Dynamic related content (unlimited)
        this.relatedItems = contentItems.filter(i => this.item.relatedIds.includes(i.id));

        // Dynamic recommendations (exactly 4)
        const recIds = this.item.recommendationIds;
        this.recommendationItems = contentItems.filter(i => recIds.includes(i.id)).slice(0, 4);
      }
    },
    goToDetail(id) {
      const target = contentItems.find(i => i.id === id);
      if (target) {
        // In Vue Router 3, we can use the name or path. Using path for clarity with slug.
        if (target.slug !== this.slug) {
          this.$router.push(`/detail/${target.slug}`);
        }
      }
    }
  }
};
</script>

<style scoped>
.content-detail-page {
  background: var(--bg-color);
}

.detail-container {
  padding-top: 24px;
  padding-bottom: 60px;
}

.detail-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}

.main-content {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow);
}

.video-player {
  position: relative;
  aspect-ratio: 16 / 9;
  background: #000;
}

.video-player img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
}

.player-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-btn-large {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  cursor: pointer;
  transition: transform 0.3s;
}

.play-btn-large:hover {
  transform: scale(1.1);
}

.content-info {
  padding: 30px;
}

.detail-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--text-main);
}

.interaction-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.stat-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-left: 10px;
  color: var(--text-muted);
  transition: all 0.3s;
  background: transparent;
  cursor: pointer;
}

.stat-btn:hover {
  color: var(--primary-color);
  border-color: var(--primary-color);
  background: rgba(26, 115, 232, 0.05);
}

.social-links-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
}

.social-btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  border: 1px solid var(--border-color);
  transition: all 0.3s;
  background: white;
  cursor: pointer;
}

.douyin:hover {
  background: #000;
  color: white;
}

.bilibili:hover {
  background: #fb7299;
  color: white;
}

.youtube:hover {
  background: #ff0000;
  color: white;
}

.meta-data-section {
  background: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.full-meta {
  flex: 1;
}

.interaction-bar {
  display: flex;
  align-items: center;
}

.meta-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.meta-label {
  color: var(--text-muted);
  font-size: 14px;
}

.meta-value {
  font-weight: 600;
  font-size: 14px;
  margin-left: 8px;
  color: var(--text-main);
}

.ml-20 {
  margin-left: 40px;
}

.detail-tags {
  display: flex;
  gap: 10px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.tag {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  border: 1px solid transparent;
}

.tag-blue {
  background: rgba(26, 115, 232, 0.1);
  color: var(--primary-color);
  border-color: rgba(26, 115, 232, 0.2);
}

.tag-green {
  background: rgba(52, 168, 83, 0.1);
  color: #34a853;
  border-color: rgba(52, 168, 83, 0.2);
}

.markdown-section {
  border-top: 1px solid var(--border-color);
  padding-top: 40px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--text-main);
}

.markdown-content-card {
  background: white;
  border: 1px solid #e0e7ff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.recommendations {
  margin-top: 60px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.not-found {
  padding: 100px;
  text-align: center;
  font-size: 1.5rem;
  color: var(--text-muted);
}

/* Dark Mode Overrides */
[data-theme="dark"] .main-content,
[data-theme="dark"] .markdown-content-card,
[data-theme="dark"] .meta-data-section {
  background: var(--card-bg);
  border-color: var(--border-color);
}

[data-theme="dark"] .full-meta,
[data-theme="dark"] .stat-btn,
[data-theme="dark"] .social-btn {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-main);
}

@media (max-width: 1024px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }

  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .ml-20 {
    margin-left: 20px;
  }
}
</style>
