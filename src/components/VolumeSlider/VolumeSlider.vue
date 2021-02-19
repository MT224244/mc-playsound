<template>
    <div class="row no-wrap items-center">
        <ControlLabel
            label="Volume"
            :value="volume.toFixed(1)"
            class="q-mr-md"
        />
        <q-slider
            snap
            :max="1"
            :min="0"
            :step="0.1"
            v-model="volume"
            @input="val => $emit('input', val)"
        />
    </div>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator';

import { ControlLabel } from '@/components/ControlLabel';

@Component({
    components: {
        ControlLabel
    }
})
export default class VolumeSlider extends Vue {
    @PropSync('value')
    public volume!: number;
}
</script>
