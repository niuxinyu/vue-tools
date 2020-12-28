// 此文件让webstorm可以解析alias
const path = require('path');

function resolve (dir) {
    return path.join(__dirname, '../', dir);
}

module.exports = {
    context: path.resolve(__dirname, './'),
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue'],
        alias: {
            '@': resolve('src'),
        },
    },
};
