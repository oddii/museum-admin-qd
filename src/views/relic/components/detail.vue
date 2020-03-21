<template>
    <div class="detail-wrapper">
      <el-card class="detail-container">
        <header class="detail-header">
          <el-button size="small" @click="toBack">返回</el-button>
        </header>
        <div class="detail-body clearfix">
          <!--左侧图片轮播组件-->
          <div class="body-left">
            <image-carousel />
          </div>
          <!--中间文物信息组件-->
          <div class="body-center">
            <relic-info />
          </div>
          <!--右侧操作记录组件-->
          <div class="body-right">
            <operation-record/>
          </div>
        </div>
      </el-card>
    </div>
</template>

<script>
import ImageCarousel from '../../../components/ImageCarousel/index'
import RelicInfo from '../../../components/RelicInfo/index'
import OperationRecord from '../../../components/OperationRecord/index'
export default {
  name: 'detail',
  components: { OperationRecord, RelicInfo, ImageCarousel },
  created () {
  },
  data () {
    return {}
  },
  methods: {
    toBack () {
      this.$router.push('/relic/list')
    }
  }
}
</script>

<style lang="less" scoped>
.detail-wrapper{
  min-height: 100%;
  .detail-container{

    .detail-body{
      margin: 15px 0;

      .body-left,
      .body-center{
        float: left;
        width: 33%;
      }

      .body-left{
        width: 35%;
      }

      .body-right{
        float: right;
        width: 30%;
        height: 100%;
        overflow: hidden;
      }
    }
  }
}
</style>
