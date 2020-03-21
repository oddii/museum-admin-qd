<template>
  <div class="m-form-wrapper">
    <!--logo区域-->
    <div class="logo-container">
      <img src="../../../assets/login_images/logo.png" alt="">
    </div>
    <!--表单区域-->
    <div class="form-container">
      <!--用户名区域-->
      <div class="form-item">
        <input type="text" placeholder="Username" v-model="username"/>
        <i class="el-icon-s-custom item-icon"/>
      </div>
      <!--用户密码区域-->
      <div class="form-item">
        <input type="password" placeholder="Password" v-model="password"/>
        <i class="el-icon-s-goods item-icon"/>
      </div>
      <!--提交按钮区域-->
      <div class="form-btn-wrapper">
          <div class="btn-login" @click="login">
            <i class="iconfont">&#xe600;</i>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../../api/userApi'
// import service from '../../../utils/service'
export default {
  name: 'MLoginForm',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async login () {
      /**
       * 登录
       */
      const username = this.username.trim()
      const password = this.password.trim()
      if (!username) return this.$message.error('请输入用户名')
      else if (!password) return this.$message.error('请输入用户密码')

      // this.$router.push('/permission')

      api.login({
        username,
        password
      }).then(async result => {
        const { status, headers } = result
        console.log(status)
        //  todo 做错误判断
        window.sessionStorage.setItem('token', headers.authorization)
        await this.$router.push('/permission')
      }).catch(error => {
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
    }
  }
}
</script>

<style lang="less" scoped>
.m-form-wrapper{
  width: 330px;
  height: 210px;

  .logo-container{
    height: 95px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .form-container{
    position: relative;
    height: 98px;
    padding: 9px;
    margin: 0 10px 0  5px;
    border-radius: 10px;
    background: white;
    box-shadow: 2px 2px 10px 2px rgba(0,0,0,.2);

    .form-item{
      border-radius: 5px;
      position: relative;

      input[type="text"]{
        margin-bottom: 9px;
      }

      input{
        font-size: 14px;
        font-weight: 400;
        text-shadow: 0 1px 0 rgba(255,255,255,0.8);
        width: 100%;
        padding: 10px 18px 10px 38px;
        border: none;
        box-shadow: inset 0 0 5px rgba(0,0,0,0.1), inset 0 3px 2px rgba(0,0,0,0.1);
        border-radius: 3px;
        background: #f9f9f9;
        color: #777;
      }

      .item-icon{
        position: absolute;
        left: 10px;
        top: 8px;
        font-size: 20px;
        color: #777777;
      }
    }

    .form-btn-wrapper{
      position: absolute;
      width: 63px;
      height: 63px;
      top: 19px;
      right: -25px;
      padding: 10px;
      z-index: 2;
      background: #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 2px rgba(0,0,0,0.1),
      0 3px 2px rgba(0,0,0,0.1), inset 0 -3px 2px rgba(0,0,0,0.2);

      .btn-login{
        width: 100%;
        height: 100%;
        margin-top: -1px;
        font-size: 1.4em;
        line-height: 1.75;
        color: white;
        border: none;
        border-radius: inherit;
        background: linear-gradient(#52cfeb, #42A2BC);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.3),
        0 1px 2px rgba(0,0,0,0.35), inset 0 3px 2px rgba(255,255,255,0.2), inset 0 -3px 2px rgba(0,0,0,0.1);
        cursor: pointer;

        &:hover{
          background: #52cfeb;
        }

        i{
          font-size: 25px;
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
