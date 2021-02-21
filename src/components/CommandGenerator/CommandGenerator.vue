<template>
    <q-input
        dense
        filled
        square
        readonly
        stack-label
        label="Command"
        :disable="!soundEvent"
        v-model="generateCommand"
    >
        <template #after>
            <q-btn
                label="Copy"
                color="grey-10"
                :disable="!soundEvent"
                @click="qBtn_onClick"
            />
        </template>
    </q-input>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { IpcRenderer } from '@/renderer/IpcRenderer';

const OLD_COMMAND_VERSIONS = [
    'pre-1.6',
    'legacy',
    '1.7.4',
    '1.7.10',
    '1.8'
];

@Component
export default class CommandGenerator extends Vue {
    @Prop()
    public version!: string;

    @Prop()
    public soundEvent!: string | null;

    @Prop()
    public volume!: number;

    @Prop()
    public pitch!: number;

    public get generateCommand() {
        if (!this.soundEvent) return null;

        const command = [
            '/playsound',
            this.soundEvent
        ];

        if (!OLD_COMMAND_VERSIONS.includes(this.version)) {
            command.push('master');
        }

        command.push(
            '@p ~ ~ ~',
            this.volume.toFixed(1),
            this.pitch.toFixed(1)
        );

        return command.join(' ');
    }

    public qBtn_onClick() {
        const command = this.generateCommand;
        if (!command) return;

        IpcRenderer.Invoke('CommandGenerator_write-clipboard', command).then(() => {
            this.$q.notify({
                type: 'info',
                message: 'copied the command.',
                position: 'bottom-right',
                timeout: 800,
                badgeStyle: {
                    opacity: 0
                }
            });
        });
    }
}
</script>
