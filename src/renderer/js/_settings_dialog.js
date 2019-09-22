//@ts-check

import $ from 'jquery';
import { ipcRenderer } from 'electron';
import { MDCDialog } from '@material/dialog';
import { MDCTextField } from '@material/textfield';
import Config from 'electron-store';

const mcdir = new Config().get('mcdir');

/** @type {MDCDialog} */
let dialogSettings;

/** @type {MDCTextField} */
let textfieldMcpath;

$(document).ready(() => {
    dialogSettings = new MDCDialog($('#dialog-settings').get(0));
    textfieldMcpath = new MDCTextField($('#textfield-mcpath').get(0));
    
    dialogSettings.scrimClickAction = '';
    dialogSettings.escapeKeyAction = '';
    dialogSettings.listen('MDCDialog:closed', (e) => {
        // @ts-ignore
        if (e.detail.action === 'ok') {
            ipcRenderer.send('onReload');
        }
    });

    $('#btn-settings').on('click', () => {
        textfieldMcpath.value = mcdir;
        dialogSettings.open();
    });

    $('#btn-pickdir').on('click', () => {
        /** @type {string} */
        const path = ipcRenderer.sendSync('onDirPick');
        if (path) {
            textfieldMcpath.value = path;
        }
    });
});