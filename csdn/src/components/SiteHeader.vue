<template>
  <header class="site-header">
    <div class="container header-content">
      <div class="logo-section">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
          </svg>
        </div>
        <span class="logo-text">流氓_IT</span>
      </div>

      <nav class="main-nav">
        <ul>
          <li class="active"><a href="/">{{ $t('nav.home') }}</a></li>
          <li><a href="/">{{ $t('nav.content') }}</a></li>
          <li><a href="/">{{ $t('nav.about') }}</a></li>
        </ul>
      </nav>

      <div class="header-actions">
        <!-- Language Switcher -->
        <div class="dropdown-wrapper" v-click-outside="closeLang">
          <div class="action-item lang-selector" @click="toggleLang">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor"
                d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.28 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
            </svg>
            <span>{{ currentLangLabel }}</span>
            <svg viewBox="0 0 24 24" width="12" height="12" :class="{ 'rotate': langOpen }">
              <path fill="currentColor" d="M7 10l5 5 5-5z" />
            </svg>
          </div>
          <div v-if="langOpen" class="dropdown-menu">
            <div class="dropdown-item" :class="{ 'active': currentLang === 'zh' }" @click="setLang('zh')">简体中文</div>
            <div class="dropdown-item" :class="{ 'active': currentLang === 'en' }" @click="setLang('en')">English</div>
          </div>
        </div>

        <!-- Theme Switcher -->
        <div class="dropdown-wrapper" v-click-outside="closeTheme">
          <div class="action-item theme-toggle" @click="toggleTheme">
            <svg v-if="currentTheme === 'light'" viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor"
                d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0-1.41-1.41l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0-1.41-1.41l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
            </svg>
            <svg v-else-if="currentTheme === 'dark'" viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor"
                d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
            </svg>
            <svg v-else viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.13-14.71a.5.5 0 0 0-.58.12l-3 4a.5.5 0 0 0 .4.8h1.55l-2.07 4.14a.5.5 0 0 0 .45.72h2l-2.22 4.44a.5.5 0 0 0 .89.44l7-14a.5.5 0 0 0-.42-.66z" />
            </svg>
            <svg viewBox="0 0 24 24" width="12" height="12" :class="{ 'rotate': themeOpen }">
              <path fill="currentColor" d="M7 10l5 5 5-5z" />
            </svg>
          </div>
          <div v-if="themeOpen" class="dropdown-menu">
            <div class="dropdown-item" :class="{ 'active': currentTheme === 'light' }" @click="setTheme('light')">
              <svg viewBox="0 0 24 24" width="14" height="14">
                <path fill="currentColor" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
              </svg>
              <span>浅色</span>
            </div>
            <div class="dropdown-item" :class="{ 'active': currentTheme === 'dark' }" @click="setTheme('dark')">
              <svg viewBox="0 0 24 24" width="14" height="14">
                <path fill="currentColor"
                  d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
              </svg>
              <span>深色</span>
            </div>
            <div class="dropdown-item" :class="{ 'active': currentTheme === 'auto' }" @click="setTheme('auto')">
              <svg viewBox="0 0 24 24" width="14" height="14">
                <path fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
              <span>自动</span>
            </div>
          </div>
        </div>

        <div class="auth-buttons">
          <button class="btn btn-outline">{{ $t('header.login') }}</button>
          <button class="btn btn-primary">{{ $t('header.register') }}</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'SiteHeader',
  directives: {
    'click-outside': {
      bind(el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
          if (!(el === event.target || el.contains(event.target))) {
            vnode.context[binding.expression](event);
          }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
      },
      unbind(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
      },
    }
  },
  data() {
    return {
      langOpen: false,
      themeOpen: false,
      currentTheme: 'light',
    };
  },
  computed: {
    currentLangLabel() {
      return this.$i18n.locale === 'en' ? 'EN' : 'CN';
    },
    currentLang() {
      return this.$i18n.locale;
    }
  },
  created() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
  },
  methods: {
    toggleLang() {
      this.langOpen = !this.langOpen;
      this.themeOpen = false;
    },
    toggleTheme() {
      this.themeOpen = !this.themeOpen;
      this.langOpen = false;
    },
    closeLang() {
      this.langOpen = false;
    },
    closeTheme() {
      this.themeOpen = false;
    },
    setLang(lang) {
      this.$i18n.locale = lang;
      localStorage.setItem('language', lang);
      document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en-US';
      this.langOpen = false;
    },
    setTheme(theme) {
      this.currentTheme = theme;
      this.themeOpen = false;
      localStorage.setItem('theme', theme);

      let actualTheme = theme;
      if (theme === 'auto') {
        actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }

      document.documentElement.setAttribute('data-theme', actualTheme);
    }
  }
};
</script>

<style scoped>
.site-header {
  height: var(--header-height);
  background: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  transition: background 0.3s, border-color 0.3s;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  color: var(--text-main);
}

.logo-text {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--text-main);
  letter-spacing: -0.5px;
}

.main-nav ul {
  display: flex;
  gap: 30px;
}

.main-nav li {
  font-weight: 500;
  color: var(--text-muted);
  transition: color 0.3s;
}

.main-nav li.active,
.main-nav li:hover {
  color: var(--primary-color);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dropdown-wrapper {
  position: relative;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text-muted);
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.action-item:hover {
  background: var(--dropdown-hover);
  color: var(--text-main);
}

.rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  background: var(--dropdown-bg);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  box-shadow: var(--shadow-hover);
  min-width: 140px;
  padding: 6px;
  z-index: 1000;
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  padding: 10px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-main);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dropdown-item:hover {
  background: var(--dropdown-hover);
}

.dropdown-item.active {
  background: var(--primary-color);
  color: white;
}

.auth-buttons {
  display: flex;
  gap: 12px;
  margin-left: 10px;
}

.btn {
  padding: 8px 24px;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-outline {
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
}

.btn-outline:hover {
  background: rgba(26, 115, 232, 0.05);
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover);
  box-shadow: 0 4px 12px rgba(26, 115, 232, 0.3);
}
</style>
