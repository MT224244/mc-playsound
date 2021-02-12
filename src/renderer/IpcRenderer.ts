import { ipcRenderer, IpcRendererEvent } from 'electron';

/**
 * IPC通信のラッパークラス
 * @static
 */
export class IpcRenderer {
    public static Invoke<T extends keyof IpcIHArgs>(channel: T, ...args: IpcIHArgs[T]['args']): Promise<IpcIHArgs[T]['return']>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static Invoke(channel: string, ...args: any[]): Promise<any> {
        return ipcRenderer.invoke(channel, ...args);
    }

    public static On<T extends keyof IpcSOArgs>(channel: T, listener: (event: IpcRendererEvent, ...args: IpcSOArgs[T]) => void): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static On(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => any): void {
        ipcRenderer.on(channel, listener);
    }
}
