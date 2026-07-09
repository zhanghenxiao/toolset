<template>
    <div class="about-container">
        <SiteHeader />
        <div class="content">
            <h1>关于我们</h1>
            <p class="subtitle">数维探索_IT · toolset.site</p>

            <section>
                <h2>我们是谁</h2>
                <p>数维探索_IT 是一个面向中文开发者的技术内容平台，由具有多年 Web 前端与 AI 工程实践经验的团队独立运营。我们不做内容聚合或搬运，所有文章均基于真实项目经验撰写与验证。</p>
            </section>

            <section>
                <h2>内容方向</h2>
                <ul>
                    <li><strong>AI 工具实战</strong>：Google Antigravity、Gemini、Claude 等 AI IDE 与模型的深度使用指南</li>
                    <li><strong>Web 前端开发</strong>：Mapbox、Leaflet、Chrome 插件、PWA 等实战教程</li>
                    <li><strong>开发者工具</strong>：时间戳转换、JSON 格式化、Base64 编解码等在线实用工具</li>
                </ul>
            </section>

            <section>
                <h2>内容标准</h2>
                <p>我们坚持以下编辑原则，确保每篇文章对读者有实际价值：</p>
                <ul>
                    <li>每篇教程包含完整步骤、代码示例或可操作说明，而非仅有标题与摘要</li>
                    <li>技术信息经过实际验证，版本号与操作路径保持更新</li>
                    <li>拒绝低质量采集、洗稿与重复内容</li>
                </ul>
            </section>

            <section>
                <h2>联系我们</h2>
                <p>如有内容建议、纠错反馈或合作意向，请通过微信公众号 <strong>「数维探索」</strong> 与我们联系。</p>
                <p>网站地址：<a href="https://toolset.site">https://toolset.site</a></p>
            </section>
        </div>
        <SiteFooter />
    </div>
</template>

<script>
import SiteHeader from './SiteHeader.vue';
import SiteFooter from './SiteFooter.vue';

export default {
    name: 'AboutUs',
    components: { SiteHeader, SiteFooter }
};
</script>

<style scoped>
.about-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.content {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
    line-height: 1.8;
    color: var(--text-main);
    flex: 1;
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 8px;
    text-align: center;
}

.subtitle {
    text-align: center;
    color: var(--text-muted);
    margin-bottom: 40px;
}

h2 {
    font-size: 1.5rem;
    margin-top: 30px;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 10px;
}

ul {
    padding-left: 20px;
}

li {
    margin-bottom: 10px;
}

a {
    color: var(--primary-color);
    text-decoration: none;
}

section {
    margin-bottom: 20px;
}
</style>
