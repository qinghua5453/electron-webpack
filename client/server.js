require('./modify.html.bundles')
const webpack = require('webpack')
const path = require('path')
const WebpackDevServer = require('webpack-dev-server')
const config = require("./webpack.config.js")
const compiler = webpack(config)
const server = new WebpackDevServer(compiler,{
    hot: true,
	historyApiFallback: true,
    disableHostCheck: true,
    inline: true,
    publicPath: "/asset/build/" // 对应webpack output publicPath
})

server.listen(3000,function(err){
	if(err) {
        console.log('err', err)
        return
    }
	console.log('server is runing port 3000')
})