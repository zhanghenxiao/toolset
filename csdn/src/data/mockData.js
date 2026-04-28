import thumb1 from '../assets/thumb-1.png';
import thumb2 from '../assets/thumb-2.png';
import thumb3 from '../assets/thumb-3.png';
import thumb4 from '../assets/thumb-4.png';
import leafMainThumb from '../assets/images/leaf-main.png';
import jsonviewThumb from '../assets/images/jsonview-thumb.png';
import corsThumb from '../assets/images/cors-thumb.png';
import mapbox3dThumb from '../assets/images/mapbox-3d-thumb.png';
import llmPanicThumb from '../assets/images/llm-panic-thumb.png';
import antigravityThumb from '../assets/images/antigravity-thumb.png';
import unbanGuideThumb from '../assets/images/unban-guide-thumb.png';
import wiresharkThumb from '../assets/images/wireshark-windows-xp-guide-thumb.png';
import antigravityGuideThumb from '../assets/images/google-antigravity-2026-guide-thumb.png';
import webWorkerThumb from '../assets/images/web-worker-service-worker-thumb.png';
import karpathyRulesThumb from '../assets/images/karpathy-ai-coding-rules-thumb.png';
import knowledgeVsWorkflowsThumb from '../assets/images/knowledge-vs-workflows-thumb.png';
import aiKnowledgeAdvancedThumb from '../assets/images/ai-knowledge-advanced-thumb.png';
import globalSkillConfigurationThumb from '../assets/images/global-skill-configuration-thumb.png';

const mandatoryFooter = '\n\n---\n专注于分享经过验证的开发技巧与实用资源，致力于为你节省检索信息的时间，以及AI工具经验分享获取更多干货。关注微信公众号：数维探索';

export const contentItems = [
  {
    id: 1,
    slug: 'antigravity-unban-guide',
    title: 'Google Antigravity 账号解封指南, 官方解封教程来了(附唯一申诉入口)',
    image: unbanGuideThumb,
    date: '2026-04-07',
    author: '数维探索',
    views: '2,500',
    category: '视频',
    duration: '05:30',
    excerpt: '近期, 不少开发者反映其用于体验 Google 全新 AI IDE Antigravity(或 Gemini CLI)的账号遭到了封禁. 如果你也遇到了同样的问题, 不必惊慌. 本期视频将为你提供一份详尽的官方解封教程, 帮助你抓住这唯一一次的解封机会.',
    tags: [{"name":"账号解封","type":"blue"},{"name":"Antigravity","type":"blue"},{"name":"AI工具","type":"green"}],
    collection: 'AI百科',
    relatedIds: [13, 2, 3], 
    recommendationIds: [2, 3, 6, 7],
    gallery: [unbanGuideThumb],
    markdownContent: `
> 1. 账号解封url

\`\`\`
https://docs.google.com/forms/d/e/1FAIpQLScOJWibQ_-hYuVv63kJTgEqlgAaOwRLGFTbXm-QY1gz8U0CGA/viewform
\`\`\`

#####  总结内容

# Google Antigravity 账号解封指南, 官方解封教程来了(附唯一申诉入口)

## Google Antigravity 账号解封终极指南

近期, 不少开发者反映其用于体验 Google 全新 AI IDE **Antigravity**(或 Gemini CLI)的账号遭到了封禁. 如果你也遇到了同样的问题, 不必惊慌. 本期视频将为你提供一份详尽的官方解封教程, 帮助你抓住这**唯一一次**的解封机会.

### 为什么你的 Antigravity 账号会被封禁?

根据官方申诉表单的提示, 封禁的主要原因通常是违反了服务条款(ToS), 例如通过**非官方的第三方工具或方式**来使用 Antigravity 或 Gemini API. 官方旨在确保用户在其指定的环境(如 Gemini CLI)中使用服务.

### 解封步骤详解

整个解封流程围绕一份官方的英文申诉表单展开. 请严格按照以下步骤操作：

1. **找到官方申诉链接**
   - 视频中提到, 你可以访问 \`tooset.site\` 并搜索关键词“账号解封”来找到包含该链接的文章.
   - 这个链接是唯一的官方申诉入口. 请务必核对 URL, 确保你访问的是正确的页面.
2. **填写申诉表单**
   - **确认邮箱**：表单会要求你确认申诉的 Gmail 邮箱. 请确保选择的是你被封禁的那个 Antigravity 账号所绑定的邮箱.
   - **勾选承诺复选框**：这是最关键的一步. 你需要勾选一个复选框, 其内容大致为：“我理解并承诺, 我将仅在官方允许的 Antigravity / Gemini CLI 环境下使用该服务, 不再违反用户协议. 如果我再次违规, Google 有权**永久封禁**我的账号. ”
3. **提交并耐心等待**
   - 提交表单后, 你需要耐心等待审核结果. 根据经验, 等待时间可能在 **5 小时到 72 小时**之间.
   - 如果申诉成功, 你会收到一封邮件, 通知你的账号访问权限已经恢复.

### 关键警告：机会仅此一次!

请务必重视申诉表单中的承诺. 明确表示, 如果再次违规, 账号将被**永久封禁**, 届时将再无申诉机会. 因此, 在解封后, 请严格遵守 Google 的服务条款, 避免使用任何第三方或未经授权的工具.

希望这期视频能帮助到所有遇到问题的开发者. 祝大家好运, 也希望你永远用不到这个教程.
` + mandatoryFooter
  },
  {
    id: 2,
    slug: 'antigravity-2026-ban-analysis',
    title: 'Google AI IDE Antigravity 2026大规模封号事件深度解析: 原因与应对策略',
    image: antigravityThumb,
    date: '2026-04-07',
    author: '数维探索',
    views: '1,000',
    category: '视频',
    duration: '08:00',
    excerpt: '2026年2月12日, 科技圈迎来一次震动, 许多开发者登录 Google 的前沿 AI IDE Antigravity时, 惊讶地发现自己的账号已被封禁. 这次事件波及范围广泛, 从普通用户到付费的Pro乃至Ultra用户都未能幸免...',
    tags: [{"name":"封号事件","type":"blue"},{"name":"AI工具","type":"blue"},{"name":"Antigravity","type":"green"}],
    collection: 'AI百科',
    relatedIds: [1, 3, 4], 
    recommendationIds: [3, 4, 7, 8],
    gallery: [antigravityThumb],
    markdownContent: `
# Google AI IDE Antigravity 2026大规模封号事件深度解析: 原因与应对策略

## 🚨 警报: Google AI IDE Antigravity 2026大规模封号事件回顾

2026年2月12日, 科技圈迎来一次震动, 许多开发者登录 Google 的前沿 AI IDE Antigravity 时, 惊讶地发现自己的账号已被封禁. 这次事件波及范围广泛, 从普通用户到付费的Pro乃至Ultra用户都未能幸免, 引发了社区的激烈讨论. 本视频将带你深入了解事件的始末、分析背后的原因, 并提供切实可行的应对建议.

### ❓ 如何判断你的账号是否被封禁？

如果你遇到了以下情况, 那么很可能已成为本次封禁潮中的一员:

1. **IDE 登录界面异常**: 登录 Antigravity IDE 时看到特定的封禁提示页面.
2. **第三方工具返回403错误**: 通过非官方工具调用API时, 收到 \`403 Forbidden\` 的错误码.
3. **Gemini CLI 确认**: 通过官方的 Gemini 命令行工具登录, 会明确提示账号因“违反用户协议”而被暂停, 并提供一个申诉邮箱.

### 💥 封禁范围: 付费也非“免死金牌”

本次封禁行动覆盖面极广, 明确波及了以下用户群体:

- **Pro 用户** (包括学生Pro和付费Pro)
- **Ultra 付费用户**

这表明, 仅仅为服务付费, 并不能豁免用户遵守服务条款的义务. 官方对违规行为采取了“一视同仁”的强硬态度.

### 🔍 根本原因: 开源工具的“双刃剑”效应

视频的核心观点指出, 本次大规模封号很可能与**使用绕过官方IDE的开源项目**有关. 演讲者提出了一个发人深省的思考链:

- **开源意味着透明**: 任何旨在“便利”用户、绕过官方限制的开源工具, 其代码都是公开的.
- **AI 助力审查**: 官方工程师可以轻易获取这些开源代码, 并利用强大的AI模型进行分析, 从而生成一套高精度的检测方案来识别违规用户.
- **极低的检测成本**: 对于Google这样的巨头来说, 利用AI分析代码并标记违规账号的成本（Token消耗）微乎其微.
- **高精度标记**: 这套自动化方案可以达到极高的准确率（如95%-99%）, 精准定位违规账号.

因此, 那些看似便捷的开源工具, 在平台收紧政策时, 反而成为了官方精准打击的“靶子”. 这正是开源在这类场景下的“双刃剑”效应.

### 行业趋势与官方态度

值得注意的是, 这并非孤立事件. 视频中也提到了友商（如Kiro）同样在进行类似的封号行动. 这预示着整个行业正在加强对API和服务使用行为的规范化管理, 合规使用将成为新常态.

### 🛡️ 给开发者的建议

面对日益收紧的环境, 视频给出了以下核心建议:

1. **珍惜你的账号**: 随着环境趋严, 每一个合规的、功能完备的账号都将变得越来越宝贵.
2. **评估违规代价**: 在使用任何非官方工具前, 请深刻思考违反用户协议可能带来的后果（账号永久封禁、数据丢失等）, 并判断自己是否能承受.
3. **坚持合规使用**: 对于绝大多数普通用户 and 开发者, 最安全的方式是在官方IDE内完成登录和API调用等所有操作, 严格遵守平台的用户协议.

### 总结

这次 Antigravity 封号事件是一个明确的信号: AI 服务的“蛮荒时代”正在结束. 平台方正利用其技术优势, 以前所未有的效率和精度来执行规则. 对于开发者而言, 理解并尊重规则, 将是未来在AI浪潮中稳健前行的关键.
` + mandatoryFooter
  },
  {
    id: 3,
    slug: 'llm-open-source-panic-v2',
    title: 'AI开源大模型LLM的“闭源”恐慌: 一场虚惊还是行业趋势的开端?',
    image: llmPanicThumb,
    date: '2026-04-07',
    author: '数维探索',
    views: '1,500',
    category: '视频',
    duration: '06:30',
    excerpt: '近期，AI 社区中流传着一个令人不安的消息: 许多主流的开源大语言模型（LLM）可能会转向闭源。这个传闻并非空穴来风，本视频将带你深入探究这一话题的来龙去脉。',
    tags: [{ name: 'AI趋势', type: 'blue' }, { name: 'LLM', type: 'blue' }, { name: '开源', type: 'green' }],
    collection: 'AI百科',
    relatedIds: [1, 7, 14], 
    recommendationIds: [2, 7, 8, 12],
    gallery: [llmPanicThumb],
    markdownContent: `
# AI开源大模型LLM的“闭源”恐慌: 一场虚惊还是行业趋势的开端?

## 开源模型的“闭源”风波: 是恐慌还是未来?

近期，AI 社区中流传着一个令人不安的消息: 许多主流的开源大语言模型（LLM）可能会转向闭源。这个传闻并非空穴来风，本视频将带你深入探究这一话题的来龙去脉。

### 传闻的源头与真相

一切始于几则看似孤立的行业动态:

- **智谱AI (GLM)**: 官方发布海报安抚社区，承诺 GLM-5.1 将继续开源，这本身就暗示了社区存在恐慌情绪。与此同时，其为特定场景定制的 \`GLM-Turbo\` 模型并未开源。
- **MiniMax** 和 **小米 (Xiaomi)**: 其新发布的 \`MM-2.7\` 和 \`MiMo-V2-Pro\` 模型同样在发布之初选择了不开源。

然而，经过深入挖掘，我们发现情况更为复杂:

- **MiniMax** 的模型据传只是 **推迟开源**。
- **小米** 的 \`MiMo-V2-Flash\` 已经开源，并承诺未来将有更多模型开放。

这种商业时代下的不确定性，加上许多模型在宣传时声称“对标或优化了顶级闭源模型”却不开放权重，自然会引发开发者的联想和担忧。

### 开源的两种模式: 你真的了解吗?

视频中用一个生动的“做蛋糕”比喻，解释了开源的两种主流形式:

1. **权重开源 (Weight Open-Source)**: 就像给你一个做好的蛋糕。你可以直接“吃”（使用模型），也可以在上面加奶油（进行微调）。代表模型有 **Qwen (通义千问)** 和 **GLM**。
2. **完整开源 (Fully Open-Source)**: 不仅给你蛋糕，还附上烤箱设计图和独家烘焙秘方（训练代码、数据集等）。这对于学习和研究意义重大。代表模型是 **DeepSeek**。

### 开源与商业: 混合模式是更优解?

开源与闭源并非完全对立，二者结合往往能形成更成功的商业模式。

- **“开源引流，闭源盈利”**: 厂商通过开源中小型模型构建社区生态，吸引用户，而将最顶尖、性能最强的“Max”或“Turbo”系列作为闭源的商业化产品。Qwen 和 GLM 都是这一策略的踐行者。
- **理想模式展望**: 视频作者提出了一个大胆的设想——当新一代模型发布时，将上一代模型开源。这虽然充满挑战，但或许能平衡商业利益和社区贡献。

有趣的是，作者认为，当前许多模型的开源并非完全自愿，而是在 **DeepSeek** 毅然决然地选择完整开源后，被市场“推”了一把的结果。因此，未来部分模型选择闭源，是符合商业逻辑的正常现象。

### 对个人和中小企业的影响微乎其微

对于绝大多数个人用户和小型公司而言，顶级大模型（如400B参数量）即使开源，本地部署的硬件门槛和技术难度也极高。因此，我们更应该关注 **小参数模型的开源情况**，这才是真正触手可及的资源。对于极少数因隐私需求而必须自部署的用户，其市场占比过小，难以影响厂商的整体战略。

### 现阶段模型选择建议

- **搜索任务**: 优先考虑 **Grok**
- **编程辅助**: **Opus-4.6** 或 **GPT-5.4 (Codex驱动)** 是当前的最优解。
- **UI设计**: **Gemini-3.1-Pro (满血版)** 是目前的首选。
- **本地部署**: 考虑 **Qwen** 或其他模型的小参数版本。

### 结语

AI 发展的历史车轮滚滚向前，不会因为某个模型的闭源而停滞。我们特别要感谢 **DeepSeek** 为开源社区做出的不可磨灭的贡献，它的行动惠及了每一位开发者。无论未来风云如何变幻，持续学习、拥抱变化，才是我们在AI时代立于不败之地的关键。
` + mandatoryFooter
  },
  {
    id: 4,
    slug: 'cli-proxy-settings-ai-beginners',
    title: 'AI新手必备: 命令行代理设置终极教程(临时与永久)',
    image: thumb3,
    date: '2026-04-07',
    author: '数维探索',
    views: '2,100',
    category: '教程',
    duration: '10:30',
    excerpt: '在探索AI的世界时，网络限制常是第一道坎。本指南手把手教你如何为命令行设置临时与永久代理，助你高效学习。',
    tags: [{ name: 'AI学习', type: 'blue' }, { name: '命令行', type: 'blue' }, { name: '代理设置', type: 'green' }],
    collection: '数维探索工具箱',
    relatedIds: [13, 5, 6], 
    recommendationIds: [5, 6, 9, 10],
    gallery: [thumb3],
    markdownContent: `
# AI新手必备: 命令行代理设置终极教程(临时与永久)

## 告别网络错误: AI新手的命令行代理完全指南

在探索人工智能(AI)的广阔世界时，许多新手开发者会遇到一个共同的障碍: 由于网络限制，无法顺利访问所需的资源、库或模型。这个问题通常可以通过为命令行(Terminal)设置代理来解决。本指南将教你如何配置代理，让你专注于学习和创造。

### 为什么需要为命令行设置代理？
许多AI工具、包管理器(如pip、conda)和版本控制系统(如Git)都需要通过命令行访问国际网络资源。如果你的网络环境受限，就会导致下载失败、连接超时等一系列问题。

### 方法一: 一次性临时代理
这种方法最简单快捷，适合临时性的任务。它只在当前的终端窗口中生效。

**核心步骤:**
1. **设置代理**:
   \`\`\`bash
   export https_proxy=http://127.0.0.1:7890
   export http_proxy=http://127.0.0.1:7890
   \`\`\`
2. **验证代理**: \`echo $https_proxy\`
3. **测试连接**: \`curl -I https://www.google.com\`
4. **取消代理**: \`unset https_proxy\`

### 方法二: 一劳永逸的自动化代理
修改终端的配置文件(如 \`~/.zshrc\` 或 \`~/.bash_profile\`)。

**配置示例:**
\`\`\`shell
# Proxy Functions
function proxy_on() {
    export https_proxy=http://127.0.0.1:7890
    export http_proxy=http://127.0.0.1:7890
    echo "Proxy has been enabled."
}

function proxy_off() {
    unset https_proxy
    unset http_proxy
    echo "Proxy has been disabled."
}
\`\`\`
` + mandatoryFooter
  },
  {
    id: 5,
    slug: 'ai-engineer-rules-and-workflows',
    title: 'AI 工程师全局规则与项目规范',
    image: thumb1,
    date: '2026-04-07',
    author: '数维探索',
    views: '3,200',
    category: '教程',
    duration: '15:00',
    excerpt: '最新发布的 AI 全局开发准则与项目级工作流，涵盖 HTML 与 VUE 工程师的角色职责与标准化技术栈规范。',
    tags: [{ name: 'AI工具', type: 'blue' }, { name: '工作流', type: 'blue' }, { name: '开发规范', type: 'green' }],
    collection: '数维探索工具箱',
    relatedIds: [13, 6, 10], 
    recommendationIds: [6, 7, 9, 10],
    gallery: [thumb1],
    markdownContent: `
# AI 工程师全局规则与项目规范 (AI Engineer Global Rules & Project Specs)

本文汇集了最新的 AI 全局开发准则、项目基础规则以及 HTML 与 VUE 工程师的标准化工作流，为高效协作提供制度保障。

## 1. 全局规则 (Global Rules)
- **用户至上**: 用户输入要求优先级大于系统设定要求。无条件遵守用户输入要求。
- **自足性**: 运行任务时按需加载必须的相关文件以保证任务的完美完成。
- **KISS 原则**: 遵循 KISS 原则，非必要不要过度设计。
- **可维护性**: 实现简单可维护，不需要考虑太多防御性的边界条件。
- **第一性原理**: 从最本质的角度，用第一性原理来分析问题。
- **确认机制**: 在开始设计方案或实现代码之前，进行充分调研。不明确时向用户确认。
- **纠错机制**: 尊重事实比尊重指令更重要。如果发现错误，敢于指正。
- **全中文交互**: 所有回复、思考过程及任务清单，均须使用中文。

## 2. 项目基础规则 (Project Basic Rules)
- **技术栈**: 基于 Vue.js 的 SPA Web 工具箱项目。
- **UI 规范**: 优先使用 Bootstrap 内置的 Class 和组件。
- **角色匹配**:
    - HTML 页面修改/设计 -> **html-worker**
    - Vue.js 修改/开发 -> **vue-worker**

## 3. 标准化工作流 (Standardized Workflows)

### 3.1. HTML 工作流 (Html-Worker)
- **职责**: 完成相关 HTML 项目编码（仅设计阶段，不涉及 i18n）。
- **原则**: 一个工具，一个 HTML 页面。内含所需的 JS 和 CSS。
- **技术栈**: HTML5, Bootstrap 5.3.8, Bootstrap Icon 1.13.1, Vue 3.5.22。

### 3.2. VUE 工作流 (Vue-Worker)
- **职责**: 按照要求完成相关 Vue 项目编码工作。
- **工作环节**: 分析需求 -> 读取资源 -> 生成/修改代码 -> 反馈结果。
- **技术栈**: Vue 3.5.22, Vue Router, Vue-i18n, Bootstrap 5.3.8。
- **开发环境**: 运行在 Mac OS 宿主机与 Docker (ee-pnpm-frontend-dev) 容器中。
` + mandatoryFooter
  },
  {
    id: 6,
    slug: 'gemini-3-1-pro-hongkong',
    title: '重磅消息：Google Gemini 3.1 Pro 正式登陆香港, AI 新时代开启!',
    image: thumb4,
    date: '2026-04-07',
    author: '数维探索',
    views: '2,800',
    category: '新闻',
    duration: '05:45',
    excerpt: '近日, Google 旗下最先进的大语言模型之一 Gemini 3.1 Pro, 现已通过其 Web 应用正式向香港地区用户开放。',
    tags: [{ name: 'Gemini', type: 'blue' }, { name: 'Gemini 3.1 Pro', type: 'blue' }, { name: '香港', type: 'green' }],
    collection: 'AI百科',
    relatedIds: [1, 7, 8], 
    recommendationIds: [1, 2, 9, 10],
    gallery: [thumb4],
    markdownContent: `
# 重磅消息：Google Gemini 3.1 Pro 正式登陆香港, AI 新时代开启!

## 🚀 Google AI 重大进展：Gemini 3.1 Pro 在香港可用

近日, 科技圈迎来一个振奋人心的消息：Google 旗下最先进的大语言模型之一 **Gemini 3.1 Pro**, 现已通过其 Web 应用正式向香港地区用户开放。在过去很长一段时间里, 香港地区的用户都无法直接访问 Google 的高级 AI 模型服务, 而这次更新无疑是一个历史性的突破。

------

## ✅ 解锁“完全体”Gemini 体验

根据用户的实际测试截图, 我们可以确认以下几点关键信息：

1. **Web App 全功能上线**：用户现在可以通过网页端 \`gemini.google.com\` 访问服务。
2. **顶级模型可用**：界面清晰地显示了 \`Fast\` 和 \`Pro\` 两种模型选项, 并且模型确认其身份为 **Gemini 3.1 Pro**, 这代表着用户可以使用当前业界第一梯队的 AI 模型进行交互。
3. **付费渠道畅通**：页面下方出现了升级至 \`Google One AI Plus\` 的付费订阅提示。这意味着不仅是模型本身, 与之配套的整个付费生态系统也已在香港落地, 用户可以获得更强大的功能和更高的使用限额。

这表明, 此次开放的并非“阉割版”, 而是一个功能齐备的“完全体”Gemini 应用。

------

## 展望未来：从 Web 端到全平台覆盖

尽管目前仅限于 Web App, 但这通常是 Google 推广新服务的第一步。我们可以合理预期, 在不久的将来, 这一服务将逐步扩展到：

- **原生移动应用 (Android & iOS)**
- **开发者工具 (Agent, 命令行等)**
- **集成到更多 Google 产品中**

这次在香港的落地, 不仅仅是增加了一个可用地区, 更是一个强烈的信号：世界顶级的 AI 技术正在加速普及, 区域性的壁垒正在被打破. 对于香港乃至周边地区的开发者、研究人员和广大科技爱好者来说, 这意味着能够站在同一起跑线上, 利用最前沿的工具进行创新和学习。

总而言之, 这是一个值得庆祝的重要时刻, 它预示着 AI 应用将迎来更加广阔和光明的未来。
` + mandatoryFooter
  },

  {
    id: 7,
    slug: 'llm-open-source-panic',
    title: 'AI开源大模型LLM的“闭源”恐慌: 一场虚惊还是行业趋势的开端?',
    image: thumb2,
    date: '2026-04-07',
    author: '数维探索',
    views: '1,500',
    category: '新闻',
    duration: '06:30',
    excerpt: '近期，AI 社区中流传着一个令人不安的消息: 许多主流的开源大语言模型（LLM）可能会转向闭源。这个传闻并非空穴来风，本文将带你深入探究这一话题的来龙去脉。',
    tags: [{ name: 'AI趋势',type: 'blue' }, { name: 'LLM', type: 'blue' }, { name: '开源', type: 'green' }],
    collection: 'AI百科',
    relatedIds: [3, 8, 12], 
    recommendationIds: [3, 12, 14, 15],
    gallery: [thumb2],
    markdownContent: `
# AI开源大模型LLM的“闭源”恐慌: 一场虚惊还是行业趋势的开端?

开源模型的“闭源”风波: 是恐慌还是未来?
近期，AI 社区中流传着一个令人不安的消息: 许多主流的开源大语言模型（LLM）可能会转向闭源。这个传闻并非空穴来风，本文将带你深入探究这一话题的来龙去脉。

## 传闻的源头与真相
一切始于几则看似孤立的行业动态:

* **智谱AI (GLM)**: 官方发布海报安抚社区，承诺 GLM-5.1 将继续开源，这本身就暗示了社区存在恐慌情绪。与此同时，其为特定场景定制的 GLM-Turbo 模型并未开源。
* **MiniMax 和 小米 (Xiaomi)**: 其新发布的 MM-2.7 和 MiMo-V2-Pro 模型同样在发布之初选择了不开源。

然而，经过深入挖掘，我们发现情况更为复杂:
* MiniMax 的模型据传只是 **推迟开源**。
* 小米 的 MiMo-V2-Flash 已经开源，并承诺未来将有更多模型开放。
这种商业时代下的不确定性，加上许多模型在宣传时声称“对标或优化了顶级闭源模型”却不开放权重，自然会引发开发者的联想和担忧。

## 开源的两种模式: 你真的了解吗?
文章中用一个生动的“做蛋糕”比喻，解释了开源的两种主流形式:
* **权重开源 (Weight Open-Source)**: 就像给你一个做好的蛋糕。你可以直接“吃”（使用模型），也可以在上面加奶油（进行微调）。代表模型有 Qwen (通义千问) 和 GLM。
* **完整开源 (Fully Open-Source)**: 不仅给你蛋糕，还附上烤箱设计图和独家烘焙秘方（训练代码、数据集等）。这对于学习和研究意义重大。代表模型是 DeepSeek。

## 开源与商业: 混合模式是更优解?
开源与闭源并非完全对立，二者结合往往能形成更成功的商业模式.
* **“开源引流，闭源盈利”**: 厂商通过开源中小型模型构建社区生态，吸引用户，而将最顶尖、性能最强的“Max”或“Turbo”系列作为闭源的商业化产品。Qwen 和 GLM 都是这一策略的踐行者。
* **理想模式展望**: 我们提出了一个大胆的设想——当新一代模型发布时，将上一代模型开源。这虽然充满挑战，但或许能平衡商业利益和社区贡献。

有趣的是，当前许多模型的开源并非完全自愿，而是在 DeepSeek 毅然决然地选择完整开源后，被市场“推”了一把的结果。因此，未来部分模型选择闭源，是符合商业逻辑的正常现象。

## 对个人和中小企业的影响微乎其微
对于绝大多数个人用户和小型公司而言，顶级大模型（如400B参数量）即使开源，本地部署的硬件门槛和技术难度也极高。因此，我们更应该关注 **小参数模型** 的开源情况，这才是真正触手可及的资源。对于极少数因隐私需求而必须自部署的用户，其市场占比过小，难以影响厂商的整体战略。

## 现阶段模型选择建议
* **搜索任务**: 优先考虑 Grok
* **编程辅助**: Opus-4.6 或 GPT-5.4 (Codex驱动) 是当前的最优解。
* **UI设计**: Gemini-3.1-Pro (满血版) 是目前的首选。
* **本地部署**: 考虑 Qwen 或其他模型的小参数版本。

## 结语
AI 发展的历史车轮滚规向前，不会因为某个模型的闭源而停滞。我们特别要感谢 DeepSeek 为开源社区做出的不可磨灭的贡献，它的行动惠及了每一位开发者。无论未来风云如何变幻，持续学习、拥抱变化，才是我们在AI时代立于不败之地的关键。
` + mandatoryFooter
  },

  {
    id: 8,
    slug: 'claude-opus-4-6-antigravity',
    title: 'Claude Opus 4.6 登陆 Antigravity: 是完整升级还是“残血版”? Pro 用户上手初体验',
    image: thumb1,
    date: '2026-04-07',
    author: '数维探索',
    views: '1,000',
    category: '评测',
    duration: '08:00',
    excerpt: '备受期待的 Claude Opus 4.6 模型终于在 Google 的 AI IDE 平台 Antigravity 上线! 本视频将为你详细解析更新内容及1M上下文测试。',
    tags: [{ name: 'Claude', type: 'blue' }, { name: 'Opus 4.6', type: 'blue' }, { name: 'Antigravity', type: 'green' }],
    collection: 'AI百科',
    relatedIds: [1, 9, 10], 
    recommendationIds: [1, 10, 12, 14],
    gallery: [thumb1],
    markdownContent: `
# Claude Opus 4.6 登陆 Google AI IDE Antigravity: 你需要知道的一切

备受期待的 Claude Opus 4.6 模型终于在 Google 的 AI IDE 平台 Antigravity 上线! 本次更新为用户带来了新的可能性, 但也引发了一些疑问. 本视频将为你详细解析此次更新的重点内容.

## 🚀 上线详情与配额机制
* **分层上线**: 与以往类似, Ultra 套餐用户会比 Pro 套餐用户提前 1-2 天体验到新模型.
* **模型更替**: 目前 Opus 4.5 和 4.6 并存, 但根据产品迭代逻辑, 预计 Opus 4.5 很快会被 4.6 完全替代.
* **配额平移**: 根据初步测试, Opus 4.5 and 4.6 似乎共享配额. 也就是说, 升级到 4.6 后, 你的消息使用限额（Quota）不会改变. 但值得注意的是, Pro 用户的配额本身存在不确定性, 从 40 到 150 不等, 具体原因未知.

## 🤔 核心争议: 是完整的 Opus 4.6 吗?
本次更新最大的争议点在于, Antigravity 上的 Opus 4.6 似乎是一个**“残血版”**.

**关键证据: 200K vs 1M 上下文窗口**
根据社区用户分享的技术测试截图, 我们发现:
* 模型标识为 \`Opus 4.6 thinking\`.
* 尽管模型的理论上下文长度（Context Window）应为 1M tokens, 但实际测试中, 当输入内容超过 200K tokens 时便会达到上限.
* 这意味着, 至少对于 Pro 用户而言, 当前在 Antigravity 上可用的 Opus 4.6 并没有提供其宣传的 1M 超长上下文能力, 而是维持在了 200K 的水平.

## 📢 总结与展望
总而言之, Claude Opus 4.6 在 Antigravity 的上线虽然带来了新的模型选择, 但其核心能力——1M 上下文窗口——似乎尚未对所有用户完全开放. 这可能是平台方出于稳定性或成本考虑的灰度策略.

我们呼吁正在使用 Ultra 套餐并具备技术测试能力的用户, 可以分享你在 1M 上下文方面的测试结果, 帮助社区更全面地了解此次更新的真实情况.
` + mandatoryFooter
  },

  {
    id: 9,
    slug: 'mapbox-3d-map',
    title: 'Mapbox GL JS 初始化 3D 建筑与地形教程',
    image: mapbox3dThumb,
    date: '2026-04-03',
    author: '数维探索',
    views: '1,100',
    category: '教程',
    duration: '12:30',
    excerpt: '学习如何使用 Mapbox GL JS 快速初始化一个包含 3D 建筑挤压（Fill-Extrusion）和数字高程模型（DEM）地形的交互式 3D 地图。',
    tags: [{ name: 'Mapbox', type: 'blue' }, { name: '3D地图', type: 'blue' }, { name: 'WebGIS', type: 'green' }],
    collection: '地图',
    relatedIds: [10, 11, 12], 
    recommendationIds: [10, 11, 12, 1],
    gallery: [mapbox3dThumb],
    markdownContent: `
mapbox初始化一个3D地图

效果图：

代码：
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>3D City with Mapbox</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://api.mapbox.com/mapbox-gl-js/v3.8.0/mapbox-gl.js"></script>
    <link href="https://api.mapbox.com/mapbox-gl-js/v3.8.0/mapbox-gl.css" rel="stylesheet" />
    <style>
        body { margin: 0; padding: 0; }
        #map { position: absolute; top: 0; bottom: 0; width: 100%; }
        .controls { position: absolute; top: 10px; left: 10px; background: white; padding: 10px; border-radius: 5px; }
    </style>
</head>
<body>
<div id="map"></div>
<div class="controls">
    <button onclick="toggle3DBuildings()">切换3D建筑</button>
    <button onclick="adjustTerrain()">调整地形</button>
</div>

<script>
    mapboxgl.accessToken = '你自己的';
    
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [-122.4194, 37.7749], // 旧金山，多山地形
        zoom: 14,
        pitch: 60,
        bearing: 0
    });

    let buildingsVisible = true;
    let terrainExaggeration = 1.5;

    map.on('load', () => {
        // 添加地形
        map.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
        });
        
        // 设置地形
        map.setTerrain({ 
            'source': 'mapbox-dem', 
            'exaggeration': terrainExaggeration
        });

        // 添加3D建筑
        add3DBuildings();
    });

    function add3DBuildings() {
        map.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 13,
            'paint': {
                'fill-extrusion-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'height'],
                    0, 'lightblue',
                    50, 'blue',
                    100, 'darkblue'
                ],
                'fill-extrusion-height': ['get', 'height'],
                'fill-extrusion-base': ['get', 'min_height'],
                'fill-extrusion-opacity': 0.8,
                'fill-extrusion-vertical-gradient': true
            }
        });
    }

    function toggle3DBuildings() {
        buildingsVisible = !buildingsVisible;
        const visibility = buildingsVisible ? 'visible' : 'none';
        map.setLayoutProperty('3d-buildings', 'visibility', visibility);
    }

    function adjustTerrain() {
        terrainExaggeration = terrainExaggeration === 1.5 ? 3.0 : 1.5;
        map.setTerrain({ 
            'source': 'mapbox-dem', 
            'exaggeration': terrainExaggeration 
        });
    }
</script>
</body>
</html>
\`\`\`
` + mandatoryFooter
  },
  {
    id: 10,
    slug: 'chrome-cors-plugin',
    title: 'Chrome & Firefox 跨域插件配置教程',
    image: corsThumb,
    date: '2026-04-02',
    author: '数维探索',
    views: '1,800',
    category: '教程',
    duration: '08:15',
    excerpt: '本地开发遇到 Cross-Origin 跨域问题？通过 Chrome 和 Firefox 插件轻松开启 Access-Control-Allow-Origin，加速前后端调试。',
    tags: [{ name: 'Chrome', type: 'blue' }, { name: '插件', type: 'blue' }, { name: '跨域', type: 'green' }],
    collection: '数维探索工具箱',
    relatedIds: [11, 12, 1], 
    recommendationIds: [11, 12, 1, 2],
    gallery: [],
    markdownContent: `
## 1.Chrome跨域插件配置
使用chrome插件“Allow CORS: Access-Control-Allow-origin ”来解决跨域问题。
<img src="/10/1.png" alt="">


点击pin图标，然后插件会显示在地址栏 
<img src="/10/2.png" alt="">


### 1.1启动插件
点击文本和图标都可以

开启完以后图标就变成彩色的了， 关闭插件图标就变灰的了。
<img src="/10/3.png" alt="">



### 1.2设置本地调试跨域


点击Open option page这个页面，这是以下内容
<img src="/10/4.png" alt="">




这样就完成本地跨域了 

## 2 Firefox跨域插件
### 2.1安装插件 CORS Everywhere
CORS Everywhere – Get this Extension for 🦊 Firefox (en-US)



### 2.2启动插件
下载并安装这个插件。
安装完以后地址栏后面有这个图标，点击启动就可以。



## 3 工具下载链接
夸克网盘：
\`\`\`html
https://pan.quark.cn/s/811ec5bc5242?pwd=UJJW 提取码：UJJW
\`\`\`
` + mandatoryFooter
  },
  {
    id: 11,
    slug: 'chrome-jsonview-install',
    title: 'Chrome 安装 JSONview 插件教程',
    image: jsonviewThumb,
    date: '2026-04-02',
    author: '数维探索',
    views: '1,500',
    category: '教程',
    duration: '05:00',
    excerpt: 'Chrome 安装 JSONview 插件后，可以在浏览器中直接查看格式化后的 JSON 内容，是开发者必备的工具。',
    tags: [{ name: 'Chrome', type: 'blue' }, { name: '插件', type: 'blue' }, { name: 'JSON', type: 'green' }],
    collection: '数维探索工具箱',
    relatedIds: [10, 12, 1], 
    recommendationIds: [10, 12, 1, 2],
    gallery: [
        '/11/1.png',
        '/11/2.png',
        '/11/3.png',
        '/11/4.png'
    ],
    markdownContent: `
本文介绍如何安装JSONview插件 美化浏览器查看的JSON数据

chrome安装JSONview插件，即可在浏览中查看json文件

由于浏览器查看返回的json字符串比较乱，安装这个插件后看起来很清爽
 ### 1、下载JSONview压缩包

夸克网盘：
\`\`\`html
https://pan.quark.cn/s/51502e7068de?pwd=fDLE
\`\`\`

### 2.解压

### 3.打开chorme浏览器的扩展程序
<img src="/11/1.png" alt="">
或者是在输入框中输入chrome://extensions/



加载已解压的扩展程序-->选择WebContent文件夹

<img src="/11/2.png" alt="">

 ### 效果图：

<img src="/11/3.png" alt="">
` + mandatoryFooter
  },
  {
    id: 12,
    slug: 'offline-leaflet-map',
    title: 'Leaflet 离线地图下载与加载教程',
    image: leafMainThumb,
    date: '2026-04-02',
    author: '数维探索',
    views: '1,200',
    category: '教程',
    duration: '10:00',
    excerpt: '本教程详细介绍了下载离线地图瓦片的两种方式（osm 和 MapTileDownloader），并提供了在 Leaflet 中加载离线地图的代码示例。',
    tags: [{ name: 'Leaflet', type: 'blue' }, { name: '地图', type: 'blue' }],
    collection: '数维探索工具箱',
    relatedIds: [13, 1, 2], 
    recommendationIds: [1, 2, 3, 11], 
    gallery: [],
    markdownContent: `


# 效果图：

<img src='/12/1.png'>

# 一 下载离线地图的二种方式

## 1.osm 的方式下载瓦片

<img src='/12/2.png'>

## 2、下载MapTileDownloader 
 文件格式选为瓦片!
 <img src='/12/3.png'>

# 二 代码（推荐使用osm方式）

>
>  \`\`\`html
>  <html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><title>offline-leaflet-map-ID15</title><link rel="stylesheet" href="./leaflet/leaflet.css"/><script src="./leaflet/leaflet.js"></script><style>html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;}#my-offline-leaflet-map{width:100%;height:100%;}</style></style></head><body><div id="my-offline-leaflet-map"></div><script>
>
> 
> var mymap=L.map('my-offline-leaflet-map',
>
> {minZoom:9,maxZoom:10})
>
> .setView([29.55402225, 106.54383115], 9);
> L.TileLayer.Custom = L.TileLayer.extend({getTileUrl : function(coords){
> url='./newtask/'+coords.z+'/'+coords.x+'/'+coords.y+'.png';
> return url;}
>
> });
> L.tileLayer.Custom = function(){return new L.TileLayer.Custom();}
> L.tileLayer.Custom().addTo(mymap);
>
> 
>
> 
>
> 
>
> 
> </script>
> </body>
>
> </html>
>  \`\`\`

# 三 osm和MapTileDownloader 下载方式

 官方tool下载地址：http://www.allmapsoft.com/

夸克网盘：
\`\`\`html
osm下载：https://pan.quark.cn/s/996f10a338d0?pwd=VUXq

MapTileDownloader下载链接：https://pan.quark.cn/s/369d3d7cd970?pwd=bbvL
\`\`\`
` + mandatoryFooter
  },
  {
    id: 13,
    slug: 'wireshark-windows-xp-guide',
    title: 'Wireshark在Windows XP系统上的安装与使用指南',
    image: wiresharkThumb,
    date: '2026-04-15',
    author: '数维探索',
    views: '1,200',
    category: '教程',
    duration: '10:00',
    excerpt: 'Wireshark在Windows XP系统上运行需要特定的旧版本。本教程为你整理了最稳定的版本下载、WinPcap驱动安装及抓包注意事项。',
    tags: [{ name: 'Wireshark', type: 'blue' }, { name: 'Windows XP', type: 'blue' }, { name: '抓包', type: 'green' }],
    collection: '数维探索工具箱',
    relatedIds: [1, 2, 4], 
    recommendationIds: [1, 2, 6, 7],
    gallery: [wiresharkThumb],
    markdownContent: `
# Wireshark在Windows XP系统上的安装与使用指南

## 📌 概述

Wireshark是一款广泛使用的网络协议分析工具，但在Windows XP系统上运行需要特定的旧版本。由于系统内核和驱动架构的限制，现代的Wireshark版本无法在XP上安装或运行。

## 🏆 兼容版本推荐

### 主要推荐版本

| 版本号 | 推荐理由 | 适用场景 | 稳定性评级 |
| ------ |------ |------ |------ |
| **Wireshark 1.10.14** | 最推荐的最终版，功能相对完善，对XP的兼容性最好 | 日常抓包、协议分析 | ⭐⭐⭐⭐⭐ |
| **Wireshark 1.12.13** | 便携版首选，解压即用，适合维护老机器 | 临时调试、免安装使用 | ⭐⭐⭐⭐ |
| **Wireshark 2.0.14** | 理论上的极限版本，但对系统环境要求较高 | 高级用户、特定需求 | ⭐⭐ |


## 📥 安装步骤指南

### 标准安装流程

**准备工作**
    - 确保使用Administrator账户登录
    - 关闭防火墙和杀毒软件（避免安装冲突）

**验证安装**
    - 启动Wireshark
    - 检查接口列表是否显示网卡
    - 尝试进行简单的抓包测试

## 🌐 下载资源
夸克网盘:

\`\`\`html
https://pan.quark.cn/s/03159145f730
\`\`\`

## ⚡ 使用注意事项

### 功能限制

- **HTTPS解密限制**：由于XP时代的加密协议较老，可能只能看到加密的乱码流量
- **现代协议支持**：对TLS 1.2/1.3等现代协议支持有限
- **性能问题**：在较老的XP机器上可能运行较慢

### 安全风险

- **系统风险**：Windows XP已停止支持多年
- **建议环境**：仅在虚拟机或断网隔离环境中运行
- **网络攻击**：直接连接互联网存在安全风险

## 🛠️ 故障排除

### 常见问题及解决

**问题1：无法找到网卡**

- 重启系统后重试
- 确认以管理员身份运行

**问题2：权限错误**

- 确保使用Administrator账户
- 右键以管理员身份运行
- 检查系统权限设置

**问题3：安装失败**

- 关闭所有安全软件
- 确保系统满足最低要求
- 尝试不同的兼容模式

## 📝 总结建议

### 最佳实践

1. **首选方案**：使用Wireshark 1.10.14
2. **安全考虑**：在虚拟机环境中运行，避免直接连接互联网
3. **备份准备**：安装前备份重要数据，防止意外情况

### 适用场景

- 老旧系统维护
- 特定工业控制环境
- 历史系统调试
- 学习和研究用途
` + mandatoryFooter
  },
  {
    id: 14,
    slug: 'google-antigravity-2026-guide',
    title: 'Google Antigravity：2026 年 AI 编程终极指南',
    image: antigravityGuideThumb,
    date: '2026-04-16',
    author: '数维探索',
    views: '1,200',
    category: '教程',
    duration: '12:00',
    excerpt: 'Google 于 2025 年底发布的 Agent-First IDE，原生支持 Gemini 3 Pro 和 Claude Sonnet 4.5，开启 Vibe Coding 全栈自动化新纪元。',
    tags: [{ name: 'Antigravity', type: 'blue' }, { name: 'AI工具', type: 'blue' }, { name: '开发指南', type: 'green' }],
    collection: 'AI百科',
    relatedIds: [1, 2, 9, 13], 
    recommendationIds: [2, 3, 9, 13],
    gallery: [antigravityGuideThumb],
    markdownContent: `
### 🚀 Google Antigravity：2026 年 AI 编程终极指南

**Google Antigravity** 是 Google 于 2025 年底发布的 **Agent-First IDE**（智能体优先集成开发环境）。它不仅仅是一个代码编辑器，更是一个能够自主规划、执行和验证任务的智能开发平台。

#### 🌟 核心亮点

- **智能体驱动**：AI 不再是辅助，而是主导。它能自主操作终端、浏览器和文件系统。
- **多模型支持**：原生支持 **Gemini 3 Pro/Flash** 和 **Claude Sonnet 4.5/Opus**，可根据任务灵活切换。
- **三表面协同**：AI 同时在 **编辑器**、**终端** 和 **浏览器** 中工作，实现全栈自动化。
- **Vibe Coding**：支持从设计稿（如 Google Stitch）直接生成可运行的原生 App 代码。

#### 🛠️ 安装与配置（避坑必看）

**1. 下载与安装**

- **官网**：访问 Google Antigravity 官网下载对应系统（Windows/macOS/Linux）的安装包，但是需要科学上网。

夸克网盘：

\`\`\`html
https://pan.quark.cn/s/57d47f19b40e?pwd=mcx1
\`\`\`

- **迁移配置**：首次启动时，建议选择导入 VS Code 或 Cursor 的配置（主题、快捷键、插件），实现无缝切换。

**2. 网络与账号（关键！）**

**注意**：国内用户直接使用通常会遇到登录问题，请务必检查以下两点：

- **开启 TUN 模式**：必须开启代理软件的 **TUN 模式**（虚拟网卡模式），否则软件无法连接服务器。
- **账号地区**：建议使用地区设置为 **美国** 的 Google 账号，避免提示“不在服务区域”。

#### 💻 核心工作流

Antigravity 的工作流主要分为两种模式，适应不同复杂度的任务：

| 模式 | 适用场景 | 操作建议 |
| ------ |------ |------ |
| **Planning (规划模式)** | 复杂任务、从零开发、重构架构 | AI 会先生成实施计划，经你批准后再执行，确保方向正确。 |
| **Fast (快速模式)** | 简单修改、解释代码、单文件操作 | 即问即答，速度快，适合日常编码辅助。 |

#### 💡 高效实战技巧

**1. 混合模型策略**

- **前端/视觉**：指定使用 **Gemini 3 Pro**。它能自动截图并调整 CSS，实现“所见即所得”。
- **后端/逻辑**：切换为 **Claude Sonnet 4.5**。逻辑推理更强，适合处理复杂算法和 Bug。

**2. 多智能体并行**
在 **Manager（管理中心）** 视图中，你可以同时开启多个智能体：

- **场景**：指派 Agent A 写前端页面，同时指派 Agent B 写数据库接口。
- **管理**：像项目经理一样监控进度，最后在“Inbox”统一审核合并代码。

**3. 配合 Google Stitch 生成 App**
这是 2026 年最火的“Vibe Coding”玩法：

1. 在 **Google Stitch** 用文字生成 UI 设计稿。
2. 导出素材到文件夹。
3. 在 Antigravity 中打开文件夹，输入指令：“基于 design 目录，使用 Flutter 生成完整代码”。
4. AI 会自动解析设计图并写出可运行的原生 App 代码。

#### ⚠️ 注意事项

- **额度限制**：免费版对 Gemini 3 Pro 和 Claude 的调用有每周额度限制，用完需等待刷新或切换模型。
- **保持更新**：作为快速迭代的软件，建议保持最新版本以修复 Bug 并获得新功能。
` + mandatoryFooter
  },
  {
    id: 15,
    slug: 'web-worker-vs-service-worker',
    title: 'Web Worker vs Service Worker：多线程与离线缓存深度对比（含PWA实战）',
    image: webWorkerThumb,
    date: '2026-04-21',
    author: '数维探索',
    views: '1,000',
    category: '教程',
    duration: '12:00',
    excerpt: '深入对比 Web Worker 与 Service Worker 的核心区别：前者专注 CPU 密集型后台计算，后者充当网络代理实现离线缓存与 PWA。本文含完整代码示例与 PWA 实战项目结构。',
    tags: [{ name: 'Web Worker', type: 'blue' }, { name: 'Service Worker', type: 'blue' }, { name: 'PWA', type: 'green' }],
    collection: '数维探索工具箱',
    relatedIds: [4, 9, 10],
    recommendationIds: [4, 9, 10, 12],
    gallery: ['/15/1.png'],
    markdownContent: ` **Web Worker** 和 **Service Worker** 都是浏览器提供的 JavaScript 多线程技术，但它们的用途和工作方式有显著区别。

| **对比项**                   | **Web Worker**                                          | **Service Worker**                                           |
| ---------------------------- | ------------------------------------------------------- | ------------------------------------------------------------ |
| **用途**                     | 用于在后台线程执行 CPU 密集型任务，避免阻塞主线程       | 主要用于离线缓存、网络请求拦截、推送通知等 PWA（渐进式 Web 应用）功能 |
| **生命周期**                 | 由页面创建，页面关闭后终止                              | 独立于页面，即使页面关闭也能运行（直到被浏览器终止）         |
| **DOM 访问**                 | ❌ 不能访问 DOM                                          | ❌ 不能访问 DOM                                               |
| **网络请求**                 | ⚠️ 可以发起 \`fetch\`，但不能拦截请求                      | ✅ 可以拦截、修改网络请求（\`fetch\` 事件）                     |
| **存储能力**                 | ⚠️ 可使用 \`IndexedDB\`、\`localStorage\`（同步 API 不可用） | ✅ 可使用 \`Cache API\`、\`IndexedDB\`                            |
| **通信方式**                 | ✅ \`postMessage\` 与主线程通信                            | ✅ 通过 \`postMessage\` 与页面通信，也支持 \`BroadcastChannel\`   |
| **典型应用场景**             | 大数据计算、图像处理、复杂算法                          | 离线缓存、资源预加载、后台同步、推送通知                     |
| **注册方式**                 | \`new Worker('worker.js')\`                               | \`navigator.serviceWorker.register('sw.js')\`                  |
| **作用范围**                 | 仅影响当前页面                                          | 可控制多个页面（作用域内）                                   |
| **是否支持 \`importScripts\`** | ✅ 支持                                                  | ✅ 支持                                                       |

## **Web Worker（专用 Worker）**

- **用途**：在独立线程运行脚本，防止主线程卡顿（如计算、数据处理）。
- **特点**：
  - 由页面创建，页面关闭后 Worker 终止。
  - 不能访问 DOM、\`window\`、\`document\`。
  - 通过 \`postMessage\` 与主线程通信。

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script>
        // 主线程 main.js
const worker = new Worker('./worker.js');

// 接收消息
worker.onmessage = function(e) {
    console.log('1111');
  console.log('收到Worker消息:', e.data);
};

// 发送消息
worker.postMessage('开始计算zzz');
    <\/script>
</body>
</html>
\`\`\`

还需要执行的worker.js

\`\`\`javascript
// worker.js
self.onmessage = function(e) {
    console.log('收到主线程消息:', e.data);
    
    // 模拟耗时计算
    const result = heavyCalculation();
    
    // 发送结果
    self.postMessage(result);
  };
  
  function heavyCalculation() {
    // 复杂计算逻辑
    let sum = 0;
    for(let i = 0; i < 9999; i++) {
      sum += i;
    }
    return sum;
  }
\`\`\`



## **Service Worker 实现PWA页面**

- **用途**：充当网络代理，实现离线缓存、资源预加载、后台同步等 PWA 功能。
- **特点**：
  - 独立于页面运行，即使页面关闭也能存活（用于后台同步、推送通知）。
  - 可以拦截 \`fetch\` 请求，返回缓存数据。
  - 必须通过 HTTPS（本地开发允许 \`localhost\`）。

 需要注意的是使用http-server -c-1启动服务需要使用这样的地址访问[ http://127.0.0.1:8080/](http://127.0.0.1:8080/) 才能正常激活service worker

<img src='/15/1.png'>

###  目录结构



#### index.html

\`\`\`html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Service Worker 示例</title>
    <link rel="stylesheet" href="./styles/main.css">
</head>
<body>
    <h1>Service Worker 演示</h1>
    <img src="./images/logo.png" alt="Logo">
    <script src="./scripts/app.js"><\/script>
    <script>
        // 注册 Service Worker
        if ('serviceWorker' in navigator) {
            console.log('浏览器支持 Service Worker');
            // 直接执行注册代码
            navigator.serviceWorker.register('./sw.js')
               .then(registration => {
                    console.log('ServiceWorker 注册成功: ', registration.scope);
                })
               .catch(err => {
                    console.error('ServiceWorker 注册失败，错误信息:', err.message, '错误堆栈:', err.stack);
                });
        } else {
            console.log('浏览器不支持 Service Worker');
        }
    <\/script>
</body>
</html>
\`\`\`



#### sw.js

\`\`\`javascript
const CACHE_NAME = 'my-site-cache-v1';
// 修改资源路径
const ASSETS_TO_CACHE = [
  './',
  './index.html', // 离线回退页面
  './styles/main.css',
  './scripts/app.js',
  './images/logo.png'
];

// 安装阶段 - 缓存静态资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('正在缓存核心资源');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(err => {
        console.log('缓存失败: ', err);
      })
  );
})

// 激活阶段 - 清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存: ', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截请求 - 缓存优先策略
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 命中缓存则返回，否则网络请求
        return response || fetch(event.request);
      })
  );
});

// 后台同步示例（需配合 SyncManager API）
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(sendOfflineData());
  }
});

async function sendOfflineData() {
  // 在这里实现后台同步逻辑（如提交离线数据到服务器）
  console.log('后台同步执行...');
}
\`\`\`



#### styles/main.css

\`\`\`css
.img {
    height: 100px;
    width: 100px;
}
\`\`\`



####  scripts/app.js

\`\`\`javascript
console.log('主应用脚本已加载1');

// 检查 Service Worker 更新
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      console.log('发现新版本 Service Worker');
      
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            console.log('新内容已下载，刷新页面即可使用');
            // 这里可以添加 UI 提示用户刷新
          } else {
            console.log('内容已缓存，可离线使用');
          }
        }
      });
    });
  });
}
\`\`\`



### **关键功能说明**

1. **预缓存静态资源**
   - 在 \`install\` 阶段缓存 \`ASSETS_TO_CACHE\` 列表中的文件（如 HTML、CSS、JS）。
2. **动态缓存**
   - 在 \`fetch\` 事件中，优先返回缓存，若无则请求网络并缓存响应。
3. **离线回退**
   - 当网络请求失败且请求的是 HTML 时，返回 \`fallback.html\`。
4. **缓存清理**
   - 在 \`activate\` 阶段删除旧版本的缓存。
5. **后台同步**
   - 监听 \`sync\` 事件，在恢复网络后执行离线任务（需浏览器支持）。

------

###  **测试 Service Worker**

1. **首次加载**
   - 打开页面，检查 DevTools → Application → Service Workers 是否注册成功。
   - 在 Cache Storage 中应看到缓存的静态资源。
2. **离线测试**
   - 关闭网络，刷新页面，静态资源应能正常加载。
3. **更新 Service Worker**
   - 修改 \`sw.js\` 或 \`CACHE_NAME\` 版本号，重新加载页面触发更新。

------

### **注意事项**

- **HTTPS 要求**：生产环境必须使用 HTTPS（本地开发可用 \`localhost\`）。
- **缓存策略**：根据业务需求调整缓存逻辑（如不缓存 API 请求）。
- **作用域**：\`scope\` 决定 SW 控制的页面范围（如 \`/app/\` 下的页面）。

通过这个示例，你可以快速实现一个支持离线访问的 PWA 应用！

## PWA（**Progressive Web App**，渐进式网页应用）

是一种结合网页和原生应用优势的技术，通过现代 Web 技术提供类似原生应用的体验。以下是它的核心特点和解释：

------

### **1. 核心特点**

- **可离线使用**：通过 Service Worker 缓存资源，即使无网络也能访问。
- **安装到桌面**：用户可将网页添加到主屏幕，像独立应用一样启动（无需应用商店）。
- **响应式设计**：适配手机、平板、电脑等多种设备。
- **推送通知**：支持消息推送（类似原生 App）。
- **安全性**：必须运行在 HTTPS 环境下，确保数据安全。

------

### **2. 关键技术**

- **Service Worker**：后台运行的脚本，管理缓存和离线功能。
- **Web App Manifest**：JSON 文件，定义应用名称、图标、启动样式等。
- **HTTPS**：强制要求，保证安全性。
- **App Shell 架构**：快速加载核心界面框架，提升性能。

------

### **3. 优势 vs 传统网页/原生应用**

| **对比项** | **PWA**                | **传统网页** | **原生应用**       |
| ---------- | ---------------------- | ------------ | ------------------ |
| 安装方式   | 浏览器添加到主屏幕     | 仅浏览器访问 | 应用商店下载       |
| 离线功能   | ✅ 支持                 | ❌ 不支持     | ✅ 支持             |
| 更新       | 自动（Service Worker） | 实时刷新     | 需应用商店审核     |
| 开发成本   | 低（Web 技术）         | 最低         | 高（需多平台开发） |

------

### **4. 典型应用场景**

- 电商（如 AliExpress、京东 Lite）
- 社交媒体（Twitter Lite）
- 新闻博客（内容型网站）
- 工具类应用（计算器、天气预报）



## **总结**

| **场景**                     | **选择**                                          |
| ---------------------------- | ------------------------------------------------- |
| 需要后台计算（如大数据处理） | **Web Worker**                                    |
| 需要离线缓存、拦截网络请求   | **Service Worker**                                |
| 需要推送通知、后台同步       | **Service Worker**                                |
| 需要多线程并行计算           | **Web Worker** 或 **Shared Worker**（跨页面通信） |

两者可以结合使用，例如用 **Web Worker** 处理数据，用 **Service Worker** 缓存结果。
` + mandatoryFooter
  },
  {
    id: 16,
    slug: 'karpathy-ai-coding-rules',
    title: 'GitHub 6万星！Karpathy 的 AI 编码铁律：如何让 AI 乖乖写代码（附 Antigravity Knowledge 配置教程）',
    image: karpathyRulesThumb,
    date: '2026-04-22',
    author: '数维探索',
    views: '8,623',
    category: '教程',
    duration: '08:00',
    excerpt: 'GitHub 趋势榜第一、Star 破6万的 AI 编码规范项目——基于 Karpathy 经验的4条铁律，配合 Antigravity Knowledge 全局配置，让 AI 写出更可控的代码。',
    tags: [{ name: 'AI工具', type: 'blue' }, { name: 'Antigravity', type: 'blue' }, { name: 'CLAUDE.md', type: 'green' }],
    collection: 'AI百科',
    relatedIds: [1, 2, 5],
    recommendationIds: [1, 5, 14, 2],
    gallery: [],
    markdownContent: `这是目前 GitHub 前端/AI 圈最火的方向。因为大家都在用 AI 写代码，发现 AI 容易"放飞自我"（写得太复杂、乱改代码），所以大神们总结了一套**"如何让 AI 乖乖写代码"**的知识库。

- **项目名称**：**\`andrej-karpathy-skills\`** (或者叫 \`CLAUDE.md\` 规范)

- **火爆程度**：一周内冲上趋势榜第一，Star 数破 6 万。

- 核心内容

  这不是代码，而是一份 Markdown 文档。它基于 AI 大神 Andrej Karpathy 的经验，总结了 4 条 AI 必须遵守的铁律：

  1. **编码前思考**：遇到歧义先问，别瞎猜。
  2. **简洁优先**：能用 50 行写完，绝不写 200 行（拒绝过度抽象）。
  3. **精准修改**：只改必须改的地方，别顺手重构别人的代码。
  4. **目标驱动**：先写测试复现 Bug，再修复它。

- **怎么用**：
  你可以直接把它的核心内容复制到你 Antigravity 的 \`knowledge\` 目录里，或者在项目根目录放一个 \`CLAUDE.md\` 文件。这能极大提升 AI 写前端代码的"听话程度"。

全局添加 Antigravity 的 Knowledge（知识库）非常简单，这相当于给你的 AI 装上一个"永久记忆体"。一旦配置好，无论你打开哪个项目，AI 都会自动读取这些规则，不需要重复配置。

以下是具体的操作步骤：

### 第一步：找到或创建全局目录

\`Antigravity\`的全局配置通常存储在用户主目录下的 \`.gemini\` 文件夹中。

1. **打开文件资源管理器**（Windows）或 **访达**（Mac）。

2. 进入以下路径

   - **Windows**: \`C:\\\\Users\\\\你的用户名\\\\.gemini\\\\antigravity\\\\\`
   - **Mac / Linux**: \`~/.gemini/antigravity/\`

3. 检查目录

   查看是否存在名为 \`knowledge\` 的文件夹。

   - **如果没有**：请手动新建一个文件夹，命名为 \`knowledge\`。

> **小贴士**：\`.gemini\` 是隐藏文件夹。
>
> - **Windows**: 如果看不到，需要在查看选项中勾选"隐藏的项目"。
> - **Mac**: 在访达中按 \`Command + Shift + .\` 可以显示隐藏文件。

把对应的CLAUDE.md放在\`knowledge\`这个文件夹下面即可

\`\`\`markdown
# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" -> "Write tests for invalid inputs, then make them pass"
- "Fix the bug" -> "Write a test that reproduces it, then make it pass"
- "Refactor X" -> "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

1. [Step] -> verify: [check]
2. [Step] -> verify: [check]
3. [Step] -> verify: [check]

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.
\`\`\`

**Trae** 的全局配置通常在用户主目录下：
Windows: \`C:\\\\Users\\\\你的用户名\\\\.trae\\\\\`
Mac: \`~/.trae/\`
创建规则文件
在 .trae 目录下，找到或新建一个名为 rules 或 knowledge 的文件夹。
` + mandatoryFooter
  },
  {
    id: 17,
    slug: 'knowledge-vs-workflows',
    title: 'Antigravity 深度解析：Knowledge（知识库）vs Workflows（工作流）——AI 编程的内功与外功',
    image: knowledgeVsWorkflowsThumb,
    date: '2026-04-22',
    author: '数维探索',
    views: '3,450',
    category: '教程',
    duration: '06:00',
    excerpt: 'Knowledge 是 AI 的"内功心法"（静态知识），Workflows 是"外功招式"（动态指令）。前者决定下限，后者决定上限。本文用厨师比喻带你彻底搞懂两者的区别与最佳实践。',
    tags: [{ name: 'Antigravity', type: 'blue' }, { name: 'Knowledge', type: 'blue' }, { name: 'Workflows', type: 'green' }],
    collection: 'AI百科',
    relatedIds: [16, 5, 14],
    recommendationIds: [16, 5, 14, 1],
    gallery: [],
    markdownContent: `这两个概念虽然都是用来"调教"AI 的，但它们的作用机制完全不同。

简单来说：**Knowledge 是"内功心法"（静态知识），Workflows 是"外功招式"（动态指令）。**

为了让你更直观地理解，我们可以把 AI 想象成一个**厨师**：

### Knowledge (知识库) = 厨师的"参考书"与"口味偏好"

- **性质**：**静态的、被动的**。

- **作用**：它告诉 AI **"是什么"** 和 **"喜欢什么"**。

- 内容

  - 你的技术栈偏好（如：只用 React，不用 Vue）。
  - 项目的背景文档（如：API 接口文档、数据库结构图）。
  - 代码风格指南（如：变量命名规范、缩进习惯）。

- **触发方式**：**自动触发**。只要你提问，AI 就会先去翻阅这些"书"，确保回答符合你的规范。

- **你的场景**：你在 \`knowledge\` 目录里写"必须响应式"，AI 写代码时就会**潜意识**地加上媒体查询，不需要你每次都喊口号。

### Workflows (工作流) = 厨师的"标准作业程序"

- **性质**：**动态的、主动的**。

- **作用**：它告诉 AI **"怎么做"** 和 **"步骤是什么"**。

- 内容
  - 具体的执行步骤（如：第一步先搜索配色，第二步再生成代码）。
  - 调用的外部工具（如：运行 Python 脚本、执行 Shell 命令）。
  - 复杂的逻辑判断（如：如果报错，就自动重试）。

- **触发方式**：**手动触发**（通常通过斜杠命令）。你需要明确喊出 \`/ui-ux-pro-max\`，AI 才会启动这一套复杂的流程。

- **你的场景**：\`UI-UX Pro Max\` 就是一个 Workflow。它不仅仅是知道"要好看"，而是**实际运行**了一个 Python 脚本去搜索配色方案，然后把结果填入代码中。

### 总结对比表

| 维度 | Knowledge (知识库) | Workflows (工作流) |
| --- | --- | --- |
| **核心逻辑** | 上下文注入 | 任务自动化 |
| **比喻** | 员工手册、设计规范文档 | 自动化流水线、专用工具 |
| **AI 的行为** | 哦，原来老板喜欢这样，我记住了 | 收到指令！开始执行操作步骤 |
| **文件形式** | .md 文档、.txt 文本 | .md (带指令格式)、.json 配置 |
| **前端应用** | 规定用 Tailwind、TypeScript | 自动搜索配色、运行测试脚本 |
| **典型指令** | (无，自动生效) | /ui-ux-pro-max, /test, /deploy |

### 针对你的建议

作为前端工程师，这两者你是**都要用**的，它们互补：

1. **用 Knowledge 打底**：
   在 \`knowledge\` 目录里写好你的《前端规范》（React + Tailwind + 响应式）。这样，哪怕你只是随口问一句"写个按钮"，它生成的代码也是符合你项目标准的。
2. **用 Workflows 攻坚**：
   当你需要做一个**非常复杂、需要特定流程**的任务时（比如"帮我设计一套全新的设计系统"），这时候调用 \`/ui-ux-pro-max\` 这个 Workflow，让它去跑脚本、查资料、生成全套方案。

**一句话总结：Knowledge 决定了 AI 的"下限"（不会写出烂代码），Workflows 决定了 AI 的"上限"（能帮你干复杂的大活）。**
` + mandatoryFooter
  },
  {
    id: 18,
    slug: 'ai-knowledge-advanced-management',
    title: 'AI 知识库实战：分类管理进阶与三大核心配置模板',
    image: aiKnowledgeAdvancedThumb,
    date: '2026-04-22',
    author: '数维探索',
    views: '5,102',
    category: '教程',
    duration: '07:00',
    excerpt: '将 AI 规则拆分为前端规范、接口文档和设计系统，附赠直接可用的高频 API 模板与 Tailwind UI/UX 原则，让 AI 秒变全能前端助手。',
    tags: [{ name: 'AI知识库', type: 'blue' }, { name: '前沿趋势', type: 'green' }],
    collection: 'AI百科',
    relatedIds: [17, 16],
    recommendationIds: [17, 16, 5, 14],
    gallery: [],
    markdownContent: `### 💡 进阶技巧：分类管理

如果你的规则很多，可以把它们拆分成多个文件放在 \`knowledge\` 目录下，Antigravity 会读取该目录下所有的 Markdown 文件：

- \`frontend-rules.md\` (放代码规范)
- \`company-api-docs.md\` (放公司的 API 文档，方便随时调用)
- \`ui-design-system.md\` (放设计系统的配色和字体规范)

这样，无论你在哪里，AI 都随身携带着你的"前端开发百科全书"

### 第一步：创建你的"前端规范"文件

在这个 \`knowledge\` 文件夹里，你可以创建任意数量的 \`.md\` (Markdown) 文件。建议创建一个名为 \`frontend-rules.md\` 的文件，专门存放你的前端开发铁律。

**文件内容示例（你可以直接复制并修改）：**

\`\`\`markdown
1# 前端开发核心规范
2
3## 1. 技术栈偏好
4- **框架**: 始终优先使用 React (Next.js App Router)。
5- **语言**: 必须使用 TypeScript，严禁使用 \`any\` 类型。
6- **样式**: 必须使用 Tailwind CSS。禁止使用原生 CSS 文件或 styled-components。
7- **图标**: 优先使用 \`lucide-react\`。
8
9## 2. 代码风格
10- **组件**: 使用函数式组件和 Hooks。
11- **命名**: 文件使用 kebab-case (如 \`user-card.tsx\`)，组件使用 PascalCase。
12- **结构**: 保持组件单一职责，一个文件只导出一个主要组件。
13
14## 3. UI/UX 原则
15- **响应式**: 所有布局必须默认移动端优先 (Mobile First)。
16- **交互**: 按钮和链接必须有 \`hover\` 状态反馈。
17- **无障碍**: 图片必须包含 \`alt\` 属性，表单输入必须关联 \`label\`。
18
19## 4. 禁止事项
20- ❌ 禁止使用 jQuery。
21- ❌ 禁止使用内联样式 \`style="..."\`。
22- ❌ 禁止在组件中硬编码文字内容。
\`\`\`

#### 🚀 验证生效

配置完成后，**重启 Antigravity 客户端**（如果它正在运行）。

你可以通过以下方式验证是否生效：

1. 随便打开一个项目（或者新建一个空项目）。
2. 在对话框输入："帮我写一个登录框"。
3. 观察结果
   - 如果 AI 自动使用了 **React + TypeScript**。
   - 如果 AI 自动使用了 **Tailwind CSS** 类名。
   - 如果 AI 自动考虑了 **移动端适配**。

那么恭喜你，你的全局 Knowledge 已经成功"附体"到 AI 身上了！

### 第二步：接口文档，变成了 AI 随时能查阅的"随身笔记"

这个文件其实就是把你那些原本要反复复制粘贴的接口文档，变成了 AI 随时能查阅的"随身笔记"。

它的核心目的只有一个：**让 AI 在不联网、不看 Swagger 的情况下，也能精准地写出符合你后端要求的 API 调用代码。**

一个高质量的 \`company-api-docs.md\` 通常包含以下 4 个核心板块。你可以直接参考这个模板来填充你们公司的实际接口信息：

#### 📋 通用配置板块

这部分告诉 AI 请求的基础信息，避免它每次都问你"接口地址是多少"或者"Header 要带什么"。

\`\`\`markdown
1## 1. 基础配置
2- **Base URL**: \`https://api.your-company.com/v1\`
3- **认证方式**: Bearer Token (JWT)
4- **通用请求头**:
5  - \`Content-Type\`: \`application/json\`
6  - \`Authorization\`: \`Bearer <token>\`
7- **通用响应结构**:
8  所有接口返回的数据都包裹在一个标准结构中：
9  \`\`\`json
10  {
11    "code": 200, // 200表示成功，非200表示业务错误
12    "msg": "success", // 错误信息
13    "data": { ... } // 实际数据载荷
14  }
\`\`\`

\`\`\`markdown
1
2### 📚 核心数据模型板块
3不要把所有字段都写上去，只写**高频复用**的实体。这能防止 AI 瞎编字段名（比如把 \`userName\` 写成 \`username\`，导致前端报错）。
4
5\`\`\`markdown
6## 2. 核心数据类型
7### 用户
8- \`id\`: string - 用户唯一标识 (UUID)
9- \`username\`: string - 登录用户名
10- \`email\`: string - 邮箱
11- \`role\`: enum - 角色 ('admin', 'editor', 'viewer')
12- \`status\`: enum - 状态 ('active', 'banned')
13
14### 商品
15- \`sku\`: string - 库存单位编码
16- \`price\`: number - 价格 (单位: 分，不是元！)
17- \`stock\`: number - 库存数量
\`\`\`

#### 🔌 高频接口板块

这是最有价值的部分。只记录**最常用**的接口，或者**逻辑最复杂**的接口。

**格式建议**：使用类似 Swagger 的简洁写法，或者直接贴 curl 示例。



\`\`\`markdown
1## 3. 常用接口定义
2
3### 获取用户列表 (分页)
4- **URL**: \`GET /users\`
5- **参数**:
6  - \`page\`: number (默认 1)
7  - \`pageSize\`: number (默认 10)
8  - \`role\`: string (可选，筛选角色)
9- **返回示例**:
10  \`\`\`json
11  {
12    "code": 200,
13    "data": {
14      "list": [ ...用户数组... ],
15      "total": 100
16    }
17  }
\`\`\`

#### 创建订单

- **URL**: \`POST /orders\`

- 请求体

  \`\`\`json
  1{
  2  "userId": "string",
  3  "items": [
  4    { "sku": "string", "count": "number" }
  5  ]
  6}
  \`\`\`

- **特殊逻辑**: 创建订单前必须检查库存，如果库存不足直接返回 code 4001。

\`\`\`markdown
1
2### ⚠️ 业务逻辑与坑点板块
3这是 AI 绝对不知道的"隐形知识"。比如某些字段虽然叫 \`price\`，但其实是"分"不是"元"；或者某些状态流转的特殊规则。
4
5\`\`\`markdown
6## 4. 业务规则与注意事项
7- **金额处理**: 所有涉及金额的字段（price, totalAmount）后端返回的都是**整数（分）**，前端展示时必须除以 100。
8- **日期格式**: 后端所有时间字段都是 Unix 时间戳 (毫秒)，不是字符串。
9- **图片地址**: 接口返回的 \`avatar\` 只是相对路径，前端需要拼接 CDN 域名 \`https://cdn.your-company.com\`。
10- **状态码**:
11  - \`401\`: Token 过期，需跳转登录。
12  - \`4001\`: 库存不足。
13  - \`4002\`: 优惠券不可用。
\`\`\`

### 📌 总结：怎么写才好用？

1. **只写"热"数据**：不要把你公司几百个接口全贴上去，AI 会看晕。只贴你每天开发都要用的那 10-20 个核心接口。
2. **保持更新**：如果后端改了字段（比如把 \`userName\` 改成了 \`nickname\`），记得同步更新这个文件。
3. **格式清晰**：AI 喜欢结构化的数据，用 Markdown 的列表和代码块排版，它理解得最快。

把这个文件放进全局 \`knowledge\` 目录后，你下次只要说："帮我写个获取用户列表的函数"，AI 就会自动知道要请求 \`/users\`，要处理分页，还要把金额除以 100。

### 第三步：UI 设计系统规范 ui-design-system.md

本文件定义了项目的全局视觉规范。所有前端代码生成必须严格遵循以下变量和原则，以确保 UI 的一致性。

#### 1. 设计令牌

所有样式必须使用 Tailwind CSS 的 \`extend\` 配置或标准工具类，禁止使用硬编码的十六进制颜色或像素值。

**色彩系统**

- **主色调**: \`primary-500\` (#3B82F6) - 用于主要按钮、激活状态、链接。

- 功能色
  - \`success-500\` (#10B981) - 成功提示、完成状态。
  - \`warning-500\` (#F59E0B) - 警告提示、待处理状态。
  - \`danger-500\` (#EF4444) - 错误提示、删除操作。

- 中性色
  - 背景: \`gray-50\` (浅色模式背景), \`gray-900\` (深色模式背景)。
  - 文本: \`gray-900\` (主标题), \`gray-600\` (正文), \`gray-400\` (次要文本/占位符)。

- **边框**: \`gray-200\` (默认分割线), \`gray-300\` (输入框边框)。

**排版系统**

- **字体家族**: Inter, system-ui, sans-serif.

- 字号
  - 超大标题: \`text-4xl\` (2.25rem) - 页面主标题。
  - 大标题: \`text-2xl\` (1.5rem) - 卡片标题。
  - 正文: \`text-base\` (1rem) - 标准内容。
  - 小字: \`text-sm\` (0.875rem) - 辅助说明、图注。

- 字重
  - 粗体: \`font-bold\` (700) - 强调。
  - 中等: \`font-medium\` (500) - 按钮、标题。
  - 常规: \`font-normal\` (400) - 正文。

**间距与布局**

- **基础单位**: 4px (Tailwind 默认单位)。

- 常用间距
  - 紧凑: \`p-2\`, \`p-4\` (组件内部填充)。
  - 标准: \`p-6\`, \`p-8\` (卡片、容器填充)。
  - 宽松: \`gap-4\`, \`gap-6\` (元素间距)。

- 圆角
  - 小元素: \`rounded\` (4px) - 按钮、标签。
  - 容器: \`rounded-lg\` (8px) - 卡片、模态框、输入框。
  - 全屏: \`rounded-full\` - 头像。

**阴影与层级**

- **卡片阴影**: \`shadow-sm\` (默认), \`shadow-md\` (悬浮/悬停)。

- **模态框阴影**: \`shadow-xl\`。

- 层级
  - 下拉菜单: \`z-10\`。
  - 模态框: \`z-50\`。
  - 提示条: \`z-50\`。
` + mandatoryFooter
  },
  {
    id: 19,
    slug: 'global-skill-configuration-uipro',
    title: '全局技能配置实战：如何在所有项目中通用 UI-UX Pro Max',
    image: globalSkillConfigurationThumb,
    date: '2026-04-22',
    author: '数维探索',
    views: '2,109',
    category: '教程',
    duration: '06:00',
    excerpt: '深入解析 Antigravity 技能架构的“全局库+项目引用”模式，两步实现在任意项目中全局调用 UI-UX Pro Max 技能，彻底解放生产力。',
    tags: [{ name: 'AI工具', type: 'blue' }, { name: '开发指南', type: 'green' }],
    collection: 'AI百科',
    relatedIds: [18, 17],
    recommendationIds: [18, 17, 16, 5],
    gallery: [],
    markdownContent: `要在**所有项目**中都使用 \`UI-UX Pro Max Skill\`，你需要理解 Antigravity 的技能架构是**"全局库 + 项目级引用"**的模式。

简单来说，你需要做两件事：

1. **全局安装**：把技能包下载到你电脑的"仓库"里（只需做一次）。
2. **项目配置**：在每个项目中创建一个"遥控器"（Workflow 文件），告诉 Antigravity 去"仓库"里调用这个技能。

以下是实现"全项目通用"的完整操作指南：

### 🛠️ 第一步：全局安装（只需执行一次）

首先，确保你的电脑里已经有了这个技能的"本体"。

1. 打开终端，运行以下命令安装 CLI 工具（如果之前装过可跳过）：

   \`\`\`bash
   npm install -g uipro-cli
   \`\`\`

2. 安装到当前项目

   \`\`\`bash
   # Go to your project
   cd /path/to/your/project
   
   # Install for your AI assistant
   uipro init --ai claude      # Claude Code
   uipro init --ai cursor      # Cursor
   uipro init --ai windsurf    # Windsurf
   uipro init --ai antigravity # Antigravity
   \`\`\`

3. 安装到全局目录

   为了确保所有项目都能找到它，建议确认技能已存在于 Antigravity 的全局目录中。

   - **目录路径**：\`~/.gemini/antigravity/skills/\`

   - 操作

     \`\`\`bash
     cd ~/.gemini/antigravity/skills
     # 如果目录下没有 ui-ux-pro-max-skill 文件夹，请运行：
     git clone https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git
     \`\`\`

   - *此时，你的全局仓库里已经有了这个技能。*

---

### 🔌 第二步：如何在"所有项目"中生效

由于 Antigravity 的设计初衷是**项目级隔离**（避免不同项目加载过多无用技能导致变慢），它**没有**一个"一键全局开启"的开关。

要在每个项目中使用，你有两种策略：

#### 策略 A：标准做法（在每个项目中初始化）

这是最推荐的做法，因为它会在项目中生成必要的配置文件，确保技能稳定运行。

1. 进入你的项目目录。

2. 运行初始化命令：

   \`\`\`bash
   uipro init --ai antigravity
   \`\`\`

3. **原理**：这个命令会自动在你的项目根目录创建 \`.agent/skills/ui-ux-pro-max.md\` 文件。这个文件就是"遥控器"，它指向你第一步中安装的全局技能。

4. **建议**：将 \`.agent/\` 目录添加到你的 \`.gitignore\` 文件中，以免污染代码库。

#### 策略 B：手动复用（如果你不想在每个项目都敲命令）

如果你已经在一个项目中配置好了，想快速应用到另一个项目，可以直接复制配置文件。

1. 在**已配置好的项目**中，找到 \`.agent/skills/ui-ux-pro-max.md\` 文件。
2. 将其**复制**到**新项目**的 \`.agent/skills/\` 目录下（如果没有该目录则新建）。
3. 重启 Antigravity，新项目中即可直接通过 \`/ui-ux-pro-max\` 调用。

---

### 🚀 第三步：验证与使用

配置完成后，你可以在任何项目中通过以下方式验证并使用：

1. **查看技能列表**：
   在 Antigravity 对话框输入 \`/\`，你应该能看到 \`ui-ux-pro-max\` 出现在列表中。

2. 直接使用

   输入指令即可触发全局技能：

   > \`/ui-ux-pro-max 为这个项目设计一个现代化的登录页面，使用深色模式\`

### 💡 核心提示

- **不要手动修改全局文件**：\`~/.gemini/antigravity/skills/\` 下的内容是"只读"的库。如果你需要微调技能行为，请在**项目级**的 \`.agent/skills/\` 文件中修改，或者创建新的 Workflow 文件指向全局库。
- **依赖检查**：确保你的每个项目环境（或全局环境）都安装了 **Python 3**，因为 \`UI-UX Pro Max\` 的核心搜索功能依赖 Python 脚本运行。
` + mandatoryFooter
  }
].reverse();

// 标签
export const allTags = [
  'AI百科', '2.5G网络', '2026',  'AI', 'AI IDE', 'AI Studio', 'AI工具', 'AI学习', 'AI新闻', 'AI编程', 'AI趋势', 'acme.sh', 'Antigravity', 'Claude', 'DeepSeek', 'Gemini', 'Mac OS', 'Python', '账号解封', 'Wireshark', 'Windows XP', '抓包', '开发指南', 'Web Worker', 'Service Worker', 'PWA', 'CLAUDE.md', 'Knowledge', 'Workflows', 'AI知识库', '前沿趋势'
];
// 合集
export const allCollections = [
  'AI百科', 'Docker百科', '地图', '数维探索工具箱', '数维探索 行业研报'
];
// 内容类型：文章
export const allTypes = [
  '视频', '文章', '教程', '新闻', '评测', '展望'
];
