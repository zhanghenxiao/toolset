import manifest from '../manifest.json';

/** 未配置线上 apkUrl 时的兜底（蒲公英安装接口，302 到最新 APK） */
export const DEFAULT_ANDROID_APK_URL =
  'https://www.pgyer.com/app/install/97dd3e56be35b0a44e8b4c63a202e2d2';

export const APP_VERSION_NAME = manifest.versionName || '1.0.0';
export const APP_VERSION_CODE = Number(manifest.versionCode || 0);

export function resolveAndroidApkUrl(remote) {
  const url = remote?.android?.apkUrl?.trim();
  return url || DEFAULT_ANDROID_APK_URL;
}
