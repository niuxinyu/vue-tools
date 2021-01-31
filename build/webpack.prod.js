const { merge } = require('webpack-merge');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const webpackConfigBase = require('./webpack.base');
const {
    pro,
    copyright,
} = require('./config');

function getRules () {
    if (process.env.CSSIN) {
        return [
            {
                test: /.(le|c)ss$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
            },
        ];
    }
    return [
        {
            test: /\.(le|c)ss$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        // 解决图片路径不对的问题
                        publicPath: '../',
                    },
                },
                'css-loader',
                'postcss-loader',
                'less-loader',
            ],
        },
    ];
}

function getPlugins () {
    return [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
        }),
        new OptimizeCSSAssetsPlugin(),
        new webpack.BannerPlugin(copyright),
    ];
}

// eslint-disable-next-line
const ignoreBundle = {
    vue: {
        commonjs: 'vue',
        commonjs2: 'vue',
        amd: 'vue',
        root: 'Vue',
    },
    // 'vue-class-component': {
    //     commonjs: 'vue-class-component',
    //     commonjs2: 'vue-class-component',
    //     amd: 'vue-class-component',
    //     root: 'vue-class-component',
    // },
}; // 忽略打包文件

module.exports = merge(webpackConfigBase, {
    mode: 'production',
    devtool: 'source-map',
    entry: './src/index.ts',
    output: {
        // todo
        // 图片打包后的路径存在问题
        // publicPath: './',
        path: path.resolve(__dirname, '../dist'),
        filename: 'vue-tools.min.js',
        library: 'VueTools',
        libraryTarget: 'umd',
        libraryExport: 'default',
    },
    optimization: {
        minimizer: [
            new TerserWebpackPlugin({
                exclude: pro.exclude,
                parallel: true,
                extractComments: false,
            }),
        ],
    },
    module: {
        rules: getRules(),
    },
    plugins: getPlugins(),
    externals: ignoreBundle,
});
