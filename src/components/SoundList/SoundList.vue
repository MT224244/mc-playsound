<template>
    <q-list class="sound-list">
        <q-virtual-scroll
            :items="sounds"
            :virtual-scroll-item-size="48"
            :virtual-scroll-slice-size="70"
            class="full-height"
        >
            <template v-slot="{ item, index }">
                <q-item
                    clickable
                    v-ripple
                    :key="index"
                    :active="selectedSound === item"
                    class="q-py-xs q-px-md"
                    @click="$emit('input', item)"
                    @dblclick="$emit('dblclick')"
                >
                    <q-item-section>
                        <q-item-label
                            lines="1"
                            :style="item.soundEvent || {
                                color: '#fbb',
                                opacity: 0.6
                            }"
                            class="non-selectable text-body1"
                        >{{ item.soundEvent || 'unknown' }}</q-item-label>
                        <q-item-label
                            caption
                            lines="1"
                            class="non-selectable sound-name"
                        >{{ item.name }}</q-item-label>
                    </q-item-section>
                </q-item>
            </template>
        </q-virtual-scroll>
    </q-list>
</template>

<script lang="ts">
import { Component, PropSync, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SoundList extends Vue {
    @PropSync('value')
    public selectedSound!: SoundData;

    @Prop()
    public sounds!: SoundData[];
}
</script>

<style lang="scss" scoped>
@import '@/styles/quasar.scss';

.sound-list {
    background-color: rgba(white, 0.03);
    .q-item--active {
        color: white;
        background-color: rgba($primary, 0.3);
    }
    .sound-name {
        color: rgba(white, 0.4);
    }
}
</style>
