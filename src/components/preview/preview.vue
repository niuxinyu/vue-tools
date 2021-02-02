<template>
    <transition name="fade">
        <div
            v-if="value || shouldShow"
            :class="[prefixCls + 'img-preview']"
            :style="getImgPreview"
        >
            <div
                :class="[prefixCls + 'bg']"
            ></div>
            <div
                :class="[prefixCls + 'scroll-wrapper']"
            >
                <div
                    :style="getPreviewWrapper"
                    :class="[prefixCls + 'wrapper']"
                >
                    <div v-for="(item, index) in cloneImgList"
                         :key="item.id"
                         :style="getStyle"
                         :class="[prefixCls + 'item']"
                    >
                        <img
                            :src="item.url"
                            :style="getImgStyle(index)"
                            :class="[prefixCls + 'img']"
                            draggable="false"
                        >
                    </div>
                </div>
                <transition name="fade">
                    <div v-show="isActionWrapperShow" :class="[prefixCls + 'action-wrapper']">
                        <div :class="prefixCls + 'page'">
                            {{ this.reallyIndex }} / {{ this.sourceImgList.length }}
                        </div>
                        <div class="menu">
                            <div v-if="minus" class="menu-item" title="缩小">
                                <Icon type="minus" @click="scaleMinus"></Icon>
                            </div>
                            <div v-if="plus" class="menu-item" title="放大">
                                <Icon type="plus" @click="scaleAdd"></Icon>
                            </div>
                            <div v-if="reset" class="menu-item" title="重置">
                                <Icon type="reset" @click="handleResetImgStyle"></Icon>
                            </div>
                            <div v-if="leftRotate" class="menu-item" title="左旋转">
                                <Icon type="left-90" @click="handleRotate('left')"></Icon>
                            </div>
                            <div v-if="rightRotate" class="menu-item" title="右旋转">
                                <Icon type="right-90" @click="handleRotate('right')"></Icon>
                            </div>
                            <div class="menu-item" title="关闭" @click="handleClose">
                                <Icon type="close"></Icon>
                            </div>
                        </div>
                    </div>
                </transition>
                <transition-group name="fade" tag="div">
                    <div v-show="isActionWrapperShow" key="prev" :class="[prefixCls + 'prev']" title="上一张"
                         @click="handlePrev">
                        <Icon type="arrow-left"></Icon>
                    </div>
                    <div v-show="isActionWrapperShow" key="next" :class="[prefixCls + 'next']" title="下一张"
                         @click="handleNext">
                        <Icon type="arrow-right"></Icon>
                    </div>
                </transition-group>
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
import { findMinimum, getNumber } from '@/libs/math';

const TRANS = /translate3d\((\-?\d+)(px)?,\s?(\-?\d+)(px)?,\s?(\-?\d+)(px)?\)/;
const ANIMATION = 'transform 200ms cubic-bezier(0.4, 0, 0.22, 1)'; // 动画
const prefixCls = 'vt-preview-';

@Component
export default class Preview extends Vue {

    // 保存实例
    static instance: any;

    // 保存挂载的根实例
    static container: HTMLElement | void;

    private prefixCls = prefixCls;

    @Prop({ default: () => ([]) }) private imgList!: any[];

    @Prop({ default: () => false }) private value!: boolean;

    @Prop({ default: true }) private minus!: boolean;
    @Prop({ default: true }) private plus!: boolean;
    @Prop({ default: true }) private reset!: boolean;
    @Prop({ default: true }) private leftRotate!: boolean;
    @Prop({ default: true }) private rightRotate!: boolean;

    // 内部显示索引
    private currentIndex = 1;

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

    // 当前是否正在拖动图片
    private isGrabbing = false;

    public get getPreviewWrapper () {
        return {
            transform: `translate3d(${(-(this.currentIndex) * this.previewWrapperClientWidth)}px, 0, 0)`,
            'transition-duration': this.isCloseAnimation ? '0ms' : '200ms',
            width: `${this.cloneImgList.length * this.previewWrapperClientWidth}px`,
        };
    }

    private get getImgStyle () {
        return (index: number) => {
            if (this.currentIndex === index) {
                return {
                    transform: `scale(${this.scaleInit}) rotate(${this.rotate}deg)`,
                    'transition-duration': this.isSomeOneCloseAnimation ? '0ms' : '200ms',
                    'margin-left': '0px',
                    'margin-top': '0px',
                    cursor: this.isGrabbing ? 'grabbing' : 'grab'
                };
            }
            return {
                transform: 'scale(1) rotate(0deg)',
                'transition-duration': '0ms',
                'margin-left': '0px',
                'margin-top': '0px',
                cursor: this.isGrabbing ? 'grabbing' : 'grab'
            };
        };
    }

    private get getImgPreview () {
        if (this.value) {
            return {
                'position': 'fixed',
                left: 0,
                top: 0,
            };
        }
        return {};
    }

    private isActionWrapperShow = true; // 当前操作菜单是否展示

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

    private actionWrapperTimer: any = 0;

    @Watch('value')
    onValueChange (newVal: boolean, oldVal: boolean) {
        if (newVal !== oldVal) {
            // 挂载之后获取宽度
            this.$nextTick(() => {
                this.previewWrapperClientWidth = getNumber(document.querySelector('.vt-preview-scroll-wrapper')?.clientWidth);
                this.imgItemList = (document.querySelectorAll('.vt-preview-img'));
                Array.prototype.forEach.call(this.imgItemList, (item: HTMLImageElement) => {
                    eventHandle.addEvent(item, 'mousedown', this.handleMouseDown);
                    this.handleChangeImgWidth(item);
                });
            });
        }
    }

    private handleShowActionWrapper () {
        if (this.actionWrapperTimer) {
            clearTimeout(this.actionWrapperTimer);
            this.actionWrapperTimer = null;
        }
        if (!this.isActionWrapperShow) this.isActionWrapperShow = true;
    }

    private handleHiddenActionWrapper () {
        if (this.actionWrapperTimer) return;
        this.actionWrapperTimer = setTimeout(() => {
            this.isActionWrapperShow = false;
            clearTimeout(this.actionWrapperTimer);
            this.actionWrapperTimer = null;
        }, 1000);
    }

    /*****************initial**********************/

    private _initialImgList () {
        if (!Array.isArray(this.imgList) || this.imgList.length === 0) {
            this.isError = true;
            throw new Error('The properties imgList must be a no-empty array.');
        }
    }

    private _initialImgListHasId () {
        // 这里只对第一项做判断
        this.isDataHasId = !!this.imgList[0].id;
    }

    private _initialCloneImgList () {
        const first = simpleDeepClone(this.imgList[this.imgList.length - 1]);
        const last = simpleDeepClone(this.imgList[0]);
        first.id = getUniqueId();
        last.id = getUniqueId();
        this.cloneImgList = [
            first,
            ...this.imgList,
            last,
        ];
    }

    private _initialRegisterEvent () {
        eventHandle.addEvent(document, 'mousewheel', throttle(this.mouseHandle, 100));
        eventHandle.addEvent(document, 'DOMMouseScroll', throttle(this.mouseHandle, 100));
        if (Preview.container) {
            eventHandle.addEvent(Preview.container, 'mouseenter', this.handleShowActionWrapper);
            eventHandle.addEvent(Preview.container, 'mouseleave', this.handleHiddenActionWrapper);
        }
        else {
            eventHandle.addEvent(document, 'mouseenter', this.handleShowActionWrapper);
            eventHandle.addEvent(document, 'mouseleave', this.handleHiddenActionWrapper);
        }
        eventHandle.addEvent(window, 'resize', throttle(this.handleWindowResize, 100));
    }

    private _initial () {
        // 当前数据是否有id
        if (!this.isDataHasId) {
            this.sourceImgList.forEach((item: any) => {
                item.id = getUniqueId();
            });
        }
        // 在下一次 eventloop 中取dom
        setTimeout(() => {
            if (this.previewWrapperClientWidth === 0) {
                this.previewWrapperClientWidth = getNumber(document.querySelector('.' + prefixCls + 'scroll-wrapper')?.clientWidth);
            }
            if (!this.imgItemList || !this.imgItemList.length) {
                this.imgItemList = document.querySelectorAll('.' + prefixCls + 'img');
            }
            this.imgItemList.forEach((item: HTMLImageElement) => {
                eventHandle.addEvent(item, 'mousedown', this.handleMouseDown);
                this.handleChangeImgWidth(item);
            });
        });
    }

    private created () {
        this._initialImgList();
        this._initialImgListHasId();
        this.sourceImgList = this.imgList;
        this._initialCloneImgList();
        this._initialRegisterEvent();
        this._initial();
    }

    private handleClose () {
        this.$emit('input', false);
        this.$emit('close', false);
        this.shouldShow = false;
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
        this.previewWrapper = document.querySelector('.vt-preview-wrapper');
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

    private handleChangeImgWidth (img: HTMLImageElement) {
        // 重置图片的尺寸
        const changeImgWidth = () => {
            if (((this.previewWrapperClientWidth - img.clientWidth) / 2 | 0) < 100) {
                img.style.width = findMinimum((this.previewWrapperClientWidth - 200), 100, img.naturalWidth) + 'px';
            }
            if (((this.previewWrapperClientWidth - img.clientWidth) / 2 | 0) > 100) {
                img.style.width = findMinimum((this.previewWrapperClientWidth - 200), 100, img.naturalWidth) + 'px';
            }
        };

        if (img.complete) {
            changeImgWidth();
        }
        else {
            img.onload = () => {
                changeImgWidth();
            };
        }
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
        this.previewWrapper = document.querySelector('.vt-preview-wrapper');
        eventHandle.addEvent(this.previewWrapper, 'transitionend', this.handleTransitionend);
    }

    private handleNext () {
        if (!this.canToggle) return;
        this.canToggle = false;
        this.actionType = 'next';
        this.currentIndex += 1;

        this.handleResetImgStyle();
        this.handleRestartAnimation();
        this.previewWrapper = document.querySelector('.vt-preview-wrapper');
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
        this.isGrabbing = true;
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
            self.isGrabbing = false;
        }

        eventHandle.addEvent(document, 'mousemove', handleMouseMove);
        eventHandle.addEvent(document, 'mouseup', handleMouseUp);
    }

    private handleWindowResize (e: any) {
        const currentWrapperClientWidth = getNumber(document.querySelector('.vt-preview-scroll-wrapper')?.clientWidth);
        // if (currentWrapperClientWidth < 550) return this.previewWrapperClientWidth = 550;
        this.previewWrapperClientWidth = currentWrapperClientWidth;
        this.imgItemList.forEach((item: HTMLImageElement) => {
            this.handleChangeImgWidth(item);
        });
    }
}
</script>
