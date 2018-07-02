// index.js
const { app, BrowserWindow, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater')
// const menuTemplate = require('./menu.js')
let mainWindow = null;
let childWindow = null;
app.on('ready', () => {
  createWindow()
  // createMenu()
});

autoUpdater.autoDownload = false; //关闭自动更新 通过用户点击事件 发起是否更新

let createWindow = () => {
    let mainOptions = {
      width: 1200,
      height: 800,
    }
    mainWindow = new BrowserWindow(mainOptions);
    console.log('process.env.NODE_ENV', process.env.NODE_ENV)
    if(process.env.NODE_ENV == 'development') {
      mainWindow.loadURL('http://localhost:3000')
    }else {
      mainWindow.loadURL(`file:///${__dirname}/client/index.html`); //本地开发主页面
    }
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

// function createMenu() {
//   const menu = Menu.buildFromTemplate(menuTemplate);
//   Menu.setApplicationMenu(menu);
// }

let updateHandle = () => {
  let message = {
      error: '检查更新出错',
      checking: '正在检查更新……',
      updateAva: '检测到新版本，正在下载……',
      updateNotAva: '现在使用的就是最新版本，不用更新',
    };

   ipcMain.on("checkForUpdate", function(){
      // 设置检查更新的 url，并且初始化自动更新。这个 url 一旦设置就无法更改
      autoUpdater.setFeedURL('http://electron.test.upcdn.net/');
      // 向服务端查询现在是否有可用的更新。在调用这个方法之前，必须要先调用 setFeedURL
      autoUpdater.checkForUpdates();
      
      // 当检查错误时触发
      autoUpdater.on('error', function (error) {
        sendUpdateMessage(message.error)
      });

      // 当开始检查更新的时候触发
      autoUpdater.on('checking-for-update', function () {
        sendUpdateMessage(message.checking)
      });

      // 当发现一个可用更新的时候触发，更新包下载会自动开始
      autoUpdater.on('update-available', function (info) {
        sendUpdateMessage(message.updateAva)
      });
      // 当没有可用更新的时候触发
      autoUpdater.on('update-not-available', function (info) {
        sendUpdateMessage(message.updateNotAva)
      });

      // 更新下载进度事件
      autoUpdater.on('download-progress', function (progressObj) {
        mainWindow.webContents.send('downloadProgress', progressObj)
      })
      // 在更新下载完成的时候触发
      autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
        ipcMain.on('isUpdateNow', function (e, arg){
          // 在下载完成后，重启当前的应用并且安装更新。这个方法应该仅在 update-downloaded 事件触发后被调用
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