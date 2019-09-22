import { BrowserWindow, BrowserWindowConstructorOptions, ipcMain, IpcMainEvent } from "electron";
import url from 'url';

abstract class WindowBase {
    public get Window() { return this._window; }
    protected _window: BrowserWindow | null = null;

    public get Id() { return this._id; }
    private _id: number;

    public get Title() { return this._title; }
    private _title: string;

    public constructor(url: string, opt?: BrowserWindowConstructorOptions) {
        this._window = new BrowserWindow(opt);
        this._id = this._window.id;
        this._title = this._window.getTitle();
        this._window.loadURL(`${url}#${this._id}`);

        this._window.on('closed', this.onClosed.bind(this));

        this._window.webContents.on('dom-ready', this.onDomReady.bind(this));

        this._window.on('maximize', () => this._window!.webContents.send('maximize'));
        this._window.on('unmaximize', () => this._window!.webContents.send('restore'));

        ipcMain.on('onMinimize', this.onMinimize.bind(this));
        ipcMain.on('onMaximize', this.onMaximize.bind(this));
        ipcMain.on('onClose', this.onClose.bind(this));
    }

    private onReadyToShow(): void { this._window!.show(); }

    private onClosed(): void { this._window = null; }

    private onDomReady(): void { this._window!.webContents.send('title', this._title); }

    private onMinimize(e: IpcMainEvent): void {
        if (url.parse(e.sender.getURL()).hash !== `#${this._id}`) return;
        this._window!.minimize();
    }

    private onMaximize(e: IpcMainEvent): void {
        if (url.parse(e.sender.getURL()).hash !== `#${this._id}`) return;
        if (this._window!.isMaximized()) this._window!.restore();
        else this._window!.maximize();
    }

    private onClose(e: IpcMainEvent): void {
        if (url.parse(e.sender.getURL()).hash !== `#${this._id}`) return;
        this._window!.close();
    }

    public Show(): void { this._window!.on('ready-to-show', this.onReadyToShow.bind(this)); }
}

export default WindowBase;