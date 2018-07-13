"use strict"
const  { ipcRenderer } = require('electron')
class Menu {
    constructor (options){
        if(typeof (options.main) == undefined || typeof(options.webview) == undefined) {
            throw 'main or webview must be add to options'
        }
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
        this.main  = options.main ? true : false
        this.webview = options.webview ? true : false
        this.min_window()
        this.max_window()
        this.close_window()
        if(this.main) {
            this.gotoUserMsg()
            this.hoverUser()
            this.getId('user-wrap').style.display = 'flex'
        }
        if(this.webview) {
            this.forwardHandle()
            this.backHandle()
            this.reloadHandle()
            this.getId('forward-back-reload-w').style.display = 'flex'
        }
    }
    getHtml() {
    let html = `<div class="nav-top-wrap">
                    <div class="log-w"><span></span></div>
                    <div class="forward-back-reload-w" id="forward-back-reload-w">
                        <span class="forward" id="forward"></span>
                        <span class="back" id="back"></span>
                        <span class="reload" id="reload"></span>
                    </div>
                    <ul class="user-wrap" id="user-wrap">
                         <li class="user-icon"></li>
                         <li class="big-li">
                             杭州天猪科技有限公司
                             <ul class="sub-ul" id="sub-ul">
                               <li id="my-admin">我的资料</li>
                               <li>退出登录</li>
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
    min_window () {
        this.min.addEventListener('click', () => {
            if(this.main) ipcRenderer.send('min-main-window')
            if(this.webview) ipcRenderer.send('min-webview-window')
        })
    }
    max_window () {
        this.max.addEventListener('click', () => {
            if(this.main) ipcRenderer.send('max-main-window')
            if(this.webview) ipcRenderer.send('max-webview-window')
        })
    }
    close_window () {
        this.close.addEventListener('click', () => {
            if(this.main) ipcRenderer.send('close-main-window')
            if(this.webview) ipcRenderer.send('close-webview-window')
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
        user_wrap.addEventListener('mouseenter', () => {
            timer = setTimeout(function() {
                self.getId('sub-ul').style.display = 'none'
            }, 3000)
        })
        user_wrap.addEventListener('mouseover', () => {
            clearInterval(timer)
            self.getId('sub-ul').style.display = 'block'
        })
    }
    gotoUserMsg () {
        this.getId('my-admin').addEventListener('click', () => {
            this.webviewId.src = 'https://test.syzljh.com/enterprise/people/'
        })
    }
}

module.exports = Menu