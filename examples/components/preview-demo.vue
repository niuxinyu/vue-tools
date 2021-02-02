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
            <!--            <Preview-->
            <!--                v-model="shouldShow"-->
            <!--                :img-list="imgList"-->
            <!--                @change="handleClose"-->
            <!--            ></Preview>-->
        </div>
        <button @click="handleShowPreview">点击图片预览</button>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class PreviewDemo extends Vue {

    private shouldShow = false;
    private imgList = [
        // {
        //     url: Close
        // },
        {
            id: 1,
            url: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1603365312,3218205429&fm=26&gp=0.jpg',
        },
        {
            id: 4,
            url: 'https://img.iplaysoft.com/wp-content/uploads/2019/free-images/free_stock_photo.jpg!0x0.webp'
        },
        {
            id: 2,
            url: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1819216937,2118754409&fm=26&gp=0.jpg',
        },
        // {
        //     id: 3,
        //     url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2005235653,1742582269&fm=26&gp=0.jpg',
        // },
    ];

    private handleShowPreview () {
        this.shouldShow = true;
        this.$preview.getContainer(() => (document.querySelector('.right') as HTMLElement))
            .open({
                imgList: this.imgList,
                change: (params: any) => {
                    console.log(params);
                },
                menuList: { leftRotate: false }
            });
        // this.$preview.getContainer(() => document.querySelector('.right'))
        //     .open({
        //         imgList: this.imgList
        //     });
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
