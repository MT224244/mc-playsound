<template>
    <q-btn
        unelevated
        :icon="icon"
        :color="color"
        class="sys-btn full-height"
        @click="click"
    >
        <q-tooltip
            v-if="tooltip"
            transition-show="jump-up"
            transition-hide="jump-down"
            self="center middle"
            content-style="background-color: #212121"
        >{{ tooltip }}</q-tooltip>
    </q-btn>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { QBtn } from 'quasar';

@Component
export default class SystemButton extends QBtn {
    @Prop({ required: false, default: undefined })
    public tooltip?: string;
}
</script>

<style lang="scss" scoped>
.sys-btn {
    border-radius: 0 !important;
    margin-left: 0 !important;
    ::v-deep.q-btn__wrapper {
        -webkit-app-region: no-drag;
        max-height: 25px;
        min-height: 0;
        padding: 0 10px;
    }
}
</style>
