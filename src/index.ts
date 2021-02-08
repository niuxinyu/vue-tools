import { VueConstructor } from 'vue';
import Draggable from '@/components/Draggable/Draggable.vue';
import Icon from './components/svg/svg.vue';
import Preview from './components/preview/index';
import './styles/index.less';

const components = {
  Icon,
  Preview,
  Draggable,
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
  Icon,
  Preview,
};

export default {
  install,
};
