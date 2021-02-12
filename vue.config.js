module.exports = {
    pluginOptions: {
        quasar: {
            importStrategy: 'kebab',
            rtlSupport: false
        },
        electronBuilder: {
            nodeIntegration: true,
            mainProcessFile: 'src/main/background.ts',
            builderOptions: {
                appId: 'com.mt224244.mc-playsound',
                productName: 'MC Playsound',
                win: {
                    icon: 'public/icon.ico',
                    target: [
                        'zip',
                        'nsis'
                    ]
                }
            }
        }
    },
    pages: {
        index: 'src/renderer/main.ts'
    },
    transpileDependencies: [
        'quasar'
    ]
};
