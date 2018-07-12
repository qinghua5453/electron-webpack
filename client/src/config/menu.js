"use strict"
require('./menu.css')
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
        this.main  = options.main ? true : false
        this.webview = options.webview ? true : false
        this.min_window()
        this.max_window()
        this.close_window()
    }
    getHtml() {
    let html = `<div class="nav-top-wrap">
                    <div class="log-w"><span></span></div>
                    <div class="forward-back-reload-w">
                        <span class="forward" id="forward"></span>
                        <span class="back" id="back"></span>
                        <span class="reload" id="reload"></span>
                    </div>
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
}

module.exports = Menu