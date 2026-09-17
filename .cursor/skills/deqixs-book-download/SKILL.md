---
name: deqixs-book-download
description: >-
  Download novels from deqixs.org (得奇小说网), fetch synopsis and cover,
  merge/clean TXT watermarks, rename files, and register in booksData.js.
  Use when the user asks to download a book, add a novel to /books page,
  clean book TXT spam, or fetch book excerpt from deqixs.
---

# 得奇小说网书籍下载与清理

## 项目路径约定

| 用途 | 路径 |
|------|------|
| 书籍正文 | `books/{id}_{书名}1-{最新章节}章.txt` |
| 封面图 | `csdn/src/assets/images/books/book-{aid}.jpg` |
| 简介文本 | `csdn/src/data/books/book-{localId}-excerpt.txt` |
| 书籍数据 | `csdn/src/data/booksData.js` |
| 清理脚本 | `csdn/scripts/clean-book-txt.js` |

**注意**：`localId`（站点书籍 ID）与 `aid`（下载/封面 ID）可能不同。例：本地 id=145 对应 aid=154。

## 下载 URL 模板

```
信息页/简介：  https://www.deqixs.org/{aid}/txt.html
封面：        https://www.deqixs.org/files/article/image/0/{aid}/{aid}s.jpg
分段下载：    https://www.deqixs.org/modules/article/packdown.php?aid={aid}&start={start}&end={end}
```

**限制**：单次下载最多 501 章。超过则分段下载后合并（如 1-500、501-837）。

## 完整工作流

```
任务进度：
- [ ] 1. 获取书籍元数据（书名、作者、简介、最新章节）
- [ ] 2. 下载封面与 TXT
- [ ] 3. 分段合并（如需要）
- [ ] 4. 执行清理脚本
- [ ] 5. 重命名为 `{id}_{书名}1-{最新章节}章.txt`
- [ ] 6. 更新 booksData.js
- [ ] 7. 验证无残留水印
```

### 1. 获取元数据

访问 `https://www.deqixs.org/{aid}/txt.html`，提取：

- **书名**：`<h1>` 内链接文本
- **作者**：`作者：` 链接文本
- **简介**：`class="des bb"` 第一个区块（`white-space: pre-line`）
- **最新章节**：页面「最新三章节」或 TXT 页分段列表
- **分类**：玄幻小说 / 轻小说 等

将简介保存到 `csdn/src/data/books/book-{localId}-excerpt.txt`（纯文本，去掉 `<br />`）。

### 2. 下载文件

使用 `curl.exe`（Windows）：

```bash
# 创建临时工作目录（分段下载用）
mkdir books/_work/{localId}
mkdir csdn/src/assets/images/books

# 封面
curl.exe -L -o "csdn/src/assets/images/books/book-{aid}.jpg" \
  "https://www.deqixs.org/files/article/image/0/{aid}/{aid}s.jpg"

# 正文（单段）
curl.exe -L -o "books/_work/{localId}/part.txt" \
  "https://www.deqixs.org/modules/article/packdown.php?aid={aid}&start=1&end={end}"
```

若返回 `分段下载最多只能选择501章`，改为多段下载：

```bash
curl.exe -L -o "books/_work/{localId}/part1.txt" "...&start=1&end=500"
curl.exe -L -o "books/_work/{localId}/part2.txt" "...&start=501&end={end}"
```

### 3. 合并分段 TXT

源文件通常为 **GBK/GB18030** 编码，合并时必须正确解码后输出 UTF-8：

```javascript
function readBookText(filePath) {
  const buffer = fs.readFileSync(filePath);
  const utf8 = buffer.toString('utf8');
  if (!utf8.includes('\uFFFD')) return utf8;
  return new TextDecoder('gb18030').decode(buffer);
}

function stripHeader(text) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => /^ 第.+章/.test(line));
  return start === -1 ? text : lines.slice(start).join('\n');
}
```

合并格式：

```
《{书名}》  作者：{作者}
更多书源分享，小程序搜：数维探索。或者访问官网：https://toolset.site
章节范围：1-{end}章（可选）


{part1正文}
{part2正文}
```

合并后删除临时 `part*.txt`，目录下只保留最终文件。

### 4. 执行清理脚本

```bash
node csdn/scripts/clean-book-txt.js
```

**清理脚本**会自动扫描 `books/` 下所有扁平 TXT 文件，无需手动追加路径。

清理脚本会移除以下水印（勿误删正文「收藏」「请进」等对话）：

- **优先**：混淆 `.org` 后缀整行（`o*r*g`、`o-rg`、`u.o*r*g` 等；r 前为 o/0，r 后为 g，中间仅分隔符）
- `来源：得奇小说网` / `deqixs.org`
- 竖排字符水印（得/奇/小/说/网/d/e/q/i/x/s/.o/r/g）
- 括号分隔水印：`「得」「奇」…「deqixs.org」`
- 乱码推广行：`，??9`、`??提醒您查看最新内容`、`看本书，??9`
- **必应推广整行**：含 `必应搜` / `必应搜索` / `百度…必应…搜`；或去「」后含 `必应` 且带小说站关键词（如 `德齐/德旗小说网`、`最新章`、`查看本书`）；含 `前往…必应…搜…小说网` 的括号分隔变体
- **「德」括号水印整行**：如 `「德」「旗」「小」「说」「网」「手打」「更新」`；去「」后为 `德旗/德齐/德其小说网`；连续 5 个以上「单字」括号块且含 `德`+`旗/齐/其`
- `必应搜索「嘚齐小说网」`、`w)w)w).)d)e)q)i)x)s).)o)r)g`
- `速读谷` / `速度谷` / `www.sudugu.org` / `ｓuduɡu.ｃｃ`（含空格模糊变体：`速 读 谷`、`速.读.谷`、`涑￥读 ￥谷`、`s…u…d…u…g…u. o…r…g`、`更新不易，请记住本站…`）
- **凡含 `.org` 的整行**（含全角点 `。org`、逗号分隔 `.o,r,g` 等变体）
- `请记住更新地址不迷路`、文末 `更多精彩小说，请访问：得奇小说网`

若清理后仍有残留，用 `grep` 搜索 `??`、`得奇`、`deqixs`、`「得」「奇」`，补充规则后重跑。

### 5. 重命名

从 TXT 内 grep 实际最新章节（如 `^ 第八百三十五章` 或 `^ 第148章`），命名：

```
{id}_{书名}1-{最新章节数}章.txt
```

示例：`145_武道！1-148章.txt`、`1_没钱修什么仙？1-987章.txt`

### 6. 更新 booksData.js

在 `bookItems` 数组头部添加条目：

```javascript
{
  id: {localId},
  slug: '{slug}',
  title: '{书名}',
  cover: bookCover,  // import from assets/images/books/
  author: '{作者}',
  date: '{更新日期}',
  category: '{分类}',
  status: '连载中',
  chapters: '1-{end}章',
  latestChapter: '第{N}章 {章节标题}',
  excerpt: '{简介摘要，约200字}',
  tags: [{ name: '{分类}', type: 'purple' }],
  readUrl: '{夸克网盘链接，可选}',
  sourceUrl: 'https://www.deqixs.org/{aid}/txt.html#dir',
},
```

同步更新 `allBookCategories` 和 `allBookTags`（如有新分类/标签）。

用户提供夸克分享链接时，设置 `readUrl`（「阅读」按钮跳转网盘）；无则可用 `downloadUrl: '/books/{id}_{书名}1-{章节}章.txt'`。

## 验证清单

```bash
# 确认无水印残留
grep -E "得奇|deqixs|嘚齐|\?\?|必应搜索|w\)w\)w\)" books/{id}*.txt

# 确认目录仅保留最终 TXT
ls books/

# 运行清理
node csdn/scripts/clean-book-txt.js
```

## 示例

**下载 aid=235，localId=235，1-837章：**

1. 简介页：`https://www.deqixs.org/235/txt.html` → 刀如故，《我命令你成为密教教主》
2. 分段下载 1-500、501-837，GBK 解码后合并
3. `node csdn/scripts/clean-book-txt.js`
4. 重命名 → `我命令你成为密教教主1-835章.txt`（实际最新第835章）
5. `readUrl: 'https://pan.quark.cn/s/d3bdf735c407'`

**下载 aid=154，localId=145，1-145章：**

1. 简介页：`https://www.deqixs.org/154/txt.html`（非 `/3/txt.html`）
2. 单段下载即可
3. 清理 → `武道！1-148章.txt`
4. `readUrl: 'https://pan.quark.cn/s/3241f9ad0c8c'`

## 常见问题

| 问题 | 处理 |
|------|------|
| 下载仅 55 字节 | 超过 501 章限制，改为分段下载 |
| 合并后乱码 | 源文件为 GBK，用 `gb18030` 解码后再写 UTF-8 |
| 清理报「无需清理」但仍有水印 | 检查新型水印格式，扩展 `clean-book-txt.js` 规则后重跑 |
| aid 与 localId 不一致 | 下载/封面用 aid，目录与 booksData 用 localId |
