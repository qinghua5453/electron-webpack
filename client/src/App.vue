<style scoped>
 .layui-progress-bar-wrap{
	 padding: 30px;
 }
 button{outline:0px none;border:0 none;background: transparent;cursor: pointer;}
 input::-webkit-input-placeholder{
    color:#fff;
}
 .clear:after{
	 display: block;
	 content: '';
	 height: 0;
	 clear: both;
	 overflow: hidden;
	 visibility: hidden;
 }
 .homePage_bg {
	 font-size: 14px;
	 color: #fff;
	 width: 563px;
	 height: 549px;
	 background-image: url('./resource/home_bg.png');
	 background-repeat: no-repeat;
	 background-color: #1171bb;
	 position: relative;
 }
 .homePage_bg .close {
	 width: 14px;
	 height: 15px;
	 display: inline-block;
	 position: absolute;
	 right: 13px;
	 top: 13px;
	 cursor: pointer;
	 background-image: url('./resource/close.png');
	 background-repeat: no-repeat;
 }
 .homePage_bg .content-wrap {
	 padding-top: 109px;
	 margin-left: auto;
	 margin-right: auto;
	 width: 350px;
 }
 .homePage_bg .content-wrap .log{
	 width: 100%;
	 height: 30px;
	 background-image: url('./resource/log.png');
	 background-repeat: no-repeat;
	 background-position: center center;
	 display: inline-block;
 }
 .homePage_bg .content-wrap .service {
	 font-size: 12px;
	 margin-top: 13px;
	 float: right;
	 margin-right:20px;
 }
 .homePage_bg .content-wrap .login-w {
	 margin-top: 82px;
 }
 .homePage_bg .content-wrap .login-w .login-common {
	 border-bottom: 1px solid #fff;
	 padding: 10px;
 }
 .homePage_bg .content-wrap .login-w .login-user-w {
     
 }
 .homePage_bg .content-wrap .login-w .img-user {
	 width: 20px;
	 height: 21px;
	 background-image: url('./resource/login_user.png');
	 background-repeat: no-repeat;
	 display: inline-block;
	 padding-right: 10px;
	 border-right: 1px solid #fff;
	 vertical-align: middle;
 }
 .homePage_bg .content-wrap .login-w .img-password {
	 width: 20px;
	 height: 23px;
	 background-image: url('./resource/user_password.png');
	 background-repeat: no-repeat;
	 display: inline-block;
	 padding-right: 10px;
	 border-right: 1px solid #fff;
	 vertical-align: middle;
 }
.homePage_bg .content-wrap .login-w .login-password-w {
	 margin-top: 42px;
 }
.homePage_bg .content-wrap .login-w .login-common .com-input {
	 padding-left: 10px;
	 background: transparent;
	 border:none;
	 color: #fff;
}
.homePage_bg .content-wrap .login-w .forget-password {
	float: right;
	font-size: 15px;
	margin-top: 15px;
	margin-bottom: 15px;
	text-align: right;
	cursor: pointer;
}
.homePage_bg .content-wrap .login-w .login-btn {
	background: #42A7DF;
	font-size: 25px;
	width: 96%;
	display: block;
	margin: 0 auto;
	color: #fff;
	padding:10px;
}
</style>
<template>
	<div id="syjh">
		<!-- <div id="menu"></div> -->
	    <!-- <button class="color" @click="gotoWebview">去webview页面</button> -->
		<div class="homePage_bg">
            <span class="close" @click="closeMainWindow"></span>
			<div class="content-wrap">
                <span class="log"></span>
				<span class="service">客服热线：400-6755-008</span>
				<div class="login-w">
					<div class="login-user-w login-common">
                        <span class="img-user"></span>
						<input class="com-input" type="text" placeholder="请输入用户名（邮箱）" name="account" v-model="account">
					</div>
					<div class="login-password-w login-common">
						<span class="img-password"></span>
						<input class="com-input" type="password" placeholder="请输入6-12位密码" name="password" v-model="password">
					</div>
					<div class="clear"><span class="forget-password"  @click="goToforgetPassword">忘记密码?</span></div>
					<div><button class="login-btn" @click="postSubmit">登  录</button></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
const  { ipcRenderer, shell, remote } = require('electron')
const Update = require('./config/update.js')
const { host } = require('./config/host.js')
const { axiosRequest } = require('./config/axios-1.0.js')

 export default {
	 name: 'main-vue',
	 components: {

	 },
	 data () {
          return {
			 account: '',
			 password: ''
		  }
	 },
	 methods: {
		 openWebviewWindow () {
			ipcRenderer.send('open-webview-window')
		 },
		 closeMainWindow () {
            ipcRenderer.send('close-main-window')
		 },
		 goToforgetPassword() {
			 shell.openExternal('https://zhejiang.syzljh.cn/account/password/index.html');
		 },
		 saveLoginState(state) {
            ipcRenderer.send('save-login-state', state)
		 },
		 beforeSubmit() {
			 let account = this.account.trim()
			 let password = this.password.trim()
			 let account_reg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@([a-zA-Z0-9]+[-.])+[a-zA-Z0-9]{2,4}$/
			//  if(!account) {
			// 	 layer.alert('请输入用户名（邮箱）')
			// 	 return false
			//  }
			//  if(!account_reg.test(account)) {
			// 	 layer.alert('请输入正确格式的邮箱')
			// 	 return false
			//  }
			//  if(!password) {
			// 	 layer.alert('请输入密码')
			// 	 return false
			//  }
			 return true
		 },
		 postSubmit() {
			 let self = this
			 if(this.beforeSubmit()) {
				let params = {
					url: host() + '/user/api/group/login/',
					method: 'POST',
					data: {
						account: this.account.trim(),
						password: this.password.trim()
					}
					// data: {
					// 	account: '67444758@tianzhu.com',
					// 	password: '67444758'
					// }
				}
				axiosRequest(params).then((res) => {
					    console.log('res', res)
						self.closeMainWindow()
						self.saveLoginState(res.detail)
						self.openWebviewWindow()
				}).catch((err) => {
					
				})
			 }
		 },
		 getJudgeLogin() {
			 let params = {url: host() + '/user/api/judge/login/'}
			 let self = this
			 axiosRequest(params).then((res) => {
				console.log('res', res)
                self.saveLoginState(res.detail)
			 }).catch((err) => {
				self.saveLoginState(err.detail)
			 })
		 }
	 },
	 mounted() {
		let update = new Update()
		// this.getJudgeLogin()
	 }
 }
</script>