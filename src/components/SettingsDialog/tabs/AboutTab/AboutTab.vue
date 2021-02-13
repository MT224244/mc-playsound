<template>
    <div>
        <span class="text-h5">About</span>
        <q-separator class="q-mb-lg"/>
        <div class="row align-center q-mb-md">
            <q-icon name="img:icon.ico" size="100px" class="q-mr-md"/>
            <div class="column justify-center">
                <span class="text-h6">MC Playsound</span>
                <span>v{{ version }}</span>
                <div class="q-mt-xs">
                    <ExternalLinkButton
                        color="#a31f34"
                        :label="`License: ${license}`"
                        :href="`${repository}/blob/master/LICENSE`"
                        class="q-mr-xs"
                    />
                    <ExternalLinkButton
                        color="#f5f5f5"
                        text-color="#333"
                        label="Repository"
                        icon="mdi-github"
                        :href="repository"
                    />
                </div>
            </div>
        </div>
        <div class="q-mb-md">{{ description }}</div>
        <div>
            <span class="q-mr-sm">Author: MT224244</span>
            <ExternalLinkButton
                round
                color="#f5f5f5"
                text-color="#333"
                icon="mdi-github"
                href="https://github.com/MT224244"
                class="q-mr-xs"
            />
            <ExternalLinkButton
                round
                color="#00acee"
                icon="mdi-twitter"
                href="https://twitter.com/MT224244"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { ExternalLinkButton } from '@/components/SettingsDialog/tabs/AboutTab/ExternalLinkButton';

import { description, version, repository, license } from '@/../package.json';

@Component({
    components: {
        ExternalLinkButton
    },
    data: () => ({
        description,
        version,
        repository,
        license
    })
})
export default class AboutTab extends Vue {
    public mounted() {
        console.log(version, repository);
    }
}
</script>
