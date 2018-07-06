<style scoped>
 .layui-progress-bar-wrap{
	 padding: 30px;
 }
</style>
<template>
	<div id="syjh">
		<div v-show="modal1"></div>
	    <button class="color" @click="gotoWebview">去webview页面</button>
	</div>
</template>

<script>
//  const  { ipcRenderer } = window.nodeRequire('electron')
 const  { ipcRenderer } = require('electron')
//  import { axiosRequest } from './config/axios-1.0.js'

 export default {
	 name: 'main-vue',
	 components: {

	 },
	 data () {
          return {
			   modal1: false,
			   message: '',
			   percent: '0%',
		  }
	 },
	 methods: {
		 gotoWebview () {
            ipcRenderer.send('go-to-webview')
		 },
	 },
	 updated() {
		 let self = this
		 layui.use('layer', function() {
			 let layer = layui.layer
			 if(self.modal1) {
				 layer.open({
					title: '更新进度提示',
					content: '<div class="layui-progress-bar-wrap">'
									+ '<div class="layui-progress layui-progress-big" lay-showpercent="true" lay-filter="demo">'
										+ '<div class="layui-progress-bar layui-bg-red" lay-percent="0%"></div>'
									+ '</div>'
							  + '</div>',
					btn: ['关闭'],
					btnAlign: 'c',
					shadeClose: true,
					yes: function(index) {
						layer.close(index)
					}
				})
			 }
		 })
	 },
	 mounted() {
		 let self = this
		 layui.use(['layer', 'element'], function() {
			let $ = layui.jquery
			let layer = layui.layer
			let element = layui.element

			ipcRenderer.on('message', function(event, message) {
				self.message = message
				console.log('vue', message);
			});

			ipcRenderer.on('autoDownload', function(event, message) {
				//  显示更新的弹窗
				self.message = message
				layer.confirm(self.message, {
					btn: ['立即更新'] //按钮
					}, function(index){
						layer.close(index)
						ipcRenderer.send('rightUpdate')
						self.modal1 = true
						ipcRenderer.on('downloadProgress', function(event, downloadProgress) {
							self.percent = Math.ceil(downloadProgress.percent) + '%'
							element.progress('demo', self.percent)
						});
					}
				);
			})
		 })
		 // 直接 引入出现跨域问题。
		 // 需要结合webpack-dev-server 或者nginx 配置跨域问题
		//  let params = {
		// 	 url: '/agreement/api/product_exchanges_state/828546bd-f4d5-4cc2-8272-a40490849ae7'
		//  }
		//  axiosRequest(params).then((resp) => {
        //    console.log('resp', resp)
		//  })
	 }
 }
</script>