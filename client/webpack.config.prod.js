'use strict'
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpackManifestPlugin = require('webpack-manifest-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpackConfigBase = require('./webpack.config')
// const htmlWebpackPlugin = require('html-webpack-plugin')

let plugins = [
    new CleanWebpackPlugin(['./asset/build/']),
    // new ExtractTextPlugin({
    //     filename: '[name].[hash:7].bundle.css',
    //     disable: false,
    //     allChunks: true
    // }),
    new webpackManifestPlugin({
        fileName: 'manifest.json',
        publicPath: './asset/build/'
    }),
    // new htmlWebpackPlugin({
    //     filename: '../../index_prod.html',
    //     template: './index_template.html',
    //     inject: false
    // })
]

module.exports = merge(webpackConfigBase, {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    // target: 'electron-renderer',
    output: {
        path: path.join(__dirname, '/asset/build/'),
        filename: '[name].[hash:7].bundle.js',
        publicPath: '/asset/build/'
    },
    plugins: plugins
})