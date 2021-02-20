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
                    @input="search"
                />
            </div>
        </div>
        <div class="q-mt-md q-mx-md">
            <SoundList
                :sounds="sounds"
                v-model="selectedSound"
                @dblclick="play"
            />
        </div>
        <div class="row q-mt-md q-mx-md">
            <div class="col-9 q-pr-md">
                <VolumeSlider class="q-mb-sm" v-model="volume"/>
                <PitchSlider v-model="pitch"/>
            </div>
            <div class="col-3 row justify-center">
                <LoopSwitch class="q-mb-sm" v-model="isLoop"/>
                <q-btn
                    label="Play"
                    color="primary"
                    :disable="!selectedSound"
                    class="q-mx-md full-width"
                    @click="play"
                />
            </div>
        </div>
        <div class="q-mt-sm q-mx-md">
            <CommandGenerator
                :version="selectedVersion"
                :soundEvent="selectedSound && selectedSound.soundEvent"
                :volume="volume"
                :pitch="pitch"
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
import { VolumeSlider } from '@/components/VolumeSlider';
import { PitchSlider } from '@/components/PitchSlider';
import { LoopSwitch } from '@/components/LoopSwitch';
import { CommandGenerator } from '@/components/CommandGenerator';

@Component({
    components: {
        SelectVersion,
        SearchBox,
        SoundList,
        VolumeSlider,
        PitchSlider,
        LoopSwitch,
        CommandGenerator
    }
})
export default class Home extends Vue {
    public selectedVersion = '';
    public searchText: string | null = '';

    public sounds: SoundData[] = [];
    private allSounds: SoundData[] = [];

    public selectedSound: SoundData | null = null;

    public volume = 1;
    public pitch = 1;
    public isLoop = false;

    /**
     * Narrow down the list of sounds.
     */
    private search() {
        this.sounds = this.allSounds.filter(x => {
            return (x.soundEvent || 'unknown').includes(this.searchText || '');
        });
    }

    /**
     * Play the selected sound.
     */
    public play() {
        // TODO: Write the processing of play a sound.
        console.log(this.selectedSound);
    }

    public selectVersion_onInput() {
        this.selectedSound = null;
        this.sounds = [];

        IpcRenderer.Invoke('Home_request-sounds', this.selectedVersion).then(sounds => {
            this.allSounds = sounds || [];
            this.search();
        });
    }
}
</script>

<style lang="scss" scoped>
.sound-list {
    height: calc(100vh - 25px - 248px);
}
</style>
