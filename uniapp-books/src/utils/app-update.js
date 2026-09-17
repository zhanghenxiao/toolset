import { SITE } from './config';

/** 线上版本清单，部署到 https://toolset.site/app-version.json */
export const VERSION_CHECK_URL = `${SITE}/app-version.json`;

const SKIP_KEY = 'app_update_skip_version';

function getLocalVersionCode() {
  // #ifdef APP-PLUS
  return new Promise((resolve) => {
    plus.runtime.getProperty(plus.runtime.appid, (info) => {
      resolve(Number(info.versionCode || 0));
    });
  });
  // #endif

  // #ifndef APP-PLUS
  const info = uni.getSystemInfoSync();
  const account = uni.getAccountInfoSync?.();
  const mpVersion = account?.miniProgram?.version;
  if (mpVersion) {
    const parts = mpVersion.split('.').map(Number);
    const code = parts[0] * 10000 + (parts[1] || 0) * 100 + (parts[2] || 0);
    return Promise.resolve(code || 0);
  }
  return Promise.resolve(Number(info.appVersionCode || 0));
  // #endif
}

function fetchRemoteVersion() {
  return new Promise((resolve, reject) => {
    uni.request({
      url: VERSION_CHECK_URL,
      method: 'GET',
      timeout: 12000,
      success: (res) => {
        if (res.statusCode !== 200 || !res.data) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        resolve(res.data);
      },
      fail: reject,
    });
  });
}

function shouldSkipVersion(versionCode) {
  const skipped = uni.getStorageSync(SKIP_KEY);
  return String(skipped) === String(versionCode);
}

function markSkipVersion(versionCode) {
  uni.setStorageSync(SKIP_KEY, String(versionCode));
}

function installWgt(wgtUrl) {
  return new Promise((resolve, reject) => {
    uni.showLoading({ title: '下载更新包…', mask: true });
    uni.downloadFile({
      url: wgtUrl,
      success: (downloadResult) => {
        if (downloadResult.statusCode !== 200) {
          uni.hideLoading();
          reject(new Error('下载失败'));
          return;
        }
        plus.runtime.install(
          downloadResult.tempFilePath,
          { force: true },
          () => {
            uni.hideLoading();
            uni.showModal({
              title: '更新完成',
              content: '新版本已安装，需重启应用后生效。',
              showCancel: false,
              success: () => {
                plus.runtime.restart();
              },
            });
            resolve();
          },
          (err) => {
            uni.hideLoading();
            reject(err);
          },
        );
      },
      fail: (err) => {
        uni.hideLoading();
        reject(err);
      },
    });
  });
}

function openExternalUrl(url) {
  // #ifdef APP-PLUS
  plus.runtime.openURL(url);
  // #endif
  // #ifndef APP-PLUS
  uni.setClipboardData({
    data: url,
    success: () => uni.showToast({ title: '下载链接已复制', icon: 'none' }),
  });
  // #endif
}

function promptAppUpdate(remote) {
  const platform = uni.getSystemInfoSync().platform;
  const isIOS = platform === 'ios';
  const pkg = isIOS ? remote.ios : remote.android;
  const wgtUrl = pkg?.wgtUrl;
  const storeOrApkUrl = isIOS ? pkg?.storeUrl : pkg?.apkUrl;
  const content = [remote.changelog, '', `最新版本：${remote.versionName}`]
    .filter(Boolean)
    .join('\n');

  return new Promise((resolve) => {
    uni.showModal({
      title: remote.forceUpdate ? '发现重要更新' : '发现新版本',
      content,
      showCancel: !remote.forceUpdate,
      confirmText: wgtUrl ? '立即更新' : '前往下载',
      cancelText: '稍后再说',
      success: async (modal) => {
        if (!modal.confirm) {
          if (!remote.forceUpdate) markSkipVersion(remote.versionCode);
          resolve(false);
          return;
        }

        try {
          if (wgtUrl) {
            await installWgt(wgtUrl);
            resolve(true);
            return;
          }
          if (storeOrApkUrl) {
            openExternalUrl(storeOrApkUrl);
            resolve(true);
            return;
          }
          uni.showToast({ title: '暂无安装包地址', icon: 'none' });
          resolve(false);
        } catch (error) {
          uni.showToast({ title: '更新失败，请稍后重试', icon: 'none' });
          resolve(false);
        }
      },
    });
  });
}

/** App 端：对比 versionCode，支持 wgt 热更新或整包下载 */
export async function checkAppUpdate(options = {}) {
  const { silent = false } = options;

  // #ifndef APP-PLUS
  return false;
  // #endif

  // #ifdef APP-PLUS
  try {
    const [localCode, remote] = await Promise.all([
      getLocalVersionCode(),
      fetchRemoteVersion(),
    ]);
    const remoteCode = Number(remote.versionCode || 0);

    if (!remoteCode || remoteCode <= localCode) return false;
    if (!remote.forceUpdate && shouldSkipVersion(remoteCode)) return false;

    await promptAppUpdate(remote);
    return true;
  } catch (error) {
    if (!silent) {
      console.warn('[app-update]', error);
    }
    return false;
  }
  // #endif
}

/** 微信小程序：使用官方 UpdateManager 自动拉取并提示重启 */
export function checkWeixinMiniProgramUpdate() {
  // #ifdef MP-WEIXIN
  if (!uni.canIUse('getUpdateManager')) return;

  const updateManager = uni.getUpdateManager();

  updateManager.onCheckForUpdate((res) => {
    if (res.hasUpdate) {
      console.log('[mp-update] 发现新版本');
    }
  });

  updateManager.onUpdateReady(() => {
    uni.showModal({
      title: '更新提示',
      content: '新版本已准备好，是否重启应用？',
      success: (res) => {
        if (res.confirm) updateManager.applyUpdate();
      },
    });
  });

  updateManager.onUpdateFailed(() => {
    uni.showToast({ title: '新版本下载失败', icon: 'none' });
  });
  // #endif
}

/** 启动时统一检查（App + 微信小程序） */
export function checkForUpdateOnLaunch() {
  checkWeixinMiniProgramUpdate();
  checkAppUpdate({ silent: true });
}
