import { SITE } from './config';
import { DEFAULT_ANDROID_APK_URL, resolveAndroidApkUrl } from './app-version';

export const VERSION_CHECK_URL = `${SITE}/app-version.json`;

const SKIP_KEY = 'app_update_skip_version';
const LOG_TAG = '[app-update]';

function getLocalVersionInfo() {
  // #ifdef APP-PLUS
  return new Promise((resolve) => {
    plus.runtime.getProperty(plus.runtime.appid, (info) => {
      resolve({
        versionName: info.version || '',
        versionCode: Number(info.versionCode || 0),
      });
    });
  });
  // #endif

  // #ifndef APP-PLUS
  const info = uni.getSystemInfoSync();
  const account = uni.getAccountInfoSync?.();
  const mpVersion = account?.miniProgram?.version;
  let versionCode = Number(info.appVersionCode || 0);
  if (mpVersion) {
    const parts = mpVersion.split('.').map(Number);
    versionCode = parts[0] * 10000 + (parts[1] || 0) * 100 + (parts[2] || 0);
  }
  return Promise.resolve({
    versionName: info.appVersion || mpVersion || '',
    versionCode,
  });
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

export function logVersionCompare(local, remote, extra = {}) {
  const remoteCode = Number(remote?.versionCode || 0);
  const localCode = Number(local?.versionCode || 0);
  const needUpdate = remoteCode > localCode;
  const apkUrl = resolveAndroidApkUrl(remote);

  console.log(`${LOG_TAG} 检查地址: ${VERSION_CHECK_URL}`);
  console.log(`${LOG_TAG} 本地版本:`, {
    versionName: local?.versionName,
    versionCode: localCode,
  });
  console.log(`${LOG_TAG} 线上版本:`, {
    versionName: remote?.versionName,
    versionCode: remoteCode,
    forceUpdate: remote?.forceUpdate,
    changelog: remote?.changelog,
    apkUrl,
    inAppInstall: remote?.android?.inAppInstall,
  });
  console.log(`${LOG_TAG} 对比结果:`, {
    needUpdate,
    skipped: extra.skipped,
    reason: extra.reason,
  });
}

function shouldSkipVersion(versionCode) {
  const skipped = uni.getStorageSync(SKIP_KEY);
  return String(skipped) === String(versionCode);
}

function markSkipVersion(versionCode) {
  uni.setStorageSync(SKIP_KEY, String(versionCode));
}

function isLikelyDirectApkUrl(url) {
  if (!url) return false;
  const lower = url.toLowerCase();
  if (lower.endsWith('.apk')) return true;
  if (lower.includes('download.pgyer.com')) return true;
  if (lower.includes('oss.pgyer.com')) return true;
  if (lower.includes('pgyer.com/apiv2/app/install')) return true;
  if (lower.includes('pgyer.com/app/install/')) return true;
  return false;
}

/** 蒲公英 /app/install/{appKey} 会 302 到带签名的 OSS APK，需带 time 防缓存 */
function resolveApkDownloadUrl(apkUrl) {
  if (!apkUrl) return apkUrl;
  if (/pgyer\.com\/app\/install\//i.test(apkUrl)) {
    const sep = apkUrl.includes('?') ? '&' : '?';
    return `${apkUrl}${sep}time=${Date.now()}`;
  }
  return apkUrl;
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

/** App 内下载 APK 并调起系统安装（需 manifest 安装权限） */
function installApk(apkUrl) {
  const downloadUrl = resolveApkDownloadUrl(apkUrl);
  return new Promise((resolve, reject) => {
    uni.showLoading({ title: '下载安装包…', mask: true });
    console.log(`${LOG_TAG} 开始下载 APK:`, downloadUrl);
    uni.downloadFile({
      url: downloadUrl,
      success: (downloadResult) => {
        if (downloadResult.statusCode !== 200) {
          uni.hideLoading();
          reject(new Error(`下载失败 HTTP ${downloadResult.statusCode}`));
          return;
        }
        const path = downloadResult.tempFilePath;
        console.log(`${LOG_TAG} 下载完成，开始安装:`, path);
        plus.runtime.install(
          path,
          { force: true },
          () => {
            uni.hideLoading();
            uni.showToast({
              title: '请在系统界面完成安装',
              icon: 'none',
              duration: 2500,
            });
            resolve();
          },
          (err) => {
            uni.hideLoading();
            console.warn(`${LOG_TAG} 安装失败`, err);
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

async function runAndroidUpdate(remote) {
  const apkUrl = resolveAndroidApkUrl(remote);
  const inApp = remote?.android?.inAppInstall !== false;
  const platform = uni.getSystemInfoSync().platform;

  if (platform !== 'android') {
    openExternalUrl(apkUrl || DEFAULT_ANDROID_APK_URL);
    return;
  }

  if (!inApp) {
    openExternalUrl(apkUrl);
    return;
  }

  if (!isLikelyDirectApkUrl(apkUrl)) {
    console.log(`${LOG_TAG} 非直链 APK，使用浏览器打开蒲公英`);
    openExternalUrl(apkUrl);
    return;
  }

  try {
    await installApk(apkUrl);
  } catch (error) {
    console.warn(`${LOG_TAG} 应用内安装失败，改用浏览器`, error);
    openExternalUrl(apkUrl);
  }
}

function promptAppUpdate(remote) {
  const platform = uni.getSystemInfoSync().platform;
  const isIOS = platform === 'ios';
  const pkg = isIOS ? remote.ios : remote.android;
  const wgtUrl = pkg?.wgtUrl;
  const content = [remote.changelog, '', `版本号：${remote.versionCode}`]
    .filter(Boolean)
    .join('\n');

  return new Promise((resolve) => {
    uni.showModal({
      title: remote.forceUpdate ? '发现重要更新' : '发现新版本',
      content,
      showCancel: !remote.forceUpdate,
      confirmText: wgtUrl ? '立即更新' : '下载并安装',
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
          if (isIOS) {
            const storeUrl = remote.ios?.storeUrl;
            if (storeUrl) {
              openExternalUrl(storeUrl);
              resolve(true);
              return;
            }
            uni.showToast({ title: '暂无 iOS 安装地址', icon: 'none' });
            resolve(false);
            return;
          }
          await runAndroidUpdate(remote);
          resolve(true);
        } catch (error) {
          console.warn(`${LOG_TAG} 更新流程异常`, error);
          uni.showToast({ title: '更新失败，请稍后重试', icon: 'none' });
          resolve(false);
        }
      },
    });
  });
}

export async function checkAppUpdate(options = {}) {
  const { silent = false, logOnly = false } = options;

  // #ifndef APP-PLUS
  if (!silent) {
    try {
      const [local, remote] = await Promise.all([
        getLocalVersionInfo(),
        fetchRemoteVersion(),
      ]);
      logVersionCompare(local, remote, { reason: '非 App 环境，仅打日志' });
    } catch (error) {
      console.warn(LOG_TAG, error);
    }
  }
  return false;
  // #endif

  // #ifdef APP-PLUS
  try {
    const [local, remote] = await Promise.all([
      getLocalVersionInfo(),
      fetchRemoteVersion(),
    ]);
    const remoteCode = Number(remote.versionCode || 0);
    const localCode = Number(local.versionCode || 0);

    if (!remoteCode || remoteCode <= localCode) {
      logVersionCompare(local, remote, {
        needUpdate: false,
        reason: !remoteCode ? '线上 versionCode 无效' : '本地已是最新或更高',
      });
      return false;
    }

    if (!remote.forceUpdate && shouldSkipVersion(remoteCode)) {
      logVersionCompare(local, remote, {
        skipped: true,
        reason: '用户曾选择稍后再说',
      });
      return false;
    }

    logVersionCompare(local, remote, { needUpdate: true, reason: '需要更新' });

    if (logOnly) return true;

    await promptAppUpdate(remote);
    return true;
  } catch (error) {
    console.warn(`${LOG_TAG} 检查失败`, error);
    if (!silent) {
      uni.showToast({ title: '版本检查失败', icon: 'none' });
    }
    return false;
  }
  // #endif
}

export function checkWeixinMiniProgramUpdate() {
  // #ifdef MP-WEIXIN
  if (!uni.canIUse('getUpdateManager')) return;

  const updateManager = uni.getUpdateManager();

  updateManager.onCheckForUpdate((res) => {
    if (res.hasUpdate) {
      console.log(`${LOG_TAG} 微信小程序发现新版本`);
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

export function checkForUpdateOnLaunch() {
  checkWeixinMiniProgramUpdate();
  checkAppUpdate({ silent: true });
}
