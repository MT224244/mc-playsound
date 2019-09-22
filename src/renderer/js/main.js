//@ts-check

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

/** @type {string} */
const mcdir = new Config().get('mcdir');

const soundManager = new SoundManager();

/** @type {MDCSelect} */
let selectVersion;

/** @type {MDCTextField} */
let textfieldSearch;

/** @type {MDCList} */
let listSounds;

/** @type {MDCSlider} */
let sliderVolume;

/** @type {MDCSlider} */
let sliderPitch;

/** @type {MDCSwitch} */
let switchLoop;

$(document).ready(() => {
    getVersions();

    selectVersion = new MDCSelect($('#select-version').get(0));
    textfieldSearch = new MDCTextField($('#textfield-search').get(0));
    listSounds = new MDCList($('#list-sounds').get(0));
    sliderVolume = new MDCSlider($('#slider-volume').get(0));
    sliderPitch = new MDCSlider($('#slider-pitch').get(0));
    switchLoop = new MDCSwitch($('#switch-loop').get(0));

    selectVersion.listen('MDCSelect:change', () => setVersion());

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

        /** @type {string} */
        const hash = $(listSounds.listElements[listSounds.selectedIndex]).data('value');

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

        /** @type {string} */
        const hash = $(listSounds.listElements[listSounds.selectedIndex]).data('value');
        
        soundManager.PlaySound(join(mcdir, `assets/objects/${hash.slice(0, 2)}/${hash}`));
    });
});

/**
 * バージョン一覧を取得して格納
 */
function getVersions() {
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
function setVersion() {
    /** @type {{ objects: {} }} */
    const jObj = JSON.parse(readFileSync(selectVersion.value, 'utf8'));
    let soundNames = getSoundNames(jObj);
    
    $('#list-sounds').empty();

    /** @type {string[]} */
    let elems = [];

    Object.keys(jObj.objects).forEach(key => {
        if (key.endsWith('.ogg')) {
            /** @type {string | undefined} */
            let name;
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
 * @param {{ objects: {} }} jObj
 * @returns {{} | undefined}
 */
function getSoundNames(jObj) {
    /** @type {{} | undefined} */
    let result = undefined;

    /** @type {{hash: string}} */
    const obj = jObj.objects['minecraft/sounds.json'];

    if (obj) {
        /** @type {{}} */
        const soundObj = JSON.parse(readFileSync(join(mcdir, `assets/objects/${obj.hash.slice(0, 2)}/${obj.hash}`), 'utf8'));

        result = {};
        Object.keys(soundObj).forEach(key => {
            for (const elem of soundObj[key].sounds) {
                if (elem['name']) {
                    if (!result[`minecraft/sounds/${elem.name}.ogg`]) {
                        result[`minecraft/sounds/${elem.name}.ogg`] = key;
                    }
                }
                else {
                    if (!result[`minecraft/sounds/${elem}.ogg`]) {
                        result[`minecraft/sounds/${elem}.ogg`] = key;
                    }
                }
            }
        });
    }

    return result;
}