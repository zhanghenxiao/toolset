# 快速配置指南

## 获取夸克网盘 Cookie

### 步骤 1：登录夸克网盘

打开浏览器访问 https://pan.quark.cn 并登录你的账号。

### 步骤 2：打开开发者工具

- Windows/Linux: 按 `F12` 或 `Ctrl+Shift+I`
- Mac: 按 `Cmd+Option+I`

### 步骤 3：切换到 Network 标签

![开发者工具](https://via.placeholder.com/800x400?text=Network+Tab)

### 步骤 4：刷新页面

按 `F5` 或点击浏览器刷新按钮。

### 步骤 5：找到请求

在 Network 列表中找到任意一个请求（建议找 `detail` 或 `list` 开头的）。

### 步骤 6：复制 Cookie

1. 点击该请求
2. 在右侧找到 **Request Headers**
3. 找到 `Cookie:` 字段
4. 右键点击 Cookie 值 → 复制全部内容

Cookie 示例（已脱敏）：
```
__puus=xxx; __pus=xxx; _UP_xxx=xxx; ...
```

### 步骤 7：配置到云函数

1. 登录 uniCloud 控制台
2. 进入 **云函数** → **get-book-content**
3. 点击 **配置** 标签
4. 在 **环境变量** 中添加：
   - 变量名：`QUARK_COOKIE`
   - 变量值：粘贴刚才复制的 Cookie
5. 保存并重启云函数

---

## 获取百度网盘 Cookie

### 步骤 1：登录百度网盘

访问 https://pan.baidu.com 并登录。

### 步骤 2：打开开发者工具

同上，按 `F12`。

### 步骤 3：切换到 Network 标签

### 步骤 4：刷新页面

### 步骤 5：找到请求

找到任意一个 `pan.baidu.com` 的请求。

### 步骤 6：复制 Cookie

在 Request Headers 中找到 `Cookie` 字段并复制。

关键字段包括：
- `BDUSS`
- `STOKEN`
- `BAIDUID`

### 步骤 7：配置到云函数

在环境变量中添加：
- 变量名：`BAIDU_COOKIE`
- 变量值：完整的 Cookie 字符串

---

## 验证配置

### 在云函数控制台测试

1. 进入云函数详情页
2. 点击 **云端测试**
3. 输入测试参数：

**测试夸克网盘**：
```json
{
  "readUrl": "https://pan.quark.cn/s/bf5bff7779c4"
}
```

**测试百度网盘**：
```json
{
  "readUrl": "https://pan.baidu.com/s/1abc123",
  "password": "xyz7"
}
```

4. 点击运行，查看返回结果

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "url": "https://xxx.com/download/file.txt",
    "filename": "book.txt",
    "expires": 3600
  }
}
```

### 失败响应示例

```json
{
  "success": false,
  "errCode": "MISSING_COOKIE",
  "errMsg": "未配置夸克网盘 Cookie"
}
```

---

## 常见错误

### 错误 1：MISSING_COOKIE

**原因**：未配置 Cookie 环境变量

**解决**：按照上述步骤配置 `QUARK_COOKIE` 或 `BAIDU_COOKIE`

### 错误 2：Cookie 认证失败

**原因**：Cookie 过期或格式错误

**解决**：
1. 重新获取最新的 Cookie
2. 确保复制了完整的 Cookie 字符串
3. 检查是否包含关键字段（如 `__puus`、`BDUSS`）

### 错误 3：SHARE_NOT_FOUND

**原因**：分享链接失效或提取码错误

**解决**：
1. 检查分享链接是否有效
2. 验证提取码是否正确
3. 确认分享未被取消

### 错误 4：NO_DOWNLOAD_URL

**原因**：无法生成下载直链

**解决**：
1. 检查文件是否支持直接下载
2. 尝试在网盘网页版手动下载该文件
3. 如果网页版也无法下载，可能是文件限制

---

## Cookie 维护

### 更新频率

建议每 **1-2 周** 检查一次 Cookie 是否过期。

### 自动化更新（高级）

可以编写定时任务自动刷新 Cookie：

1. 使用 Puppeteer 或 Selenium 模拟登录
2. 提取最新的 Cookie
3. 通过 uniCloud API 更新环境变量

示例代码（Node.js + Puppeteer）：

```javascript
const puppeteer = require('puppeteer');

async function refreshQuarkCookie() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // 登录并获取 Cookie
  await page.goto('https://pan.quark.cn');
  // ... 登录逻辑
  
  const cookies = await page.cookies();
  const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');
  
  // 更新环境变量
  // ... 调用 uniCloud API
  
  await browser.close();
}
```

---

## 备选方案

如果不想维护 Cookie，可以使用以下方案：

### 方案 1：第三方解析服务

配置环境变量：
```
PAN_PARSE_API=https://your-parse-service.com/api
```

### 方案 2：直接使用 CDN

将书籍上传到自己的 CDN，在 `books.js` 中配置：
```javascript
{
  "downloadUrl": "https://toolset.site/books/book.txt"
}
```

### 方案 3：混合方案

- 热门书籍上传 CDN（访问快，成本可控）
- 冷门书籍使用网盘（节省存储成本）
