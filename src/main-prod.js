import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import 'element-ui/lib/theme-chalk/index.css' //  element-ul css样式
import '@/styles/index.less' //  全局 css样式
import '@/styles/element-ui.less' //  element-ui css样式
// import './plugins/element.js'
// import '@/mock/index.js' //  mock数据

import Fragment from 'vue-fragment' //  使用 vue-fragment解决菜单问题

//  使用 v-charts 的 line 和 ring 图
import VeLine from 'v-charts/lib/line.common'
import VeRing from 'v-charts/lib/ring.common'

//  导入第三方插件 加载进度条
import NProgress from 'nprogress'

Vue.use(NProgress)

Vue.component(VeLine.name, VeLine)
Vue.component(VeRing.name, VeRing)

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()
Vue.prototype.$bus.$editing = false
Vue.use(Fragment.Plugin) //  使用 vue-fragment解决菜单问题

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
