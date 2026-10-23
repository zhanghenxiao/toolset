/**
 * 网盘 Cookie 配置（服务端解析用）
 *
 * 读取优先级（高 -> 低）：
 *   1. 云数据库 app_config 集合中 key = 'netdisk' 的文档（改库即生效，无需重新部署）
 *   2. 云函数环境变量：QUARK_COOKIE / BAIDU_COOKIE
 *   3. 本文件默认值（留空表示未配置，解析会报错提示）
 *
 * 数据库文档示例：
 *   { "key": "netdisk", "quarkCookie": "...", "baiduCookie": "..." }
 *
 * 获取方式：浏览器登录对应网盘网页版，从开发者工具 Network 请求头复制 Cookie 字段。
 * Cookie 会过期，推荐用云数据库管理，过期后在控制台改文档即可。
 */
module.exports = {
  quarkCookie: process.env.QUARK_COOKIE || '',
  baiduCookie: process.env.BAIDU_COOKIE || '',
};
