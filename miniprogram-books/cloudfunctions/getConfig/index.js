const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

/**
 * 线上开关：是否显示「开始阅读」按钮（在线阅读入口）
 *
 * 环境变量（云开发控制台 → 云函数 → getConfig → 配置 → 环境变量）：
 *   START_READ  是否显示在线阅读按钮
 *   取值：1/true/yes/on 显示，0/false/no/off 隐藏；未设置时默认显示。
 */
const KEY = 'START_READ';
const DEFAULT_VALUE = true;

/** 环境变量值 → 布尔；未配置/无法识别返回 null */
function toBool(v) {
  if (v === undefined || v === null || v === '') return null;
  const s = String(v).trim().toLowerCase();
  if (['1', 'true', 'yes', 'y', 'on'].indexOf(s) >= 0) return true;
  if (['0', 'false', 'no', 'n', 'off'].indexOf(s) >= 0) return false;
  return null;
}

exports.main = async () => {
  const raw = process.env[KEY] === undefined ? null : process.env[KEY];
  const value = toBool(raw);
  return {
    ok: true,
    startRead: value === null ? DEFAULT_VALUE : value,
    // 环境变量原始值（null = 未配置），便于排查
    raw,
  };
};
