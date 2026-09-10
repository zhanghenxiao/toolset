import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import ContentDetail from '../views/ContentDetail.vue';
import ToolStation from '../views/ToolStation.vue';
import Books from '../views/Books.vue';
import { checkRateLimit, isSiteBlocked } from '../utils/siteGuard';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/books',
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/books',
    name: 'Books',
    component: Books,
  },
  {
    path: '/tools',
    name: 'ToolStation',
    component: ToolStation,
  },
  {
    path: '/detail/:slug',
    name: 'ContentDetail',
    component: ContentDetail,
    props: true
  },
  {
    path: '/about',
    name: 'AboutUs',
    component: () => import('../components/AboutUs.vue')
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: () => import('../components/PrivacyPolicy.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {
  if (isSiteBlocked()) {
    next(false);
    return;
  }
  if (!checkRateLimit('navigation')) {
    next(false);
    return;
  }
  if (to.path === '/books' && !checkRateLimit('books')) {
    next(false);
    return;
  }
  next();
});

router.afterEach(() => {
  document.title = '数维探索';
});

export default router;
