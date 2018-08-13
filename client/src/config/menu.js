"use strict"
const  { ipcRenderer, remote } = require('electron')
const  { axiosRequest } = require('./axios-1.0.js')
const  { host } = require('./host.js')

class Menu {
    constructor (options){
        if(typeof (options.target) == undefined) {
            throw 'target must be add'
        }
        this.target = this.getId(options.target)
        this.getHtml()
        this.min = this.getId('min')
        this.max = this.getId('max')
        this.close = this.getId('close')
        this.forward = this.getId('forward')
        this.back = this.getId('back')
        this.reload = this.getId('reload')
        this.webviewId = this.getId('webview')

        this.min_window()
        this.max_window()
        this.close_window()
        this.gotoUserMsg()
        this.hoverUser()
        this.forwardHandle()
        this.backHandle()
        this.reloadHandle()
        this.loginOut()
    }
    getHtml() {
    let html = `<div class="nav-top-wrap">
                    <div class="log-w"><span></span></div>
                    <div class="forward-back-reload-w" id="forward-back-reload-w">
                        <span class="back" id="back"></span>
                        <span class="forward" id="forward"></span>
                        <span class="reload" id="reload"></span>
                    </div>
                    <ul class="user-wrap" id="user-wrap">
                         <li class="user-icon"></li>
                         <li class="big-li" style="min-width:150px;">
                             <span id="User_msg">${remote.getGlobal('loginState')}</span>
                             <ul class="sub-ul" id="sub-ul">
                               <li id="my-admin">我的资料</li>
                               <li id="login-out">退出登录</li>
                             </ul>
                         </li>
                         <li class="triangle"></li>
                    </ul>
                    <div class="min-max-close-w">
                        <span class="min" id="min"></span>
                        <span class="max" id="max"></span>
                        <span class="close" id="close"></span>
                    </div>
                </div>`
        this.target.innerHTML = html
    }
    getId (id) {
       return document.getElementById(id)
    }
    saveLoginState(state) {
        ipcRenderer.send('save-login-state', state)
    }
    min_window () {
        this.min.addEventListener('click', () => {
            ipcRenderer.send('min-webview-window')
        })
    }
    max_window () {
        this.max.addEventListener('click', () => {
            ipcRenderer.send('max-webview-window')
        })
    }
    close_window () {
        this.close.addEventListener('click', () => {
            ipcRenderer.send('hide-webview-window')
        })
    }
    forwardHandle () {
       this.forward.addEventListener('click', () => {
           this.webviewId.goForward()
       })
    }
    backHandle () {
        this.back.addEventListener('click', () => {
           this.webviewId.goBack()
        })
    }
    reloadHandle () {
        this.reload.addEventListener('click', () => {
           this.webviewId.reload()
        })
    }
    hoverUser () {
        let self = this
        let user_wrap = this.getId('user-wrap')
        let timer
        user_wrap.addEventListener('mouseover', () => {
            clearInterval(timer)
            self.getId('sub-ul').style.display = 'block'
            timer = setTimeout(function() {
                self.getId('sub-ul').style.display = 'none'
            }, 2000)
        })
    }
    gotoUserMsg () {
        this.getId('my-admin').addEventListener('click', () => {
            this.webviewId.src = host() + '/enterprise/people/'
        })
    }
    loginOut () {
        let self = this
        this.getId('login-out').addEventListener('click', () => {
           let params = {url: host() + '/user/api/group/logout/'}
           axiosRequest(params).then((res) => {
              ipcRenderer.send('close-webview-window')
              ipcRenderer.send('open-main-window')
              self.saveLoginState('login')
              console.log(res)
           }).catch((err) => {
              console.log(err)
           })
        })
    }
}

module.exports = Menu