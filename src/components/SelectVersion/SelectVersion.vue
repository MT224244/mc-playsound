<template>
    <q-select
        dense
        filled
        square
        hide-bottom-space
        options-dense
        error-message="Error, cannot read versions."
        :error="isError"
        label="Select Version"
        :options="versions"
        v-model="selectedVersion"
        @filter="qSelect_onFilter"
        @input="qSelect_onInput"
    />
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator';

import { IpcRenderer } from '@/renderer/IpcRenderer';
import { LocalStorage } from '@/renderer/LocalStorage';

@Component
export default class SelectVersion extends Vue {
    @PropSync('value')
    public selectedVersion!: string;

    public isError = false;

    public versions: string[] = [];

    public qSelect_onFilter(_inputValue: string, doneFn: (callbackFn: () => void) => void, abortFn: () => void) {
        this.isError = false;

        IpcRenderer.Invoke('SelectVersion_request-versions', LocalStorage.McDirPath).then(versions => {
            if (versions) {
                doneFn(() => {
                    this.versions = versions;
                });
            }
            else {
                this.isError = true;
                abortFn();
            }
        });
    }

    public qSelect_onInput(value: string) {
        this.$emit('input', value);
    }
}
</script>
