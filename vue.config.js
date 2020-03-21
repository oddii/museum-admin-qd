'use strict'
const path = require('path')
const name = 'MuseumAdmin'

function resolve (dir) {
  /**
   * 修改别名用
   */
  return path.join(__dirname, dir)
}

module.exports = {
  chainWebpack: config => {
    //  发布环境
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('@/main-prod.js')

      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'driver.js': 'driver.js'
      })

      //  定制首页环境
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })

    //  开发环境
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('@/main-dev.js')

      //  定制首页环境
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  devServer: {
    // 设置代理
    // proxy: {
    //   '/apl': {
    //     target: 'http://101.132.156.46:8081', // 域名
    //     changeOrigin: true, // 开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
    //     pathRewrite: {
    //       '^/apl': ''
    //     }
    //   }
    // }
    proxy: {
      '/apl': {
        target: 'http://localhost:8088/', // 域名
        changeOrigin: true, // 开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {
          '^/apl': ''
        }
      }
    }
  }
}
