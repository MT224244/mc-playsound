module.exports = {
    target: 'electron-renderer',
    mode: 'production',
    entry: { 'main': './src/renderer/js/main.js' },
    output: { filename: '[name].js' },
    externals: ['spawn-sync', 'utf-8-validate', 'bufferutil']
}