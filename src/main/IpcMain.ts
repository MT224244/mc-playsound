import { BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';

/**
 * IPC通信のラッパークラス
 * @static
 */
export class IpcMain {
    public static Handle<T extends keyof IpcIHArgs>(channel: T, listener: (event: IpcMainInvokeEvent, ...args: IpcIHArgs[T]['args']) => IpcIHArgs[T]['return']): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static Handle(channel: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => any): void {
        ipcMain.handle(channel, listener);
    }

    public static Send<T extends keyof IpcSOArgs>(channel: T, window: BrowserWindow, ...args: IpcSOArgs[T]): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static Send(channel: string, window: BrowserWindow, ...args: any[]): void {
        window.webContents.send(channel, ...args);
    }
}
