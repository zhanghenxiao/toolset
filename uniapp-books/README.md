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

### 发布新版本流程（蒲公英 + 自动安装）

1. HBuilderX 云打包生成 `.apk`，上传到 [蒲公英](https://www.pgyer.com)（应用短链如 `shuweitansuo`）
2. 写入 `uniapp-books/app-version.json` 的 `android.apkUrl`：
   - **推荐**：`https://www.pgyer.com/app/install/{appKey}`（始终指向最新版，App 内可直装）
   - 运行 `node csdn/scripts/fetch-pgyer-url.js` 可从短链页解析出 `appKey` 与推荐 URL
   - 若只有 `https://www.pgyer.com/shuweitansuo` 页面链接，App 会 **自动用浏览器打开**（无法应用内直装）
3. 提高 `src/manifest.json` 的 `versionCode`（必须递增）和 `versionName`
4. 更新 `changelog`，执行 `npm run sync:version`，再 **deploy 网站**（发布 `toolset.site/app-version.json`）
5. 重新打正式包并上架蒲公英（用户旧包靠 `versionCode` 检测更新）

> **是否更新**只看线上 `versionCode`。蒲公英同一条短链可一直用，每次上传会指向最新包；**应用内自动安装**建议配置 **APK 直链**。

### Android 应用内更新

| 配置 | 说明 |
|---|---|
| `android.apkUrl` | 蒲公英 `/app/install/{appKey}` 或 APK 直链 |
| `android.inAppInstall` | 默认 `true`：直链时 App 内下载并调起系统安装界面 |
| `android.wgtUrl` | 若填写则优先 wgt 热更新（与整包二选一） |

需使用 **正式签名包** 重新打包（已加 `REQUEST_INSTALL_PACKAGES` 等权限）。安装时系统会弹出「是否安装」确认。

### 各端升级方式

| 端 | 机制 |
|---|---|
| **App (Android)** | `versionCode` 对比 + 应用内下载 APK / 或浏览器打开蒲公英 |
| **App (iOS)** | 需配置 `ios.storeUrl` |
| **微信小程序** | `UpdateManager` |
| **H5** | 刷新页面 |

### 版本 JSON 示例

```json
{
  "versionName": "1.0.3",
  "versionCode": 103,
  "forceUpdate": false,
  "changelog": "优化下载速度",
  "android": {
    "wgtUrl": "",
    "apkUrl": "https://www.pgyer.com/app/install/1dca523929765886e8d66bdccd20d8de",
    "inAppInstall": true
  }
}
```

代码入口：`src/utils/app-update.js`；首页右上角版本号可手动触发检查。
