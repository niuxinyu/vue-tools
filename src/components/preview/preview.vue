<template>
    <transition name="fade">
        <div v-if="value || shouldShow" class="img-preview">
            <div class="bg"></div>
            <div class="img-scroll-wrapper">
                <div
                    :style="getPreviewWrapper"
                    class="preview-wrapper"
                >
                    <div v-for="(item, index) in cloneImgList"
                         :key="item.id"
                         :style="getStyle"
                         class="preview-item"
                    >
                        <img
                            :src="item.url"
                            :style="getImgStyle(index)"
                            class="preview-img"
                            draggable="false"
                        >
                    </div>
                </div>
                <div class="close">
                    <img :src="Close" title="关闭" @click="handleClose">
                </div>
                <div class="prev" @click="handlePrev">
                    <img :src="Prev" alt="">
                </div>
                <div class="next" @click="handleNext">
                    <img :src="Next" alt="">
                </div>
                <div class="action">
                    <div class="action__img-wrapper action__minus">
                        <img :src="Minus" title="缩小" @click="scaleMinus">
                    </div>
                    <div class="action__img-wrapper action__plus">
                        <img :src="Plus" title="放大" @click="scaleAdd">
                    </div>
                    <div class="action__img-wrapper action__reset">
                        <img :src="Reset" title="初始大小" @click="handleResetImgStyle">
                    </div>
                    <div class="action__img-wrapper action__left-tan">
                        <img :src="LeftTan" title="左旋转" @click="handleRotate('left')">
                    </div>
                    <div class="action__img-wrapper action__right-tan">
                        <img :src="RightTan" title="右旋转" @click="handleRotate('right')">
                    </div>
                </div>
                <div class="page">
                    {{ this.reallyIndex }} / {{ this.sourceImgList.length }}
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import {
    Component, Emit, Prop, Vue, Watch,
} from 'vue-property-decorator';
import { css } from '@/libs/style';
import { eventHandle } from '@/libs/dom';
import { getUniqueId, simpleDeepClone, throttle } from '@/libs/tools';
import prev from '@/assets/prev.png';
import next from '@/assets/next.png';
import plus from '@/assets/plus.png';
import minus from '@/assets/minus.png';
import reset from '@/assets/reset.png';
import leftTan from '@/assets/left-90.png';
import rightTan from '@/assets/right-90.png';
import close from '@/assets/close.png';
import { getNumber } from '@/libs/math';

const TRANS = /translate3d\((\-?\d+)(px)?,\s?(\-?\d+)(px)?,\s?(\-?\d+)(px)?\)/;
const ANIMATION = 'transform 200ms cubic-bezier(0.4, 0, 0.22, 1)'; // 动画
@Component
export default class Preview extends Vue {

    // 保存实例
    static instance: any;
    @Prop({ default: () => [] }) private imgList!: any[];

    // UI
    private Prev = prev;

    private Next = next;

    private Plus = plus;

    private Minus = minus;

    private Reset = reset;

    private LeftTan = leftTan;

    private RightTan = rightTan;
    @Prop({ default: () => false }) private value!: boolean;

    // 内部显示索引
    private currentIndex = 1;
    private Close = close;

    // 初始化 scale 值
    private scaleInit = 1;

    // 初始 rotate 值
    private rotate = 0;

    // 容器
    private previewWrapper!: any;

    // 容器初始宽度
    private previewWrapperClientWidth = 0; // 客户端宽度
    // eslint-disable-next-line no-undef
    private imgItemList!: NodeListOf<HTMLImageElement>;

    // 容器 是否切换动画
    private isCloseAnimation = true;

    // 当缩放的时候 img 是否显示切换动画
    private isSomeOneCloseAnimation = true;

    // 当前操作的类型 plus 放大 minus 缩小 rotate 旋转 prev 上一张 next 下一张
    private actionType = '';

    // 避免频繁切换图片导致的错误
    private canToggle = true;

    // 当前传入的数据是否有id
    private isDataHasId = false;
    // 当前被操作的img元素
    private currentImgElement!: HTMLImageElement;
    // public API
    private shouldShow = false;
    // 用来保存和回调值内的index一样的索引，以显示页标
    private reallyIndex = 1;
    // 保存合复制数据源
    private cloneImgList: any[] = [];
    private sourceImgList: any[] = [];
    // 标记当前是否为错误状态
    private isError = false;

    public get getStyle () {
        return {
            width: `${this.previewWrapperClientWidth}px`,
        };
    }

    public get getImgStyle () {
        return (index: number) => {
            if (this.currentIndex === index) {
                return {
                    transform: `scale(${this.scaleInit}) rotate(${this.rotate}deg)`,
                    'transition-duration': this.isSomeOneCloseAnimation ? '0ms' : '200ms',
                    'margin-left': '0px',
                    'margin-top': '0px',
                };
            }
            return {
                transform: 'scale(1) rotate(0deg)',
                'transition-duration': '0ms',
                'margin-left': '0px',
                'margin-top': '0px',
            };
        };
    }

    private get getPreviewWrapper () {
        return {
            transform: `translate3d(${(-(this.currentIndex) * this.previewWrapperClientWidth)}px, 0, 0)`,
            'transition-duration': this.isCloseAnimation ? '0ms' : '200ms',
            width: `${this.cloneImgList.length * this.previewWrapperClientWidth}px`,
        };
    }

    public handleToggleShow (value: boolean) {
        this.shouldShow = value;
    }

    @Emit()
    change () {
        // 当前图片的可能用到的值
        this.reallyIndex = this.currentIndex;
        return {
            id: this.sourceImgList[this.currentIndex - 1].id,
            actionType: this.actionType,
            currentIndex: this.currentIndex - 1,
            imgUrl: this.imgItemList[this.currentIndex - 1].getAttribute('src'),
            scale: this.scaleInit,
            rotate: this.rotate,
        };
    }

    public mounted () {
        // 在下一次 eventloop 中取dom
        setTimeout(() => {
            eventHandle.addEvent(document, 'mousewheel', throttle(this.mouseHandle, 100));
            eventHandle.addEvent(document, 'DOMMouseScroll', throttle(this.mouseHandle, 100));
            eventHandle.addEvent(window, 'resize', throttle(this.handleWindowResize, 100));
            if (!this.imgItemList || !this.imgItemList.length) {
                this.imgItemList = (document.querySelectorAll('.preview-img'));
                Array.prototype.forEach.call(this.imgItemList, (item: HTMLImageElement) => {
                    eventHandle.addEvent(item, 'mousedown', this.handleMouseDown);
                });
            }
            if (this.previewWrapperClientWidth === 0) {
                this.previewWrapperClientWidth = getNumber(document.querySelector('.img-scroll-wrapper')?.clientWidth);
            }
        });
    }

    @Watch('value')
    onValueChange (newVal: boolean, oldVal: boolean) {
        if (newVal !== oldVal) {
            this.$nextTick(() => {
                this.previewWrapperClientWidth = getNumber(document.querySelector('.img-scroll-wrapper')?.clientWidth);
                this.imgItemList = (document.querySelectorAll('.preview-img'));
                Array.prototype.forEach.call(this.imgItemList, (item: HTMLImageElement) => {
                    eventHandle.addEvent(item, 'mousedown', this.handleMouseDown);
                });
            });
        }
    }

    @Watch('imgList', { immediate: true })
    onImgListChange (newVal: any[]) {
        if (!Array.isArray(newVal) || newVal.length === 0) {
            this.isError = true;
            throw new Error('The imgList must be a non-empty array. ');
        }

        // 当前数据是否有id
        this.isDataHasId = (newVal.length > 0 ? !!newVal[0].id : false);
        this.sourceImgList = newVal;
        const first = simpleDeepClone(newVal[newVal.length - 1]);
        const last = simpleDeepClone(newVal[0]);
        first.id = getUniqueId();
        last.id = getUniqueId();
        this.cloneImgList = [
            first,
            ...newVal,
            last,
        ];
        this.sourceImgList.forEach((item: any) => {
            item.id = getUniqueId();
        });
    }

    private handleClose () {
        this.shouldShow = false;
        this.$emit('input', false);
        this.$emit('close', false);
    }

    private getCurrentImgElement (params: any) {
        if (typeof params === 'number') {
            this.currentImgElement = this.imgItemList[this.currentIndex];
        }
    }

    private scaleAdd () {
        this.actionType = 'plus';
        this.getCurrentImgElement(this.currentIndex);
        this.scaleInit += 0.2;
    }

    private scaleMinus () {
        this.actionType = 'minus';
        this.getCurrentImgElement(this.currentIndex);
        if (this.scaleInit <= 0.4) return;
        this.scaleInit -= 0.2;
    }

    private handleRotate (type: string, rotate = 90) {
        // 设置为 rotate
        if (!this.canToggle) return;
        this.canToggle = false;
        this.actionType = 'rotate';
        this.previewWrapper = document.querySelector('.preview-wrapper');
        this.getCurrentImgElement(this.currentIndex);
        eventHandle.addEvent(this.previewWrapper, 'transitionend', this.handleTransitionend);
        this.handleRestartAnimation();
        if (type === 'left') {
            this.rotate -= rotate;
        }
        else if (type === 'right') {
            this.rotate += rotate;
        }
    }

    private handleResetImgStyle () {
        if (!this.currentImgElement) return;
        this.currentImgElement.style.marginLeft = this.currentImgElement.style.marginTop = '0';
        this.scaleInit = 1;
        this.rotate = 0;
    }

    //  边界处理
    private handleBoundaryNext () {
        if (this.currentIndex >= this.cloneImgList.length - 1) {
            this.currentIndex = 1;
        }
    }

    private handleBoundaryPrev () {
        this.currentIndex <= 0 && (this.currentIndex = this.sourceImgList.length);
    }

    private handleTransitionend () {
        this.handleCloneAnimation();
        this.actionType === 'prev' ? this.handleBoundaryPrev() : this.handleBoundaryNext();
        this.canToggle = true;
        if (this.rotate === -360 || this.rotate === 360) this.rotate = 0;
        this.change();
    }

    private handlePrev () {
        if (!this.canToggle) return;
        this.canToggle = false;
        this.actionType = 'prev';
        this.currentIndex -= 1;

        this.handleResetImgStyle();
        this.handleRestartAnimation();
        this.previewWrapper = document.querySelector('.preview-wrapper');
        eventHandle.addEvent(this.previewWrapper, 'transitionend', this.handleTransitionend);
    }

    private handleNext () {
        if (!this.canToggle) return;
        this.canToggle = false;
        this.actionType = 'next';
        this.currentIndex += 1;

        this.handleResetImgStyle();
        this.handleRestartAnimation();
        this.previewWrapper = document.querySelector('.preview-wrapper');
        eventHandle.addEvent(this.previewWrapper, 'transitionend', this.handleTransitionend);
    }

    private handleCloneAnimation () {
        if (this.actionType === 'rotate') {
            this.isSomeOneCloseAnimation = true;
        }
        this.isCloseAnimation = true;
    }

    private handleRestartAnimation () {
        switch (this.actionType) {
        case 'rotate':
            this.isSomeOneCloseAnimation = false;
            break;
        case 'prev':
        case 'next':
            this.isCloseAnimation = false;
            break;
        }
    }

    private mouseHandle (event: Event) {
        if (!this.currentImgElement && event.target) {
            this.currentImgElement = (event.target as HTMLImageElement);
        }
        event = eventHandle.getEvent(event);
        const delta = eventHandle.getWheelDelta(event);
        if (delta > 0) {
            this.scaleAdd();
        }
        else if (delta < 0) {
            this.scaleMinus();
        }
    }

    private getPositionNumber (x: number, y: number): Record<string, any> {
        let posCss: Record<string, any>;
        posCss = {
            'margin-left': `${x}px`,
            'margin-top': `${y}px`,
        };
        return posCss;
    }

    private handleMouseDown (e: MouseEvent) {
        // 拖动貌似在某些情况下会有bug
        // 测试出来再说
        // console.log(e);
        e.target && (this.currentImgElement = (e.target as HTMLImageElement));
        e.preventDefault();
        let diffX: number;
        let diffY: number;
        const transPos = TRANS.exec(this.currentImgElement.style.transform);
        if (transPos !== null && transPos.length) {
            diffX = e.clientX - (+(transPos as any[])[1]);
            diffY = e.clientY - (+(transPos as any[])[3]);
        }
        else if (+this.currentImgElement.style.marginLeft.split('px')[0] !== 0 || +this.currentImgElement.style.marginTop.split('px')[0] !== 0) {
            diffX = e.clientX - (+this.currentImgElement.style.marginLeft.split('px')[0]);
            diffY = e.clientY - (+this.currentImgElement.style.marginTop.split('px')[0]);
        }
        else {
            diffX = e.clientX;
            diffY = e.clientY;
        }
        const self = this;

        function handleMouseMove (e: MouseEvent) {
            const currentLeft = e.clientX - diffX;
            const currentTop = e.clientY - diffY;
            css(self.currentImgElement, self.getPositionNumber(currentLeft, currentTop));
        }

        function handleMouseUp (e: MouseEvent) {
            eventHandle.removeEvent(document, 'mousemove', handleMouseMove);
            eventHandle.removeEvent(document, 'mouseup', handleMouseUp);
        }

        eventHandle.addEvent(document, 'mousemove', handleMouseMove);
        eventHandle.addEvent(document, 'mouseup', handleMouseUp);
    }

    // public beforeDestroy () {
    //     console.log(4545);
    //     eventHandle.removeEvent(this.previewWrapper, 'transitionend', this.handleTransitionend);
    // }

    private handleWindowResize (e: any) {
        const currentWrapperClientWidth = getNumber(document.querySelector('.img-scroll-wrapper')?.clientWidth);
        if (currentWrapperClientWidth < 550) return this.previewWrapperClientWidth = 550;
        this.previewWrapperClientWidth = currentWrapperClientWidth;
    }
}
</script>

<style lang="less" scoped>

.bg {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(255, 255, 255, 0.6);
    overflow: hidden;
    z-index: 9;
}

.img-preview {
    width: 100%;
    height: 100%;
    //position: relative;
}

.img-scroll-wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    left: 0;
    top: 0;
}

.preview {

    &-wrapper {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
    }

    &-item {
        width: 100%;
        height: 100%;
        float: left;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
            //transition: transform 200ms cubic-bezier(0.4, 0, 0.22, 1);
            user-select: none;
        }
    }
}

.action-bg {
    background: rgba(0, 0, 0, .45);
    user-select: none;
}

.action-img {
    width: 36px;
    height: 36px;
    padding: 6px;
    z-index: 999;
    cursor: pointer;
    border-radius: 50%;
}

.close {
    .action-bg();
    .action-img();
    position: absolute;
    top: 10px;
    right: 10px;

    img {
        width: 36px;
    }
}

.prev {
    position: fixed;
    top: calc(50% - 18px);
    left: 10px;
    .action-bg();
}

.next {
    position: fixed;
    top: calc(50% - 18px);
    right: 10px;
    .action-bg();
}

.prev, .next {
    .action-img();

    img {
        width: 36px;
    }
}

.action {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: absolute;
    left: 50%;
    bottom: 10%;
    transform: translate3d(-50%, 0, 0);
    z-index: 999;
    line-height: 12px;
    border-radius: 26px;
    .action-bg();

    .action__img-wrapper {
        padding: 6px 10px;
    }

    img {
        cursor: pointer;
        width: 26px;
        height: 26px;
    }
}

.page {
    .action-bg();
    width: 46px;
    position: absolute;
    left: 50%;
    bottom: 6%;
    z-index: 999;
    transform: translate3d(-50%, 0, 0);
    color: #fff;
    padding: 2px;
    border-radius: 10px;
    text-align: center;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>
