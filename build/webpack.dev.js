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
    // vendors: ['vue', 'vue-router'],
  },
  // devtool: 'cheap-source-map',
  devtool: 'source-map',
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
  // externals: [
  //     {
  //         // jquery: 'jQuery',
  //         // axios: 'axios',
  //         axios: {
  //             // commonjs2: 'axios',
  //             // commonjs: 'axios',
  //             // amd: 'axios',
  //             root: 'axios',
  //         },
  //         // jquery: {
  //         //     commonjs: 'jquery',
  //         //     commonjs2: 'jquery',
  //         //     amd: 'jquery',
  //         //     root: 'jQuery',
  //         // },
  //         // vue: {
  //         //     commonjs: 'vue',
  //         //     commonjs2: 'vue',
  //         //     amd: 'vue',
  //         //     root: 'Vue',
  //         // },
  //     },
  // ],
  // todo 缓存组优化
  // 已提高构建速度
  optimization: {
    splitChunks: {
      chunks: 'all',
      // cacheGroups: {
      //     vendor: {
      //         priority: 1,
      //         name: 'vendor',
      //         test: /node_modules/,
      //         chunks: 'initial',
      //         minSize: 0,
      //         minChunks: 1,
      //     },
      //     common: {
      //         chunks: 'initial',
      //         name: 'common',
      //         minSize: 100,
      //         minChunks: 3,
      //     },
      // },
    },
  },
});
