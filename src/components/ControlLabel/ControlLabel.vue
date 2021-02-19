<template>
    <div class="label-wrapper">
        <span class="block text-caption">{{ label }}</span>
        <span class="block text-body1 text-bold value">{{ value }}</span>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ControlLabel extends Vue {
    @Prop()
    public label!: string;

    @Prop()
    public value!: string;
}
</script>

<style lang="scss" scoped>
.label-wrapper {
    width: 50px;
    text-align: center;
}
</style>
