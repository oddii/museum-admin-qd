import axios from 'axios'
import config from './config'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const service = axios.create({
  baseURL: config.baseUrl,
  timeout: 60000
})

const errorOptions = {
  message: '请求失败，请稍后重试',
  type: 'error',
  duration: 2000,
  showClose: true
}

service.interceptors.request.use(config => {
  NProgress.start()
  //  为请求头对象,.添加 token 验证的 authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}, error => {
  console.log(error) // for debug
  Message(errorOptions)
  return Promise.reject(error)
})

service.interceptors.response.use(response => {
  NProgress.done()
  return response
})

export default service
