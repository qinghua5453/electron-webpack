import Vue from 'vue'
import App from './App.vue'
import './test.css'
// import 'iview/dist/styles/iview.css'
// import { Message, Modal } from 'iview';
// import topNav from './components/common/top-nav.vue'
// Vue.prototype.$Message = Message
// Vue.prototype.$Modal = Modal
// 全局注册组件
// Vue.component('top-nav', topNav)
const app = new Vue({
 render: h => h(App),
})
app.$mount('#syjh')