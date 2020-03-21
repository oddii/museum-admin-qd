import service from './service'
import config from './config'
import qs from 'qs'

const apiMethods = {
  sendRequest (params) {
    const requestConfig = { headers: {} }
    let data

    //  配置请求内容类型
    if (params.ctxType === 'formdata') Object.assign(requestConfig.headers, config.ctxFormDataHeader)
    else Object.assign(requestConfig.headers, config.ctxJsonHeader)

    if (params.params && !params.data) {
      // 将url参数配置进axios实例
      requestConfig.params = params.params
    }

    if (params.data && !params.params) {
      if (params.ctxType === 'formdata') data = qs.stringify(params.data)
      else data = params.data
    }

    switch (params.method) {
      case 'get':
        return new Promise((resolve, reject) => {
          service.get(params.url, requestConfig)
            .then(result => {
              resolve(result)
            })
            .catch(result => {
              reject(result)
            })
        })
      case 'post':
        return new Promise((resolve, reject) => {
          service.post(params.url, data, requestConfig)
            .then(result => {
              resolve(result)
            })
            .catch(result => {
              reject(result)
            })
        })
      case 'put':
        return new Promise((resolve, reject) => {
          service.put(params.url, data, requestConfig)
            .then(result => {
              resolve(result)
            })
            .catch(result => {
              reject(result)
            })
        })
      case 'delete':
        return new Promise((resolve, reject) => {
          service.delete(params.url, requestConfig)
            .then(result => {
              resolve(result)
            })
            .catch(result => {
              reject(result)
            })
        })
    }
  }

}

export default apiMethods
