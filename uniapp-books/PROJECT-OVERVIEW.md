# uniapp-books 项目结构总览

## 📂 核心目录结构

```
uniapp-books/
│
├── 📱 src/                          # 源代码
│   ├── pages/                       # 页面
│   │   ├── index/                   # 首页（书籍列表）
│   │   ├── detail/                  # 详情页
│   │   ├── reader/                  # 阅读器 ✨新增
│   │   ├── mine/                    # 我的
│   │   └── about/                   # 关于
│   │
│   ├── components/                  # 组件（7个）
│   │   ├── AppTabBar.vue
│   │   ├── FeedAd.vue
│   │   ├── InterstitialAdHost.vue
│   │   ├── ReadPromptModal.vue
│   │   ├── RewardedVideoAdHost.vue
│   │   ├── ShareAppModal.vue
│   │   └── UpdateModal.vue
│   │
│   ├── utils/                       # 工具函数（14个）
│   │   ├── books.js                 # 书籍数据管理
│   │   ├── books-loader.js          # 数据加载器 ✨新增
│   │   ├── chapter-parser.js        # 章节解析 ✨新增
│   │   ├── ad-*.js                  # 广告相关（4个）
│   │   ├── read-*.js                # 阅读相关（2个）
│   │   └── 其他工具...
│   │
│   ├── data/                        # 数据文件
│   │   ├── books.js                 # 书籍数据（9万+行）
│   │   └── meta.js
│   │
│   ├── config/                      # 配置 ✨新增
│   │   └── books-config.js          # 数据源配置
│   │
│   ├── App.vue                      # 应用入口
│   ├── main.js
│   ├── pages.json                   # 路由配置
│   └── manifest.json                # 应用配置
│
├── ☁️ uniCloud-alipay/              # 支付宝云
│   └── cloudfunctions/              # 云函数（3个）
│       ├── ad-reward-callback/
│       ├── get-book-content/        # ✨新增
│       └── get-books-file/
│
├── ☁️ uniCloud-aliyun/              # 阿里云 ✨新增
│   └── cloudfunctions/              # 云函数（2个）
│       ├── get-book-content/
│       └── get-books-data/
│
├── 📚 docs/                         # 文档（6个）
│   ├── online-reading-design.md
│   ├── online-reading-implementation.md
│   ├── QUICKSTART.md
│   ├── README-在线阅读功能.md
│   ├── books-datasource-config.md
│   └── books-datasource-quickstart.md
│
├── 🔧 scripts/                      # 脚本工具（2个）
│   ├── generate-chapter-index.js
│   └── export-books-json.js
│
├── 📦 dist/                         # 构建输出
├── 📦 unpackage/                    # 临时文件
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 主要功能模块

### 1️⃣ 书籍展示模块
- **首页** (`pages/index/`) - 书籍列表、搜索
- **详情页** (`pages/detail/`) - 书籍详情、阅读入口

### 2️⃣ 在线阅读模块 ✨新增
- **阅读器** (`pages/reader/`) - 章节阅读
- **章节解析** (`utils/chapter-parser.js`) - 解析txt章节
- **云函数** (`get-book-content`) - 获取书籍内容

### 3️⃣ 数据管理模块 ✨新增
- **配置文件** (`config/books-config.js`) - 数据源配置
- **加载器** (`utils/books-loader.js`) - 统一数据加载
- **本地数据** (`data/books.js`) - 9万+行书籍数据
- **云端数据** (云存储/云函数) - 动态数据

### 4️⃣ 广告模块
- **配置** (`utils/ad-config.js`) - 广告开关
- **策略** (`utils/ad-policy.js`) - 广告逻辑
- **组件** (`components/*Ad*.vue`) - 广告组件
- **云函数** (`ad-reward-callback`) - 广告回调

### 5️⃣ 工具模块
- 应用更新
- 分享功能
- 版本管理
- 阅读链接处理

## 📊 项目数据

| 项目 | 数量/大小 |
|------|-----------|
| 总文件数 | ~160+ 个 |
| Vue 组件 | 14 个 |
| JS 文件 | 47+ 个 |
| 云函数 | 5 个 |
| 文档 | 8 个 |
| 最大文件 | books.js (94,353 行) |
| 书籍数量 | ~47,000 本 |

## 🆕 最近新增（2026-10-13）

### 核心功能
✅ **在线阅读功能**
- 阅读器页面 (`pages/reader/reader.vue`)
- 章节解析工具 (`utils/chapter-parser.js`)
- 云函数支持 (`get-book-content`)

✅ **数据源配置**
- 配置文件 (`config/books-config.js`)
- 数据加载器 (`utils/books-loader.js`)
- 本地/云端切换支持

✅ **完整文档**
- 在线阅读设计文档
- 数据源配置指南
- 快速开始指南

### 文件变更
- 新增 6 个核心文件
- 修改 3 个现有文件
- 新增 6 个文档

## 🔑 关键文件

### 配置文件
- `pages.json` - 页面路由配置
- `manifest.json` - 应用配置
- `config/books-config.js` - 数据源配置 ✨
- `utils/ad-config.js` - 广告配置

### 核心功能文件
- `data/books.js` - 书籍数据（9万+行）
- `utils/books.js` - 书籍管理工具
- `utils/books-loader.js` - 数据加载器 ✨
- `utils/chapter-parser.js` - 章节解析 ✨

### 页面文件
- `pages/index/index.vue` - 首页
- `pages/detail/detail.vue` - 详情页
- `pages/reader/reader.vue` - 阅读器 ✨

## 📝 文档索引

| 文档 | 用途 | 阅读时间 |
|------|------|---------|
| `PROJECT-STRUCTURE.md` | 项目结构详解 | 5分钟 |
| `docs/QUICKSTART.md` | 在线阅读快速开始 | 10分钟 |
| `docs/books-datasource-quickstart.md` | 数据源配置快速指南 | 5分钟 |
| `docs/online-reading-design.md` | 在线阅读技术设计 | 15分钟 |
| `docs/books-datasource-config.md` | 数据源完整配置 | 10分钟 |

## 🚀 快速导航

### 我想...

**查看在线阅读功能实现**
→ `docs/QUICKSTART.md`

**配置数据源（本地/云端）**
→ `docs/books-datasource-quickstart.md`

**了解项目完整结构**
→ `PROJECT-STRUCTURE.md`

**修改广告配置**
→ `src/utils/ad-config.js`

**添加/修改书籍数据**
→ `src/data/books.js`

**修改页面路由**
→ `src/pages.json`

## 💡 开发建议

### 本地开发
```javascript
// src/config/books-config.js
dataSource: 'local'  // 使用本地数据，快速开发
```

### 生产环境
```javascript
// src/config/books-config.js
dataSource: 'cloud'  // 使用云端数据，支持热更新
```

### 环境自动切换
```javascript
const isProd = process.env.NODE_ENV === 'production';
dataSource: isProd ? 'cloud' : 'local'
```

## 🔗 相关链接

- 项目根目录：`d:\work\Web\xiaogj\uniapp-books\`
- 源代码：`src/`
- 文档：`docs/`
- 云函数：`uniCloud-aliyun/` 或 `uniCloud-alipay/`

---

**文档生成时间**: 2026-10-13  
**项目状态**: 🟢 活跃开发  
**主要功能**: 小说阅读 App
