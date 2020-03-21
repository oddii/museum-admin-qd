import apiMethods from '../utils/apiMethods'
const API_URL = {
  getRecordList: '/api/option'
}

const api = {
  getRecordList (params = {}) {
    return apiMethods.sendRequest({
      url: API_URL.getRecordList,
      method: 'get',
      params
    })
  }
}

export default api
