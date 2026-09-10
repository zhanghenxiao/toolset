/**
 * 构建并推送到 GitHub（GitHub Pages 部署）
 * 用法: node scripts/build-and-push.js [commit message]
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '../..');
const csdnDir = path.join(root, 'csdn');
const commitMessage = process.argv.slice(2).join(' ').trim()
  || `chore: deploy site ${new Date().toISOString().slice(0, 10)}`;

function run(cmd, options = {}) {
  const cwd = options.cwd || root;
  console.log(`\n> ${cmd}`);
  return execSync(cmd, {
    cwd,
    stdio: 'inherit',
    encoding: 'utf8',
    ...options,
  });
}

function runCapture(cmd, options = {}) {
  const cwd = options.cwd || root;
  return execSync(cmd, {
    cwd,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    ...options,
  }).trim();
}

function getCurrentBranch() {
  return runCapture('git rev-parse --abbrev-ref HEAD');
}

function hasChanges() {
  const status = runCapture('git status --porcelain');
  return status.length > 0;
}

function main() {
  console.log('========== 1/4 生产构建 ==========');
  run('npm run build', { cwd: csdnDir });

  const mustExist = [
    path.join(root, 'index.html'),
    path.join(root, '404.html'),
    path.join(root, 'books/index.html'),
    path.join(root, 'sitemap.xml'),
  ];
  for (const file of mustExist) {
    if (!fs.existsSync(file)) {
      throw new Error(`构建产物缺失: ${path.relative(root, file)}`);
    }
  }
  console.log('✓ 构建产物检查通过');

  console.log('\n========== 2/4 检查 Git 状态 ==========');
  const branch = getCurrentBranch();
  console.log(`当前分支: ${branch}`);

  if (!hasChanges()) {
    console.log('无变更，跳过 commit 与 push');
    return;
  }

  console.log('\n========== 3/4 提交变更 ==========');
  run('git add -A');
  const msgFile = path.join(root, '.git-deploy-msg.txt');
  fs.writeFileSync(msgFile, `${commitMessage}\n`, 'utf8');
  try {
    run(`git commit -F "${msgFile}"`);
  } finally {
    fs.unlinkSync(msgFile);
  }

  console.log('\n========== 4/4 推送到 GitHub ==========');
  try {
    run(`git push -u origin ${branch}`);
  } catch (err) {
    console.error('\n✗ push 失败。常见原因：网络无法连接 github.com，请检查 VPN/代理后重试。');
    throw err;
  }

  console.log('\n🎉 部署完成');
  console.log(`分支: ${branch}`);
  console.log('GitHub Pages 通常 1–2 分钟后生效');
}

try {
  main();
} catch (err) {
  console.error(`\n✗ 部署失败: ${err.message || err}`);
  process.exit(1);
}
