import apiMethods from '../utils/apiMethods'

const API_URL = {
  getRelicList: '/api/relics', //  获取文物列表
  getRelicInfo: '/api/relics/id', //  根据 id  获取文物信息
  updateRelicInfo: '/api/relics/id' //  根据 id 修改文物信息
}

const api = {
  getRelicList (params = {}) {
    return apiMethods.sendRequest({
      url: API_URL.getRelicList,
      method: 'get',
      params
    })
  },
  getRelicInfo (id) {
    return apiMethods.sendRequest({
      url: API_URL.getRelicInfo.replace(/id/, id),
      method: 'get'
    })
  },
  updateRelicInfo (id, data = {}) {
    return apiMethods.sendRequest({
      url: API_URL.updateRelicInfo.replace(/id/, id),
      method: 'put',
      data
    })
  }
}

export default api
