---
name: minyuan-book-download
version: 2.0
description: >-
  Download novels from min-yuan.com (小原文学网), register with m_-prefixed local id
  (e.g. m_syr), fetch cover and excerpt, clean TXT, and update booksData.js.
  Use when the user asks to download from min-yuan, 小原文学网, min-yuan.com/txt/,
  or add a book whose id must start with m_ before the site slug.
---

# 小原文学网 (min-yuan.com) 书籍下载

## 版本

| 版本 | 脚本 | 策略 | 适用场景 |
|------|------|------|----------|
| **1.0** | `csdn/scripts/download-minyuan-book.js` | `curl.exe` 串行，300ms/章 | 稳定优先、被封后降速重试 |
| **2.0**（默认） | `csdn/scripts/download-minyuan-book-v2.js` | `https` keep-alive + 4 章并发 + 100ms 全局限流 + 随机抖动 | 批量下载、大部头 |

共享解析逻辑：`csdn/scripts/minyuan-book-core.js`

批量脚本默认走 **v2**；加 `--v1` 回退到 1.0：

```bash
node csdn/scripts/batch-download-minyuan-home.js --v1
```

## ID 约定

| 项 | 规则 |
|----|------|
| 书籍 URL | `https://www.min-yuan.com/txt/{slug}/` |
| 示例 | `https://www.min-yuan.com/txt/syr/` → slug=`syr` |
| **本地 id** | **`m_` + slug**，如 `m_syr` |
| 与得奇数字 id、`s`（jcxs）、`x`（x33xs）区分 |

站点 **没有** 按数字递增的全站 bookId；每本书用 **字母 slug**（3～4 位）标识。

## 路径

| 用途 | 路径 |
|------|------|
| 正文 | `books/m_{slug}_{书名}1-{章数}章.txt` |
| 封面 | `csdn/src/assets/images/books/book-m_{slug}.jpg` |
| 简介 | `csdn/src/data/books/book-m_{slug}-excerpt.txt` |
| 数据 | `csdn/src/data/booksData.js`（经 sync-all-books-data） |
| 下载脚本 v1.0 | `csdn/scripts/download-minyuan-book.js` |
| 下载脚本 v2.0 | `csdn/scripts/download-minyuan-book-v2.js` |

## 站点与抓取策略

| 用途 | URL 模板 |
|------|----------|
| 目录 / 元数据 | `https://www.min-yuan.com/txt/{slug}/` |
| 章节页 | `https://www.min-yuan.com/txt/{slug}/{n}.html` |
| 章节分页 | `https://www.min-yuan.com/txt/{slug}/{n}_{page}.html`（如 `1_2.html`） |
| 封面 | `https://www.min-yuan.com/images/{slug}.jpg` |

**元数据**：从目录页 `og:novel:*` / `og:title` / `og:description` 解析书名、作者、分类、最新章。

**正文**：`#booktxt` 内 `<p>` / `<br>` 文本；脚本会跟随 `rel="next"` 拉取同章分页（`{n}_2.html` 等），直到下一章链接。

**注意**：最新章偶发 `#booktxt` 仅显示「正在转码中，请稍后再试…」，脚本会跳过该章并在 TXT 中标注失败，其余章节照常下载。

## 一键下载（v2.0 默认）

```bash
node csdn/scripts/download-minyuan-book-v2.js <bookUrl|/txt/slug/> [localId] [startChapter]
```

示例：

```bash
node csdn/scripts/download-minyuan-book-v2.js https://www.min-yuan.com/txt/syr/
node csdn/scripts/download-minyuan-book-v2.js /txt/syr/ m_syr
# 默认 localId = m_syr
```

v2 可选参数：

```bash
node csdn/scripts/download-minyuan-book-v2.js /txt/syr/ m_syr --concurrency 4 --delay 100 --jitter 40 --retries 3
```

| 参数 | 默认 | 说明 |
|------|------|------|
| `--concurrency` | 4 | 同时下载章数（建议 3～5） |
| `--delay` | 100 | 全局限流最小间隔（ms） |
| `--jitter` | 40 | 随机额外等待（ms），降低规律请求 |
| `--retries` | 3 | 单页失败重试次数；429/503 自动退避 |

v1.0 稳定版（串行 curl）：

```bash
node csdn/scripts/download-minyuan-book.js https://www.min-yuan.com/txt/syr/
```

续传（从第 N 章追加到已有 TXT，需磁盘上已有 `m_{slug}` 文件）：

```bash
node csdn/scripts/download-minyuan-book-v2.js https://www.min-yuan.com/txt/syr/ m_syr 100
```

脚本会：拉目录（`href="/txt/{slug}/{n}.html"` + `title`）→ 按章序抓取（含分页）→ 写 UTF-8 TXT → 下载封面 → 写 excerpt。

## 完整工作流

```
- [ ] 1. download-minyuan-book-v2.js（localId 必须 m_ 开头）
- [ ] 2. node csdn/scripts/clean-book-txt.js
- [ ] 3. 核对 status、excerpt、分类；失败章可手动补或重跑续传
- [ ] 4. node csdn/scripts/sync-all-books-data.js
- [ ] 5. node csdn/scripts/sync-miniprogram-books-data.js
- [ ] 6. node csdn/scripts/sync-book-covers.js（可选）
- [ ] 7. 用户提供网盘时写入 readUrl（import-quark-share-csv.js）
```

`sync-all-books-data.js` 对 `m_*` id 的 `sourceUrl` 为 `https://www.min-yuan.com/txt/{slug}/`，且不会向得奇在线补元数据。

## booksData 条目模板

```javascript
{
  id: "m_syr",
  slug: "未知入侵",
  title: "未知入侵",
  cover: bookm_syrCover,
  author: "荆柯守",
  date: "2026-09-17",
  category: "玄幻",
  status: "连载中",
  chapters: "1-976章",
  latestChapter: "第九百七十六章 路就在前方",
  excerpt: "...",
  tags: [{ name: "玄幻", type: "purple" }, { name: "连载", type: "blue" }],
  downloadUrl: "/books/m_syr_未知入侵1-976章.txt",
  sourceUrl: "https://www.min-yuan.com/txt/syr/",
},
```

## book-paths.js 约定

- `isMinyuanId(id)` → `/^m_[a-z0-9]+$/i`
- `minyuanLocalId(slug)` → `m_${slug}`
- 文件名正则 `BOOK_FILE_RE` 已支持 `m_{slug}` 前缀

## 清理与验证

```bash
node csdn/scripts/clean-book-txt.js
```

抽查章节是否有正文、失败占位：

```bash
grep -E "下载失败|正在转码" books/m_syr*.txt
grep -A3 "^第一章" books/m_syr*.txt
```

## 常见问题

| 问题 | 处理 |
|------|------|
| 目录为空 | URL 须为书籍目录 `/txt/{slug}/`，不是单章 `/txt/syr/1.html` |
| 某章正文为空 / 转码中 | 站点未转码完成；稍后重跑 `… m_syr {章号}` 续传 |
| 章节很长只有半章 | 未跟分页；脚本已跟 `rel="next"` 的 `{n}_2.html`，检查是否站点改版 |
| 封面无效 | 路径 `/images/{slug}.jpg`；失败可删小文件后手动补图 |
| v2 频繁 429/503 | 降并发 `--concurrency 2`、加大 `--delay 200`，或换 v1 |
| 976 章耗时久 | v2 约 3～5× 快于 v1；仍勿对不存在的 slug 段批量扫 |

## 与 deqixs / jcxs / x33xs 的区别

| | deqixs | jcxs | x33xs | min-yuan |
|---|--------|------|-------|----------|
| localId | 数字 | `s` + 数字 | `x` + 数字 | **`m_` + slug** |
| 站点标识 | 数字 aid | 数字 bookId | 数字 bookId | **字母 slug** |
| 下载 | packdown 分段 | 逐章 | 逐章 `#content` | 逐章 `#booktxt` + 分页 |
| sourceUrl | deqixs.org/{id}/ | jcxs.org/book/ | x33xs6.com/33xs/… | min-yuan.com/txt/{slug}/ |

得奇见 `.cursor/skills/deqixs-book-download/SKILL.md`；精彩小说网见 `jcxs-book-download`；33 小说网见 `x33xs-book-download`。

## 示例

**m_syr《未知入侵》976 章**

1. `node csdn/scripts/download-minyuan-book-v2.js https://www.min-yuan.com/txt/syr/`
2. `node csdn/scripts/clean-book-txt.js`
3. `node csdn/scripts/sync-all-books-data.js`
4. `node csdn/scripts/sync-miniprogram-books-data.js`
5. 产出：`books/m_syr_未知入侵1-976章.txt`
