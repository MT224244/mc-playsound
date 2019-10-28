const path = require('path');

module.exports = {
    target: 'electron-renderer',
    mode: 'production',
    entry: { 'main': './src/renderer/ts/main.ts' },
    output: { filename: '[name].js' },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader"
            }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
        modules: [path.resolve(__dirname, "src/renderer/ts"), "node_modules"]
    }
}