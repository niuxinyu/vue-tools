declare module '*.vue' {
    import Vue from 'vue';

    export default Vue;
}

declare module 'x-photoswipe/dist/photoswipe' {
    const PhotoSwipe: any;
    export default PhotoSwipe;
}

declare module 'x-photoswipe/dist/photoswipe-ui-default' {
    const UI: any;
    export default UI;
}

declare module 'x-photoswipe/dist/photoswipe.css';
declare module 'x-photoswipe/dist/default-skin/default-skin.css';
