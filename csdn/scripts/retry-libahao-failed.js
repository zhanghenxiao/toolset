/**
 * 重跑 .logs/libahao-*.out.log 中失败的书籍（下载器自带断点续传，只补缺章）
 *
 * 用法:
 *   node csdn/scripts/retry-libahao-failed.js --delay 4000 --retry 3
 *   node csdn/scripts/retry-libahao-failed.js --dry-run              # 只列出待重试
 *   node csdn/scripts/retry-libahao-failed.js --logs .logs/libahao-kehuan.out.log
 *   node csdn/scripts/retry-libahao-failed.js --incomplete --reverse # 中断书籍从后往前补
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { findIncomplete } = require('./libahao-incomplete');

const root = path.resolve(__dirname, '../..');
const logsDir = path.join(root, '.logs');
const DOWNLOADER = path.join(__dirname, 'download-libahao-book.js');

const FAILED_RE = /✗\s+(.+?)\s+(l_\d+(?:__\d+)?)\s+(https?:\/\/\S+)/;

function parseArgs(argv) {
  const opts = { delay: 4000, retry: 3, dryRun: false, logs: null, incomplete: false, reverse: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--delay') opts.delay = Number(argv[++i]);
    else if (a === '--retry') opts.retry = Number(argv[++i]);
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--incomplete') opts.incomplete = true;
    else if (a === '--reverse') opts.reverse = true;
    else if (a === '--logs') opts.logs = String(argv[++i]).split(',').map((s) => s.trim()).filter(Boolean);
  }
  return opts;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function collectFailed(opts) {
  const files = opts.logs
    ? opts.logs.map((f) => (path.isAbsolute(f) ? f : path.join(root, f)))
    : fs.readdirSync(logsDir).filter((f) => /^libahao-.*\.out\.log$/i.test(f)).map((f) => path.join(logsDir, f));

  const map = new Map();
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    for (const line of lines) {
      const m = line.match(FAILED_RE);
      if (!m) continue;
      const [, title, localId, url] = m;
      if (!map.has(localId)) map.set(localId, { title: title.trim(), localId, url });
    }
  }
  if (opts.incomplete) {
    for (const b of findIncomplete()) {
      if (!map.has(b.localId)) map.set(b.localId, { title: b.title, localId: b.localId, url: b.url, done: b.done, expected: b.expected });
    }
  }
  return [...map.values()];
}

/** 是否真正完结：以 libahao-incomplete 的判定为准（进度文件 + 目录末章回查） */
function isComplete(localId, incompleteSet) {
  return !incompleteSet.has(localId);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const incompleteSet = new Set(findIncomplete().map((b) => b.localId));
  const failed = collectFailed(opts);
  if (opts.reverse) failed.reverse();
  console.log(`日志中失败书籍 ${failed.length} 本${opts.reverse ? '（从后往前）' : ''}`);
  for (const f of failed) console.log(`  ▶ ${f.title} | ${f.localId}`);

  if (opts.dryRun) {
    console.log('--dry-run，未执行');
    return;
  }

  let ok = 0;
  const stillFailed = [];
  const maxAttempts = Math.max(1, opts.retry + 1);
  for (let i = 0; i < failed.length; i++) {
    const b = failed[i];
    if (isComplete(b.localId, incompleteSet)) {
      console.log(`\n[${i + 1}/${failed.length}] 《${b.title}》 已有完整 TXT，跳过`);
      ok += 1;
      continue;
    }
    console.log(`\n[${i + 1}/${failed.length}] 《${b.title}》 ${b.localId}`);
    let succeeded = false;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      if (attempt > 1) {
        const waitSec = Math.round((20000 * attempt) / 1000);
        console.log(`  第 ${attempt}/${maxAttempts} 次尝试（等待 ${waitSec}s）…`);
        await sleep(20000 * attempt);
      }
      const res = spawnSync(process.execPath, [DOWNLOADER, b.url, b.localId, '', '--delay', String(opts.delay)], {
        stdio: 'inherit',
        cwd: root,
      });
      if (res.status === 0) {
        succeeded = true;
        break;
      }
      console.warn(`  ✗ 第 ${attempt} 次失败（exit ${res.status}）`);
    }
    if (succeeded) ok += 1;
    else stillFailed.push(b);
  }

  console.log(`\n重试完成：成功 ${ok} 本，仍失败 ${stillFailed.length} 本`);
  for (const f of stillFailed) console.log(`  ✗ ${f.title} ${f.localId} ${f.url}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
