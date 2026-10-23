/**
 * 运行环境：对应小程序 envVersion
 *  - develop 开发版（开发者工具 / 预览）
 *  - trial   体验版
 *  - release 正式版
 */
const ENV_FALLBACK = 'release';

function getEnvVersion() {
  try {
    const info = wx.getAccountInfoSync();
    const env = info && info.miniProgram && info.miniProgram.envVersion;
    return env || ENV_FALLBACK;
  } catch (e) {
    return ENV_FALLBACK;
  }
}

function isRelease() {
  return getEnvVersion() === 'release';
}

module.exports = { getEnvVersion, isRelease };
