import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/login/index')
  },
  {
    path: '/permission',
    component: () => import('@/layout/index'),
    name: 'permission',
    redirect: '/index',
    children: [{
      path: '/index',
      component: () => import('@/layout/components/AppMain'),
      name: 'index',
      hidden: false,
      alwaysShow: false,
      meta: { title: '首页', icon: 'el-icon-s-platform' }
    }, {
      path: '/relic',
      component: () => import('@/views/relic/index'),
      name: 'relic',
      redirect: '/relic/list',
      hidden: false,
      alwaysShow: true,
      meta: { title: '文物管理', icon: 'el-icon-s-management' },
      children: [
        {
          path: '/relic/list',
          component: () => import('@/views/relic/components/list'),
          name: 'relic-list',
          hidden: false,
          alwaysShow: false,
          meta: { title: '文物列表', icon: 'el-icon-document' }
        },
        {
          path: '/relic/wait',
          component: () => import('@/views/relic/components/wait'),
          name: 'wait',
          hidden: false,
          alwaysShow: false,
          meta: { title: '待录文物', icon: 'el-icon-document-add' }
        },
        {
          path: '/relic/detail/:id',
          component: () => import('@/views/relic/components/detail'),
          name: 'detail',
          hidden: true,
          alwaysShow: false,
          meta: { title: '文物详情', icon: '' }
        },
        {
          path: '/relic/count',
          component: () => import('@/views/relic/components/count'),
          name: 'count',
          hidden: true,
          alwaysShow: false,
          meta: { title: '盘点助手', icon: '' }
        }]
    },
    {
      path: '/record',
      name: 'record',
      component: () => import('@/views/record/index'),
      redirect: '/record/list',
      hidden: false,
      alwaysShow: true,
      meta: { title: '操作管理', icon: 'el-icon-s-tools' },
      children: [
        {
          path: '/record/list',
          component: () => import('@/views/record/components/list'),
          name: 'record-list',
          hidden: false,
          alwaysShow: false,
          meta: { title: '操作记录', icon: 'el-icon-date' }
        }
      ]
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/views/user/index'),
      redirect: '/user/list',
      hidden: false,
      alwaysShow: true,
      meta: { title: '成员管理', icon: 'el-icon-s-custom' },
      children: [
        {
          path: '/user/list',
          component: () => import('@/views/user/components/list'),
          name: 'user-list',
          hidden: false,
          alwaysShow: false,
          meta: { title: '成员列表', icon: 'el-icon-user' }
        }
      ]
    }
    ]
  }
]

const router = new VueRouter({
  routes
})

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
  next()
})

/**
 * 解具路由菜单出错问题
 * @type {{(location: RawLocation): Promise<Route>; (location: RawLocation, onComplete?: Function, onAbort?: ErrorHandler): void}}
 */
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}

export default router
