<template>
    <div>
        <span class="text-h5">Settings</span>
        <q-separator class="q-mb-lg"/>
        <div>
            <MCDirPicker v-model="mcDirPath"/>
        </div>
        <q-page-sticky position="bottom-right" :offset="[10, 10]">
            <q-btn
                no-caps
                rounded
                color="primary"
                icon="mdi-content-save-outline"
                label="Save"
                :disable="!isChanges"
                @click="qBtnSave_onClick"
            />
        </q-page-sticky>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { LocalStorage } from '@/renderer/LocalStorage';

import { MCDirPicker } from '@/components/SettingsDialog/tabs/SettingsTab/MCDirPicker';

@Component({
    components: {
        MCDirPicker
    }
})
export default class SettingsTab extends Vue {
    public defaultMcDirPath = '';

    public mcDirPath = '';
    private beforeMcDirPath = '';

    public get isChanges() {
        if (this.mcDirPath !== this.beforeMcDirPath) {
            return true;
        }

        return false;
    }

    public mounted() {
        this.beforeMcDirPath = this.mcDirPath;
    }

    public qBtnSave_onClick() {
        LocalStorage.McDirPath = this.mcDirPath;
        this.beforeMcDirPath = this.mcDirPath;
        this.$q.notify({
            type: 'positive',
            message: 'Saved the settings.',
            color: 'green',
            timeout: 1000,
            badgeStyle: {
                opacity: 0
            }
        });
    }
}
</script>
