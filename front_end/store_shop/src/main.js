import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import utils from './utils.js'
import router from '@/router/index'
import VantUi from 'vant'
import 'vant/lib/index.css'

Vue.config.productionTip = false
Vue.prototype.utils = utils
Vue.use(axios)
Vue.use(VantUi)
Vue.config.$http = axios

axios.defaults.baseURL = 'http://localhost:9527/'
axios.defaults.headers["Content-Type"] = 'application/json'
// 添加拦截器
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('/token')
  return config
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
