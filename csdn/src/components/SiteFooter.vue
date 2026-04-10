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
          <li><a href="/privacy-policy">{{ $t('footer.privacy') }}</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4 class="footer-title">{{ $t('footer.ecoTitle') }}</h4>
        <ul>
          <li><a href="/tools">{{ $t('footer.tools') }}</a></li>
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
        <p>&copy; 2026 内容创作展示网站 toolset.site 保留所有权利 | 代理条款 | <a href="/privacy-policy">隐私政策</a> </p>
      </div>
    </div>
    <div class="floating-actions" :class="{ 'show': showScrollTop }">
      <button class="float-btn to-top" @click="scrollToTop" title="回到顶部">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
        </svg>
      </button>
      <!-- <button class="float-btn chat">💬</button> -->
    </div>
  </footer>
</template>

<script>
export default {
  name: 'SiteFooter',
  data() {
    return {
      showScrollTop: false
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.showScrollTop = window.pageYOffset > 300;
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
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
  right: 30px;
  bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.floating-actions.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.float-btn {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: var(--card-bg);
  color: var(--text-main);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
  border: 1px solid var(--border-color);
  cursor: pointer;
  backdrop-filter: blur(10px);
}

.float-btn:hover {
  transform: translateY(-5px);
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  box-shadow: 0 8px 25px rgba(26, 115, 232, 0.4);
}

.float-btn svg {
  transition: transform 0.3s;
}

.float-btn:active {
  transform: scale(0.95);
}

/* Mobile Responsive Styles */
@media (max-width: 992px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }
}

@media (max-width: 576px) {
  .site-footer {
    padding: 40px 0 20px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 30px;
    margin-bottom: 40px;
  }

  .footer-title {
    margin-bottom: 16px;
  }

  .subscribe-form {
    flex-direction: column;
    background: transparent;
    box-shadow: none;
    padding: 0;
    gap: 12px;
  }

  .subscribe-form input {
    background: #ffffff;
    border-radius: 30px;
  }

  .subscribe-form button {
    width: 100%;
    border-radius: 30px;
  }

  .footer-bottom {
    padding: 20px 15px;
    line-height: 1.6;
  }
}
</style>
