/**

 * uni-ad 广告配置

 *

 * 插屏：官方 <ad-interstitial>（见 components/InterstitialAdHost.vue）

 * 信息流：官方 <ad>（见 components/FeedAd.vue）

 * 激励视频：官方 <ad-rewarded-video>（见 components/RewardedVideoAdHost.vue）

 */

export const AD_USE_TEST = false; // ← 总开关：false=真实广告，true=测试广告



// ==================== 多广告位兜底池 ====================
// 将你提供的多个同类型正式 adpid 集中管理，便于流量分发 / 无填充切换 / 轮询。

/** 信息流 adpid 池 */
export const AD_FEED_PID_LIST = AD_USE_TEST
  ? ['1111111111']
  : ['1083755474', '1959982048', '1663475142', '1937146489', '1599651261', '1823173738'];

/** 插屏 adpid 池 */
export const AD_INTERSTITIAL_PID_LIST = AD_USE_TEST
  ? ['1111111113']
  : ['1339799010', '1862233459', '1218686525', '1838740369'];

/** Banner adpid 池：复用信息流池 */
export const AD_BANNER_PID_LIST = AD_FEED_PID_LIST;

/** 激励视频 adpid 池 */
export const AD_REWARD_PID_LIST = AD_USE_TEST ? ['1507000689'] : ['1410188432'];

/** 视频贴片广告：当前未接入组件，先登记备用 */
export const AD_VIDEO_PATCH_PID_LIST = AD_USE_TEST ? [] : ['1889069104'];

/** Draw 视频广告：当前未接入组件，先登记备用 */
export const AD_DRAW_VIDEO_PID_LIST = AD_USE_TEST ? [] : ['1612839863'];

/**
 * 从广告位池中随机取一个 adpid（正式环境做流量分发 / 填充兜底）。
 * 测试环境请直接使用各 *_PID 常量（测试位）。
 */
export function pickRandomAdpid(list) {
  if (!Array.isArray(list) || list.length === 0) return '';
  return list[Math.floor(Math.random() * list.length)];
}

/** 插屏 adpid；正式环境从池中随机取一个，不再固定某一个 */
export const AD_INTERSTITIAL_PID = AD_USE_TEST ? '1111111113' : pickRandomAdpid(AD_INTERSTITIAL_PID_LIST);

/** 信息流 adpid；正式环境从池中随机取一个 */
export const AD_FEED_PID = AD_USE_TEST ? '1111111111' : pickRandomAdpid(AD_FEED_PID_LIST);

/** Banner adpid；复用信息流池，正式环境随机取 */
export const AD_BANNER_PID = AD_USE_TEST ? '1111111111' : pickRandomAdpid(AD_BANNER_PID_LIST);

/** 信息流/原生：前 N 章不展示广告（文档：前 3-5 章内不展示） */
export const AD_FEED_START_CHAPTER = 2;

/** 信息流/原生：每 N 章在正文插入 1 条（文档起步默认：每 5 章 1 条） */
export const AD_FEED_EVERY_CHAPTER = 3;

/** 插屏：每 N 章（本章完/返回书架自然断点）展示 1 次（文档：每 5 章 或自然断点） */
export const AD_INTERSTITIAL_EVERY_CHAPTER = 5;

/** 插屏总开关：false = 完全不展示插屏（章末 / 返回书架 / 首页二次插屏全部关闭）。如要恢复，改为 true 即可。 */
export const AD_INTERSTITIAL_ENABLED = false;

/** 激励视频解锁后免广告时长（毫秒）；文档「换 30 分钟免广告时段」 */
export const AD_REWARD_AD_FREE_MS = 30 * 60 * 1000;

/** 阅读页累计阅读时长首次达到该值（毫秒）时，主动弹出激励视频（每个阅读实例仅触发一次） */
export const AD_REWARD_READER_TIME_MS = 15 * 60 * 1000;



/** 激励视频正式 adpid（留空则回退到测试位 1507000689） */

const AD_REWARD_PID_PROD = '1410188432';



/** 激励视频 adpid；测试 1507000689（DCloud 官方测试位） */

export const AD_REWARD_PID = AD_USE_TEST ? '1507000689' : (AD_REWARD_PID_PROD || '1507000689');



/** 激励视频 urlCallback.extra 默认前缀（可按业务拼接 bookId 等） */

export const AD_REWARD_EXTRA_PREFIX = 'shuwei';



/** 是否向激励视频组件传递 url-callback（服务器回调） */

export const AD_REWARD_ENABLE_URL_CALLBACK = true;



/** 首页进入后延迟展示激励视频（毫秒） */

export const AD_REWARD_INDEX_DELAY_MS = 3000;



/** 详情页进入后延迟展示激励视频（毫秒） */

export const AD_REWARD_DETAIL_DELAY_MS = 800;



/** 两次激励视频展示的最小间隔（毫秒），首页/详情/返回首页共用 */

export const AD_REWARD_INTERVAL = 5 * 60 * 1000;



/** 详情页是否展示激励视频（关闭后仅首页等场景触发，可显著降低频率） */

export const AD_REWARD_ON_DETAIL = false;



/** 搜索激励视频：从第几次搜索开始弹（含该次） */

export const AD_REWARD_SEARCH_START = 5;



/** 搜索激励视频：每隔几次搜索弹一次（第 5、10、15… 次） */

export const AD_REWARD_SEARCH_INTERVAL = 5;



/** 激励视频结束后，次要广告（插屏）再延迟毫秒 */

export const AD_SECONDARY_DELAY_MS = 8 * 1000;



/** 是否展示次要广告（插屏、信息流） */

export const AD_ENABLE_SECONDARY = false;



/** 两次插屏展示的最小间隔（毫秒） */

export const AD_INTERSTITIAL_INTERVAL = 45 * 1000;



/** 当前 manifest 已集成的广告渠道 key */

export const AD_CHANNELS = ['sigmob', 'zy', 'bz', 'fl', 'yt', 'jt', 'wa'];

