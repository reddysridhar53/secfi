const path = require('path');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { merge } = require('webpack-merge');

const PACKAGE_ROOT_PATH = process.cwd(),
    ENTRY = path.resolve(PACKAGE_ROOT_PATH, './src/index');

module.exports = merge(common, {
    mode: 'production',
    entry: [ENTRY],
    optimization: {
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        return `vendor~${packageName.replace('@', '')}`;
                    }
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.(s(a|c)ss)$/,
                use: [MiniCssExtractPlugin.loader,'css-loader', 'sass-loader']
            },
        ]
    }
});
