import apiMethods from '../utils/apiMethods'

const API_URL = {
  login: '/auth/login', //  登录
  getUserList: '/api/member', //  获取成员列表
  getUserInfo: '/api/member/id', // 根据 id 获得成员信息
  addUser: '/api/member', //  创建成员
  updateUser: '/api/member/id', // 根据 id 修改成员信息
  deleteUser: '/api/member/id' //  根据 id 删除成员
}

const api = {
  login (data = {}) {
    return apiMethods.sendRequest({
      url: API_URL.login,
      method: 'post',
      data
    })
  },
  getUserList (params = {}) {
    return apiMethods.sendRequest({
      url: API_URL.getUserList,
      method: 'get',
      params
    })
  },
  getUserInfo (id) {
    return apiMethods.sendRequest({
      url: API_URL.getUserInfo.replace(/id/, id),
      method: 'delete'
    })
  },
  addUser (data = {}) {
    return apiMethods.sendRequest({
      url: API_URL.addUser,
      method: 'post',
      data
    })
  },
  updateUser (id, data = {}) {
    return apiMethods.sendRequest({
      url: API_URL.updateUser.replace(/id/, id),
      method: 'put',
      data
    })
  },
  deleteUser (id) {
    return apiMethods.sendRequest({
      url: API_URL.deleteUser.replace(/id/, id),
      method: 'delete'
    })
  }
}

export default api
