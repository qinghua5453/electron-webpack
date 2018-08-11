"use strict"

class Drag {
    constructor (target) {
      if(typeof target == undefined) {
        throw 'target must be add'
      }
      this.target = document.getElementById(target)
      this.ondragstart()
      this.ondrag()
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