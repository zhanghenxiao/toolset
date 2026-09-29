/** 书籍 TXT 头部/尾部与站点展示的统一书源分享文案 */
const SOURCE_SHARE_LINE = '更多书源分享，小程序搜：数维探索。最新资源获取方式：加入官方反馈群1041698859。  或者访问官网：https://toolset.site';

const LEGACY_SOURCE_SHARE_LINES = [
  '更多书源分享，小程序搜：数维探索。或者访问官网：https://toolset.site',
  '更多书源分享，访问网址 https://toolset.site',
];

function buildBookHeader(title, author) {
  return `《${title}》  作者：${author}\n${SOURCE_SHARE_LINE}\n\n\n`;
}

function buildBookFooterBlock() {
  return `\n\n\n${SOURCE_SHARE_LINE}\n`;
}

function stripShareFooters(content) {
  let text = content.replace(/\s+$/, '');
  for (const line of [SOURCE_SHARE_LINE, ...LEGACY_SOURCE_SHARE_LINES]) {
    while (text.endsWith(line)) {
      text = text.slice(0, -line.length).replace(/\s+$/, '');
    }
  }
  return text;
}

function updateHeaderShareLine(content) {
  const lines = content.split('\n');
  if (lines.length < 2) return content;
  const second = lines[1].trim();
  if (second === SOURCE_SHARE_LINE) return content;
  if (LEGACY_SOURCE_SHARE_LINES.includes(second) || /更多书源分享/.test(second)) {
    lines[1] = SOURCE_SHARE_LINE;
    return lines.join('\n');
  }
  return content;
}

function applyBookShareWatermarks(content) {
  let text = updateHeaderShareLine(content);
  text = stripShareFooters(text);
  if (!text.endsWith(SOURCE_SHARE_LINE)) {
    text += buildBookFooterBlock();
  } else {
    text += '\n';
  }
  return text;
}

function finalizeBookFile(filePath, fs = require('fs')) {
  const original = fs.readFileSync(filePath, 'utf8');
  const updated = applyBookShareWatermarks(original);
  if (updated === original) return false;
  fs.writeFileSync(filePath, updated, 'utf8');
  return true;
}

module.exports = {
  SOURCE_SHARE_LINE,
  LEGACY_SOURCE_SHARE_LINES,
  buildBookHeader,
  buildBookFooterBlock,
  stripShareFooters,
  updateHeaderShareLine,
  applyBookShareWatermarks,
  finalizeBookFile,
};
