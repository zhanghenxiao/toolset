---
name: x33xs-book-download
description: >-
  Download novels from x33xs6.com (33小说网), register with x-prefixed local id
  (e.g. x450111), fetch cover and excerpt, clean TXT, and update booksData.js.
  Use when the user asks to download from x33xs, 33小说网, x33xs6, or add a book
  whose id must start with x before the site book id.
---

# 33小说网 (x33xs6.com) 书籍下载

## ID 约定

| 项 | 规则 |
|----|------|
| 书籍 URL | `https://www.x33xs6.com/33xs/{shard}/{bookId}/` |
| 示例 | `https://www.x33xs6.com/33xs/450/450111/` → shard=`450`，bookId=`450111` |
| **本地 id** | **`x` + bookId**，如 `x450111` |
| 与得奇数字 id、`s` 前缀 jcxs 区分，封面/文件名/booksData 均用 `x{id}` |

## 路径

| 用途 | 路径 |
|------|------|
| 正文 | `books/x{bookId}_{书名}1-{章数}章.txt` |
| 封面 | `csdn/src/assets/images/books/book-x{bookId}.jpg` |
| 简介 | `csdn/src/data/books/book-x{bookId}-excerpt.txt` |
| 数据 | `csdn/src/data/booksData.js` + `deqixs-batch-registry.json` |
| 下载脚本 | `csdn/scripts/download-x33xs-book.js` |

## 站点与抓取策略

| 用途 | 基址 | 说明 |
|------|------|------|
| 目录 / 元数据 | `http://www.x33xs6.com` | **必须用 http**，https 易触发 Cloudflare |
| 正文（首选） | `http://www.x33xs6.com` | 阅读页 `#content`，整章一页 |
| 正文（备用） | `http://m.x33xs6.com` | `#nr1` + `pt_next` 分页（`4796_2.html`） |

**正文提取要点**：正文常在 `#content` 或 `#nr1` 的 `<p>` 标签**之外**，以 `<br>` 分隔；不要只解析 `<p>` 内文本。

站点常注入「爱阅小说」类垃圾段，脚本会截断 `有的人死了，但没有完全死` 之后的内容。

## 一键下载

```bash
node csdn/scripts/download-x33xs-book.js <bookUrl|/33xs/450/450111/> [localId] [startChapter]
```

示例：

```bash
node csdn/scripts/download-x33xs-book.js https://www.x33xs6.com/33xs/450/450111/ x450111
node csdn/scripts/download-x33xs-book.js /33xs/450/450111/
# 默认 localId = x450111
```

续传（从第 N 章追加到已有 TXT）：

```bash
node csdn/scripts/download-x33xs-book.js https://www.x33xs6.com/33xs/450/450111/ x450111 20
```

脚本会：拉目录（`#list dd a`）→ 逐章抓取 → 写 UTF-8 TXT → 下载封面 → 写 excerpt → 更新 `deqixs-batch-registry.json`。

## 完整工作流

```
- [ ] 1. download-x33xs-book.js（localId 必须 x 开头）
- [ ] 2. node csdn/scripts/clean-book-txt.js
- [ ] 3. 核对 status（latestChapter 含「完结」→ 已完结）、excerpt、分类
- [ ] 4. node csdn/scripts/sync-all-books-data.js
- [ ] 5. node csdn/scripts/sync-miniprogram-books-data.js
- [ ] 6. node csdn/scripts/sync-book-covers.js（可选）
- [ ] 7. 更新 zh/en resultsCount 书目总数；用户提供网盘时写入 readUrl
```

`sync-all-books-data.js` 会合并磁盘 TXT 与 registry，**不会**删除无本地文件的旧条目。

## URL 模板

```
书籍页：  http://www.x33xs6.com/33xs/{shard}/{bookId}/
阅读页：  http://www.x33xs6.com/33xs/{shard}/{bookId}/{chapterFileId}.html
封面：    http://www.x33xs6.com/img/{shard}/{bookId}.jpg
```

`chapterFileId` 为目录链接中的数字（如 `4796`），与章节序号无关。

## booksData 条目模板

```javascript
{
  id: "x450111",
  slug: "海贼-草帽船上的漫画家",
  title: "海贼：草帽船上的漫画家",
  cover: bookx450111Cover,
  author: "下山找牛",
  date: "2022-06-23",
  category: "网游",
  status: "已完结",
  chapters: "1-82章",
  latestChapter: "第81章 回到现实（完结）",
  excerpt: "...",
  tags: [{ name: "网游", type: "purple" }, { name: "完结", type: "blue" }],
  downloadUrl: "/books/x450111_海贼：草帽船上的漫画家1-82章.txt",
  sourceUrl: "https://www.x33xs6.com/33xs/450/450111/",
},
```

用户提供百度/夸克分享时追加 `readUrl`：

```bash
node csdn/scripts/import-quark-share-csv.js 分享.csv
```

## registry 条目

`deqixs-batch-registry.json` 中 `id` 为 `"x{bookId}"`，`sourceUrl` 为书籍页 URL，`filename` / `downloadUrl` 与磁盘 TXT 一致。下载脚本会自动写入，手动补全时注意 `status` / `tags` 与完结状态一致。

## book-paths.js 约定

- `isX33xsId(id)` → `/^x\d+$/`
- `x33xsLocalId(siteBookId)` → `x${siteBookId}`
- 文件名正则已支持 `x\d+` 前缀

## 清理与验证

```bash
node csdn/scripts/clean-book-txt.js
```

抽查正文首尾、章节间是否有空章：

```bash
# 不应只有章节名无正文
grep -A3 "^第1章" books/x450111*.txt
```

## 常见问题

| 问题 | 处理 |
|------|------|
| 只有章节名、无正文 | 正文在 `#content` 的 `<br>` 区，勿只解析 `<p>`；用 PC `http://www` 阅读页 |
| Cloudflare / Just a moment | 目录与阅读均用 **http://**；失败时脚本重试并回退 m 站分页 |
| 章节中段出现「时宇」「爱阅小说」 | 站点注入水印，脚本 `trimChapterSpam` 截断；清理脚本可再跑 |
| 封面 404 | `nocover.jpg` 占位；可手动替换 `book-x{id}.jpg` |
| registry 写入失败 | 文件被 IDE 占用；正文通常已落盘，重跑 sync 或手动补 registry |

## 与 deqixs / jcxs 的区别

| | deqixs | jcxs | x33xs |
|---|--------|------|-------|
| localId | 数字 | `s` + 数字 | **`x` + 数字** |
| 下载 | packdown 分段 | 逐章 jcxs.org | 逐章 x33xs6（PC `#content`） |
| sourceUrl | deqixs.org | jcxs.org/book/ | x33xs6.com/33xs/… |

得奇流程见 `.cursor/skills/deqixs-book-download/SKILL.md`；精彩小说网见 `.cursor/skills/jcxs-book-download/SKILL.md`。

## 示例

**x450111《海贼：草帽船上的漫画家》82 章完结**

1. `node csdn/scripts/download-x33xs-book.js https://www.x33xs6.com/33xs/450/450111/ x450111`
2. `node csdn/scripts/clean-book-txt.js`
3. `node csdn/scripts/sync-all-books-data.js`
4. `node csdn/scripts/sync-miniprogram-books-data.js`
5. 核对 `status: 已完结`，`latestChapter` 含「完结」
