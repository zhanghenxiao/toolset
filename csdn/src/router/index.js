import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import ContentDetail from '../views/ContentDetail.vue';
import ToolStation from '../views/ToolStation.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
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
];

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

export default router;
