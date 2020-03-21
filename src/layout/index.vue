<template>
  <div class="layout-wrapper">
    <el-container>
      <!--侧边栏区域-->
      <el-aside width="210px">
        <el-menu :default-active="$route.path" :router="true" :collapse-transition="false"
                :collapse="isCollapse" background-color="#304156" text-color="#BFCBD9" id="driver-aside">
          <fragment v-for="item in asideBarList" :key="item.path">
            <el-menu-item v-if="!item.alwaysShow" :index="item.path" @click="tagAdd(item.meta.title,item.path)">
              <i :class="item.meta.icon"/>
              <span slot="title">{{item.meta.title}}</span>
            </el-menu-item>

            <el-submenu v-else :index="item.path">
              <template slot="title">
                <i :class="item.meta.icon"/>
                <span slot="title">{{item.meta.title}}</span>
              </template>
              <!--子级菜单-->
              <div v-for="children in item.children" :key="children.path">
                <el-menu-item  v-if="!children.hidden" :index="children.path" @click="tagAdd(children.meta.title,children.path)" >
                  <i :class="children.meta.icon"/>
                  <span slot="title">{{children.meta.title}}</span>
                </el-menu-item>
              </div>

            </el-submenu>
          </fragment>
        </el-menu>
      </el-aside>

      <el-container>
        <!--头部区域-->
        <el-header height="90px">
          <header-bar/>
          <tag-bar/>
        </el-header>

        <!--主区域-->
        <el-main style="background-color: #f7f8f97a;">
          <transition :name="transitionName">
            <router-view/>
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import TagBar from '../components/TagBar/index'
import HeaderBar from '../components/HeaderBar/index'
export default {
  name: 'Layout',
  components: { HeaderBar, TagBar },
  created () {
    // console.log(this.asideBarList)
    this.$bus.$on('fold', () => {
      const asideBar = document.querySelector('.el-aside')
      asideBar.style.width = 'auto'
      this.isCollapse = true
    })
    this.$bus.$on('unfold', () => {
      const asideBar = document.querySelector('.el-aside')
      asideBar.style.width = 210 + 'px'
      this.isCollapse = false
    })
  },
  data () {
    return {
      isCollapse: false,
      asideBarList: this.$router.options.routes[2].children,
      transitionName: ''
    }
  },
  methods: {
    tagAdd (title, path) {
      /**
       * 向TagBar传递值
       */
      this.$bus.$emit('tag-add', title, path)
    }
  },
  watch: {
    /**
     * watch $route 决定使用哪种过渡
     * @param to
     * @param from
     */
    '$route' (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    }
  }
}
</script>

<style lang="less">
.layout-wrapper{
  height: 100%;

  .el-container{
    height: 100%;
  }
}
</style>
