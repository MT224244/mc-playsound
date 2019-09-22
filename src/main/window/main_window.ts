import Config from 'electron-store';
import { ipcMain, dialog } from 'electron';

import WindowBase from "../util/window_base";

class MainWindow extends WindowBase {
    private _config: Config = new Config({
        defaults: {
            mcdir: `${process.env.APPDATA}/.minecraft`
        }
    });

    public constructor() {
        super(`file://${__dirname}/../../renderer/html/main.html`, {
            title: 'MC Playsound',
            width: 800,
            height: 600,
            minWidth: 400,
            minHeight: 330,
            backgroundColor: '#121212',
            show: false,
            frame: false,
            webPreferences: { nodeIntegration: true }
        });

        ipcMain.on('onDirPick', e => {
            dialog.showOpenDialog(this.Window!, {
                properties: ['openDirectory'],
                defaultPath: this._config.get('mcdir')
            }).then(value => {
                if (value.filePaths) {
                    e.returnValue = value.filePaths[0];
                    if (value.filePaths[0]) this._config.set('mcdir', value.filePaths[0]);
                }
            });
        });

        ipcMain.on('onReload', () => this._window!.reload());

        this.Show();
    }
}

export default MainWindow;