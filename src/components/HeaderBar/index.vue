<template>
  <div class="header-bar-container">
    <!--折叠按钮-->
    <div class="btn-container" @click="handleAsideBar">
      <button class="btn-fold" id="btn-fold">
        <i class="iconfont" v-if="!isFold">&#xe601;</i>
        <i class="iconfont" v-else >&#xe626;</i>
      </button>
    </div>

    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right" id="driver-breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index">
        {{item}}
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="info-container">
      <div class="info-inner">
        <div class="info-name">{{$store.getters.getName}}</div>
        <div class="info-role">{{$store.getters.getUserRoleName}}</div>
      </div>
      <div class="info-btn-container" >
      <!--全屏按钮-->
        <el-tooltip content="全屏" placement="bottom" effect="light" :enterable="false">
          <button class="btn-full" id="btn-full" @click="handleFullScreen">
            <i class="el-icon-full-screen"/>
          </button>
        </el-tooltip>

        <el-tooltip content="退出全屏" placement="bottom" effect="light" :enterable="false">
        <button class="btn-full hidden" id="btn-unFull" @click="handleUnFullScreen">
          <i class="el-icon-crop"/>
        </button>
        </el-tooltip>

        <el-tooltip :content="driverBtnToolTip" placement="bottom" effect="light" :enterable="false">
          <button class="btn-driver" id="btn-driver" @click="handleDriver">
            <i class="el-icon-s-promotion"/>
          </button>
        </el-tooltip>
      </div>

      <!--个人信息下拉框-->
      <el-dropdown  trigger="click">
        <div class="info" id="driver-info">
          <el-avatar shape="square" :src="squareUrl"/>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="handleEditPassword">修改密码</el-dropdown-item>
            <el-dropdown-item @click.native="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </div>
      </el-dropdown>
    </div>

    <el-dialog title="修改密码" :visible.sync="editDlgVisible" width="25%" :before-close="closeEditDlg">
      <div class="edit-content">
        <!--修改信息表格-->
        <el-form :model="editForm" :rules="editFormRules" label-width="100px">
          <el-form-item label="原密码：" prop="oldPassword">
            <el-input type="password" v-model="editForm.oldPassword"/>
          </el-form-item>
          <el-form-item label="新密码：" prop="newPassword">
            <el-input type="password" v-model="editForm.newPassword"/>
          </el-form-item>
          <el-form-item label="确认密码：" prop="confirmPassword">
            <el-input type="password" v-model="editForm.confirmPassword"/>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditDlg">取消</el-button>
        <el-button type="primary" @click="editPassword">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Driver from 'driver.js'
import 'driver.js/dist/driver.min.css'
import steps from '../../utils/driverStep'
import api from '../../api/baseApi'
import USER_API_URL from '../../api/userApiUrl'
import menu from '../../utils/menu'
export default {
  name: 'header-bar',
  created () {
    this.handleBreadcrumb()
  },
  mounted () {
    this.driverInit()

    window.onresize = function () {
      /**
         * 监听屏幕发生的变化
         */
      this.isFull = !this.isFull
      const btnFull = document.querySelector('#btn-full') //  全屏按钮
      const btnUnFull = document.querySelector('#btn-unFull') //  取消全屏按钮

      if (this.isFull) {
        btnFull.classList.add('hidden')
        btnUnFull.classList.remove('hidden')
      } else {
        btnUnFull.classList.add('hidden')
        btnFull.classList.remove('hidden')
      }
    }
  },
  data () {
    return {
      userInfo: {
        username: '',
        name: '',
        role: ''
      },
      driver: null,
      routes: this.$router.options.routes[2].children,
      breadcrumbList: [], //  面包屑list
      isFold: false, //  侧边栏是否为展开状态
      isFull: false, //  是否为全屏状态
      driverBtnToolTip: '引导',
      squareUrl: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80',
      editDlgVisible: false,
      editForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      editFormRules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入要修改的新密码', trigger: 'blur' },
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
    handleAsideBar () {
      /**
       * 折叠/展开侧边栏
       */
      this.isFold = !this.isFold
      if (this.isFold) this.$bus.$emit('fold')
      else this.$bus.$emit('unfold')
    },
    handleFullScreen () {
      /**
       * 全屏事件
       */
      const btnFull = document.querySelector('#btn-full') //  全屏按钮
      const btnUnFull = document.querySelector('#btn-unFull') //  取消全屏按钮
      btnFull.classList.add('hidden')
      btnUnFull.classList.remove('hidden')

      const element = document.documentElement
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.msRequestFullscreen) {
        // IE11
        element.msRequestFullscreen()
      }

      // this.isFull = !this.isFull
      // const element = document.documentElement
      //
      // if (!this.isFull) {
      //   if (document.exitFullscreen) {
      //     document.exitFullscreen()
      //   } else if (document.webkitCancelFullScreen) {
      //     document.webkitCancelFullScreen()
      //   } else if (document.mozCancelFullScreen) {
      //     document.mozCancelFullScreen()
      //   } else if (document.msExitFullscreen) {
      //     document.msExitFullscreen()
      //   }
      //   this.fullBtnToolTip = '全屏'
      // } else {
      //   if (element.requestFullscreen) {
      //     element.requestFullscreen()
      //   } else if (element.webkitRequestFullScreen) {
      //     element.webkitRequestFullScreen()
      //   } else if (element.mozRequestFullScreen) {
      //     element.mozRequestFullScreen()
      //   } else if (element.msRequestFullscreen) {
      //     // IE11
      //     element.msRequestFullscreen()
      //   }
      //   this.fullBtnToolTip = '退出全屏'
      // }
    },
    handleUnFullScreen () {
      /**
       * 退出全屏事件
       */
      const btnFull = document.querySelector('#btn-full') //  全屏按钮
      const btnUnFull = document.querySelector('#btn-unFull') //  取消全屏按钮
      btnUnFull.classList.add('hidden')
      btnFull.classList.remove('hidden')

      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    },
    handleBreadcrumb () {
      /**
       * 监听面包屑变化
       */
      this.breadcrumbList.length = 0
      this.routes.forEach(item => {
        if (this.$route.path.includes(item.path)) {
          this.breadcrumbList.push(item.meta.title)
          if (item.children) {
            item.children.forEach(children => {
              if (this.$route.path.includes(children.path)) { this.breadcrumbList.push(children.meta.title) }
            })
          }
        }
      })
    },
    handleDriver () {
      /**
       * 引导页
       */
      setTimeout(() => {
        this.driver.defineSteps(steps)
        this.driver.start()
      }, 0)
    },
    driverInit () {
      /**
       * 初始化引导组件
       * @type {module:"driver.js".Driver}
       */
      this.driver = new Driver({
        doneBtnText: '完成', // 结束按钮的文字
        stageBackground: '#ffffff', //  突出显示元素的背景颜色
        nextBtnText: '下一步', // 下一步按钮的文字
        prevBtnText: '上一步', // 上一步按钮的文字
        closeBtnText: '关闭' // 关闭按钮的文字
      })
    },
    handleEditPassword () {
      /**
       * 修改用户密码
       */
      this.editDlgVisible = true
    },
    closeEditDlg () {
      /**
       * 关闭编辑信息dlg
       */
      this.editForm.oldPassword = ''
      this.editForm.newPassword = ''
      this.editForm.confirmPassword = ''
      this.editDlgVisible = false
    },
    async editPassword () {
      /**
       * 确定修改信息
       */
      if (this.editForm.newPassword !== this.editForm.confirmPassword) {
        return this.$message.error('两次输入的密码不一致，请重试')
      }

      const userId = window.sessionStorage.getItem('m-id')
      api.putObjectById(USER_API_URL.updatePasswordById, userId, {
        oldPassword: this.editForm.oldPassword,
        newPassword: this.editForm.newPassword
      })
        .then(result => {
          const { status } = result
          if (status !== 200) return this.$message.error('修改失败，请稍后再试')
          this.$message.success('修改成功')
          this.closeEditDlg()
        }).catch(error => {
          if (error.response) {
            this.$message.error(error.response.data.message)
          }
        })
    },
    handleLogout () {
      /**
       * 退出登录
       */
      this.$confirm('您确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.sessionStorage.removeItem('m-id')
        window.sessionStorage.removeItem('m-role')
        window.sessionStorage.removeItem('token')

        this.$store.commit('setMenu', menu)
        this.$message.success('退出登录成功！')
        this.$router.push('/login')
      })
    }
  },
  watch: {
    '$route' (to, from) {
      this.handleBreadcrumb()
    }
  }
}
</script>

<style lang="less" scoped>
.header-bar-container{
  position: relative;
  height: 50px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  display: flex;
  align-items: center;

  .btn-container{
    height: 50px;
    line-height: 50px;
    padding: 0 18px;
    cursor: pointer;
    .btn-fold{
      background: white;
      color: #303133;
      i{
        font-size: 15px;
      }
    }

    &:hover{
      background: rgb(249,249,249);
    }
  }

  .el-breadcrumb{
    margin-left: 15px;
    .is-link{
      color: #777777 !important;
    }
  }

  .info-container{
    position: absolute;
    right: 15px;
    height: 100%;
    line-height: 53px;
    display: flex;

    .info-inner{
      display: flex;
      font-weight: 400;
      font-size: 15px;
      color: #606266;
      .info-name{
        margin-right: 15px;
      }
    }

    .info-btn-container{
      padding: 0 15px;
      cursor: pointer;

      .btn-full,
      .btn-driver{
        height: 100%;
        padding: 0 15px;
        background: white;
        i{
          color: #777777;
          font-size: 20px;
        }

        &:hover{
          background: rgb(249,249,249);
        }
      }
    }

    .info{
      display: flex;
      align-items: center;
      height: 50px;
      cursor: pointer;
      padding: 0 11px;

      &:hover{
        background: rgb(249,249,249);
      }
    }
  }

  .output-dlg{
    font-size: 17px;
    i{
      display: inline-block;
      margin-right: 5px;
    }
  }
}
</style>
