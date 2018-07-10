<style scoped>
 .nav-top-wrap{
	 padding: 5px;
   background: #4789f2;
   display: flex;
   height: 60px;
   justify-content: center;
   align-items: center;
 }
 .nav-top-wrap .log-w {
   flex:2;
 }
 .nav-top-wrap .log-w img {
   width: 100%;
 }
 .nav-top-wrap .min-max-close-w {
  flex: 4;
  justify-content: center;
  display: flex
 }
</style>

<template>
    <div class="nav-top-wrap">
       <div class="log-w">
         <img src="../../resource/log.png">
       </div>
       <div class="min-max-close-w">
          <button @click="min">缩小</button>
          <button @click="max">全屏</button>
          <button @click="close">关闭</button>
       </div>
    </div>
</template>

<script>
  const  { ipcRenderer } = require('electron')
  export default {
      name: 'navTop',
      props:'',
      data() {
        return {

        }
      },
      methods: {
        min() {
            ipcRenderer.send('min-main-window')
        },
        max() {
            ipcRenderer.send('max-main-window')
        },
        close() {
            ipcRenderer.send('close-main-window')
        }
      }

  }
</script>
