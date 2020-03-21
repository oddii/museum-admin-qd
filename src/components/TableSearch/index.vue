<template>
  <div class="table-search-wrapper">
    <span class="search-input">
      <el-input style="width: 250px" size="small" v-model="inputValue">
        <el-button slot="append" icon="el-icon-search"/>
      </el-input>
    </span>

    <span class="select-date" v-if="useDate">
      <span class="select-title">选择时间：</span>
      <el-date-picker v-model="pickerValue" type="datetimerange" :picker-options="pickerOptions" size="small"
        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
      </el-date-picker>
    </span>

    <span class="search-add" v-if="useAdd">
      <el-button size="small" type="primary" icon="el-icon-plus" @click="addUserDlgVisible = true">新增用户</el-button>
    </span>

    <span class="search-operate" v-if="useOperate">
       <el-button type="primary" size="small"
                  @click="toEdit" icon="el-icon-edit" v-if="editing === false" >一键编辑</el-button>
        <el-button type="info" size="small"
                   @click="toCancel" icon="el-icon-close"  v-if="editing === true">一键取消</el-button>
        <el-button type="success" size="small"
                   @click="toSubmit" icon="el-icon-check" v-if="editing === true">一键提交</el-button>
    </span>

    <el-dialog title="新增用户" :visible.sync="addUserDlgVisible" width="30%" :before-close="handleAddUserDlgClose">
      <div class="add-wrapper">
        <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="150px">
          <el-form-item label="用户名（登陆用）：" prop="username">
            <el-input v-model="addUserForm.username"/>
          </el-form-item>
          <el-form-item label="用户姓名：" prop="name">
            <el-input v-model="addUserForm.name"/>
          </el-form-item>
          <el-form-item label="用户密码：" prop="password">
            <el-input type="password" v-model="addUserForm.password"/>
          </el-form-item>
          <el-form-item label="确认密码：" prop="confirmPassword">
            <el-input type="password" v-model="addUserForm.confirmPassword"/>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddUserDlgClose">取消</el-button>
        <el-button type="primary" @click="handleAddUser">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../api/userApi'
export default {
  name: 'table-search',
  props: ['useDate', 'useAdd', 'useOperate'],
  data () {
    return {
      editing: false,
      inputValue: '',
      pickerValue: '',
      pickerOptions: {
        /**
         * 当前时间日期选择器特有的选项参考下表
         */
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      addUserDlgVisible: false,
      addUserForm: {
        username: '',
        name: '',
        password: '',
        confirmPassword: ''
      },
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入要修改的用户密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    toEdit () {
      /**
       * 一键编辑事件
       * @type {boolean}
       */
      this.editing = true
      this.$bus.$emit('relicTableAllEdit')
      this.$bus.$emit('rowEditing')
    },
    toCancel () {
      /**
       * 一键取消事件
       * @type {boolean}
       */
      this.editing = false
    },
    toSubmit () {
      /**
       * 一键提交事件
       * @type {boolean}
       */
      this.editing = false
      this.$bus.$emit('relicTableAllSubmit')
      this.$bus.$emit('rowEdited')
    },
    handleAddUserDlgClose () {
      /**
       * 关闭添加用户的对话框
       */
      this.addUserForm.username = ''
      this.addUserForm.name = ''
      this.addUserForm.password = ''
      this.addUserForm.confirmPassword = ''
      this.addUserDlgVisible = false
    },
    handleAddUser () {
      /**
       * 添加用户
       */

      const username = this.addUserForm.username
      const password = this.addUserForm.password
      const confirmPassword = this.addUserForm.confirmPassword
      const name = this.addUserForm.name

      if (password !== confirmPassword) {
        return this.$message.error('两次密码输入不一致，请重新输入')
      }

      api.addUser({
        name,
        username,
        password
      })
        .then(async result => {
          this.$bus.$emit('refreshList')
          await this.handleAddUserDlgClose()
        })
        .catch(async error => {
          if (error.response) {
            await this.$message.error(error.response.data.message)
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
  .table-search-wrapper {
    display: flex;
    align-items: center;
    position: relative;

    .search-input {
      margin-right: 50px;
    }

    .select-title{
      font-size: 14px;
      font-weight: 700;
      color: #777;
    }

    .search-operate{
      position: absolute;
      right: 0;
      top: 1px;
    }
  }
</style>
