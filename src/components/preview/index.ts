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
    // eslint-disable-next-line no-underscore-dangle
    const Instance = new Vue({
        data: {
            show: true,
        },
        render (h: CreateElement) {
            const getPreviewVNode = () => {
                if (this.show) {
                    return (
                        h(Preview, {
                            props: {
                                imgList: properties.imgList ? properties.imgList : [],
                                ...properties.menuList,
                            },
                            on: {
                                change: properties.change ? properties.change : () => ({}),
                                close: (value: boolean) => {
                                    this.show = value;
                                    PreviewInstance = null;
                                    setTimeout(() => {
                                        document.body.removeChild(document.querySelector('.vt-wrapper'));
                                    }, 500);
                                },
                            },
                        })
                    );
                }
                return null;
            };
            return h('div', {
                class: 'vt-wrapper',
            }, [getPreviewVNode()]);
        },
    });

    const component = Instance.$mount();
    if (container && container !== document.documentElement) {
        container.appendChild(component.$el);
    }
    else {
        document.body.appendChild(component.$el);
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
        // eslint-disable-next-line no-underscore-dangle
        const _prop = {} as Record<string, any>;
        if (properties.imgList) {
            _prop.imgList = properties.imgList;
        }
        if (properties.change && typeof properties.change === 'function') {
            _prop.change = properties.change;
        }
        if (properties.menuList) {
            _prop.menuList = properties.menuList;
        }
        PreviewInstance = PreviewInstance || getNewInstance(_prop);
        PreviewInstance.handleToggleShow(true);
    },
    getContainer (callback?: () => HTMLElement | void) {
        if (!callback) callback = noop;
        container = callback();
        return this;
    },
    close () {
        PreviewInstance = PreviewInstance || getNewInstance();
        PreviewInstance.handleToggleShow(false);
    },
};

export default Preview;
