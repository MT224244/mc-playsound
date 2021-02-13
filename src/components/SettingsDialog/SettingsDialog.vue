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
                            <q-tab name="settings" label="Settings" icon="mdi-cog"/>
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
                            <q-tab name="information" label="About" icon="mdi-information-outline"/>
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
                            <AboutTab/>
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

import { SettingsTab } from '@/components/SettingsDialog/tabs/SettingsTab';
import { AboutTab } from '@/components/SettingsDialog/tabs/AboutTab';
import { LicensesTab } from '@/components/SettingsDialog/tabs/LicensesTab';

type TabName =
    | 'settings'
    | 'information'
    | 'licenses';

@Component({
    components: {
        SettingsTab,
        AboutTab,
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
