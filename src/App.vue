<template>
    <div>
        <h1 class="h1">{{ msg }}</h1>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class App extends Vue {
    private msg = 'ts vue';

    public created () {
        console.log(process.env.NODE_ENV);
    }
}
</script>

<style scoped lang="less">
.h1 {
    color: red;
}
</style>
