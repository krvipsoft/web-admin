const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin'); //
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const program = require('commander');
const colors = require('colors');


program
    .version('0.0.1')
    .option('--env <env>', 'package enviroment')
    .option('--path <path>', 'project path')

const ASSET_PATH = process.env.ASSET_PATH || '/';
console.log('-------------------配置信息------------------'.grey);
console.log('Web项目目录 \t: '.green + program.path);
console.log('__dirname \t: '.green + __dirname);
console.log('静态资源路径 \t: '.green + path.resolve('./'));
console.log('公共路径 \t: '.green + ASSET_PATH);
console.log('环境 \t: '.green + process.env.NODE_ENV);

module.exports = {
    devtool: 'source-map',
    mode: "development",
    entry: {
        app: [
            'webpack-hot-middleware/client?reload=true',// 添加热更新必须添加参数reload=true
            path.join(__dirname, './src/index.js')
        ]
    },
    output: {
        filename: 'js.[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
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
        new CleanWebpackPlugin(),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
        new FriendlyErrorsWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development')
            },
            '__DEVTOOLS__': true
        }),
        new ExtractTextPlugin({
            filename:'styles.css',
            allChunks:true,
        }),
        new HtmlWebpackPlugin({
            title: '管理输出',
            template: 'index.html'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                cache: true,
            }),
        ]
    },
    performance:{
        hints: false
    },
    // devServer: {
    //     headers: { 'Access-Control-Allow-Origin': '*' },
    //     contentBase: './dist',
    //     hot: true,
    //     colors: true,
    //     overlay: true
    // }
};