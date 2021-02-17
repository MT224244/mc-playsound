<template>
    <q-input
        dense
        filled
        square
        clearable
        label="Search"
        v-model="searchText"
        @input="qInput_onInput"
    >
        <template #prepend>
            <q-icon name="mdi-magnify"/>
        </template>
    </q-input>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator';

@Component
export default class SearchBox extends Vue {
    @PropSync('value')
    public searchText!: string;

    public qInput_onInput(value: string) {
        this.$emit('input', value);
    }
}
</script>
