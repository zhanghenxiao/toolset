import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: '../',
    emptyOutDir: false,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vue 核心库
          if (id.includes('node_modules/vue/') ||
              id.includes('node_modules/vue-router/') ||
              id.includes('node_modules/vue-i18n/')) {
            return 'vue-vendor';
          }
          // 代码高亮
          if (id.includes('node_modules/highlight.js/')) {
            return 'highlight';
          }
          // Markdown 渲染
          if (id.includes('node_modules/markdown-it/') ||
              id.includes('node_modules/entities/') ||
              id.includes('node_modules/linkify-it/') ||
              id.includes('node_modules/mdurl/') ||
              id.includes('node_modules/uc.micro/')) {
            return 'markdown';
          }
          // FFmpeg（按需加载，单独拆包）
          if (id.includes('node_modules/@ffmpeg/')) {
            return 'ffmpeg';
          }
        },
      },
    },
  },
});
