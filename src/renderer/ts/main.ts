import $ from 'jquery';
import { MDCRipple } from '@material/ripple';
import { MDCSelect } from '@material/select';
import { MDCTextField } from '@material/textfield';
import { MDCList } from '@material/list';
import { MDCSlider } from '@material/slider';
import { MDCSwitch } from '@material/switch';
import { readFileSync, readdir } from 'fs';
import { join, extname, basename } from 'path';
import Config from 'electron-store';
import Enumerable from 'linq';

import SoundManager from './_sound_manager';

import './_base';
import './_info_dialog';
import './_settings_dialog';

type McObj = {
    objects: {
        [key: string]: {
            hash: string
        }
    }
}

type SoundJson = {
    [key: string]: {
        sounds: (string | { name: string })[]
    }
}

const mcdir: string = new Config().get('mcdir');

const soundManager = new SoundManager();

const selectVersion = new MDCSelect($('#select-version').get(0));
const textfieldSearch = new MDCTextField($('#textfield-search').get(0));
const listSounds = new MDCList($('#list-sounds').get(0));
const sliderVolume = new MDCSlider($('#slider-volume').get(0));
const sliderPitch = new MDCSlider($('#slider-pitch').get(0));
const switchLoop = new MDCSwitch($('#switch-loop').get(0));

/**
 * バージョン一覧を取得して格納
 */
const getVersions = () => {
    const indexes = join(mcdir, 'assets/indexes');
    readdir(indexes, 'utf8', (err, data) => {
        const elems = Enumerable.from(data)
            .where(x => extname(x) === '.json')
            .where(x => JSON.parse(readFileSync(join(indexes, x), 'utf8')).objects !== undefined)
            .select(x => `<li class="mdc-list-item" data-value="${join(indexes, x)}">${basename(x, '.json')}</li>`)
            .toArray();
        $('#select-version__menu .mdc-list').append($(elems.join('')));
    });
}

/**
 * 選択したバージョンのサウンドリストを取得して表示
 */
const setVersion = () => {
    const jObj: McObj = JSON.parse(readFileSync(selectVersion.value, 'utf8'));
    const soundNames = getSoundNames(jObj);

    $('#list-sounds').empty();

    let elems: string[] = [];

    Object.keys(jObj.objects).forEach(key => {
        if (key.endsWith('.ogg')) {
            let name: string | undefined;

            if (soundNames) name = soundNames[key];
            if (!name) name = 'unknown';

            elems.push(`
                <li class="mdc-list-item" role="option" data-name="${name}" data-value="${jObj.objects[key].hash}">
                    <span class="mdc-list-item__text">
                        <span class="mdc-list-item__primary-text">${name}</span>
                        <span class="mdc-list-item__secondary-text">${key}</span>
                    </span>
                </li>`);
        }
    });
    $('#list-sounds').append($(elems.join('')));
    $('.mdc-list-item').each((i, elem) => { new MDCRipple(elem); });

    textfieldSearch.value = '';
    $('#list-sounds').scrollTop(0);

    $('#select-version').removeClass('mdc-select--focused');
}

/**
 * そのバージョンのサウンド名リストを取得
 */
const getSoundNames = (jObj: McObj): {[key: string]: string} | undefined => {
    let result: {[key: string]: string} | undefined = undefined;

    const obj: { hash: string; } = jObj.objects['minecraft/sounds.json'];

    if (obj) {
        const soundObj: SoundJson = JSON.parse(readFileSync(join(mcdir, `assets/objects/${obj.hash.slice(0, 2)}/${obj.hash}`), 'utf8'));

        result = {};
        Object.keys(soundObj).forEach(key => {
            for (const elem of soundObj[key].sounds) {
                if (typeof elem !== 'string') {
                    if (result && !result[`minecraft/sounds/${elem.name}.ogg`]) {
                        result[`minecraft/sounds/${elem.name}.ogg`] = key;
                    }
                }
                else {
                    if (result && !result[`minecraft/sounds/${elem}.ogg`]) {
                        result[`minecraft/sounds/${elem}.ogg`] = key;
                    }
                }
            }
        });
    }

    return result;
}

const main = () => {
    getVersions();

    selectVersion.listen('MDCSelect:change', setVersion);

    textfieldSearch.listen('input', () => {
        for (const elem of listSounds.listElements) {
            // @ts-ignore
            if (!elem.dataset.name.includes(textfieldSearch.value)) {
                $(elem).css({'display': 'none'});
            }
            else {
                $(elem).css({'display': ''});
            }
        }
    });

    listSounds.singleSelection = true;
    listSounds.listen('dblclick', () => {
        if (typeof listSounds.selectedIndex !== 'number') return;

        const hash: string = $(listSounds.listElements[listSounds.selectedIndex]).data('value');

        soundManager.PlaySound(join(mcdir, `assets/objects/${hash.slice(0, 2)}/${hash}`));
    });

    sliderVolume.listen('MDCSlider:input', () => {
        soundManager.Volume = sliderVolume.value - 1;
        $('#volumebar p').text(sliderVolume.value.toFixed(1));
    });
    sliderPitch.listen('MDCSlider:input', () => {
        soundManager.Pitch = sliderPitch.value;
        $('#pitchbar p').text(sliderPitch.value.toFixed(1));
    });
    switchLoop.listen('click', () => {
        soundManager.IsLoop = switchLoop.checked;
        $('#loopswitch p').text(switchLoop.checked ? 'on' : 'off');
    });

    $('#btn-play').on('click', () => {
        if (typeof listSounds.selectedIndex !== 'number') return;
        if (listSounds.selectedIndex < 0) return;

        const hash: string = $(listSounds.listElements[listSounds.selectedIndex]).data('value');

        soundManager.PlaySound(join(mcdir, `assets/objects/${hash.slice(0, 2)}/${hash}`));
    });
};

main();