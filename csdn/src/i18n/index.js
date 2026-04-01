import Vue from 'vue';
import VueI18n from 'vue-i18n';
import zh from './zh';
import en from './en';

Vue.use(VueI18n);

const messages = { zh, en };

// Read saved lang from localStorage or default to 'zh'
const savedLang = localStorage.getItem('language') || 'zh';
const locale = Object.keys(messages).includes(savedLang) ? savedLang : 'zh';

// Set HTML lang attribute
document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en-US';

const i18n = new VueI18n({
  locale,
  fallbackLocale: 'zh',
  messages,
});

export default i18n;
