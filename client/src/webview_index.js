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
    webview.addEventListener('did-start-loading', () => {
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
                layui.use('layer', () => {
                    let layer = layui.layer
                    layer.alert('登录状态过期,请重新登录！')
                })
                setTimeout(() => {
                    ipcRenderer.send('close-webview-window')
                    ipcRenderer.send('open-main-window')
                }, 3000)
            }
            console.log('flag', flag)
        });
    })
    // makeDraggable('#menu')
    
    function makeDraggable(dom) {
        let el = document.querySelector(dom)
        let clear
        try {
            // const drag = require('electron-drag');
            if (drag.supported) {
                clear = drag(el);
                clear()
                console.log('------')
            } else {
                console.log('<<<<<')
                makeDraggableFallback(el);
            }
        } catch (ex) {
            console.log('dddddd')
            makeDraggableFallback(el);
        }
    }

    function makeDraggableFallback(el) {
        let dragging = false;
        let mouseX = 0;
        let mouseY = 0;
        el.addEventListener('mousedown', (e) => {
            dragging = true;
            const { pageX, pageY } = e;
            mouseX = pageX;
            mouseY = pageY;
        });
        window.addEventListener('mouseup', () => {
            dragging = false;
        });
        window.addEventListener('mousemove', (e) => {
            if (dragging) {
                const { pageX, pageY } = e;
                const win = require('electron').remote.getCurrentWindow();
                const pos = win.getPosition();
                pos[0] = pos[0] + pageX - mouseX;
                pos[1] = pos[1] + pageY - mouseY;
                win.setPosition(pos[0], pos[1], true);
            }
        });
    }