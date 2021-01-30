import Vue, { CreateElement } from 'vue';
import Preview from './preview.vue';

let PreviewInstance!: Preview;

function getNewInstance (properties?: any) {
    // eslint-disable-next-line no-underscore-dangle
    const Instance = new Vue({
        render (h: CreateElement) {
            return h(Preview, {
                props: {
                    imgList: properties.imgList ? properties.imgList : [],
                },
                on: {
                    change: properties.change ? properties.change : () => ({}),
                },
            });
        },
    });

    const component = Instance.$mount();
    document.body.appendChild(component.$el);
    const previewInstance = (component.$children[0] as Preview);
    return previewInstance;
}

Preview.instance = {
    open (properties: {
        imgList: { url: string; id?: number }[]; change: () => ({
            id: number | string,
            actionType: string,
            currentIndex: number,
            imgUrl: string,
            scale: number,
            rotate: number,
        })
    }) {
        // eslint-disable-next-line no-underscore-dangle
        const _prop = {} as Record<string, any>;
        if (properties.imgList) {
            _prop.imgList = properties.imgList;
        }
        if (properties.change && typeof properties.change === 'function') {
            _prop.change = properties.change;
        }
        PreviewInstance = PreviewInstance || getNewInstance(_prop);
        PreviewInstance.handleToggleShow(true);
    },
    close () {
        PreviewInstance = PreviewInstance || getNewInstance();
        PreviewInstance.handleToggleShow(false);
    },
};

export default Preview;
