import Vue from 'vue';
import router from '@/router';
import App from './App.vue';

// Vue.config.errorHandler = function (err: Error, vm, info) {
//     console.log(err);
// };

new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');
