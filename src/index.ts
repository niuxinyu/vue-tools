import { VueConstructor } from 'vue';
import Preview from './components/preview/index';

const components = {
    Preview,
} as Record<string, any>;

const install = (Vue: VueConstructor, options = {}) => {
    Object.keys(components)
        .forEach((key: string) => {
            Vue.component(key, components[key]);
        });

    Vue.prototype.$preview = Preview.instance;
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

// todo
export {
    Preview,
};

export default {
    install,
};
