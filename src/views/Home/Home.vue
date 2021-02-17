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
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { SelectVersion } from '@/components/SelectVersion';
import { SearchBox } from '@/components/SearchBox';

@Component({
    components: {
        SelectVersion,
        SearchBox
    }
})
export default class Home extends Vue {
    public selectedVersion = '';
    public searchText = '';

    public selectVersion_onInput() {
        // TODO: Write the processing when value changed.
        console.log(this.selectedVersion);
    }

    public searchBox_onInput() {
        // TODO: Write the processing when value changed.
        console.log(this.searchText);
    }
}
</script>
