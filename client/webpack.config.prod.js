'use strict'
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const webpackConfigBase = require('./webpack.config.base')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')

let plugins = [
    new CleanWebpackPlugin(['./index_prod.html']),
    new htmlWebpackPlugin({
        filename: '../../index_prod.html',
        template: './index_template.html',
        inject: false
    })
]

module.exports = merge(webpackConfigBase, {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    target: 'electron-renderer',
    output: {
        path: path.join(__dirname, '/asset/build/'),
        filename: '[name].[hash:7].js'
    },
    plugins: plugins
})