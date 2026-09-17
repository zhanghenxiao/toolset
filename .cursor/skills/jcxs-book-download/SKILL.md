---
name: jcxs-book-download
description: >-
  Download novels from jcxs.org (精彩小说网), register with s-prefixed local id
  (e.g. s114759), fetch cover and excerpt, clean TXT, and update booksData.js.
  Use when the user asks to download from jcxs, 精彩小说网, or add a book whose
  id must start with s before the site book id.
---

# 精彩小说网 (jcxs.org) 书籍下载

## ID 约定

| 项 | 规则 |
|----|------|
| 站点书籍 ID | URL 中的数字，如 `114759` → `https://www.jcxs.org/book/114759/` |
| **本地 id** | **`s` + 站点 ID**，如 `s114759`、`s52266` |
| 与得奇 numeric id（1–1700）区分，封面/文件名/booksData 均用 `s{id}` |

## 路径

| 用途 | 路径 |
|------|------|
| 正文 | `books/s{siteId}_{书名}1-{章数}章.txt` |
| 封面 | `csdn/src/assets/images/books/book-s{siteId}.jpg` |
| 简介 | `csdn/src/data/books/book-s{siteId}-excerpt.txt` |
| 数据 | `csdn/src/data/booksData.js` + `deqixs-batch-registry.json` |
| 下载脚本 | `csdn/scripts/download-jcxs-book.js` |

## 一键下载

```bash
node csdn/scripts/download-jcxs-book.js <bookId|bookUrl> [localId] [startChapter]
```

示例：

```bash
node csdn/scripts/download-jcxs-book.js https://www.jcxs.org/book/114759/ s114759
node csdn/scripts/download-jcxs-book.js 52266
# 默认 localId = s52266
```

续传（从第 N 章追加到已有 TXT）：

```bash
node csdn/scripts/download-jcxs-book.js 114759 s114759 20
```

脚本会：拉目录 → 逐章阅读页抓取 → 写 UTF-8 TXT → 下载 `jcxs.org/img/{siteId}.jpg` 封面 → 写 excerpt。

**目录格式**：站点章节名可能是 `第1章`（非 `1 标题`），脚本已兼容。

## 完整工作流

```
- [ ] 1. download-jcxs-book.js（localId 必须 s 开头）
- [ ] 2. node csdn/scripts/clean-book-txt.js
- [ ] 3. 核对 excerpt / 作者（站点 meta 作者可能不准，以简介「作者:」为准）
- [ ] 4. 写入 deqixs-batch-registry.json（id、sourceUrl、tags、status）
- [ ] 5. 在 booksData.js 增加 import book-s{id}.jpg 与 bookItems 条目
- [ ] 6. node csdn/scripts/sync-miniprogram-books-data.js
- [ ] 7. node csdn/scripts/sync-book-covers.js（可选，Pages 稳定封面 URL）
```

### booksData 条目模板

```javascript
{
  id: "s114759",
  slug: "掌中香-糙汉h",
  title: "掌中香（糙汉h）",
  cover: books114759Cover,
  author: "喝杯奶茶",
  date: "2026-09-15",
  category: "仙侠",
  status: "已完结",
  chapters: "1-36章",
  latestChapter: "第36章",
  excerpt: "...",
  tags: [{ name: "仙侠", type: "purple" }, { name: "完结", type: "blue" }],
  downloadUrl: "/books/s114759_掌中香（糙汉h）1-36章.txt",
  sourceUrl: "https://www.jcxs.org/book/114759/",
},
```

用户提供百度/夸克分享时追加 `readUrl`。

### registry 条目

在 `csdn/src/data/deqixs-batch-registry.json` 追加对象，`id` 为 `"s{siteId}"`，`sourceUrl` 为书籍页 URL，`filename` / `downloadUrl` 与磁盘 TXT 一致。

## URL 模板

```
书籍页：  https://www.jcxs.org/book/{siteId}/
阅读页：  https://www.jcxs.org/read/{siteId}/{chapterKey}/
封面：    https://www.jcxs.org/img/{siteId}.jpg
```

封面若下载为空或非 JPEG，可从同站其它书复制或手动替换 `book-s{id}.jpg`。

## 清理与验证

```bash
node csdn/scripts/clean-book-txt.js
grep -E "jcxs|精彩小说" books/s114759*.txt
```

## 与得奇 skill 的区别

| | deqixs | jcxs |
|---|--------|------|
| localId | 数字 | **s + 数字** |
| 下载 | packdown 分段 | 逐章 crawl |
| sourceUrl | deqixs.org | jcxs.org/book/ |

得奇流程见 `.cursor/skills/deqixs-book-download/SKILL.md`。

## 示例

**s114759《掌中香（糙汉h）》36 章完结**

1. `node csdn/scripts/download-jcxs-book.js 114759 s114759`
2. `node csdn/scripts/clean-book-txt.js`
3. 注册 `s114759`，作者 **喝杯奶茶**，status **已完结**
