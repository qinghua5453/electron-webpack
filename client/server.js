const webpack = require('webpack')
const path = require('path')
const WebpackDevServer = require('webpack-dev-server')
const configDev = require("./webpack.config.dev.js")
const compiler = webpack(configDev)
const server = new WebpackDevServer(compiler,{
    contentBase: path.resolve(__dirname),
    historyApiFallback: true,//不跳转
    hot: true,
    inline: true,//实时刷新
    publicPath: "/"
})

server.listen(3000,function(err){
	if(err) {
        console.log('err', err)
        return
    }
	console.log('server is runing port 3000')
})