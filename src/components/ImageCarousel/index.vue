<template>
  <div class="image-carousel-wrapper">
    <div class="image-carousel-container">
      <div class="btn-wrapper">
        <el-button icon="el-icon-plus" plain type="primary" size="small">增加图片</el-button>
        <el-button icon="el-icon-minus" plain type="danger" size="small">删除图片</el-button>
        <el-button icon="el-icon-search" size="small" style="float: right;margin-right: 40px"
                   @click="seeBigImg">浏览大图</el-button>
      </div>
      <div class="img-wrapper">
        <img :src="imgList[ref.activeIndex]" alt="">
      </div>
      <div class="carousel-wrapper">
        <el-carousel type="card" height="200px" :autoplay="false" trigger="click" ref="carouselRef" >
          <el-carousel-item v-for="(item,index) in imgList" :key="index" class="carousel-item">
            <img :src="item" alt="" >
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <el-dialog title="浏览大图" :visible.sync="dialogVisible" width="70%" top="1vh">
      <div class="img-big-wrapper">
        <img :src="imgList[ref.activeIndex]" alt="">
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'image-carousel',
  mounted () {
    this.ref = this.$refs.carouselRef
  },
  data () {
    return {
      dialogVisible: false,
      ref: {},
      imgList: [
        require('../../assets/relic1.png'),
        require('../../assets/relic2.png'),
        require('../../assets/relic3.png'),
        require('../../assets/relic4.png'),
        require('../../assets/relic5.png')
      ]
    }
  },
  methods: {
    seeBigImg () {
      /**
       * 浏览大图
       */
      this.dialogVisible = !this.dialogVisible
    }
  }
}
</script>

<style lang="less" scoped>
  .image-carousel-wrapper {

    .img-wrapper {
      margin-top: 15px;
      height: 700px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 83%;
      }
    }

    .carousel-wrapper {
      margin-top: 15px;

      .carousel-item{
        display: flex;
        justify-content: center;
        img{
          height: 100%;
        }
      }
    }

    .img-big-wrapper{
      height: 800px;
      display: flex;
      justify-content: center;
      img{
        height: 100%;
      }
    }
  }
</style>
