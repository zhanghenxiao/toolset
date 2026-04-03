import thumb1 from '../assets/thumb-1.png';
import thumb2 from '../assets/thumb-2.png';
import thumb3 from '../assets/thumb-3.png';
import thumb4 from '../assets/thumb-4.png';
import leafMainThumb from '../assets/images/leaf-main.png';
import jsonviewThumb from '../assets/images/jsonview-thumb.png';
import corsThumb from '../assets/images/cors-thumb.png';
import mapbox3dThumb from '../assets/images/mapbox-3d-thumb.png';

const mandatoryFooter = '\n\n---\n专注于分享经过验证的开发技巧与实用资源，致力于为你节省检索信息的时间，以及AI工具经验分享获取更多干货。关注微信公众号：流氓也是种气质Cookie';

export const contentItems = [
  {
    id: 1,
    slug: 'mapbox-3d-map',
    title: 'Mapbox GL JS 初始化 3D 建筑与地形教程',
    image: mapbox3dThumb,
    date: '2026-04-03',
    author: '流氓',
    views: '1,100',
    category: '教程',
    duration: '12:30',
    excerpt: '学习如何使用 Mapbox GL JS 快速初始化一个包含 3D 建筑挤压（Fill-Extrusion）和数字高程模型（DEM）地形的交互式 3D 地图。',
    tags: [{ name: 'Mapbox', type: 'blue' }, { name: '3D地图', type: 'blue' }, { name: 'WebGIS', type: 'green' }],
    collection: '地图',
    relatedIds: [2, 4, 6], 
    recommendationIds: [2, 3, 4, 5],
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
    id: 2,
    slug: 'chrome-cors-plugin',
    title: 'Chrome & Firefox 跨域插件配置教程',
    image: corsThumb,
    date: '2026-04-02',
    author: '流氓',
    views: '1,800',
    category: '教程',
    duration: '08:15',
    excerpt: '本地开发遇到 Cross-Origin 跨域问题？通过 Chrome 和 Firefox 插件轻松开启 Access-Control-Allow-Origin，加速前后端调试。',
    tags: [{ name: 'Chrome', type: 'blue' }, { name: '插件', type: 'blue' }, { name: '跨域', type: 'green' }],
    collection: '流氓工具箱',
    relatedIds: [3, 4, 6, 7], 
    recommendationIds: [3, 4, 5, 6],
    gallery: [corsThumb],
    markdownContent: `
目录

1.Chrome跨域插件配置
使用chrome插件“Allow CORS: Access-Control-Allow-origin ”来解决跨域问题。

点击pin图标，然后插件会显示在地址栏 

1.1启动插件
点击文本和图标都可以

开启完以后图标就变成彩色的了， 关闭插件图标就变灰的了。

1.2. 设置本地调试跨域

点击Open option page这个页面，这是以下内容

这样就完成本地跨域了 

2 Firefox跨域插件
2.1. 安装插件 CORS Everywhere
CORS Everywhere – Get this Extension for 🦊 Firefox (en-US)

2.2. 启动插件
下载并安装这个插件。
安装完以后地址栏后面有这个图标，点击启动就可以。

3 工具下载链接
夸克网盘：

链接：https://pan.quark.cn/s/811ec5bc5242?pwd=UJJW 提取码：UJJW
` + mandatoryFooter
  },
  {
    id: 3,
    slug: 'chrome-jsonview-install',
    title: 'Chrome 安装 JSONview 插件教程',
    image: jsonviewThumb,
    date: '2026-04-02',
    author: '流氓',
    views: '1,500',
    category: '教程',
    duration: '05:00',
    excerpt: 'Chrome 安装 JSONview 插件后，可以在浏览器中直接查看格式化后的 JSON 内容，是开发者必备的工具。',
    tags: [{ name: 'Chrome', type: 'blue' }, { name: '插件', type: 'blue' }, { name: 'JSON', type: 'green' }],
    collection: '流氓工具箱',
    relatedIds: [4, 5, 7], 
    recommendationIds: [4, 5, 6, 7],
    gallery: [
      'https://i-blog.csdnimg.cn/blog_migrate/3d2ca9661c744c4f5c4a1c9aee4d4c79.png',
      'https://i-blog.csdnimg.cn/blog_migrate/413d5abf8f0f0ed396ab2163a825851.png',
      'https://i-blog.csdnimg.cn/blog_migrate/e8a7d71c102c8a521068dfaeafbb2efd.png',
      'https://i-blog.csdnimg.cn/blog_migrate/c88f91ddc90eb9c29bb148c5da93ef5f.png'
    ],
    markdownContent: `
chrome安装JSONview插件，即可在浏览中查看json文件

由于浏览器查看返回的json[字符串比较](https://so.csdn.net/so/search?q=字符串比较&spm=1001.2101.3001.7020)乱，安装这个插件后看起来很清爽
 1、下载JSONview压缩包

夸克网盘
 链接：https://pan.quark.cn/s/51502e7068de?pwd=fDLE 

2.解压

3.打开chorme浏览器的扩展程序

![img](https://i-blog.csdnimg.cn/blog_migrate/3d2ca9661c744c4f5c4a1c9aee4d4c79.png)

加载已解压的扩展程序-->选择WebContent文件夹

![img](https://i-blog.csdnimg.cn/blog_migrate/e8a7d71c102c8a521068dfaeafbb2efd.png)

 效果图：

![img](https://i-blog.csdnimg.cn/blog_migrate/c88f91ddc90eb9c29bb148c5da93ef5f.png)
` + mandatoryFooter
  },
  {
    id: 4,
    slug: 'offline-leaflet-map',
    title: 'Leaflet 离线地图下载与加载教程',
    image: leafMainThumb,
    date: '2026-04-02',
    author: '流氓',
    views: '1,200',
    category: '教程',
    duration: '10:00',
    excerpt: '本教程详细介绍了下载离线地图瓦片的两种方式（osm 和 MapTileDownloader），并提供了在 Leaflet 中加载离线地图的代码示例。',
    tags: [{ name: 'Leaflet', type: 'blue' }, { name: '地图', type: 'blue' }],
    collection: '流氓工具箱',
    relatedIds: [14, 15, 16], 
    recommendationIds: [5, 6, 7, 8], 
    gallery: [
      'https://i-blog.csdnimg.cn/blog_migrate/c80ea996965fda6a6c98c2163a825851.png',
      'https://i-blog.csdnimg.cn/blog_migrate/a87efd5108e5925134acfee3e5488653.png',
      'https://i-blog.csdnimg.cn/blog_migrate/77bc21362d47271a1344b88f5ac3523f.png',
      'https://i-blog.csdnimg.cn/blog_migrate/00600e62dd7d7382ed94d443989c8eec.png'
    ],
    markdownContent: `
**目录**

[效果图：](#效果图：)

[一 下载离线地图的二种方式](#一 下载离线地图的二种方式)

[1.osm 的方式下载瓦片](#1.osm 的方式下载瓦片)

[2、下载MapTileDownloader ](#2、下载MapTileDownloader )

[二 代码（推荐使用osm方式）](#二 代码（推荐使用osm方式）)

------

# 效果图：

![img](https://i-blog.csdnimg.cn/blog_migrate/c80ea996965fda6a6c98c2163a825851.png)

# 一 下载离线地图的二种方式

## 1.osm 的方式下载瓦片

![img](https://i-blog.csdnimg.cn/blog_migrate/a87efd5108e5925134acfee3e5488653.png)

## 2、下载MapTileDownloader 

![img](https://i-blog.csdnimg.cn/blog_migrate/77bc21362d47271a1344b88f5ac3523f.png)

 文件格式选为瓦片![img](https://i-blog.csdnimg.cn/blog_migrate/00600e62dd7d7382ed94d443989c8eec.png)

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

夸克网盘分享：

 osm分享链接：链接：https://pan.quark.cn/s/996f10a338d0?pwd=VUXq

MapTileDownloader下载链接：https://pan.quark.cn/s/369d3d7cd970?pwd=bbvL
` + mandatoryFooter
  },
  {
    id: 5,
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
    relatedIds: [6, 7, 9, 12], 
    recommendationIds: [6, 7, 8, 9], 
    gallery: [thumb1],
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
` + mandatoryFooter
  },
  {
    id: 6,
    slug: 'llm-open-source',
    title: 'AI 开源大模型 LLM 的 "闭源" 恐慌：一场虚惊还是行业趋势的开端？',
    image: thumb2,
    date: '2026-03-25',
    author: '流氓',
    views: '850',
    category: '文章',
    duration: '08:45',
    excerpt: '近期，关于开源大语言模型 (LLM) 可能转向闭源的传闻引发了业内广泛的讨论 and 担忧。',
    tags: [{ name: 'AI趋势', type: 'blue' }, { name: 'DeepSeek', type: 'blue' }],
    collection: 'AI百科',
    relatedIds: [5, 8, 10], 
    recommendationIds: [5, 7, 8, 9], 
    gallery: [thumb2],
    markdownContent: '# AI 趋势深度解析\n\n开源大模型真的要转向闭源吗？\n\n## 行业分析\n目前市场的反馈来看...' + mandatoryFooter
  },
  {
    id: 7,
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
    relatedIds: [5, 6, 11, 12, 8], 
    recommendationIds: [5, 6, 8, 9], 
    gallery: [thumb3],
    markdownContent: '# 命令行代理教程\n\n## 临时代理\n```bash\nexport http_proxy=http://127.0.0.1:7890\n```\n## 永久代理\n修改 .bashrc 或 .zshrc...' + mandatoryFooter
  },
  {
    id: 8,
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
    relatedIds: [5, 9, 10, 11], 
    recommendationIds: [5, 6, 7, 9], 
    gallery: [thumb4],
    markdownContent: '# Gemini 3.1 Pro 发布\n\n香港用户现在可以直接访问 Gemini 3.1 Pro 了！' + mandatoryFooter
  },
  // Additional items for recommendations
  {
    id: 9,
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
    relatedIds: [5, 6], 
    recommendationIds: [5, 6, 7, 8], 
    gallery: [thumb1],
    markdownContent: '# Claude 4.5 Opus 评测\n\n深度测试其代码编写与逻辑推理能力...' + mandatoryFooter
  },
  {
    id: 10,
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
    relatedIds: [6, 8], 
    recommendationIds: [5, 6, 7, 8], 
    gallery: [thumb2],
    markdownContent: '# DeepSeek-V3 发布\n\n中国开源大模型的又一里程碑。' + mandatoryFooter
  },
  {
    id: 11,
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
    relatedIds: [7, 5], 
    recommendationIds: [5, 6, 7, 8], 
    gallery: [thumb3],
    markdownContent: '# Python AI 助手\n\n从零开始构建你的 AI 代理。' + mandatoryFooter
  },
  {
    id: 12,
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
    relatedIds: [6, 8], 
    recommendationIds: [5, 6, 7, 8], 
    gallery: [thumb4],
    markdownContent: '# 2026 AI 趋势展望\n\n多模态、Agentic Workflow 将成为主流。' + mandatoryFooter
  },
  {
    id: 13,
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
    relatedIds: [14, 15, 16], 
    recommendationIds: [5, 6, 7, 8], 
    gallery: [thumb1],
    markdownContent: '# Docker 教程\n\n本教程教你如何构建高效的 Docker 镜像。' + mandatoryFooter
  },
  {
    id: 14,
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
    relatedIds: [13, 15], 
    recommendationIds: [5, 6, 7, 8], 
    gallery: [thumb2],
    markdownContent: '# iEVE 回忆\n\n那些年我们一起追过的游戏...' + mandatoryFooter
  },
  {
    id: 15,
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
    relatedIds: [13, 16], 
    recommendationIds: [5, 6, 7, 8], 
    gallery: [thumb3],
    markdownContent: '# 远行星号工具\n\n下载并安装 these 插件来提升游戏体验。' + mandatoryFooter
  },
  {
    id: 16,
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
    relatedIds: [13, 15], 
    recommendationIds: [5, 6, 7, 8], 
    gallery: [thumb4],
    markdownContent: '# 万兆网络指南\n\n升级你的路由器和交换机。' + mandatoryFooter
  }
];

// 标签
export const allTags = [
  'AI百科', '2.5G网络', '2026',  'AI', 'AI IDE', 'AI Studio', 'AI工具', 'AI学习', 'AI新闻', 'AI编程', 'AI趋势', 'acme.sh', 'Claude', 'DeepSeek', 'Gemini', 'Mac OS', 'Python'
];
// 合集
export const allCollections = [
  'AI百科', 'Docker百科', '地图', '流氓工具箱', '流氓 行业研报'
];
// 内容类型：文章
export const allTypes = [
  '视频', '文章', '教程', '新闻', '评测', '展望'
];
