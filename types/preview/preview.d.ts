import Vue from 'vue';
import { VueTools } from '../component';

export type ImgList = { url: string; id?: number }[];

export interface PreviewChangeParams {
    id: number | string;
    actionType: string;
    currentIndex: number;
    imgUrl: string;
    scale: number;
    rotate: number;
}

// 好像并未能提供模板中的类型支持
export declare class Preview extends VueTools {
    imgList: ImgList;

    change?: (payload: PreviewChangeParams) => void;
}

export declare interface $Preview {
    open: (params: {
        imgList: ImgList;
        change?: (payload: PreviewChangeParams) => void;
    }) => void;
    close: () => void;
}

declare module 'vue/types/vue' {
    interface Vue {
        $preview: $Preview
    }
}
