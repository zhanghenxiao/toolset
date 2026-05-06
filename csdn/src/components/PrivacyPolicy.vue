<template>
    <div class="privacy-container">
        <div class="content">
            <h1>隐私政策</h1>
            <p class="update-date">最后更新日期：2026年4月7日</p>

            <section>
                <h2>1. 概述</h2>
                <p>欢迎访问本网站。我们深知隐私对您的重要性，并致力于保护您的个人信息。本隐私政策解释了我们如何收集、使用和保护通过 Google AdSense 投放广告时产生的信息。</p>
            </section>

            <section>
                <h2>2. Google AdSense 与 Cookie</h2>
                <p>我们使用 Google 作为第三方供应商在本网站投放广告。Google 会利用 Cookie 根据用户访问本网站及互联网上其他网站的情况向用户投放广告。</p>
                <ul>
                    <li><strong>DoubleClick Cookie：</strong>Google 及其合作伙伴使用 DoubleClick
                        Cookie，以便根据您对本网站和/或互联网上其他网站的访问情况，为您和我们的用户投放广告。</li>
                    <li><strong>退出机制：</strong>您可以访问 <a href="https://adssettings.google.com" target="_blank">Google
                            广告设置</a> 页面来退出个性化广告。</li>
                </ul>
            </section>

            <section>
                <h2>3. 数据收集与存储</h2>
                <p>当您访问本网站时，第三方合作伙伴（如 Google）可能会在您的浏览器中放置和读取 Cookie，或者使用网络信标（Web
                    Beacons）来收集信息。这些信息通常用于衡量广告效果和个性化广告内容，不包括您的姓名、地址、电子邮件或电话号码。</p>
            </section>

            <section>
                <h2>4. 如何管理 Cookie</h2>
                <p>您可以根据自己的喜好管理或删除 Cookie。大多数浏览器会自动接受 Cookie，但您通常可以修改浏览器设置以拒绝 Cookie。请注意，这可能会影响您在本网站及其他网站的用户体验。</p>
            </section>

            <section>
                <h2>5. 第三方隐私政策</h2>
                <p>本网站的隐私政策不适用于其他广告商或网站。我们建议您咨询这些第三方广告服务器的相关隐私政策，以获取有关其做法及如何退出某些选项的详细说明。</p>
            </section>

            <section>
                <h2>6. 联系我们</h2>
                <p>如果您对本隐私政策有任何疑问，请通过本网站提供的联系方式与我们联系。</p>
            </section>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PrivacyPolicy'
};
</script>

<style scoped>
.privacy-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
    line-height: 1.6;
    color: #333;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    text-align: center;
}

.update-date {
    text-align: center;
    color: #666;
    margin-bottom: 40px;
}

h2 {
    font-size: 1.5rem;
    margin-top: 30px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
}

ul {
    padding-left: 20px;
}

li {
    margin-bottom: 10px;
}

a {
    color: #1a73e8;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

section {
    margin-bottom: 20px;
}
</style>