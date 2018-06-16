'use strict'
// const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const webpackConfigBase = require('./webpack.config.base')
const CopyWebpackPlugin = require('copy-webpack-plugin')

let plugins = [
    new CopyWebpackPlugin([
        {
            from: path.resolve(__dirname, '../static'),
            to: 'static',
            ignore: ['.*']
        }
    ])
]

module.exports = merge(webpackConfigBase, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    target: 'electron-renderer',
    output: {
        path: path.join(__dirname, '/asset/build/'),
        filename: 'bundle.js',
        publicPath: "/"
    },
    // devServer: {
    //     historyApiFallback: true,
    //     noInfo: true
    // },
    plugins:plugins
})