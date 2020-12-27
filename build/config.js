const path = require('path');
const project = process.cwd();
const { resolve } = require('./utils');

const config = {
    project,
    config: path.resolve(__dirname, '../'),
    dev: {
        alias: {
            vue$: 'vue/dist/vue.runtime.js',
            '@': resolve('src'),
        },
        include: [
            resolve('src'),
            resolve('__test__'),
            resolve('assets'),
            resolve('static'),
        ],
        exclude: resolve('node_modules'),
    },
    pro: {
        exclude: [
            resolve('node_modules'),
        ],
    },
    copyright: `niu ${new Date().toLocaleDateString()}`,
    source: resolve('src'),
    build: resolve('dist'),
};

module.exports = config;
