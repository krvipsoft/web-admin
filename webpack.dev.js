const merge = require('webpack-merge');
const webpack = require('webpack');
const program = require('commander');
const path = require('path');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

// 包大小分析插件
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
require('colors');

program
    .version('0.0.1')
    .option('--env <env>', 'package enviroment')
    .option('--path <path>', 'project path')
    .option('--project <project>', 'project')
    .option('--colors')
    .option('--config')
    .parse(process.argv)

console.log('-------------------配置信息------------------'.grey);

console.log('Web项目目录 \t: '.green + path.resolve('./'))
console.log('编译环境 \t: '.green + program.env);
console.log('项目名称 \t: '.green + program.project);

console.log('Start Building...'.yellow)

module.exports = merge(common, {
    devtool: 'inline-source-map',
    mode: "development",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.css$/,
                // exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    use:'css-loader',
                    fallback:'style-loader'
                })
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use:ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }],
                    fallback: "style-loader"
                }),
            },
            {
                test: /\.(bmp|gif|jpeg|jpg|png)$/,
                exclude: /node_modules/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'img/[name]_[hash:8].[ext]',
                },
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename:'styles.css',
            allChunks:true,
            disable: process.env.NODE_ENV === "development"
        }),
        new HtmlWebpackPlugin({
            title: 'WebAdmin',
            filename: 'index.html',
            template: 'index.html',
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        //new BundleAnalyzerPlugin()
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                cache: true,
            }),
        ]
    },
    devServer: {
        headers: { 'Access-Control-Allow-Origin': '*' },
        contentBase: path.resolve(__dirname, 'dist'),
        hot: true,
        open: true,
        port: 9000,
        openPage: '#/home',
        overlay: true,
        stats: 'errors-only',
        proxy: {
            "/api": {
                target: "http://192.168.33.30:84",
                pathRewrite: {"^/api" : ""}
            }
        }
    }
});