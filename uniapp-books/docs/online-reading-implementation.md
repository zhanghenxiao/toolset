# uniapp-books 在线阅读功能实施指南

## 已完成的工作

### 1. 核心文件创建 ✅

- **阅读器页面**: `src/pages/reader/reader.vue`
  - 支持章节切换（上一章/下一章）
  - 点击屏幕切换菜单显示/隐藏
  - 阅读设置（字体大小、背景色）
  - 阅读进度保存和恢复

- **云函数**: `uniCloud-aliyun/cloudfunctions/get-book-content/`
  - 从云存储下载书籍文件
  - 支持获取完整内容或指定范围

- **工具函数**: `src/utils/chapter-parser.js`
  - 解析 txt 为章节列表
  - 清理章节内容（去除广告等）
  - 生成章节索引

- **脚本工具**: `scripts/generate-chapter-index.js`
  - 批量生成章节索引数据

### 2. 路由配置 ✅

已在 `pages.json` 中添加阅读器页面路由。

### 3. 详情页集成 ✅

已修改 `pages/detail/detail.vue`：
- 添加"在线阅读"按钮（当 `onlineReadable: true` 时显示）
- 保留原有"在浏览器打开阅读"按钮

### 4. 数据结构示例 ✅

已为 id=1 的书籍添加在线阅读字段示例。

---

## 接下来需要做的事情

### 步骤 1：上传 txt 文件到云存储

1. 打开 HBuilderX
2. 右键点击项目 → uniCloud → 云服务空间初始化（如果还未初始化）
3. 在 HBuilderX 中打开：uniCloud 控制台
4. 选择"云存储"
5. 创建目录 `books`
6. 将 `d:\work\Web\xiaogj\books\` 下的 txt 文件上传到云存储的 `books` 目录
7. 上传完成后，记录每个文件的 `cloudStorageFileId`，格式类似：
   ```
   cloud://your-env-id.xxxx/books/1_没钱修什么仙？1-995章.txt
   ```

### 步骤 2：生成章节索引数据

在项目根目录运行：

```bash
cd uniapp-books
node scripts/generate-chapter-index.js
```

这会生成 `src/data/chapter-indexes.json` 文件，包含所有书籍的章节信息。

### 步骤 3：更新 books.js 数据

将生成的章节索引数据合并到 `src/data/books.js`。

对于每本支持在线阅读的书，添加以下字段：

```javascript
{
  "id": 1,
  // ... 现有字段 ...
  
  // 新增字段
  "onlineReadable": true,
  "cloudStorageFileId": "cloud://your-env-id.xxxx/books/1_没钱修什么仙？1-995章.txt",
  "totalChapters": 995,
  "wordCount": 2580000,
  "fileSize": 5242880,
  "lastUpdated": "2026-10-13"
}
```

**注意**：将 `your-env-id` 替换为你的实际云环境 ID。

### 步骤 4：部署云函数

1. 在 HBuilderX 中右键点击 `uniCloud-aliyun/cloudfunctions/get-book-content`
2. 选择"上传部署"
3. 等待部署完成

### 步骤 5：测试功能

1. 运行项目到真机或模拟器
2. 进入书籍详情页（id=1）
3. 点击"在线阅读"按钮
4. 测试功能：
   - ✓ 章节加载
   - ✓ 上一章/下一章切换
   - ✓ 菜单显示/隐藏
   - ✓ 阅读设置
   - ✓ 阅读进度保存

---

## 当前数据结构示例（id=1）

```javascript
{
  "id": 1,
  "title": "没钱修什么仙？？？",
  "author": "熊狼狗",
  "category": "玄幻",
  "status": "连载中",
  "chapters": "1-995章",
  "latestChapter": "第995章 终极倒翻昆仑，掌书人",
  "excerpt": "老者："你想报仇？"...",
  "readUrl": "https://pan.quark.cn/s/bf5bff7779c4",
  "downloadUrl": "/books/1_没钱修什么仙？1-995章.txt",
  "tags": [
    { "name": "玄幻", "type": "purple" },
    { "name": "连载", "type": "blue" }
  ],
  "cover": "https://toolset.site/assets/book-1-9cec7e12.jpg",
  
  // 在线阅读字段
  "onlineReadable": true,
  "cloudStorageFileId": "cloud://your-env-id.xxxx/books/1_没钱修什么仙？1-995章.txt",
  "totalChapters": 995,
  "wordCount": 2580000
}
```

---

## 功能特性

### 用户体验

- **无缝阅读**：点击即可开始阅读，无需跳转外部链接
- **阅读进度**：自动保存，下次打开继续上次位置
- **自定义设置**：字体大小、背景色可调
- **简洁操作**：点击屏幕显示/隐藏菜单

### 技术特点

- **本地缓存**：首次加载后缓存内容，再次打开秒开
- **按需加载**：支持分段加载大文件（可选）
- **章节解析**：自动识别章节标题和内容
- **性能优化**：小于 5MB 的文件自动缓存

---

## 常见问题

### Q1: 云函数调用失败？

**A**: 检查云函数是否已部署，云存储文件 ID 是否正确。

### Q2: 章节解析不准确？

**A**: 检查 txt 文件的章节标题格式，确保符合正则：`第X章 标题`

### Q3: 阅读器加载慢？

**A**: 
- 首次加载需要下载完整文件
- 后续访问会使用缓存
- 可以考虑实现分段加载（见设计文档）

### Q4: 如何批量更新所有书籍数据？

**A**: 运行脚本生成章节索引后，编写一个合并脚本将数据批量更新到 books.js。

---

## 未来扩展

- [ ] 章节目录弹窗（更友好的章节选择）
- [ ] 搜索功能（全文搜索关键词）
- [ ] 书签功能（标记重要位置）
- [ ] 夜间模式（护眼模式）
- [ ] 听书功能（文字转语音）
- [ ] 离线下载（保存到本地）
- [ ] 阅读统计（时长、速度等）

---

**文档更新时间**：2026-10-13  
**状态**：核心功能已完成，等待部署测试
