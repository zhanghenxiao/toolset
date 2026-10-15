# uniapp-books 在线阅读功能设计方案

## 一、功能概述

为 uniapp-books 项目新增在线阅读功能，用户可以直接在 App 内阅读小说内容，无需跳转外部链接。

## 二、数据结构设计

### 2.1 books.js 扩展字段

在现有书籍数据基础上，新增以下字段：

```javascript
{
  "id": 1,
  "title": "没钱修什么仙？？？",
  "author": "熊狼狗",
  // ... 现有字段 ...
  
  // ========== 在线阅读新增字段 ==========
  "onlineReadable": true,                    // 是否支持在线阅读
  "cloudStorageFileId": "cloud://...",       // 云存储文件路径
  "totalChapters": 995,                      // 总章节数
  "wordCount": 2580000,                      // 总字数（可选）
  "fileSize": 5242880,                       // 文件大小（字节）
  "lastUpdated": "2026-10-13",              // 最后更新日期
  
  // 章节索引（预解析，用于快速跳转）
  "chapterIndex": [
    { "chapter": 1, "title": "面试", "startPos": 150, "length": 5080 },
    { "chapter": 2, "title": "第二章标题", "startPos": 5230, "length": 4820 }
    // ... 更多章节
  ]
}
```

### 2.2 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `onlineReadable` | Boolean | 是 | 是否支持在线阅读，false 则只显示外链 |
| `cloudStorageFileId` | String | 是 | uniCloud 云存储文件路径，格式：`cloud://环境ID.xxxx/路径` |
| `totalChapters` | Number | 是 | 总章节数，用于显示阅读进度 |
| `wordCount` | Number | 否 | 总字数，用于显示书籍信息 |
| `fileSize` | Number | 否 | 文件大小（字节），用于提示用户下载流量 |
| `lastUpdated` | String | 否 | 最后更新日期，格式：YYYY-MM-DD |
| `chapterIndex` | Array | 否 | 章节索引数组，用于快速定位章节 |

### 2.3 chapterIndex 结构

```javascript
{
  "chapter": 1,           // 章节号
  "title": "面试",        // 章节标题
  "startPos": 150,        // 章节起始字符位置
  "length": 5080          // 章节内容长度（可选，用于进度计算）
}
```

## 三、云存储结构

### 3.1 目录规划

```
uniCloud-aliyun/
└── cloudstorage/
    └── books/
        ├── 1_没钱修什么仙？1-995章.txt
        ├── 2_夜无疆1-810章.txt
        └── ...
```

### 3.2 文件命名规范

- 格式：`{bookId}_{书名}{章节范围}.txt`
- 示例：`1_没钱修什么仙？1-995章.txt`

## 四、技术实现方案

### 4.1 云函数：获取书籍内容

创建云函数 `get-book-content`：

```javascript
// uniCloud-aliyun/cloudfunctions/get-book-content/index.js
'use strict';

exports.main = async (event, context) => {
  const { fileId, startPos, length } = event;
  
  try {
    // 方案1：下载整个文件（适合小文件或首次加载）
    const result = await uniCloud.downloadFile({
      fileID: fileId
    });
    
    // 返回指定范围的内容
    const buffer = result.fileContent;
    const content = buffer.toString('utf-8');
    
    if (startPos !== undefined && length !== undefined) {
      return {
        success: true,
        content: content.substring(startPos, startPos + length)
      };
    }
    
    return {
      success: true,
      content: content
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
```

### 4.2 前端：章节解析工具

```javascript
// src/utils/chapter-parser.js

/**
 * 解析 txt 内容为章节列表
 * @param {String} content - 完整的txt内容
 * @returns {Array} 章节数组
 */
export function parseChapters(content) {
  // 匹配章节标题的正则（支持多种格式）
  const chapterRegex = /第[0-9零一二三四五六七八九十百千]+章\s+[^\n]*/g;
  const chapters = [];
  let match;
  let lastIndex = 0;
  let chapterNum = 0;
  
  while ((match = chapterRegex.exec(content)) !== null) {
    if (chapterNum > 0) {
      // 保存上一章的内容
      chapters[chapterNum - 1].content = content.substring(
        lastIndex, 
        match.index
      ).trim();
    }
    
    chapterNum++;
    chapters.push({
      chapter: chapterNum,
      title: match[0],
      startPos: match.index,
      content: '' // 将在下一次循环中填充
    });
    
    lastIndex = match.index;
  }
  
  // 处理最后一章
  if (chapters.length > 0) {
    chapters[chapters.length - 1].content = content.substring(lastIndex).trim();
  }
  
  return chapters;
}

/**
 * 根据章节索引快速提取章节内容
 * @param {String} content - 完整txt内容
 * @param {Object} chapterInfo - 章节信息 {startPos, length}
 * @returns {String} 章节内容
 */
export function extractChapter(content, chapterInfo) {
  const { startPos, length } = chapterInfo;
  if (length) {
    return content.substring(startPos, startPos + length);
  }
  return content.substring(startPos);
}
```

### 4.3 前端：阅读器组件

```vue
<!-- src/pages/reader/reader.vue -->
<template>
  <view class="reader-container">
    <view class="reader-header">
      <view class="book-title">{{ bookTitle }}</view>
      <view class="chapter-title">{{ currentChapter.title }}</view>
    </view>
    
    <scroll-view 
      class="reader-content" 
      scroll-y
      :scroll-top="scrollTop"
      @scroll="onScroll"
    >
      <view class="content-text">{{ currentChapter.content }}</view>
    </scroll-view>
    
    <view class="reader-footer">
      <button @tap="prevChapter" :disabled="currentChapterNum <= 1">
        上一章
      </button>
      <view class="chapter-info">
        {{ currentChapterNum }} / {{ totalChapters }}
      </view>
      <button @tap="nextChapter" :disabled="currentChapterNum >= totalChapters">
        下一章
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { parseChapters } from '@/utils/chapter-parser';

const props = defineProps({
  bookId: Number
});

const bookTitle = ref('');
const currentChapterNum = ref(1);
const totalChapters = ref(0);
const currentChapter = ref({ title: '', content: '' });
const chapters = ref([]);
const scrollTop = ref(0);

// 加载书籍内容
async function loadBook() {
  uni.showLoading({ title: '加载中...' });
  
  try {
    // 调用云函数获取书籍内容
    const res = await uniCloud.callFunction({
      name: 'get-book-content',
      data: { 
        bookId: props.bookId 
      }
    });
    
    if (res.result.success) {
      const content = res.result.content;
      
      // 解析章节
      chapters.value = parseChapters(content);
      totalChapters.value = chapters.value.length;
      
      // 显示第一章
      loadChapter(1);
    }
  } catch (error) {
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    });
  } finally {
    uni.hideLoading();
  }
}

// 加载指定章节
function loadChapter(chapterNum) {
  if (chapterNum < 1 || chapterNum > totalChapters.value) return;
  
  currentChapterNum.value = chapterNum;
  currentChapter.value = chapters.value[chapterNum - 1];
  scrollTop.value = 0; // 重置滚动位置
  
  // 保存阅读进度
  saveReadingProgress();
}

// 上一章
function prevChapter() {
  loadChapter(currentChapterNum.value - 1);
}

// 下一章
function nextChapter() {
  loadChapter(currentChapterNum.value + 1);
}

// 保存阅读进度
function saveReadingProgress() {
  uni.setStorageSync(`reading_progress_${props.bookId}`, {
    chapterNum: currentChapterNum.value,
    timestamp: Date.now()
  });
}

onMounted(() => {
  loadBook();
});
</script>

<style scoped>
.reader-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.reader-header {
  padding: 20rpx 30rpx;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.book-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.chapter-title {
  font-size: 28rpx;
  color: #666;
}

.reader-content {
  flex: 1;
  padding: 30rpx;
  background: #fff;
}

.content-text {
  font-size: 32rpx;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.reader-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: #fff;
  border-top: 1px solid #eee;
}

.chapter-info {
  font-size: 28rpx;
  color: #666;
}
</style>
```

### 4.4 详情页跳转修改

```vue
<!-- src/pages/detail/detail.vue -->
<template>
  <view class="detail-container">
    <!-- 现有内容 -->
    
    <!-- 修改阅读按钮 -->
    <button 
      v-if="bookDetail.onlineReadable" 
      @tap="openReader"
      class="read-button"
    >
      在线阅读
    </button>
    
    <button 
      v-else
      @tap="openExternalLink"
      class="read-button"
    >
      打开外部阅读
    </button>
  </view>
</template>

<script setup>
function openReader() {
  uni.navigateTo({
    url: `/pages/reader/reader?bookId=${bookDetail.id}`
  });
}

function openExternalLink() {
  // 原有的外链逻辑
  copyReadUrlToClipboard(bookDetail.readUrl);
}
</script>
```

## 五、数据迁移步骤

### 5.1 上传 txt 文件到云存储

1. 在 HBuilderX 中打开 uniCloud 控制台
2. 选择云存储 → 上传文件
3. 创建 `books` 目录
4. 批量上传 `d:\work\Web\xiaogj\books\*.txt` 文件
5. 记录每个文件的 `cloudStorageFileId`

### 5.2 生成章节索引

创建脚本 `scripts/generate-chapter-index.js`：

```javascript
const fs = require('fs');
const path = require('path');

// 解析单个文件的章节索引
function generateChapterIndex(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const chapterRegex = /第[0-9零一二三四五六七八九十百千]+章\s+[^\n]*/g;
  const chapters = [];
  let match;
  let lastIndex = 0;
  
  while ((match = chapterRegex.exec(content)) !== null) {
    if (chapters.length > 0) {
      chapters[chapters.length - 1].length = match.index - lastIndex;
    }
    
    chapters.push({
      chapter: chapters.length + 1,
      title: match[0].trim(),
      startPos: match.index,
      length: 0
    });
    
    lastIndex = match.index;
  }
  
  // 最后一章
  if (chapters.length > 0) {
    chapters[chapters.length - 1].length = content.length - lastIndex;
  }
  
  return {
    totalChapters: chapters.length,
    wordCount: content.length,
    chapterIndex: chapters
  };
}

// 批量处理
const booksDir = path.join(__dirname, '../../books');
const files = fs.readdirSync(booksDir).filter(f => f.endsWith('.txt'));

const results = {};
files.forEach(file => {
  const bookId = parseInt(file.match(/^(\d+)_/)?.[1]);
  if (bookId) {
    console.log(`Processing book ${bookId}: ${file}`);
    results[bookId] = generateChapterIndex(path.join(booksDir, file));
  }
});

// 输出结果
fs.writeFileSync(
  path.join(__dirname, '../chapter-indexes.json'),
  JSON.stringify(results, null, 2)
);

console.log('✅ 章节索引生成完成！');
```

### 5.3 更新 books.js

使用生成的章节索引更新 `src/data/books.js`，为每本书添加在线阅读字段。

## 六、性能优化建议

### 6.1 分段加载策略

对于大文件（>5MB），采用分段加载：

```javascript
// 只加载当前章节和前后各一章
async function loadChapterRange(bookId, startChapter, endChapter) {
  const book = books.find(b => b.id === bookId);
  const startPos = book.chapterIndex[startChapter - 1].startPos;
  const endPos = book.chapterIndex[endChapter - 1].startPos + 
                 book.chapterIndex[endChapter - 1].length;
  
  return await uniCloud.callFunction({
    name: 'get-book-content',
    data: {
      fileId: book.cloudStorageFileId,
      startPos,
      length: endPos - startPos
    }
  });
}
```

### 6.2 本地缓存

```javascript
// 使用 uni.setStorage 缓存已读章节
const CACHE_KEY_PREFIX = 'book_chapter_';

async function getCachedChapter(bookId, chapterNum) {
  const key = `${CACHE_KEY_PREFIX}${bookId}_${chapterNum}`;
  return uni.getStorageSync(key);
}

function setCachedChapter(bookId, chapterNum, content) {
  const key = `${CACHE_KEY_PREFIX}${bookId}_${chapterNum}`;
  uni.setStorageSync(key, content);
}
```

### 6.3 预加载机制

```javascript
// 阅读时预加载下一章
function preloadNextChapter() {
  const nextChapterNum = currentChapterNum.value + 1;
  if (nextChapterNum <= totalChapters.value) {
    loadChapterInBackground(nextChapterNum);
  }
}
```

## 七、示例：id=1 的完整数据

```javascript
{
  "id": 1,
  "title": "没钱修什么仙？？？",
  "author": "熊狼狗",
  "category": "玄幻",
  "status": "连载中",
  "chapters": "1-995章",
  "latestChapter": "第995章 终极倒翻昆仑，掌书人",
  "excerpt": "老者："你想报仇？"少年："我被强者反复侮辱，被师尊视为垃圾，我怎么可能不想报仇？"老者伸出手："把你手机给我。"少年震惊："前辈！这哪里来的百年功力？"老者微微一笑："好孩子，这是你在天庭的备用功力，以后急用的时候随用随取。"张羽冷哼一声，关掉了上面的广告。",
  "readUrl": "https://pan.quark.cn/s/bf5bff7779c4",
  "downloadUrl": "/books/1_没钱修什么仙？1-995章.txt",
  "tags": [
    { "name": "玄幻", "type": "purple" },
    { "name": "连载", "type": "blue" }
  ],
  "cover": "https://toolset.site/assets/book-1-9cec7e12.jpg",
  
  // ========== 在线阅读字段 ==========
  "onlineReadable": true,
  "cloudStorageFileId": "cloud://xxx-xxx.xxxx-xxx/books/1_没钱修什么仙？1-995章.txt",
  "totalChapters": 995,
  "wordCount": 2580000,
  "fileSize": 5242880,
  "lastUpdated": "2026-10-13",
  "chapterIndex": [
    { "chapter": 1, "title": "第1章 面试", "startPos": 150, "length": 5080 },
    { "chapter": 2, "title": "第2章 修仙", "startPos": 5230, "length": 4820 },
    { "chapter": 3, "title": "第3章 学习", "startPos": 10050, "length": 5200 }
    // ... 更多章节（可选，也可以不预存，动态解析）
  ]
}
```

## 八、后续扩展功能

1. **阅读设置**：字体大小、背景色、夜间模式
2. **书签功能**：标记重要位置
3. **搜索功能**：全文搜索关键词
4. **听书功能**：文字转语音
5. **阅读统计**：记录阅读时长、速度等
6. **离线下载**：支持下载到本地离线阅读

---

**文档版本**：v1.0  
**创建日期**：2026-10-13  
**作者**：Kiro
