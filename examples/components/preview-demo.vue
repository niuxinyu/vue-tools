<template>
    <div>
        <h1>实例测试</h1>
        <Preview
            v-model="shouldShow"
            :img-list="imgList"
        ></Preview>
        <button @click="handleShowPreview">点击图片预览</button>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class PreviewDemo extends Vue {

    private shouldShow = false;
    private imgList = [
        {
            id: 1,
            url: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1603365312,3218205429&fm=26&gp=0.jpg',
        },
        // {
        //     id: 2,
        //     url: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1819216937,2118754409&fm=26&gp=0.jpg',
        // },
        // {
        //     id: 3,
        //     url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2005235653,1742582269&fm=26&gp=0.jpg',
        // },
    ];

    private handleShowPreview () {
        this.shouldShow = true;
        // this.$preview.open({
        //     imgList: this.imgList,
        //     change: (params: any) => {
        //         console.log(params);
        //     }
        // });
    }

    private handleClose () {
        // this.shouldShow = false;
        // this.$preview.close();
    }
}
</script>

<style scoped>

</style>
