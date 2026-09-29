import { reactive } from 'vue';

export const readPromptState = reactive({
  visible: false,
  type: 'confirm',
  title: '',
  content: '',
  hint: '',
  steps: [],
  confirmText: '确定',
  cancelText: '取消',
  showCancel: true,
});

let resolvePrompt = null;

export function showReadRewardConfirm() {
  return new Promise((resolve) => {
    resolvePrompt = resolve;
    readPromptState.visible = true;
    readPromptState.type = 'confirm';
    readPromptState.title = '观看广告后复制';
    readPromptState.content = '为保障书源持续更新，复制阅读链接前需完整观看一条激励视频。';
    readPromptState.hint = '完整观看约 15–30 秒';
    readPromptState.steps = [
      '完整观看激励视频',
      '自动复制阅读链接',
      '打开浏览器粘贴访问',
    ];
    readPromptState.confirmText = '观看广告';
    readPromptState.cancelText = '取消';
    readPromptState.showCancel = true;
  });
}

export function showReadCopySuccess() {
  return new Promise((resolve) => {
    resolvePrompt = resolve;
    readPromptState.visible = true;
    readPromptState.type = 'success';
    readPromptState.title = '链接已复制';
    readPromptState.content = '阅读链接已复制到剪贴板，请打开浏览器粘贴访问。';
    readPromptState.hint = '推荐使用 Chrome、Edge 等浏览器打开';
    readPromptState.steps = [];
    readPromptState.confirmText = '知道了';
    readPromptState.cancelText = '取消';
    readPromptState.showCancel = false;
  });
}

export function confirmReadPrompt() {
  readPromptState.visible = false;
  if (resolvePrompt) {
    const resolve = resolvePrompt;
    resolvePrompt = null;
    resolve(true);
  }
}

export function cancelReadPrompt() {
  readPromptState.visible = false;
  if (resolvePrompt) {
    const resolve = resolvePrompt;
    resolvePrompt = null;
    resolve(false);
  }
}
