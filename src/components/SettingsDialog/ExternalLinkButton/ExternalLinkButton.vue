<template>
    <q-btn
        no-caps
        dense
        size="sm"
        type="a"
        target="_blank"
        :label="label"
        :icon="icon"
        :round="round"
        :href="href"
        :style="{
            'color': textColor,
            'background-color': color
        }"
    >
        <q-tooltip
            transition-show="fade"
            transition-hide="fade"
            content-class="q-pa-xs"
            :delay="500"
            :content-style="{
                backgroundColor: '#212121',
                fontSize: '0.6rem'
            }"
        >{{ href }}</q-tooltip>
    </q-btn>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { QBtn } from 'quasar';

@Component
export default class ExternalLinkButton extends QBtn {
    @Prop()
    public href?: string;
}
</script>
