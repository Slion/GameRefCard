const
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CopyPlugin = require("copy-webpack-plugin"),
    { CleanWebpackPlugin } = require('clean-webpack-plugin'),
    OverwolfPlugin = require('./overwolf.webpack');

module.exports = env => ({
    entry: {
        Application: './src/Windows/Application.ts',
        JoyMap: './src/Windows/JoyMap.ts',
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
      path: path.resolve(__dirname, 'dist/'),
      filename: 'js/[name].js'
    },
    plugins: [
        new CleanWebpackPlugin,
        new CopyPlugin({
            patterns: [ { from: "public", to: "./" } ],
        }),
        new HtmlWebpackPlugin({
            template: './src/Windows/Application.html',
            filename: path.resolve(__dirname, './dist/Application.html'),
            chunks: ['Application']
        }),
        new HtmlWebpackPlugin({
            template: './src/Windows/JoyMap.html',
            filename: path.resolve(__dirname, './dist/JoyMap.html'),
            chunks: ['JoyMap']
        }),
        new OverwolfPlugin(env)
    ]
})
