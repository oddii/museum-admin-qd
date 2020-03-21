<template>
<div class="relic-info-wrapper">
  <div class="info-title">
    <div class="info-name">
      <div v-text="relicInfo.name" contenteditable="true"
           @blur="relicInfo.name = $event.target.innerText"
           v-if="editing === true" class="editable"/>
       <span v-if="editing === false">{{relicInfo.name | isAirspace}}</span>
    </div>
    <div class="info-era">
      <div v-text="relicInfo.dynasty" contenteditable="true"
           @blur="relicInfo.dynasty = $event.target.innerText"
           v-if="editing === true"  class="era-editable"/>
      <span v-if="editing === false">{{relicInfo.dynasty | isAirspace}}</span>
    </div>
    <div class="info-reign-title">
      <span>年号：</span><div v-text="relicInfo.year" contenteditable="true"
                                @blur="relicInfo.year = $event.target.innerText"
                                v-if="editing === true" class="editable"/>
      <span v-if="editing === false">{{relicInfo.year | isAirspace}}</span>
    </div>
  </div>
  <div class="info-container">
    <div class="info-from">
      <span>来源：</span><div v-text="relicInfo.source" contenteditable="true"
                                @blur="relicInfo.source = $event.target.innerText"
                                v-if="editing === true"  class="editable"/>
      <span v-if="editing === false">{{relicInfo.source | isAirspace}}</span>
    </div>
    <div class="info-material">
      <span>类型：</span><div v-text="relicInfo.material" contenteditable="true"
                                @blur="relicInfo.material = $event.target.innerText"
                                v-if="editing === true"  class="editable"/>
      <span v-if="editing === false">{{relicInfo.material | isAirspace}}</span>
    </div>
    <div class="info-admission-date">收储时间：{{relicInfo.purchaseDate | isAirspace}}</div>
    <div class="info-status">状态：{{relicInfo.state | isAirspace}}</div>
    <div class="info-warehouse">
      <span>收储仓库：</span><div v-text="relicInfo.store" contenteditable="true"
                                  @blur="relicInfo.store = $event.target.innerText"
                                  v-if="editing === true"  class="editable"/>
      <span v-if="editing === false">{{relicInfo.store | isAirspace}}</span>
    </div>
    <div class="info-location">
      <span>收储位置：</span><div v-text="relicInfo.address" contenteditable="true"
                              @blur="relicInfo.address = $event.target.innerText"
                                  v-if="editing === true" class="editable"/>
      <span v-if="editing === false">{{relicInfo.address | isAirspace}}</span>
    </div>
    <div class="info-quantity">
      <span>数量：</span><div v-text="relicInfo.number" contenteditable="true"
                           @blur="relicInfo.number = $event.target.innerText"
                                v-if="editing === true" class="editable"/>
      <span v-if="editing === false">{{relicInfo.number | isAirspace}}</span>
    </div>
    <div class="info-size">
      <span>尺寸：</span><div v-text="relicInfo.size" contenteditable="true"
                                @blur="relicInfo.size = $event.target.innerText"
                                v-if="editing === true" class="editable"/>
      <span v-if="editing === false">{{relicInfo.size | isAirspace}}</span>
    </div>
    <div class="info-admission-value">
      <span>收储价值：</span><div v-text="relicInfo.inValue" contenteditable="true"
                                  @blur="relicInfo.inValue = $event.target.innerText"
                                  v-if="editing === true" class="editable"/>
      <span v-if="editing === false">{{relicInfo.inValue | isAirspace}}</span>
    </div>
    <div class="info-leave-value">
      <span>离馆价值：</span><div v-text="relicInfo.outValue" contenteditable="true"
                             @blur="relicInfo.outValue = $event.target.innerText"
                                  v-if="editing === true" class="editable"/>
      <span v-if="editing === false">{{relicInfo.outValue | isAirspace}}</span>
    </div>
    <div class="info-entry-date">离馆时间：{{relicInfo.receiveDate | isAirspace}}</div>
  </div>

  <div class="btn-wrapper">
    <el-button type="primary" icon="el-icon-edit" @click="handleEdit"
               v-if="editing === false">编辑信息</el-button>
    <el-button type="success" icon="el-icon-check" @click="handleSubmit"
               v-if="editing === true">提交编辑</el-button>
    <el-button type="info" icon="el-icon-close" @click="handleCancelEdit"
               v-if="editing === true">取消编辑</el-button>
  </div>

  <div class="code-container">
    <div class="img-title">文物二维码</div>
    <div :id="`code`+relicInfo.id" class="code-content">

    </div>
  </div>
</div>
</template>
图片浏览
<script>
import QRCode from 'qrcodejs2'
import config from '../../utils/config'
import api from '../../api/relicApi'

export default {
  name: 'relic-info',
  created () {
    this.getRelicInfo(this.$route.params.id)
    console.log(this.relicInfo)
  },
  mounted () {
    this.qrcode(this.$route.params.id)
  },
  data () {
    return {
      relicInfo: {
        id: this.$route.params.id
      },
      editing: false
    }
  },
  methods: {
    getRelicInfo (id) {
      /**
       * 获取文物详情
       */
      api.getRelicInfo(id)
        .then(result => {
          const { data, status } = result
          if (status !== 200) return this.$message.error('获取信息失败，请刷新页面重试')
          this.relicInfo = data
        })
        .catch(error => {
          console.log(error)
        })
    },
    qrcode (id) {
      /**
       * 根据ID和key生成二维码
       */
      return new QRCode(`code${id}`, {
        width: 155,
        height: 155,
        text: `${id}${config.codeKey}`, // 二维码地址
        colorDark: '#000',
        colorLight: '#fff'
      })
    },
    handleEdit () {
      /**
       * 编辑事件
       */

      this.editing = true
    },
    handleSubmit () {
      /**
       * 提交编辑
       */

      const updateInfo = {
        address: this.relicInfo.address,
        dynasty: this.relicInfo.dynasty,
        handle: this.relicInfo.handle,
        inValue: this.relicInfo.inValue,
        material: this.relicInfo.material,
        name: this.relicInfo.name,
        number: this.relicInfo.number,
        outValue: this.relicInfo.outValue,
        size: this.relicInfo.size,
        source: this.relicInfo.source,
        store: this.relicInfo.store,
        year: this.relicInfo.year
      }
      console.log(updateInfo)
      api.updateRelicInfo(this.$route.params.id, updateInfo)
        .then(async result => {
          this.$message.success('修改成功')
          await this.getRelicInfo(this.$route.params.id)
        })
        .catch(async error => {
          if (error.response) {
            return this.$message.error(error.response.data.message)
          }
        })
      this.editing = false
    },
    handleCancelEdit () {
      /**
       * 取消编辑事件
       */

      this.editing = false
    }
  },
  filters: {
    isAirspace (value) {
      if (!value) return '无'
      else return value
    }
  },
  watch: {
    /**
     * 监听路由变化
     * @param to
     * @param from
     */
    '$route' (to, from) {
      this.relicInfo.id = this.$route.params.id
      this.getRelicInfo(this.$route.params.id)
      setTimeout(() => {
        const codeContent = document.querySelector('.code-content')
        codeContent.innerHTML = ''
        this.qrcode(this.$route.params.id)
      }, 0)
    }
  }
}
</script>

<style lang="less" scoped>
.relic-info-wrapper{
  position: relative;
  padding: 0 15px ;
  font-family: 'HYJinKaiJ';
  color: #000;

  .editable{
    display: inline-block;
    width: 370px;
    font-size: 18px;
    border:1px solid #909399;
  }

  .era-editable{
    width: 150px;
    font-size: 24px;
    border:1px solid #909399;
  }

  .info-title,
  .info-container{
    div{
      font-size: 25px;
      margin: 10px 0;
    }
  }

  .info-title{
    position: relative;
    .info-name{
      width: 75%;
      text-indent: 35px;
      span{
        font-size: 45px;
      }
    }

    .info-reign-title{
      margin-top: 30px !important;
    }

    .info-era{
      position: absolute;
      right: 10px;
      top: 10px;
      span{
        font-size: 100px;
      }
    }
  }

  .btn-wrapper{
    position: absolute;
    bottom: -170px;
  }

  .code-container{
    margin-top: 150px;
    font-size: 25px;
    text-align: right;

    .img-title{
      padding-right: 15px;
      margin-bottom: 15px;
    }
    .code-content{
      width: 155px;
      float: right;
    }
  }
}
</style>
