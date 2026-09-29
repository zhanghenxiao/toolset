'use strict';

/**
 * uni-ad 激励视频回调 secret 配置
 *
 * 在 uni-ad 控制台 → 广告位 → 激励视频服务器回调 → 展开广告位左侧下拉查看 secret。
 * 可按 adpid 分别配置；未命中时使用 DEFAULT_SECRET。
 *
 * 生产环境建议在 uniCloud 控制台为云函数配置环境变量 UNI_AD_CALLBACK_SECRET，
 * 避免把 secret 提交到代码仓库。
 */
module.exports = {
  /** adpid -> secret */
  AD_SECRETS: {
    '1410188432': 'c7d61fcc9423c6c249ccfdbc8a62deddc10f2d7de7985b708efaacdba1240232',
  },

  /** 默认 secret（环境变量优先） */
  getDefaultSecret() {
    return process.env.UNI_AD_CALLBACK_SECRET || '';
  },

  /** 幂等记录表名 */
  COLLECTION: 'ad_reward_record',
};
