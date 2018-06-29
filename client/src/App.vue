<template>
	<div id="syjh">
	   这个一个本地页面
	   <button @click="gotoWebview">gotoWebview</button>
	</div>
</template>

<script>
 const { ipcRenderer } = require('electron')
 export default {
	 name: 'main-vue',
	 methods: {
		 gotoWebview: function() {
            ipcRenderer.send('go-to-webview')
		 }
	 }
 }
</script>