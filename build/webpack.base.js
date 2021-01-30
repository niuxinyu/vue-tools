const fs = require('fs');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
    source,
    project,
    dev: {
        alias,
        include,
        exclude,
    },
} = require('./config');

const getEntry = (path) => {
    const dirArr = fs.readdirSync(path);
    // 当添加了d.ts 之后 这里做一下排除
    const fileArr = dirArr
        .filter((item) => item.indexOf('.ts') >= 0 && item.indexOf('.d.ts') < 0)
        .map((item) => item.replace('.ts', ''));

    return fileArr;
};

const fileArr = getEntry(source);
const entries = {};

fileArr.forEach((file) => {
    entries[file] = `./src/${file}.ts`;
});

function getEntryBy () {
    if (process.env.NODE_ENV) {
        return {};
    }

    return {
        ...entries,
    };
}

module.exports = {
    context: project,
    // target: ['web', 'es5'],
    target: 'web',
    // entry: getEntryBy(),
    resolve: {
        alias,
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue'],
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js|\.ts|\.tsx)$/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            appendTsSuffixTo: [
                                /\.vue$/,
                            ],
                        },
                    },
                ],
                include,
                exclude,
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'imgs/[name].[hash:7].[ext]',
                },
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'media/[name].[hash:7].[ext]',
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]',
                },
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
    ],
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             vendor: {
    //                 priority: 1,
    //                 name: 'vendor',
    //                 test: /node_modules/,
    //                 chunks: 'initial',
    //                 minSize: 0,
    //                 minChunks: 1,
    //             },
    //             common: {
    //                 chunks: 'initial',
    //                 name: 'common',
    //                 minSize: 100,
    //                 minChunks: 3,
    //             },
    //         },
    //     },
    // },
};
