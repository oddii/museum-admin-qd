<template>
  <div id="app">
      <router-view/>
  </div>
</template>

<script>

import api from './api/baseApi'
import USER_API_URL from './api/userApiUrl'
import ROLE_API_URL from './api/roleApiUrls'
import menu from './utils/menu'

export default {
  name: 'app',
  created () {
    this.getUserInfo()
    // this.getUserRole()
    this.$store.dispatch('getUserRole')
  },
  methods: {
    getUserInfo () {
      /**
       * 获得用户信息
       */
      const userId = window.sessionStorage.getItem('m-id')
      if (!userId) return

      api.getObjectById(USER_API_URL.getUserInfoById, userId)
        .then(result => {
          const { data, status } = result
          if (status !== 200) return this.$message.error('获取用户信息失败，请稍后再试')

          this.$store.commit('setName', data.name)
          this.$store.commit('setUserRoleName', data.roleName)
        })
        .catch(error => {
          if (error.response) {
            this.$message.error(error.response.data.message)
          }
        })
    },
    getUserRole () {
      /**
       * 获得角色权限
       */
      const roleId = window.sessionStorage.getItem('m-role')
      if (!roleId) return

      api.getObjectById(ROLE_API_URL.getRoleById, roleId)
        .then(result => {
          const { data, status } = result
          if (status !== 200) return this.$message.error('获取用户权限失败，请稍后再试')
          const permissions = data.permissions
          const roleList = []
          this.getCheckedList(permissions, roleList)
          roleList.push(10000)
          this.$store.commit('setUserRole', roleList.sort())

          setTimeout(() => {
            this.getMenu()
          }, 10)
        })
        .catch(error => {
          if (error.response) {
            this.$message.error(error.response.data.message)
          }
        })
    },
    getMenu () {
      /**
       * 根据权限获得路由菜单
       */
      const arr = JSON.parse(JSON.stringify(menu)).filter(item => {
        if (item.children) {
          item.children = item.children.filter(children => {
            return this.$store.getters.getUserRole.includes(children.meta.code)
          })
        }
        return this.$store.getters.getUserRole.includes(item.meta.code)
      })

      this.$store.commit('setMenu', arr)
    }
  }
}
</script>

<style>
</style>
