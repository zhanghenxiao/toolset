import re

# Read the HTML content
with open('d:\\work\\Web\\xiaogj\\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace CSS
# We need to find the old #ai-tools css and inject new styling
old_css_start = html.find('        /* AI工具页面样式 */')
old_css_end = html.find('        /* 响应式设计 */')

new_css = """        /* AI工具整体新布局 */
        .ai-tools-layout {
            display: flex;
            gap: 24px;
            align-items: flex-start;
            margin-top: 10px;
        }

        /* 左侧边栏 */
        .ai-sidebar {
            width: 200px;
            background: #fff;
            padding: 1rem 0;
            flex-shrink: 0;
            position: sticky;
            top: 80px;
            border-right: 1px solid #eaeaea;
        }
        .sidebar-header {
            padding: 0 1.5rem 1rem;
            font-size: 1.1rem;
            font-weight: 600;
            color: #555;
            border-bottom: 1px solid #eaeaea;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .sidebar-nav {
            list-style: none;
        }
        .sidebar-nav li a {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 0.8rem 1.5rem;
            color: #333;
            text-decoration: none;
            transition: all 0.2s ease;
            font-size: 0.95rem;
            border-left: 3px solid transparent;
        }
        .sidebar-nav li a:hover {
            background-color: #f8f9fa;
        }
        .sidebar-nav li a.active {
            background-color: #fff6ee;
            color: #f97316;
            font-weight: 600;
            border-left: 3px solid #f97316;
        }
        .sidebar-nav li a span.icon-text {
            font-weight: 600;
            font-size: 1.1rem;
            width: 20px;
            text-align: center;
        }

        /* 右侧内容区 */
        .ai-content {
            flex: 1;
            background: #fff;
            border-radius: 12px;
            padding: 1.5rem 2rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            min-height: 500px;
        }

        .category-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #eaeaea;
        }
        .category-header h3 {
            margin: 0;
            font-size: 1.25rem;
            display: flex;
            align-items: center;
            font-weight: 600;
            gap: 10px;
        }
        .category-header .badge {
            background: #f1f5f9;
            color: #475569;
            font-size: 0.85rem;
            padding: 2px 8px;
            border-radius: 12px;
            font-weight: 500;
        }

        /* 工具卡片网格 */
        .ai-tools-grid-small {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.25rem;
        }

        .ai-tool-item-small {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 12px;
            padding: 1rem;
            background-color: #fff;
            border-radius: 10px;
            transition: all 0.2s ease;
            text-decoration: none;
            color: inherit;
            border: 1px solid transparent;
        }

        .ai-tool-item-small:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
            border: 1px solid #eaeaea;
            transform: translateY(-2px);
        }

        .tool-icon-small {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            object-fit: cover;
            background: #f8f9fa;
            flex-shrink: 0;
            border: 1px solid #eee;
        }

        .tool-info {
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .ai-tool-item-small h4 {
            margin: 0;
            color: #111;
            font-size: 0.95rem;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .ai-tool-item-small p {
            margin: 0;
            color: #666;
            font-size: 0.8rem;
            line-height: 1.3;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .ai-category-block {
            display: none;
            animation: fadeIn 0.3s;
        }
        .ai-category-block.active {
            display: block;
        }
"""
html = html[:old_css_start] + new_css + html[old_css_end:]

# Add media queries for the new layout
mq_insert_pos = html.find('        @media (max-width: 1200px) {')
mq_add="""        @media (max-width: 1024px) {
            .ai-tools-layout { flex-direction: column; }
            .ai-sidebar { width: 100%; border-right: none; position: static; }
            .sidebar-nav { display: flex; flex-wrap: wrap; gap: 8px; }
            .sidebar-nav li a { padding: 0.5rem 1rem; border-left: none; border-bottom: 3px solid transparent; }
            .sidebar-nav li a.active { border-left: none; border-bottom: 3px solid #f97316; }
            .ai-tools-grid-small { grid-template-columns: repeat(2, 1fr); }
        }
"""
html = html[:mq_insert_pos] + mq_add + html[mq_insert_pos:]

# Now replace the #ai-tools section
ai_tools_start = html.find('<section id="ai-tools" class="content-section">')
ai_tools_end = html.find('        <section class="ad-space">')

ai_tools_html = html[ai_tools_start:ai_tools_end]

# Extract all categories
category_pattern = r'<div class="ai-category-section">(.*?)</div>\s*</div>'
# wait, the pattern inside ai-tools-container is:
# <div class="ai-category-section">
#     <h3>...</h3>
#     <p>...</p>
#     <div class="ai-tools-grid-small">
#         ...
#     </div>
# </div>

categories = re.findall(r'<div class="ai-category-section">\s*<h3>(.*?)</h3>\s*<p>(.*?)</p>\s*<div class="ai-tools-grid-small">(.*?)</div>\s*</div>', ai_tools_html, re.DOTALL)

# Reconstruct
sidebar_items = [
    ("AI 热门应用", "🔥"),
    ("AI 对话", "💬"),
    ("AI 写作", "✍️"),
    ("</> AI 编程", "💻"),
    ("AI 设计", "🎨"),
    ("AI 作图", "🖼️"),
    ("AI 3D", "🧊"),
    ("提示词", "💡"),
    ("AI 办公", "💼"),
    ("AI 训练模型", "🧠"),
    ("影音编辑", "🎬"),
    ("效率助手", "⚡"),
    ("AI 所有应用", "🗂️"),
]

# Map old categories to active sidebar categories
cat_mapping = {
    "聊天AI": "AI 对话",
    "文章AI": "AI 写作",
    "图片AI": "AI 作图",
    "炒股AI": "AI 热门应用",
    "音频AI": "影音编辑"
}

# Group tools by mapped category
new_cats = {}
for cat_name, b, tools_html in categories:
    mapped_name = cat_mapping.get(cat_name, "AI 所有应用")
    
    # Extract tools
    tools = re.findall(r'<a href="(.*?)" target="_blank" class="ai-tool-item-small">\s*<h4>(.*?)</h4>\s*<p>(.*?)</p>\s*</a>', tools_html, re.DOTALL)
    if mapped_name not in new_cats:
        new_cats[mapped_name] = []
    new_cats[mapped_name].extend(tools)

# Build the new #ai-tools section
new_ai_tools = '<section id="ai-tools" class="content-section">\n'
new_ai_tools += '    <div class="ai-tools-layout">\n'
new_ai_tools += '        <aside class="ai-sidebar">\n'
new_ai_tools += '            <div class="sidebar-header"><span class="icon-text">📑</span> AI 导航</div>\n'
new_ai_tools += '            <ul class="sidebar-nav">\n'

for name, icon in sidebar_items:
    # First active is "AI 热门应用" but since "AI 对话" is in screenshot, let's just make it possible to click
    # Let's set default active to first one that has items
    active_cls = ' class="sidebar-link"'
    new_ai_tools += f'                <li><a href="#" data-target="{name}"{active_cls}><span class="icon-text">{icon}</span> {name}</a></li>\n'

new_ai_tools += '            </ul>\n'
new_ai_tools += '        </aside>\n'
new_ai_tools += '        <div class="ai-content">\n'


import urllib.parse
for cat_name, icon in sidebar_items:
    tools = new_cats.get(cat_name, [])
    # Only render if there are tools
    if not tools:
        # We can still output an empty container
        pass
    
    tools_count = len(tools)
    new_ai_tools += f'            <div class="ai-category-block" id="cat-{cat_name}">\n'
    new_ai_tools += f'                <div class="category-header">\n'
    new_ai_tools += f'                    <h3><span class="icon-text">{icon}</span> {cat_name} <span class="badge">{tools_count}</span></h3>\n'
    new_ai_tools += f'                </div>\n'
    new_ai_tools += f'                <div class="ai-tools-grid-small">\n'
    
    for url, title, desc in tools:
        domain = urllib.parse.urlparse(url).netloc
        domain = domain.replace('www.', '') if domain else "toolset.site"
        # Using a reliable favicon service
        favicon = f"https://api.iowen.cn/favicon/{domain}.png"
        new_ai_tools += f'                    <a href="{url}" target="_blank" class="ai-tool-item-small">\n'
        new_ai_tools += f'                        <img src="{favicon}" class="tool-icon-small" alt="{title}" onerror="this.src=\'./static/工具箱.png\'">\n'
        new_ai_tools += f'                        <div class="tool-info">\n'
        new_ai_tools += f'                            <h4>{title}</h4>\n'
        new_ai_tools += f'                            <p>{desc}</p>\n'
        new_ai_tools += f'                        </div>\n'
        new_ai_tools += f'                    </a>\n'

    new_ai_tools += f'                </div>\n'
    new_ai_tools += f'            </div>\n'

new_ai_tools += '        </div>\n'
new_ai_tools += '    </div>\n'
new_ai_tools += '</section>\n\n'

html = html[:ai_tools_start] + new_ai_tools + html[ai_tools_end:]

# Now inject JS logic for the sidebar click
# find '<script>' and put it inside
script_start = html.rfind('<script>')
js_logic = """
        // AI Sidebar Tab Switching
        document.addEventListener('DOMContentLoaded', function() {
            const sidebarLinks = document.querySelectorAll('.sidebar-link');
            const categoryBlocks = document.querySelectorAll('.ai-category-block');

            function activateCategory(targetName) {
                // Deactivate all
                sidebarLinks.forEach(link => link.classList.remove('active'));
                categoryBlocks.forEach(block => block.classList.remove('active'));
                
                // Activate target
                const activeLink = Array.from(sidebarLinks).find(l => l.getAttribute('data-target') === targetName);
                if (activeLink) activeLink.classList.add('active');
                
                const activeBlock = document.getElementById('cat-' + targetName);
                if (activeBlock) activeBlock.classList.add('active');
            }
            
            sidebarLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    activateCategory(this.getAttribute('data-target'));
                });
            });
            
            // default activate first one with items, or "AI 热门应用"
            activateCategory("AI 热门应用");
        });
"""
html = html[:script_start+8] + js_logic + html[script_start+8:]

# Save
with open('d:\\work\\Web\\xiaogj\\index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("HTML generated successfully.")
