/**
 * 在线阅读页
 * 流程：确保书籍数据 → 取 readUrl → 调 getBookContent 云函数（服务端解析网盘）→
 *       下载正文（云存储，免白名单）→ chapter-parser 切章 → 本地翻页。
 * 看广告解锁：首次进入需看完激励视频（已解锁的书记录到 storage，之后免广告）。
 *
 * 交互（对齐 uniapp reader.vue）：
 *  - 工具栏/底部菜单默认隐藏，点击正文中间 1/3 唤出或收起；
 *  - 点击左/右 1/3 翻章；菜单打开时任意点击收起菜单；
 *  - 翻页方式：horizontal（左右滑动切章）/ vertical（上下滚动连续阅读）；
 *  - 阅读设置（字体大小/行距/翻页方式）持久化到 storage。
 */
const { ensureLoaded, getBookById } = require('../../utils/books');
const { parseChapters, paginateContent } = require('../../utils/chapter-parser');
const { showRewardedAd, showInterstitialAd } = require('../../utils/ad');
const {
  AUTO_ADD_CHAPTERS,
  isInShelf,
  addToShelf,
  updateProgress,
  removeFromShelf,
} = require('../../utils/bookshelf');
// 阅读页广告规则（见 阅读页广告规则.md）
const {
  FEED_ENABLED,
  FEED_START_CHAPTER,
  FEED_EVERY_CHAPTER,
  FEED_PER_CHAPTER,
  FEED_WAIT_LOADED,
  FEED_WAIT_TIMEOUT_MS,
  FEED_UNIT_IDS,
  BANNER_ENABLED,
  BANNER_UNIT_ID,
  INTERSTITIAL_ENABLED,
  INTERSTITIAL_EVERY_CHAPTER,
  INTERSTITIAL_MIN_INTERVAL_MS,
  REWARD_LOCK_CHAPTERS,
  REWARD_RETRY_MS,
  REWARD_AD_FREE_MS,
} = require('../../utils/ad-config');
const {
  addReadingMs,
  isMilestoneReached,
  advanceMilestone,
  isAdFree,
  extendAdFree,
  getAdFreeLeftMs,
  getLock,
  setLock,
  clearLock,
  startRewardPending,
  getRewardPending,
  clearRewardPending,
} = require('../../utils/reader-ads');

const FONT_MIN = 24;
const FONT_MAX = 48;
const FONT_DEFAULT = 32;
const LINE_SPACINGS = [1.5, 1.85, 2.2];
// 阅读字体：覆盖 iOS / Android / 开发者工具常见字族，取不到时回退到系统默认
const FONT_FAMILIES = [
  { name: '默认', value: '-apple-system, sans-serif' },
  { name: '宋体', value: "'Songti SC', SimSun, serif" },
  { name: '黑体', value: "'PingFang SC', 'Heiti SC', SimHei, sans-serif" },
  { name: '楷体', value: "'Kaiti SC', KaiTi, STKaiti, serif" },
  { name: '圆体', value: "'Yuanti SC', YouYuan, sans-serif" },
];
// 阅读背景：默认（米黄）/ 白天（白）/ 护眼（淡绿）/ 夜间（深色）
const THEMES = [
  { name: '默认', value: 'default' },
  { name: '白天', value: 'day' },
  { name: '护眼', value: 'eye' },
  { name: '夜间', value: 'night' },
];
const SETTINGS_KEY = 'reader_settings';

/**
 * 广告开关：仅正式版（release）启用
 * 开发版 / 体验版直接放行阅读，方便调试；上线前无需改代码
 */
function adEnabled() {
  try {
    const info = wx.getAccountInfoSync();
    const env = info && info.miniProgram && info.miniProgram.envVersion;
    return env === 'release';
  } catch (e) {
    return false;
  }
}

Page({
  data: {
    loading: true,
    error: '',
    bookId: null,
    bookTitle: '',
    chapterIndex: 0,
    chapterCount: 0,
    sliderValue: 0,
    chapterTitle: '',
    chapterContent: '',
    pageContent: '',
    pageIndex: 0,
    pageCount: 1,
    fontSize: FONT_DEFAULT,
    fontFamily: FONT_FAMILIES[0].value,
    lineHeight: 1.85,
    lineSpacings: LINE_SPACINGS,
    fontFamilies: FONT_FAMILIES,
    themes: THEMES,
    theme: 'default',
    showMenu: false,
    showSettings: false,
    showToc: false,
    tocList: [],
    tocHasMore: false,
    scrollTop: 0,
    inShelf: false,
    // 广告：当前正文页是否带信息流（原生模板）广告（内嵌在正文下方，不单独成页）
    feedAdVisible: false,
    adUnitId: '',
    // 底部常驻 banner 广告位（留空则不显示）；加载失败时隐藏，避免留一条空白
    bannerUnitId: BANNER_ENABLED ? BANNER_UNIT_ID : '',
    bannerVisible: BANNER_ENABLED ? !!BANNER_UNIT_ID : false,
    // banner 实测高度（px）：底部菜单按它上移，紧贴 banner 顶部
    bannerHeight: 0,
    // 是否处于免广告时段 / 是否被锁章
    adFree: false,
    chapterLocked: false,
    // 隐藏测量区：批量量算每页真实高度
    measureTexts: [],
  },

  _chapters: [],
  _book: null,
  _reqChapter: 0,
  _topTick: 0,
  _screenWidth: 375,
  _touchX: 0,
  _touchY: 0,
  // 当前章切出的页内容与正文区可用尺寸（px）
  _pages: [],
  // 目录弹窗一次渲染的章节数（滚动到底可继续加载）
  _tocLimit: 100,
  // 底部图标切夜间前的原主题，用于退出夜间时还原
  _prevTheme: 'default',
  _bodyHeight: 0,
  _bodyWidth: 0,
  // 每页字数缓存：key = 字号_行距_正文高度
  _fitCache: {},
  // 当前章的分页视图（正文页；slot >= 0 表示该页正文下方带一条信息流广告）
  _viewPages: [],
  // 带信息流广告的正文页下标列表（空数组表示本章不插）
  _adIndexes: [],
  // 首章分页就绪后才允许插信息流广告
  _adReady: false,
  // 切章定位：true = 从本章第一页开始（而非沿用当前页码）
  _openAtHead: false,
  // 阅读时长计时器
  _timer: null,
  _lastTick: 0,
  // 激励视频状态
  _rewardShowing: false,
  _rewardAutoOffered: false,
  _rewardRetryAt: 0,
  // 上次弹插屏的时间戳（用于最小间隔频控）
  _lastInterstitialAt: 0,
  // 页内信息流广告是否已加载完成（未完成时不允许翻页）
  _feedAdReady: true,
  _feedAdTimer: null,

  onLoad(options) {
    const bookId = options && options.id;
    const reqChapter = options && options.chapter ? parseInt(options.chapter, 10) : 0;
    this.setData({ bookId });
    this._reqChapter = isFinite(reqChapter) && reqChapter > 0 ? reqChapter : 0;

    // 恢复阅读设置（字体/行距/翻页方式/夜间模式）
    try {
      const s = wx.getStorageSync(SETTINGS_KEY) || {};
      this.setData({
        fontSize: s.fontSize || FONT_DEFAULT,
        fontFamily: s.fontFamily || FONT_FAMILIES[0].value,
        lineHeight: s.lineHeight || 1.85,
        theme: s.theme || 'default',
      });
    } catch (e) {
      // 忽略
    }
    try {
      this._screenWidth = (wx.getWindowInfo && wx.getWindowInfo().windowWidth) ||
        (wx.getSystemInfoSync && wx.getSystemInfoSync().windowWidth) || 375;
    } catch (e) {
      this._screenWidth = 375;
    }

    this._loadBook(() => this._maybeUnlock());
  },

  onShow() {
    // 上次激励视频没播完就切后台 / 杀进程：本次视为未完成，先补判再刷新状态
    this._settleAbandonedReward();
    this._refreshAdFlags();
    this._resumeReadingTimer();
  },

  onHide() {
    this._pauseReadingTimer();
    // 广告播放中切后台：保留 storage 里的「未完成」标记，
    // 若用户直接杀进程，下次启动按未看完处理，不给免广告
  },

  onUnload() {
    this._pauseReadingTimer();
    if (this._feedAdTimer) {
      clearTimeout(this._feedAdTimer);
      this._feedAdTimer = null;
    }
  },

  _loadBook(done) {
    ensureLoaded()
      .then(() => {
        const book = getBookById(this.data.bookId);
        this._book = book;
        if (!book) {
          this.setData({ loading: false, error: '未找到该书' });
          return;
        }
        this.setData({ bookTitle: book.title });
        if (!book.readUrl) {
          this.setData({ loading: false, error: '该书暂不支持在线阅读' });
          return;
        }
        done && done();
      })
      .catch(() => {
        this.setData({ loading: false, error: '书籍数据加载失败，请重试' });
      });
  },

  _unlockKey() {
    return `swts_read_unlock_${this.data.bookId}`;
  },

  _maybeUnlock() {
    const unlocked = wx.getStorageSync(this._unlockKey());
    // 免广告时段内直接放行
    if (!adEnabled() || unlocked || isAdFree()) {
      this._fetchContent();
      return;
    }
    this._showAdToUnlock();
  },

  _showAdToUnlock() {
    this.setData({ loading: true, error: '' });
    showRewardedAd()
      .then(() => {
        wx.setStorageSync(this._unlockKey(), '1');
        this._fetchContent();
      })
      .catch((err) => {
        const msg = (err && err.message) || '';
        if (msg.indexOf('不支持') >= 0) {
          // 环境不支持广告：降级允许阅读，避免硬性阻断
          wx.setStorageSync(this._unlockKey(), '1');
          this._fetchContent();
        } else {
          this.setData({ loading: false, error: '需看完广告才能解锁阅读，请重试' });
        }
      });
  },

  onRetry() {
    if (!this._book) {
      this._loadBook(() => this._maybeUnlock());
    } else {
      this._maybeUnlock();
    }
  },

  _fetchContent() {
    this.setData({ loading: true, error: '' });
    const readUrl = this._book.readUrl;
    wx.cloud
      .callFunction({ name: 'getBookContent', data: { readUrl } })
      .then((res) => {
        const result = res.result || {};
        if (result.ok === false || !result.fileID) {
          throw new Error(result.errMsg || '解析失败');
        }
        return this._downloadText(result);
      })
      .then((text) => {
        const chapters = parseChapters(text);
        this._chapters = chapters;
        const count = chapters.length;
        let idx = this._reqChapter;
        if (idx < 0 || idx >= count) idx = 0;
        this.setData({ loading: false, chapterCount: count }, () => {
          // 先量出正文区可用尺寸，再据此分页
          this._measureBody().then(() => {
            this._renderChapter(idx);
            this._afterContentReady();
          });
        });
      })
      .catch((err) => {
        const msg = (err && (err.errMsg || err.message)) || String(err);
        this.setData({ loading: false, error: '获取正文失败：' + msg });
      });
  },

  // 镜像 utils/books.js 的下载策略：优先 wx.cloud.downloadFile（免白名单），失败再走临时链接
  _downloadText(result) {
    const viaCloud = () => wx.cloud.downloadFile({ fileID: result.fileID });
    const viaUrl = () =>
      new Promise((resolve, reject) => {
        if (!result.url) {
          reject(new Error('no url'));
          return;
        }
        wx.downloadFile({
          url: result.url,
          success: (r) => (r.statusCode === 200 ? resolve(r) : reject(new Error('http ' + r.statusCode))),
          fail: reject,
        });
      });
    const first = result.url ? viaUrl() : viaCloud();
    return first
      .catch((e) => (result.url ? viaUrl() : viaCloud()).catch(() => {
        throw e;
      }))
      .then((dl) => this._readFile(dl.tempFilePath));
  },

  _readFile(tempFilePath) {
    return new Promise((resolve, reject) => {
      wx.getFileSystemManager().readFile({
        filePath: tempFilePath,
        encoding: 'utf8',
        success: (r) => resolve(r.data),
        fail: reject,
      });
    });
  },

  /* ---------------- 分页 ---------------- */

  // rpx -> px
  _rpx(v) {
    return (v * this._screenWidth) / 750;
  },

  /**
   * 渲染一段文本并返回其实际高度（px）
   * 用于真实测量「一屏能放多少字」，避免估算偏差导致内容溢出被裁掉
   */
  _measureText(text) {
    return new Promise((resolve) => {
      // 测量时不能带广告，否则量到的是「正文 + 广告」的高度
      this.setData({ pageContent: text, feedAdVisible: false }, () => {
        try {
          wx.createSelectorQuery()
            .in(this)
            .select('.reader-content')
            .boundingClientRect((rect) => resolve(rect ? rect.height : 0))
            .exec();
        } catch (e) {
          resolve(0);
        }
      });
    });
  },

  /**
   * 二分查找：从 start 起，一屏最多能放下多少字符（保证不溢出、不丢内容）
   * @param {string} content 整章正文
   * @param {number} start 起始下标
   * @param {number} hi 初始上界（用估算值）
   */
  async _fitCount(content, start, hi) {
    const max = content.length - start;
    if (max <= 0) return 0;
    let top = Math.min(hi, max);

    // 上界整段都放得下 → 直接返回
    let h = await this._measureText(content.slice(start, start + top));
    if (!h || h <= this._bodyHeight) return top;

    // 放不下 → 二分收缩到刚好不溢出的字数
    let lo = 0;
    let guard = 24;
    while (top - lo > 1 && guard-- > 0) {
      const mid = Math.floor((lo + top) / 2);
      const mh = await this._measureText(content.slice(start, start + mid));
      if (!mh) break;
      if (mh > this._bodyHeight) {
        top = mid;
      } else {
        lo = mid;
      }
    }
    return lo;
  },

  // 每行可容纳字数的估算值
  _estimateCharsPerLine() {
    const fontPx = this._rpx(this.data.fontSize);
    return Math.max(1, Math.floor((this._bodyWidth || 320) / (fontPx * 1.02)));
  },

  // 每页字数的初始估算值（作为二分上界，实测会再校正）
  _estimateCharsPerPage() {
    const fontPx = this._rpx(this.data.fontSize);
    const linePx = fontPx * this.data.lineHeight;
    const linesPerPage = Math.max(1, Math.floor((this._bodyHeight || 600) / linePx));
    return Math.max(50, linesPerPage * this._estimateCharsPerLine());
  },

  // 量出正文区可用高度/宽度（px），用于计算每页可容纳字数
  _measureBody() {
    return new Promise((resolve) => {
      try {
        wx.createSelectorQuery()
          .in(this)
          .select('.reader-body')
          .boundingClientRect((rect) => {
            if (rect && rect.height) {
              // 减去 .reader-body 的 padding：上下各 28/16rpx，左右各 32rpx
              this._bodyHeight = Math.max(120, rect.height - this._rpx(44));
              this._bodyWidth = Math.max(160, rect.width - this._rpx(64));
            }
            resolve();
          })
          .exec();
      } catch (e) {
        resolve();
      }
    });
  },

  /**
   * 依据当前字号/行距/翻页方式重建当前章的分页
   * @param {boolean} tail 是否定位到本章最后一页（上一章时用）
   */
  async _rebuildPages(tail) {
    const ch = this._chapters[this.data.chapterIndex];
    if (!ch) return;

    // 字号/行距决定每页字数，实测一次后缓存，换章不再重复测量
    const cacheKey = `${this.data.fontSize}_${this.data.lineHeight}_${this.data.fontFamily}_${Math.round(
      this._bodyHeight,
    )}`;
    this._pages = await this._paginateChapter(ch, cacheKey);
    this._buildViewPages(this._pages);

    const last = this._viewPages.length - 1;
    let idx;
    if (this._openAtHead) {
      // 切章到开头：不受当前页码影响
      idx = 0;
    } else {
      idx = tail ? last : Math.min(this.data.pageIndex, last);
    }
    this._openAtHead = false;
    // 首章分页就绪后，后续章节才允许插入信息流广告
    this._adReady = true;
    this._renderPage(idx);
    console.log(
      `[reader] 分页：本章共 ${this._pages.length} 页，广告页=${
        this._adIndexes.join(',') || '无'
      }，可用高度=${Math.round(this._bodyHeight)}px`,
    );
  },

  /**
   * 计算本章分页：
   * 1. 取缓存的「每页字数」基准值（首次用二分实测得到）；
   * 2. 按字数切页后，用隐藏测量区「一次量出所有页」的真实渲染高度，
   *    只要有一页超高就按比例收缩字数重分（最多 3 次）——
   *    短行多的章节（对话体）同样字数会渲染出更多行，只看一页不够。
   */
  async _paginateChapter(ch, cacheKey) {
    let charsPerPage = this._fitCache[cacheKey];
    if (!charsPerPage) {
      const fit = await this._fitCount(ch.content, 0, this._estimateCharsPerPage());
      if (fit >= ch.content.length) {
        // 本章整章不足一屏：只用一次，不进缓存（否则会污染后面较长的章节）
        return paginateContent(ch.content, ch.content.length);
      }
      // 留 2% 余量，避免个别页因标点/全角字符略微溢出
      charsPerPage = Math.max(50, Math.floor(fit * 0.98));
      this._fitCache[cacheKey] = charsPerPage;
    }

    let pages = paginateContent(ch.content, charsPerPage);
    for (let guard = 0; guard < 3; guard++) {
      const maxH = await this._measureMaxPageHeight(pages);
      // 量不出来时不再折腾，交给 scroll-y 兜底
      if (!maxH) break;
      // 所有页都放得下才算通过（不能只看一页，短行多的页会更高）
      if (maxH <= this._bodyHeight) break;
      const next = Math.max(30, Math.floor((charsPerPage * this._bodyHeight) / maxH));
      if (next >= charsPerPage) break;
      charsPerPage = next;
      pages = paginateContent(ch.content, charsPerPage);
    }
    return pages;
  },

  /** 批量量出每页渲染高度并返回最大值（一次 setData + 一次查询） */
  async _measureMaxPageHeight(pages) {
    const heights = await this._measurePages(pages);
    const valid = heights.filter((h) => h > 0);
    if (valid.length === heights.length && valid.length) {
      return Math.max.apply(null, valid);
    }
    // 隐藏测量区没量到（极端情况）→ 退回单页实测
    if (!valid.length) return this._measureText(pages[this._worstPageIndex(pages)]);
    return Math.max.apply(null, valid);
  },

  _measurePages(pages) {
    return new Promise((resolve) => {
      try {
        this.setData({ measureTexts: pages }, () => {
          wx.createSelectorQuery()
            .in(this)
            .selectAll('.measure-text')
            .boundingClientRect((rects) => {
              // 量完立即清空，避免 data 里长期挂着整章正文
              this.setData({ measureTexts: [] });
              // 数量对不上说明有节点没渲染出来，返回空数组走兜底逻辑
              if (!rects || rects.length !== pages.length) {
                resolve([]);
                return;
              }
              resolve(rects.map((r) => (r ? Math.round(r.height) : 0)));
            })
            .exec();
        });
      } catch (e) {
        resolve([]);
      }
    });
  },

  // 估算每页渲染行数，挑出最可能溢出的那一页去实测（批量测量失败时的兜底）
  _worstPageIndex(pages) {
    const charsPerLine = this._estimateCharsPerLine();
    let worst = 0;
    let worstLines = -1;
    for (let i = 0; i < pages.length; i++) {
      const lines = String(pages[i] || '').split('\n');
      let n = 0;
      for (let j = 0; j < lines.length; j++) {
        n += Math.max(1, Math.ceil(lines[j].length / charsPerLine));
      }
      if (n > worstLines) {
        worstLines = n;
        worst = i;
      }
    }
    return worst;
  },

  /**
   * 生成当前章的视图页：正文页 + 页内信息流（原生模板）广告
   * 广告不单独成页，而是挂在本章若干正文页的正文下方（slot >= 0）
   */
  _buildViewPages(textPages) {
    const total = textPages.length;
    const adIdxs = this._feedAdIndexes(total);
    this._adIndexes = adIdxs;
    this._viewPages = textPages.map((text, i) => ({
      // slot：本章内第几条广告（-1 = 该页不带广告）
      slot: adIdxs.indexOf(i),
      text,
    }));
  },

  // 本章信息流广告页下标列表（空数组 = 不插）；规则见 阅读页广告规则.md 第一节
  _feedAdIndexes(pageLen) {
    const chapterNum = this.data.chapterIndex + 1;
    // 不插广告时把原因打出来，便于排查「配置了却不显示」
    const why = (msg) => {
      console.log(`[reader] 第${chapterNum}章不插信息流：${msg}（本章 ${pageLen} 页）`);
      return [];
    };
    if (!FEED_ENABLED) return why('FEED_ENABLED=false');
    if (pageLen < 2) return why('页数不足 2 页');
    if (!this._adReady) return why('首章分页未就绪');
    if (isAdFree()) return why('处于免广告时段');
    if (chapterNum <= FEED_START_CHAPTER) return why(`前 ${FEED_START_CHAPTER} 章不插`);
    if ((chapterNum - FEED_START_CHAPTER) % FEED_EVERY_CHAPTER !== 0) return why('未命中章间隔');
    // 每条广告之间至少隔一页正文，页数不够就降级为 1 条
    const count = pageLen >= FEED_PER_CHAPTER * 2 + 1 ? FEED_PER_CHAPTER : 1;
    const idxs = [];
    for (let i = 0; i < count; i++) {
      idxs.push(Math.floor(((i + 1) * pageLen) / (count + 1)));
    }
    return idxs;
  },

  // 本章固定的信息流广告位（按章号 + 条序取，避免反复切换广告位重复加载）
  _feedUnitId(slot) {
    const i = (this.data.chapterIndex * FEED_PER_CHAPTER + (slot || 0)) % FEED_UNIT_IDS.length;
    return FEED_UNIT_IDS[i];
  },

  // 渲染视图页：正文 +（可选）页内信息流广告
  _renderPage(i) {
    const p = this._viewPages[i];
    if (!p) return;
    this._topTick = this._topTick === 0 ? 1 : 0;
    const withAd = p.slot >= 0;
    this.setData({
      pageCount: this._viewPages.length,
      pageIndex: i,
      pageContent: p.text,
      feedAdVisible: withAd,
      adUnitId: withAd ? this._feedUnitId(p.slot) : '',
      scrollTop: this._topTick,
    });
    this._setAdGate(withAd);
  },

  /**
   * 翻页闸门：带信息流广告的页，等广告加载完成（或超时/失败）后才允许翻页
   * 无填充时不能把用户卡死，故设等待上限
   */
  _setAdGate(withAd) {
    if (this._feedAdTimer) {
      clearTimeout(this._feedAdTimer);
      this._feedAdTimer = null;
    }
    if (!FEED_WAIT_LOADED || !withAd) {
      this._feedAdReady = true;
      return;
    }
    this._feedAdReady = false;
    this._feedAdTimer = setTimeout(() => {
      this._feedAdTimer = null;
      this._feedAdReady = true;
    }, FEED_WAIT_TIMEOUT_MS);
  },

  // 广告加载完成 / 失败：放行翻页
  _releaseAdGate() {
    if (this._feedAdTimer) {
      clearTimeout(this._feedAdTimer);
      this._feedAdTimer = null;
    }
    this._feedAdReady = true;
  },

  // 翻页前检查：广告未加载完成时拦下
  _canFlip() {
    if (this._feedAdReady) return true;
    wx.showToast({ title: '内容加载中，请稍候', icon: 'none', duration: 1000 });
    return false;
  },

  /**
   * @param {number} idx 章节下标
   * @param {boolean} tail 是否定位到本章最后一页
   * @param {boolean} head 是否定位到本章第一页（优先于 tail）
   */
  _renderChapter(idx, tail, head) {
    const ch = this._chapters[idx];
    if (!ch) return;
    // scroll-top 取 toggle 值，保证每次切章都能回到顶部
    this._topTick = this._topTick === 0 ? 1 : 0;
    this._openAtHead = !!head;
    this.setData(
      {
        chapterIndex: idx,
        sliderValue: idx,
        chapterTitle: ch.title,
        chapterContent: ch.content,
        scrollTop: this._topTick,
      },
      () => {
        this._syncShelf();
        this._refreshAdFlags();
        this._rebuildPages(tail);
      },
    );
  },

  // 页级优先：本章还有下一页就翻页，否则进入下一章
  onNext() {
    if (!this._canFlip()) return;
    if (this.data.pageIndex < this.data.pageCount - 1) {
      this._renderPage(this.data.pageIndex + 1);
      return;
    }
    const nextIdx = this.data.chapterIndex + 1;
    if (nextIdx >= this.data.chapterCount) return;
    if (!this._canEnterChapter(nextIdx)) return;
    // 章末广告：章号能整除 INTERSTITIAL_EVERY_CHAPTER 时触发（切章前取当前章号）
    const interstitial = this._shouldShowInterstitial();
    // 从下一章开头开始
    this._renderChapter(nextIdx, false, true);
    if (interstitial) this._showChapterEndInterstitial();
  },

  // 章末是否弹插屏（免广告时段不弹）
  _shouldShowInterstitial() {
    if (!INTERSTITIAL_ENABLED) return false;
    if (isAdFree()) return false;
    const chapterNum = this.data.chapterIndex + 1;
    return chapterNum % INTERSTITIAL_EVERY_CHAPTER === 0;
  },

  _showChapterEndInterstitial() {
    const now = Date.now();
    if (now - this._lastInterstitialAt < INTERSTITIAL_MIN_INTERVAL_MS) return;
    this._lastInterstitialAt = now;
    showInterstitialAd().catch((err) => {
      console.warn('[reader] 插屏广告未展示：', (err && err.message) || err);
    });
  },

  // 本章还有上一页就翻页，否则进入上一章的最后一页
  onPrev() {
    if (!this._canFlip()) return;
    if (this.data.pageIndex > 0) {
      this._renderPage(this.data.pageIndex - 1);
      return;
    }
    if (this.data.chapterIndex > 0) {
      this._renderChapter(this.data.chapterIndex - 1, true);
    }
  },

  /* ----- 底部菜单：直接切章，不翻页 ----- */

  onPrevChapter() {
    if (!this._canFlip()) return;
    const idx = this.data.chapterIndex - 1;
    if (idx < 0) return;
    // 锁章只拦后续章节，回看已读章节不受限；定位到上一章开头
    this._renderChapter(idx, false, true);
  },

  onNextChapter() {
    if (!this._canFlip()) return;
    const nextIdx = this.data.chapterIndex + 1;
    if (nextIdx >= this.data.chapterCount) return;
    if (!this._canEnterChapter(nextIdx)) return;
    // 与翻到章末一致：命中章间隔时弹插屏
    const interstitial = this._shouldShowInterstitial();
    // 定位到下一章开头
    this._renderChapter(nextIdx, false, true);
    if (interstitial) this._showChapterEndInterstitial();
  },

  // 底部滑块：拖动中只更新进度显示，松手才渲染正文（避免拖动时频繁渲染大段文本）
  onChapterSliderChanging(e) {
    this.setData({ sliderValue: Number(e.detail.value) });
  },

  onChapterSliderChange(e) {
    if (!this._canFlip()) return;
    const idx = Number(e.detail.value);
    if (idx === this.data.chapterIndex) return;
    if (idx < 0 || idx >= this.data.chapterCount) return;
    // 锁章期间只允许回看已读章节
    if (idx > this.data.chapterIndex && !this._canEnterChapter(idx)) {
      this.setData({ sliderValue: this.data.chapterIndex });
      return;
    }
    // 定位到目标章开头
    this._renderChapter(idx, false, true);
  },

  /* ---------------- 触摸：翻页方式 + 点击分区域（对齐 uniapp onContentTap） ---------------- */

  onTouchStart(e) {
    const t = e.touches[0];
    this._touchX = t.clientX;
    this._touchY = t.clientY;
  },

  // 不使用滑屏手势：只识别点击，按左/中/右区域翻章或唤出菜单
  onTouchEnd(e) {
    if (!this._chapters.length) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - this._touchX;
    const dy = t.clientY - this._touchY;

    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      this._onContentTap(t.clientX);
    }
  },

  // 对齐 uniapp onContentTap：菜单打开时任意点击收起；否则左/右 1/3 翻章，中间 1/3 唤出菜单
  _onContentTap(x) {
    const w = this._screenWidth;
    if (this.data.showMenu) {
      this.setData({ showMenu: false });
      return;
    }
    if (x < w / 3) {
      this.onPrev();
    } else if (x > (w * 2) / 3) {
      this.onNext();
    } else {
      this.setData({ showMenu: true });
    }
  },

  /* ---------------- 书架 ---------------- */

  // 当前阅读进度快照
  _progress() {
    return {
      chapterIndex: this.data.chapterIndex,
      chapterTitle: this.data.chapterTitle,
      chapterCount: this.data.chapterCount,
    };
  },

  /**
   * 每次切章后同步书架：
   *  - 已在书架 -> 刷新进度；
   *  - 未加入且读到第 AUTO_ADD_CHAPTERS 章 -> 自动加入并提示。
   */
  _syncShelf() {
    const book = this._book;
    if (!book) return;
    const progress = this._progress();
    if (isInShelf(book.id)) {
      updateProgress(book.id, progress);
      if (!this.data.inShelf) this.setData({ inShelf: true });
      return;
    }
    if (progress.chapterIndex + 1 >= AUTO_ADD_CHAPTERS) {
      const added = addToShelf(book, progress, 'auto');
      this.setData({ inShelf: true });
      if (added) {
        wx.showToast({
          title: `已读满${AUTO_ADD_CHAPTERS}章，加入收藏`,
          icon: 'none',
          duration: 2000,
        });
      }
    } else if (this.data.inShelf) {
      this.setData({ inShelf: false });
    }
  },

  // 右上角入口：手动加入 / 移出收藏
  onToggleShelf() {
    const book = this._book;
    if (!book) return;
    if (isInShelf(book.id)) {
      wx.showModal({
        title: '移出收藏',
        content: `确定将《${book.title}》移出收藏？`,
        confirmText: '移出',
        confirmColor: '#8c2f39',
        success: (r) => {
          if (!r.confirm) return;
          removeFromShelf(book.id);
          this.setData({ inShelf: false });
          wx.showToast({ title: '已移出收藏', icon: 'none' });
        },
      });
      return;
    }
    addToShelf(book, this._progress(), 'manual');
    this.setData({ inShelf: true });
    wx.showToast({ title: '已加入收藏', icon: 'success' });
  },

  /* ---------------- 阅读设置 ---------------- */

  onOpenSettings() {
    this.setData({ showSettings: true });
  },
  onCloseSettings() {
    this.setData({ showSettings: false });
  },
  noop() {},

  onFontSmaller() {
    this.setData({ fontSize: Math.max(FONT_MIN, this.data.fontSize - 2) }, () =>
      this._rebuildPages(),
    );
    this._saveSettings();
  },
  onFontLarger() {
    this.setData({ fontSize: Math.min(FONT_MAX, this.data.fontSize + 2) }, () =>
      this._rebuildPages(),
    );
    this._saveSettings();
  },
  onFontSizeChange(e) {
    // 字号变了每页容纳字数也变，需重新分页
    this.setData({ fontSize: e.detail.value }, () => this._rebuildPages());
    this._saveSettings();
  },
  // 滑块拖动中实时预览字号（松手才写 storage，拖动中不重排分页）
  onFontSliderChanging(e) {
    this.setData({ fontSize: e.detail.value });
  },

  /* ---------------- 阅读背景主题 ---------------- */

  onThemeChange(e) {
    const theme = e.currentTarget.dataset.value;
    this.setData({ theme });
    this._saveSettings();
  },

  // 底部图标快捷切换夜间：记住原主题，退出夜间时还原
  onToggleNight() {
    const cur = this.data.theme;
    let next;
    if (cur === 'night') {
      next = this._prevTheme || 'default';
    } else {
      this._prevTheme = cur;
      next = 'night';
    }
    this.setData({ theme: next });
    this._saveSettings();
  },

  /* ---------------- 阅读页广告（激励视频 / 免广告时段 / 锁章） ---------------- */

  // 正文就绪后：刷新免广告状态、开始累计阅读时长、补弹上次未看完的锁章广告
  _afterContentReady() {
    this._refreshAdFlags();
    this._resumeReadingTimer();
    if (REWARD_LOCK_CHAPTERS && getLock(this.data.bookId) && !isAdFree()) {
      setTimeout(() => this._showRewardAd({ reason: 'lock' }), 600);
    }
  },

  _refreshAdFlags() {
    const free = isAdFree();
    const lock = getLock(this.data.bookId);
    const chapterLocked = !free && !!lock && this.data.chapterIndex >= lock.chapterIndex;
    this.setData({ adFree: free, chapterLocked });
  },

  /* ----- 累计阅读时长（每 10s 落盘并检查里程碑，后台不计时） ----- */

  _resumeReadingTimer() {
    if (!this._chapters.length) return;
    if (this._timer) return;
    this._lastTick = Date.now();
    this._timer = setInterval(() => this._tickReading(), 10000);
  },

  _pauseReadingTimer() {
    if (!this._timer) return;
    this._flushReadingTime();
    clearInterval(this._timer);
    this._timer = null;
  },

  _flushReadingTime() {
    if (!this._lastTick) return;
    const now = Date.now();
    // 防止后退到后台后一次性累计过长
    const delta = Math.min(now - this._lastTick, 15000);
    this._lastTick = now;
    if (delta > 0) addReadingMs(delta);
  },

  _tickReading() {
    this._flushReadingTime();
    this._checkTimeReward();
  },

  // 到达里程碑主动弹激励视频（免广告时段 / 本次已弹过不弹）
  _checkTimeReward() {
    if (!isMilestoneReached()) return;
    if (isAdFree()) return;
    if (this._rewardAutoOffered) return;
    if (Date.now() < this._rewardRetryAt) return;
    this._showRewardAd({ reason: 'time' });
  },

  /**
   * 展示激励视频
   * @param {object} opts { reason: 'time' 时长里程碑 | 'lock' 进入时补弹 | 'manual' 用户主动 }
   * - 完整看完：推进里程碑 + 免广告（REWARD_AD_FREE_MS）+ 解除锁章
   * - 未看完（主动关闭）：锁定后续章节（手动触发不锁）
   * - 无填充 / 加载失败：不算放弃，60s 后重试
   * - 播放中切后台 / 杀进程：storage 标记残留，下次进入按未看完处理（见 _settleAbandonedReward）
   */
  _showRewardAd(opts) {
    if (this._rewardShowing) return;
    const reason = (opts && opts.reason) || 'manual';
    this._rewardShowing = true;
    if (reason !== 'manual') this._rewardAutoOffered = true;
    // 先落盘「正在播放」，只有正常结束（看完/关闭/失败）才清除
    startRewardPending({
      bookId: this.data.bookId,
      chapterIndex: this.data.chapterIndex,
      reason,
    });

    showRewardedAd()
      .then(() => {
        advanceMilestone();
        extendAdFree(REWARD_AD_FREE_MS);
        clearLock(this.data.bookId);
        this._rewardAutoOffered = false;
        this._rewardRetryAt = 0;
        this._refreshAdFlags();
        wx.showToast({
          title: `已获得${Math.round(REWARD_AD_FREE_MS / 60000)}分钟免广告`,
          icon: 'none',
        });
        // 免广告期间移除当前章已插入的信息流广告页
        this._rebuildPages();
      })
      .catch((err) => {
        const msg = (err && err.message) || '';
        if (msg.indexOf('不支持') >= 0) {
          // 环境不支持广告：不锁章，降级放行
          advanceMilestone();
          clearLock(this.data.bookId);
          this._refreshAdFlags();
          return;
        }
        if (msg === '观看未完成') {
          if (REWARD_LOCK_CHAPTERS && reason !== 'manual') {
            setLock(this.data.bookId, this.data.chapterIndex);
            this._refreshAdFlags();
            wx.showToast({ title: '未看完广告，后续章节已锁定', icon: 'none' });
          }
          return;
        }
        // 无填充 / 频控 / 加载失败：保留触发机会，稍后重试
        this._rewardAutoOffered = false;
        this._rewardRetryAt = Date.now() + REWARD_RETRY_MS;
      })
      .finally(() => {
        this._rewardShowing = false;
        // 正常结束：清掉「播放中」标记，避免下次误判为未看完
        clearRewardPending();
      });
  },

  /**
   * 防作弊补判：上次激励视频开始播放但没有正常结束（切后台后杀进程、进程被回收等）
   * storage 里会残留 pending，此处按「未看完」处理：不发免广告，并按规则锁章
   */
  _settleAbandonedReward() {
    const pending = getRewardPending();
    if (!pending) return;
    clearRewardPending();
    // 手动触发的免广告按钮：不给奖励，也不锁章
    if (pending.reason === 'manual') return;
    const bookId = pending.bookId || this.data.bookId;
    if (REWARD_LOCK_CHAPTERS) {
      setLock(bookId, typeof pending.chapterIndex === 'number'
        ? pending.chapterIndex
        : this.data.chapterIndex);
      wx.showToast({ title: '上次广告未看完，后续章节已锁定', icon: 'none' });
    }
    // 保留再次触发的机会：不推进里程碑、不发免广告，60s 后可重弹
    this._rewardAutoOffered = false;
    this._rewardRetryAt = Date.now() + REWARD_RETRY_MS;
  },

  // 锁章拦截：目标章节超出已锁定边界时提示并拦下
  _canEnterChapter(target) {
    const lock = getLock(this.data.bookId);
    if (!lock || !REWARD_LOCK_CHAPTERS || isAdFree()) return true;
    if (target <= lock.chapterIndex) return true;
    this._promptUnlock();
    return false;
  },

  _promptUnlock() {
    wx.showModal({
      title: '广告未看完',
      content: '看完激励视频广告后即可继续阅读后续章节',
      confirmText: '看广告',
      cancelText: '取消',
      confirmColor: '#8c2f39',
      success: (r) => {
        if (r.confirm) this._showRewardAd({ reason: 'manual' });
      },
    });
  },

  // 底部「免广告」按钮：看完激励视频 → 30 分钟免广告
  onFreeAd() {
    if (isAdFree()) {
      const minutes = Math.ceil(getAdFreeLeftMs() / 60000);
      wx.showToast({ title: `免广告中，剩余${minutes}分钟`, icon: 'none' });
      return;
    }
    this._showRewardAd({ reason: 'manual' });
  },

  // 章节锁定提示条：点击直接看广告解锁
  onUnlockTip() {
    this._showRewardAd({ reason: 'manual' });
  },

  // 信息流广告事件
  onFeedAdLoad() {
    console.log('[reader] 信息流广告加载成功');
    this._releaseAdGate();
  },

  onFeedAdError(err) {
    console.warn('[reader] 信息流广告加载失败', err && (err.detail || err));
    // 加载失败同样放行，避免卡住翻页
    this._releaseAdGate();
  },

  // 底部常驻 banner 事件
  onBannerLoad() {
    console.log('[reader] banner 广告加载成功');
    if (!this.data.bannerVisible) this.setData({ bannerVisible: true });
    this._syncBannerHeight();
  },

  // 量出 banner 实际高度：菜单据此上移贴住 banner，正文可用高度变了要重排分页
  _syncBannerHeight() {
    wx.createSelectorQuery()
      .in(this)
      .select('.reader-banner')
      .boundingClientRect((rect) => {
        const h = rect ? Math.round(rect.height) : 0;
        if (!h || h === this.data.bannerHeight) return;
        // banner 占位后正文区变矮：必须重新量高度，否则分页按旧高度算会裁掉尾行
        this.setData({ bannerHeight: h }, () => this._remeasureAndRebuild());
      })
      .exec();
  },

  onBannerError(err) {
    const d = err && err.detail;
    console.warn('[reader] banner 广告加载失败', d && (d.errCode || d.errMsg) || d || err);
    // 无填充 / 未开通流量主 / 非正式版：隐藏占位，避免底部留一条空白
    if (!this.data.bannerVisible && !this.data.bannerHeight) return;
    // 占位移除后正文区变高，同样要重新量高度再重排
    this.setData({ bannerVisible: false, bannerHeight: 0 }, () => this._remeasureAndRebuild());
  },

  // 正文区可用高度发生变化（banner 出现/消失）后重新量高度并重建分页
  _remeasureAndRebuild() {
    this._measureBody().then(() => this._rebuildPages());
  },
  onFontFamilyChange(e) {
    // 字族宽度不同会影响每页字数，需重新分页
    this.setData({ fontFamily: e.currentTarget.dataset.value }, () => this._rebuildPages());
    this._saveSettings();
  },

  onLineSpacingChange(e) {
    // 行距影响每页行数，需重新分页
    this.setData({ lineHeight: Number(e.currentTarget.dataset.value) }, () =>
      this._rebuildPages(),
    );
    this._saveSettings();
  },
  _saveSettings() {
    try {
      wx.setStorageSync(SETTINGS_KEY, {
        fontSize: this.data.fontSize,
        fontFamily: this.data.fontFamily,
        lineHeight: this.data.lineHeight,
        theme: this.data.theme,
      });
    } catch (e) {
      // 忽略
    }
  },

  /* ---------------- 章节目录 ---------------- */

  onPickChapter() {
    if (!this._chapters.length) {
      wx.showToast({ title: '目录尚未加载完成', icon: 'none' });
      return;
    }
    this._tocLimit = 100;
    this._renderToc();
    this.setData({ showToc: true });
  },

  // 一次只渲染 _tocLimit 条，避免上千章一次性 setData 卡顿
  _renderToc() {
    const total = this._chapters.length;
    const n = Math.min(this._tocLimit, total);
    const list = [];
    for (let i = 0; i < n; i++) {
      list.push(this._chapters[i].title || `第${i + 1}章`);
    }
    this.setData({ tocList: list, tocHasMore: n < total });
  },

  onLoadMoreToc() {
    this._tocLimit += 100;
    this._renderToc();
  },

  onTocItemTap(e) {
    if (!this._canFlip()) return;
    const idx = Number(e.currentTarget.dataset.index);
    this.setData({ showToc: false });
    if (idx === this.data.chapterIndex) return;
    // 锁章期间只允许跳到已读章节
    if (idx > this.data.chapterIndex && !this._canEnterChapter(idx)) return;
    // 定位到该章开头
    this._renderChapter(idx, false, true);
  },

  onCloseToc() {
    this.setData({ showToc: false });
  },
});
