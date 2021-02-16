import { LocalStorage as QLocalStorage } from 'quasar';

const MC_DIR_PATH = 'MC_DIR_PATH';

export class LocalStorage {
    public static get McDirPath() {
        return QLocalStorage.getItem<string>(MC_DIR_PATH) || '';
    }

    public static set McDirPath(val: string) {
        QLocalStorage.set(MC_DIR_PATH, val || '');
    }
}
