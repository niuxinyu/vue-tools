import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App.vue';
import VueTools from '../src/index';
// import VueTools from '../dist/vue-tools.min.js';

Vue.use(VueRouter);
Vue.use(VueTools);

const router = new VueRouter({
    routes: [
        {
            path: '/preview',
            component: () => import('./components/preview-demo.vue'),
        },
    ],
});

new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');
