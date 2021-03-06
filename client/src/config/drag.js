// drag.js
exports.makeDraggable = (dom) => {
  let el = document.querySelector(dom)
  let clear
  try {
      const drag = require('electron-drag');
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

