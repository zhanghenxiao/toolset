const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '../../');
const indexPath = path.join(outDir, 'index.html');
const mockDataPath = path.resolve(__dirname, '../src/data/mockData.js');

if (!fs.existsSync(indexPath)) {
    console.error('index.html not found at', indexPath);
    process.exit(1);
}

const templateHtml = fs.readFileSync(indexPath, 'utf-8');
const mockData = fs.readFileSync(mockDataPath, 'utf-8');

// Regex to extract slug, title, and excerpt from mockData.js
const itemRegex = /slug:\s*'([^']+)',[\s\S]*?title:\s*'([^']+)',[\s\S]*?excerpt:\s*'([^']+)'/g;
const items = [];
let match;
while ((match = itemRegex.exec(mockData)) !== null) {
    items.push({
        slug: match[1],
        title: match[2],
        excerpt: match[3]
    });
}

const generatePage = (route, title, description, contentHtml) => {
    const dirPath = path.join(outDir, route);
    fs.mkdirSync(dirPath, { recursive: true });
    
    // Replace the fallback div with specific content
    let finalHtml = templateHtml.replace(
        /<div style="padding: 5%;.*?<\/div>/s,
        `<div style="padding: 5%; font-family: sans-serif; max-width: 800px; margin: 0 auto; color: #333;">
            <h1 style="font-size: 2rem; margin-bottom: 20px;">${title}</h1>
            <p style="font-size: 1.1rem; line-height: 1.8; color: #555;">${contentHtml}</p>
            <p style="margin-top: 30px;"><a href="/" style="color: #6366F1;">返回首页 / Back to Home</a></p>
        </div>`
    );
    
    // Update title
    finalHtml = finalHtml.replace(/<title>.*?<\/title>/, `<title>${title} - 数维探索_IT</title>`);
    
    // Update description meta tag
    finalHtml = finalHtml.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${description}">`);

    fs.writeFileSync(path.join(dirPath, 'index.html'), finalHtml);
    console.log(`Generated static page for: ${route}`);
};

// Generate for all detail pages
items.forEach(item => {
    generatePage(
        `detail/${item.slug}`, 
        item.title, 
        item.excerpt, 
        item.excerpt + '<br><br>深入探讨该领域的最佳实践与详细教程，了解更多细节请阅读全文。'
    );
});

// Generate Privacy Policy
generatePage(
    'privacy-policy',
    '隐私政策 - Privacy Policy',
    '数维探索_IT 的隐私政策，以及关于 Google AdSense 与 Cookie 的声明。',
    '欢迎访问本网站。我们深知隐私对您的重要性，并致力于保护您的个人信息。本隐私政策解释了我们如何收集、使用和保护通过 Google AdSense 投放广告时产生的信息。'
);

// Generate Tools
generatePage(
    'tools',
    '开发者工具站 - Tool Station',
    '实用的开发者效率工具，包含时间戳转换器、视频处理等。',
    '快速在 Unix 时间戳和人类可读时间之间进行准确转换，解决日常开发提效问题。'
);

console.log(`Successfully generated ${items.length + 2} static routes.`);
