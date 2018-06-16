'use strict'
const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
// const webpackManifestPlugin = require('webpack-manifest-plugin')

let plugins = [
    new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "[name].css",
        chunkFilename: "[id].css"
    }),
]

module.exports = {
    entry:{
        app:'./main.js',
    },
    module: {
        rules :[
          {
            test: /\.js$/,
            loader : 'babel-loader',
            exclude: /node_modules/
          },
          {
           test: /\.vue$/,
           loader : 'vue-loader'
          },
        //   {
        //     test: /\.css$/,
        //     use: ExtractTextPlugin.extract({
        //       fallback: "style-loader",
        //       use: "css-loader"
        //     })
        //   },
          {
            test: /\.css$/,
            use: [
              MiniCssExtractPlugin.loader,
              "css-loader"
            ]
          },
          {
            test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
            loader: 'url-loader?limit=10000'
          }
        ]
    },
    plugins:plugins
  }