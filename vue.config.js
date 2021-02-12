module.exports = {
    pluginOptions: {
        quasar: {
            importStrategy: 'kebab',
            rtlSupport: false
        },
        electronBuilder: {
            nodeIntegration: true,
            mainProcessFile: 'src/main/background.ts'
        }
    },
    pages: {
        index: 'src/renderer/main.ts'
    },
    transpileDependencies: [
        'quasar'
    ]
};
