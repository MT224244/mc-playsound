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
