<template>
  <div
    ref="drag"
    :class="getWrapperClass"
    :style="getWrapperStyle">
    <h1>draggable</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { eventHandle } from '@/libs/dom';
import { css } from '@/libs/style';

const prefixCls = 'vt-drag';
const TRANS = /translate3d\((\-?\d+)(px)?,\s?(\-?\d+)(px)?,\s?(\-?\d+)(px)?\)/;

@Component
export default class Draggable extends Vue {
  private windowWidth = 0;

  private windowHeight = 0;

  private dragWidth = 0;

  private dragHeight = 0;

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
      height: 60 + 'px',
      transform: 'translate3d(0,0,0)',
    };
  }

  private handleWrapperClick (e: MouseEvent) {
    let diffX: number;
    let diffY: number;
    const transPos = TRANS.exec((this.$refs.drag as HTMLElement).style.transform);
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
      let currentLeft = e.clientX - diffX;
      let currentTop = e.clientY - diffY;
      if (currentLeft < 0) {
        currentLeft = 0;
      }
      else if (currentLeft > self.windowWidth - self.dragWidth) {
        currentLeft = self.windowWidth - self.dragWidth;
      }
      else if (currentTop < 0) {
        currentTop = 0;
      }
      else if (currentTop > self.windowHeight - self.dragHeight) {
        currentTop = self.windowHeight - self.dragHeight;
      }
      css((self.$refs.drag as HTMLElement), { transform: `translate3d(${currentLeft}px, ${currentTop}px, 0)` });
    }

    function handleMouseUp () {
      console.log(666);
      eventHandle.removeEvent(document, 'mousemove', handleMouseMove);
      eventHandle.removeEvent(document, 'mouseup', handleMouseUp);
    }

    eventHandle.addEvent(document, 'mousemove', handleMouseMove);
    eventHandle.addEvent(document, 'mouseup', handleMouseUp);
  }

  private _initial () {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.dragWidth = (this.$refs.drag as HTMLElement).clientWidth;
    this.dragHeight = (this.$refs.drag as HTMLElement).clientHeight;
    eventHandle.addEvent((this.$refs.drag as HTMLElement), 'mousedown', this.handleWrapperClick);
  }

  private created () {
    this.$nextTick(() => {
      this._initial();
    });
  }
}
</script>
