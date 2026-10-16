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
        <block v-if="pageFlipMode === 'swipe'">
          <text class="content-text">{{ displayContent }}</text>
        </block>
        <block v-else-if="currentPageItem && currentPageItem.type === 'ad'">
          <!-- #ifdef APP-PLUS -->
          <view class="reader-feed-ad-page">
            <ad
              class="reader-feed-ad"
              :adpid="currentFeedAdPid"
              :key="currentFeedAdPid"
              @load="onFeedAdLoad"
              @error="onFeedAdError"
            ></ad>
          </view>
          <!-- #endif -->
        </block>
        <block v-else>
          <text class="content-text">{{ currentPageText }}</text>
        </block>
      </view>
    </scroll-view>

    <!-- 全屏 Loading -->
    <view v-if="loading" class="loading-mask">
      <view class="loading-content">
        <view class="loading-spinner"></view>
        <text class="loading-text">正在加载书籍内容...</text>
      </view>
    </view>

    <!-- 阅读页底部常驻 Banner（文档：阅读页底部常驻，轮播）；拉取内容期间 & 前 2 章不展示 -->
    <!-- #ifdef APP-PLUS -->
    <view class="reader-banner" v-if="!loading && currentChapterNum > 2">
      <ad
        class="reader-banner-el"
        :adpid="AD_BANNER_PID"
        @load="onBannerAdLoad"
        @error="onBannerAdError"
      ></ad>
    </view>
    <!-- #endif -->

    <!-- 插屏 / 激励视频宿主：注册到全局广告控制器，由本页事件触发 -->
    <!-- #ifdef APP-PLUS -->
    <interstitial-ad-host />
    <rewarded-video-ad-host />
    <!-- #endif -->

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

        <view class="menu-item" @tap.stop="onRewardUnlock">
          <text class="menu-icon">🎁</text>
          <text class="menu-label">{{ isAdFree ? '已免广告' : '免广告' }}</text>
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
import { addToBookshelf, isInBookshelf } from '@/utils/bookshelf';
import { parseNetdiskUrl } from '@/utils/pan-parser.js';

import { bookTxtUrl } from '@/utils/config';
import {
  AD_FEED_PID,
  AD_FEED_PID_LIST,
  AD_BANNER_PID,
  AD_FEED_START_CHAPTER,
  AD_FEED_EVERY_CHAPTER,
  AD_INTERSTITIAL_EVERY_CHAPTER,
  AD_REWARD_AD_FREE_MS,
  AD_REWARD_READER_TIME_MS,
} from '@/utils/ad-config';
import { showRewardedVideoAd } from '@/utils/rewarded-video-ad';
import InterstitialAdHost from '@/components/InterstitialAdHost.vue';
import RewardedVideoAdHost from '@/components/RewardedVideoAdHost.vue';

/* ============================================================================
 * 阅读页广告规则（统一说明；具体阈值见 @/utils/ad-config.js）
 * ----------------------------------------------------------------------------
 * 1) 信息流广告（feed，内嵌正文分页，非弹窗）
 *    - 开关：readerFeedAdEnabled（默认开）
 *    - 免广告期内（isAdFree）不插入
 *    - 首章分页不插（adReady 首次置位前），之后章节才允许插入
 *    - 章节门槛：chapterNum > AD_FEED_START_CHAPTER(2) 且
 *                (chapterNum - 2) % AD_FEED_EVERY_CHAPTER(3) === 0
 *                → 第 5、8、11、14… 章插入
 *    - 位置：本章正文中间（floor(页数/2)），避免与章末/翻章断点冲突
 *    - 前提：本章分页页数 >= 2
 *
 * 2) 插屏广告（interstitial）：已关闭
 *    - AD_INTERSTITIAL_ENABLED = false，所有触发点已拦截，不再弹窗
 *    - 原“章末 / 返回书架”弹插屏，改为“跳转到本章已有的信息流广告页”
 *      （maybeShowChapterEndFeedAd / goBack → jumpToFeedAdPage）
 *    - 章末触发频率：chapterNum % AD_INTERSTITIAL_EVERY_CHAPTER(5) === 0
 *      （第 5、10、15… 章翻完后，下一章分页完成尝试跳到其信息流广告页；
 *       若下一章无广告页则不放）
 *
 * 3) 激励视频（rewarded video）
 *    - 主动触发：阅读页累计阅读时长首次达到 AD_REWARD_READER_TIME_MS(15 分钟)
 *      （checkReaderTimeReward，每 10s 检测；每个阅读实例仅一次；免广告期不弹）
 *    - 用户点击“看广告解锁”：看完(isEnded)送 AD_REWARD_AD_FREE_MS(30 分钟)免广告
 *      （onRewardUnlock，adFreeUntil 持久化到本地）
 *    - 频控：AD_REWARD_INTERVAL(5 分钟)；onRewardUnlock 用 force 忽略，
 *      15 分钟主动触发走默认频控
 *    - 首页/详情主动触发（AD_REWARD_ON_DETAIL / AD_ENABLE_SECONDARY）当前均关闭
 *
 * 4) 免广告时段（isAdFree）
 *    - 看完激励后 adFreeUntil = now + 30 分钟，持久化；期间：
 *      不插入信息流广告、不跳信息流广告页、不弹任何激励
 * ========================================================================== */

// 激励视频解锁的免广告窗口持久化（必做：跨会话/跨阅读页保持可信）
const AD_FREE_UNTIL_KEY = 'ad_free_until';

// 启动时恢复免广告截止时间；封顶到授予时长，防改时钟拉长窗口
function loadAdFreeUntil() {
  try {
    const v = uni.getStorageSync(AD_FREE_UNTIL_KEY);
    if (typeof v !== 'number' || !isFinite(v) || v <= 0) return 0;
    // 免广告窗口最多为授予时长（AD_REWARD_AD_FREE_MS），超出的视为篡改并收紧
    return Math.min(v, Date.now() + AD_REWARD_AD_FREE_MS);
  } catch (e) {
    return 0;
  }
}

function saveAdFreeUntil(ts) {
  try {
    uni.setStorageSync(AD_FREE_UNTIL_KEY, ts);
  } catch (e) {}
}

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
  components: {
    InterstitialAdHost,
    RewardedVideoAdHost,
  },
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
      rewardReaderTimeTriggered: false, // 阅读满 15 分钟主动弹激励，每个阅读实例仅触发一次
      rewardCheckTimer: null,
      hasAutoAddedToBookshelf: false,
      
      // 分页相关
      currentPage: 1,
      totalPages: 1,
      pages: [],
      pendingFeedAdJump: false,
      viewportWidth: 0,
      viewportHeight: 0,

      // 阅读页广告总开关（信息流 / 插屏 / 激励共用）
      readerFeedAdEnabled: true,

      // 内容是否已首屏渲染完成：未完成的首次分页不插入信息流广告，避免"拉取期间/刚出来就弹广告"
      adReady: false,

      // 信息流广告：当前展示用的 adpid 与已尝试过的下标（每次曝光随机 + 无填充兜底）
      currentFeedAdPid: '',
      feedAdTried: [],

      // 激励视频解锁后的免广告截止时间戳（毫秒），文档「换 30 分钟免广告时段」
      adFreeUntil: 0,

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
        { name: '上下翻页', value: 'vertical' }
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
    // Banner 常驻底部，同样经 computed 暴露给模板
    AD_BANNER_PID() {
      return AD_BANNER_PID;
    },

    // 是否处于激励视频解锁的免广告时段
    isAdFree() {
      return Date.now() < this.adFreeUntil;
    },

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

    currentPageItem() {
      return this.pages[this.currentPage - 1] || null;
    },

    currentPageText() {
      const item = this.pages[this.currentPage - 1];
      return item && item.type === 'content' ? item.text : '';
    }
  },

  onLoad(options) {
    const id = parseInt(options.bookId);
    this.loadBookInfo(id);
    this.loadReadingSettings();
    this.loadReadingProgress(id);

    // 恢复跨会话的免广告窗口（看完激励视频解锁的 30 分钟）
    this.adFreeUntil = loadAdFreeUntil();

    // 记录阅读开始时间
    this.readingStartTime = Date.now();
  },
  
  onUnload() {
    this.checkAndAutoAddToBookshelf();
    this.saveReadingProgress();
    this.clearAutoFlip();
    this.stopRewardCheckTimer();
  },
  
  onHide() {
    // 切换到后台时累计阅读时长
    if (this.readingStartTime > 0) {
      this.totalReadingTime += Date.now() - this.readingStartTime;
      this.readingStartTime = 0;
    }
    this.stopRewardCheckTimer();
  },
  
  onShow() {
    // 从后台返回时重新开始计时
    this.readingStartTime = Date.now();
    this.startRewardCheckTimer();
  },

  watch: {
    // 翻到广告页时，重新随机选位（每次曝光独立随机）
    currentPage(newVal) {
      const item = this.pages[newVal - 1];
      console.log('[reader-feed-ad] page entered, currentPage=', newVal, 'type=', item && item.type);
      if (item && item.type === 'ad') {
        this.startFeedAd();
      }
    },
  },

  methods: {
    // ============ 阅读页广告（按设计文档） ============
    // 信息流：进入广告页时重置并随机选位（每次曝光重新随机，更细填充分发）
    startFeedAd() {
      this.feedAdTried = [];
      this.pickNextFeedAdPid();
    },
    // 从信息流池中随机选一个尚未尝试过的位
    pickNextFeedAdPid() {
      const list = AD_FEED_PID_LIST;
      if (!list || !list.length) {
        this.currentFeedAdPid = AD_FEED_PID;
        console.log('[reader-feed-ad] pick pid=', this.currentFeedAdPid, '(fallback default)');
        return;
      }
      const remaining = [];
      for (let i = 0; i < list.length; i++) {
        if (!this.feedAdTried.includes(i)) remaining.push(i);
      }
      if (!remaining.length) {
        this.currentFeedAdPid = '';
        console.log('[reader-feed-ad] pick exhausted, pid empty');
        return;
      }
      const idx = remaining[Math.floor(Math.random() * remaining.length)];
      this.feedAdTried.push(idx);
      this.currentFeedAdPid = list[idx];
      console.log('[reader-feed-ad] pick pid=', this.currentFeedAdPid, 'tried=', this.feedAdTried.length);
    },
    onFeedAdLoad(e) {
      console.log('[reader-feed-ad] load pid=', this.currentFeedAdPid, e);
    },
    onFeedAdError(e) {
      console.warn('[reader-feed-ad] error pid=', this.currentFeedAdPid, e);
      // 无填充/错误兜底：最多切换 2 个不同位，且加 1s 退避延迟，
      // 避免同一页面瞬间刷空整个池（属反刷量行为，且多数无填充是环境/账号级而非单位级）
      const maxFeedFallback = Math.min(AD_FEED_PID_LIST?.length || 0, 2);
      if (this.feedAdTried.length < maxFeedFallback) {
        setTimeout(() => this.pickNextFeedAdPid(), 1000);
      }
    },
    onBannerAdLoad(e) {
      console.log('[reader-banner-ad] load', e);
    },
    onBannerAdError(e) {
      console.warn('[reader-banner-ad] error', e);
    },

    // 本章完 / 返回书架：原弹插屏，现改为跳转到阅读流中已有的信息流广告页（复用分页广告；无则不放）
    maybeShowChapterEndFeedAd(chapterNum) {
      if (this.loading) return;
      if (!this.readerFeedAdEnabled || this.isAdFree) return;
      if (chapterNum % AD_INTERSTITIAL_EVERY_CHAPTER !== 0) return;
      // 进入下一章后，由 calculatePages 在分页完成后跳到该章信息流广告页
      this.pendingFeedAdJump = true;
    },

    // 跳转到当前章已有的信息流广告页；仅当广告页在当前页之后才跳，避免往回跳 / 重复展示
    jumpToFeedAdPage() {
      const idx = this.pages.findIndex((p) => p.type === 'ad');
      if (idx === -1) return;
      if (idx + 1 <= this.currentPage) return;
      this.currentPage = idx + 1;
    },

    // 返回书架：原弹插屏，现改为优先跳到本章在前方的信息流广告页；无则直接退出
    async goBack() {
      if (this.readerFeedAdEnabled && !this.isAdFree) {
        const before = this.currentPage;
        this.jumpToFeedAdPage();
        if (this.currentPage !== before) return; // 已跳到信息流广告页，留在阅读页
      }
      uni.navigateBack();
    },

    // 看广告解锁：用户主动点击按钮，看完后给 30 分钟免广告时段
    async onRewardUnlock() {
      if (this.isAdFree) {
        uni.showToast({ title: '已处于免广告时段', icon: 'none' });
        return;
      }
      const res = await showRewardedVideoAd({
        force: true,
        extra: { scene: 'reader_unlock' },
      });
      if (res && res.shown && res.isEnded) {
        this.adFreeUntil = Date.now() + AD_REWARD_AD_FREE_MS;
        saveAdFreeUntil(this.adFreeUntil);
        uni.showToast({ title: '已解锁30分钟免广告', icon: 'success' });
      } else if (res && res.shown && !res.isEnded) {
        uni.showToast({ title: '未看完，未解锁', icon: 'none' });
      }
    },

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
        // 阅读超过 5 章且未主动加入书架时自动加入
        this.checkAndAutoAddToBookshelf();
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
        // 本章完 -> 自然断点；原弹插屏，现改为进入下一章后跳到信息流广告页
        this.maybeShowChapterEndFeedAd(this.currentChapterNum);
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
      const contentPages = result.length ? result : [''];
      const pages = contentPages.map((text) => ({ type: 'content', text }));

      // 信息流/原生：正文内插入（文档：前 N 章不展示，之后每 M 章插 1 条，且免广告时段内不插）
      const chapterNum = this.currentChapterNum;
      const feedEligible = this.readerFeedAdEnabled
        && !this.isAdFree
        && this.adReady
        && chapterNum > AD_FEED_START_CHAPTER
        && (chapterNum - AD_FEED_START_CHAPTER) % AD_FEED_EVERY_CHAPTER === 0;
      if (feedEligible && pages.length >= 2) {
        // 插在本章正文中间，避免在章节首尾与插屏/翻章断点冲突
        const insertAt = Math.floor(pages.length / 2);
        pages.splice(insertAt, 0, { type: 'ad' });
      }

      this.pages = pages;
      this.totalPages = this.pages.length;
      this.currentPage = position === 'last' ? this.totalPages : 1;
      // 首次分页完成即视为内容已落地，后续章节（翻章/调设置重算）才允许插入信息流广告
      this.adReady = true;
      console.log('[reader] page types:', this.pages.map((p) => p.type).join(','));
      // 本章完进入下一章后，跳到该章信息流广告页（替换原插屏；无广告页则不放）
      if (this.pendingFeedAdJump) {
        this.pendingFeedAdJump = false;
        this.jumpToFeedAdPage();
      }
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
    
    // 检查并自动加入书架（阅读超过 5 章且未主动加入时）
    checkAndAutoAddToBookshelf() {
      if (this.hasAutoAddedToBookshelf) return;
      const bookId = this.bookInfo.id;
      if (!bookId) return;

      // 未读满 5 章不自动加入
      if (this.currentChapterNum <= 5) return;

      // 用户已主动加入书架则标记并跳过
      if (isInBookshelf(bookId)) {
        this.hasAutoAddedToBookshelf = true;
        return;
      }

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

    // 阅读页累计阅读时长首次满 15 分钟，主动弹激励视频（仅一次）
    checkReaderTimeReward() {
      if (this.rewardReaderTimeTriggered) return;
      if (this.isAdFree) return; // 免广告期内不弹
      const elapsed =
        this.totalReadingTime +
        (this.readingStartTime > 0 ? Date.now() - this.readingStartTime : 0);
      if (elapsed >= AD_REWARD_READER_TIME_MS) {
        this.rewardReaderTimeTriggered = true;
        console.log(`[reader] reading time reached ${AD_REWARD_READER_TIME_MS}ms, trigger rewarded ad`);
        showRewardedVideoAd({ scene: 'reader_time_15min' });
      }
    },

    startRewardCheckTimer() {
      this.stopRewardCheckTimer();
      this.rewardCheckTimer = setInterval(() => this.checkReaderTimeReward(), 10000);
    },

    stopRewardCheckTimer() {
      if (this.rewardCheckTimer) {
        clearInterval(this.rewardCheckTimer);
        this.rewardCheckTimer = null;
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
    
    // ============ 加载看门狗 & 反馈提示 ============
    startLoadWatchdog() {
      this.clearLoadWatchdog();
      // 加载超过 90 秒仍未完成（含网盘解析/下载卡住），提示到官方反馈群留言
      this.loadWatchdogTimer = setTimeout(() => {
        if (this.loading) this.showLoadFeedbackHint();
      }, 90000);
    },

    clearLoadWatchdog() {
      if (this.loadWatchdogTimer) {
        clearTimeout(this.loadWatchdogTimer);
        this.loadWatchdogTimer = null;
      }
    },

    showLoadFeedbackHint() {
      uni.showModal({
        title: '加载失败',
        content: '书籍资源加载失败或超时，请加入官方反馈群 1041698859 留言反馈',
        confirmText: '复制群号',
        cancelText: '知道了',
        success: (res) => {
          if (res.confirm) {
            uni.setClipboardData({
              data: '1041698859',
              success: () => uni.showToast({ title: '群号已复制', icon: 'none' })
            });
          }
        }
      });
    },

    // ============ 书籍加载 ============
    loadBookInfo(id) {
      this.bookInfo = booksData.find(book => book.id === id) || {};
      this.loadBookContent(id);
    },
    
    async loadBookContent(bookId) {
      this.loading = true;
      this.adReady = false;
      this.startLoadWatchdog();

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
        this.showLoadFeedbackHint();
      } finally {
        this.clearLoadWatchdog();
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
        // 已移除"滚屏(swipe)"，旧设置回退为左右翻页
        const savedFlipMode = settings.pageFlipMode;
        this.pageFlipMode =
          savedFlipMode === 'horizontal' || savedFlipMode === 'vertical'
            ? savedFlipMode
            : 'horizontal';
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

/* ============ 阅读页信息流广告页（单类型，每页一种） ============ */
.reader-feed-ad-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 32rpx;
}

/* 原生信息流广告组件占满宽度，并预留渲染高度（无填充时不塌成 0 高） */
.reader-feed-ad {
  width: 100%;
  min-height: 240rpx;
}

/* 阅读页底部常驻 Banner（文档：阅读页底部常驻，轮播） */
.reader-banner {
  width: 100%;
  min-height: 100rpx;
  background: #fff;
  box-sizing: border-box;
  flex-shrink: 0;
}

.reader-banner-el {
  width: 100%;
}

/* 非 App 环境提示 */
.reader-feed-ad-nonapp {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 48rpx;
  box-sizing: border-box;
}

.reader-feed-ad-nonapp-tip {
  font-size: 24rpx;
  color: #a08a68;
  text-align: center;
  line-height: 1.6;
}
</style>

