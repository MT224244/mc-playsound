//@ts-check

import fs from 'fs';
import { promisify } from 'util';

class SoundManager {
    /**
     * ボリューム
     * @public
     * @type {number}
     */
    get Volume() { return this._volume; }
    set Volume(val) {
        this._volume = val;
        this._gainNode.gain.value = this._volume;
    }

    /**
     * ピッチ
     * @public
     * @type {number}
     */
    get Pitch() { return this._pitch; }
    set Pitch(val) {
        this._pitch = val;
        this._buffSrc.playbackRate.value = this._pitch;
    }

    /**
     * ループ
     * @public
     * @type {boolean}
     */
    get IsLoop() { return this._isLoop; }
    set IsLoop(val) {
        this._isLoop = val;
        this._buffSrc.loop = this._isLoop;
    }
    
    constructor() {
        this._volume = 1;
        this._pitch = 1;
        this._isLoop = false;
        /** @private */
        this._audioContext = new AudioContext();
        /** @private */
        this._gainNode = this._audioContext.createGain();
        /** @private */
        this._buffSrc = this._audioContext.createBufferSource();
    }
    
    /**
     * 指定した音声ファイルを再生
     * @public
     * @param {string} path
     */
    async PlaySound(path) {
        const buff = await this._readFile(path);
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

    /**
     * @private
     * @param {string} path
     * @returns {Promise<Buffer>}
     */
    async _readFile(path) {
        return await promisify(fs.readFile)(path);
    }
}

export default SoundManager;