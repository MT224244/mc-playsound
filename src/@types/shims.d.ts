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
