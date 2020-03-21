<template>
  <div class="user-list-wrapper">
    <el-card>
      <!--搜索表格组件-->
      <table-search :use-add="true"/>

      <!--导出表格组件-->
      <export-excel/>

      <!--一览表格-->
      <el-table :data="tableData" :highlight-current-row="true"
                :border="true" :stripe="true">
        <el-table-column label="#" type="index" align="center"/>
        <el-table-column label="工号" prop="id" width="100" align="center"/>
        <el-table-column label="用户名" prop="username" width="200" align="center"/>
        <el-table-column label="姓名" prop="name" width="100" align="center"/>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-notebook-2">操作记录</el-button>
            <el-button size="small" icon="el-icon-edit-outline" @click="handleEditUser(scope.row)">修改密码</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelUser(scope.row.id)">删除用户</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>

    </el-card>

    <el-dialog title="修改密码" :visible.sync="editDlgVisible" width="25%" :before-close="closeEditDlg">
      <div class="edit-content">
      <!--修改信息表格-->
        <el-form :model="editForm" :rules="editFormRules" label-width="100px">
          <el-form-item label="新密码：" prop="password">
            <el-input type="password" v-model="editForm.password"/>
          </el-form-item>
          <el-form-item label="确认密码：" prop="confirmPassword">
            <el-input type="password" v-model="editForm.confirmPassword"/>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditDlg">取消</el-button>
        <el-button type="primary" @click="editUser">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../../api/userApi'
import ExportExcel from '../../../components/ExportExcel/index'
import TableSearch from '../../../components/TableSearch/index'

export default {
  name: 'user-list',
  components: {
    TableSearch,
    ExportExcel
  },
  created () {
    this.getUserList()
    this.$bus.$on('refreshList', () => {
      this.getUserList()
    })
  },
  data () {
    return {
      tableData: [],
      currentPage: 0,
      pageSize: 0,
      total: 0,
      editUserInfo: '',
      editDlgVisible: false,
      editForm: {
        password: '',
        confirmPassword: ''
      },
      editFormRules: {
        password: [
          { required: true, message: '请输入要修改的用户密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      },
      delUserId: ''
    }
  },
  methods: {
    getUserList (params = {}) {
      /**
       * 获取用户列表
       */
      api.getUserList(params)
        .then(result => {
          const { data } = result
          console.log(data)
          this.tableData = data.content
          this.total = data.total
          this.pageSize = data.size
          this.currentPage = data.currentPage + 1
        })
        .catch(async error => {
          if (error.response) {
            await this.$message.error(error.response.data.message)
          }
        })
    },
    handleCurrentChange (curPage) {
      /**
       * 当前页码改变的事件
       */
      this.currentPage = curPage
      this.getUserList({
        page: curPage - 1,
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
    handleDelUser (id) {
      /**
       * 删除用户
       */
      this.$confirm('删除用户后不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delUserId = id
        api.deleteUser(this.delUserId)
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
    handleEditUser (row) {
      /**
       * 修改用户密码
       */
      this.editDlgVisible = true
      this.editUserInfo = row
    },
    closeEditDlg () {
      /**
       * 关闭编辑信息dlg
       */
      this.editUserId = ''
      this.editForm.password = ''
      this.editForm.confirmPassword = ''
      this.editDlgVisible = false
    },
    editUser () {
      /**
       * 确定修改信息
       */

      const userId = this.editUserInfo.id
      const name = this.editUserInfo.name
      const password = this.editForm.password
      const confirmPassword = this.editForm.confirmPassword

      if (password !== confirmPassword) {
        return this.$message.error('两次输入的密码不一致，请重试')
      }

      api.updateUser(userId, {
        name,
        password
      })
        .then(async () => {
          this.$message.success('修改用户密码成功')
          await this.closeEditDlg()
        }).catch(async error => {
          if (error.response) {
            await this.$message.error(error.response.data.message)
          }
        })
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
