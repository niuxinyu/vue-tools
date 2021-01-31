import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App.vue';
import VueTools from '../src/index';
// import VueTools from '../dist/vue-tools.min.js';
import PreviewDemo from './components/preview-demo.vue';

Vue.use(VueRouter);
Vue.use(VueTools);

const router = new VueRouter({
    routes: [
        {
            path: '/preview',
            component: PreviewDemo,
        },
    ],
});

new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');
