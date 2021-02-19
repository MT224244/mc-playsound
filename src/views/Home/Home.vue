<template>
    <div class="column no-wrap">
        <div class="row q-mt-md q-mx-md">
            <div class="col-4">
                <SelectVersion
                    class="q-mr-sm"
                    v-model="selectedVersion"
                    @input="selectVersion_onInput"
                />
            </div>
            <div class="col-8">
                <SearchBox
                    class="q-ml-sm"
                    v-model="searchText"
                    @input="searchBox_onInput"
                />
            </div>
        </div>
        <div class="q-mt-md q-mx-md">
            <SoundList
                :sounds="sounds"
                v-model="selectedSound"
                @dblclick="soundList_onDblClick"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { IpcRenderer } from '@/renderer/IpcRenderer';

import { SelectVersion } from '@/components/SelectVersion';
import { SearchBox } from '@/components/SearchBox';
import { SoundList } from '@/components/SoundList';

@Component({
    components: {
        SelectVersion,
        SearchBox,
        SoundList
    }
})
export default class Home extends Vue {
    public selectedVersion = '';
    public searchText: string | null = '';

    public sounds: SoundData[] = [];
    public selectedSound: SoundData | null = null;

    public selectVersion_onInput() {
        this.selectedSound = null;
        this.sounds = [];

        IpcRenderer.Invoke('Home_request-sounds', this.selectedVersion).then(sounds => {
            this.sounds = sounds || [];
        });
    }

    public soundList_onDblClick() {
        // TODO: Write the processing of play a sound.
        console.log(this.selectedSound);
    }

    public searchBox_onInput() {
        // TODO: Write the processing when value changed.
        console.log(this.searchText);
    }
}
</script>

<style lang="scss" scoped>
.sound-list {
    // TODO: Temporary value.
    height: 55vh;
}
</style>
