# get-book-content 云函数

解析网盘分享链接并返回直链，支持夸克网盘和百度网盘。

## 功能说明

- 将网盘分享链接（如 `https://pan.quark.cn/s/xxx`）解析为可直接下载的临时直链
- 支持带提取码的分享链接
- 客户端使用直链直接下载，不占用云函数流量

## 客户端调用示例

```javascript
const res = await uniCloud.callFunction({
  name: 'get-book-content',
  data: {
    readUrl: 'https://pan.quark.cn/s/bf5bff7779c4',
    password: '' // 可选，提取码
  }
});

if (res.result.success) {
  const directUrl = res.result.data.url;
  const filename = res.result.data.filename;
  const expires = res.result.data.expires; // 有效期（秒）
  
  // 客户端直接下载
  uni.request({
    url: directUrl,
    success: (response) => {
      console.log('下载成功', response.data);
    }
  });
}
```

## 解析方式配置

本云函数支持三种解析方式，按优先级依次尝试：

### 方式 1：第三方解析服务（推荐）

如果你有自建或第三方的网盘解析 API：

1. 在云函数环境变量中配置：
   ```
   PAN_PARSE_API=https://your-parse-service.com/api/parse
   ```

2. 解析服务接口规范：
   - 请求方法：`POST`
   - 请求体：`{ "url": "分享链接", "password": "提取码" }`
   - 响应格式：`{ "url": "直链", "filename": "文件名", "expires": 3600 }`

### 方式 2：内置解析（需要 Cookie）

**夸克网盘**：

1. 获取夸克网盘 Cookie：
   - 登录 https://pan.quark.cn
   - 打开浏览器开发者工具（F12）→ Network 标签
   - 刷新页面，找到任意请求（如 `sharepage/detail`）
   - 查看请求头中的 `Cookie` 字段
   - 复制完整的 Cookie 字符串（包含 `__puus`、`__pus` 等）

2. 在云函数环境变量中配置：
   ```
   QUARK_COOKIE=你的完整Cookie字符串
   ```

**百度网盘**：

1. 获取百度网盘 Cookie：
   - 登录 https://pan.baidu.com
   - 开发者工具（F12）→ Network 标签
   - 找到任意请求，查看 Cookie 请求头
   - 复制完整的 Cookie 字符串（包含 `BDUSS`、`STOKEN` 等）

2. 在云函数环境变量中配置：
   ```
   BAIDU_COOKIE=你的完整Cookie字符串
   ```

### 方式 3：直接使用 CDN（回退）

如果网盘解析失败，会自动回退到 `downloadUrl` 指定的 CDN 地址。

## 部署步骤

### 1. 配置环境变量

在 uniCloud 控制台配置云函数环境变量（根据需要选择）：

**第三方解析服务**：
```bash
PAN_PARSE_API=https://your-service.com/api/parse
```

**夸克网盘内置解析**：
```bash
QUARK_COOKIE=你的夸克Cookie
```

**百度网盘内置解析**：
```bash
BAIDU_COOKIE=你的百度Cookie
```

配置方法：
1. 登录 uniCloud 控制台
2. 云函数 → get-book-content → 配置
3. 环境变量 → 添加变量
4. 保存并重启云函数

### 2. 上传部署

在 HBuilderX 中：
1. 右键 `uniCloud-alipay/cloudfunctions/get-book-content`
2. 选择"上传部署"

或使用命令行：
```bash
unicloud-cli deploy --name get-book-content
```

### 3. 测试

在云函数控制台测试参数：

**夸克网盘**：
```json
{
  "readUrl": "https://pan.quark.cn/s/bf5bff7779c4"
}
```

**百度网盘（带提取码）**：
```json
{
  "readUrl": "https://pan.baidu.com/s/1abc123",
  "password": "xyz7"
}
```

## API 接口说明

### 夸克网盘 API

使用的接口：

1. **获取分享详情**：
   ```
   POST https://drive-pc.quark.cn/1/clouddrive/share/sharepage/detail
   ```

2. **获取下载直链**：
   ```
   POST https://drive-pc.quark.cn/1/clouddrive/share/sharepage/download
   ```

### 百度网盘 API

使用的接口：

1. **验证提取码**：
   ```
   POST https://pan.baidu.com/share/verify
   ```

2. **获取文件列表**：
   ```
   GET https://pan.baidu.com/share/list
   ```

3. **获取下载直链**：
   ```
   POST https://pan.baidu.com/api/sharedownload
   ```

## 注意事项

### 1. Cookie 有效期

- Cookie 会过期（通常几天到几周）
- 需要定期更新环境变量中的 Cookie
- 如果解析失败，优先检查 Cookie 是否过期

### 2. API 频率限制

- 网盘 API 可能有调用频率限制
- 建议在客户端缓存直链（在有效期内）
- 避免短时间内重复解析同一链接

### 3. 直链有效期

- 解析出的直链通常有效期 1-2 小时
- 客户端应处理直链失效的情况
- 失效后需要重新调用云函数解析

### 4. 安全性

- Cookie 是敏感信息，务必通过环境变量配置
- 不要将 Cookie 硬编码在代码中
- 不要将 Cookie 提交到版本控制

### 5. 网盘接口变化

- 网盘 API 可能随时变化
- 如果解析突然失败，可能需要更新接口地址
- 建议配置第三方解析服务作为备选

## 常见问题

### Q: 如何判断 Cookie 是否过期？

A: 在云函数日志中查看错误信息，通常会返回 401 或 403 状态码。

### Q: 可以不配置 Cookie 吗？

A: 可以，使用第三方解析服务（方式 1）或直接使用 CDN（方式 3）。

### Q: 解析失败怎么办？

A: 云函数会自动回退到 CDN 地址，确保书籍的 `downloadUrl` 字段可用。

### Q: 支持其他网盘吗？

A: 当前仅支持夸克和百度，需要其他网盘可以扩展 `isXXXUrl()` 和 `parseXXXDirectUrl()` 函数。

## 当前实现状态

- ✅ 云函数框架
- ✅ 夸克网盘解析（需要配置 Cookie）
- ✅ 百度网盘解析（需要配置 Cookie）
- ✅ 第三方解析服务支持
- ✅ CDN 回退逻辑
