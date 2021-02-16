<template>
    <div class="q-ma-md">
        <SelectVersion v-model="selectedVersion"/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { SelectVersion } from '@/components/SelectVersion';

@Component({
    components: {
        SelectVersion
    }
})
export default class Home extends Vue {
    public selectedVersion = '';
}
</script>
