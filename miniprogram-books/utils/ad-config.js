/**
 * 阅读页广告参数（对齐《阅读页广告规则.md》）
 * 信息流（原生模板）= 正文内嵌，非弹窗；插屏 = 章末弹窗；激励视频用于时长里程碑与主动解锁。
 */
const FEED_ENABLED = true;
// 前 N 章不插信息流
const FEED_START_CHAPTER = 2;
// 每 N 章插信息流（chapterNum - FEED_START_CHAPTER 能整除时插入）
const FEED_EVERY_CHAPTER = 1;
// 每章插入的信息流条数（本章页数不足时自动降级为 1 条）
const FEED_PER_CHAPTER = 2;
// 页内信息流广告是否加载完成后才允许翻页
const FEED_WAIT_LOADED = true;
// 等待上限：超时或加载失败则放行，避免无填充时把用户卡住
const FEED_WAIT_TIMEOUT_MS = 3000;
// 信息流（原生模板）广告位池，按章号 + 条序固定取一个，避免同一页反复切换导致重复加载
const FEED_UNIT_IDS = [
  'adunit-68bd85b3aa7be765',
  'adunit-c3cb35ea07fdb0be',
  'adunit-df43d35ba4890867',
];

// 底部常驻 banner：需填 BANNER_UNIT_ID（微信后台「banner 广告位」），留空则不渲染
const BANNER_ENABLED = true;
const BANNER_UNIT_ID = 'adunit-dd86f32311485fda';

// 插屏：已开启（章末按章间隔弹窗）
const INTERSTITIAL_ENABLED = true;
// 插屏广告位（微信「插屏广告」位，不是视频贴片位）
const INTERSTITIAL_UNIT_ID = 'adunit-c2a8183a33606953';
// 章末弹插屏的章间隔：能整除 INTERSTITIAL_EVERY_CHAPTER 的章翻完后触发（当前为第 2、4、6… 章）
const INTERSTITIAL_EVERY_CHAPTER = 2;
// 两次插屏的最小间隔，避免连续翻章频繁打扰
const INTERSTITIAL_MIN_INTERVAL_MS = 60 * 1000;

// 看完激励视频后的免广告时长
const REWARD_AD_FREE_MS = 20 * 60 * 1000;
// 激励视频「未完成」标记的保留时长：超过则视为无效残留，不做补判
const REWARD_PENDING_TTL_MS = 20 * 60 * 1000;
// 未完整观看是否锁定后续章节
const REWARD_LOCK_CHAPTERS = true;
// 广告未展示成功（无填充 / 频控）后的重试间隔
const REWARD_RETRY_MS = 60 * 1000;
// 两次激励视频最小间隔
const REWARD_INTERVAL = 5 * 60 * 1000;

/** 当前是否正式版（正式版用线上阈值，开发/体验版用短值方便调试） */
function isRelease() {
  try {
    const info = wx.getAccountInfoSync();
    return !!(info && info.miniProgram && info.miniProgram.envVersion === 'release');
  } catch (e) {
    return false;
  }
}

// 累计阅读时长里程碑：首次 / 之后每次间隔
const REWARD_READER_FIRST_MS = isRelease() ? 10 * 60 * 1000 : 10 * 60 * 1000;
const REWARD_READER_INTERVAL_MS = isRelease() ? 20 * 60 * 1000 : 20 * 60 * 1000;

module.exports = {
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
  INTERSTITIAL_UNIT_ID,
  INTERSTITIAL_EVERY_CHAPTER,
  INTERSTITIAL_MIN_INTERVAL_MS,
  REWARD_AD_FREE_MS,
  REWARD_PENDING_TTL_MS,
  REWARD_LOCK_CHAPTERS,
  REWARD_RETRY_MS,
  REWARD_INTERVAL,
  REWARD_READER_FIRST_MS,
  REWARD_READER_INTERVAL_MS,
};
