import Vue from 'vue';
import VueRouter from 'vue-router';

// import $ from 'jquery';
// import axios from 'axios';
import App from './App.vue';
import VueTools from '../src/index';
// import VueTools from '../dist/vue-tools.min.js';
// import '../dist/css/main.css';
import PreviewDemo from './components/preview-demo.vue';
import DraggableDemo from './components/DraggableDemo/DraggableDemo.vue';

// console.log(axios);

Vue.use(VueRouter);
Vue.use(VueTools);

const router = new VueRouter({
    routes: [
        {
            path: '/preview',
            component: PreviewDemo,
        },
        {
            path: '/draggable',
            component: DraggableDemo,
        },
    ],
});

new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');
