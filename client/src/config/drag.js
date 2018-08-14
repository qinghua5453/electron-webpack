"use strict"

class Drag {
    constructor (target) {
      if(typeof target == undefined) {
        throw 'target must be add'
      }
      this.target = document.getElementById(target)
      this.ondragstart()
      this.ondrag()
      this.onmousedown()
    }
    onmousedown () {
      this.target.addEventListener('mousedown', (e) => {
        // var scrollX = document.body.scrollLeft;
        // var scrollY = document.body.scrollTop;
        // var x = e.clientX + scrollX;
        // var y = e.clientY + scrollY;
        let clientX = e.clientX  // 鼠标点击坐标距离浏览器的x坐标
        let clientY = e.clientY
        let screenX = window.screenX // 浏览器左边缘距离屏幕视窗的x坐标
        let screenY = window.screenY
        // console.log(screenX, screenY);
        console.log(clientX, clientY);
        // return { x : x, y : y };
      })
    }
    onmouseup () {

    }
    onmousemove () {

    }
    ondragstart () {
      this.target.addEventListener('dragstart', () => {
        console.log('dragstart')
      })
    }
    ondrag () {
      this.target.addEventListener('drag', () => {
        console.log('drag')
      })
    }
    ondragend () {

    }
    ondragenter () {

    }
    ondragover () {

    }
    ondragleave () {

    }
    ondrop () {

    }
}
module.exports = Drag