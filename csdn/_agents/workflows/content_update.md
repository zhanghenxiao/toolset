---
description: 如何根据 x.md 更新项目 Mock 数据
---

# 内容更新工作流 (Content Update Workflow)

当你需要将 `src/assets/x.md` 中的内容集成到项目的 `src/data/mockData.js` 时，请遵循以下标准化步骤。

## 1. 内容解析 (Content Extraction)
- **标题 (Title)**: 从 `x.md` 的第一行或一级标题提取。
- **摘要 (Excerpt)**: 编写一段 50 字左右的简介，概括文章核心价值。
- **正文 (Markdown)**: 确保图片链接使用 CDN 地址或已同步至本地。
- **标签 (Tags)**: 根据内容分配 2-3 个标签（如 `blue` 或 `green` 类型）。

## 2. 数据重索引 (Re-indexing Strategy)
为了保持最新内容在首位，必须进行物理重排：
- **新文章 ID**: 始终设置为 `1` 并插入到 `contentItems` 数组的最顶端。
- **ID 顺延**: 原有的 ID `1` 变为 `2`，`2` 变为 `3`，依此类推。
- **引用同步**: 必须批量更新所有文章的 `relatedIds` 和 `recommendationIds`。
  - *计算规则*: `new_ref_id = old_ref_id + 1` (如果该引用指向原有内容)。

## 3. 资源生成与管理 (Asset Management)
- **主缩略图 (Main Image)**: 使用 `generate_image` 工具根据文章核心概念生成 16:9 的高质量封面。
  - *存储路径*: `src/assets/images/[slug]-thumb.png`。
- **画廊 (Gallery)**: 提取 Markdown 中的所有图片 URL 存入 `gallery` 数组，用于 UI 详情页展示。

## 4. 自动化注入规范
- **禁止部分替换**: 建议使用 `write_to_file` 覆写整个 `contentItems` 部分，或使用高度精确的正则替换，以防 ID 错乱。
- **清理引用**: 每次更新后清理 `mockData.js` 中重复或未使用的导入语句。

## 5. 验证清单
- [ ] 首页首条内容为最新 `x.md` 的内容。
- [ ] 所有卡片的点击跳转链接（基于 Slug）依然有效。
- [ ] 关联推荐部分的 ID 依然能对应到正确的文章。
- [ ] 资源文件在 `npm run dev` 环境下加载正常。
## 6. 内容脚注与元数据同步
- **强制脚注 (Mandatory Footer)**: 每篇文章的 `markdownContent` 末尾必须包含分割线 `---`，并在其下方添加以下标准文案：
  > “专注于分享经过验证的开发技巧与实用资源，致力于为你节省检索信息的时间，以及AI工具经验分享获取更多干货。关注微信公众号：流氓也是种气质Cookie。”
- **元数据同步 (Metadata Sync)**: 当新文章引入了新的 `tags` 或新的 `collection` 时，必须同步更新 `mockData.js` 底部的 `allTags` 和 `allCollections` 数组，以确保全局过滤和分类功能始终最新。
