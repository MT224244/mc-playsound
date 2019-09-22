import { app, App } from 'electron';
import MainWindow from '../window/main_window';

class Application {
    public static get Current() {
        if (!this._current) this._current = new Application();
        return this._current;
    }
    private static _current: Application;

    private _app: App = app;

    private constructor() { }

    private onWindowAllClosed(): void { this._app.quit(); }

    private onReady(): void { new MainWindow(); }

    public Run(): void {
        this._app.on('window-all-closed', this.onWindowAllClosed.bind(this));
        this._app.on('ready', this.onReady.bind(this));
    }

    public Exit(): void { this._app.quit(); }
}

export default Application;