import { readFileSync } from 'fs';

class SoundManager {
    /**
     * ボリューム
     */
    public get Volume() { return this._volume; }
    public set Volume(val) {
        this._volume = val;
        this._gainNode.gain.value = this._volume;
    }
    private _volume: number;

    /**
     * ピッチ
     */
    public get Pitch() { return this._pitch; }
    public set Pitch(val) {
        this._pitch = val;
        this._buffSrc.playbackRate.value = this._pitch;
    }
    private _pitch: number;

    /**
     * ループ
     */
    public get IsLoop() { return this._isLoop; }
    public set IsLoop(val) {
        this._isLoop = val;
        this._buffSrc.loop = this._isLoop;
    }
    private _isLoop: boolean;

    private _audioContext: AudioContext;
    private _gainNode: GainNode;
    private _buffSrc: AudioBufferSourceNode;

    public constructor() {
        this._volume = 1;
        this._pitch = 1;
        this._isLoop = false;

        this._audioContext = new AudioContext();
        this._gainNode = this._audioContext.createGain();
        this._buffSrc = this._audioContext.createBufferSource();
    }

    /**
     * 指定した音声ファイルを再生
     */
    public PlaySound(path: string) {
        const buff = readFileSync(path);
        this._audioContext.decodeAudioData(buff.buffer).then(audioBuff => {
            this._buffSrc.buffer = null;

            this._buffSrc = this._audioContext.createBufferSource();
            this._buffSrc.buffer = audioBuff;
            this._buffSrc.loop = this.IsLoop;
            this._buffSrc.loopStart = 0;
            this._buffSrc.loopEnd = audioBuff.duration;
            this._buffSrc.playbackRate.value = this.Pitch;
            this._gainNode.gain.value = this.Volume;

            this._buffSrc.connect(this._gainNode);
            this._gainNode.connect(this._audioContext.destination);
            this._buffSrc.connect(this._audioContext.destination);

            this._buffSrc.start(0);
            this._buffSrc.onended = () => {
                this._buffSrc.onended = null;
                this._buffSrc.stop();
            };
        }).catch(err => alert(err));
    }
}

export default SoundManager;