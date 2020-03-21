<template>
  <div class="tag-bar-container" id="driver-tagbar">
      <el-tag size="medium" v-for="(item,index) in tagList" :key="index" @close="closeTag(item.path)"
              :closable="item.closeable"  @click="tagHandle(item.path,index)" ref="tagsRef" class="tag-bar">
      {{item.title}}
    </el-tag>
  </div>
</template>

<script>
export default {
  name: 'tag-bar',
  created () {
    this.$bus.$on('tag-add', (title, path) => {
      this.tagAdd(title, path)
    })

    this.tagAdd(this.$route.meta.title, this.$route.path)
  },
  data () {
    return {
      tagList: [
        { title: '首页', path: '/index', closeable: false }
      ]
    }
  },
  methods: {
    tagAdd (title, path) {
      /**
       * 增加tag标签
       * @type {{path: *, title: *}}
       */
      //  如果是已经存在了的tag栏，则不新增，转为切换
      let activeIndex = 0
      const newTag = this.tagList.some((item, index) => {
        activeIndex = index
        return item.path === path
      })
      if (newTag) {
        return setTimeout(() => {
          this.tagHandle(path, activeIndex)
        }, 0)
      }

      //  如果是不存在的tag栏，转为新增
      const tag = { title: title, path: path, closeable: true }
      this.tagList.push(tag)
      setTimeout(() => {
        this.tagHandle(path, this.tagList.length - 1)
      }, 0)
    },
    closeTag (path) {
      /**
       * 关闭标签
       */

      const closeIndex = this.tagList.findIndex(item => {
        return item.path === path
      })

      this.tagList.splice(closeIndex, 1)
      this.tagHandle(this.tagList[closeIndex - 1].path, closeIndex - 1)
    },
    tagHandle (path, index) {
      /**
       * 标签点击事件
       */
      const tagBars = document.querySelectorAll('.tag-bar')
      tagBars.forEach(item => {
        item.classList.remove('tag-active')
      })
      tagBars[index].classList.add('tag-active')
      this.$router.push(path)
    }
  },
  watch: {
    /**
     * 监听路由变化
     * @param to
     * @param from
     */
    '$route' (to, from) {
      this.tagAdd(to.meta.title, to.path)
    }
  }
}
</script>

<style lang="less" scoped>
.tag-bar-container{
    height: 40px;
    width: 100%;
    padding: 7px 0 7px 15px;
    box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);
    white-space: nowrap;

  .for-container{
      display: inline-block;

  }
  .el-tag{
    margin-right: 5px;
    cursor: pointer;
    background: #ffffff;
  }

  .tag-active{
    background: #ecf5ff;
  }
}
</style>
