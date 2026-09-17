# uniapp-books · 数维探索

基于 uni-app（Vue 3 + Vite）的书单小程序 / H5，功能与 `miniprogram-books` 原生微信小程序版一致。

## 开发

```bash
cd uniapp-books
npm install
npm run sync:data    # 从 booksData.js 同步书籍数据
npm run dev:mp-weixin   # 微信小程序
npm run dev:h5          # H5
```

用微信开发者工具打开 `dist/dev/mp-weixin` 目录预览小程序。

## 构建

```bash
npm run build:mp-weixin
npm run build:h5
```

## 数据同步

`npm run sync:data` 会执行 `csdn/scripts/sync-miniprogram-books-data.js`，同时更新：

- `miniprogram-books/data/`
- `uniapp-books/src/data/`

## 自动升级

### 版本号存在哪里？

线上版本清单是一个 **JSON 文件**，部署后地址为：

`https://toolset.site/app-version.json`

App 启动时会请求该文件，对比本地 `versionCode` 决定是否提示更新。

### 发布新版本流程

1. 在 `src/manifest.json` 提高 `versionCode`（整数，必须递增）和 `versionName`
2. 编辑 `uniapp-books/app-version.json`，填写 `changelog`、`android.wgtUrl` / `apkUrl` 等
3. 运行 `npm run sync:version`（从 manifest 同步版本号到 JSON）
4. 打包 App，在 GitHub 创建 Release 并上传安装包（见下方）
5. 运行 `npm run sync:version`，网站 deploy 后 `app-version.json` 生效

### APK 放在 GitHub Releases

安装包不上传到 `toolset.site`，而是放在仓库 **GitHub Releases**：

| 资源 | 固定文件名 | 下载地址 |
|---|---|---|
| Android APK | `shuweitansuo.apk` | `https://github.com/zhanghenxiao/toolset/releases/latest/download/shuweitansuo.apk` |
| wgt 热更新包 | `shuweitansuo.wgt` | `https://github.com/zhanghenxiao/toolset/releases/latest/download/shuweitansuo.wgt` |

**发版步骤：**

1. HBuilderX / 云打包生成 `.apk`（可选 `.wgt`）
2. 打开 [GitHub Releases](https://github.com/zhanghenxiao/toolset/releases) → **Draft a new release**
3. Tag 填 `v1.0.1`（与 `versionName` 对应），上传 `shuweitansuo.apk`（及 `shuweitansuo.wgt`）
4. 发布 Release（`latest` 会自动指向最新版）
5. 本地提高 `manifest.json` 的 `versionCode`，更新 `changelog`，执行 `npm run sync:version` 并 deploy 网站

> 版本判断仍靠 `https://toolset.site/app-version.json` 里的 `versionCode`；APK 只负责下载，URL 可保持不变（`releases/latest/download/...`）。

### 各端升级方式

| 端 | 机制 |
|---|---|
| **App (Android/iOS)** | 拉取 `app-version.json`，支持 wgt 热更新或整包下载 |
| **微信小程序** | 微信 `UpdateManager` 自动检测后台发布的新版 |
| **H5** | 浏览器刷新即可（无安装包） |

### 版本 JSON 示例

```json
{
  "versionName": "1.0.1",
  "versionCode": 101,
  "forceUpdate": false,
  "changelog": "修复详情页复制链接",
  "android": {
    "wgtUrl": "https://github.com/zhanghenxiao/toolset/releases/latest/download/shuweitansuo.wgt",
    "apkUrl": "https://github.com/zhanghenxiao/toolset/releases/latest/download/shuweitansuo.apk"
  },
  "ios": {
    "wgtUrl": "",
    "storeUrl": "https://apps.apple.com/..."
  }
}
```

代码入口：`src/utils/app-update.js`，在 `App.vue` 的 `onLaunch` 中自动调用。
