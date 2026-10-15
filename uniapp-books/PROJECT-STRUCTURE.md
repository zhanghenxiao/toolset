# uniapp-books 项目结构

生成时间：2026-10-13

## 📁 项目根目录

```
uniapp-books/
├── 📂 dist/                       # 编译输出目录
│   ├── dev/                       # 开发环境构建
│   └── build/                     # 生产环境构建
│
├── 📂 docs/                       # 项目文档
│   ├── online-reading-design.md           # 在线阅读功能设计文档
│   ├── online-reading-implementation.md   # 在线阅读功能实施指南
│   ├── QUICKSTART.md                      # 快速开始指南
│   ├── README-在线阅读功能.md             # 在线阅读功能总结
│   ├── books-datasource-config.md         # 数据源配置详细文档
│   └── books-datasource-quickstart.md     # 数据源配置快速指南
│
├── 📂 scripts/                    # 脚本工具
│   ├── generate-chapter-index.js  # 生成章节索引脚本
│   └── export-books-json.js       # 导出 books.json 脚本
│
├── 📂 src/                        # 源代码目录
│   ├── 📂 components/             # 公共组件
│   │   ├── AppTabBar.vue          # 底部标签栏
│   │   ├── FeedAd.vue             # 信息流广告
│   │   ├── InterstitialAdHost.vue # 插屏广告宿主
│   │   ├── ReadPromptModal.vue    # 阅读提示弹窗
│   │   ├── RewardedVideoAdHost.vue # 激励视频广告宿主
│   │   ├── ShareAppModal.vue      # 分享弹窗
│   │   └── UpdateModal.vue        # 更新提示弹窗
│   │
│   ├── 📂 data/                   # 数据文件
│   │   ├── books.js               # 书籍数据（9万+行）
│   │   ├── books.json             # 书籍数据JSON格式（生成）
│   │   └── meta.js                # 元数据
│   │
│   ├── 📂 pages/                  # 页面目录
│   │   ├── 📂 index/              # 首页
│   │   │   ├── index.vue
│   │   │   └── index.scss
│   │   ├── 📂 detail/             # 详情页
│   │   │   ├── detail.vue
│   │   │   ├── detail.scss
│   │   │   └── jili.vue           # 激励视频测试页
│   │   ├── 📂 reader/             # 阅读器页面 ✨新增
│   │   │   └── reader.vue
│   │   ├── 📂 mine/               # 我的页面
│   │   │   ├── mine.vue
│   │   │   └── mine.scss
│   │   └── 📂 about/              # 关于页面
│   │       └── about.vue
│   │
│   ├── 📂 utils/                  # 工具函数
│   │   ├── ad-config.js           # 广告配置
│   │   ├── ad-guard.js            # 广告守卫
│   │   ├── ad-policy.js           # 广告策略
│   │   ├── app-update.js          # 应用更新
│   │   ├── app-version.js         # 版本管理
│   │   ├── books.js               # 书籍数据工具
│   │   ├── books-loader.js        # 书籍数据加载器 ✨新增
│   │   ├── chapter-parser.js      # 章节解析工具 ✨新增
│   │   ├── config.js              # 全局配置
│   │   ├── interstitial-ad.js     # 插屏广告
│   │   ├── read-prompt.js         # 阅读提示
│   │   ├── read-url.js            # 阅读链接处理
│   │   ├── rewarded-video-ad.js   # 激励视频广告
│   │   ├── share-app.js           # 分享功能
│   │   └── update-prompt.js       # 更新提示
│   │
│   ├── 📂 config/                 # 配置文件 ✨新增
│   │   └── books-config.js        # 书籍数据源配置
│   │
│   ├── 📂 uni_modules/            # uni-app 插件
│   │   └── uni-upgrade-center-app/
│   │
│   ├── App.vue                    # 应用入口组件
│   ├── main.js                    # 应用入口文件
│   ├── manifest.json              # 应用配置清单
│   └── pages.json                 # 页面路由配置
│
├── 📂 uniCloud-alipay/            # uniCloud 云端（支付宝云）
│   ├── 📂 cloudfunctions/         # 云函数
│   │   ├── 📂 ad-reward-callback/ # 广告回调
│   │   │   ├── index.js
│   │   │   └── package.json
│   │   ├── 📂 get-book-content/   # 获取书籍内容 ✨新增
│   │   │   ├── index.js
│   │   │   └── package.json
│   │   ├── 📂 get-books-data/     # 获取书籍数据 ✨新增
│   │   │   ├── index.js
│   │   │   └── package.json
│   │   └── 📂 get-books-file/     # 获取书籍文件
│   │       ├── index.js
│   │       └── package.json
│   ├── 📂 database/               # 数据库
│   └── README.md
│
├── 📂 uniCloud-aliyun/            # uniCloud 云端（阿里云）✨新增
│   └── 📂 cloudfunctions/
│       ├── get-book-content/
│       └── get-books-data/
│
├── 📂 unpackage/                  # 临时文件目录
│
├── app-version.json               # 应用版本配置
├── index.html                     # HTML 入口
├── package.json                   # npm 依赖配置
├── package-lock.json              # npm 依赖锁定
├── README.md                      # 项目说明
├── uni.scss                       # 全局样式变量
└── vite.config.js                 # Vite 构建配置
```

## 📊 项目统计

- **总文件数**: ~160+ 个文件
- **代码文件**: 
  - `.vue` 文件: 14 个
  - `.js` 文件: 47+ 个
  - `.json` 文件: 14 个
  - `.md` 文档: 8 个
- **最大文件**: `src/data/books.js` (94,353 行)

## 🎯 核心功能模块

### 1. 首页模块 (`pages/index/`)
- 书籍列表展示
- 搜索功能
- 广告展示

### 2. 详情页模块 (`pages/detail/`)
- 书籍详情展示
- 在线阅读入口 ✨
- 外部链接阅读
- 分享功能

### 3. 阅读器模块 (`pages/reader/`) ✨新增
- 在线阅读功能
- 章节切换
- 阅读设置
- 进度保存

### 4. 广告模块 (`utils/ad-*.js`)
- 激励视频广告
- 插屏广告
- 信息流广告
- 广告策略管理

### 5. 数据管理模块 ✨新增
- 本地数据源 (`data/books.js`)
- 云端数据源 (`uniCloud`)
- 数据加载器 (`utils/books-loader.js`)
- 数据源配置 (`config/books-config.js`)

### 6. 云函数模块 (`uniCloud-alipay/cloudfunctions/`)
- `ad-reward-callback` - 广告回调处理
- `get-book-content` - 获取书籍内容 ✨
- `get-books-data` - 获取书籍列表 ✨
- `get-books-file` - 获取书籍文件

## 🆕 最近更新（2026-10-13）

### 新增功能
1. **在线阅读功能**
   - 阅读器页面
   - 章节解析工具
   - 云函数支持

2. **数据源配置**
   - 本地/云端数据源切换
   - 数据加载器
   - 缓存机制

3. **文档完善**
   - 在线阅读设计文档
   - 数据源配置指南
   - 快速开始指南

### 修改文件
- `src/pages.json` - 添加阅读器路由
- `src/pages/detail/detail.vue` - 添加在线阅读按钮
- `src/data/books.js` - 扩展数据结构（示例）

## 🔧 技术栈

- **框架**: uni-app (Vue 3)
- **构建工具**: Vite
- **云服务**: uniCloud (阿里云/支付宝云)
- **广告**: uni-ad 广告联盟
- **存储**: 本地存储 + 云存储

## 📝 重要配置文件

| 文件 | 说明 |
|------|------|
| `manifest.json` | 应用配置（appid、权限等） |
| `pages.json` | 页面路由和窗口配置 |
| `vite.config.js` | Vite 构建配置 |
| `src/config/books-config.js` | 数据源配置 ✨ |
| `src/utils/ad-config.js` | 广告配置 |
| `app-version.json` | 版本管理 |

## 🚀 快速开始

### 开发环境运行
```bash
# 安装依赖
npm install

# 运行到浏览器
npm run dev:h5

# 运行到微信小程序
npm run dev:mp-weixin

# 运行到 App
npm run dev:app
```

### 构建生产版本
```bash
# 构建 H5
npm run build:h5

# 构建小程序
npm run build:mp-weixin

# 构建 App
npm run build:app
```

## 📚 相关文档

- [在线阅读功能快速开始](docs/QUICKSTART.md)
- [在线阅读功能设计](docs/online-reading-design.md)
- [数据源配置快速指南](docs/books-datasource-quickstart.md)
- [数据源配置详细文档](docs/books-datasource-config.md)

## 🔗 目录跳转

- [首页代码](src/pages/index/)
- [详情页代码](src/pages/detail/)
- [阅读器代码](src/pages/reader/)
- [工具函数](src/utils/)
- [云函数](uniCloud-alipay/cloudfunctions/)
- [文档目录](docs/)

---

**项目维护者**: xiaogj  
**最后更新**: 2026-10-13  
**项目状态**: 🟢 活跃开发中
