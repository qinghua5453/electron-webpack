<template>
	<div id="syjh">
	   <button class="color" @click="gotoWebview">去webview页面</button>
	   <div>message: {{message}}</div>
	   <div>percent: {{percent}}</div>
		<!-- <Modal
			v-model="modal1"
			title="检查更新"
			@on-ok="ok"
			@on-cancel="cancel">
			<p>{{ message }}</p>
		</Modal> -->
	</div>
</template>

<script>
 const  { ipcRenderer } = window.nodeRequire('electron')
//  import { Button, Modal } from 'iview';
//  import { axiosRequest } from './config/axios-1.0.js'

 export default {
	 name: 'main-vue',
	 components: {
        // Button,
		// Modal
	 },
	 data () {
          return {
			   modal1: true,
			   message: '',
			   percent: '0%'
		  }
	 },
	 methods: {
		 gotoWebview () {
            ipcRenderer.send('go-to-webview')
		 },
		//  ok () {
        //     this.$Message.info('Clicked ok');
		//  },
		//  cancel () {
		// 	this.$Message.error('Clicked cancel');
		//  }
	 },
	 mounted() {
		 console.log('----------test--------')
		 let self = this
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
					ipcRenderer.send('rightUpdate')
					ipcRenderer.on('downloadProgress', function(event, downloadProgress) {
						console.log('sd----', downloadProgress);
						self.percent = downloadProgress
					});
					layer.alert('正在下载更新' + self.percent);
				}
		    );
		 })
		// ipcRenderer.on('downloadProgress', function(event, downloadProgress) {
		//    self.percent = downloadProgress
        //    layer.alert('正在下载更新' + self.percent)
		// })
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