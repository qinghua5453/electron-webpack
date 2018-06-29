<template>
	<div id="syjh">
		<Modal
			v-model="modal1"
			title="Common Modal dialog box title"
			@on-ok="ok"
			@on-cancel="cancel">
			<p>Content of dialog</p>
			<p>Content of dialog</p>
			<p>Content of dialog</p>
		</Modal>
	</div>
</template>

<script>
 const { ipcRenderer } = require('electron')
 import { Button, Modal } from 'iview';
 export default {
	 name: 'main-vue',
	 components: {
        Button,
		Modal
	 },
	 data () {
          return {
			   modal1: true
		  }
	 },
	 methods: {
		 gotoWebview () {
            ipcRenderer.send('go-to-webview')
		 },
		 ok () {
            this.$Message.info('Clicked ok');
		 },
		 cancel () {
			this.$Message.info('Clicked cancel');
		 }
	 }
 }
</script>