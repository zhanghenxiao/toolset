<template>
  <view
    class="reader-page"
    :class="{ 'night-mode': isNightMode }"
    :style="{ backgroundColor: bgColors[bgColorIndex].value, color: bgColors[bgColorIndex].textColor }"
  >
    <!-- 顶部标题栏 -->
    <view
      class="reader-header"
      :class="{ 'header-hidden': !showMenu }"
      :style="{ backgroundColor: bgColors[bgColorIndex].value, color: bgColors[bgColorIndex].textColor }"
    >
      <view class="header-content">
        <view class="header-left" @tap.stop="goBack">
          <text class="back-icon">←</text>
          <text class="book-title">{{ bookInfo.title }}</text>
        </view>
        <view class="header-right">
          <text class="header-btn" @tap.stop="addToBookshelf">加入书架</text>
        </view>
      </view>
    </view>

    <!-- 阅读内容区 - 支持区域点击和滑动 -->
    <scroll-view
      class="reader-content"
      :scroll-y="pageFlipMode === 'swipe'"
      :scroll-with-animation="false"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
      @tap="onContentTap"
    >
      <view class="content-wrapper" :class="{ 'scroll-wrapper': pageFlipMode === 'swipe' }" :style="contentStyle">
        <text class="chapter-title-text">{{ currentChapter.title }}</text>
        <text class="content-text">{{ pageFlipMode === 'swipe' ? displayContent : currentPageText }}</text>
      </view>
    </scroll-view>

    <!-- 全屏 Loading -->
    <view v-if="loading" class="loading-mask">
      <view class="loading-content">
        <view class="loading-spinner"></view>
        <text class="loading-text">正在加载书籍内容...</text>
      </view>
    </view>

    <!-- 底部菜单栏（极简风格） -->
    <view
      class="reader-footer"
      :class="{ 'footer-hidden': !showMenu }"
      :style="{ backgroundColor: bgColors[bgColorIndex].value, color: bgColors[bgColorIndex].textColor }"
    >
      <!-- 进度条 + 上一章/下一章箭头 -->
      <view class="progress-bar-section">
        <text 
          class="arrow-btn" 
          :class="{ disabled: currentChapterNum <= 1 }"
          @tap.stop="prevChapter"
        >
          &lt; 上一章
        </text>
        
        <slider 
          class="progress-slider"
          :value="currentChapterNum" 
          :min="1" 
          :max="totalChapters"
          @change="onChapterSliderChange"
          activeColor="#999"
          backgroundColor="#e0e0e0"
          block-size="16"
        />
        
        <text 
          class="arrow-btn" 
          :class="{ disabled: currentChapterNum >= totalChapters }"
          @tap.stop="nextChapter"
        >
          下一章 &gt;
        </text>
      </view>
      
      <!-- 底部图标菜单 -->
      <view class="bottom-menu">
        <view class="menu-item" @tap.stop="showCatalog">
          <text class="menu-icon">☰</text>
          <text class="menu-label">目录</text>
        </view>
        

        <view class="menu-item" @tap.stop="toggleDayNightMode">
          <text class="menu-icon">{{ isNightMode ? '☀' : '☾' }}</text>
          <text class="menu-label">{{ isNightMode ? '日间' : '夜间' }}</text>
        </view>
        
        <view class="menu-item" @tap.stop="showSettings">
          <text class="menu-icon">⚙</text>
          <text class="menu-label">设置</text>
        </view>
      </view>
    </view>

    <!-- 目录弹窗 -->
    <view v-if="showCatalogModal" class="modal-mask" @tap="showCatalogModal = false">
      <view
        class="catalog-modal"
        :style="{ backgroundColor: bgColors[bgColorIndex].value, color: bgColors[bgColorIndex].textColor }"
        @tap.stop
      >
        <view class="modal-header">
          <text class="modal-title">目录</text>
          <text class="modal-close" @tap="showCatalogModal = false">×</text>
        </view>
        <scroll-view class="catalog-list" scroll-y>
          <view 
            v-for="(chapter, index) in chapters" 
            :key="index"
            class="catalog-item"
            :class="{ 'active': currentChapterNum === chapter.chapter }"
            @tap="jumpToChapter(chapter.chapter)"
          >
            <text>{{ chapter.title }}</text>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 设置弹窗 -->
    <view v-if="showSettingsModal" class="modal-mask" @tap="showSettingsModal = false">
      <view
        class="settings-modal"
        :style="{ backgroundColor: bgColors[bgColorIndex].value, color: bgColors[bgColorIndex].textColor }"
        @tap.stop
      >
        <view class="modal-header">
          <text class="modal-title">阅读设置</text>
          <text class="modal-close" @tap="showSettingsModal = false">×</text>
        </view>
        
        <view class="settings-content">
          <!-- 字体大小 -->
          <view class="setting-section">
            <text class="setting-label">字体大小</text>
            <view class="setting-control">
              <button class="control-btn" @tap="decreaseFontSize">A-</button>
              <slider 
                class="size-slider"
                :value="fontSize" 
                :min="12" 
                :max="24"
                @change="onFontSizeChange"
                activeColor="#007aff"
              />
              <button class="control-btn" @tap="increaseFontSize">A+</button>
            </view>
          </view>

          <!-- 字体选择 -->
          <view class="setting-section">
            <text class="setting-label">字体</text>
            <view class="option-group">
              <view 
                v-for="(font, index) in fontFamilies"
                :key="index"
                class="option-item"
                :class="{ 'active': fontFamilyIndex === index }"
                @tap="fontFamilyIndex = index; saveReadingSettings()"
              >
                <text :style="{ fontFamily: font.value }">{{ font.name }}</text>
              </view>
            </view>
          </view>

          <!-- 行距 -->
          <view class="setting-section">
            <text class="setting-label">行距</text>
            <view class="option-group">
              <view 
                v-for="(spacing, index) in lineSpacings"
                :key="index"
                class="option-item"
                :class="{ 'active': lineHeight === spacing }"
                @tap="lineHeight = spacing; saveReadingSettings()"
              >
                <text>{{ spacing }}</text>
              </view>
            </view>
          </view>

          <!-- 背景颜色 -->
          <view class="setting-section">
            <text class="setting-label">背景</text>
            <view class="color-group">
              <view 
                v-for="(bg, index) in bgColors"
                :key="index"
                class="color-item"
                :class="{ 'active': bgColorIndex === index }"
                :style="{ backgroundColor: bg.value }"
                @tap="selectBackground(index)"
              >
                <text class="color-name" :style="{ color: bg.textColor }">{{ bg.name }}</text>
              </view>
            </view>
          </view>

          <!-- 翻页方式 -->
          <view class="setting-section">
            <text class="setting-label">翻页方式</text>
            <view class="option-group">
              <view 
                v-for="(mode, index) in pageFlipModes"
                :key="index"
                class="option-item"
                :class="{ 'active': pageFlipMode === mode.value }"
                @tap="pageFlipMode = mode.value; saveReadingSettings()"
              >
                <text>{{ mode.name }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { parseChapters, cleanChapterContent } from '@/utils/chapter-parser';
import booksData from '@/data/books';
import { addToBookshelf } from '@/utils/bookshelf';
import { parseNetdiskUrl } from '@/utils/pan-parser.js';

import { bookTxtUrl } from '@/utils/config';

function getBookContentUrl(book) {
  if (!book) return '';
  if (book.contentUrl || book.ossUrl) return book.contentUrl || book.ossUrl;
  return bookTxtUrl(book.downloadUrl);
}

function callCloudFunction(name, data) {
  if (typeof uniCloud === 'undefined' || !uniCloud.callFunction) {
    return Promise.reject(new Error('当前平台不支持 uniCloud'));
  }
  return uniCloud.callFunction({ name, data });
}




export default {
  data() {
    return {
      bookInfo: {},
      chapters: [],
      currentChapterNum: 1,
      currentChapter: { title: '', content: '' },
      totalChapters: 0,
      fullContent: '',
      loading: false,
      showMenu: false,
      showCatalogModal: false,
      showSettingsModal: false,
      
      // 阅读时长追踪
      readingStartTime: 0,
      totalReadingTime: 0,
      hasAutoAddedToBookshelf: false,
      
      // 分页相关
      currentPage: 1,
      totalPages: 1,
      pages: [],
      viewportWidth: 0,
      viewportHeight: 0,
      
      // 触摸相关
      touchStartX: 0,
      touchStartY: 0,
      touchStartTime: 0,
      
      // 字体设置
      fontSize: 16,
      fontFamilyIndex: 0,
      fontFamilies: [
        { name: '系统默认', value: 'system-ui, -apple-system' },
        { name: '宋体', value: 'SimSun, serif' },
        { name: '楷体', value: 'KaiTi, serif' },
        { name: '等宽', value: 'Consolas, monospace' }
      ],
      
      // 行距
      lineHeight: 1.8,
      lineSpacings: [1.0, 1.2, 1.5, 1.8, 2.0, 2.5, 3.0],
      
      // 背景色
      bgColorIndex: 0,
      isNightMode: false,
      bgColors: [
        { name: '白天', value: '#f5f5f5', textColor: '#333' },
        { name: '护眼', value: '#e8f4f0', textColor: '#333' },
        { name: '羊皮纸', value: '#fef7e0', textColor: '#333' },
        { name: '夜间', value: '#2b2b2b', textColor: '#d0d0d0' }
      ],
      
      // 翻页方式
      pageFlipMode: 'horizontal',
      pageFlipModes: [
        { name: '左右翻页', value: 'horizontal' },
        { name: '上下翻页', value: 'vertical' },
        { name: '滚屏', value: 'swipe' }
      ],
      
      // 自动翻页
      autoFlipInterval: 0,
      autoFlipIntervals: [
        { name: '关闭', value: 0 },
        { name: '5秒', value: 5000 },
        { name: '10秒', value: 10000 },
        { name: '15秒', value: 15000 },
        { name: '30秒', value: 30000 }
      ],
      autoFlipTimer: null
    };
  },
  
  computed: {
    contentStyle() {
      const bgConfig = this.bgColors[this.bgColorIndex];
      const fontFamily = this.fontFamilies[this.fontFamilyIndex];
      
      return {
        fontSize: `${this.fontSize}px`,
        lineHeight: this.lineHeight,
        backgroundColor: bgConfig.value,
        color: bgConfig.textColor,
        fontFamily: fontFamily.value,
        height: this.pageFlipMode === 'swipe' ? 'auto' : '100%',
        minHeight: this.pageFlipMode === 'swipe' ? '100%' : '0',
        boxSizing: 'border-box'
      };
    },
    
    displayContent() {
      return cleanChapterContent(this.currentChapter.content);
    },

    currentPageText() {
      return this.pages[this.currentPage - 1] || '';
    }
  },
  
  onLoad(options) {
    const id = parseInt(options.bookId);
    this.loadBookInfo(id);
    this.loadReadingSettings();
    this.loadReadingProgress(id);
    
    // 记录阅读开始时间
    this.readingStartTime = Date.now();
  },
  
  onUnload() {
    this.checkAndAutoAddToBookshelf();
    this.saveReadingProgress();
    this.clearAutoFlip();
  },
  
  onHide() {
    // 切换到后台时累计阅读时长
    if (this.readingStartTime > 0) {
      this.totalReadingTime += Date.now() - this.readingStartTime;
      this.readingStartTime = 0;
    }
  },
  
  onShow() {
    // 从后台返回时重新开始计时
    this.readingStartTime = Date.now();
  },
  
  methods: {
    // ============ 触摸手势处理 ============
    onTouchStart(e) {
      this.touchStartX = e.touches[0].pageX;
      this.touchStartY = e.touches[0].pageY;
      this.touchStartTime = Date.now();
    },
    
    onTouchEnd(e) {
      const touchEndX = e.changedTouches[0].pageX;
      const touchEndY = e.changedTouches[0].pageY;
      const touchDuration = Date.now() - this.touchStartTime;
      
      const deltaX = touchEndX - this.touchStartX;
      const deltaY = touchEndY - this.touchStartY;
      
      // 左右翻页模式：只响应左右滑动 - 页内翻页
      if (this.pageFlipMode === 'horizontal' && Math.abs(deltaX) > 50 && touchDuration < 300) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > 0) {
            // 右滑 - 上一页
            this.prevPage();
          } else {
            // 左滑 - 下一页
            this.nextPage();
          }
        }
      }
      
      // 上下翻页模式：只响应上下滑动 - 页内翻页
      if (this.pageFlipMode === 'vertical' && Math.abs(deltaY) > 50 && touchDuration < 300) {
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          if (deltaY > 0) {
            // 下滑 - 上一页
            this.prevPage();
          } else {
            // 上滑 - 下一页
            this.nextPage();
          }
        }
      }
      
      // 滚屏模式交给 scroll-view 处理连续上下滚动，不执行页码切换
      if (this.pageFlipMode === 'swipe') {
        return;
      }
    },
    
    // 区域点击翻页
    onContentTap(e) {
      const screenWidth = uni.getSystemInfoSync().screenWidth;
      const tapX = e.detail.x;

      if (this.pageFlipMode === 'swipe') {
        if (tapX >= screenWidth / 3 && tapX <= screenWidth * 2 / 3) {
          this.toggleMenu();
        }
        return;
      }
      
      // 点击左侧 1/3 - 上一页
      if (tapX < screenWidth / 3) {
        if (!this.showMenu) {
          this.prevPage();
        } else {
          this.toggleMenu();
        }
      }
      // 点击右侧 1/3 - 下一页
      else if (tapX > screenWidth * 2 / 3) {
        if (!this.showMenu) {
          this.nextPage();
        } else {
          this.toggleMenu();
        }
      }
      // 点击中间 1/3 - 唤出菜单
      else {
        this.toggleMenu();
      }
    },
    
    // 切换菜单显示
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    
    // ============ 章节导航 ============
    loadChapter(chapterNum, position = 'first') {
      if (chapterNum < 1 || chapterNum > this.totalChapters) return;
      
      const chapter = this.chapters.find(ch => ch.chapter === chapterNum);
      if (chapter) {
        this.currentChapterNum = chapterNum;
        this.currentChapter = chapter;
        this.saveReadingProgress();
        this.showMenu = false;
        this.showCatalogModal = false;
        
        this.currentPage = 1;
        this.totalPages = 1;
        this.pages = [];

        this.$nextTick(() => {
          this.calculatePages(position);
        });
        
        // 重置自动翻页
        if (this.autoFlipInterval > 0) {
          this.clearAutoFlip();
          this.startAutoFlip();
        }
      }
    },
    
    prevChapter() {
      if (this.currentChapterNum > 1) {
        this.loadChapter(this.currentChapterNum - 1);
      } else {
        uni.showToast({ title: '已是第一章', icon: 'none' });
      }
    },
    
    nextChapter() {
      if (this.currentChapterNum < this.totalChapters) {
        this.loadChapter(this.currentChapterNum + 1);
      } else {
        uni.showToast({ title: '已是最后一章', icon: 'none' });
      }
    },
    
    onChapterSliderChange(e) {
      this.loadChapter(e.detail.value);
    },
    
    jumpToChapter(chapterNum) {
      this.loadChapter(chapterNum);
    },
    
    // ============ 页内翻页 ============
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      } else if (this.currentChapterNum > 1) {
        this.loadChapter(this.currentChapterNum - 1, 'last');
      } else {
        uni.showToast({ title: '已是第一章第一页', icon: 'none', duration: 1000 });
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
      } else if (this.currentChapterNum < this.totalChapters) {
        this.loadChapter(this.currentChapterNum + 1, 'first');
      } else {
        uni.showToast({ title: '已是最后一章最后一页', icon: 'none', duration: 1200 });
      }
    },

    getViewportSize(callback) {
      const systemInfo = uni.getSystemInfoSync();
      const query = uni.createSelectorQuery().in(this);
      query.select('.reader-content').boundingClientRect();
      query.select('.reader-header').boundingClientRect();
      query.select('.reader-footer').boundingClientRect();
      query.exec(result => {
        const contentRect = result && result[0];
        const headerRect = result && result[1];
        const footerRect = result && result[2];
        const width = contentRect && contentRect.width || systemInfo.windowWidth || systemInfo.screenWidth;
        const height = contentRect && contentRect.height || Math.max(0,
          (systemInfo.windowHeight || systemInfo.screenHeight) -
          (headerRect ? headerRect.height : 0) -
          (footerRect ? footerRect.height : 0)
        );
        this.viewportWidth = width;
        this.viewportHeight = height;
        if (callback) callback(width, height);
      });
    },

    calculatePages(position = 'first') {
      this.getViewportSize((width, height) => {
        const paddingX = uni.upx2px(40);
        const paddingTop = uni.upx2px(120);
        const paddingBottom = uni.upx2px(180);
        const linePx = Math.max(1, this.fontSize * this.lineHeight);
        const titleLines = 2;
        const availableWidth = Math.max(this.fontSize, width - paddingX * 2);
        const charsPerLine = Math.max(1, Math.floor(availableWidth / (this.fontSize * 1.05)));
        const bodyLines = Math.max(1, Math.floor((height - paddingTop - paddingBottom) / linePx));
      const firstPageLines = Math.max(1, bodyLines - titleLines);
      const lines = [];
      const text = this.displayContent.replace(/\r\n/g, '\n');

      text.split('\n').forEach(paragraph => {
        const normalized = paragraph || ' ';
        for (let index = 0; index < normalized.length; index += charsPerLine) {
          lines.push(normalized.slice(index, index + charsPerLine));
        }
      });

      const result = [];
      let cursor = 0;
      while (cursor < lines.length) {
        const size = result.length === 0 ? firstPageLines : bodyLines;
        result.push(lines.slice(cursor, cursor + size).join('\n'));
        cursor += size;
      }
      this.pages = result.length ? result : [''];
      this.totalPages = this.pages.length;
      this.currentPage = position === 'last' ? this.totalPages : 1;
      });
    },
    
    // ============ 目录与设置 ============
    showCatalog() {
      this.showCatalogModal = true;
      this.showMenu = false;
    },
    
    showSettings() {
      this.showSettingsModal = true;
      this.showMenu = false;
    },
    
    // ============ 字体设置 ============
    increaseFontSize() {
      if (this.fontSize < 24) {
        this.fontSize += 1;
        this.saveReadingSettings();
      }
    },
    
    decreaseFontSize() {
      if (this.fontSize > 12) {
        this.fontSize -= 1;
        this.saveReadingSettings();
      }
    },
    
    onFontSizeChange(e) {
      this.fontSize = e.detail.value;
      this.saveReadingSettings();
    },
    
    toggleDayNightMode() {
      this.selectBackground(this.isNightMode ? 0 : 3);
    },

    selectBackground(index) {
      this.bgColorIndex = index;
      this.isNightMode = index === 3;
      this.saveReadingSettings();
    },

    addToBookshelf() {
      const bookId = this.bookInfo.id;
      if (!bookId) return;

      const added = addToBookshelf(bookId);
      uni.showToast({
        title: added ? '已加入书架' : '已在书架中',
        icon: added ? 'success' : 'none'
      });
    },
    
    // 检查并自动加入书架（阅读超过5分钟）
    checkAndAutoAddToBookshelf() {
      // 计算总阅读时长（毫秒）
      if (this.readingStartTime > 0) {
        this.totalReadingTime += Date.now() - this.readingStartTime;
      }
      
      // 如果已经自动加入过，或阅读时长不足5分钟，则不处理
      if (this.hasAutoAddedToBookshelf || this.totalReadingTime < 300000) {
        return;
      }
      
      const bookId = this.bookInfo.id;
      if (!bookId) return;
      
      // 自动加入书架
      const added = addToBookshelf(bookId);
      if (added) {
        uni.showToast({
          title: '已自动加入书架',
          icon: 'success',
          duration: 2000
        });
        this.hasAutoAddedToBookshelf = true;
      }
    },

    // ============ 自动翻页 ============
    toggleAutoFlip() {
      // 快速切换：关闭 <-> 10秒自动翻页
      if (this.autoFlipInterval === 0) {
        this.setAutoFlip(10000);
      } else {
        this.setAutoFlip(0);
      }
    },
    
    setAutoFlip(interval) {
      this.autoFlipInterval = interval;
      this.saveReadingSettings();
      
      this.clearAutoFlip();
      if (interval > 0) {
        this.startAutoFlip();
        uni.showToast({ title: `自动翻页已开启`, icon: 'none' });
      }
    },
    
    startAutoFlip() {
      if (this.autoFlipInterval > 0) {
        this.autoFlipTimer = setInterval(() => {
          if (!this.showMenu && !this.showCatalogModal && !this.showSettingsModal) {
            this.nextPage();
          }
        }, this.autoFlipInterval);
      }
    },
    
    clearAutoFlip() {
      if (this.autoFlipTimer) {
        clearInterval(this.autoFlipTimer);
        this.autoFlipTimer = null;
      }
    },
    
    // ============ 书籍加载 ============
    loadBookInfo(id) {
      this.bookInfo = booksData.find(book => book.id === id) || {};
      
      if (!this.bookInfo.onlineReadable) {
        uni.showToast({
          title: '该书籍暂不支持在线阅读',
          icon: 'none'
        });
        setTimeout(() => uni.navigateBack(), 2000);
        return;
      }
      
      this.loadBookContent(id);
    },
    
    async loadBookContent(bookId) {
      this.loading = true;
      
      try {
        // 先尝试从缓存读取
        const cached = uni.getStorageSync(`book_content_${bookId}`);
        if (cached && cached.content) {
          this.fullContent = cached.content;
          this.parseBookContent();
          return;
        }

        let contentUrl = '';
        
        // 检查运行环境
        // #ifdef H5
        // H5 环境下由于 CORS 限制，无法直接调用网盘 API
        throw new Error('H5 版本暂不支持在线阅读，请使用小程序或 App 版本');
        // #endif
        
        // #ifndef H5
        // 解析网盘链接获取直链（仅在 App/小程序中）
        if (this.bookInfo.readUrl) {
          try {
            const parseResult = await parseNetdiskUrl(this.bookInfo.readUrl);
            
            if (parseResult && parseResult.success && parseResult.url) {
              contentUrl = parseResult.url;
              console.log('客户端解析网盘链接成功:', contentUrl);
            } else {
              throw new Error(parseResult?.error || '网盘链接解析失败');
            }
          } catch (error) {
            console.error('客户端解析网盘链接失败:', error);
            throw new Error('网盘链接解析失败，请稍后重试');
          }
        } else {
          throw new Error('书籍未配置网盘链接');
        }
        
        if (!contentUrl || !/^https?:\/\//i.test(contentUrl)) {
          throw new Error('无法获取书籍正文地址');
        }
        // #endif

        const response = await new Promise((resolve, reject) => {
          // 判断是否为网盘链接
          const isQuarkUrl = contentUrl.includes('drive-pc.quark.cn') || contentUrl.includes('drive.quark.cn');
          const isBaiduUrl = contentUrl.includes('pcs.baidu.com') || contentUrl.includes('pan.baidu.com');
          
          const requestOptions = {
            url: contentUrl,
            method: 'GET',
            responseType: 'text',
            timeout: 60000,
            success: resolve,
            fail: reject
          };
          
          // 夸克网盘需要认证头
          if (isQuarkUrl) {
            requestOptions.header = {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Referer': 'https://pan.quark.cn/',
              'Accept': '*/*'
            };
          }
          
          // 百度网盘需要认证头和 Cookie
          if (isBaiduUrl) {
            // 从 pan-config 获取百度 Cookie
            import('../../utils/pan-config.js').then(module => {
              const panConfig = module.default;
              requestOptions.header = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://pan.baidu.com/',
                'Cookie': panConfig.baidu.cookie,
                'Accept': '*/*'
              };
              uni.request(requestOptions);
            }).catch(err => {
              console.error('获取百度 Cookie 失败:', err);
              // 如果获取 Cookie 失败，仍然尝试请求
              requestOptions.header = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://pan.baidu.com/',
                'Accept': '*/*'
              };
              uni.request(requestOptions);
            });
          } else {
            // 非百度网盘，直接请求
            uni.request(requestOptions);
          }
        });

        if (response.statusCode < 200 || response.statusCode >= 300 || typeof response.data !== 'string') {
          throw new Error(`书籍资源下载失败，状态码：${response.statusCode}`);
        }

        this.fullContent = response.data;

        // 缓存内容（小于5MB）
        if (this.fullContent.length < 5 * 1024 * 1024) {
          uni.setStorageSync(`book_content_${bookId}`, {
            content: this.fullContent,
            timestamp: Date.now()
          });
        }

        this.parseBookContent();
      } catch (error) {
        console.error('加载失败：', error);
        uni.showToast({
          title: '网络错误',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },

    
    parseBookContent() {
      this.chapters = parseChapters(this.fullContent);
      this.totalChapters = this.chapters.length;
      
      if (this.chapters.length > 0) {
        // 先恢复阅读进度
        this.loadReadingProgress(this.bookInfo.id);
        // 再加载章节
        this.loadChapter(this.currentChapterNum);
      }
    },
    
    goBack() {
      uni.navigateBack();
    },
    
    // ============ 持久化 ============
    saveReadingProgress() {
      uni.setStorageSync(`reading_progress_${this.bookInfo.id}`, {
        chapterNum: this.currentChapterNum,
        currentPage: this.currentPage,
        timestamp: Date.now()
      });
    },
    
    loadReadingProgress(bookId) {
      const progress = uni.getStorageSync(`reading_progress_${bookId}`);
      if (progress) {
        if (progress.chapterNum !== undefined) {
          this.currentChapterNum = progress.chapterNum;
        }
        if (progress.currentPage !== undefined) {
          this.currentPage = progress.currentPage;
        }
      }
    },
    
    saveReadingSettings() {
      uni.setStorageSync('reading_settings', {
        fontSize: this.fontSize,
        fontFamilyIndex: this.fontFamilyIndex,
        lineHeight: this.lineHeight,
        bgColorIndex: this.bgColorIndex,
        isNightMode: this.isNightMode,
        pageFlipMode: this.pageFlipMode,
        autoFlipInterval: this.autoFlipInterval
      });
    },
    
    loadReadingSettings() {
      const settings = uni.getStorageSync('reading_settings');
      if (settings) {
        this.fontSize = settings.fontSize || 16;
        this.fontFamilyIndex = settings.fontFamilyIndex || 0;
        this.lineHeight = settings.lineHeight || 1.8;
        this.bgColorIndex = Number.isInteger(settings.bgColorIndex) ? settings.bgColorIndex : 0;
        this.isNightMode = this.bgColorIndex === 3;
        this.pageFlipMode = settings.pageFlipMode || 'horizontal';
        this.saveReadingSettings();
        this.autoFlipInterval = settings.autoFlipInterval || 0;
      }
    }
  }
};
</script>


<style scoped>
.reader-page {
  width: 100%;
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s;
}

/* ============ 顶部标题栏 ============ */
.reader-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, background-color 0.3s, color 0.3s;
}

.reader-page.night-mode .reader-header {
  background: #493a2e !important;
}

.reader-page.night-mode .back-icon,
.reader-page.night-mode .book-title {
  color: #f0e8df;
}

.reader-page.night-mode .header-btn {
  color: #d4c4b0;
}

.reader-page.night-mode .header-btn:active {
  opacity: 0.7;
}

.reader-page.night-mode .reader-footer {
  background: #2b2b2b !important;
}

.reader-page.night-mode .arrow-btn,
.reader-page.night-mode .menu-icon,
.reader-page.night-mode .menu-label {
  color: #d0d0d0;
}

.reader-page.night-mode .bottom-menu {
  border-top-color: #484848;
}

.reader-page.night-mode .catalog-modal,
.reader-page.night-mode .settings-modal {
  background: #2b2b2b !important;
}

.reader-page.night-mode .modal-header,
.reader-page.night-mode .catalog-item {
  border-color: #484848;
}

.reader-page.night-mode .modal-title,
.reader-page.night-mode .setting-label,
.reader-page.night-mode .catalog-item {
  color: #d0d0d0;
}

.reader-page.night-mode .modal-close {
  color: #aaa;
}

.reader-page.night-mode .option-item,
.reader-page.night-mode .control-btn {
  background: #3a3a3a;
  border-color: #555;
  color: #ddd;
}

.reader-page.night-mode .option-item.active,
.reader-page.night-mode .catalog-item.active {
  background: #294258;
  border-color: #4c9bd6;
  color: #9bd0ff;
}

.reader-page.night-mode .catalog-item:active {
  background: #3a3a3a;
}

.reader-header.header-hidden {
  transform: translateY(-100%);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  height: 88rpx;
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.back-icon {
  font-size: 40rpx;
  color: #333;
  margin-right: 20rpx;
}

.book-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-right {
  display: flex;
  gap: 30rpx;
  align-items: center;
}

.header-btn {
  font-size: 28rpx;
  color: #6d2229;
  padding: 8rpx 16rpx;
  font-weight: 500;
}

.header-btn:active {
  opacity: 0.7;
}

/* ============ 阅读内容区 ============ */
.reader-content {
  flex: 1;
  width: 100%;
  height: 0;
  min-height: 0;
  overflow: hidden;
  box-sizing: border-box;
}

.reader-content[scroll-y] {
  overflow: hidden;
}

.content-wrapper {
  width: 100%;
  height: 100%;
  padding: 120rpx 40rpx 180rpx;
  box-sizing: border-box;
  overflow: hidden;
  transition: all 0.2s;
}

.chapter-title-text {
  display: block;
  font-size: 38rpx;
  font-weight: bold;
  margin-bottom: 50rpx;
  text-align: center;
}

.content-text {
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  text-indent: 2em;
  letter-spacing: 0.5px;
}

/* ============ Loading 遮罩 ============ */
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
  padding: 60rpx 80rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
}

.loading-spinner {
  width: 80rpx;
  height: 80rpx;
  border: 6rpx solid #e5d8bd;
  border-top-color: #6d2229;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 28rpx;
  color: #4a3728;
  font-weight: 500;
}

/* ============ 底部菜单栏 ============ */
.reader-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  box-shadow: 0 -1px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s;
  padding: 20rpx 30rpx 20rpx;
}

.reader-footer.footer-hidden {
  transform: translateY(100%);
}

/* 进度条区域 */
.progress-bar-section {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
  padding: 0 10rpx;
}

.arrow-btn {
  font-size: 24rpx;
  color: #666;
  white-space: nowrap;
  padding: 0 10rpx;
  transition: color 0.2s;
}

.arrow-btn.disabled {
  color: #ccc;
}

.progress-slider {
  flex: 1;
  min-width: 200rpx;
}

/* 底部图标菜单 */
.bottom-menu {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 10rpx 0 0;
  border-top: 1px solid #f0f0f0;
}

.menu-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10rpx 0;
  transition: opacity 0.2s;
}

.menu-item:active {
  opacity: 0.6;
}

.menu-icon {
  font-size: 44rpx;
  color: #666;
  line-height: 1;
  margin-bottom: 6rpx;
}

.menu-label {
  font-size: 20rpx;
  color: #999;
  line-height: 1;
}

/* ============ 模态窗口通用样式 ============ */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 40rpx;
  border-bottom: 1px solid #eee;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.modal-close {
  font-size: 48rpx;
  color: #999;
  line-height: 1;
  cursor: pointer;
}

/* ============ 目录弹窗 ============ */
.catalog-modal {
  width: 600rpx;
  max-height: 80vh;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.catalog-list {
  max-height: calc(80vh - 100rpx);
}

.catalog-item {
  padding: 30rpx 40rpx;
  border-bottom: 1px solid #f5f5f5;
  font-size: 28rpx;
  color: #333;
  transition: background 0.2s;
}

.catalog-item.active {
  background: #e8f4ff;
  color: #007aff;
  font-weight: bold;
}

.catalog-item:active {
  background: #f5f5f5;
}

/* ============ 设置弹窗 ============ */
.settings-modal {
  width: 650rpx;
  max-height: 85vh;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.settings-content {
  padding: 30rpx 40rpx;
  max-height: calc(85vh - 100rpx);
  overflow-y: auto;
}

.setting-section {
  margin-bottom: 40rpx;
}

.setting-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.setting-control {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.control-btn {
  width: 80rpx;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 24rpx;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  padding: 0;
}

.size-slider {
  flex: 1;
}

.option-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.option-item {
  flex: 0 0 calc(25% - 15rpx);
  height: 70rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border: 2px solid transparent;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #333;
  transition: all 0.2s;
}

.option-item.active {
  background: #e8f4ff;
  border-color: #007aff;
  color: #007aff;
  font-weight: bold;
}

.color-group {
  display: flex;
  gap: 20rpx;
}

.color-item {
  flex: 1;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid transparent;
  border-radius: 12rpx;
  transition: all 0.2s;
}

.color-item.active {
  border-color: #007aff;
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
}

.color-name {
  font-size: 24rpx;
  font-weight: bold;
}
</style>

