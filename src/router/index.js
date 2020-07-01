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
    path: '/home',
    component: () => import('@/layout/index'),
    name: 'home',
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/layout/components/AppMain'),
        name: 'index',
        hidden: false,
        alwaysShow: false,
        meta: { code: 10000, title: '首页', icon: 'el-icon-s-platform' }
      },
      {
        path: '/relic',
        component: () => import('@/views/relic/index'),
        name: 'relic',
        redirect: '/relic/list',
        hidden: false,
        alwaysShow: true,
        meta: { code: 1000, title: '文物管理', icon: 'el-icon-s-management' },
        children: [
          {
            path: '/relic/list',
            component: () => import('@/views/relic/components/list'),
            name: 'relic-list',
            hidden: false,
            alwaysShow: false,
            meta: { code: 1100, title: '文物列表', icon: 'el-icon-document', keepAlive: true }
          },
          {
            path: '/relic/wait',
            component: () => import('@/views/relic/components/wait'),
            name: 'wait',
            hidden: false,
            alwaysShow: false,
            meta: { code: 1200, title: '待录文物', icon: 'el-icon-document-add', keepAlive: true }
          },
          {
            path: '/relic/upload',
            component: () => import('@/views/relic/components/upload'),
            name: 'upload',
            hidden: false,
            alwaysShow: false,
            meta: { code: 1106, title: '导入数据', icon: 'el-icon-upload', keepAlive: true }
          },
          {
            path: '/relic/detail/:id',
            component: () => import('@/views/relic/components/detail'),
            name: 'detail',
            props: true,
            hidden: true,
            alwaysShow: false,
            meta: { code: 1104, title: '文物详情', icon: '' }
          }]
      },
      {
        path: '/record',
        name: 'record',
        component: () => import('@/views/record/index'),
        redirect: '/record/list',
        hidden: false,
        alwaysShow: true,
        meta: { code: 2000, title: '操作管理', icon: 'el-icon-s-tools' },
        children: [
          {
            path: '/record/list',
            component: () => import('@/views/record/components/list'),
            name: 'record-list',
            hidden: false,
            alwaysShow: false,
            meta: { code: 2100, title: '操作记录', icon: 'el-icon-date', keepAlive: true }
          }
        ]
      },
      {
        path: '/store',
        name: 'm-store',
        component: () => import('@/views/store/index'),
        redirect: '/store/list',
        hidden: false,
        alwaysShow: true,
        meta: { code: 4000, title: '仓库管理', icon: 'el-icon-s-shop' },
        children: [
          {
            path: '/store/list',
            component: () => import('@/views/store/components/list'),
            name: 'store-list',
            hidden: false,
            alwaysShow: false,
            meta: { code: 4100, title: '仓库列表', icon: 'el-icon-house', keepAlive: true }
          }
        ]
      },
      {
        path: '/permission',
        name: 'permission',
        component: () => import('@/views/permission/index'),
        redirect: '/permission/list',
        hidden: false,
        alwaysShow: true,
        meta: { code: 3000, title: '权限管理', icon: 'el-icon-s-check' },
        children: [
          {
            path: '/permission/list',
            component: () => import('@/views/permission/components/list'),
            name: 'permission-list',
            hidden: false,
            alwaysShow: false,
            meta: { code: 3100, title: '权限列表', icon: 'el-icon-coordinate', keepAlive: true }
          },
          {
            path: '/permission/role',
            component: () => import('@/views/permission/components/role'),
            name: 'role-list',
            hidden: false,
            alwaysShow: false,
            meta: { code: 3200, title: '角色列表', icon: 'el-icon-star-off', keepAlive: true }
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
        meta: { code: 5000, title: '成员管理', icon: 'el-icon-s-custom' },
        children: [
          {
            path: '/user/list',
            component: () => import('@/views/user/components/list'),
            name: 'user-list',
            hidden: false,
            alwaysShow: false,
            meta: { code: 5100, title: '成员列表', icon: 'el-icon-user', keepAlive: true }
          }
        ]
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  scrollBehavior (to, from, savePosition) {
    /**
     * 保留回退的滚动条滚动距离
     */
    if (savePosition) return savePosition
    else return { x: 0, y: 0 }
  }
})

//  挂载路由导航守卫
// router.beforeEach((to, from, next) => {
//   //  to 表示将要访问的路径
//   //  from 表示从哪个路径跳转过来
//   //  next 是一个函数,表示放行
//   //  next() 直接放行 next('/login') 强制跳转
//   if (to.path === '/login') return next()
//   //  获取 token
//   const token = window.sessionStorage.getItem('token')
//   if (!token) return next('/login')
//   next()
// })

/**
 * 解决路由菜单出错问题
 * @type {{(location: RawLocation): Promise<Route>; (location: RawLocation, onComplete?: Function, onAbort?: ErrorHandler): void}}
 */
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}

export default router
