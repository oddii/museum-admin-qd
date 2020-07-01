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
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  chainWebpack: config => {
    //  发布环境
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('@/main-prod.js')

      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        echarts: 'echarts',
        'element-ui': 'ELEMENT',
        nprogress: 'NProgress'
      })

      //  定制首页环境
      config.plugin('html').tap(args => {
        args[0].isProd = true
        args[0].minify = false //  引号问题
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
    proxy: {
      '/apl': {
        target: 'http://106.13.192.206:8081', // 域名
        changeOrigin: true, // 开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {
          '^/apl': ''
        }
      }
    }
    // proxy: {
    //   '/apl': {
    //     target: 'http://localhost:8081/', // 域名
    //     changeOrigin: true, // 开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
    //     pathRewrite: {
    //       '^/apl': ''
    //     }
    //   }
    // }
  }
}
