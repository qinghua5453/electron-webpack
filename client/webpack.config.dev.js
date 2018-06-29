'use strict'
// const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpackConfigBase = require('./webpack.config')
const CopyWebpackPlugin = require('copy-webpack-plugin')

let plugins = [
    new ExtractTextPlugin({
        filename: '[name].bundle.css',
        allChunks: true,
        disable: false
    }),
    new CopyWebpackPlugin([
        {
            from: path.resolve(__dirname, '../static'),
            to: 'static',
            ignore: ['.*']
        },
    ])
]

module.exports = merge(webpackConfigBase, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    target: 'electron-renderer',
    output: {
        path: path.join(__dirname, '/asset/build/'), // 指定编译目录，不能直接用于html中打包后文件的引用
        filename: 'bundle.js',
        publicPath: "/asset/build/" // 虚拟目录， 自动指向path的编译目录
    },
    plugins:plugins
})