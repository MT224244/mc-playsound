<template>
    <div>
        <span class="text-h5">Licenses</span>
        <q-separator class="q-mb-lg"/>
        <q-list>
            <q-virtual-scroll
                :items="Object.keys(licenses)"
                class="full-height"
            >
                <template v-slot="{ item, index }">
                    <div :key="index" class="q-my-md">
                        <span class="text-h6">{{ licenses[item].name }}</span>
                        <div class="row no-wrap">
                            <span class="self-center q-mr-sm">v{{ licenses[item].version }}</span>
                            <ExternalLinkButton
                                v-if="licenses[item].repository"
                                round
                                icon="mdi-open-in-new"
                                class="self-center"
                                :href="licenses[item].repository"
                            />
                        </div>
                        <div
                            v-if="licenses[item].description"
                            class="text-caption"
                        >{{ licenses[item].description }}</div>
                    </div>
                </template>
            </q-virtual-scroll>
        </q-list>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { ExternalLinkButton } from '@/components/SettingsDialog/ExternalLinkButton';

import licenses from '@/../public/licenses.json';

@Component({
    components: {
        ExternalLinkButton
    },
    data: () => ({
        licenses
    })
})
export default class LicensesTab extends Vue {}
</script>

<style lang="scss" scoped>
.q-list {
    height: calc(100vh - 25px - 100px)
}
</style>
