// index.js
const { app, BrowserWindow, ipcMain, session } = require('electron')
const { autoUpdater } = require('electron-updater')
const { host } = require('./client/src/config/host.js')
let mainWindow = null;
let childWindow = null;
app.on('ready', () => {
  createWindow()
});

app.on('window-all-closed', () => {
  global.loginState = null
  console.log('-------closed-------', global.loginState)
})

autoUpdater.autoDownload = false; //关闭自动更新 通过用户点击事件 发起是否更新

let createWindow = () => {
    let mainOptions = {
      width: 563,
      height: 549,
      frame: false, // 隐藏窗口导航
      resizable: true,
      show: false,
      webPreferences: {webSecurity: false}
    }
    mainWindow = new BrowserWindow(mainOptions);
    if(process.env.NODE_ENV == 'development') {
      mainWindow.loadURL('http://localhost:3000')
    }else {
      mainWindow.loadURL(`file:///${__dirname}/client/index.html`); //本地开发主页面
    }
    getCooike()

    mainWindow.webContents.openDevTools()

    ipcMain.on('close-main-window', function() {
      mainWindow.close()
      mainWindow = null
    })
    ipcMain.on('min-main-window', function() {
      mainWindow.minimize()
    })
    ipcMain.on('max-main-window', function() {
      mainWindow.maximize()
    })

    ipcMain.on('show-main-window', function() {
      mainWindow.show()
    })
    ipcMain.on('hide-main-window', function() {
      mainWindow.hide()
    })

    createWebviewWindow()
    
    ipcMain.on('go-to-webview', () => {
      createWebviewWindow()
    })

    ipcMain.on('close-webview-window', function() {
      childWindow.close()
      childWindow = null
    })
    ipcMain.on('min-webview-window', function() {
      childWindow.minimize()
    })
    ipcMain.on('max-webview-window', function() {
      childWindow.maximize()
    })

    ipcMain.on('hide-webview-window', function() {
      childWindow.hide()
    })
    ipcMain.on('show-webview-window', function () {
      childWindow.show()
    })

    updateHandle()
    judgeLoginState()
}

ipcMain.on('save-login-state', (event, state) => {
    global.loginState = state
    console.log('global.loginState', global.loginState)
    if(global.loginState == 'login' && !mainWindow.isVisible()) {
      mainWindow.show()
    }else {
      mainWindow.hide()
      childWindow.show()
    }
})

function createWebviewWindow() {
  let childOptions = {
    width: 1200,
    height: 800,
    center: false, // 窗口屏幕居中
    x: 200,  // 窗口相对于屏幕的左偏移位置
    y: 200,  // 窗口相对于屏幕的顶部偏移位置
    frame: false,
    show: false
  }
  if(childWindow != null) {
    childWindow.setAlwaysOnTop(true)
    return  // 避免重复打开多个webview页
  }
  childWindow = new BrowserWindow(childOptions)
  childWindow.loadURL(`file:///${__dirname}/client/index_webview.html`) // 二级webview页面
  childWindow.webContents.openDevTools()
}

function judgeLoginState () {
  if(!global.loginState || global.loginState == 'login') {
    mainWindow.show()
  }
  if(global.loginState && global.loginState != 'login') {
    childWindow.show()
  }
}

let getCooike = () => {
  session.defaultSession.cookies.get({url: host()}, (error, cookies) => {
    if(error) return
    console.log('cookies', cookies)
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