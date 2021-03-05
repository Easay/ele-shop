import Vue from 'vue'
import App from './App.vue'
import router from './router'


//引入全局样式表
import './assets/css/global.css'

// 导入字体图标
import './assets/fonts/iconfont.css'
import './plugins/element.js'
import axios from 'axios'
axios.defaults.baseURL = "http://101.37.247.39:8888/api/private/v1/"
Vue.prototype.$http = axios

// 拦截请求，添加token验证
axios.interceptors.request.use(config => {
    config.headers.Authorization = sessionStorage.getItem('token');
    return config;
})

// 全局注册第三方表格组件
import ZkTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', ZkTable)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
