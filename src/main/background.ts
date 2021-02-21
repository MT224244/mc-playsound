import { app, protocol, shell, dialog, clipboard, BrowserWindow, NewWindowWebContentsEvent, IpcMainInvokeEvent } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { readdirSync, readFileSync } from 'fs';
import path from 'path';

import { IpcMain } from '@/main/IpcMain';

const isDevelopment = process.env.NODE_ENV !== 'production';

let win: BrowserWindow;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {
        scheme: 'app',
        privileges: {
            secure: true,
            standard: true
        }
    }
]);

const getDefaultMcDirPath = () => {
    return path.join(app.getPath('appData'), '.minecraft');
};

// #region Electron.app events

/**
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.\
 * Some APIs can only be used after this event occurs.
 */
const app_onReady = async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS);
        }
        catch (e) {
            console.error('Vue Devtools failed to install:', e.toString());
        }
    }

    createWindow();
};

const app_onActivate = () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
};

/**
 * Quit when all windows are closed.
 */
const app_onWindowAllClosed = () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
};

// #endregion

// #region win events

const win_onMaximize = () => {
    IpcMain.Send('maximize', win, true);
};

const win_onUnmaximize = () => {
    IpcMain.Send('maximize', win, false);
};

const win_onReadyToShow = () => {
    win.show();
};

const webContents_onNewWindow = (e: NewWindowWebContentsEvent, url: string) => {
    e.preventDefault();
    shell.openExternal(url);
};

// #endregion

// #region ipcMain events

const ipcMain_handleAppMinimize = () => {
    win.minimize();
};

const ipcMain_handleAppMaximize = () => {
    if (win.isMaximized()) {
        win.unmaximize();
    }
    else {
        win.maximize();
    }
};

const ipcMain_handleAppClose = () => {
    win.destroy();
};

const ipcMain_MCDirPickerRequestDefaultMcDirPath = () => {
    return getDefaultMcDirPath();
};

const ipcMain_MCDirPickerOpenDirPicker = (_e: IpcMainInvokeEvent, currentPath: string) => {
    const dirs = dialog.showOpenDialogSync(win, {
        properties: [
            'openDirectory'
        ],
        defaultPath: currentPath
    });

    return dirs ? dirs[0] : undefined;
};

const ipcMain_SelectVersionRequestVersions = (_e: IpcMainInvokeEvent, mcDirPath?: string) => {
    try {
        const mcDir = mcDirPath || getDefaultMcDirPath();

        const indexesPath = path.join(mcDir, 'assets/indexes');
        const fileNames = readdirSync(indexesPath).filter(x => /.*\.json$/.test(x));

        const versions: string[] = [];
        for (const fileName of fileNames) {
            try {
                const filePath = path.join(mcDir, 'assets/indexes', fileName);
                const obj: McVersionJson = JSON.parse(readFileSync(filePath, 'utf-8'));

                if (obj.objects) {
                    versions.push(path.basename(fileName, '.json'));
                }
            }
            catch (err) {
                console.log(err.message);
            }
        }

        return versions;
    }
    catch {
        return undefined;
    }
};

const ipcMain_CommandGeneratorWriteClipboard = (_e: IpcMainInvokeEvent, text: string) => {
    clipboard.writeText(text);
};

const ipcMain_SoundRequestSoundFileBuf = (_e: IpcMainInvokeEvent, hash: string, mcDirPath?: string) => {
    try {
        const mcDir = mcDirPath || getDefaultMcDirPath();

        const soundFilePath = path.join(mcDir, 'assets/objects', hash.slice(0, 2), hash);

        return readFileSync(soundFilePath);
    }
    catch {
        return undefined;
    }
};

const ipcMain_HomeRequestSounds = (_e: IpcMainInvokeEvent, versionName: string, mcDirPath?: string) => {
    try {
        const mcDir = mcDirPath || getDefaultMcDirPath();

        const versionJsonPath = path.join(mcDir, 'assets/indexes', `${versionName}.json`);
        const { objects }: McVersionJson = JSON.parse(readFileSync(versionJsonPath, 'utf-8'));

        const result: SoundData[] = [];

        // sounds.json
        const soundsJsonKey = Object.keys(objects).find(x => /.*\/?sounds.json$/.test(x));
        const soundNames: { [key: string]: string } = {};
        if (soundsJsonKey) {
            const { hash } = objects[soundsJsonKey];
            const soundsJsonPath = path.join(mcDir, 'assets/objects', hash.slice(0, 2), hash);
            const soundsJson: McSoundsJson = JSON.parse(readFileSync(soundsJsonPath, 'utf-8'));

            for (const soundEvent of Object.keys(soundsJson)) {
                for (const sound of soundsJson[soundEvent].sounds) {
                    const name = (typeof sound === 'string')
                        ? sound
                        : sound.name;

                    soundNames[name] = soundEvent;
                }
            }
        }

        for (const key of Object.keys(objects).filter(x => /.*\.ogg$/.test(x))) {
            // 1.7.10~ minecraft/sounds/[name].ogg
            // 1.7.4   sounds/[name].ogg
            // legacy  sound/[name].ogg
            const n = key.replace(/^(?:minecraft\/)?(?:sounds?\/)?(.*)\.ogg$/, '$1');
            result.push({
                soundEvent: soundNames[n] || undefined,
                name: key,
                hash: objects[key].hash
            });
        }

        return result;
    }
    catch {
        return undefined;
    }
};

// #endregion

const createWindow = async () => {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        show: false,
        backgroundColor: '#121212',
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.on('maximize', win_onMaximize);
    win.on('unmaximize', win_onUnmaximize);
    win.on('ready-to-show', win_onReadyToShow);
    win.webContents.on('new-window', webContents_onNewWindow);

    IpcMain.Handle('App_minimize', ipcMain_handleAppMinimize);
    IpcMain.Handle('App_maximize', ipcMain_handleAppMaximize);
    IpcMain.Handle('App_close', ipcMain_handleAppClose);

    IpcMain.Handle('MCDirPicker_request-defaultMcDirPath', ipcMain_MCDirPickerRequestDefaultMcDirPath);
    IpcMain.Handle('MCDirPicker_open-dir-picker', ipcMain_MCDirPickerOpenDirPicker);

    IpcMain.Handle('SelectVersion_request-versions', ipcMain_SelectVersionRequestVersions);

    IpcMain.Handle('CommandGenerator_write-clipboard', ipcMain_CommandGeneratorWriteClipboard);

    IpcMain.Handle('Sound_request-sound-file-buf', ipcMain_SoundRequestSoundFileBuf);

    IpcMain.Handle('Home_request-sounds', ipcMain_HomeRequestSounds);

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
        if (!process.env.IS_TEST) win.webContents.openDevTools();
    }
    else {
        createProtocol('app');
        // Load the index.html when not in development
        win.loadURL('app://./index.html');
    }
};

app.on('window-all-closed', app_onWindowAllClosed);
app.on('activate', app_onActivate);
app.on('ready', app_onReady);

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit();
            }
        });
    }
    else {
        process.on('SIGTERM', () => {
            app.quit();
        });
    }
}
