/**

 * uni-ad 广告配置

 *

 * 插屏：官方 <ad-interstitial>（见 components/InterstitialAdHost.vue）

 * 信息流：官方 <ad>（见 components/FeedAd.vue）

 */

export const AD_USE_TEST = false;



/** 插屏 adpid；正式 1339799010 */

export const AD_INTERSTITIAL_PID = AD_USE_TEST ? '1111111113' : '1339799010';



/** 信息流 adpid；正式 1083755474 */

export const AD_FEED_PID = AD_USE_TEST ? '1111111111' : '1083755474';



/** 两次插屏展示的最小间隔（毫秒） */

export const AD_INTERSTITIAL_INTERVAL = 45 * 1000;



/** 当前 manifest 已集成的广告渠道 key */

export const AD_CHANNELS = ['sigmob', 'zy', 'bz', 'fl', 'yt', 'jt', 'wa'];

