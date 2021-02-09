<template>
  <div
    ref="dragWrapper"
    draggable="false"
    :class="getWrapperClass"
    :style="getWrapperStyle">
    <div ref="drag" style="width: 100%; height: 100%">
      <template v-if="$slots.default">
        <slot></slot>
      </template>
      <template v-else>
        draggable
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { eventHandle } from '@/libs/dom';
import { css, getPositioningCSS } from '@/libs/style';
import { throttle } from '@/libs/tools';

const prefixCls = 'vt-drag';
const TRANS = /translate3d\((\-?\d+)(px)?,\s?(\-?\d+)(px)?,\s?(\-?\d+)(px)?\)/;

@Component
export default class Draggable extends Vue {
  @Prop({ default: 100 }) private width!: number;

  @Prop({ default: 100 }) private height!: number;

  private windowWidth = 0;

  private windowHeight = 0;

  private dragWidth = 0;

  private dragHeight = 0;

  private positionUsing = '';

  private get getWrapperClass () {
    return [
      prefixCls,
    ];
  }

  private get getWrapperStyle () {
    return {
      position: 'absolute',
      left: 0,
      top: 0,
      width: this.width + 'px',
      height: this.height + 'px',
      transform: 'translate3d(0,0,0)',
    };
  }

  private setDragPosition (x: number, y: number) {
    let posCss: Record<string, any>;
    if (this.positionUsing === 'translate3d') {
      posCss = { transform: `translate3d(${x}px, ${y}px, 0px)` };
    }
    else if (this.positionUsing === 'translate') {
      posCss = { transform: `translate(${x}px, ${y}px)` };
    }
    else {
      posCss = {
        left: x + 'px',
        top: y + 'px',
      };
    }
    return posCss;
  }

  private handleWrapperMouseDown (e: MouseEvent) {
    e.preventDefault();
    let diffX: number;
    let diffY: number;
    this.dragWidth = (this.$refs.dragWrapper as HTMLElement).clientWidth;
    this.dragHeight = (this.$refs.dragWrapper as HTMLElement).clientHeight;
    const transPos = TRANS.exec((this.$refs.dragWrapper as HTMLElement).style.transform);
    if (transPos !== null && transPos.length) {
      // 1 3 5
      diffX = e.clientX - (+transPos[1] as number);
      diffY = e.clientY - (+transPos[3] as number);
    }
    else {
      diffX = e.clientX;
      diffY = e.clientY;
    }

    const self = this;

    function handleMouseMove (e: MouseEvent): void {
      let currentLeft = (e.clientX - diffX) | 0;
      let currentTop = (e.clientY - diffY) | 0;
      if (currentLeft < 0) {
        currentLeft = 0;
      }
      else if (currentLeft > self.windowWidth - self.dragWidth) {
        currentLeft = (self.windowWidth - self.dragWidth) | 0;
      }
      if (currentTop < 0) {
        currentTop = 0;
      }
      else if (currentTop > self.windowHeight - self.dragHeight) {
        currentTop = (self.windowHeight - self.dragHeight) | 0;
      }
      css((self.$refs.dragWrapper as HTMLElement), self.setDragPosition(currentLeft, currentTop));
    }

    function handleMouseUp () {
      eventHandle.removeEvent(document, 'mousemove', handleMouseMove);
      eventHandle.removeEvent(document, 'mouseup', handleMouseUp);
    }

    eventHandle.addEvent(document, 'mousemove', handleMouseMove);
    eventHandle.addEvent(document, 'mouseup', handleMouseUp);
  }

  private handleWrapperResize (e: Event) {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

  private _initial () {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    const dragWrapper = (this.$refs.dragWrapper as HTMLElement);
    const drag = (this.$refs.drag as HTMLElement);
    this.dragWidth = dragWrapper.clientWidth;
    this.dragHeight = dragWrapper.clientHeight;
    eventHandle.addEvent(drag, 'mousedown', this.handleWrapperMouseDown);
    eventHandle.addEvent(window, 'resize', throttle(this.handleWrapperResize));
    this.positionUsing = getPositioningCSS();
  }

  private created () {
    this.$nextTick(() => {
      this._initial();
    });
  }
}
</script>
