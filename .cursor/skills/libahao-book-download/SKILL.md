---
name: libahao-book-download
description: >-
  Download novels from libahao2.com (篱笆好文学), register with l_-prefixed local id
  (e.g. l_12492955__660499), fetch book list with Cookie, import chapter HTML when rate-limited,
  clean TXT, and update booksData.js. Use when the user asks to download from libahao,
  篱笆好文学, libahao2.com, or add a book whose id must start with l_ before the site book id.
---

# 篱笆好文学 (libahao2.com) 书籍下载

## ID 约定

| 项 | 规则 |
|----|------|
| 书籍 URL | `https://m.libahao2.com/book/{siteBookId}_{imageId}/` |
| 示例 | `https://m.libahao2.com/book/12492955_660499/` → localId=`l_12492955__660499` |
| **本地 id** | **`l_{siteBookId}__{imageId}`**，如 `l_12492825__660539` |
| 与得奇数字 id、`s`（jcxs）、`x`（x33xs）、`m_`（min-yuan）区分 |

URL 中 `{siteBookId}_{imageId}` 同时写入本地 id（双下划线 `__` 分隔 imageId）。

## 路径

| 用途 | 路径 |
|------|------|
| 正文 | `books/l_{siteBookId}__{imageId}_{书名}1-{章数}章.txt` |
| 封面 | `csdn/src/assets/images/books/book-l_{siteBookId}__{imageId}.jpg`（`.book-info img`） |
| 简介 | `csdn/src/data/books/book-l_{siteBookId}__{imageId}-excerpt.txt` |
| 数据 | `csdn/src/data/booksData.js`（经 sync-all-books-data） |
| Cookie | `books/_work/libahao/cookie.txt` |
| 书单 | `books/_work/libahao/book-list.json` |
| 目录缓存 | `books/_work/libahao/index-{siteBookId}_{imageId}.html` |
| 章节 HTML 缓存 | `books/_work/libahao/chapters/{siteBookId}_{imageId}/` |
| 下载进度 | `books/_work/libahao/chapters/{siteBookId}_{imageId}/.progress.json` |
| 书单脚本 | `csdn/scripts/fetch-libahao-books.js` |
| 下载脚本 | `csdn/scripts/download-libahao-book.js` |

## 站点与抓取策略

| 用途 | URL 模板 |
|------|----------|
| 移动端书单/分类 | `https://m.libahao2.com/{slug}/{page}/` |
| 书籍目录 | `https://m.libahao2.com/book/{siteBookId}_{imageId}/` |
| 章节页 | `https://m.libahao2.com/book/{siteBookId}_{imageId}/{n}.html` |
| 章节分页 | `https://m.libahao2.com/book/{siteBookId}_{imageId}/{n}_{page}.html`（如 `1_1.html`） |
| 搜索 | `https://m.libahao2.com/sou?wd={关键词}` |

**分类 slug**：`xuanhuan`、`xiuzhen`、`dushi`、`lishi`、`wangyou`、`kehuan`、`nvpin`、`qita`

**元数据**：目录页 `og:novel:*` / `.book-info-*` 解析书名、作者、分类、最新章；封面取自 **`.book-info` 内 `img`**。

**正文**：`#chapterContent` 内 `<p>` / `<br>`；脚本跟随 `rel="next"` 拉取同章分页（`1_1.html` 等），直到无下一页。

**防护**：命令行请求常被 403 / `socket hang up` 限流；**必须带 Cookie**，且可能需要 `--delay 5000` 或浏览器另存 HTML 后 `--import-html` 导入。

## 获取 Cookie

1. 浏览器打开空白页 `about:blank`
2. `F12` → **Network**
3. 访问 `https://libahao2.com/xuanhuan/` 或 `https://m.libahao2.com/xuanhuan/1/`
4. 点该请求 → **Request Headers** → 复制 `Cookie` 整段
5. 写入 `books/_work/libahao/cookie.txt`，或环境变量 `LIBAHAO_COOKIE`

## 抓取书单

```bash
# 默认续传合并 book-list.json；全量重抓加 --fresh
node csdn/scripts/fetch-libahao-books.js --all-categories --delay 3000

# 单分类
node csdn/scripts/fetch-libahao-books.js --category xuanhuan --pages 1 --delay 3000

# 浏览器另存 HTML 后解析
node csdn/scripts/fetch-libahao-books.js --html books/_work/libahao/book.html
```

**注意**：移动端分类页每页约 6 本，翻页 `/xuanhuan/2/` 等常返回重复内容；当前书单以各分类第 1 页为主。

## 下载全书

```bash
# 从 book-list.json 按 index 下载（默认 localId = l_{siteBookId}）
node csdn/scripts/download-libahao-book.js --from-list 0 --delay 5000

# 直接指定 URL
node csdn/scripts/download-libahao-book.js https://m.libahao2.com/book/12492955_660499/
node csdn/scripts/download-libahao-book.js https://m.libahao2.com/book/12492955_660499/ l_12492955__660499

# 仅下载封面（.book-info img）
node csdn/scripts/download-libahao-book.js https://libahao2.com/book/12492825_660539/ --cover-only

# 从第 N 章续传（需已有 TXT）
node csdn/scripts/download-libahao-book.js https://m.libahao2.com/book/12492955_660499/ l_12492955 10
```

脚本会：读目录（优先本地 `index-*.html` 缓存）→ 逐章抓取（含分页）→ 写 UTF-8 TXT → 下载封面 → 写 excerpt → 用 `.progress.json` 记录已完成章数。

### 限流时手动导入续页

章节提示 `partial (缺续页…)` 时：

1. 浏览器打开对应章节，点击「本章未完，点击继续阅读」
2. `Ctrl+S` 另存 HTML，如 `books/_work/libahao/1_1.html`
3. 导入缓存并续传：

```bash
node csdn/scripts/download-libahao-book.js \
  --import-html books/_work/libahao/1_1.html \
  --import-page /book/12492955_660499/1_1.html

node csdn/scripts/download-libahao-book.js --from-list 0 --delay 5000
```

章节 HTML 缓存文件名规则：`{pageHref}` 中非 `\w.-` 字符替换为 `_`，去掉末尾 `.html` 后加 `.html`。  
例：`/book/12492955_660499/1.html` → `_book_12492955_660499_1.html`

## 完整工作流

```
- [ ] 1. 更新 cookie.txt（若 403 / socket hang up）
- [ ] 2. fetch-libahao-books.js（可选，取书单）
- [ ] 3. download-libahao-book.js（localId 必须 l_ 开头）
- [ ] 4. 限流时 --import-html 补全分页
- [ ] 5. node csdn/scripts/clean-book-txt.js
- [ ] 6. 核对 status、excerpt、分类
- [ ] 7. node csdn/scripts/sync-all-books-data.js
- [ ] 8. node csdn/scripts/sync-miniprogram-books-data.js
- [ ] 9. node csdn/scripts/sync-book-covers.js（可选）
- [ ] 10. 用户提供网盘时写入 readUrl（import-quark-share-csv.js）
```

`sync-all-books-data.js` 目前对 `l_*` id 的 `sourceUrl` 可能仍回落为 deqixs 模板；注册后请手动改为：

`https://m.libahao2.com/book/{siteBookId}_{imageId}/`

## booksData 条目模板

```javascript
{
  id: "l_12492955__660499",
  slug: "斗罗氪金系统",
  title: "斗罗：氪金系统，一秒一枚金魂币",
  cover: bookl_12492955__660499Cover,
  author: "小怪咯",
  date: "2026-09-19",
  category: "玄幻",
  status: "连载中",
  chapters: "1-47章",
  latestChapter: "第47章 小魔女蜕变",
  excerpt: "...",
  tags: [{ name: "玄幻", type: "purple" }, { name: "连载", type: "blue" }],
  downloadUrl: "/books/l_12492955__660499_斗罗：氪金系统，一秒一枚金魂币1-47章.txt",
  sourceUrl: "https://m.libahao2.com/book/12492955_660499/",
},
```

## book-paths.js 约定

- `isLibahaoId(id)` → `/^l_\d+$/i`
- `libahaoLocalId(siteBookId, imageId)` → `l_${siteBookId}__${imageId}`
- `parseLibahaoBookUrl(url)` → `{ siteBookId, imageId, bookPath }`
- 文件名正则 `BOOK_FILE_RE` 已支持 `l_{数字}` 前缀

## 清理与验证

```bash
node csdn/scripts/clean-book-txt.js
```

抽查正文与站点水印：

```bash
grep -E "libahao2|篱笆好|本站新网址" books/l_12492955*.txt
grep -A3 "^  第一章" books/l_12492955*.txt
```

## 常见问题

| 问题 | 处理 |
|------|------|
| 403 / 区域被禁止 / socket hang up | 更新 Cookie；加大 `--delay`；浏览器另存 HTML 后 `--import-html` |
| 第 1 章 partial，缺 `1_1.html` | 浏览器打开续页另存，按上文导入 |
| 目录为空 | URL 须为书籍目录 `/book/{id}_{slug}/`，不是单章 |
| 缓存未命中（曾出现 `.html.html`） | 已修复；旧文件可重命名或删缓存重下 |
| 章节 HTML 缓存路径 | `chapters/{bookPath}/_book_{bookPath}_{n}.html` |
| 封面失败 | 从目录页 `.book-info-cover` 再试；或手动补 `book-l_{id}.jpg` |
| 书单只有 48 本 | 分类页翻页重复；需换抓取策略或手动扩充 |

## 与 deqixs / jcxs / x33xs / min-yuan 的区别

| | deqixs | jcxs | x33xs | min-yuan | libahao |
|---|--------|------|-------|----------|---------|
| localId | 数字 | `s` + 数字 | `x` + 数字 | `m_` + slug | **`l_{id}__{imageId}`** |
| 站点标识 | 数字 aid | 数字 bookId | 数字 bookId | 字母 slug | **数字 bookId + imageId** |
| 下载 | packdown 分段 | 逐章 | 逐章 | 逐章 + 分页 | 逐章 `#chapterContent` + 分页 |
| Cookie | 通常不需要 | 通常不需要 | 通常不需要 | 通常不需要 | **经常需要** |
| sourceUrl | deqixs.org/{id}/ | jcxs.org/book/ | x33xs6.com/… | min-yuan.com/txt/ | m.libahao2.com/book/… |

得奇见 `deqixs-book-download`；精彩小说网见 `jcxs-book-download`；33 小说网见 `x33xs-book-download`；小原文学网见 `minyuan-book-download`。

## 示例

**l_12492955《斗罗：氪金系统，一秒一枚金魂币》47 章**

1. 写入 `books/_work/libahao/cookie.txt`
2. `node csdn/scripts/download-libahao-book.js --from-list 0 --delay 5000`
3. 若缺续页：`--import-html` 导入 `1_1.html` 等，再重跑步骤 2
4. `node csdn/scripts/clean-book-txt.js`
5. `node csdn/scripts/sync-all-books-data.js`
6. `node csdn/scripts/sync-miniprogram-books-data.js`
7. 产出：`books/l_12492955__660499_斗罗：氪金系统，一秒一枚金魂币1-47章.txt`
