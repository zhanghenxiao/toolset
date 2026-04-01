<template>
  <div class="markdown-body" v-html="previewHtml"></div>
</template>

<script>
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; // You can change this to match your theme

const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, { language: lang }).value;
        return `<pre class="hljs"><code>${highlighted}</code><button class="copy-btn" data-clipboard-text="${encodeURIComponent(str)}">Copy</button></pre>`;
      } catch (__) {}
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
  },
  beforeDestroy() {
    this.$el.removeEventListener('click', this.handleCopy);
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
    }
  }
};
</script>

<style>
.markdown-body {
  color: var(--text-main);
  line-height: 1.6;
}

.markdown-body h1, .markdown-body h2, .markdown-body h3 {
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
</style>
