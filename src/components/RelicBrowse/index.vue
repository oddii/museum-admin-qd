<template>
  <div class="relic-browse-wrapper">
    <div class="container clearfix">

        <div class="img-wrapper">
          <div class="img-title">文物预览图</div>
          <img :src="imageUrl" alt=""/>
        </div>

        <div class="img-wrapper">
          <div class="img-title">文物二维码</div>
<!--          <img src="../../assets/code.png" alt=""/>-->
          <div :id="`code`+id" class="code-content">

          </div>
        </div>

        <div class="timeline-wrapper" v-if="useTimeLine">
          <div class="timeline-title">最近三次操作记录</div>
          <el-timeline>
            <el-timeline-item v-for="(item,index) in options" :key="index"
              :timestamp="item.optionDate" placement="top">
               {{item.details}}
            </el-timeline-item>
          </el-timeline>
        </div>

      <div class="wait-info-wrapper" v-if="useWait">
        <div class="receiveDate-title">录入时间</div>
        <div>2018-12-12</div>
      </div>

      <div class="btn-wrapper">
        <el-button size="small" style="margin-right: 10px"
                   @click="toSeeBig(imageUrl)" icon="el-icon-picture-outline" >浏览大图</el-button>
        <span v-if="useOperate">
        <el-button type="warning" size="small"
                   @click="toDetail(id)" icon="el-icon-document" >查看详情</el-button>

        <el-button type="primary" size="small"
                   @click="toEdit(index,row)" icon="el-icon-edit" v-if="editing === false" >编辑信息</el-button>
        <el-button type="info" size="small"
                   @click="toCancel(index,row)" icon="el-icon-close"  v-if="editing === true">取消编辑</el-button>
        <el-button type="success" size="small"
                   @click="toSubmit(index,row)" icon="el-icon-check" v-if="editing === true">提交编辑</el-button>
        </span>
      </div>
    </div>

  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import utils from '../../utils/utils'
import config from '../../utils/config'
export default {
  name: 'relic-browse',
  props: ['id', 'index', 'row', 'imageUrl', 'options', 'useTimeLine', 'useOperate', 'useWait'],
  created () {
    this.$bus.$on('rowEditing', () => {
      this.editing = true
    })

    this.$bus.$on('rowEdited', () => {
      this.editing = false
    })
  },
  mounted () {
    this.qrcode(this.id)
  },
  data () {
    return {
      editing: false
    }
  },
  methods: {
    toEdit (index, row) {
      this.editing = true
      this.$bus.$emit('relicTableEdit', index, row)
    },
    toCancel (index, row) {

    },
    toSubmit (index, row) {
      this.editing = false
      this.$bus.$emit('relicTableSubmit', index, row)
    },
    toSeeBig (url) {
      /**
       * 浏览大图
       */

    },
    toDetail (id) {
      /**
       * 去相应的详情页面
       */
      this.$router.push({ path: `/relic/detail/${id}` })
    },
    formatDate (value) {
      return utils.formatDate(value)
    },
    qrcode (id) {
      /**
       * 根据ID和key生成二维码
       */
      return new QRCode(`code${id}`, {
        width: 198,
        height: 198,
        text: `${id}${config.codeKey}`, // 二维码地址
        colorDark: '#000',
        colorLight: '#fff'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.relic-browse-wrapper{
  .container{

    .img-wrapper{
      float: left;
      width: 228px;
      height: 228px;
      margin-right: 20px;
      text-align: center;

      .img-title{
        font-size: 17px;
        margin-bottom: 15px;
      }

      img{
        width: 200px;
        height: 200px;
      }

      .code-content{
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .timeline-wrapper{
      float: left;

      .timeline-title{
        font-size: 17px;
        margin-bottom: 20px;
        text-indent: 30px;
      }
    }

    .wait-info-wrapper{
      float: left;
      width: 228px;
      height: 228px;
      margin-right: 20px;
      text-align: center;

      .receiveDate-title{
        font-size: 17px;
        margin-bottom: 15px;
      }
      div{
        font-size: 16px;
      }
    }

    .btn-wrapper{
      float: right;
      margin-top: 90px;
    }
  }
}
</style>
