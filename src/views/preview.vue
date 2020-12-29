<template>
    <div class="img-preview">
        <div class="bg"></div>
        <div class="img-scroll-wrapper">
            <div ref="preview" class="preview-wrapper">
                <div v-for="(item, index) in imgList" :key="item.id" :style="getStyle(index)"
                     class="preview-item"
                >
                    <img :src="item.url" draggable="false">
                </div>
            </div>
            <div class="prev" @click="handlePrev">
                <img :src="Prev" alt="">
            </div>
            <div class="next" @click="handleNext">
                <img :src="Next" alt="">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import prev from '@/assets/prev.png';
import next from '@/assets/next.png';
import { css } from '@/libs/style';
import { findMinimum, posVal } from '@/libs/math';
import { eventHandle } from '@/libs/dom';
import { throttle } from '@/libs/tools';

@Component
export default class preview extends Vue {
    name = 'preview';

    private imgList = [
        {
            id: 1,
            url: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1603365312,3218205429&fm=26&gp=0.jpg',
        },
        {
            id: 2,
            url: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1819216937,2118754409&fm=26&gp=0.jpg',
        },
        {
            id: 3,
            url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2005235653,1742582269&fm=26&gp=0.jpg',
        },
    ];

    private currentClientWidth = 0;

    private currentClientHeight = 0;

    private Prev = prev;

    private Next = next;

    private currentIndex = 0;

    private imgItemList: any;

    private scaleInit = 1;

    public get getStyle () {
        return (index: number) => {
            if (index === this.currentIndex) {
                return {
                    transform: 'translate3d(0,0,0)',
                };
            }
            return {
                transform: `translate3d(${(index - this.currentIndex) * this.currentClientWidth}px, 0, 0)`,
            };
        };
    }

    public mounted () {
        this.$nextTick(() => {
            this.currentClientWidth = window.innerWidth;
            this.currentClientHeight = window.innerHeight;
            this.imgItemList = (document.querySelector('.preview-wrapper') as HTMLElement).children;
            eventHandle.addEvent(document, 'mousewheel', throttle(this.mouseHandle, 100));
            eventHandle.addEvent(document, 'DOMMouseScroll', throttle(this.mouseHandle, 100));

            Array.prototype.forEach.call(this.imgItemList, (item: any) => {
                eventHandle.addEvent(item, 'mousedown', this.handleMouseDown);
            });
        });
    }

    private scaleAdd () {
        const element = this.imgItemList[this.currentIndex].children[0];
        css(element, {
            'transform': `scale(${this.scaleInit += 0.2}) rotate(0deg)`
        });
    }

    private scaleMinus () {
        const element = this.imgItemList[this.currentIndex].children[0];
        css(element, {
            'transform': `scale(${this.scaleInit -= 0.2}) rotate(0deg)`
        });
    }

    private handlePrev () {
        this.currentIndex -= 1;
        if (this.currentIndex < 0) this.currentIndex = this.imgList.length - 1;
        css(this.imgItemList[this.currentIndex], {
            'transform': 'translate3d(0,0,0)',
        });
        css(this.imgItemList[findMinimum(this.currentIndex, 0, this.imgItemList.length - 1)], {
            'transform': 'translate3d(-1920px,0,0)',
        });
    }

    private handleNext () {
        this.currentIndex += 1;
        if (this.currentIndex > this.imgList.length - 1) this.currentIndex = 0;
        css(this.imgItemList[this.currentIndex], {
            'transform': 'translate3d(0,0,0)'
        });
        css(this.imgItemList[findMinimum(this.currentIndex, 0, this.imgItemList.length - 1)], {
            'transform': `translate3d(${this.currentClientWidth}px,0,0)`
        });
    }

    private mouseHandle (event: Event) {
        event = eventHandle.getEvent(event);
        const delta = eventHandle.getWheelDelta(event);
        if (delta > 0) {
            this.scaleAdd();
        }
        else if (delta < 0) {
            this.scaleMinus();
        }
    }

    private handleMouseDown (e: MouseEvent) {

        let preview = this.$refs.preview;
        let currentImg = this.imgItemList[this.currentIndex];
        let clientX = e.clientX;
        let clientY = e.clientY;

        function handleMouseMove (e: MouseEvent) {
            let left = e.clientX;
            css(preview, {
                'transform': `translate3d(${left - clientX}px, 0, 0)`
            });
        }

        function handleMouseUp (e: MouseEvent) {
            if (posVal(clientX - e.clientX) > 30) {
                let max = 1189;
                let start = 0;

                function startAni () {
                    if (start >= max) return;
                    setTimeout(() => {
                        css(preview, {
                            'transform': `translate3d(-${start += 30}px, 0, 0)`
                        });
                        startAni();
                    }, 0);
                }

                startAni();
            }
            eventHandle.removeEvent(document, 'mousemove', handleMouseMove);
            eventHandle.removeEvent(document, 'mouseup', handleMouseUp);
        }

        eventHandle.addEvent(document, 'mousemove', handleMouseMove);
        eventHandle.addEvent(document, 'mouseup', handleMouseUp);
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
    background-color: rgba(0, 0, 0, .25);
    overflow: hidden;
    z-index: -1;
}

.img-preview {
    width: 100%;
    height: 100%;
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
        text-align: center;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: transform 200ms ease;

        img {
            //transition: transform 200ms cubic-bezier(0.4, 0, 0.22, 1);
            transition: transform 200ms ease;
            user-select: none;
        }
    }
}

.prev {
    position: fixed;
    top: calc(50% - 18px);
    left: 10px;
}

.next {
    position: fixed;
    top: calc(50% - 18px);
    right: 10px;
}

.prev, .next {
    z-index: 999;
    cursor: pointer;

    img {
        width: 36px;
    }
}
</style>
