<template>
  <div class="m-form-wrapper">
    <!--logo区域-->
    <div class="logo-container">
      <img src="../../../assets/login_images/logo.png" alt />
    </div>
    <!--表单区域-->
    <div class="form-container">
      <!--用户名区域-->
      <div class="form-item">
        <input type="text" placeholder="Username" v-model="username" @keyup.enter="login" />
        <i class="el-icon-s-custom item-icon" />
      </div>
      <!--用户密码区域-->
      <div class="form-item">
        <input type="password" placeholder="Password" v-model="password" @keyup.enter="login" />
        <i class="el-icon-s-goods item-icon" />
      </div>
      <!--提交按钮区域-->
      <div class="form-btn-wrapper">
        <div class="btn-login" @click="login">
          <i class="iconfont">&#xe600;</i>
        </div>
      </div>
    </div>

    <!-- 忘记密码 -->
    <div class="forget-wrapper" @click="handleForgetDlgShow">
      <span>忘记密码？</span>
    </div>

    <!-- 忘记密码对话框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="forgetForm.visible"
      width="23%"
      :before-close="handleForgetDlgClose"
    >
      <el-form
        :model="forgetForm"
        label-width="110px"
        label-position="left"
        :rules="forgetForm.rules"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        ref="forgetFormRef"
      >
        <el-form-item label="用户名：" prop="username" style="margin-bottom: 18px;">
          <el-input v-model="forgetForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="绑定邮箱：" prop="email" style="margin-bottom: 18px;">
          <el-input v-model="forgetForm.email" type="email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱验证码：" prop="code" style="margin-bottom: 18px;">
          <el-input v-model="forgetForm.code" autocomplete="off">
            <el-button slot="append" :disabled="forgetForm.sending" @click="getEmailCode">{{forgetForm.text}}</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="password" style="margin-bottom: 18px;">
          <el-input v-model="forgetForm.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="confirmPassword">
          <el-input v-model="forgetForm.confirmPassword" type="password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleForgetDlgClose">取 消</el-button>
        <el-button type="primary" @click="handleForgetDlgConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../../api/baseApi'
import USER_API_URL from '../../../api/userApiUrl'
import menu from '../../../utils/menu'
import config from '../../../utils/config'

export default {
  name: 'MLoginForm',
  data () {
    return {
      loadingOptions: {
        fullscreen: true,
        text: '正在发送中，请耐心等待...'
      },
      username: '',
      password: '',
      forgetForm: {
        visible: false,
        text: '发送验证码',
        sending: false,
        passTime: 0,
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        code: '',
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入新密码', trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: '请输入确认密码', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入绑定邮箱', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入邮箱验证码', trigger: 'blur' }
          ]
        }
      }
    }
  },
  methods: {
    login () {
      /**
       * 登录
       */
      const username = this.username.trim()
      const password = this.password.trim()
      if (!username) {
        return this.$message.error('请输入用户名')
      } else if (!password) return this.$message.error('请输入用户密码')

      api
        .postObject(USER_API_URL.login, {
          username,
          password
        })
        .then(result => {
          const { headers, data } = result

          window.sessionStorage.setItem('token', headers.authorization)
          window.sessionStorage.setItem('m-id', data.id)
          window.sessionStorage.setItem('m-role', data.role.id)

          this.$store.commit('setUserId', data.id)
          this.$store.commit('setName', data.name)
          this.$store.commit('setUserRoleName', data.role.name)

          const permissions = data.role.permissions
          const roleList = []
          permissions.forEach(item => {
            roleList.push(item.code)
          })
          roleList.push(10000)
          this.$store.commit('setUserRole', roleList)

          this.getMenu()
          this.$router.push('/home')
        })
        .catch(error => {
          if (error.response) {
            const status = error.response.status
            if (status === 401) {
              return this.$message.error('用户名或密码输入错误，请重试')
            } else if (status === 500) {
              return this.$message.error('服务器出现错误，请稍后再试')
            }
          } else {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    getMenu () {
      /**
       * 根据权限获得路由菜单
       */
      // console.log(this.$store.getters.getMenu)
      const arr = JSON.parse(JSON.stringify(menu)).filter(item => {
        if (item.children) {
          item.children = item.children.filter(children => {
            return this.$store.getters.getUserRole.includes(children.meta.code)
          })
        }
        return this.$store.getters.getUserRole.includes(item.meta.code)
      })
      this.$store.commit('setMenu', arr)
      // console.log(this.$store.getters.getMenu)
    },
    getEmailCode () {
      /**
       * 获得邮箱验证码
       */
      const username = this.forgetForm.username.trim()
      const email = this.forgetForm.email.trim()
      if (email === '') return this.$message.error('请先填写绑定邮箱')
      if (username === '') return this.$message.error('请先填写用户名')

      if (!config.emailReg.test(email)) return this.$message.error('请填写合法的邮箱')

      const loadingInstance = this.$loading(this.loadingOptions)
      api.postObject(USER_API_URL.sendEmailCode, {
        username,
        email
      })
        .then(result => {
          const { status } = result
          if (status !== 200) return this.$message.error('发送失败，请稍后再试')
          this.$message.success('发送成功')
          this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close()
            this.setEmailCodeTimer()
          })
        })
        .catch(error => {
          this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close()
          })
          return this.$message.error(error.response.data.message)
        })
    },
    setEmailCodeTimer () {
      /**
       * 设置倒计时
       */
      let timeCount = 0
      this.forgetForm.sending = true
      const timer = setInterval(() => {
        this.forgetForm.text = ++timeCount
        if (timeCount === 60) {
          this.forgetForm.text = '发送验证码'
          this.forgetForm.sending = false
          clearInterval(timer)
        }
      }, 1000)
    },
    handleForgetDlgShow () {
      /**
       * 打开忘记密码对话框
       */
      this.forgetForm.visible = true
    },
    handleForgetDlgClose () {
      /**
       * 关闭忘记密码对话框
       */
      this.forgetForm.visible = false
      this.forgetForm.text = '发送验证码'
      this.forgetForm.username = ''
      this.forgetForm.password = ''
      this.forgetForm.confirmPassword = ''
      this.forgetForm.email = ''
      this.forgetForm.code = ''
    },
    handleForgetDlgConfirm () {
      /**
       * 修改密码
       */
      this.$refs.forgetFormRef.validate(valid => {
        if (valid) {
          const username = this.forgetForm.username.trim()
          const password = this.forgetForm.password.trim()
          const email = this.forgetForm.email.trim()
          const code = this.forgetForm.code.trim()
          const confirmPassword = this.forgetForm.confirmPassword.trim()

          if (password !== confirmPassword) { return this.$message.error('两次密码输入不一致，请重新输入') }

          api.postObject(USER_API_URL.forgetPassword, {
            username,
            password,
            email,
            code
          })
            .then(result => {
              const { status } = result
              if (status !== 200) return this.$message.error('修改失败，请稍后再试')
              this.handleForgetDlgClose()
              return this.$message.success('修改成功')
            })
            .catch(async error => {
              if (error.response) {
                await this.$message.error(error.response.data.message)
              }
            })
        } else {
          return this.$message.error('请输入要填写的内容')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.m-form-wrapper {
  width: 330px;
  height: 210px;

  .logo-container {
    height: 95px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .form-container {
    position: relative;
    height: 98px;
    padding: 9px;
    margin: 0 10px 0 5px;
    border-radius: 10px;
    background: white;
    box-shadow: 2px 2px 10px 2px rgba(0, 0, 0, 0.2);

    .form-item {
      border-radius: 5px;
      position: relative;

      input[type="text"] {
        margin-bottom: 9px;
      }

      input {
        font-size: 14px;
        font-weight: 400;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
        width: 100%;
        padding: 10px 18px 10px 38px;
        border: none;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1),
          inset 0 3px 2px rgba(0, 0, 0, 0.1);
        border-radius: 3px;
        background: #f9f9f9;
        color: #777;
      }

      .item-icon {
        position: absolute;
        left: 10px;
        top: 8px;
        font-size: 20px;
        color: #777777;
      }
    }

    .form-btn-wrapper {
      position: absolute;
      width: 63px;
      height: 63px;
      top: 19px;
      right: -25px;
      padding: 10px;
      z-index: 2;
      background: #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.1), 0 3px 2px rgba(0, 0, 0, 0.1),
        inset 0 -3px 2px rgba(0, 0, 0, 0.2);

      .btn-login {
        width: 100%;
        height: 100%;
        margin-top: -1px;
        font-size: 1.4em;
        line-height: 1.75;
        color: white;
        border: none;
        border-radius: inherit;
        background: linear-gradient(#52cfeb, #42a2bc);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3),
          0 1px 2px rgba(0, 0, 0, 0.35),
          inset 0 3px 2px rgba(255, 255, 255, 0.2),
          inset 0 -3px 2px rgba(0, 0, 0, 0.1);
        cursor: pointer;

        &:hover {
          background: #52cfeb;
        }

        i {
          font-size: 25px;
          margin-left: 8px;
        }
      }
    }
  }

  .forget-wrapper {
    margin-top: 10px;
    text-align: right;
    color: #fff;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
