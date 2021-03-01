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
                mac: {
                    icon: 'public/icon-mac.png',
                    target: {
                        target: 'default',
                        arch: [
                            'x64',
                            'arm64'
                        ]
                    }
                },
                win: {
                    icon: 'public/icon.ico',
                    target: [
                        'zip',
                        'nsis'
                    ]
                },
                nsis: {
                    oneClick: false
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
