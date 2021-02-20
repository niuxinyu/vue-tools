<template>
  <div>
    <h1 style="margin: 15px 0;">实例测试</h1>
    <!--        <Preview-->
    <!--            v-model="shouldShow"-->
    <!--            :img-list="imgList"-->
    <!--        ></Preview>-->
    <div class="left">
      左侧布局
    </div>
    <div class="right">
      右侧布局
      <h1>第一行</h1>
      <h1>第一行</h1>
      <h1>第一行</h1>
      <h1>第一行</h1>
      <h1>第一行</h1>
      <h1>第一行</h1>
      <!--                  <Preview-->
      <!--                      v-model="shouldShow"-->
      <!--                      :img-list="imgList"-->
      <!--                      @change="handleClose"-->
      <!--                  ></Preview>-->
    </div>
    <button @click="handleShowPreview">点击图片预览</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import One from '../assets/preview/1.jpg';
import Two from '../assets/preview/2.jpg';
import Three from '../assets/preview/3.jpg';
import Four from '../assets/preview/4.jpg';
import Five from '../assets/preview/5.jpg';

@Component
export default class PreviewDemo extends Vue {

  private shouldShow = false;

  private imgList = [
    {
      id: 1,
      url: One,
    },
    {
      id: 2,
      url: Two,
    },
    {
      id: 3,
      url: Three,
    },
    {
      id: 4,
      url: Four,
    },
    {
      id: 5,
      url: Five,
    },
  ];

  private handleShowPreview () {
    this.shouldShow = true;
    // this.$preview.getContainer(() => (document.querySelector('.right') as HTMLElement))
    //     .open({
    //         imgList: this.imgList,
    //         change: (params: any) => {
    //             console.log(params);
    //         },
    //         menuList: { leftRotate: false }
    //     });
    this.$preview
      .open({
        imgList: this.imgList,
        change: (params: any) => {
          console.log(params);
        },
      });
  }

  private handleClose (params: boolean) {
    console.log(params);
    // this.shouldShow = false;
    // this.$preview.close();
  }
}
</script>

<style lang="less" scoped>
.left {
  width: 50%;
  height: 1000px;
  background: red;
  display: block;
  float: left;
}

.right {
  width: 50%;
  height: 500px;
  display: block;
  background: green;
  float: right;
  position: relative;
}

</style>
