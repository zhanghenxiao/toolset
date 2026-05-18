/**
 * 静态页面生成脚本 (SSG)
 * 目的：为每篇文章生成包含完整内容的静态 HTML，
 * 满足 Google AdSense 对"高质量内容"的要求。
 */
const fs = require('fs');
const path = require('path');

// 输出目录（网站根目录）
const outDir = path.resolve(__dirname, '../../');
const templatePath = path.join(outDir, 'index.html');
const mockDataPath = path.resolve(__dirname, '../src/data/mockData.js');

if (!fs.existsSync(templatePath)) {
    console.error('❌ 找不到 index.html:', templatePath);
    process.exit(1);
}

const templateHtml = fs.readFileSync(templatePath, 'utf-8');
const mockDataRaw = fs.readFileSync(mockDataPath, 'utf-8');

// ─────────────────────────────────────────────
// 1. 提取文章数据（slug / title / date / excerpt / markdownContent）
// ─────────────────────────────────────────────
function extractItems(src) {
    const items = [];
    // 逐段提取对象块
    const blockRe = /\{\s*id:\s*(\d+),\s*slug:\s*'([^']+)'([\s\S]*?)(?=\},\s*\{|\}\s*\])/g;
    let m;
    while ((m = blockRe.exec(src)) !== null) {
        const block = m[3];

        const getStr = (key) => {
            const r = new RegExp(`${key}:\\s*'((?:[^'\\\\]|\\\\.)*)'`);
            const hit = block.match(r);
            return hit ? hit[1].replace(/\\'/g, "'") : '';
        };

        // markdownContent 用模板字符串，需要特殊处理
        const mdRe = /markdownContent:\s*`([\s\S]*?)` \+ mandatoryFooter/;
        const mdHit = block.match(mdRe);
        const markdown = mdHit ? mdHit[1] : '';

        const dateRe = /date:\s*'([^']+)'/;
        const dateHit = block.match(dateRe);

        const viewsRe = /views:\s*'([^']+)'/;
        const viewsHit = block.match(viewsRe);

        items.push({
            id: parseInt(m[1]),
            slug: m[2],
            title: getStr('title'),
            excerpt: getStr('excerpt'),
            date: dateHit ? dateHit[1] : '',
            views: viewsHit ? viewsHit[1] : '',
            markdown: markdown.trim(),
        });
    }
    return items;
}

const items = extractItems(mockDataRaw);
console.log(`✅ 提取到 ${items.length} 篇文章`);

// ─────────────────────────────────────────────
// 2. 极简 Markdown → HTML 转换（无需依赖）
// ─────────────────────────────────────────────
function mdToHtml(md) {
    if (!md) return '';
    let html = md
        // 转义特殊字符（防 XSS）
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        // 代码块
        .replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        // 行内代码
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // 标题 h1-h6
        .replace(/^#{6}\s(.+)$/gm, '<h6>$1</h6>')
        .replace(/^#{5}\s(.+)$/gm, '<h5>$1</h5>')
        .replace(/^#{4}\s(.+)$/gm, '<h4>$1</h4>')
        .replace(/^#{3}\s(.+)$/gm, '<h3>$1</h3>')
        .replace(/^#{2}\s(.+)$/gm, '<h2>$1</h2>')
        .replace(/^#{1}\s(.+)$/gm, '<h1>$1</h1>')
        // 加粗
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // 斜体
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // 引用
        .replace(/^&gt;\s(.+)$/gm, '<blockquote>$1</blockquote>')
        // 无序列表
        .replace(/^\s*[-*]\s(.+)$/gm, '<li>$1</li>')
        // 有序列表
        .replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>')
        // 分隔线
        .replace(/^---+$/gm, '<hr>')
        // 表格行（简单支持）
        .replace(/^\|(.+)\|$/gm, (_, row) => {
            if (row.includes('---')) return '';
            const cells = row.split('|').map(c => `<td>${c.trim()}</td>`).join('');
            return `<tr>${cells}</tr>`;
        })
        // 链接
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" rel="nofollow">$1</a>')
        // 段落（连续空行分隔）
        .replace(/\n{2,}/g, '</p><p>')
        // 换行
        .replace(/\n/g, '<br>');

    return `<p>${html}</p>`;
}

// ─────────────────────────────────────────────
// 3. 生成完整内容的静态页面
// ─────────────────────────────────────────────
const siteHost = 'https://toolset.site';

function buildFallbackDiv(title, description, bodyHtml) {
    return `<div id="ssr-content" style="max-width:860px;margin:0 auto;padding:32px 20px;font-family:'PingFang SC','Microsoft YaHei',sans-serif;color:#1a1a1a;line-height:1.8;">
  <nav style="margin-bottom:24px;font-size:14px;color:#666;">
    <a href="/" style="color:#6366F1;text-decoration:none;">数维探索_IT</a>
    <span style="margin:0 8px;">›</span>
    <span>${title}</span>
  </nav>
  <article>
    <h1 style="font-size:1.75rem;font-weight:700;margin-bottom:12px;color:#111;line-height:1.4;">${title}</h1>
    <p style="color:#555;font-size:1.05rem;margin-bottom:28px;padding:16px;background:#f8f9fa;border-left:4px solid #6366F1;border-radius:4px;">${description}</p>
    <div class="article-body" style="font-size:1rem;color:#222;">
      ${bodyHtml}
    </div>
  </article>
  <footer style="margin-top:48px;padding-top:24px;border-top:1px solid #eee;text-align:center;color:#888;font-size:13px;">
    <p>专注于分享经过验证的开发技巧与实用资源 · <a href="/" style="color:#6366F1;">返回首页</a> · <a href="/privacy-policy" style="color:#6366F1;">隐私政策</a></p>
  </footer>
</div>`;
}

function generatePage(routeDir, title, description, bodyHtml, canonicalPath) {
    let html = templateHtml
        .replace(/<title>.*?<\/title>/, `<title>${escHtml(title)} - 数维探索_IT</title>`)
        .replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${escHtml(description)}">` )
        .replace(/<html lang="[^"]*">/, '<html lang="zh-CN">');

    // 注入 canonical
    const canonicalTag = `<link rel="canonical" href="${siteHost}${canonicalPath}">`;
    if (!html.includes(canonicalTag)) {
        html = html.replace('</head>', `  ${canonicalTag}\n</head>`);
    }

    // 精确替换 <div id="app"> 内部全部内容（支持嵌套 div）
    const fallbackDiv = buildFallbackDiv(title, description, bodyHtml);
    html = replaceAppDiv(html, fallbackDiv);

    const dirPath = path.join(outDir, routeDir);
    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(path.join(dirPath, 'index.html'), html, 'utf-8');
    console.log(`  ✓ 生成: /${routeDir}`);
}

function escHtml(s) {
    return (s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * 精确替换 HTML 中 <div id="app">...</div> 的全部内容。
 * 策略：找到 <div id="app"> 的位置，然后从该位置向后逐字符跟踪嵌套深度，
 * 找到与之配对的 </div>，整体替换为新内容。
 */
function replaceAppDiv(html, innerContent) {
    const startTag = '<div id="app">';
    const startIdx = html.indexOf(startTag);
    if (startIdx === -1) {
        // 找不到 app div，降级：在 </body> 前插入
        console.warn('  ⚠️  未找到 <div id="app">，降级插入到 </body> 前');
        return html.replace('</body>', `<div id="app">${innerContent}</div>\n</body>`);
    }

    // 从 startTag 末尾开始，跟踪嵌套深度找匹配的 </div>
    let depth = 1;
    let i = startIdx + startTag.length;
    while (i < html.length && depth > 0) {
        if (html[i] === '<') {
            if (html.startsWith('</div>', i)) {
                depth--;
                if (depth === 0) break;
                i += 6; // 跳过 </div>
            } else if (html.startsWith('<div', i) && (html[i + 4] === ' ' || html[i + 4] === '>')) {
                depth++;
                i++;
            } else {
                i++;
            }
        } else {
            i++;
        }
    }

    // i 现在指向配对 </div> 的 '<'
    const endIdx = i + 6; // 跳过 </div>
    return html.slice(0, startIdx) + startTag + innerContent + '</div>' + html.slice(endIdx);
}

// ─────────────────────────────────────────────
// 4. 为所有文章生成详情页
// ─────────────────────────────────────────────
for (const item of items) {
    if (!item.slug) continue;
    const bodyHtml = mdToHtml(item.markdown) || `<p>${escHtml(item.excerpt)}</p>`;
    generatePage(
        `detail/${item.slug}`,
        item.title,
        item.excerpt,
        bodyHtml,
        `/detail/${item.slug}`
    );
}

// ─────────────────────────────────────────────
// 5. 生成首页 index.html（含文章列表）
// ─────────────────────────────────────────────
const articleListHtml = items.slice().reverse().map(item => `
  <article style="border-bottom:1px solid #eee;padding:20px 0;">
    <h2 style="font-size:1.1rem;margin-bottom:8px;">
      <a href="/detail/${item.slug}" style="color:#1a1a1a;text-decoration:none;">${escHtml(item.title)}</a>
    </h2>
    <p style="color:#555;font-size:0.9rem;margin-bottom:8px;">${escHtml(item.excerpt)}</p>
    <span style="color:#999;font-size:0.8rem;">${item.date} · 浏览 ${item.views || 0} 次</span>
  </article>`).join('');

const homeBodyHtml = `
<div style="margin-bottom:32px;">
  <p style="color:#555;font-size:1.05rem;line-height:1.8;">
    数维探索_IT 是一个专注于 <strong>AI 工具教程</strong>、<strong>Web 前端开发</strong>、<strong>实用开发者工具</strong>的技术知识库。
    我们整理了经过验证的开发技巧，涵盖 Google Antigravity、Gemini、Claude 等前沿 AI IDE 的深度使用指南，
    以及 Mapbox、Leaflet、Chrome 插件等 Web 开发实战教程，致力于为开发者节省检索信息的时间。
  </p>
</div>
<h2 style="font-size:1.3rem;font-weight:700;margin-bottom:16px;color:#111;">最新文章</h2>
${articleListHtml}
<p style="text-align:center;margin-top:32px;">
  <a href="/tools" style="color:#6366F1;text-decoration:none;">查看开发者工具站 →</a>
</p>`;

// 覆盖生产 index.html 的 fallback 内容
{
    const homeTitle = '数维探索_IT - AI工具指南与Web开发教程';
    const homeDesc = '数维探索_IT 专注于分享高质量 AI 工具使用指南、Web 前端开发教程、Google Antigravity、Gemini、Claude 实战经验及实用开发者工具。';
    const fallbackDiv = `<div id="ssr-content" style="max-width:860px;margin:0 auto;padding:32px 20px;font-family:'PingFang SC','Microsoft YaHei',sans-serif;color:#1a1a1a;line-height:1.8;">
  <header style="margin-bottom:32px;text-align:center;">
    <h1 style="font-size:2rem;font-weight:700;color:#111;margin-bottom:12px;">数维探索_IT</h1>
    <p style="color:#555;font-size:1.05rem;">AI 工具使用指南 · Web 前端开发教程 · 实用开发者工具</p>
  </header>
  ${homeBodyHtml}
  <footer style="margin-top:48px;padding-top:24px;border-top:1px solid #eee;text-align:center;color:#888;font-size:13px;">
    <p><a href="/privacy-policy" style="color:#6366F1;">隐私政策</a> · <a href="/tools" style="color:#6366F1;">工具站</a></p>
  </footer>
</div>`;

    let homeHtml = templateHtml
        .replace(/<title>.*?<\/title>/, `<title>${homeTitle}</title>`)
        .replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${homeDesc}">`)
        .replace(/<html lang="[^"]*">/, '<html lang="zh-CN">');

    // 注入 canonical 并防止多次运行重复注入
    const homeCanonical = `<link rel="canonical" href="${siteHost}/">`;
    if (!homeHtml.includes(homeCanonical)) {
        homeHtml = homeHtml.replace('</head>', `  ${homeCanonical}\n</head>`);
    }

    // 精确替换 <div id="app"> 内部全部内容（支持嵌套 div）
    homeHtml = replaceAppDiv(homeHtml, fallbackDiv);

    fs.writeFileSync(path.join(outDir, 'index.html'), homeHtml, 'utf-8');
    console.log('  ✓ 更新: /index.html (含文章列表)');
}

// ─────────────────────────────────────────────
// 6. 隐私政策页
// ─────────────────────────────────────────────
generatePage(
    'privacy-policy',
    '隐私政策 - Privacy Policy',
    '数维探索_IT 的隐私政策，说明我们如何通过 Google AdSense 与 Cookie 收集和处理信息。',
    `<h2>一、信息收集</h2>
<p>本网站（toolset.site，以下简称"本站"）使用 <strong>Google AdSense</strong> 服务投放广告。Google AdSense 可能会使用 Cookie 和 Web Beacon 等技术，根据您的浏览行为向您展示相关广告内容。</p>
<h2>二、Cookie 的使用</h2>
<p>Cookie 是存储在您设备上的小型文本文件。本站使用以下类型的 Cookie：</p>
<ul style="margin-left:1.5em;line-height:2;">
  <li><strong>功能性 Cookie</strong>：用于记住您的偏好设置（如语言、主题）。</li>
  <li><strong>分析性 Cookie</strong>：通过 Google Analytics 统计页面访问量，帮助我们改善内容质量。所有数据均匿名处理。</li>
  <li><strong>广告 Cookie</strong>：由 Google AdSense 设置，用于向您展示个性化广告。Google 可能会将这些信息与其持有的其他信息结合使用。</li>
</ul>
<p>您可以通过浏览器设置随时禁用 Cookie，但这可能会影响部分网站功能。</p>
<h2>三、Google AdSense 与个性化广告</h2>
<p>本站使用 Google AdSense（发布商 ID：ca-pub-1428955758026835）提供广告服务。Google 作为第三方广告供应商，会使用 Cookie 根据用户对本站及其他网站的访问情况提供广告。</p>
<p>您可以通过访问 <a href="https://www.google.com/settings/ads" rel="nofollow">Google 广告设置</a> 页面，选择退出 Google 的个性化广告。</p>
<h2>四、第三方链接</h2>
<p>本站文章中可能包含指向第三方网站（如 GitHub、夸克网盘、百度网盘等）的链接。本站对这些第三方网站的隐私实践不承担责任，建议您在访问时查阅其各自的隐私政策。</p>
<h2>五、数据安全</h2>
<p>本站不主动收集用户的个人身份信息（如姓名、邮箱、电话）。我们采取合理的技术措施保护网站安全，但请注意互联网传输本身存在一定安全风险。</p>
<h2>六、儿童隐私</h2>
<p>本站内容面向成年开发者，不面向 13 岁以下儿童，也不会有意收集儿童的个人信息。</p>
<h2>七、政策更新</h2>
<p>本隐私政策可能会不定期更新。重大变更将在本页面公示，更新时间：2026年5月。</p>
<h2>八、联系我们</h2>
<p>如您对本隐私政策有任何疑问，请通过微信公众号"数维探索"与我们联系。</p>`,
    '/privacy-policy'
);

// ─────────────────────────────────────────────
// 7. 工具站页
// ─────────────────────────────────────────────
generatePage(
    'tools',
    '开发者工具站 - 时间戳转换、编码工具等实用在线工具',
    '数维探索_IT 工具站提供时间戳转换、Base64 编码/解码、JSON 格式化、颜色选择器等实用在线开发工具，免费使用，无需注册。',
    `<p>欢迎使用数维探索_IT 开发者工具站。我们提供一系列实用的在线工具，帮助开发者提升日常工作效率：</p>
<ul style="margin-left:1.5em;line-height:2.2;font-size:1.05rem;">
  <li><strong>Unix 时间戳转换器</strong>：快速在 Unix 时间戳与人类可读时间之间互转，支持毫秒精度。</li>
  <li><strong>Base64 编码/解码</strong>：快速对文本或 URL 进行 Base64 编解码处理。</li>
  <li><strong>JSON 格式化工具</strong>：将压缩的 JSON 字符串格式化并高亮显示，便于调试。</li>
  <li><strong>颜色选择器</strong>：支持 HEX、RGB、HSL 格式互转，前端样式开发必备。</li>
  <li><strong>视频处理工具</strong>：基于 FFmpeg.wasm 的纯前端视频剪辑与格式转换工具。</li>
</ul>
<p>所有工具均在浏览器本地运行，无需上传数据到服务器，保护您的数据隐私。</p>
<p>如有工具需求建议，欢迎通过微信公众号"数维探索"反馈。</p>`,
    '/tools'
);

// ─────────────────────────────────────────────
// 8. 生成 sitemap.xml
// ─────────────────────────────────────────────
const today = new Date().toISOString().split('T')[0];
const sitemapUrls = [
    `<url><loc>${siteHost}/</loc><changefreq>daily</changefreq><priority>1.0</priority><lastmod>${today}</lastmod></url>`,
    `<url><loc>${siteHost}/tools</loc><changefreq>weekly</changefreq><priority>0.7</priority><lastmod>${today}</lastmod></url>`,
    `<url><loc>${siteHost}/privacy-policy</loc><changefreq>monthly</changefreq><priority>0.3</priority><lastmod>${today}</lastmod></url>`,
    ...items.map(item =>
        `<url><loc>${siteHost}/detail/${item.slug}</loc><changefreq>monthly</changefreq><priority>0.8</priority><lastmod>${item.date || today}</lastmod></url>`
    )
].join('\n  ');

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapUrls}
</urlset>`;
fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemapXml, 'utf-8');
console.log('  ✓ 生成: sitemap.xml');

// ─────────────────────────────────────────────
// 9. 生成 robots.txt
// ─────────────────────────────────────────────
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteHost}/sitemap.xml
`;
fs.writeFileSync(path.join(outDir, 'robots.txt'), robotsTxt, 'utf-8');
console.log('  ✓ 生成: robots.txt');

console.log(`\n🎉 共生成 ${items.length} 篇文章 + 3 个功能页 + sitemap.xml + robots.txt`);
