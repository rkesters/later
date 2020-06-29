import * as webpack from 'webpack';
import * as path from 'path';
import minifiPlugin from 'terser-webpack-plugin';

const config: webpack.Configuration = {
    entry: './src/index.ts',
    devtool: process.env.WEBPACK_MODE === 'production' ? 'source-map' : 'cheap-module-source-map',
    mode: (process.env.WEBPACK_MODE as any) || 'development',

    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        usedExports: true,
        minimizer: [
            new minifiPlugin({
                parallel: true,
                sourceMap: true,
                terserOptions: {
                    ecma: 6,
                    sourceMap: { content: 'inline' },
                },
            }),
        ],
        minimize: process.env.WEBPACK_MODE === 'production',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        //library: 'later',
        libraryTarget: 'umd',
    },
    plugins: [],
    externals: ['lodash', 'luxon', 'moment'],
};

export default config;
