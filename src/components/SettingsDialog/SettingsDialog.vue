<template>
    <q-dialog
        maximized
        transition-show="fade"
        transition-hide="fade"
        :content-style="{
            marginTop: '25px',
            backdropFilter: 'blur(5px)'
        }"
        v-model="isOpen"
    >
        <q-card>
            <q-splitter
                class="full-height"
                disable
                unit="px"
                :value="150"
            >
                <template #before>
                    <div class="column no-wrap full-height q-py-md">
                        <q-tabs
                            dense
                            no-caps
                            vertical
                            inline-label
                            align="left"
                            :breakpoint="0"
                            v-model="selectedTab"
                        >
                            <q-tab name="settings" label="Settings" icon="mdi-settings"/>
                        </q-tabs>
                        <q-space/>
                        <q-tabs
                            dense
                            no-caps
                            vertical
                            inline-label
                            align="left"
                            :breakpoint="0"
                            v-model="selectedTab"
                        >
                            <q-tab name="information" label="Information" icon="mdi-information-outline"/>
                            <q-tab name="licenses" label="Licenses" icon="mdi-format-list-bulleted"/>
                        </q-tabs>
                    </div>
                </template>
                <template #after>
                    <q-tab-panels
                        animated
                        transition-prev="slide-down"
                        transition-next="slide-up"
                        class="full-height"
                        v-model="selectedTab"
                    >
                        <q-tab-panel name="settings">
                            <SettingsTab/>
                        </q-tab-panel>
                        <q-tab-panel name="information">
                            <InformationTab/>
                        </q-tab-panel>
                        <q-tab-panel name="licenses">
                            <LicensesTab/>
                        </q-tab-panel>
                    </q-tab-panels>
                </template>
            </q-splitter>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator';

import SettingsTab from '@/components/SettingsDialog/tabs/SettingsTab.vue';
import InformationTab from '@/components/SettingsDialog/tabs/InformationTab.vue';
import LicensesTab from '@/components/SettingsDialog/tabs/LicensesTab.vue';

type TabName =
    | 'settings'
    | 'information'
    | 'licenses';

@Component({
    components: {
        SettingsTab,
        InformationTab,
        LicensesTab
    }
})
export default class SettingsDialog extends Vue {
    @PropSync('value')
    public isOpen!: boolean;

    public selectedTab: TabName = 'settings';
}
</script>

<style lang="scss" scoped>
.q-tabs--vertical {
    height: unset;
}
.q-tab {
    justify-content: flex-start;
}
.q-tab--active {
    background-color: rgba(#fff, 0.2);
}
.q-card, .q-tab-panels {
    background-color: transparent;
}
</style>
