// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { ipcRenderer } = require('electron')
// 触发自动检测更新
ipcRenderer.send('checkForUpdate')
// 用户主动触发是否需要安装下载后的新版本
// ipcRenderer.send('isUpdateNow')

// ipcRenderer.on('message', function(event, message) {
// console.log('sd', message);
// });
// ipcRenderer.on('downloadProgress', function(event, downloadProgress) {
// console.log('sd----', downloadProgress);
// });

// ipcRenderer.on('isUpdateNow', function() {
// 	ipcRenderer.send('isUpdateNow')
// })
