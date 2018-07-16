<style scoped>
 .layui-progress-bar-wrap{
	 padding: 30px;
 }
</style>
<template>
	<div id="syjh">
		<div id="menu"></div>
	    <button class="color" @click="gotoWebview">去webview页面</button>
	</div>
</template>

<script>
 const  { ipcRenderer } = require('electron')
 require('./config/menu.css')
 const Menu = require('./config/menu.js')
 const Update = require('./config/update.js')
//  import { axiosRequest } from './config/axios-1.0.js'

 export default {
	 name: 'main-vue',
	 components: {

	 },
	 data () {
          return {
			  
		  }
	 },
	 methods: {
		 gotoWebview () {
            ipcRenderer.send('go-to-webview')
		 },
	 },
	 updated() {

	 },
	 mounted() {
		// 直接 引入出现跨域问题。
		// 需要结合webpack-dev-server 或者nginx 配置跨域问题
		//  let params = {
		// 	 url: '/agreement/api/product_exchanges_state/828546bd-f4d5-4cc2-8272-a40490849ae7'
		//  }
		//  axiosRequest(params).then((resp) => {
        //    console.log('resp', resp)
		//  })
		let options = {
			target: 'menu',
			main: true
		}
		let menu = new Menu(options)
		let update = new Update()
	 }
 }
</script>