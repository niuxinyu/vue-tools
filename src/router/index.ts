import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

const routes: Array<RouteConfig> = [
  {
    path: '/preview',
    component: () => import('@/components/preview/preview.vue'),
  },
  // {
  //     path: '/',
  //     redirect: '/preview',
  // },
];

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  routes,
});
