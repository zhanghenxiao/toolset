# uniCloud · 激励视频服务器回调

本目录为 **支付宝云 uniCloud** 配置（`uniCloud-alipay`），配合 App 端 uni-ad 激励视频使用。

## 回调链路

```
客户端 ad-rewarded-video (url-callback)
  → 广告商服务器
  → uniCloud 自动云函数 uniAdCallback
  → 你的云函数 ad-reward-callback
  → 写入 ad_reward_record
  → 返回 { "isValid": true }
```

**客户端能播放广告 ≠ 服务器回调成功。** 必须按下面步骤逐项确认。

## 部署检查清单

1. HBuilderX 右键 `uniCloud-alipay` → **关联云服务空间**（与 uni-ad 控制台里选的空间 **完全一致**）
2. 上传部署 `cloudfunctions/ad-reward-callback`
3. 上传 `database/ad_reward_record.schema.json`
4. `config.js` 中 `AD_SECRETS['1410188432']` 与 uni-ad 控制台该广告位的 **secret 完全一致**
5. [uni-ad 控制台](https://uniad.dcloud.net.cn/) → 广告位 `1410188432` → **开启激励视频服务器回调**：
   - 类型：**业务在 uniCloud**
   - 云函数：**ad-reward-callback**（不能叫 uniAdCallback）
6. 客户端 `ad-config.js` 中 `AD_REWARD_PID` 与控制台广告位一致
7. 客户端 `AD_REWARD_ENABLE_URL_CALLBACK = true`
8. **完整看完**一条激励视频后关闭（部分素材未达奖励节点不会回调）

## 无数据库记录时怎么排查

在 [uniCloud 控制台](https://unicloud.dcloud.net.cn) 按顺序查：

| 步骤 | 查看 | 说明 |
|------|------|------|
| 1 | `uniAdCallback` 日志 | **无日志** → uni-ad 未开回调 / 客户端未传 url-callback / 广告未触发回调 |
| 2 | `ad-reward-callback` 日志 | **无日志** → uni-ad 未绑定到该云函数或空间不一致 |
| 3 | 日志 `invalid sign` | secret 与广告位不匹配 |
| 4 | 日志 `secret not configured` | `config.js` 未配置对应 adpid |
| 5 | 日志 `save failed` | 未上传 DB Schema 或字段校验失败 |
| 6 | 日志 `saved` + 仍无数据 | 查错服务空间或错集合名 |

## 手动测试云函数

在 uniCloud 控制台 → `ad-reward-callback` → 云端测试，传入：

```json
{ "action": "ping" }
```

应返回 `{ "isValid": true, "msg": "pong" }`。

## 返回约定

| 入口 | 成功响应 |
|------|---------|
| uniAdCallback callFunction | `{ "isValid": true }` |
| HTTP URL 化（老版） | `{ "code": 0, "msg": "success" }` |

验签失败必须返回 `{ "isValid": false }`，否则广告商会重复回调。
