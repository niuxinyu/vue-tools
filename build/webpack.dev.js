const { merge } = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackConfigBase = require('./webpack.base');

module.exports = merge(webpackConfigBase, {
    mode: 'development',
    // devtool: "eval-cheap-module-source-map",
    entry: {
        main: './examples/main.ts',
        vendors: ['vue', 'vue-router'],
    },
    devtool: 'cheap-source-map',
    devServer: {
        hot: true,
        port: 8888,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /.(le|c)ss$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, '/dist'),
        filename: '[name].[hash:8].js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './examples/index.html',
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
});
