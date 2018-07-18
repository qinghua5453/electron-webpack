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
            <span class="close" @click="closeWindow"></span>
			<div class="content-wrap">
                <span class="log"></span>
				<span class="service">客服热线：400-6755-008</span>
				<div class="login-w">
					<div class="login-user-w login-common">
                        <span class="img-user"></span>
						<input class="com-input" type="text" placeholder="请输入用户名（邮箱）">
					</div>
					<div class="login-password-w login-common">
						<span class="img-password"></span>
						<input class="com-input" type="text" placeholder="请输入6-12位密码">
					</div>
					<div class="clear"><span class="forget-password"  @click="goToforgetPassword">忘记密码?</span></div>
					<div><button class="login-btn">登  录</button></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
 const  { ipcRenderer, shell } = require('electron')
//  require('./config/menu.css')
//  const Menu = require('./config/menu.js')
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
		 closeWindow () {
            ipcRenderer.send('close-main-window')
		 },
		 goToforgetPassword() {
			 shell.openExternal('https://zhejiang.syzljh.cn/account/password/index.html');
		 }
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
		// let options = {
		// 	target: 'menu',
		// 	main: true
		// }
		// let menu = new Menu(options)
		let update = new Update()
	 }
 }
</script>