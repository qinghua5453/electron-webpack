// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { ipcRenderer } = require('electron')
ipcRenderer.send('checkForUpdate')
ipcRenderer.send('isUpdateNow')

ipcRenderer.on('message', function(event, message) {
console.log('sd', message);
});

ipcRenderer.on('downloadProgress', function(event, downloadProgress) {
console.log('sd----', downloadProgress);
});

ipcRenderer.on('isUpdateNow', function() {
	ipcRenderer.send('isUpdateNow')
})
