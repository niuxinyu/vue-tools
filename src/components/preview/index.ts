import Vue, { CreateElement } from 'vue';
import { noop } from '@/libs/tools';
import Preview from './preview.vue';
import { MenuList } from '../../../types/preview/preview';

let PreviewInstance!: Preview;
let container!: HTMLElement | void;

// 这种写法显然不行
// 2021年2月1日12点57分
// 有时间需要着重修改该组件创建和销毁的逻辑
function getNewInstance (properties?: any) {
    const wrapper = document.createElement('div');
    const el = document.createElement('div');
    el.className = 'vt-wrapper';
    wrapper.appendChild(el);
    if (container) {
        container.appendChild(wrapper);
    }
    else {
        document.body.appendChild(wrapper);
    }
    // eslint-disable-next-line no-underscore-dangle
    const Instance = new Vue({
        data: {
            show: true,
        },
        render (h: CreateElement) {
            return h(Preview, {
                props: {
                    imgList: properties.imgList ? properties.imgList : [],
                    ...properties.menuList,
                },
                on: {
                    change: properties.change ? properties.change : () => ({}),
                    close: (value: boolean) => {
                        // 这里处理组件内部的关闭事件
                        // 500 用来等动画做完
                        if (PreviewInstance && wrapper.parentNode) {
                            setTimeout(() => {
                                PreviewInstance.$destroy();
                                PreviewInstance = null;
                                wrapper.parentNode.removeChild(wrapper);
                            }, 500);
                        }
                    },
                },
            });
        },
    });

    const component = Instance.$mount();
    if (container && container !== document.documentElement) {
        el.appendChild(component.$el);
    }
    else {
        // document.body.appendChild(component.$el);
        // eslint-disable-next-line no-lonely-if
        if (document.querySelector('.vt-wrapper')) {
            el.appendChild(component.$el);
        }
    }
    const previewInstance = (component.$children[0] as Preview);
    return previewInstance;
}

Preview.instance = {
    open (properties: {
        imgList: { url: string; id?: number }[];
        change: () => ({
            id: number | string,
            actionType: string,
            currentIndex: number,
            imgUrl: string,
            scale: number,
            rotate: number,
        });
        menuList: MenuList
    }) {
        PreviewInstance = PreviewInstance || getNewInstance(properties);
        PreviewInstance.handleToggleShow(true);
    },
    getContainer (callback?: () => HTMLElement | void) {
        if (!callback) callback = noop;
        container = callback();
        Preview.container = container;
        return this;
    },
    close () {
        PreviewInstance = PreviewInstance || getNewInstance();
        PreviewInstance.handleToggleShow(false);
    },
};

export default Preview;
