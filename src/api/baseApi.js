import apiMethods from '../utils/apiMethods'

const api = {
  getObject (url, params = {}) {
    return apiMethods.sendRequest({
      url,
      method: 'get',
      params
    })
  },
  getObjectById (url, id) {
    return apiMethods.sendRequest({
      url: url.replace(/id/, id),
      method: 'get'
    })
  },
  postObject (url, data = {}) {
    return apiMethods.sendRequest({
      url,
      method: 'post',
      data
    })
  },
  putObjectById (url, id, data = {}) {
    return apiMethods.sendRequest({
      url: url.replace(/id/, id),
      method: 'put',
      data
    })
  },
  deleteObjectById (url, id) {
    return apiMethods.sendRequest({
      url: url.replace(/id/, id),
      method: 'delete'
    })
  }
}

export default api
