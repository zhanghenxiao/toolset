# 🚀 在线阅读功能 - 快速开始

## 1️⃣ 上传文件到云存储（5分钟）

### 方法一：HBuilderX 控制台上传

```bash
1. 打开 HBuilderX
2. 右键项目 → uniCloud → 打开云服务空间控制台
3. 左侧菜单选择"云存储"
4. 点击"新建目录" → 输入 "books"
5. 进入 books 目录
6. 点击"上传文件"
7. 选择 d:\work\Web\xiaogj\books\1_没钱修什么仙？1-995章.txt
8. 等待上传完成
9. 复制文件的 cloudStorageFileId（格式：cloud://env-xxx.xxx/books/1_没钱修什么仙？1-995章.txt）
```

### 方法二：使用云函数批量上传（推荐）

创建临时云函数上传（可选）：

```javascript
// uniCloud-aliyun/cloudfunctions/upload-books/index.js
'use strict';
const fs = require('fs');

exports.main = async (event, context) => {
  // 需要在云函数中上传本地文件
  // 注意：云函数无法直接访问本地文件系统
  // 建议使用 HBuilderX 控制台上传
};
```

---

## 2️⃣ 更新 books.js（2分钟）

打开 `src/data/books.js`，找到 id=1 的书籍，确认已添加字段：

```javascript
{
  "id": 1,
  "title": "没钱修什么仙？？？",
  // ... 其他字段 ...
  
  // 👇 确认这些字段已添加
  "onlineReadable": true,
  "cloudStorageFileId": "cloud://你的环境ID/books/1_没钱修什么仙？1-995章.txt", // ⚠️ 替换为实际的 fileId
  "totalChapters": 995,
  "wordCount": 2580000
}
```

⚠️ **重要**：将 `cloudStorageFileId` 替换为步骤1中获取的实际值！

---

## 3️⃣ 部署云函数（1分钟）

### HBuilderX 中操作

```bash
1. 展开 uniCloud-aliyun/cloudfunctions
2. 右键 get-book-content 文件夹
3. 选择"上传部署"
4. 等待上传完成（看到"上传成功"提示）
```

### 验证部署

```bash
1. 打开云服务空间控制台
2. 左侧菜单 → 云函数/云对象
3. 确认 get-book-content 存在且状态为"正常"
```

---

## 4️⃣ 测试功能（3分钟）

### 真机测试

```bash
1. HBuilderX 中点击"运行" → "运行到手机或模拟器"
2. 选择你的设备
3. 等待编译完成，App 自动打开
4. 在首页找到"没钱修什么仙？？？"
5. 点击进入详情页
6. 应该看到"在线阅读"按钮
7. 点击"在线阅读"
8. 等待加载（首次需要下载文件）
9. 查看章节内容
10. 测试上一章/下一章按钮
11. 测试阅读设置
```

### 功能检查清单

- [ ] 详情页显示"在线阅读"按钮
- [ ] 点击按钮成功跳转到阅读器页面
- [ ] 显示书名和章节标题
- [ ] 章节内容正确显示
- [ ] 上一章/下一章按钮正常工作
- [ ] 点击屏幕可以显示/隐藏菜单
- [ ] 阅读设置（字号+/-、背景色）正常
- [ ] 退出后重新进入，记住上次阅读位置

---

## 🔧 常见问题排查

### ❌ 问题1：看不到"在线阅读"按钮

**原因**：`onlineReadable` 字段未设置或为 `false`

**解决**：
```javascript
// 检查 src/data/books.js 中 id=1 的数据
"onlineReadable": true,  // 确保这个字段存在且为 true
```

---

### ❌ 问题2：点击按钮后显示"该书籍暂不支持在线阅读"

**原因**：同问题1

**解决**：确保 `onlineReadable: true`

---

### ❌ 问题3：显示"加载失败"或"网络错误"

**可能原因**：
1. 云函数未部署
2. `cloudStorageFileId` 错误
3. 文件未上传到云存储

**解决步骤**：
```bash
1. 检查云函数是否部署成功
2. 检查 cloudStorageFileId 是否正确
3. 检查云存储中文件是否存在
4. 查看 HBuilderX 控制台的错误日志
```

---

### ❌ 问题4：章节内容显示为空

**原因**：txt 文件章节格式不符合正则匹配

**当前支持的格式**：
- ✅ 第1章 标题
- ✅ 第一章 标题
- ✅ 第001章 标题
- ✅ 第十章 标题

**解决**：
- 检查 txt 文件中章节标题格式
- 如需支持其他格式，修改 `chapter-parser.js` 中的正则表达式

---

### ❌ 问题5：阅读进度未保存

**原因**：本地存储权限或代码逻辑问题

**解决**：
```javascript
// 检查 reader.vue 中的保存逻辑
saveReadingProgress() {
  uni.setStorageSync(`reading_progress_${this.bookInfo.id}`, {
    chapterNum: this.currentChapterNum,
    timestamp: Date.now()
  });
}
```

---

## 📱 测试用例

### 基本功能测试

| 测试项 | 操作 | 期望结果 |
|--------|------|----------|
| 进入阅读器 | 详情页点击"在线阅读" | 跳转到阅读器页面 |
| 加载内容 | 等待加载完成 | 显示第一章内容 |
| 下一章 | 点击"下一章"按钮 | 显示第二章内容 |
| 上一章 | 点击"上一章"按钮 | 显示第一章内容 |
| 菜单切换 | 点击屏幕中央 | 菜单显示/隐藏切换 |
| 字号+ | 设置→字号+ | 文字变大 |
| 字号- | 设置→字号- | 文字变小 |
| 背景色 | 设置→切换背景 | 背景色循环切换 |
| 阅读进度 | 退出→重新进入 | 记住上次章节 |

### 边界测试

| 测试项 | 操作 | 期望结果 |
|--------|------|----------|
| 第一章上一章 | 第1章点击"上一章" | 按钮禁用或提示 |
| 最后一章下一章 | 最后章点击"下一章" | 按钮禁用或提示 |
| 网络异常 | 断网后首次加载 | 提示网络错误 |
| 缓存命中 | 第二次打开 | 秒开，无需加载 |

---

## 🎉 成功标志

如果你能完成以下操作，说明功能正常：

✅ 1. 在详情页看到并点击"在线阅读"按钮  
✅ 2. 成功进入阅读器页面  
✅ 3. 看到书名、章节标题和内容  
✅ 4. 能够切换上一章/下一章  
✅ 5. 能够调整字体大小和背景色  
✅ 6. 退出后重新进入，记住阅读位置  

---

## 📊 下一步

### 为更多书籍启用在线阅读

```bash
1. 上传更多 txt 文件到云存储
2. 运行脚本生成章节索引：
   node scripts/generate-chapter-index.js
   
3. 更新对应书籍的 books.js 数据：
   {
     "id": 2,
     "onlineReadable": true,
     "cloudStorageFileId": "cloud://...",
     "totalChapters": xxx,
     "wordCount": xxx
   }
   
4. 测试新书籍的在线阅读功能
```

---

## 💡 性能优化建议

### 首次加载优化

```javascript
// 可以在详情页预加载第一章
// src/pages/detail/detail.vue
async function preloadFirstChapter() {
  if (book.value.onlineReadable) {
    // 预加载逻辑
  }
}
```

### 缓存策略

```javascript
// 当前策略：<5MB 缓存到本地
// 可以调整大小限制
if (fileSize < 10 * 1024 * 1024) { // 改为 10MB
  uni.setStorageSync(...);
}
```

---

## 📞 需要帮助？

遇到问题？检查这些地方：

1. **HBuilderX 控制台**：查看错误日志
2. **云服务空间控制台**：检查云函数日志
3. **设计文档**：`docs/online-reading-design.md`
4. **实施指南**：`docs/online-reading-implementation.md`

---

**预计完成时间**：10-15 分钟  
**难度等级**：⭐⭐☆☆☆（中等）

祝你测试顺利！🎊
