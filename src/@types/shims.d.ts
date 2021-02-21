/**
 * Minecraftのバージョン毎にリソースへのパスが記されたJsonファイルの形式
 */
type McVersionJson = {
    objects: {
        [key: string]: {
            hash: string;
            size: number;
        }
    }
};

/**
 * sounds.json
 */
type McSoundsJson = {
    [key: string]: {
        sounds: (string | {
            name: string;
        })[];
        subtitle?: string;
    }
};

type SoundData = {
    soundEvent?: string;
    name: string;
    hash: string;
};

/**
 * IPC通信の引数定義\
 * Invoke, Handle用
 */
type IpcIHArgs = {
    'App_minimize': {
        args: [];
        return: void;
    };
    'App_maximize': {
        args: [];
        return: void;
    };
    'App_close': {
        args: [];
        return: void;
    };

    'MCDirPicker_request-defaultMcDirPath': {
        args: [];
        return: string;
    };
    'MCDirPicker_open-dir-picker': {
        args: [
            currentPath: string
        ];
        return?: string;
    };

    'SelectVersion_request-versions': {
        args: [
            mcDirPath?: string
        ];
        return?: string[];
    };

    'CommandGenerator_write-clipboard': {
        args: [
            text: string
        ];
        return: void;
    };

    'Sound_request-sound-file-buf': {
        args: [
            hash: string,
            mcDirPath?: string
        ];
        return?: Buffer;
    };

    'Home_request-sounds': {
        args: [
            versionName: string,
            mcDirPath?: string
        ];
        return?: SoundData[];
    };
};

/**
 * IPC通信の引数定義\
 * Send, On用
 */
type IpcSOArgs = {
    'maximize': [
        isMaximize: boolean
    ];
};
