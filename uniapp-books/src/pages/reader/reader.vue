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
      :style="{ backgroundColor: bgColors[bgColorIndex].value, color: bgColors[bgColorIndex].textColor, paddingTop: statusBarHeight + 'px' }"
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
      <view
        class="content-wrapper"
        :class="{ 'scroll-wrapper': pageFlipMode === 'swipe' }"
        :style="contentStyle"
      >
        <text class="chapter-title-text">{{ currentChapter.title }}</text>
        <block v-if="pageFlipMode === 'swipe'">
          <text class="content-text">{{ displayContent }}</text>
        </block>
        <block v-else>
          <text class="content-text">{{ currentPageText }}</text>
          <!-- #ifdef APP-PLUS -->
          <!-- 信息流/原生：内联在正文段落之间，随翻页一起完整曝光 -->
          <view v-if="currentPageItem && currentPageItem.adInline" class="reader-inline-ad">
            <ad
              v-if="currentFeedAdPid"
              class="reader-feed-ad"
              :adpid="currentFeedAdPid"
              :key="currentFeedAdPid"
              @load="onFeedAdLoad"
              @error="onFeedAdError"
            ></ad>
            <!-- 未加载完成时的占位遮罩：提示用户广告正在渲染，期间禁止翻页 -->
            <view v-if="feedAdPending" class="reader-feed-ad-mask">
              <text class="reader-feed-ad-tip">加载中…</text>
            </view>
          </view>
          <text v-if="currentPageItem && currentPageItem.adInline" class="content-text">{{ currentPageItem.textAfter }}</text>
          <!-- #endif -->
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
    <view class="reader-banner" v-if="!loading && currentChapterNum > 2 && !bannerAdFailed">
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

    <!-- 未完整观看激励视频：锁定后续章节，必须看完才能继续 -->
    <view v-if="showUnlockModal" class="modal-mask">
      <view class="unlock-modal" @tap.stop>
        <text class="unlock-title">解锁后续章节</text>
        <text class="unlock-desc">需完整观看一条激励视频，才能继续阅读后续章节</text>
        <view class="unlock-btn" @tap="unlockByRewardAd">
          <text class="unlock-btn-text">{{ rewardAdPending ? '加载中…' : '观看广告解锁' }}</text>
        </view>
        <text class="unlock-tip">完整观看约 15–30 秒，中途退出无法解锁</text>
        <text class="unlock-back" @tap="exitReaderFromLock">返回书架</text>
      </view>
    </view>

    <!-- 点击「免广告/解锁」到真正的激励视频上屏之间的加载提示（广告出来后自动关闭） -->
    <view v-if="showRewardLoadingModal" class="loading-mask">
      <view class="loading-content">
        <view class="loading-spinner"></view>
        <text class="loading-text">广告加载中…</text>
      </view>
    </view>
  </view>
</template>

<script>
import { parseChapters, cleanChapterContent } from '@/utils/chapter-parser';
import booksData from '@/data/books';
import { getBookById } from '@/utils/books';
import { addToBookshelf, isInBookshelf } from '@/utils/bookshelf';
import { parseNetdiskUrl } from '@/utils/pan-parser.js';

import { bookTxtUrl } from '@/utils/config';
import {
  AD_FEED_PID,
  AD_FEED_PID_LIST,
  AD_BANNER_PID,
  AD_FEED_START_CHAPTER,
  AD_INTERSTITIAL_EVERY_CHAPTER,
  AD_REWARD_AD_FREE_MS,
  AD_REWARD_LOCK_CHAPTERS,
} from '@/utils/ad-config';
// 广告节奏/奖励参数改为远程配置（app-version.json 的 ad 段），以下为同步缓存 getter
import {
  getRemoteConfig,
  getCachedFeedEveryChapter,
  getCachedRewardAdFreeMs,
  getCachedRewardReaderFirstMs,
  getCachedRewardReaderIntervalMs,
} from '@/utils/remote-config';
import { showRewardedVideoAd, canShowRewardAd, isRewardAdShowing, rewardAdState } from '@/utils/rewarded-video-ad';
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
 *                (chapterNum - 2) % feedEveryChapter(远程可配，默认 5) === 0
 *                → 默认第 5、8、11、14… 章插入
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
 *    - 主动触发：阅读页累计阅读时长达到里程碑即弹
 *      · 首次/之后间隔阈值由远程 app-version.json 的 ad 段配置（rewardReaderFirstMinutes / rewardReaderIntervalMinutes）
 *      · 累计时长跨会话持久化在 reader_reading_time_v1 { total, next }
 *        （每 10s 落盘 + onHide/onUnload 落盘；页面在后台不计入时长）
 *      · checkReaderTimeReward 每 10s 检测；只有真正展示成功才推进里程碑，
 *        被频控/组件未就绪/无填充导致未展示时间隔 AD_REWARD_RETRY_MS(60s) 重试
 *      · 免广告期内不弹，机会保留到窗口结束后
 *      · 看完(isEnded)才推进里程碑；未看完则由 AD_REWARD_LOCK_CHAPTERS 控制
 *        锁定后续章节（nextChapter/章末翻页/目录跳转/进度条/自动翻页全部拦截），
 *        必须完整观看一次激励视频（解锁弹窗或“免广告”按钮）才能继续读
 *      · 锁定状态跨会话/跨书籍持久化（reader_reading_time_v1.lockedChaptersByBook 按书分别记账）：
 *        达到里程碑那一刻即记录锁定边界并落盘，故「弹广告途中 kill 进程」后
 *        重新进入任意书籍正文仍保持锁定并自动重新弹激励视频；
 *        只有完整看完(isEnded)才会解除锁定并推进里程碑
 *      · 广告没展示成功（无填充/未就绪）不算用户放弃，只延后重试、不锁定；
 *        已主动弹过且被中途关闭(rewardAutoOffered)后不再自动弹，仅保留解锁弹窗
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

// 15 分钟激励未成功展示（频控/组件未就绪/无填充）后的重试间隔
const AD_REWARD_RETRY_MS = 60 * 1000;

// 累计阅读时长持久化（跨会话）：
// { total, next, readingLocked, lockedChaptersByBook, rewardAutoOffered }
// - readingLocked: 全局「欠一次完整观看」标记（跨书生效）
// - lockedChaptersByBook: { [bookId]: 该书锁定边界章 }，按书分别记账，避免章节号串号
// - rewardAutoOffered: 是否已主动弹过广告但被用户中途放弃
const READER_TIME_STORE_KEY = 'reader_reading_time_v1';

function defaultReaderTimeState() {
  return {
    total: 0,
    next: getCachedRewardReaderFirstMs(),
    readingLocked: false,
    lockedChaptersByBook: {},
    rewardAutoOffered: false,
  };
}

function loadReaderTimeState() {
  try {
    const raw = uni.getStorageSync(READER_TIME_STORE_KEY);
    if (!raw || typeof raw !== 'object') return defaultReaderTimeState();
    const total =
      typeof raw.total === 'number' && isFinite(raw.total) && raw.total > 0 ? raw.total : 0;
    const next =
      typeof raw.next === 'number' && isFinite(raw.next) && raw.next > 0
        ? raw.next
        : getCachedRewardReaderFirstMs();
    const readingLocked = !!raw.readingLocked;
    const lockedChaptersByBook =
      raw.lockedChaptersByBook && typeof raw.lockedChaptersByBook === 'object'
        ? raw.lockedChaptersByBook
        : {};
    const rewardAutoOffered = !!raw.rewardAutoOffered;
    // 里程碑不得小于首触阈值，避免被改成 0 后疯狂弹广告
    return {
      total,
      next: Math.max(next, getCachedRewardReaderFirstMs()),
      readingLocked,
      lockedChaptersByBook,
      rewardAutoOffered,
    };
  } catch (e) {
    return defaultReaderTimeState();
  }
}

function saveReaderTimeState(state) {
  try {
    uni.setStorageSync(READER_TIME_STORE_KEY, state);
  } catch (e) {
    // ignore
  }
}

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

// 正文区顶部内边距（rpx）
// CONTENT_PADDING_TOP：阅读态（标题栏/菜单隐藏）的留白，另加状态栏高度
// CONTENT_PADDING_TOP_WITH_MENU：菜单显示时叠加的留白，用于让出自定义标题栏高度
const CONTENT_PADDING_TOP = 40;
const CONTENT_PADDING_TOP_WITH_MENU = 92;

// 信息流/原生广告页「加载完成前禁止翻页」门禁
// FEED_AD_GATE_TIMEOUT_MS：兜底超时。组件既未回调 load 也未回调 error 时强制放行，避免用户被永久卡住
// FEED_AD_TIP_THROTTLE_MS：拦截提示的节流间隔，避免连点时 toast 刷屏
const FEED_AD_GATE_TIMEOUT_MS = 8000;
const FEED_AD_TIP_THROTTLE_MS = 1500;

// 内联信息流/原生广告：AD_INLINE_HEIGHT_RPX 为广告槽预留高度（rpx），
// 分页时按当前行高折算成对应"占位行"，让正文自动为广告让出版面，不挤出可视区
// AD_PLACEHOLDER 是占位行的哨兵串（正文不会出现），分页后替换成真正的 <ad>
const AD_INLINE_HEIGHT_RPX = 320;
const AD_PLACEHOLDER = '<<<READER_INLINE_AD>>>';

// 正文缓存阈值（字符数，约 1MB UTF-16）：超过就不写 storage，
// 避免把几 MB 的长篇塞进 storage 触发写入失败
const BOOK_CONTENT_CACHE_MAX = 500000;

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
      // 状态栏高度（自定义导航栏后需自行让出，H5 为 0）
      statusBarHeight: 0,
      // 底部常驻 Banner 加载失败时撤掉占位（无广告不留空白条）
      bannerAdFailed: false,
      
      // 阅读时长追踪（跨会话累计）
      readingStartTime: 0, // 当前计时片段起点，0 = 未在计时（页面在后台）
      totalReadingTime: 0, // 本次进入阅读页已结算的时长
      storedReadingTime: 0, // 历史累计时长（来自 storage）
      nextRewardAt: getCachedRewardReaderFirstMs(), // 下一个激励触发里程碑：首次（远程可配），之后每 N 分钟
      rewardCheckTimer: null,
      rewardAdPending: false, // 正在请求展示，避免并发重复调用
      rewardNextRetryAt: 0, // 上次未成功展示后的下次重试时间戳
      // 激励视频未完整观看：锁定后续章节，必须先看完才能继续读
      readingLocked: false,
      // 各书籍的锁定边界章：{ [bookId]: 允许阅读的最大章节号 }，按书分别记账，避免章节号串号
      lockedChaptersByBook: {},
      // 是否已主动弹过激励视频但被用户中途放弃（关闭/未看完）：置位后不再自动弹，只保留解锁弹窗
      rewardAutoOffered: false,
      // 点击「免广告/解锁」后到真正的激励视频上屏之间的「加载中」提示（广告出来后自动关闭）
      showRewardLoadingModal: false,
      _rewardShowWatch: null,
      showUnlockModal: false,
      nowTick: Date.now(), // 驱动 isAdFree 等时间相关计算属性刷新（Date.now() 非响应式）
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

      // 信息流广告页门禁：true = 广告尚未加载完成，禁止翻页（点击/滑动/自动翻页均拦截）
      feedAdPending: false,
      feedAdPendingTimer: null,
      feedAdBlockTipAt: 0,

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
    // 用响应式的 nowTick 代替 Date.now()，否则计算属性会被永久缓存、免广告过期后仍为 true
    isAdFree() {
      return this.nowTick < this.adFreeUntil;
    },

    // 正文区顶部留白：状态栏高度 + 阅读态留白（菜单显示时再加标题栏高度）
    contentPaddingTop() {
      const menuExtra = this.showMenu ? uni.upx2px(CONTENT_PADDING_TOP_WITH_MENU) : 0;
      return this.statusBarHeight + uni.upx2px(CONTENT_PADDING_TOP) + menuExtra;
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
        padding: `${this.contentPaddingTop}px ${uni.upx2px(40)}px ${uni.upx2px(180)}px`,
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
      if (!item) return '';
      // 内联广告页：广告之前的那半段正文（广告之后由模板单独渲染 textAfter）
      if (item.adInline) return item.textBefore || '';
      return item.type === 'content' ? item.text : '';
    }
  },

  async onLoad(options) {
    // 自定义导航栏：记录状态栏高度，用于标题栏与正文顶部留白
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo && systemInfo.statusBarHeight ? systemInfo.statusBarHeight : 0;

    // 书籍 id 既有纯数字（1、2…）也有字符串（l_11774600__6434），
    // 不能用 parseInt，否则字符串 id 会变成 NaN，导致查不到书籍（提示“未配置网盘链接”）
    const id =
      options && options.bookId !== undefined && options.bookId !== null
        ? String(options.bookId)
        : '';
    this.loadBookInfo(id);
    this.loadReadingSettings();
    this.loadReadingProgress(id);

    // 恢复跨会话的免广告窗口（看完激励视频解锁的时长）
    this.adFreeUntil = loadAdFreeUntil();

    // 先拉取远程配置（含广告节奏参数），确保首次激励里程碑阈值以远程 ad 段为准
    try {
      await getRemoteConfig();
    } catch (e) {
      // 远程拉取失败时沿用本地兜底默认值，不影响阅读
    }

    // 恢复跨会话累计的阅读时长、激励里程碑与「未看完广告」锁定状态
    const readerTime = loadReaderTimeState();
    this.storedReadingTime = readerTime.total;
    this.nextRewardAt = readerTime.next;
    this.readingLocked = readerTime.readingLocked;
    this.lockedChaptersByBook = readerTime.lockedChaptersByBook || {};
    this.rewardAutoOffered = readerTime.rewardAutoOffered;
    // 之前没看完广告被锁：跨会话/跨书籍保持锁定（阅读超出该书锁定边界的章节仍被拦截）
    if (readerTime.readingLocked) {
      this.showUnlockModal = true;
      console.log(
        `[reader] 恢复未看完广告的章节锁定，本书边界章 ${this.lockedChaptersByBook[id] || '(未记录，锁在当前章)'}`
      );
    }

    // 记录阅读开始时间
    this.readingStartTime = Date.now();
    this.nowTick = Date.now();

    // 自定义导航栏：状态栏文字颜色跟随背景
    this.updateStatusBarStyle();

    // 阅读时长计时与 15 分钟激励检测（onShow 也会启动，此处为兜底）
    this.startRewardCheckTimer();
  },
  
  onUnload() {
    // 离开阅读页：把本次会话时长并入历史累计并落盘
    this.flushReadingTime();
    this.checkAndAutoAddToBookshelf();
    this.saveReadingProgress();
    this.clearAutoFlip();
    this.releaseFeedAdGate();
    this.stopRewardCheckTimer();
    this.stopRewardShowingWatch();
    this.restoreStatusBarStyle();
  },
  
  onHide() {
    // 切换到后台时累计阅读时长（激励视频展示期间不计入，避免广告时长充阅读时长）
    if (this.readingStartTime > 0) {
      if (!isRewardAdShowing()) {
        this.totalReadingTime += Date.now() - this.readingStartTime;
      }
      this.readingStartTime = 0;
    }
    this.flushReadingTime();
    this.stopRewardCheckTimer();
  },
  
  onShow() {
    // 从后台返回时重新开始计时
    this.readingStartTime = Date.now();
    this.nowTick = Date.now();
    this.startRewardCheckTimer();
  },

  watch: {
    // 翻到广告页时，重新随机选位（每次曝光独立随机）
    currentPage(newVal) {
      const item = this.pages[newVal - 1];
      console.log('[reader-feed-ad] page entered, currentPage=', newVal, 'adInline=', !!(item && item.adInline));
      if (item && item.adInline) {
        this.startFeedAd();
      } else {
        // 离开广告页（翻走/换页）立即解锁，避免门禁残留影响正常阅读
        this.releaseFeedAdGate();
      }
    },
  },

  methods: {
    // ============ 阅读页广告（按设计文档） ============
    // 信息流：进入广告页时重置并随机选位（每次曝光重新随机，更细填充分发）
    // 同时上锁：广告未渲染完成前禁止翻页，避免手动连点把还没出来的广告翻过去
    startFeedAd() {
      this.feedAdTried = [];
      this.lockFeedAdGate();
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
        // 所有位都试过且无填充 → 不再拦截，允许用户继续翻页
        this.releaseFeedAdGate();
        console.log('[reader-feed-ad] pick exhausted, pid empty, gate released');
        return;
      }
      const idx = remaining[Math.floor(Math.random() * remaining.length)];
      this.feedAdTried.push(idx);
      this.currentFeedAdPid = list[idx];
      console.log('[reader-feed-ad] pick pid=', this.currentFeedAdPid, 'tried=', this.feedAdTried.length);
    },
    onFeedAdLoad(e) {
      console.log('[reader-feed-ad] load pid=', this.currentFeedAdPid, e);
      // 广告已渲染完成 → 解锁翻页
      this.releaseFeedAdGate();
    },
    onFeedAdError(e) {
      console.warn('[reader-feed-ad] error pid=', this.currentFeedAdPid, e);
      // 无填充/错误兜底：最多切换 2 个不同位，且加 1s 退避延迟，
      // 避免同一页面瞬间刷空整个池（属反刷量行为，且多数无填充是环境/账号级而非单位级）
      const maxFeedFallback = Math.min(AD_FEED_PID_LIST?.length || 0, 2);
      if (this.feedAdTried.length < maxFeedFallback) {
        // 还有备用位 → 保持拦截，等下一个位的结果
        setTimeout(() => this.pickNextFeedAdPid(), 1000);
        return;
      }
      // 已无可用位（无填充）→ 解锁翻页，不让用户卡在空白广告页
      this.releaseFeedAdGate();
    },

    // ============ 信息流广告页翻页门禁 ============
    // 规则：进入广告页上锁；渲染完成(@load)或无填充(位用尽)解锁；另有兜底超时强制解锁
    lockFeedAdGate() {
      this.clearFeedAdGateTimer();
      this.feedAdPending = true;
      this.feedAdPendingTimer = setTimeout(() => {
        console.warn('[reader-feed-ad] gate timeout, force release');
        this.releaseFeedAdGate();
      }, FEED_AD_GATE_TIMEOUT_MS);
    },

    releaseFeedAdGate() {
      this.clearFeedAdGateTimer();
      this.feedAdPending = false;
    },

    clearFeedAdGateTimer() {
      if (this.feedAdPendingTimer) {
        clearTimeout(this.feedAdPendingTimer);
        this.feedAdPendingTimer = null;
      }
    },

    // 翻页前调用：广告页未加载完成时拦截，返回 true 表示本次翻页被拦下
    isPageFlipBlocked() {
      if (!this.feedAdPending) return false;
      const now = Date.now();
      if (now - this.feedAdBlockTipAt > FEED_AD_TIP_THROTTLE_MS) {
        this.feedAdBlockTipAt = now;
        uni.showToast({ title: '加载中，请稍候', icon: 'none', duration: 1200 });
      }
      return true;
    },
    onBannerAdLoad(e) {
      this.bannerAdFailed = false;
      console.log('[reader-banner-ad] load', e);
    },
    onBannerAdError(e) {
      // 无填充/加载失败时撤掉占位，避免底部留一条空白把正文顶上去
      this.bannerAdFailed = true;
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

    // 跳转到当前章承载内联信息流广告的页；仅当该页在当前页之后才跳，避免往回跳 / 重复展示
    jumpToFeedAdPage() {
      const idx = this.pages.findIndex((p) => p.adInline);
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
      if (this.rewardAdPending) return;
      this.rewardAdPending = true;
      try {
        const res = await this.runRewardedAdWithLoading({
          force: true,
          extra: { scene: 'reader_unlock', bookId: this.bookInfo && this.bookInfo.id },
        });
        if (res && res.shown && res.isEnded) {
          this.adFreeUntil = Date.now() + getCachedRewardAdFreeMs();
          this.nowTick = Date.now();
          saveAdFreeUntil(this.adFreeUntil);
          // 完整看完一次激励视频，顺带解除章节锁定
          if (this.readingLocked) {
            this.unlockReading();
            this.advanceRewardMilestone('reader_unlock');
          }
          uni.showToast({ title: '已解锁30分钟免广告', icon: 'success' });
        } else if (res && res.shown && !res.isEnded) {
          uni.showToast({ title: '未看完，未解锁', icon: 'none' });
        } else {
          uni.showToast({ title: '广告未能展示，请稍后重试', icon: 'none' });
        }
      } catch (e) {
        console.warn('[reader] reward unlock error', e);
        uni.showToast({ title: '解锁失败，请稍后重试', icon: 'none' });
      } finally {
        this.rewardAdPending = false;
      }
    },

    /** 弹出「广告加载中」提示并展示激励视频；原生广告真正上屏后自动关闭该提示 */
    async runRewardedAdWithLoading(showOptions) {
      this.showRewardLoadingModal = true;
      this.startRewardShowingWatch();
      try {
        return await showRewardedVideoAd(showOptions);
      } finally {
        this.showRewardLoadingModal = false;
        this.stopRewardShowingWatch();
      }
    },

    // 轮询 rewardAdState.showing：它只在原生激励视频真正上屏后才置 true，
    // 一旦上屏立即关闭「加载中」提示（期间仍可能被其它弹窗覆盖，但广告是原生层在最上）
    startRewardShowingWatch() {
      this.stopRewardShowingWatch();
      this._rewardShowWatch = setInterval(() => {
        if (rewardAdState.showing) {
          this.showRewardLoadingModal = false;
          this.stopRewardShowingWatch();
        }
      }, 120);
    },

    stopRewardShowingWatch() {
      if (this._rewardShowWatch) {
        clearInterval(this._rewardShowWatch);
        this._rewardShowWatch = null;
      }
    },

    // ============ 未完整观看激励视频 → 锁定后续章节 ============
    // 设定锁定边界并持久化；reason 用于日志。lockReading 只在「确定要锁定」时调用：
    // 里程碑刚达到（含 kill 进程前）或用户中途关闭广告。边界按书籍分别记录，避免章节号串号
    lockReading(reason) {
      this.readingLocked = true;
      const bookId = this.bookInfo && this.bookInfo.id;
      // 同一本书只记一次边界（取最早触发时的章），保证之后无法往前挪边界来绕过
      if (bookId && !(this.lockedChaptersByBook[bookId] > 0)) {
        this.lockedChaptersByBook[bookId] = this.currentChapterNum || 1;
      }
      this.showUnlockModal = true;
      this.clearAutoFlip(); // 锁定期停止自动翻页
      this.persistReaderTime(); // 立即落盘，保证「看广告途中 kill」后锁定仍在
      console.warn(
        '[reader] 未完整观看激励视频，锁定后续章节:',
        reason,
        '本书边界章',
        this.lockedChaptersByBook[bookId]
      );
    },

    unlockReading() {
      if (
        !this.readingLocked &&
        !(this.lockedChaptersByBook && Object.keys(this.lockedChaptersByBook).length) &&
        !this.rewardAutoOffered
      ) {
        return;
      }
      this.readingLocked = false;
      this.lockedChaptersByBook = {};
      this.rewardAutoOffered = false; // 解锁后清除「已放弃」标记，恢复正常节奏
      this.showUnlockModal = false;
      this.persistReaderTime(); // 解除锁定也要落盘
      console.log('[reader] 章节锁定已解除');
    },

    /** 目标章节是否被锁（按当前书籍分别判断边界；只允许阅读 <= 该书边界章的章节） */
    isChapterLocked(chapterNum) {
      if (!this.readingLocked) return false;
      const bookId = this.bookInfo && this.bookInfo.id;
      const boundary = bookId ? this.lockedChaptersByBook[bookId] || 0 : 0;
      if (boundary > 0) return chapterNum > boundary;
      // 当前书未记录边界（在别的书被锁，首次进入本书）：锁定在当前章，禁止继续往后读
      return chapterNum > this.currentChapterNum;
    },

    /** 越章前拦截：被锁则提示并弹出解锁弹窗，返回 true 表示已拦截 */
    blockIfChapterLocked(chapterNum) {
      if (!this.isChapterLocked(chapterNum)) return false;
      uni.showToast({ title: '需看完广告才能读后续章节', icon: 'none' });
      this.showUnlockModal = true;
      return true;
    },

    /** 看完激励视频后推进到下一个里程碑 */
    advanceRewardMilestone(source) {
      const total = this.getTotalReadingTime();
      this.nextRewardAt =
        Math.max(this.nextRewardAt, total) + getCachedRewardReaderIntervalMs();
      this.flushReadingTime();
      console.log(
        `[reader] (${source}) next rewarded milestone at ${Math.round(this.nextRewardAt / 60000)}min`
      );
    },

    /** 主动看广告解锁后续章节 */
    async unlockByRewardAd() {
      if (this.rewardAdPending) return;
      this.rewardAdPending = true;
      try {
        const res = await this.runRewardedAdWithLoading({
          force: true,
          extra: { scene: 'chapter_unlock', bookId: this.bookInfo && this.bookInfo.id },
        });
        if (res && res.shown && res.isEnded) {
          this.unlockReading();
          this.advanceRewardMilestone('chapter_unlock');
          uni.showToast({ title: '已解锁后续章节', icon: 'success' });
          return;
        }
        if (res && res.shown && !res.isEnded) {
          uni.showToast({ title: '未看完广告，无法解锁', icon: 'none' });
          return;
        }
        uni.showToast({ title: '未能展示，请稍后重试', icon: 'none' });
      } catch (e) {
        console.warn('[reader] chapter unlock error', e);
        uni.showToast({ title: '解锁失败，请稍后重试', icon: 'none' });
      } finally {
        this.rewardAdPending = false;
      }
    },

    /** 锁定弹窗中选择离开阅读页 */
    exitReaderFromLock() {
      this.clearAutoFlip();
      uni.navigateBack();
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

      // 兜底门禁：任何直接调用（含恢复阅读进度）都必须经过锁定校验，
      // 未完整观看激励视频时禁止进入比本书边界更靠后的章节
      if (this.isChapterLocked(chapterNum)) {
        uni.showToast({ title: '需看完广告才能读后续章节', icon: 'none' });
        this.showUnlockModal = true;
        return;
      }

      const chapter = this.chapters.find(ch => ch.chapter === chapterNum);
      if (chapter) {
        this.currentChapterNum = chapterNum;
        this.currentChapter = chapter;
        this.saveReadingProgress();
        // 阅读超过 5 章且未主动加入书架时自动加入
        this.checkAndAutoAddToBookshelf();
        this.showMenu = false;
        this.showCatalogModal = false;
        
        // 换章必然离开原广告页：立即解锁并撤销兜底计时，避免门禁残留
        this.releaseFeedAdGate();
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
        // 未看完激励视频时不允许读后续章节
        if (this.blockIfChapterLocked(this.currentChapterNum + 1)) return;
        this.loadChapter(this.currentChapterNum + 1);
      } else {
        uni.showToast({ title: '已是最后一章', icon: 'none' });
      }
    },
    
    onChapterSliderChange(e) {
      const target = Number(e.detail.value);
      if (this.blockIfChapterLocked(target)) return;
      this.loadChapter(target);
    },
    
    jumpToChapter(chapterNum) {
      const target = Number(chapterNum);
      if (this.blockIfChapterLocked(target)) return;
      this.loadChapter(target);
    },
    
    // ============ 页内翻页 ============
    prevPage() {
      // 广告页尚未加载完成 → 禁止翻页（手动连点/滑动/自动翻页统一拦截）
      if (this.isPageFlipBlocked()) return;
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      } else if (this.currentChapterNum > 1) {
        this.loadChapter(this.currentChapterNum - 1, 'last');
      } else {
        uni.showToast({ title: '已是第一章第一页', icon: 'none', duration: 1000 });
      }
    },

    nextPage() {
      // 广告页尚未加载完成 → 禁止翻页（手动连点/滑动/自动翻页统一拦截）
      if (this.isPageFlipBlocked()) return;
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
      } else if (this.currentChapterNum < this.totalChapters) {
        // 章末进入下一章：未看完激励视频时不允许读后续章节
        if (this.blockIfChapterLocked(this.currentChapterNum + 1)) return;
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
        const paddingTop = this.statusBarHeight + uni.upx2px(CONTENT_PADDING_TOP);
        const paddingBottom = uni.upx2px(180);
        const linePx = Math.max(1, this.fontSize * this.lineHeight);
        const titleLines = 2;
        const availableWidth = Math.max(this.fontSize, width - paddingX * 2);
        const charsPerLine = Math.max(1, Math.floor(availableWidth / (this.fontSize * 1.05)));
        const bodyLines = Math.max(1, Math.floor((height - paddingTop - paddingBottom) / linePx));
      const firstPageLines = Math.max(1, bodyLines - titleLines);
      const lines = [];
      const text = this.displayContent.replace(/\r\n/g, '\n');
      // 每个段落结束后的行下标，用于把广告插在段落边界而不是段落中间
      const paragraphEnds = [];

      text.split('\n').forEach(paragraph => {
        const normalized = paragraph || ' ';
        for (let index = 0; index < normalized.length; index += charsPerLine) {
          lines.push(normalized.slice(index, index + charsPerLine));
        }
        paragraphEnds.push(lines.length);
      });

      // 信息流/原生：内联到正文流（文档：前 N 章不展示，之后每 M 章插 1 条，且免广告时段内不插）
      const chapterNum = this.currentChapterNum;
      const feedEligible = this.readerFeedAdEnabled
        && !this.isAdFree
        && this.adReady
        && chapterNum > AD_FEED_START_CHAPTER
        && (chapterNum - AD_FEED_START_CHAPTER) % getCachedFeedEveryChapter() === 0;
      if (feedEligible && paragraphEnds.length >= 2) {
        // 插在本章正文中段的段落边界，避免在章节首尾与插屏/翻章断点冲突
        const adInsertAt = paragraphEnds[Math.floor((paragraphEnds.length - 1) / 2)];
        // 按当前行高把广告槽高度折算成占位行数（+1 行作为广告上下的呼吸间距）
        const adReserveLines = Math.max(1, Math.ceil(uni.upx2px(AD_INLINE_HEIGHT_RPX) / linePx) + 1);
        for (let i = 0; i < adReserveLines; i++) {
          lines.splice(adInsertAt, 0, AD_PLACEHOLDER);
        }
      }

      const result = [];
      let cursor = 0;
      while (cursor < lines.length) {
        const size = result.length === 0 ? firstPageLines : bodyLines;
        result.push(lines.slice(cursor, cursor + size).join('\n'));
        cursor += size;
      }
      const contentPages = result.length ? result : [''];

      // 把占位行替换成真正的广告槽；同一批占位若被切到相邻页，只保留首次出现的那页
      let adPageUsed = false;
      const pages = contentPages.map((pageText) => {
        if (!pageText.includes(AD_PLACEHOLDER)) {
          return { type: 'content', text: pageText };
        }
        if (adPageUsed) {
          const cleaned = pageText.split('\n').filter(line => line !== AD_PLACEHOLDER).join('\n');
          return { type: 'content', text: cleaned };
        }
        adPageUsed = true;
        const parts = pageText.split(AD_PLACEHOLDER);
        return {
          type: 'content',
          adInline: true,
          textBefore: parts[0].replace(/\n+$/, ''),
          textAfter: parts[parts.length - 1].replace(/^\n+/, '')
        };
      });

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
      this.updateStatusBarStyle();
    },

    // 自定义导航栏下手动同步状态栏文字颜色（深色背景用浅色文字）
    updateStatusBarStyle() {
      // #ifdef APP-PLUS
      try {
        plus.navigator.setStatusBarStyle(this.isNightMode ? 'light' : 'dark');
      } catch (e) {
        // ignore
      }
      // #endif
    },

    restoreStatusBarStyle() {
      // #ifdef APP-PLUS
      try {
        plus.navigator.setStatusBarStyle('light');
      } catch (e) {
        // ignore
      }
      // #endif
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

    // 历史累计 + 本次会话已结算 + 当前正在计时的片段
    getTotalReadingTime() {
      const running =
        this.readingStartTime > 0 ? Date.now() - this.readingStartTime : 0;
      return this.storedReadingTime + this.totalReadingTime + running;
    },

    // 结算当前计时片段并落盘（跨会话累计；页面在后台时不结算，避免计入后台时长）
    flushReadingTime() {
      if (this.readingStartTime > 0) {
        this.totalReadingTime += Date.now() - this.readingStartTime;
        this.readingStartTime = Date.now();
      }
      if (this.totalReadingTime > 0) {
        this.storedReadingTime += this.totalReadingTime;
        this.totalReadingTime = 0;
      }
      this.persistReaderTime();
    },

    // 持久化累计时长 + 激励里程碑 + 未看完广告的锁定状态（跨会话/跨书籍延续）
    persistReaderTime() {
      saveReaderTimeState({
        total: this.storedReadingTime,
        next: this.nextRewardAt,
        readingLocked: this.readingLocked,
        lockedChaptersByBook: this.lockedChaptersByBook,
        rewardAutoOffered: this.rewardAutoOffered,
      });
    },

    // 累计阅读时长达到里程碑时主动弹激励视频：首次 15 分钟，之后每 30 分钟
    async checkReaderTimeReward() {
      // 刷新时间基准，保证 isAdFree 等时间相关状态会随免广告窗口过期而更新
      this.nowTick = Date.now();
      // 每 10s 落盘一次，避免杀进程/崩溃丢失本次会话时长
      this.flushReadingTime();

      if (this.rewardAdPending) return;
      if (this.isAdFree) return; // 免广告期内不弹，机会保留到窗口结束后
      if (this.loading) return; // 正文加载中不打扰
      // 已主动弹过且被用户放弃（中途关闭/未看完）：不再自动弹，等用户从解锁弹窗手动触发
      if (this.rewardAutoOffered) return;

      const total = this.getTotalReadingTime();
      if (total < this.nextRewardAt) {
        // 未到里程碑：若处于免广告窗口（如看完广告解锁），解除锁定
        if (this.readingLocked && this.isAdFree) {
          this.unlockReading();
        }
        return;
      }

      // 已达里程碑：用户欠一次完整观看。先记录锁定边界（即使广告尚未展示，
      // 这一刻就持久化，避免「弹广告途中 kill 进程」后阅读解锁/丢失锁定）
      if (AD_REWARD_LOCK_CHAPTERS) {
        this.lockReading('milestone_reached');
      }

      // 上一次未成功展示：等重试时间到再说
      if (Date.now() < this.rewardNextRetryAt) return;
      // 已有激励视频在展示 / 处于频控窗口：不消耗触发机会，等下一个检测周期
      if (isRewardAdShowing()) return;
      if (!canShowRewardAd()) return;

      const isFirst = this.nextRewardAt <= getCachedRewardReaderFirstMs();
      this.rewardAdPending = true;
      try {
        console.log(
          `[reader] reading time ${Math.round(total / 1000)}s reached milestone ${Math.round(this.nextRewardAt / 1000)}s, trigger rewarded ad`
        );
        const res = await showRewardedVideoAd({
          scene: isFirst ? 'reader_time_15min' : 'reader_time_30min',
        });
        if (res && res.shown && res.isEnded) {
          // 完整看完：解锁 + 推进里程碑（首次后每 30 分钟一次）
          this.unlockReading();
          this.advanceRewardMilestone('reader_time');
          return;
        }
        if (res && res.shown && !res.isEnded) {
          // 未看完：标记已主动放弃，停止自动弹，仅保留解锁弹窗
          this.rewardAutoOffered = true;
          this.showUnlockModal = true;
          this.persistReaderTime();
          return;
        }
        // 未展示（组件未就绪 / 无填充 / 被跳过）：不怪用户，保留机会稍后重试
        this.rewardNextRetryAt = Date.now() + AD_REWARD_RETRY_MS;
        console.warn('[reader] rewarded ad not shown, reason=', res && res.reason);
      } catch (e) {
        this.rewardNextRetryAt = Date.now() + AD_REWARD_RETRY_MS;
        console.warn('[reader] rewarded ad error', e);
      } finally {
        this.rewardAdPending = false;
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
          // 章节锁定时不自动往后翻
          if (this.readingLocked) return;
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
        if (this.loading) this.showLoadFeedbackHint('加载超时（90 秒未出正文）');
      }, 90000);
    },

    clearLoadWatchdog() {
      if (this.loadWatchdogTimer) {
        clearTimeout(this.loadWatchdogTimer);
        this.loadWatchdogTimer = null;
      }
    },

    showLoadFeedbackHint(reason) {
      // 带上具体失败环节，便于反馈时直接定位（网盘解析 / 下载 / 超时 各自原因不同）
      const base = '书籍资源加载失败，请加入官方反馈群 1041698859 留言反馈';
      uni.showModal({
        title: '加载失败',
        content: reason ? `${base}\n\n原因：${reason}` : `${base}（或加载超时）`,
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
      this.bookInfo = this.findBookInfo(id) || {};
      this.loadBookContent(id);
    },

    // 统一按字符串比较，兼容数字 id（1、2…）与字符串 id（l_11774600__6434）；
    // 书籍可能来自内置数据或云端书单，两边都有时优先取带网盘链接的一条，
    // 避免云端数据缺 readUrl 时误判为“未配置网盘链接”
    findBookInfo(id) {
      const fromStatic = booksData.find(book => String(book.id) === String(id));
      const fromList = getBookById(id);
      if (fromStatic && fromStatic.readUrl) return fromStatic;
      if (fromList && fromList.readUrl) return fromList;
      return fromStatic || fromList || null;
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
        // 先确认书单里确实有这本书，避免把「查不到书」误报成「未配置网盘链接」
        if (!this.bookInfo || !this.bookInfo.id) {
          throw new Error('未找到该书籍数据');
        }

        // 解析网盘链接获取直链（仅在 App/小程序中）
        if (this.bookInfo.readUrl) {
          try {
            const parseResult = await parseNetdiskUrl(this.bookInfo.readUrl);
            
            if (parseResult && parseResult.success && parseResult.url) {
              contentUrl = parseResult.url;
              console.log('客户端解析网盘链接成功:', contentUrl);
            } else {
              throw new Error(`网盘链接解析失败（${parseResult?.error || '未知'}）`);
            }
          } catch (error) {
            console.error('客户端解析网盘链接失败:', error);
            // 透传具体原因（如"无法获取下载链接，所有方法都失败了"/errno），不要吞成一句空话
            throw new Error(error.message.includes('网盘链接解析失败')
              ? error.message
              : `网盘链接解析失败（${error.message}）`);
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
          // 百度直链域名：分享页 pan.baidu.com、下载节点 pcs.baidu.com、
          // 以及文档/文本预览节点 pcsdata.baidu.com（dlink 拿不到时的兜底直链就落在 pcsdata 上）
          const isQuarkUrl = contentUrl.includes('drive-pc.quark.cn') || contentUrl.includes('drive.quark.cn');
          const isBaiduUrl = contentUrl.includes('pcs.baidu.com')
            || contentUrl.includes('pan.baidu.com')
            || contentUrl.includes('pcsdata.baidu.com');
          
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

        // 缓存内容：仅缓存较小的书，且失败不影响阅读
        // （正文已经拿到手，缓存只是加速二次进入；超过阈值或写入失败静默跳过，
        //   否则 storage 写入抛异常会被外层 catch 吞成"加载失败"，把成功误报成失败）
        this.cacheBookContent(bookId);

        this.parseBookContent();
      } catch (error) {
        console.error('加载失败：', error);
        this.showLoadFeedbackHint(this.describeLoadError(error));
      } finally {
        this.clearLoadWatchdog();
        this.loading = false;
      }
    },

    // 把加载异常转成可直接反馈给群的文本（网盘解析 / 下载 / H5 限制 各不相同）
    describeLoadError(error) {
      const msg = (error && error.message) || String(error || '');
      if (msg.includes('未找到该书籍数据')) return '书单中没有这本书的数据';
      if (msg.includes('未配置网盘链接')) return '该书未配置网盘链接';
      if (msg.includes('网盘链接解析失败')) return msg;
      if (msg.includes('状态码')) return `正文下载失败：${msg}`;
      if (msg.includes('H5')) return 'H5 版本暂不支持在线阅读';
      return msg || '未知错误';
    },

    // 缓存正文，失败静默：缓存只是加速二次进入，不能影响本次阅读
    cacheBookContent(bookId) {
      if (!this.fullContent || this.fullContent.length > BOOK_CONTENT_CACHE_MAX) return;
      try {
        uni.setStorageSync(`book_content_${bookId}`, {
          content: this.fullContent,
          timestamp: Date.now()
        });
      } catch (e) {
        console.warn('[reader] 缓存正文失败（不影响阅读）:', e);
      }
    },

    
    parseBookContent() {
      this.chapters = parseChapters(this.fullContent);
      this.totalChapters = this.chapters.length;
      
      if (this.chapters.length > 0) {
        // 先恢复阅读进度
        this.loadReadingProgress(this.bookInfo.id);
        // 跨书锁定：被锁且本书尚无边界记录时，把边界记为「上次读到哪章」，
        // 这样换一本书也只让读已读部分、不能往后读，必须看完广告才解锁
        if (this.readingLocked && !(this.lockedChaptersByBook[this.bookInfo.id] > 0)) {
          this.lockedChaptersByBook[this.bookInfo.id] = this.currentChapterNum || 1;
          this.persistReaderTime();
        }
        // 再加载章节（loadChapter 内含锁定兜底门禁）
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

/* 未看完激励视频 → 锁定后续章节弹窗：跟随日间/夜间同步 */
.reader-page.night-mode .unlock-modal {
  background: #2b2b2b;
}

.reader-page.night-mode .unlock-title {
  color: #f0e8df;
}

.reader-page.night-mode .unlock-desc {
  color: #b0a89c;
}

.reader-page.night-mode .unlock-tip,
.reader-page.night-mode .unlock-back {
  color: #aaa;
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
  /* 仅作兜底：实际 padding 由 contentStyle 内联计算（状态栏高度 + 阅读态/菜单态留白） */
  padding: 40rpx 40rpx 180rpx;
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

/* 未看完激励视频 → 锁定后续章节弹窗 */
.unlock-modal {
  width: 560rpx;
  padding: 48rpx 40rpx 40rpx;
  background: #fff;
  border-radius: 24rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.unlock-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #222;
}

.unlock-desc {
  margin-top: 20rpx;
  font-size: 26rpx;
  color: #666;
  text-align: center;
  line-height: 1.6;
}

.unlock-btn {
  margin-top: 40rpx;
  width: 100%;
  height: 88rpx;
  background: #007aff;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.unlock-btn-text {
  color: #fff;
  font-size: 30rpx;
}

.unlock-tip {
  margin-top: 20rpx;
  font-size: 22rpx;
  color: #999;
  text-align: center;
}

.unlock-back {
  margin-top: 32rpx;
  font-size: 26rpx;
  color: #999;
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

/* ============ 阅读页信息流/原生广告（内联在正文段落之间） ============ */
/* 广告槽高度与 AD_INLINE_HEIGHT_RPX 保持一致：分页时已按此高度预留了版面 */
.reader-inline-ad {
  position: relative;
  width: 100%;
  height: 320rpx;
  margin: 16rpx 0;
  box-sizing: border-box;
  overflow: hidden;
}

/* 原生信息流广告组件占满宽度，并预留渲染高度（无填充时不塌成 0 高） */
.reader-feed-ad {
  width: 100%;
  min-height: 240rpx;
}

/* 广告未渲染完成时的占位遮罩：期间禁止翻页，避免用户只看到半截广告 */
.reader-feed-ad-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.reader-feed-ad-tip {
  font-size: 24rpx;
  color: #a08a68;
  letter-spacing: 2rpx;
}

/* 阅读页底部常驻 Banner（文档：阅读页底部常驻，轮播）
   高度在这里统一控制：容器定高 + 裁剪，避免广告素材把正文挤上去；
   调整高度只改 .reader-banner 的 height 即可（rpx，70rpx ≈ 35px） */
.reader-banner {
  width: 100%;
  min-height: 70rpx;
  min-height: 0;
  overflow: hidden;
  background: #fff;
  box-sizing: border-box;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reader-banner-el {
  width: 100%;
  height: 100%;
}

</style>

