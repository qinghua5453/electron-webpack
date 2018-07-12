<style scoped>
 .nav-top-wrap{
	 padding: 5px;
   background: #020047;
   display: flex;
   height: 50px;
   justify-content: center;
   align-items: center;
 }
 .nav-top-wrap .log-w {
   flex:2;
   padding-left: 3%;
 }
 .nav-top-wrap .log-w img {
   width: 310px;
   height: 30px;
 }
 .nav-top-wrap .min-max-close-w {
  flex: 4;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 2%;
 }
 .nav-top-wrap .min-max-close-w img {
   margin-right: 20px;
 }
 .nav-top-wrap .min-max-close-w .min {
   width: 15px;
   height: 2px;
 }
 .nav-top-wrap .min-max-close-w .max {
   width: 16px;
   height: 14px;
 }
 .nav-top-wrap .min-max-close-w .close {
   width: 14px;
   height: 15px;
 }
</style>

<template>
    <div class="nav-top-wrap">
       <div class="log-w">
         <img src="../../resource/log.png">
       </div>
       <div class="min-max-close-w">
          <img class="min" id="min"  src="../../resource/min.png">
          <img class="max" id="max"  src="../../resource/max.png">
          <img class="close" id="close" src="../../resource/close.png">
       </div>
    </div>
</template>

<script>
  const  { ipcRenderer } = require('electron')
  function getId (id) {
    return document.getElementById(id)
  }
  let min, max, close
  min = getId('min')
  max = getId('max')
  close = getId('close')
  min.addEventListener('click', () => {
    ipcRenderer.send('min-main-window')
  })
  max.addEventListener('click', () => {
    ipcRenderer.send('max-main-window')
  })
  close.addEventListener('click', () => {
    ipcRenderer.send('close-main-window')
  })
  export default {
      name: 'navTop',
      props:'',
      data() {
        return {

        }
      },
      methods: {
        
      }

  }
</script>
