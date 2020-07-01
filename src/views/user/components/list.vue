<template>
  <div class="user-list-wrapper">
    <el-card>
      <!--搜索表格组件-->
      <table-search :use-add-user="isCanInsertUser" table-type="user"
                    @refreshUserList="handleRefresh" @search="handleSearch"/>

      <!--导出表格组件-->
      <export-excel :table-headers="tableHeaders" table-type="user"
                    :page-data="excelPageData" v-if="isCanExportExcel"/>

      <!--一览表格-->
      <el-table :data="tableData" :highlight-current-row="true"
                :border="true" :stripe="true" max-height="670">
        <el-table-column label="#" type="index" align="center"/>
        <el-table-column label="工号" prop="id" width="250" :sortable="true" align="center"/>
        <el-table-column label="用户名" prop="username" width="200" align="center"/>
        <el-table-column label="姓名" prop="name" width="150" align="center"/>
        <el-table-column label="邮箱" prop="email" width="200" align="center"/>
        <el-table-column label="角色" prop="roleName" width="150" align="center"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <el-button type="primary" size="small" icon="el-icon-notebook-2" v-if="isCanSeeRecord"
                       @click="handleRecordListDlg(row)">操作记录</el-button>
            <el-button size="small" icon="el-icon-edit-outline" v-if="isCanEditName"
                       @click="handleEditName(row)">修改姓名</el-button>
                       <el-button size="small" icon="el-icon-edit-outline" v-if="isCanEditEmail"
                       @click="handleEditEmail(row)">修改邮箱</el-button>
            <el-button size="small" icon="el-icon-edit-outline" v-if="isCanEditPassword"
                       @click="handleEditPassword(row)">修改密码</el-button>
            <el-button size="small" icon="el-icon-setting" type="warning" v-if="isCanAssignRole"
                       @click="handleAssignShow(row)">分配角色</el-button>
<!--            <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteUser(scope.row.id)">删除用户</el-button>-->
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

    </el-card>

    <el-dialog title="操作记录" :visible.sync="recordTable.visible" :before-close="handleRecordListDlgClose" width="70%">
      <el-table :data="recordTable.data"  :highlight-current-row="true" max-height="623"
                :border="true" :stripe="true" >
        <el-table-column type="index" label="#" align="center" />
        <el-table-column label="记录编号" prop="id" width="300" :sortable="true" align="center"/>
        <el-table-column label="文物名称" prop="optionRelicsName" width="300" align="center"/>
        <el-table-column label="操作类型" prop="relicsOptionType" width="100" align="center">
          <template slot-scope="{row}" >
            <el-tag :type="formatOptionType(row.relicsOptionType)" size="medium">
              {{row.relicsOptionType}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作详情" prop="details"  align="center"/>
        <el-table-column label="操作时间" prop="optionDate" width="180"
                         :sortable="true" align="center" :formatter="formatTableDate"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
     <el-button type="primary" size="small" @click="exportOptions2excel"
                icon="el-icon-document-copy">导出操作记录</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改密码" :visible.sync="editPasswordDlgVisible" width="25%" :before-close="closeEditPasswordDlg">
      <div class="edit-content">
      <!--修改信息表格-->
        <el-form :model="editPasswordForm" :rules="editPasswordFormRules" label-width="100px">
          <el-form-item label="新密码：" prop="password">
            <el-input type="password" v-model="editPasswordForm.password"/>
          </el-form-item>
          <el-form-item label="确认密码：" prop="confirmPassword">
            <el-input type="password" v-model="editPasswordForm.confirmPassword"/>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditPasswordDlg">取消</el-button>
        <el-button type="primary" @click="editPassword">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改姓名" :visible.sync="editNameDlgVisible" width="25%" :before-close="closeEditNameDlg">
      <div class="edit-content">
        <el-form>
          <el-form-item label="用户姓名：" label-width="90px">
            <el-input type="text" v-model="editNameInput"/>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditNameDlg">取消</el-button>
        <el-button type="primary" @click="editName">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改邮箱" :visible.sync="editEmailDlgVisible" width="25%" :before-close="closeEditEmailDlg">
      <div class="edit-content">
        <el-form>
          <el-form-item label="绑定邮箱：" label-width="90px">
            <el-input type="text" v-model="editEmailInput"/>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditEmailDlg">取消</el-button>
        <el-button type="primary" @click="editEmail">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分配角色" :visible.sync="assignInfo.visible" width="25%" :before-close="handleAssignCancel">
      <div class="edit-content">
        <el-select v-model="assignInfo.roleId" placeholder="请选择">
          <el-option v-for="item in assignInfo.roleList" :key="item.value" :label="item.name" :value="item.id"/>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAssignCancel">取消</el-button>
        <el-button type="primary" @click="handleAssignSubmit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../../api/baseApi'
import ExportExcel from '../../../components/ExportExcel/index'
import TableSearch from '../../../components/TableSearch/index'
import USER_API_URL from '../../../api/userApiUrl'
import utils from '../../../utils/utils'
import tableConfig from '../../../utils/tableConfig'
import table2excel from 'js-table2excel'
import ROLE_API_URL from '../../../api/roleApiUrls'
import config from '../../../utils/config'

export default {
  name: 'user-list',
  components: { TableSearch, ExportExcel },
  created () {
    this.userRole = window.sessionStorage.getItem('m-role')
    this.getUserList()
  },
  data () {
    return {
      userRole: '',
      searchValue: '',
      tableData: [],
      excelPageData: [],
      tableHeaders: tableConfig.userTableHeaders,
      currentPage: 0,
      pageSize: 10,
      total: 0,
      editUserInfo: '',
      editPasswordDlgVisible: false,
      editPasswordForm: {
        password: '',
        confirmPassword: ''
      },
      editPasswordFormRules: {
        password: [
          { required: true, message: '请输入要修改的用户密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      },
      editNameDlgVisible: false,
      editNameInput: '',
      editEmailDlgVisible: false,
      editEmailInput: '',
      delUserId: '',
      recordTable: {
        name: '', //  员工姓名
        data: [],
        currentPage: 0,
        pageSize: 10,
        total: 0,
        visible: false
      },
      assignInfo: {
        visible: false,
        userId: '',
        roleId: '',
        roleList: []
      }
    }
  },
  methods: {
    async getUserList (params = {}) {
      /**
       * 获取用户列表
       */

      if (this.searchValue) params.search = this.searchValue
      await api.getObject(USER_API_URL.getUserList, params)
        .then(result => {
          const { data } = result

          this.tableData = data.content
          this.total = data.totalElements
          this.pageSize = data.size
          this.currentPage = data.number + 1
        })
        .catch(async error => {
          if (error.response) {
            await this.$message.error(error.response.data.message)
          }
        })

      //  导出到excel的单页数据
      this.excelPageData = JSON.parse(JSON.stringify(this.tableData)).reduce((result, item) => {
        const row = Object.assign(item)
        row.id = 'id' + row.id.toString()
        result.push(row)
        return result
      }, [])
    },
    handleCurrentChange (curPage) {
      /**
       * 当前页码改变的事件
       */
      this.currentPage = curPage - 1
      this.getUserList({
        page: this.currentPage,
        size: this.pageSize
      })
    },
    handleSizeChange (newSize) {
      /**
       * 每页显示条数改变的事件
       */
      this.pageSize = newSize
      this.getUserList({
        size: this.pageSize
      })
    },
    handleSearch (value) {
      this.searchValue = value
      this.getUserList()
    },
    handleRefresh () {
      this.getUserList({
        page: this.currentPage - 1,
        size: this.pageSize
      })
    },
    deleteUser (id) {
      /**
       * 删除用户
       */
      this.$confirm('删除用户后不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delUserId = id
        api.deleteObjectById(USER_API_URL.deleteUserById, this.delUserId)
          .then(async () => {
            this.$message.success('删除用户成功')
            await this.getUserList()
          })
          .catch(async error => {
            if (error.response) {
              await this.$message.error(error.response.data.message)
            }
          })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    handleEditPassword (row) {
      /**
       * 修改用户密码
       */
      this.editPasswordDlgVisible = true
      this.editUserInfo = row
    },
    closeEditPasswordDlg () {
      /**
       * 关闭编辑信息dlg
       */
      this.editUserInfo = {}
      this.editPasswordForm.password = ''
      this.editPasswordForm.confirmPassword = ''
      this.editPasswordDlgVisible = false
    },
    editPassword () {
      /**
       * 确定修改信息
       */

      const userId = this.editUserInfo.id
      const password = this.editPasswordForm.password
      const confirmPassword = this.editPasswordForm.confirmPassword

      if (password !== confirmPassword) {
        return this.$message.error('两次输入的密码不一致，请重试')
      }

      api.putObjectById(USER_API_URL.updatePasswordWithAdminById, userId, {
        password
      })
        .then(result => {
          const { status } = result
          if (status !== 200) return this.$message.error('修改用户密码失败，请稍后再试')
          this.$message.success('修改用户密码成功')
          this.closeEditPasswordDlg()
        }).catch(error => {
          if (error.response) {
            this.$message.error(error.response.data.message)
          }
        })
    },
    handleEditName (row) {
      /**
       * 修改用户姓名
       */
      this.userInfo = row
      this.editNameDlgVisible = true
    },
    closeEditNameDlg () {
      this.editNameDlgVisible = false
      this.userInfo = {}
      this.editNameInput = ''
    },
    editName () {
      /**
       * 确认修改信息
       */
      if (this.editNameInput === '') return this.$message.error('用户姓名不能为空！')

      api.putObjectById(USER_API_URL.updateUserById, this.userInfo.id, {
        name: this.editNameInput,
        username: this.userInfo.username,
        email: this.userInfo.email
      })
        .then(async result => {
          const { status } = result
          if (status !== 200) return this.$message.error('修改用户姓名失败，请稍后再试')
          this.$message.success('修改用户姓名成功')
          this.closeEditNameDlg()
          await this.getUserList()
        }).catch(error => {
          if (error.response) {
            this.$message.error(error.response.data.message)
          }
        })
    },
    handleEditEmail (row) {
      /**
       * 打开修改邮箱对话框
       */
      this.userInfo = row
      this.editEmailDlgVisible = true
    },
    closeEditEmailDlg () {
      /**
       * 关闭修改邮箱对话框
       */
      this.editEmailDlgVisible = false
      this.userInfo = {}
      this.editEmailInput = ''
    },
    editEmail () {
      /**
       * 确认修改邮箱
       */
      const email = this.editEmailInput.trim()
      if (email === '') return this.$message.error('绑定邮箱不能为空！')
      if (!config.emailReg.test(email)) return this.$message.error('请填写合法的绑定邮箱')

      api.putObjectById(USER_API_URL.updateUserById, this.userInfo.id, {
        username: this.userInfo.username,
        name: this.userInfo.name,
        email
      })
        .then(async result => {
          const { status } = result
          if (status !== 200) return this.$message.error('修改绑定邮箱失败，请稍后再试')
          this.$message.success('修改绑定邮箱成功')
          this.closeEditEmailDlg()
          await this.getUserList()
        }).catch(error => {
          console.log(error.response)

          if (error.response) {
            this.$message.error(error.response.data.message.name + error.response.data.message.username)
          }
        })
    },
    handleRecordListDlg (row) {
      this.recordTable.name = row.name
      this.recordTable.data = JSON.parse(JSON.stringify(row.options)).reverse()
      this.recordTable.visible = true
    },
    handleRecordListDlgClose () {
      this.recordTable.visible = false
    },
    exportOptions2excel () {
      /**
       * 导出操作记录到 excel
       */
      if (this.recordTable.data.length < 1) return this.$message.error('该员工没有可导出的操作记录')
      const filename = `员工-${this.recordTable.name}的操作记录表`
      const tableHeaders = tableConfig.recodeTableHeaders
      const tableData = JSON.parse(JSON.stringify(this.recordTable.data))
      tableData.forEach(item => {
        item.id = 'id' + item.id.toString()
        item.optionDate = this.formatDate(item.optionDate)
      })
      table2excel(tableHeaders, tableData, filename)
    },
    formatOptionType (type) {
      const types = {
        入馆: 'success',
        移动: '',
        外借: 'info',
        归还: 'info',
        修复: 'warning',
        修复完成: 'warning',
        离馆: 'danger',
        盘点: ''
      }
      return types[type]
    },
    formatDate (date) {
      return utils.formatDate(date)
    },
    formatTableDate (row, column) {
      return utils.formatTableDate(row, column)
    },
    getRoleList () {
      /**
       * 获得角色列表
       */
      api.getObject(ROLE_API_URL.getRoleList)
        .then(result => {
          const { data, status } = result
          if (status !== 200) return this.$message.error('获取失败，请稍后再试')
          this.assignInfo.roleList = data
        })
        .catch(async error => {
          if (error.response) {
            await this.$message.error(error.response.data.message)
          }
        })
    },
    handleAssignShow (row) {
      /**
       * 打开分配角色对话框
       */
      this.getRoleList()
      this.assignInfo.visible = true
      this.assignInfo.userId = row.id
    },
    handleAssignCancel () {
      /**
       * 取消分配角色
       */
      this.assignInfo.visible = false
      this.assignInfo.roleId = ''
      this.assignInfo.userId = ''
    },
    handleAssignSubmit () {
      /**
       * 确定分配角色
       */
      api.putObjectById(USER_API_URL.updateUserRoleById.replace(/roleId/, this.assignInfo.roleId), this.assignInfo.userId)
        .then(result => {
          const { status } = result
          if (status !== 200) return this.$message.error('分配失败，请稍后再试')
          this.$message.success('分配成功')
          this.handleAssignCancel()
          this.getUserList({
            page: this.currentPage - 1,
            size: this.pageSize
          })
        })
        .catch(async error => {
          if (error.response) {
            await this.$message.error(error.response.data.message)
          }
        })
    }

  },
  computed: {
    isCanInsertUser () {
      /**
       * 判断是否拥有 新增用户（5101） 的权限
       */
      return !!this.$store.getters.getUserRole.includes(5101)
    },
    isCanEditName () {
      /**
       * 判断是否拥有 修改姓名（5102） 的权限
       */
      return !!this.$store.getters.getUserRole.includes(5102)
    },
    isCanEditPassword () {
      /**
       * 判断是否拥有 新增用户（5103） 的权限
       */
      return !!this.$store.getters.getUserRole.includes(5103)
    },
    isCanAssignRole () {
      /**
       * 判断是否拥有 分配权限（5104） 的权限
       */
      return !!this.$store.getters.getUserRole.includes(5104)
    },
    isCanSeeRecord () {
      /**
       * 判断是否拥有 查看操作记录（5105） 的权限
       */
      return !!this.$store.getters.getUserRole.includes(5105)
    },
    isCanExportExcel () {
      /**
       * 判断是否拥有 导出excel（导出全部需要向后端发请求）（5106） 的权限
       */
      return !!this.$store.getters.getUserRole.includes(5106)
    },
    isCanEditEmail () {
      /**
       * 判断是否拥有 修改用户邮箱（5107） 的权限
       */
      return !!this.$store.getters.getUserRole.includes(5107)
    }
  }
}
</script>

<style lang="less" scoped>
  .user-list-wrapper {
    .pagination {
      margin-top: 15px;
    }
  }
</style>
