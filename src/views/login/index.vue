<template>
  <div class="login-wrapper">
    <div class="login-container">
      <!--登录表单-->
      <m-login-form/>
    </div>
  </div>
</template>

<script>
import MLoginForm from './components/MLoginForm'
export default {
  name: 'Login',
  components: {
    MLoginForm
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="less">
  .el-form-item{
    margin-bottom: 12px;
  }

  .el-button{
    width: 100%;
  }

  .login-wrapper {
    position: relative;
    height: 100%;
    background: url("../../assets/login_images/bg.jpg") no-repeat center;

    .login-container {
      position: absolute;
      top: 300px;
      right: 180px;
    }
  }
</style>
