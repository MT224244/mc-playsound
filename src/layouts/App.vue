<template>
    <q-layout view="lHh Lpr lFf">
        <q-bar class="q-px-none fixed-top titlebar">
            <div class="drag-area"/>
            <span class="q-pl-sm text-subtitle2">{{ title }} v{{ version }}</span>

            <q-space/>

            <q-btn
                flat
                icon="mdi-window-minimize"
                class="sys-btn full-height"
                @click="btnMinimize_onClick"
            />
            <q-btn
                flat
                :icon="isMaximize ? 'mdi-window-restore' : 'mdi-window-maximize'"
                class="sys-btn full-height"
                @click="btnMaximize_onClick"
            />
            <q-btn
                flat
                icon="mdi-window-close"
                class="sys-btn full-height"
                @click="btnClose_onClick"
            />
        </q-bar>

        <q-page-container class="fixed-bottom content">
            <Home class="full-height"/>
        </q-page-container>
    </q-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { IpcRenderer } from '@/renderer/IpcRenderer';

import { version } from '../../package.json';

import Home from '@/views/Home.vue';

@Component({
    components: {
        Home
    },
    data: () => ({
        version
    })
})
export default class App extends Vue {
    public title = 'MC Playsound';

    public isMaximize = false;

    public mounted() {
        IpcRenderer.On('maximize', (_, isMaximize) => {
            this.isMaximize = isMaximize;
        });
    }

    public btnMinimize_onClick() {
        IpcRenderer.Invoke('App_minimize');
    }

    public btnMaximize_onClick() {
        IpcRenderer.Invoke('App_maximize');
    }

    public btnClose_onClick() {
        IpcRenderer.Invoke('App_close');
    }
}
</script>

<style lang="scss" scoped>
.titlebar {
    height: 25px;
    z-index: 1000;
    .drag-area {
        -webkit-app-region: drag;
        position: absolute;
        // 上を若干空ける
        top: 3px;
        width: 100%;
        height: 22px;
    }
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
}
.content {
    height: calc(100vh - 25px);
}
</style>
