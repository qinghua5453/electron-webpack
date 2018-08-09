let config = {
    // 入口文件 顺序不能乱 不然打包出错
    entries: [
        './src/main.js',
        './src/webview_index.js'
    ],
    //将打包结果输出到目标路径, 为空时，打包后文件输出到 assets 目录
    outputDir: './asset/build/' //支持一个输出路径
}

module.exports = config



