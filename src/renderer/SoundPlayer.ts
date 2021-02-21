import { EventEmitter } from 'events';

import { IpcRenderer } from '@/renderer/IpcRenderer';
import { LocalStorage } from '@/renderer/LocalStorage';

type EventArgs = {
    'finish': [];
};

export class SoundPlayer extends EventEmitter {
    private audioContext: AudioContext;
    private gainNode: GainNode;
    private audioBufSrc: AudioBufferSourceNode;

    private volume: number;
    private pitch: number;
    private isLoop: boolean;

    public constructor(initVolume: number, initPitch: number, initLoop: boolean) {
        super();

        this.volume = initVolume;
        this.pitch = initPitch;
        this.isLoop = initLoop;

        this.audioContext = new AudioContext();
        this.gainNode = this.audioContext.createGain();
        this.audioBufSrc = this.audioContext.createBufferSource();
    }

    public SetVolume(val: number) {
        this.volume = val;
        this.gainNode.gain.value = val - 1;
    }

    public SetPitch(val: number) {
        this.pitch = val;
        this.audioBufSrc.playbackRate.value = this.pitch;
    }

    public SetLoop(val: boolean) {
        this.isLoop = val;
        this.audioBufSrc.loop = val;
    }

    public async Play(hash: string) {
        this.audioBufSrc.buffer = null;

        const soundFileBuf = await this.getSoundFileBuf(hash);
        if (!soundFileBuf) return;

        const audioBuf = await this.audioContext.decodeAudioData(soundFileBuf.buffer);

        this.audioBufSrc = this.audioContext.createBufferSource();
        this.audioBufSrc.buffer = audioBuf;
        this.audioBufSrc.loop = this.isLoop;

        this.audioBufSrc.playbackRate.value = this.pitch;
        this.gainNode.gain.value = this.volume - 1;

        this.audioBufSrc.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
        this.audioBufSrc.connect(this.audioContext.destination);

        this.audioBufSrc.start(0);
        this.audioBufSrc.onended = () => {
            this.Stop();
            this.emit('finish');
        };
    }

    public Stop() {
        if (!this.audioBufSrc.buffer) return;

        this.audioBufSrc.buffer = null;
        this.audioBufSrc.stop();
    }

    public on<T extends keyof EventArgs>(event: T, listener: (...args: EventArgs[T]) => void): this;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public on(event: string | symbol, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

    public emit<T extends keyof EventArgs>(event: T, ...args: EventArgs[T]): boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public emit(event: string | symbol, ...args: any[]): boolean {
        return super.emit(event, ...args);
    }

    private async getSoundFileBuf(hash: string) {
        return await IpcRenderer.Invoke(
            'Sound_request-sound-file-buf',
            hash,
            LocalStorage.McDirPath
        );
    }
}
