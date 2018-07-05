import Vue from 'vue'
import App from './App.vue'
import './test.css'
// import 'iview/dist/styles/iview.css'
// import { Message, Modal } from 'iview';
// Vue.prototype.$Message = Message
// Vue.prototype.$Modal = Modal

const app = new Vue({
 render: h => h(App),
})
app.$mount('#syjh')