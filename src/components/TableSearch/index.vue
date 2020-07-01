<template>
  <div class="table-search-wrapper">
    <span class="search-input" v-if="getTableType() !== 'record'">
      <el-input
        style="width: 250px"
        size="small"
        v-model="searchValue"
        :placeholder="searchPlaceholder"
      >
        <el-button slot="append" icon="el-icon-search" @click="handleSearch" />
      </el-input>
    </span>

    <span class="search-select" v-if="tableType === 'relic'">
      <el-select v-model="dateSelectValue" clearable placeholder="请选择要筛选的日期类型" size="small">
        <el-option
          v-for="item in dateSelectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </span>

    <span class="select-date" v-if="useDate">
      <span class="select-title">选择时间：</span>
      <el-date-picker
        v-model="pickerValue"
        type="datetimerange"
        :picker-options="pickerOptions"
        size="small"
        @change="handleOnPick"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      ></el-date-picker>
    </span>

    <span class="search-add" v-if="useAddUser">
      <el-button
        size="small"
        type="primary"
        icon="el-icon-plus"
        @click="addUserDlgVisible = true"
      >新增用户</el-button>
    </span>

    <span class="search-add" v-if="useAddStore">
      <el-button
        size="small"
        type="primary"
        icon="el-icon-plus"
        @click="addStoreDlgVisible = true"
      >新增仓库</el-button>
    </span>

    <span class="search-operate" v-if="useOperate&&(isCanEditRelicInfo||isCanEditRelicValue)">
      <el-button
        type="primary"
        size="small"
        @click="toEdit"
        icon="el-icon-edit"
        v-if="editing === false"
      >一键编辑</el-button>
      <el-button
        type="info"
        size="small"
        @click="toCancel"
        icon="el-icon-close"
        v-if="editing === true"
      >一键取消</el-button>
      <el-button
        type="success"
        size="small"
        @click="toSubmit"
        icon="el-icon-check"
        v-if="editing === true"
      >一键提交</el-button>
    </span>

    <el-dialog
      title="新增用户"
      :visible.sync="addUserDlgVisible"
      width="30%"
      :before-close="handleAddUserDlgClose"
    >
      <div class="add-wrapper">
        <el-form
          :model="addUserForm"
          :rules="addUserFormRules"
          ref="addUserFormRef"
          label-width="150px"
        >
          <el-form-item label="用户名（登陆用）：" prop="username">
            <el-input v-model="addUserForm.username" />
          </el-form-item>
          <el-form-item label="用户姓名：" prop="name">
            <el-input v-model="addUserForm.name" />
          </el-form-item>
          <el-form-item label="绑定邮箱：" prop="email">
            <el-input type="email" v-model="addUserForm.email" />
          </el-form-item>
          <el-form-item label="用户密码：" prop="password">
            <el-input type="password" v-model="addUserForm.password" />
          </el-form-item>
          <el-form-item label="确认密码：" prop="confirmPassword">
            <el-input type="password" v-model="addUserForm.confirmPassword" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddUserDlgClose">取消</el-button>
        <el-button type="primary" @click="handleAddUser">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="新增仓库"
      :visible.sync="addStoreDlgVisible"
      width="30%"
      :before-close="handleAddStoreDlgClose"
    >
      <div class="add-wrapper">
        <el-form
          :model="addStoreForm"
          :rules="addStoreFormRules"
          ref="addStoreFormRef"
          label-width="150px"
        >
          <el-form-item label="仓库名称：" prop="name">
            <el-input v-model="addStoreForm.name" />
          </el-form-item>
          <el-form-item label="仓库地址：" prop="address">
            <el-input v-model="addStoreForm.address" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddStoreDlgClose">取消</el-button>
        <el-button type="primary" @click="handleAddStore">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../api/baseApi'
import USER_API_URL from '../../api/userApiUrl'
import STORE_API_URL from '../../api/storeApiUrl'
import utils from '../../utils/utils'
import config from '../../utils/config'

export default {
  name: 'table-search',
  props: ['useDate', 'useAddUser', 'useOperate', 'useAddStore', 'tableType'],
  data () {
    return {
      editing: false,
      searchValue: '',
      pickerValue: '',
      pickerOptions: {
        /**
         * 当前时间日期选择器特有的选项参考下表
         */
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      dateSelectOptions: [
        {
          value: '1',
          label: '录入日期'
        },
        {
          value: '0',
          label: '存储日期'
        }
      ], // 日期选择的类型
      dateSelectValue: '', //  日期选择的类型的值
      addUserDlgVisible: false,
      addUserForm: {
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      addUserFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入用户姓名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 16,
            message: '长度在 2 到 16 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入绑定邮箱',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入用户密码',
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          {
            required: true,
            message: '请输入确认密码',
            trigger: 'blur'
          }
        ]
      },
      addStoreDlgVisible: false,
      addStoreForm: {
        name: '',
        address: ''
      },
      addStoreFormRules: {
        name: [
          {
            required: true,
            message: '请输入仓库名称',
            trigger: 'blur'
          }
        ],
        address: [
          {
            required: true,
            message: '请输入仓库名称地址',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    getTableType () {
      return this.tableType
    },
    toEdit () {
      /**
       * 一键编辑事件
       * @type {boolean}
       */
      this.editing = true
      this.$emit('allEdit')
    },
    toCancel () {
      /**
       * 一键取消事件
       * @type {boolean}
       */
      this.editing = false
      this.$emit('allCancel')
    },
    toSubmit () {
      /**
       * 一键提交事件
       * @type {boolean}
       */
      this.editing = false
      this.$emit('allSubmit')
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
      const email = this.addUserForm.email
      const confirmPassword = this.addUserForm.confirmPassword
      const name = this.addUserForm.name

      this.$refs.addUserFormRef.validate(valid => {
        if (valid) {
          if (password !== confirmPassword) {
            return this.$message.error('两次密码输入不一致，请重新输入')
          }

          if (!config.emailReg.test(email)) {
            return this.$message.error('请填写合法的邮箱地址')
          }

          api
            .postObject(USER_API_URL.insertUser, {
              name,
              username,
              email,
              password
            })
            .then(async result => {
              const { status } = result
              if (status !== 201) { return this.$message.error('添加失败，请稍后再试') }
              this.$message.success('添加成功')
              this.$emit('refreshUserList')
              await this.handleAddUserDlgClose()
            })
            .catch(error => {
              const { data } = error.response
              return this.$message.error(data.error)
            })
        } else {
          return this.$message.error('请输入要填写的内容')
        }
      })
    },
    handleAddStoreDlgClose () {
      /**
       * 关闭添加仓库对话框
       */

      this.addStoreForm.name = ''
      this.addStoreForm.address = ''
      this.addStoreDlgVisible = false
    },
    handleAddStore () {
      /**
       * 添加仓库
       */
      const name = this.addStoreForm.name
      const address = this.addStoreForm.address

      this.$refs.addStoreFormRef.validate(valid => {
        if (valid) {
          api
            .postObject(STORE_API_URL.insertStore, {
              name,
              address
            })
            .then(async result => {
              const { status } = result
              if (status !== 201) { return this.$message.error('添加失败，请稍后再试') }
              this.$message.success('添加成功')
              this.$emit('refreshStoreList')
              await this.handleAddStoreDlgClose()
              this.handleAddStoreDlgClose()
            })
            .catch(error => {
              if (error.response) {
                const { data } = error.response
                return this.$message.error(data.message)
              }
            })
        } else {
          return this.$message.error('请输入要填写的内容')
        }
      })
    },
    handleOnPick () {
      /**
       * 日期选择事件
       */
      const startTime =
        this.pickerValue && utils.formatISODate(this.pickerValue[0])
      const endTime =
        this.pickerValue && utils.formatISODate(this.pickerValue[1])
      const dateNumber = this.dateSelectValue
      this.$emit('datePicked', startTime, endTime, dateNumber)
    },
    handleSearch () {
      /**
       * 搜索框事件
       */
      this.$emit('search', this.searchValue)
    }
  },
  computed: {
    searchPlaceholder () {
      const placeholder = {
        relic: () => {
          return '请输入要搜索的文物名称'
        },
        wait: () => {
          return '请输入要搜索的文物Id'
        },
        store: () => {
          return '请输入要搜索的仓库名称'
        },
        user: () => {
          return '请输入要搜索的成员姓名'
        }
      }
      return placeholder[this.getTableType()]()
    },
    isCanEditRelicInfo () {
      /**
       * 判断是否拥有 文物信息修改（1101） 的权限
       */
      return !!this.$store.getters.getUserRole.includes(1101)
    },
    isCanEditRelicValue () {
      /**
       * 判断是否拥有 文物价值修改（1102） 的权限
       */
      return !!this.$store.getters.getUserRole.includes(1102)
    }
  }
}
</script>

<style lang="less" scoped>
.table-search-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 15px;

  .search-input {
    margin-right: 50px;
  }

  .search-select {
    margin-right: 25px;
  }

  .select-title {
    font-size: 14px;
    font-weight: 700;
    color: #777;
  }

  .search-operate {
    position: absolute;
    right: 0;
    top: 1px;
  }
}
</style>
