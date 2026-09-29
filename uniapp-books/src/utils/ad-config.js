/**

 * uni-ad 广告配置

 *

 * 插屏：官方 <ad-interstitial>（见 components/InterstitialAdHost.vue）

 * 信息流：官方 <ad>（见 components/FeedAd.vue）

 * 激励视频：官方 <ad-rewarded-video>（见 components/RewardedVideoAdHost.vue）

 */

export const AD_USE_TEST = false;



/** 插屏 adpid；正式 1339799010 */

export const AD_INTERSTITIAL_PID = AD_USE_TEST ? '1111111113' : '1339799010';



/** 信息流 adpid；正式 1083755474 */

export const AD_FEED_PID = AD_USE_TEST ? '1111111111' : '1083755474';



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

export const AD_ENABLE_SECONDARY = true;



/** 两次插屏展示的最小间隔（毫秒） */

export const AD_INTERSTITIAL_INTERVAL = 45 * 1000;



/** 当前 manifest 已集成的广告渠道 key */

export const AD_CHANNELS = ['sigmob', 'zy', 'bz', 'fl', 'yt', 'jt', 'wa'];

