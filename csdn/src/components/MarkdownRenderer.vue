<template>
  <div class="markdown-body" v-html="previewHtml"></div>
</template>

<script>
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; // You can change this to match your theme

const md = new MarkdownIt({
  html: true, // 启用HTML标签解析
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, { language: lang }).value;
        return `<pre class="hljs"><code>${highlighted}</code><button class="copy-btn" data-clipboard-text="${encodeURIComponent(str)}">Copy</button></pre>`;
      } catch (__) { }
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code><button class="copy-btn" data-clipboard-text="${encodeURIComponent(str)}">Copy</button></pre>`;
  }
});

export default {
  name: 'MarkdownRenderer',
  props: {
    content: {
      type: String,
      default: '',
    },
  },
  computed: {
    previewHtml() {
      return md.render(this.content);
    },
  },
  mounted() {
    this.$el.addEventListener('click', this.handleCopy);
    this.addLazyLoading();
  },
  beforeDestroy() {
    this.$el.removeEventListener('click', this.handleCopy);
  },
  watch: {
    content() {
      // 当内容变化时，重新添加懒加载
      this.$nextTick(() => {
        this.addLazyLoading();
      });
    }
  },
  methods: {
    handleCopy(e) {
      if (e.target.classList.contains('copy-btn')) {
        const text = decodeURIComponent(e.target.getAttribute('data-clipboard-text'));
        navigator.clipboard.writeText(text).then(() => {
          const originalText = e.target.innerText;
          e.target.innerText = 'Copied!';
          setTimeout(() => {
            e.target.innerText = originalText;
          }, 2000);
        });
      }
    },
    addLazyLoading() {
      const images = this.$el.querySelectorAll('img');
      images.forEach(img => {
        img.setAttribute('loading', 'lazy');
      });
    }
  }
};
</script>

<style>
.markdown-body {
  color: var(--text-main);
  line-height: 1.6;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 700;
}

.markdown-body h1 {
  font-size: 1.8rem;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 8px;
  color: var(--primary-color);
}

.markdown-body pre {
  position: relative;
  background: #1e293b;
  padding: 16px;
  border-radius: 8px;
  overflow: auto;
  margin: 16px 0;
}

.markdown-body .copy-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  background: var(--primary-color);
  color: white;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.3s;
}

.markdown-body pre:hover .copy-btn {
  opacity: 1;
}

.markdown-body blockquote {
  border-left: 4px solid var(--primary-color);
  padding-left: 16px;
  margin: 16px 0;
  color: var(--text-muted);
  font-style: italic;
}

.markdown-body ul {
  padding-left: 20px;
  margin: 16px 0;
}

.markdown-body li {
  margin-bottom: 8px;
}

.markdown-body img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 16px auto;
}

/* 表格样式 */
.markdown-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 0.9rem;
  overflow-x: auto;
  display: block;
}

.markdown-body thead {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.markdown-body tbody {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.markdown-body th {
  background: rgba(99, 102, 241, 0.12);
  color: var(--text-main);
  font-weight: 700;
  padding: 10px 14px;
  text-align: left;
  border: 1px solid var(--border-color);
  white-space: nowrap;
}

.markdown-body td {
  padding: 9px 14px;
  border: 1px solid var(--border-color);
  color: var(--text-main);
}

.markdown-body tbody tr:nth-child(even) {
  background: rgba(99, 102, 241, 0.04);
}

.markdown-body tbody tr:hover {
  background: rgba(99, 102, 241, 0.08);
}

/* 文章底部强制脚注样式（hr 后的第一个 p） */
.markdown-body hr {
  margin: 32px 0 0;
  border: none;
}

.markdown-body hr+p {
  margin-top: 0;
  padding: 14px 18px 14px 20px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.08));
  border-left: 4px solid var(--primary-color);
  border-radius: 0 8px 8px 0;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-main);
  line-height: 1.7;
  letter-spacing: 0.01em;
  font-style: normal;
}
</style>
