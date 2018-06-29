// index.js
const { app, BrowserWindow, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater')
let mainWindow = null;
let childWindow = null;
app.on('ready', () => {
  createWindow()
});

autoUpdater.autoDownload = true; 

let createWindow = () => {
    let mainOptions = {
      width: 1200,
      height: 800,
    }
    mainWindow = new BrowserWindow(mainOptions);

    mainWindow.loadURL(`file:///${__dirname}/client/index.html`); //本地开发主页面
    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    let childOptions = {
      width: 1200,
      height: 800,
      center: false, // 窗口屏幕居中
      x: 400,  // 窗口相对于屏幕的左偏移位置
      y: 400,  // 窗口相对于屏幕的顶部偏移位置
    }

    ipcMain.on('go-to-webview', () => {
      childWindow = new BrowserWindow(childOptions)
      childWindow.loadURL(`file:///${__dirname}/client/index_webview.html`) // 二级webview页面
      childWindow.webContents.openDevTools()
      childWindow.on('closed', () => {
        childWindow = null
      })
    })

    updateHandle()
}

let updateHandle = () => {
  let message = {
      error: '检查更新出错',
      checking: '正在检查更新……',
      updateAva: '检测到新版本，正在下载……',
      updateNotAva: '现在使用的就是最新版本，不用更新',
    };

   ipcMain.on("checkForUpdate", function(){
      //执行自动更新检查
      autoUpdater.setFeedURL('http://electron.test.upcdn.net/');
      autoUpdater.checkForUpdates();
      
      autoUpdater.on('error', function (error) {
        sendUpdateMessage(message.error)
      });


      autoUpdater.on('checking-for-update', function () {
        sendUpdateMessage(message.checking)
      });

      autoUpdater.on('update-available', function (info) {
        sendUpdateMessage(message.updateAva)
      });
      

      autoUpdater.on('update-not-available', function (info) {
        sendUpdateMessage(message.updateNotAva)
      });

      // 更新下载进度事件
      autoUpdater.on('download-progress', function (progressObj) {
        mainWindow.webContents.send('downloadProgress', progressObj)
      })

      autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
        ipcMain.on('isUpdateNow', function (e, arg){
          //some code here to handle event
          // 退出并安装
          autoUpdater.quitAndInstall();
        });
        mainWindow.webContents.send('isUpdateNow')
      });
  })
}

// 通过main进程发送事件给renderer进程，提示更新信息
let sendUpdateMessage = (text) => {
  mainWindow.webContents.send('message', text)
}