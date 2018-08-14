    require('./config/menu.css')
    let { remote, ipcRenderer } = require('electron')
    let session = remote.session
    let Menu = require('./config/menu.js')
    let { host } = require('./config/host.js')
    let options = {
        target: 'menu'
    }
    let menu = new Menu(options)
    let webview = document.getElementById('webview')
    webview.setAttribute('src', host() + '/account/home/')
    layui.use('layer', () => {
       let layer = layui.layer;
       let layerIndex;
      //webview 开始加载钩子函数
       webview.addEventListener('did-start-loading', () => {
            layerIndex = layer.load(2, {shade: false});
            // 调用登录判断的钩子函数
            session.defaultSession.cookies.get({ url: host()}, function (error, cookies) {
                if(error) return
                let cookie
                let flag = false
                for(let i = 0; i < cookies.length; i++) {
                    cookie = cookies[i]
                    if(cookie.name == 'loginState' && cookie.value != 'login') {
                        flag = true
                        break
                    }
                }
                if(!flag) {
                    // 需要重新登录 此时存储在cookie的登录状态已经过期
                    layer.alert('登录状态过期,请重新登录！')
                    setTimeout(() => {
                        ipcRenderer.send('close-webview-window')
                        ipcRenderer.send('open-main-window')
                    }, 3000)
                }
            });
        })
        //webview 开始完成钩子函数
        webview.addEventListener('did-finish-load', () => {
            layer.close(layerIndex)
        })
        //webview 加载失败钩子函数
        webview.addEventListener('did-fail-load', () => {
            layer.alert('页面加载失败，请手动刷新当前页面！')
        })
    })