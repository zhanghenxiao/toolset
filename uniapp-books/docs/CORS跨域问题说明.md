# CORS 跨域问题说明

## 🔍 问题描述

在 H5 环境下点击"在线阅读"时，控制台报错：
```
Invalid CORS request
```

## 📋 原因分析

### 什么是 CORS？

CORS（Cross-Origin Resource Sharing，跨域资源共享）是浏览器的安全策略。

**同源策略**要求：
- 协议相同（http/https）
- 域名相同
- 端口相同

### 为什么会报错？

```
你的 H5 网站：http://localhost:8080
夸克 API：    https://drive-pc.quark.cn

❌ 协议不同、域名不同 → 浏览器阻止请求
```

浏览器检测到跨域请求，且服务器（夸克）没有设置允许跨域的响应头，因此阻止了请求。

### 为什么小程序和 App 不受影响？

| 环境 | 是否受 CORS 限制 | 原因 |
|------|----------------|------|
| H5 浏览器 | ✅ 是 | 浏览器强制执行同源策略 |
| 微信小程序 | ❌ 否 | 小程序环境不受浏览器 CORS 限制 |
| App | ❌ 否 | 原生环境，没有浏览器安全策略 |

## ✅ 当前解决方案

### 方案：环境检测 + 友好提示

在 `src/pages/reader/reader.vue` 中添加条件编译：

```javascript
// #ifdef H5
// H5 环境下由于 CORS 限制，无法直接调用网盘 API
throw new Error('H5 版本暂不支持在线阅读，请使用小程序或 App 版本');
// #endif

// #ifndef H5
// 仅在 App/小程序中执行网盘解析
const { parseNetdiskUrl } = await import('@/utils/pan-parser.js');
// ...
// #endif
```

### 效果

- ✅ **H5 环境**：提示用户使用小程序/App
- ✅ **小程序环境**：正常调用网盘 API
- ✅ **App 环境**：正常调用网盘 API

## 🔧 其他可选方案

### 方案 1：自建代理服务器（推荐用于生产环境）

在你自己的服务器上搭建代理：

```
H5 前端 → 你的服务器 → 夸克 API
         （同域）     （服务器不受 CORS 限制）
```

**实现步骤**：

1. 创建代理接口 `https://toolset.site/api/quark-proxy`
2. 服务器端调用夸克 API
3. 返回结果给前端

**Node.js 示例**：

```javascript
// server.js
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// 允许跨域
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// 代理接口
app.post('/api/quark-proxy', async (req, res) => {
  try {
    const { url, method, data, headers } = req.body;
    
    const response = await axios({
      url,
      method,
      data,
      headers: {
        ...headers,
        'Cookie': process.env.QUARK_COOKIE // 从环境变量读取
      }
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

**前端调用**：

```javascript
// src/utils/pan-parser.js
// #ifdef H5
// H5 环境使用代理
const proxyUrl = 'https://toolset.site/api/quark-proxy';
const response = await uni.request({
  url: proxyUrl,
  method: 'POST',
  data: {
    url: 'https://drive-pc.quark.cn/1/clouddrive/share/sharepage/detail',
    method: 'GET',
    data: { pwd_id: shareId, ... }
  }
});
// #endif

// #ifndef H5
// 小程序/App 直接调用
const response = await uni.request({
  url: 'https://drive-pc.quark.cn/1/clouddrive/share/sharepage/detail',
  ...
});
// #endif
```

### 方案 2：浏览器插件关闭 CORS（仅开发调试）

**⚠️ 警告**：仅用于本地开发测试，不能用于生产环境！

**Chrome**：
```bash
# Windows
chrome.exe --disable-web-security --user-data-dir="C:/ChromeDevSession"

# Mac
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev" --disable-web-security
```

**Firefox**：
安装插件 [CORS Everywhere](https://addons.mozilla.org/zh-CN/firefox/addon/cors-everywhere/)

### 方案 3：Nginx 反向代理

如果你有自己的服务器，配置 Nginx：

```nginx
server {
  listen 80;
  server_name your-domain.com;
  
  # 静态资源
  location / {
    root /var/www/html;
    try_files $uri $uri/ /index.html;
  }
  
  # 代理夸克 API
  location /api/quark/ {
    rewrite ^/api/quark/(.*) /1/clouddrive/share/sharepage/$1 break;
    
    proxy_pass https://drive-pc.quark.cn;
    proxy_set_header Cookie $http_x_quark_cookie;
    
    # 允许跨域
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods 'GET, POST';
  }
}
```

前端调用：
```javascript
const response = await uni.request({
  url: '/api/quark/detail', // 自动走 Nginx 代理
  method: 'GET',
  header: {
    'X-Quark-Cookie': quarkCookie // 自定义请求头传递 Cookie
  }
});
```

## 📊 方案对比

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|---------|
| **环境检测**（当前） | 简单，无需额外开发 | H5 无法使用在线阅读 | 小程序为主，H5 为辅 |
| **代理服务器** | H5 可用，安全可控 | 需要自己的服务器 | 生产环境，H5 用户多 |
| **Nginx 反向代理** | 高性能，配置简单 | 需要运维能力 | 有服务器，流量大 |
| **关闭 CORS** | 立即可用 | 仅开发环境 | 本地调试 |

## 🎯 推荐方案

### 短期方案（当前实现）
使用环境检测，H5 提示用户使用小程序/App。

**优势**：
- 无需额外开发
- 小程序和 App 体验更好
- 引导用户安装小程序

### 长期方案
如果 H5 用户量大，建议搭建代理服务器：

1. 用 Vercel/Netlify 等平台快速部署代理函数（免费）
2. 或使用你现有的服务器添加代理接口
3. 前端根据环境选择直连或代理

## 📝 相关资源

- [MDN: CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)
- [uniapp 条件编译](https://uniapp.dcloud.net.cn/tutorial/platform.html)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)

## ✨ 总结

CORS 是浏览器的安全机制，不是 bug。

**当前状态**：
- ✅ 小程序和 App 正常使用在线阅读
- ⚠️ H5 暂不支持，提示用户使用小程序/App
- 🚀 未来可通过代理服务器支持 H5 在线阅读

需要支持 H5 在线阅读时，告诉我，我帮你搭建代理服务。
