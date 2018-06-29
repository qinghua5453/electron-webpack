'use strict'
const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpackManifestPlugin = require('webpack-manifest-plugin')
const { VueLoaderPlugin } = require('vue-loader')
let isProduction = process.env.NODE_ENV == 'production' ? true : false
console.log('process.env.NODE_ENV', process.env.NODE_ENV)

let getPlugin = () => {
  let plugins = [new VueLoaderPlugin()]
  plugins.push(new MiniCssExtractPlugin({
      filename: isProduction ? '[name].[hash:7].css' : '[name].css',
      chunkFilename: isProduction ? '[id].[hash:7].css' : '[id].css',
    }))
  if(isProduction) {
    plugins.push(new CleanWebpackPlugin(['./asset/build/']))
    plugins.push(new webpackManifestPlugin({
      fileName: 'manifest.json',
      publicPath: './asset/build/'
    }))
  }
  return plugins
}

module.exports = {
    mode: 'none',
    target: 'electron-renderer',
    entry:{
        app:'./src/main.js',
    },
    output: {
      path: path.join(__dirname, '/asset/build/'), // 输出路径 生产环境可以看见
      filename: isProduction ? '[name].[hash:7].bundle.js' : '[name].bundle.js',
      publicPath: '/asset/build/' // 虚拟目录
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
              isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
              'css-loader',
            ]
          },
          {
            test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
            loader: 'url-loader?limit=10000'
          }
        ]
    },
    plugins: getPlugin()
  }