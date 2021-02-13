<template>
    <q-layout view="lHh Lpr lFf">
        <q-bar class="q-px-none fixed-top titlebar">
            <div class="drag-area"/>
            <span class="q-pl-sm text-subtitle2">{{ title }} v{{ version }}</span>

            <q-space/>

            <SystemButton
                icon="mdi-cog"
                tooltip="Settings"
                :color="isSettingsDialogOpen ? 'grey-7' : undefined"
                @click="isSettingsDialogOpen = !isSettingsDialogOpen"
            />

            <q-separator vertical class="q-mx-xs q-my-xs"/>

            <SystemButton
                icon="mdi-window-minimize"
                @click="btnMinimize_onClick"
            />
            <SystemButton
                :icon="isMaximize ? 'mdi-window-restore' : 'mdi-window-maximize'"
                @click="btnMaximize_onClick"
            />
            <SystemButton
                icon="mdi-window-close"
                @click="btnClose_onClick"
            />
        </q-bar>

        <q-page-container class="fixed-bottom content">
            <Home class="full-height"/>
        </q-page-container>

        <SettingsDialog v-model="isSettingsDialogOpen"/>
    </q-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { IpcRenderer } from '@/renderer/IpcRenderer';

import { version } from '../../../package.json';

import { Home } from '@/views/Home';
import { SystemButton } from '@/components/SystemButton';
import { SettingsDialog } from '@/components/SettingsDialog';

@Component({
    components: {
        Home,
        SystemButton,
        SettingsDialog
    },
    data: () => ({
        version
    })
})
export default class App extends Vue {
    public title = 'MC Playsound';

    public isMaximize = false;

    public isSettingsDialogOpen = false;

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

<style lang="scss">
html, body {
    overflow: hidden;
}
</style>

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
}
.content {
    height: calc(100vh - 25px);
}
</style>
