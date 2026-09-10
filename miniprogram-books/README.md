# 数维探索 - 微信小程序（书籍页）

与网站 `/books` 页面对应的微信小程序，展示书籍列表、筛选与详情，阅读链接指向夸克网盘分享。

## 目录结构

```
miniprogram-books/
├── app.js / app.json / app.wxss
├── data/books.js            # 书籍数据（由脚本生成）
├── data/meta.js             # 分类、标签等元数据
├── pages/index/             # 书籍列表
├── pages/detail/            # 书籍详情
└── utils/books.js           # 筛选逻辑
```

## 使用方式

1. 用 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 打开本目录 `miniprogram-books`
2. 在 `project.config.json` 中填写你的 **AppID**（测试可用游客模式）
3. 同步书籍数据（网站更新后执行）：

```bash
node csdn/scripts/sync-miniprogram-books-data.js
```

4. 在微信公众平台配置 **downloadFile 合法域名**：`https://toolset.site`（用于加载封面图）

## 功能说明

- 分类 / 标签 / 关键词筛选
- 分页浏览（每页 10 本）
- 书籍详情：简介、最新章节、复制夸克阅读链接
- 封面图使用 `toolset.site` 线上资源，无需打包进小程序包体

## 注意事项

- 小程序无法直接打开任意外链，详情页以「复制链接」为主
- `data/books.js` 需与 `csdn/src/data/booksData.js` 保持同步
- 正式发布前请将 `project.config.json` 中的 `appid` 改为正式小程序 AppID
