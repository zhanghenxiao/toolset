import thumb1 from '../assets/thumb-1.png';
import thumb2 from '../assets/thumb-2.png';
import thumb3 from '../assets/thumb-3.png';
import thumb4 from '../assets/thumb-4.png';

export const contentItems = [
  {
    id: 1,
    slug: 'antigravity-quota',
    title: 'Antigravity 最新配额实测：Pro 变试用？Ultra 从 1500 降到 250？付费用户成小丑？',
    image: thumb1,
    date: '2026-03-27',
    author: '流氓',
    views: '1,120',
    category: '文章',
    duration: '15:20',
    excerpt: '本视频深入测试了谷歌 AI IDE Antigravity 的最新配额。我们发现无论是 Pro 还是 Ultra 订阅，其请求额度都被大幅削减。',
    tags: [{ name: 'AI编程', type: 'blue' }, { name: 'Antigravity', type: 'blue' }, { name: 'AI百科', type: 'green' }],
    collection: 'AI百科',
    relatedIds: [2, 3, 5, 8], // Unlimited related content
    recommendationIds: [2, 3, 4, 5], // Exactly 4 recommendations
    markdownContent: `
# 1. 介绍
本视频讲述了 Google Antigravity Skills 新手入门教程。
声明：随 流氓_IT 视频发布，免费使用，禁止任何转售等商业行为。

# 2. 视频中应用到命令
### 2.1. Skill.md en+zh
\`\`\`yaml
name: translator
description: Translates text between languages. Use when you got translation tasks.
---
# Translator Skill
When translating tasks, follow these steps:
1. When to use this skill
   - Use for all kinds of translation tasks.
\`\`\`
`
  },
  {
    id: 2,
    slug: 'llm-open-source',
    title: 'AI 开源大模型 LLM 的 "闭源" 恐慌：一场虚惊还是行业趋势的开端？',
    image: thumb2,
    date: '2026-03-25',
    author: '流氓',
    views: '850',
    category: '文章',
    duration: '08:45',
    excerpt: '近期，关于开源大语言模型 (LLM) 可能转向闭源的传闻引发了业内广泛的讨论和担忧。',
    tags: [{ name: 'AI趋势', type: 'blue' }, { name: 'DeepSeek', type: 'blue' }],
    collection: 'AI百科',
    relatedIds: [1, 4, 6],
    recommendationIds: [1, 3, 4, 5],
    markdownContent: '# AI 趋势深度解析\n\n开源大模型真的要转向闭源吗？\n\n## 行业分析\n目前市场的反馈来看...'
  },
  {
    id: 3,
    slug: 'cli-proxy',
    title: 'AI 新手必备：命令行代理设置终极教程 (临时与永久)',
    image: thumb3,
    date: '2026-03-23',
    author: '流氓',
    views: '2,300',
    category: '教程',
    duration: '12:10',
    excerpt: '在 AI 学习与开发中，网络问题常常是第一道坎。本视频专为新手设计。',
    tags: [{ name: 'AI学习', type: 'blue' }, { name: 'Mac OS', type: 'blue' }],
    collection: '流氓工具箱',
    relatedIds: [1, 2, 7, 8, 4],
    recommendationIds: [1, 2, 4, 5],
    markdownContent: '# 命令行代理教程\n\n## 临时代理\n```bash\nexport http_proxy=http://127.0.0.1:7890\n```\n## 永久代理\n修改 .bashrc 或 .zshrc...'
  },
  {
    id: 4,
    slug: 'gemini-hk',
    title: '重磅消息：Google Gemini 3.1 Pro 正式登陆香港，AI 新时代开启！',
    image: thumb4,
    date: '2026-03-20',
    author: '流氓',
    views: '5,600',
    category: '新闻',
    duration: '05:30',
    excerpt: 'Google 终于在香港地区开放其顶尖的 AI 模型 Gemini 3.1 Pro！',
    tags: [{ name: 'Gemini', type: 'blue' }, { name: 'Gemini 3.1 Pro', type: 'blue' }],
    collection: 'AI百科',
    relatedIds: [1, 5, 6, 7],
    recommendationIds: [1, 2, 3, 5],
    markdownContent: '# Gemini 3.1 Pro 发布\n\n香港用户现在可以直接访问 Gemini 3.1 Pro 了！'
  },
  // Additional items for recommendations
  {
    id: 5,
    slug: 'extra-1',
    title: 'Claude 4.5 Opus 深度评测：超越 GPT-4o 的逻辑巅峰？',
    image: thumb1,
    date: '2026-03-18',
    author: '流氓',
    views: '4,200',
    category: '评测',
    duration: '18:40',
    excerpt: 'Claude 4.5 Opus 终于发布，它的逻辑推理能力是否真的如传闻中那样强大？',
    tags: [{ name: 'Claude', type: 'blue' }, { name: 'Opus', type: 'blue' }],
    collection: 'AI百科',
    relatedIds: [1, 2],
    recommendationIds: [1, 2, 3, 4],
    markdownContent: '# Claude 4.5 Opus 评测\n\n深度测试其代码编写与逻辑推理能力...'
  },
  {
    id: 6,
    slug: 'extra-2',
    title: 'DeepSeek-V3 开源：万亿参数背后的中国 AI 力量',
    image: thumb2,
    date: '2026-03-15',
    author: '流氓',
    views: '6,100',
    category: '新闻',
    duration: '10:20',
    excerpt: 'DeepSeek 发布了其最新的 V3 模型，性能直逼闭源顶尖水平。',
    tags: [{ name: 'DeepSeek', type: 'blue' }, { name: '开源', type: 'blue' }],
    collection: 'AI百科',
    relatedIds: [2, 4],
    recommendationIds: [1, 2, 3, 4],
    markdownContent: '# DeepSeek-V3 发布\n\n中国开源大模型的又一里程碑。'
  },
  {
    id: 7,
    slug: 'extra-3',
    title: 'Python + AI：打造你的个人自动化全能助手',
    image: thumb3,
    date: '2026-03-12',
    author: '流氓',
    views: '3,400',
    category: '教程',
    duration: '25:15',
    excerpt: '使用 Python 结合 LLM API，一步步教你打造属于自己的自动化助手。',
    tags: [{ name: 'Python', type: 'blue' }, { name: '自动化', type: 'blue' }],
    collection: '流氓工具箱',
    relatedIds: [3, 1],
    recommendationIds: [1, 2, 3, 4],
    markdownContent: '# Python AI 助手\n\n从零开始构建你的 AI 代理。'
  },
  {
    id: 8,
    slug: 'extra-4',
    title: '未来已来：2026 年 AI 行业年度趋势展望',
    image: thumb4,
    date: '2026-03-10',
    author: '流氓',
    views: '1,900',
    category: '展望',
    duration: '14:50',
    excerpt: '在 AI 飞速发展的今天，未来的五年行业会走向何方？',
    tags: [{ name: '行业趋势', type: 'blue' }, { name: '未来', type: 'blue' }],
    collection: '流氓 行业研报',
    relatedIds: [2, 4],
    recommendationIds: [1, 2, 3, 4],
    markdownContent: '# 2026 AI 趋势展望\n\n多模态、Agentic Workflow 将成为主流。'
  },
  {
    id: 9,
    slug: 'extra-5',
    title: 'Docker 入门到精通：2026 开发者必备容器技术指南',
    image: thumb1,
    date: '2026-03-08',
    author: '流氓',
    views: '2,100',
    category: '教程',
    duration: '30:00',
    excerpt: 'Docker 依然是后端开发的基石。本教程涵盖了最新的 Docker Compose 特性。',
    tags: [{ name: 'Docker', type: 'blue' }, { name: 'Docker百科', type: 'green' }],
    collection: 'Docker百科',
    relatedIds: [10, 11, 12],
    recommendationIds: [1, 2, 3, 4],
    markdownContent: '# Docker 教程\n\n本教程教你如何构建高效的 Docker 镜像。'
  },
  {
    id: 10,
    slug: 'extra-6',
    title: 'iEVE 回忆录：致敬那些陪伴我们成长的经典游戏',
    image: thumb2,
    date: '2026-03-05',
    author: '流氓',
    views: '9,800',
    category: '文章',
    duration: '15:20',
    excerpt: '在这个 AI 横行的时代，让我们慢下来，回忆一下那些充满情怀的经典瞬间。',
    tags: [{ name: '游戏', type: 'blue' }, { name: '回忆', type: 'blue' }],
    collection: 'iEVE回忆',
    relatedIds: [9, 11],
    recommendationIds: [1, 2, 3, 4],
    markdownContent: '# iEVE 回忆\n\n那些年我们一起追过的游戏...'
  },
  {
    id: 11,
    slug: 'extra-7',
    title: '远行星号 (Starsector) 0.97a 汉化插件及必备 Mod 推荐',
    image: thumb3,
    date: '2026-03-02',
    author: '流氓',
    views: '3,500',
    category: '教程',
    duration: '10:45',
    excerpt: '远行星号更新了！这里有最新的汉化插件和必装的实用 Mod。',
    tags: [{ name: 'Starsector', type: 'blue' }, { name: 'Mod', type: 'blue' }],
    collection: '远行星号工具',
    relatedIds: [9, 12],
    recommendationIds: [1, 2, 3, 4],
    markdownContent: '# 远行星号工具\n\n下载并安装这些插件来提升游戏体验。'
  },
  {
    id: 12,
    slug: 'extra-8',
    title: '新时代网络：如何配置 2.5G/10G 内网万兆环境',
    image: thumb4,
    date: '2026-03-01',
    author: '流氓',
    views: '1,200',
    category: '教程',
    duration: '45:00',
    excerpt: '网络速度是第一生产力。手把手教你搭建一套高性价比的万兆内网。',
    tags: [{ name: '2.5G网络', type: 'blue' }, { name: '网管', type: 'blue' }],
    collection: '爱快百科',
    relatedIds: [9, 11],
    recommendationIds: [1, 2, 3, 4],
    markdownContent: '# 万兆网络指南\n\n升级你的路由器和交换机。'
  }
];

// 标签
export const allTags = [
  'AI百科', '2.5G网络', '2026', '5h限额', 'ACL', 'AI', 'AI IDE', 'AI Studio', 'AI工具', 'AI学习', 'AI新闻', 'AI编程', 'AI趋势', 'acme.sh', 'Claude', 'DeepSeek', 'Gemini', 'Mac OS', 'Python'
];
// 合集
export const allCollections = [
  'AI百科', 'Docker百科', '流氓工具箱', 'iEVE回忆', '开心串流', '爱快百科', '群晖百科', '远行星号工具', '流氓 行业研报'
];
// 内容类型：文章
export const allTypes = [
  '视频', '文章', '教程', '新闻', '评测', '展望'
];
