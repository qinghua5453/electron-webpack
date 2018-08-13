// index.js
const { app, BrowserWindow, ipcMain, session, Tray, Menu } = require('electron')
const path = require('path')
const { autoUpdater } = require('electron-updater')
const { host } = require('./client/src/config/host.js')
let mainWindow = null;
let childWindow = null;
let mainLoadingWindow = null;
let webviewLoadingWindow = null;
let tray = null
let isProduction = (process.env.NODE_ENV == 'development') ? false : true
app.on('ready', () => {
  createWindow()
});

app.on('window-all-closed', () => {

})

autoUpdater.autoDownload = false; //关闭自动更新 通过用户点击事件 发起是否更新

let createWindow = () => {
    // 一些同步函数
    updateHandle()
    judgeLoginState()
    saveCsrftoken()
    newTray()

    // main-window
    ipcMain.on('open-main-window', function() {
      createMainWindow()
    })
    ipcMain.on('close-main-window', function() {
      mainWindow.close()
      mainWindow = null
    })
    ipcMain.on('hide-main-window', function() {
      mainWindow.hide()
    })

    // webview-window
    ipcMain.on('open-webview-window', () => {
      createWebviewWindow()
    })
    ipcMain.on('close-webview-window', function() {
      childWindow.close()
      childWindow = null
    })
    ipcMain.on('hide-webview-window', function() {
      childWindow.hide()
    })
    ipcMain.on('min-webview-window', function() {
      childWindow.minimize()
    })
    ipcMain.on('max-webview-window', function() {
      childWindow.maximize()
    })

    // 公共状态交互
    ipcMain.on('save-login-state', (event, state) => {
      global.loginState = state
    })
    ipcMain.on('save-csrftoken', () => {
      saveCsrftoken()
    })
}

let createMainWindow = () => {
  let mainOptions = {
    width: 563,
    height: 549,
    frame: false, // 隐藏窗口导航
    resizable: !isProduction ? true : false, //是否拖动改变窗口size
    show: false,
    webPreferences: {webSecurity: false}
  }
  // 深拷贝
  let loadingOptions = Object.assign({}, mainOptions)
  mainWindow = new BrowserWindow(mainOptions);
  mainLoadingWindow = new BrowserWindow(loadingOptions)

  mainLoadingWindow.loadURL(`file:///${__dirname}/client/index_loading.html`);
  if(!isProduction) {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  }else {
    mainWindow.loadURL(`file:///${__dirname}/client/index.html`); //本地开发主页面
  }
  mainLoadingWindow.webContents.on('did-finish-load', () => {
    mainLoadingWindow.show()
  })
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show()
    if(mainLoadingWindow) {
      mainLoadingWindow.close()
    }
  })
  mainLoadingWindow.on('closed', () => {
    mainLoadingWindow = null
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

let newTray = () => {
  let filePath
  if(process.platform === 'darwin') {
    filePath = path.join(__dirname, '/static/images/icon.png')
  }else {
    filePath = path.join(__dirname, '/static/images/icon.ico')
  }
  let trayMenuTemplate = [{
    label: '退出',
    click: () => { app.quit() }
  }]
  tray = new Tray(filePath)
  let contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
  tray.setContextMenu(contextMenu);
  tray.on('click', ()=>{
    if(mainWindow) mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    if(childWindow) childWindow.isVisible() ? childWindow.hide() : childWindow.show()
  })
}

let createWebviewWindow = () => {
  let childOptions = {
    width: 1200,
    height: 800,
    frame: false, // 隐藏窗口导航
    show: false
  }
  // 深拷贝
  let loadingOptions = Object.assign({}, childOptions)
  if(childWindow != null) {
    childWindow.setAlwaysOnTop(true)
    return  // 避免重复打开多个webview页
  }
  webviewLoadingWindow = new BrowserWindow(loadingOptions)
  childWindow = new BrowserWindow(childOptions)

  webviewLoadingWindow.loadURL(`file:///${__dirname}/client/index_loading.html`)
  childWindow.loadURL(`file:///${__dirname}/client/index_webview.html`) // 二级webview页面
  if(!isProduction) { 
    childWindow.webContents.openDevTools()
  }

  webviewLoadingWindow.webContents.on('did-finish-load', () => {
    webviewLoadingWindow.show()
  })
  childWindow.webContents.on('did-finish-load', () => {
    childWindow.show()
    if(webviewLoadingWindow) {
      webviewLoadingWindow.close()
    }
  })
  webviewLoadingWindow.on('closed', () => {
    webviewLoadingWindow = null
  })
  childWindow.on('closed', () => {
    childWindow = null
  })
}

let judgeLoginState = () => {
  if(!global.loginState || global.loginState == 'login') {
    createMainWindow()
  }
  if(global.loginState && global.loginState != 'login') {
    createWebviewWindow()
  }
}

let saveCsrftoken = () => {
  session.defaultSession.cookies.get({url: host()}, (error, cookies) => {
    if(error) return
    for(let i = 0; i < cookies.length; i++) {
      if(cookies[i].name === 'csrftoken') {
        global.csrftoken = cookies[i].value
        break
      }
    }
  })
}

let updateHandle = () => {
  let message = {
      error: '检查更新出错',
      checking: '正在检查更新……',
      // updateAva: '检测到新版本，正在下载……',
      updateAva: '检测到新版本,必须更新后才能使用',
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
        // 此函数无论什么事实都触发，不管是低版本、高版本
        sendUpdateMessage(message.checking)
      });
      // 当发现一个可用更新的时候触发，更新包下载会自动开始
      autoUpdater.on('update-available', function (info) {
        // 此时触发弹窗 告知用户必须更新后才能使用
        mainWindow.webContents.send('autoDownload', message.updateAva)
        sendUpdateMessage(message.updateAva)
      });
      // 当没有可用更新的时候触发
      autoUpdater.on('update-not-available', function (info) {
        sendUpdateMessage(message.updateNotAva)
      });
     
      // 用户点击弹窗的确定 方可下载 此时触发autoDownload参数为true
      ipcMain.on('rightUpdate', function() {
        autoUpdater.downloadUpdate()
      })

      // 更新下载进度事件
      autoUpdater.on('download-progress', function (progressObj) {
        mainWindow.webContents.send('downloadProgress', progressObj)
      })
      // 在更新下载完成的时候触发
      autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
        autoUpdater.quitAndInstall();
        // ipcMain.on('isUpdateNow', function (e, arg){
        //   // 在下载完成后，重启当前的应用并且安装更新。这个方法应该仅在 update-downloaded 事件触发后被调用
        //   autoUpdater.quitAndInstall();
        // });
        // mainWindow.webContents.send('isUpdateNow')
      });
  })
}

// 通过main进程发送事件给renderer进程，提示更新信息
let sendUpdateMessage = (text) => {
  mainWindow.webContents.send('message', text)
}