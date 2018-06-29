import Vue from 'vue'
import App from './App.vue'
import './test.css'
import 'iview/dist/styles/iview.css'
import { Message } from 'iview';
Vue.prototype.$Message = Message

const app = new Vue({
 render: h => h(App),
})
app.$mount('#syjh')