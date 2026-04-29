const fs = require('fs');
const path = require('path');

const assetsDir = path.resolve(__dirname, '../../assets');

console.log(`正在清理静态资源目录: ${assetsDir}`);

try {
  if (fs.existsSync(assetsDir)) {
    // Node.js 14.14.0+ support rmSync
    if (fs.rmSync) {
      fs.rmSync(assetsDir, { recursive: true, force: true });
    } else {
      // Fallback for older Node versions
      fs.rmdirSync(assetsDir, { recursive: true });
    }
    console.log('清理成功。');
  } else {
    console.log('目录不存在，跳过清理。');
  }
} catch (err) {
  console.error(`清理失败: ${err.message}`);
  // 不中断构建过程
}
