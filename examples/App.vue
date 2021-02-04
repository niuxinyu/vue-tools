<template>
    <div>
        <ul class="ul">
            <li>
                <router-link to="/preview">preview</router-link>
            </li>
            <li>
                <router-link to="/draggable">draggable</router-link>
            </li>
        </ul>
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {

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
}
</script>

<style scoped lang="less">
.ul {
    display: flex;
    li {
        margin: 0 8px;
    }
}
</style>
