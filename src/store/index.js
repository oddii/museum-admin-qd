import Vue from 'vue'
import Vuex from 'vuex'
import api from '../api/baseApi'
import RELIC_API_URL from '../api/relicApiUrl'
import table2excel from 'js-table2excel'
import { Message } from 'element-ui'
import utils from '../utils/utils'
import RECODE_API_URL from '../api/recordApiUrl'
import STORE_API_URL from '../api/storeApiUrl'
import USER_API_URL from '../api/userApiUrl'
import ROLE_API_URL from '../api/roleApiUrls'
import menu from '../utils/menu'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId: '',
    name: '', //  用户姓名
    userRoleName: '',
    userRole: '', //  用户权限
    menu: [] //  侧边栏菜单
  },
  mutations: {
    setUserId: (state, value) => {
      state.userId = value
    },
    setName: (state, value) => {
      state.name = value
    },
    setUserRoleName: (state, value) => {
      state.userRoleName = value
    },
    setUserRole: (state, value) => {
      state.userRole = value
    },
    setMenu: (state, value) => {
      state.menu = value
    }
  },
  getters: {
    getUserId: state => state.userId,
    getName: state => state.name,
    getUserRoleName: state => state.userRoleName,
    getUserRole: state => state.userRole,
    getMenu: state => state.menu
  },
  actions: {
    getAllRelicList: (context, params) => {
      /**
       * 获得全部文物列表
       */
      api.getObject(RELIC_API_URL.getAllRelicList)
        .then(result => {
          const { data } = result
          const allData = data.reduce((result, item) => {
            const row = Object.assign(item)
            row.id = 'id' + row.id.toString()
            row.url = utils.formatImgPath(item.images[0], 'small')
            row.purchaseDate = utils.formatDate(item.purchaseDate)
            row.receiveDate = utils.formatDate(item.receiveDate)
            result.push(row)
            return result
          }, [])
          //  使用table2excel导出excel到本地
          table2excel(params.tableHeaders, allData, params.filename === '' ? 'excel-list' : params.filename)
        })
        .catch(result => {
          Message({
            message: '获取全部文物信息失败，请稍后再试',
            type: 'error'
          })
        })
    },
    getAllWaitRelicList: (context, params) => {
      /**
       * 获得全部待入库列表
       */
      api.getObject(RELIC_API_URL.getAllWaitRelicList)
        .then(result => {
          const { data } = result
          const allData = data.reduce((result, item) => {
            const row = Object.assign(item)
            row.id = 'id' + row.id.toString()
            row.url = utils.formatImgPath(item.images[0], 'small')
            row.createDate = utils.formatDate(item.createDate)
            result.push(row)
            return result
          }, [])
          table2excel(params.tableHeaders, allData, params.filename === '' ? 'excel-list' : params.filename)
        })
        .catch(result => {
          Message({
            message: '获取全部待入文物信息失败，请稍后再试',
            type: 'error'
          })
        })
    },
    getAllRecordList: (context, params) => {
      /**
       * 获取全部操作记录列表
       */
      api.getObject(RECODE_API_URL.getAllRecordList)
        .then(async result => {
          const { data } = await result

          const allData = data.reduce((result, item) => {
            const row = Object.assign(item)
            row.id = 'id' + row.id.toString()
            row.optionDate = utils.formatDate(item.optionDate)
            result.push(row)
            return result
          }, [])

          table2excel(params.tableHeaders, allData, params.filename === '' ? 'excel-list' : params.filename)
        })
        .catch(result => {
          Message({
            message: '获取全部操作记录信息失败，请稍后再试',
            type: 'error'
          })
        })
    },
    getAllStoreList: (context, params) => {
      /**
       * 获得全部仓库列表
       */
      api.getObject(STORE_API_URL.getAllStoreList)
        .then(result => {
          const { data } = result
          const allData = data.reduce((result, item) => {
            const row = Object.assign(item)
            row.id = 'id' + row.id.toString()
            result.push(row)
            return result
          }, [])
          table2excel(params.tableHeaders, allData, params.filename === '' ? 'excel-list' : params.filename)
        })
        .catch(result => {
          Message({
            message: '获取全部仓库信息失败，请稍后再试',
            type: 'error'
          })
        })
    },
    getAllUserList: (context, params) => {
      /**
       * 获得全部成员列表
       */
      api.getObject(USER_API_URL.getAllUserList)
        .then(result => {
          const { data } = result
          const allData = data.reduce((result, item) => {
            const row = Object.assign(item)
            row.id = 'id' + row.id.toString()
            result.push(row)
            return result
          }, [])
          table2excel(params.tableHeaders, allData, params.filename === '' ? 'excel-list' : params.filename)
        })
        .catch(result => {
          Message({
            message: '获取全部成员信息失败，请稍后再试',
            type: 'error'
          })
        })
    },
    getUserRole: (context) => {
      /**
       * 获得用户权限
       */
      const roleId = window.sessionStorage.getItem('m-role')
      if (!roleId) return

      api.getObjectById(ROLE_API_URL.getRoleById, roleId)
        .then(result => {
          const { data, status } = result
          if (status !== 200) return this.$message.error('获取用户权限失败，请稍后再试')
          const permissions = data.permissions
          const roleList = []
          utils.getCheckedList(permissions, roleList)
          roleList.push(10000)
          context.commit('setUserRole', roleList.sort())

          const arr = JSON.parse(JSON.stringify(menu)).filter(item => {
            if (item.children) {
              item.children = item.children.filter(children => {
                return roleList.sort().includes(children.meta.code)
              })
            }
            return roleList.sort().includes(item.meta.code)
          })
          context.commit('setMenu', arr)
        })
        .catch(error => {
          if (error.response) {
            this.$message.error(error.response.data.message)
          }
        })
    }
  }
})
