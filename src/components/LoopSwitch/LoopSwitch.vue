<template>
    <div class="row no-wrap items-center justify-center">
        <ControlLabel
            label="Loop"
            :value="isLoop ? 'ON' : 'OFF'"
            class="q-mr-xs"
        />
        <q-toggle
            v-model="isLoop"
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
export default class LoopSwitch extends Vue {
    @PropSync('value')
    public isLoop!: boolean;
}
</script>

<style lang="scss" scoped>
.q-toggle {
    height: 20px;
}
</style>
