<template>
    <q-input
        filled
        square
        clearable
        readonly
        label="Custom .minecraft directory path"
        :hint="`Default: ${defaultMcDirPath}`"
        :input-style="{
            cursor: 'pointer'
        }"
        v-model="mcDirPath"
        @click="qInput_onClick"
        @input="qInput_onInput"
    >
        <template #prepend>
            <q-icon name="mdi-folder-outline"/>
        </template>
        <template #append v-if="mcDirPath">
            <q-btn
                flat
                round
                size="sm"
                icon="mdi-close"
                @click="qBtnClear_onClick"
            />
        </template>
    </q-input>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator';

import { IpcRenderer } from '@/renderer/IpcRenderer';
import { LocalStorage } from '@/renderer/LocalStorage';

@Component
export default class MCDirPicker extends Vue {
    @PropSync('value')
    public mcDirPath!: string;

    public defaultMcDirPath = '';

    public mounted() {
        IpcRenderer.Invoke('MCDirPicker_request-defaultMcDirPath').then(defaultMcDirPath => {
            this.defaultMcDirPath = defaultMcDirPath;
        });

        this.$emit('input', LocalStorage.McDirPath);
    }

    public qInput_onClick() {
        const currentPath = this.mcDirPath || this.defaultMcDirPath;
        IpcRenderer.Invoke('MCDirPicker_open-dir-picker', currentPath).then(dirPath => {
            if (!dirPath) return;

            this.$emit('input', dirPath);
        });
    }

    public qInput_onInput(value: string) {
        this.$emit('input', value);
    }

    public qBtnClear_onClick() {
        this.$emit('input', '');
    }
}
</script>

<style lang="scss" scoped>
.q-field ::v-deep.q-field__control::before {
    border-bottom-style: solid;
}
</style>
