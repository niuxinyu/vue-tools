<template>
    <svg :style="getSvgSize" aria-hidden="true" class="icon" @click="handleClick">
        <use :xlink:href="'#icon-' + type"></use>
    </svg>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import './iconfont';

@Component
export default class Icon extends Vue {
    @Prop({ default: '' }) private type!: string;

    @Prop({ default: '16' }) private size!: string;

    public get getSvgSize () {
        return {
            'font-size': this.size + 'px'
        };
    }

    handleClick () {
        this.$emit('click');
    }
}
</script>

<style scoped>
.icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    cursor: pointer;
}
</style>
