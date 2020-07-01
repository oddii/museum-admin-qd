import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css' //  element-ul css样式
import '@/styles/index.less' //  全局 css样式
import '@/styles/element-ui.less' //  element-ui css样式
import './plugins/element.js'
import { Message } from 'element-ui'
// import '@/mock/index.js' //  mock数据

import Fragment from 'vue-fragment' //  使用 vue-fragment解决菜单问题

//  使用 v-charts 的 line 和 ring 图
import VeLine from 'v-charts/lib/line.common'
import VeRing from 'v-charts/lib/ring.common'

//  导入第三方插件 加载进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import api from './api/baseApi'
import ROLE_API_URL from './api/roleApiUrls'

Vue.use(NProgress)

Vue.component(VeLine.name, VeLine)
Vue.component(VeRing.name, VeRing)

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()
Vue.prototype.$bus.$editing = false
Vue.use(Fragment.Plugin) //  使用 vue-fragment解决菜单问题

const errorOptions = {
  message: '对不起，您没有权限访问该页面',
  type: 'error',
  duration: 2000,
  showClose: true
}
//  挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //  to 表示将要访问的路径
  //  from 表示从哪个路径跳转过来
  //  next 是一个函数,表示放行
  //  next() 直接放行 next('/login') 强制跳转
  if (to.path === '/login') return next()
  //  获取 token
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  if (!store.getters.getUserRole) {
    const roleId = window.sessionStorage.getItem('m-role')
    if (!roleId) return

    api.getObjectById(ROLE_API_URL.getRoleById, roleId)
      .then(result => {
        const { data, status } = result
        if (status !== 200) return this.$message.error('获取用户权限失败，请稍后再试')
        const permissions = data.permissions
        const roleList = []
        this.getCheckedList(permissions, roleList)
        store.commit('setUserRole', roleList.sort())
      })
      .catch(error => {
        if (error.response) {
          this.$message.error(error.response.data.message)
        }
      })
  } else {
    if (to.meta.code) {
      if (!store.getters.getUserRole.includes(to.meta.code)) {
        next('/index')
        return Message(errorOptions)
      }
    }
  }
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
