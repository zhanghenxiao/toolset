/**
 * 批量更新 books/*.txt 头部/尾部书源分享水印
 * 用法: node csdn/scripts/sync-book-share-watermark.js
 */
const path = require('path');
const { discoverBookTxtTargets } = require('./book-paths');
const { finalizeBookFile } = require('./source-share-line');

const root = path.resolve(__dirname, '../..');
const targets = discoverBookTxtTargets(root);

console.log(`更新书籍 TXT 分享水印（共 ${targets.length} 本）…`);
let updated = 0;
for (const filePath of targets) {
  if (finalizeBookFile(filePath)) {
    updated += 1;
    console.log(`  ✓ ${path.basename(filePath)}`);
  }
}
console.log(`完成，更新 ${updated} 本，无需变更 ${targets.length - updated} 本`);
