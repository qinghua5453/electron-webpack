const electron = require('electron')
const updater = require("electron-updater");
const autoUpdater = updater.autoUpdater;
const menuTempalte = require('./menu.js')
const Menu = electron.Menu
// autoUpdater.logger = require('electron-log')

// autoUpdater.logger.debug('debug')
// autoUpdater.logger.debug('info')
// autoUpdater.logger.debug('error')
// autoUpdater.logger.debug('warn')


// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain

const path = require('path')
const url = require('url')

autoUpdater.autoDownload = true; //默认true，禁止自动更新
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createMenu() {
  const menu = Menu.buildFromTemplate(menuTempalte);
  Menu.setApplicationMenu(menu)
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + '/static/images/icon.ico',
    backgroundColor: '#fff',
    // resizable: false, // 禁止拖动窗口
    // frame: false,  //隐藏顶部原生菜单
    webPreferences:{ webSecurity: false }
  })

  // and load the index.html of the app.
  // mainWindow.loadURL(url.format({
  //   pathname: path.join(__dirname, '/client/index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }))
  console.log('process.env.NODE_ENV', process.env.NODE_ENV)
  if (process.env.NODE_ENV === 'development') {
      console.log('develop');
      mainWindow.loadURL('http://localhost:3000');
      // mainWindow.webContents.openDevTools();
  } else {
      console.log('production')
      mainWindow.loadURL(`file://${__dirname}/client/index_prod.html`); 
  }
  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // 尝试更新
  updateHandle()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
  // Menu.setApplicationMenu(null) //隐藏默认菜单
  // createMenu()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle() {
  let message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新',
  };
  const os = require('os');
  ipcMain.on("checkForUpdate", function(){
      //执行自动更新检查
      console.log('<<<<<<<<<<<<<<<<<<<<<<')
      autoUpdater.setFeedURL('http://electron.test.upcdn.net/');
      
      
      autoUpdater.on('error', function (error) {
        console.log('error-------------------')
        sendUpdateMessage(message.error)
      });


      autoUpdater.on('checking-for-update', function () {
        console.log('checking-for-update,-------')
        sendUpdateMessage(message.checking)
      });

      autoUpdater.on('update-available', function (info) {
        console.log('update-available,-------')
        sendUpdateMessage(message.updateAva)
      });
      

      autoUpdater.on('update-not-available', function (info) {
        sendUpdateMessage(message.updateNotAva)
      });

      // 更新下载进度事件
      autoUpdater.on('download-progress', function (progressObj) {
        console.log('更新下载进度事件')
        mainWindow.webContents.send('downloadProgress', progressObj)
      })

      autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
        console.log('event', event)
        console.log('releaseNotes', releaseNotes)
        console.log('releaseName', releaseName)
        console.log('releaseDate', releaseDate)
        console.log('updateUrl', updateUrl)
        console.log('quitAndUpdate', quitAndUpdate)
        // console.log("开始更新");
        // //some code here to handle event
        // autoUpdater.quitAndInstall();

        ipcMain.on('isUpdateNow', function (e, arg){

          console.log(arguments);
          console.log("开始更新");
          //some code here to handle event
          autoUpdater.quitAndInstall();
        });
        mainWindow.webContents.send('isUpdateNow')
      });

      autoUpdater.checkForUpdates();
  })
}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
  console.log('sendUpdateMessage----')
  mainWindow.webContents.send('message', text)
}