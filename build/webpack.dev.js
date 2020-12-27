const { merge } = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const webpackConfigBase = require('./webpack.base');

module.exports = merge(webpackConfigBase, {
    mode: 'development',
    // devtool: "eval-cheap-module-source-map",
    devtool: 'cheap-source-map',
    devServer: {
        hot: true,
        port: 3001,
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
        new webpack.HotModuleReplacementPlugin(),
    ],
});
