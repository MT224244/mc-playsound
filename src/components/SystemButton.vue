<template>
    <q-btn
        flat
        :icon="icon"
        class="sys-btn full-height"
        @click="click"
    />
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { QBtn } from 'quasar';

@Component
export default class SystemButton extends QBtn {}
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
