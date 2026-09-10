---
name: build-and-deploy
description: >-
  Build the Vue site with npm run build and push to GitHub for GitHub Pages
  deployment. Use when the user asks to deploy, publish, release, push to GitHub,
  部署, 发布, 上线, build and push, or run production build.
---

# 构建并部署到 GitHub Pages

## 项目约定

| 项 | 值 |
|----|-----|
| 前端目录 | `csdn/` |
| 构建命令 | `npm run build`（含 clean-assets、vite build、generate-static） |
| 输出目录 | 仓库根目录（`index.html`、`assets/`、`books/index.html`、`404.html` 等） |
| 远程 | `origin` → `https://github.com/zhanghenxiao/toolset.git` |
| 书籍 TXT | `books/*.txt` 已 gitignore，**勿提交**；`books/index.html` **需提交** |

## 一键部署（优先）

在仓库根目录执行：

```bash
node csdn/scripts/build-and-push.js
```

或在 `csdn/` 目录：

```bash
npm run deploy
```

自定义提交说明：

```bash
node csdn/scripts/build-and-push.js "feat: 更新书籍页与反爬机制"
npm run deploy -- "feat: 更新书籍页与反爬机制"
```

脚本流程：

```
1. npm run build（在 csdn/）
2. 校验 index.html、404.html、books/index.html、sitemap.xml
3. git add -A → commit → git push origin <当前分支>
4. 无变更则跳过 commit/push
```

## Agent 执行清单

用户要求部署时：

- [ ] 1. 确认在仓库根目录 `xiaogj/`
- [ ] 2. 运行 `node csdn/scripts/build-and-push.js "[简短说明]"`
- [ ] 3. 若 build 失败：修复错误后重新运行，**不要** push 半成品
- [ ] 4. 若 push 超时/失败：提示用户检查 GitHub 网络或代理，可重试 push
- [ ] 5. 汇报 commit hash 与分支名

**仅在用户明确要求部署/发布/push 时**才执行 commit 与 push；日常改代码不要自动 push。

## 手动分步（脚本失败时）

```bash
cd csdn
npm run build
cd ..
git status
git add -A
git commit -m "chore: deploy site"
git push origin main
```

## 常见问题

| 问题 | 处理 |
|------|------|
| `Failed to connect to github.com` | 网络/VPN；本地 commit 已成功时可稍后单独 `git push` |
| `/books` 刷新 404 | 确认 `books/index.html` 已提交（`.gitignore` 中 `!books/index.html`） |
| push 无输出卡住 | 上传体积大或网络慢，等待或 `git push -v` 查看进度 |
| 构建覆盖 `index.html` | 正常；`generate-static.js` 会写入 SEO 与 SPA 回退内容 |

## 验证

部署后检查：

- https://toolset.site/
- https://toolset.site/books（刷新不 404）
