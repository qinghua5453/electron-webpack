import Vue from 'vue'
import App from './App.vue'
import './test.css'
// import 'iview/dist/styles/iview.css'
import { Button, Table } from 'iview';
console.log('process.env.NODE_ENV', process.env.NODE_ENV)
Vue.component('Button', Button);
Vue.component('Table', Table);

const app = new Vue({
 render: h => h(App),
})
app.$mount('#syjh')