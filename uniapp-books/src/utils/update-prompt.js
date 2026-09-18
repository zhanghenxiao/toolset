import { reactive } from 'vue';

export const updateModalState = reactive({
  visible: false,
  forceUpdate: false,
  versionName: '',
  versionCode: 0,
  changelog: '',
  confirmText: '立即更新',
});

let resolvePrompt = null;

export function showUpdatePrompt(remote) {
  const platform = uni.getSystemInfoSync().platform;
  const isIOS = platform === 'ios';
  const pkg = isIOS ? remote.ios : remote.android;
  const wgtUrl = pkg?.wgtUrl;

  return new Promise((resolve) => {
    resolvePrompt = resolve;
    updateModalState.visible = true;
    updateModalState.forceUpdate = !!remote.forceUpdate;
    updateModalState.versionName = remote.versionName || '';
    updateModalState.versionCode = remote.versionCode || 0;
    updateModalState.changelog = remote.changelog || '优化体验，修复已知问题';
    updateModalState.confirmText = wgtUrl ? '立即更新' : '下载并安装';
  });
}

export function confirmUpdatePrompt() {
  updateModalState.visible = false;
  if (resolvePrompt) {
    const resolve = resolvePrompt;
    resolvePrompt = null;
    resolve(true);
  }
}

export function cancelUpdatePrompt() {
  updateModalState.visible = false;
  if (resolvePrompt) {
    const resolve = resolvePrompt;
    resolvePrompt = null;
    resolve(false);
  }
}
