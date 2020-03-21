import apiMethods from '../utils/apiMethods'

const API_URL = {
  menus: '/menus'
}

const api = {
  getMenus (params = {}) {
    return apiMethods.sendRequest({
      method: 'get',
      url: API_URL.menus,
      params
    })
  }
}

export default api
