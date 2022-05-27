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
        MW5: './src/Windows/MW5.ts',
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            // https://blog.logrocket.com/how-to-configure-css-modules-webpack/
            // CSS loader example with string interpolation in HTML
            /*
            {
                test: /\\.css$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: true,
                        },
                    },
                ],
            },
            */
            /*
            {
                test: /\.css$/i,
                loader: "css-loader",
                options: {
                    modules: true,
                },
            },*/
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
        // See docs: https://github.com/webpack-contrib/copy-webpack-plugin
        new CopyPlugin({
            patterns: [
                // Copy public files to our dist folder
                { from: "public", to: "./" },
                // Copy Material Design Components CSS to our dist folder
                //{
                //    from: 'node_modules/@material/**/*.css', to({ context, absoluteFilename }) {
                //        return "./css/[name].[ext]";
                //    },
                //},
                // Copy Material Design Components CSS to our dist folder
                {
                    from: 'node_modules/material-components-web/**/*.css', to({ context, absoluteFilename }) {
                        return "./css/[name].[ext]";
                    },
                },

            ],
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
        new HtmlWebpackPlugin({
            template: './src/Windows/MW5.html',
            filename: path.resolve(__dirname, './dist/MW5.html'),
            chunks: ['MW5']
        }),
        new OverwolfPlugin(env)
    ]
})
