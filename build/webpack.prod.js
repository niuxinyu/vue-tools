const { merge } = require('webpack-merge');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const webpackConfigBase = require('./webpack.base');
const { pro } = require('./config');

function getRules () {
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
    ];
}
// eslint-disable-next-line
const ignoreBundle = {
    vue: {
        commonjs: 'vue',
        commonjs2: 'vue',
        amd: 'vue',
        root: 'vue',
    },
};

module.exports = merge(webpackConfigBase, {
    mode: 'production',
    output: {
        filename: 'js/[name].[hash:5].js',
        path: path.resolve(__dirname, '../dist'),
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
    // externals: ignoreBundle
});
