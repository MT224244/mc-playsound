<template>
    <div class="row no-wrap items-center">
        <ControlLabel
            label="Pitch"
            :value="pitch.toFixed(1)"
            class="q-mr-md"
        />
        <q-slider
            snap
            :max="2"
            :min="0.5"
            :step="0.1"
            v-model="pitch"
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
export default class PitchSlider extends Vue {
    @PropSync('value')
    public pitch!: number;
}
</script>
