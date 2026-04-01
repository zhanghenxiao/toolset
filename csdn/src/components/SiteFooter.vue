<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-col">
        <h4 class="footer-title">{{ $t('footer.navTitle') }}</h4>
        <ul>
          <li><a href="/">{{ $t('footer.home') }}</a></li>
          <li><a href="/">{{ $t('footer.contentList') }}</a></li>
          <li><a href="/">{{ $t('footer.userCenter') }}</a></li>
          <li><a href="/">{{ $t('footer.favorites') }}</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4 class="footer-title">{{ $t('footer.aboutTitle') }}</h4>
        <ul>
          <li><a href="/">{{ $t('footer.company') }}</a></li>
          <li><a href="/">{{ $t('footer.contact') }}</a></li>
          <li><a href="/">{{ $t('footer.join') }}</a></li>
          <li><a href="/">{{ $t('footer.privacy') }}</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4 class="footer-title">{{ $t('footer.ecoTitle') }}</h4>
        <ul>
          <li><a href="/">{{ $t('footer.tools') }}</a></li>
          <li><a href="/">{{ $t('footer.blog') }}</a></li>
          <li><a href="/">{{ $t('footer.wiki') }}</a></li>
          <li><a href="/">{{ $t('footer.tracker') }}</a></li>
        </ul>
      </div>
      <div class="footer-col subscribe-col">
        <h4 class="footer-title">{{ $t('footer.subscribe') }}</h4>
        <p>{{ $t('footer.subscribeDesc') }}</p>
        <div class="subscribe-form">
          <input type="email" :placeholder="$t('footer.emailPlaceholder')" />
          <button class="btn btn-primary">{{ $t('footer.subscribeBtn') }}</button>
        </div>
        <div class="social-links">
          <h4 class="footer-title">{{ $t('footer.socialTitle') }}</h4>
          <div class="social-icons">
            <a href="/" class="social-icon">YT</a>
            <a href="/" class="social-icon">Bili</a>
            <a href="/" class="social-icon">抖音</a>
            <a href="/" class="social-icon">微信</a>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <p>&copy; 2026 内容创作展示网站 lib00.com 保留所有权利 | 代理条款 | 隐私政策 | 流氓政策</p>
      </div>
    </div>
    <div class="floating-actions">
      <button class="float-btn to-top">↑</button>
      <button class="float-btn chat">💬</button>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'SiteFooter',
};
</script>

<style scoped>
.site-footer {
  background: var(--footer-bg);
  color: #ffffff;
  padding: 60px 0 20px;
  margin-top: auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  margin-bottom: 60px;
}

.footer-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 24px;
}

.footer-col ul li {
  margin-bottom: 12px;
  font-size: 14px;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.footer-col ul li:hover {
  opacity: 1;
}

.subscribe-col p {
  font-size: 14px;
  opacity: 0.7;
  margin-bottom: 16px;
}

.subscribe-form {
  display: flex;
  margin-bottom: 24px;
  background: #ffffff;
  border-radius: 30px;
  padding: 4px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s, box-shadow 0.3s;
}

.subscribe-form:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(26, 115, 232, 0.1);
}

.subscribe-form input {
  padding: 10px 20px;
  border: none;
  background: transparent;
  width: 100%;
  font-size: 14px;
  outline: none;
  color: #333;
}

.subscribe-form button {
  border-radius: 26px;
  padding: 0 24px;
  height: 40px;
  white-space: nowrap;
  transition: all 0.3s;
}

.subscribe-form button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(26, 115, 232, 0.2);
}

.social-icons {
  display: flex;
  gap: 16px;
}

.social-icon {
  font-size: 14px;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.social-icon:hover {
  opacity: 1;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
  text-align: center;
  font-size: 12px;
  opacity: 0.5;
}

.floating-actions {
  position: fixed;
  right: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.float-btn {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.float-btn:hover {
  transform: scale(1.1);
}

.float-btn.chat {
  background: #10b981;
}
</style>
