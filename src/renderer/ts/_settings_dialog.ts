import $ from 'jquery';
import { ipcRenderer } from 'electron';
import { MDCDialog } from '@material/dialog';
import { MDCTextField } from '@material/textfield';
import Config from 'electron-store';

const mcdir = new Config().get('mcdir');

const dialogSettings = new MDCDialog($('#dialog-settings').get(0));
const textfieldMcpath = new MDCTextField($('#textfield-mcpath').get(0));

const main = () => {
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
        const path: string = ipcRenderer.sendSync('onDirPick');
        if (path) {
            textfieldMcpath.value = path;
        }
    });
};

main();