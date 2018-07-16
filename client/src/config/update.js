"use strict"
const  { ipcRenderer } = require('electron')
class Update {
    constructor () {
       this.percent = '0%'
       this.message = ''
       // 触发自动检测更新
       ipcRenderer.send('checkForUpdate')
       this.autoDownload()
    }
    showModal () {
        layui.use('layer', function() {
            let layer = layui.layer
            layer.open({
                title: '更新进度提示',
                content: '<div class="layui-progress-bar-wrap">'
                                + '<div class="layui-progress layui-progress-big" lay-showpercent="true" lay-filter="demo">'
                                    + '<div class="layui-progress-bar layui-bg-red" lay-percent="0%"></div>'
                                + '</div>'
                            + '</div>',
                btn: ['关闭'],
                btnAlign: 'c',
                shadeClose: true,
                yes: function(index) {
                    layer.close(index)
                }
            })
        })
    }
    autoDownload () {
        let self = this
        ipcRenderer.on('message', function(event, message) {
            self.message = message
            console.log('vue', message);
        });
        
        layui.use(['layer', 'element'], function() {
           let $ = layui.jquery
           let layer = layui.layer
           let element = layui.element

           ipcRenderer.on('autoDownload', function(event, message) {
               //  显示更新的弹窗
               self.message = message
               layer.confirm(self.message, {
                   btn: ['立即更新'] //按钮
                   }, function(index){
                       layer.close(index)
                       ipcRenderer.send('rightUpdate')
                       self.showModal()
                       self.downloadProgress(element)
                   }
               );
           })
        })
    }
    downloadProgress (element) {
        let self = this
        ipcRenderer.on('downloadProgress', function(event, downloadProgress) {
            self.percent = Math.ceil(downloadProgress.percent) + '%'
            element.progress('demo', self.percent)
        });
    }
}

module.exports = Update