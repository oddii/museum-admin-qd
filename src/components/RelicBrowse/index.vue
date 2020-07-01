<template>
  <div class="relic-browse-wrapper">
    <div class="container clearfix">

      <div class="img-wrapper">
        <div class="img-title">文物二维码</div>
        <div :id="`code`+getRelicId()" class="code-content">
        </div>
      </div>

      <div class="timeline-wrapper" v-if="useTimeLine">
        <div class="timeline-title">最近三次操作记录</div>
        <el-timeline>
          <el-timeline-item v-for="(item,index) in getRelicRecordList()" :key="index"
                            :timestamp="formatDate(item.optionDate)" placement="top">
            {{item.details}}
          </el-timeline-item>
        </el-timeline>
      </div>

      <div class="btn-wrapper">
        <el-button size="small"
                   @click="downloadImg" icon="el-icon-download">导出标签
        </el-button>
        <el-button size="small" style="margin-right: 10px"
                   @click="handlePreviewImg" icon="el-icon-picture-outline">大图
        </el-button>
        <span v-if="useOperate">
        <template v-if="isCanSeeRelicDetails">
          <el-button type="warning" size="small"
                     @click="toDetail" icon="el-icon-document">详情</el-button>
        </template>

        <template v-if="isCanEditRelicStates">
          <el-button v-for="item in operateList" :key="item.name" plain
                     :type="item.type" size="small" @click="item.callback" :icon="item.icon">
              {{item.name}}
          </el-button>
        </template>

        <template v-if="isCanEditRelicInfo || isCanEditRelicValue">
          <el-button type="primary" size="small"
                     @click="toEdit" icon="el-icon-edit" v-if="editing === false">编辑</el-button>
            <el-button type="info" size="small"
                   @click="toCancel" icon="el-icon-close" v-if="editing === true">取消</el-button>
          <el-button type="success" size="small"
                   @click="toSubmit" icon="el-icon-check" v-if="editing === true">提交</el-button>
        </template>

        </span>
      </div>
    </div>

    <el-dialog title="选择仓库" :visible.sync="storeCascade.moveRelicVisible" width="350px"
               :before-close="handleMoveRelicDlgClose">
      <el-cascader v-model="storeCascade.selectValue" :options="storeCascade.data" :props="storeCascade.props"
                   @change="handleStoreSelectChange" clearable/>
      <div slot="footer">
        <el-button size="small" type="primary" @click="moveRelic">移动到此</el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择仓库" :visible.sync="storeCascade.countRelicVisible" width="350px"
               :before-close="handleCountRelicDlgClose">
      <el-cascader v-model="storeCascade.selectValue" :options="storeCascade.data" :props="storeCascade.props"
                   @change="handleStoreSelectChange" clearable/>
      <div slot="footer">
        <el-button size="small" type="primary" @click="countRelic">确认盘点</el-button>
      </div>
    </el-dialog>

    <!--大图图片查看器-->
    <el-image-viewer v-if="previewImgDlgVisible" :on-close="handlePreviewImgClose" :url-list="getPreviewImgUrl()" />
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import api from '../../api/baseApi'
import RECODE_API_URL from '../../api/recordApiUrl'
import utils from '../../utils/utils'
import STORE_API_URL from '../../api/storeApiUrl'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

export default {
  name: 'relic-browse',
  props: ['index', 'row', 'useTimeLine', 'useOperate'],
  components: { ElImageViewer },
  destroyed () {
    this.toCancel()
  },
  mounted () {
    this.qrcode()
  },
  data () {
    return {
      downloadImgSrc: '',
      editing: false,
      storeCascade: { //  仓库表格的数据
        selectValue: '', //  仓库的 value
        data: [], //  仓库选择列表
        props: {
          value: 'id',
          label: 'name'
        },
        storeId: '',
        moveRelicVisible: false,
        countRelicVisible: false
      },
      previewImgDlgVisible: false
    }
  },
  methods: {
    getRow () {
      return this.row
    },
    getIndex () {
      return this.index
    },
    getRelicId () {
      return this.getRow().id
    },
    getRelicRecordList () {
      const options = JSON.parse(JSON.stringify(this.getRow().options))
      return options.reverse().slice(0, 3)
    },
    getPreviewImgUrl () {
      const list = []
      this.getRow().images.forEach(item => {
        list.push(this.formatBigImgPath(item))
      })
      return list
    },
    getStoreList (params = {}) {
      /**
       * 获得仓库列表
       */
      api.getObject(STORE_API_URL.getStoreListByCascade, params)
        .then(result => {
          const { data } = result

          this.storeCascade.data = data
        })
        .catch(result => {
          this.$message.error('获取仓库列表失败，请稍后再试')
        })
    },
    handleStoreSelectChange (value) {
      /**
       * 仓库级联选择框事件
       */
      if (value.length > 0) {
        this.storeCascade.storeId = value[1]
      }
    },
    toEdit () {
      this.editing = true
      this.$emit('edit', this.getIndex(), this.getRow())
    },
    toCancel () {
      this.editing = false
      this.$emit('cancel', this.getIndex(), this.getRow())
    },
    toSubmit () {
      this.editing = false
      this.$emit('submit', this.getIndex(), this.getRow(), true)
    },
    toDetail () {
      /**
         * 去相应的详情页面
         */
      this.$router.push({ path: `/relic/detail/${this.getRelicId()}` })
    },
    handelCountRelic () {
      /**
       * 打开盘点文物的对话框
       */
      this.storeCascade.countRelicVisible = true
      this.getStoreList()
    },
    handleCountRelicDlgClose () {
      this.storeCascade.countRelicVisible = false
      this.storeCascade.storeId = ''
      this.storeCascade.selectValue = ''
    },
    countRelic () {
      /**
         * 盘点文物
         */
      api.postObject(RECODE_API_URL.insertRecordByType.replace(/type/, 7), {
        details: '',
        params: {},
        storageId: this.storeCascade.storeId,
        relicsId: this.getRelicId()
      })
        .then(result => {
          const { status } = result
          if (status !== 200) return this.$message.error('盘点失败，请稍后再试')
          this.$message.success('盘点成功')
          this.$emit('relicTableRefresh')
        })
        .catch(error => {
          if (error.response) {
            this.$message.error(error.response.data.message)
          }
        })
    },
    handelMoveRelic () {
      /**
       * 打开移动文物的对话框
       */
      this.storeCascade.moveRelicVisible = true
      this.getStoreList()
    },
    handleMoveRelicDlgClose () {
      /**
       * 关闭移动文物的对话框
       */
      this.storeCascade.moveRelicVisible = false
      this.storeCascade.storeId = ''
      this.storeCascade.selectValue = ''
    },
    moveRelic () {
      /**
       * 移动文物
       */
      api.postObject(RECODE_API_URL.insertRecordByType.replace(/type/, 1), {
        details: '',
        params: {},
        storageId: this.storeCascade.storeId,
        relicsId: this.getRelicId()
      })
        .then(result => {
          const { status } = result
          if (status !== 200) return this.$message.error('移动失败，请稍后再试')
          this.$message.success('移动成功')
          this.$emit('relicTableRefresh')
        })
        .catch(result => {
          this.$message.error('获取失败，请稍后再试')
        })
    },
    lendRelic () {
      /**
         * 外借文物
         */
      this.$prompt('请输入外借单位', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '外借单位不能为空'
      })
        .then(({ value }) => {
          api.postObject(RECODE_API_URL.insertRecordByType.replace(/type/, 2), {
            details: '',
            params: { lendOutTo: value },
            relicsId: this.getRelicId()
          })
            .then(result => {
              const { status } = result
              if (status !== 200) return this.$message.error('外借失败，请稍后再试')
              this.$message.success('外借成功')
              this.$emit('relicTableRefresh')
            })
            .catch(result => {
              this.$message.error('获取失败，请稍后再试')
            })
        })
    },
    lendComplete () {
      /**
         * 归还文物
         */
      api.postObject(RECODE_API_URL.insertRecordByType.replace(/type/, 3), {
        details: '',
        params: {},
        relicsId: this.getRelicId()
      })
        .then(result => {
          const { status } = result
          if (status !== 200) return this.$message.error('归还失败，请稍后再试')
          this.$message.success('归还成功')
          this.$emit('relicTableRefresh')
        })
        .catch(result => {
          this.$message.error('获取失败，请稍后再试')
        })
    },
    restoreRelic () {
      /**
         * 修复文物
         */
      api.postObject(RECODE_API_URL.insertRecordByType.replace(/type/, 4), {
        details: '',
        params: {},
        relicsId: this.getRelicId()
      })
        .then(result => {
          const { status } = result
          if (status !== 200) return this.$message.error('修复失败，请稍后再试')
          this.$message.success('修复成功')
          this.$emit('relicTableRefresh')
        })
        .catch(result => {
          this.$message.error('获取失败，请稍后再试')
        })
    },
    restoreComplete () {
      /**
         * 修复完成
         */
      api.postObject(RECODE_API_URL.insertRecordByType.replace(/type/, 5), {
        details: '',
        params: {},
        relicsId: this.getRelicId()
      })
        .then(result => {
          const { status } = result
          if (status !== 200) return this.$message.error('修复完成失败，请稍后再试')
          this.$message.success('修复完成成功')
          this.$emit('relicTableRefresh')
        })
        .catch(result => {
          this.$message.error('获取失败，请稍后再试')
        })
    },
    outerStore () {
      /**
         * 文物出库
         */
      this.$prompt('请输入离馆去向', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '离馆去向不能为空'
      })
        .then(({ value }) => {
          api.postObject(RECODE_API_URL.insertRecordByType.replace(/type/, 6), {
            details: '',
            params: { leaveTo: value },
            relicsId: this.getRelicId()
          })
            .then(result => {
              const { status } = result
              if (status !== 200) return this.$message.error('出库失败，请稍后再试')
              this.$message.success('出库成功')
              this.$emit('relicTableRefresh')
            })
            .catch(result => {
              this.$message.error('获取失败，请稍后再试')
            })
        })
    },
    qrcode () {
      /**
         * 根据ID和key生成二维码
         */
      return new QRCode(`code${this.getRelicId()}`, {
        width: 198,
        height: 198,
        text: `${this.getRelicId()}`, // 二维码地址
        colorDark: '#000',
        colorLight: '#fff'
      })
    },
    handlePreviewImg () {
      /**
       * 浏览大图
       */
      this.previewImgDlgVisible = true
    },
    handlePreviewImgClose () {
      /**
       * 关闭预览大图
       */
      this.previewImgDlgVisible = false
    },
    compositeImg () {
      /**
       * 合成图片
       */
      const imageBg = new Image()
      imageBg.crossOrigin = 'Anonymous'

      imageBg.src = this.getPreviewImgUrl()[0]
      imageBg.onload = () => {
        imageBg.width = 300
        imageBg.height = 300
        const canvas = document.createElement('canvas')
        canvas.width = imageBg.width + imageBg.height
        canvas.height = imageBg.height + 50

        const context = canvas.getContext('2d')

        context.rect(0, 0, canvas.width, canvas.height)
        context.fillStyle = '#fff'
        context.fill()
        context.drawImage(imageBg, 0, 0, imageBg.width, imageBg.height)

        const imageCode = new Image()
        imageCode.src = document.querySelector(`#code${this.getRelicId()}`).querySelector('img').src
        imageCode.crossOrigin = 'Anonymous'
        imageCode.onload = () => {
          context.drawImage(imageCode, imageBg.width, 0, imageBg.height, imageBg.height)
          context.font = '47px bold'
          context.fillStyle = '#000'
          context.fillText(this.getRelicId(), 0, canvas.height - 3)

          this.downloadImgSrc = canvas.toDataURL('image/png')
        }
      }
    },
    async downloadImg () {
      /**
       * 导出标签
       */
      await this.compositeImg()
      const timer = setInterval(() => {
        if (this.downloadImgSrc !== '') {
          let url = this.downloadImgSrc
          const request = new XMLHttpRequest()
          request.open('get', url, true)
          request.responseType = 'blob'
          request.onload = e => {
            url = window.URL.createObjectURL(request.response)
            const a = document.createElement('a')
            a.href = url
            a.download = this.getRelicId()
            a.click()
          }
          request.send()
          clearInterval(timer)
          this.downloadImgSrc = ''
        }
      }, 10)
    },
    formatBigImgPath (imgName) {
      return utils.formatImgPath(imgName, 'big')
    },
    formatDate (date) {
      return utils.formatDate(date)
    }
  },
  computed: {
    operateList () {
      /**
       * 操作列表
       */
      const state = this.getRow().state
      const list = []

      const count = { type: 'success', name: '盘点', icon: 'el-icon-pie-chart', callback: this.handelCountRelic }
      const move = { type: 'primary', name: '移动', icon: 'el-icon-location-information', callback: this.handelMoveRelic }
      const lend = { type: 'info', name: '外借', icon: 'el-icon-sell', callback: this.lendRelic }
      const lendComplete = { type: 'info', name: '归还', icon: 'el-icon-sold-out', callback: this.lendComplete }
      const restore = { type: 'warning', name: '修复', icon: 'el-icon-setting', callback: this.restoreRelic }
      const restoreComplete = { type: 'warning', name: '修复完成', icon: 'el-icon-setting', callback: this.restoreComplete }
      const outer = { type: 'danger', name: '出库', icon: 'el-icon-map-location', callback: this.outerStore }

      const operate = {
        在馆: () => {
          list.push(count)
          list.push(move)
          list.push(lend)
          list.push(restore)
          list.push(outer)
        },
        修复: () => {
          list.push(restoreComplete)
        },
        外借: () => {
          list.push(lendComplete)
        },
        离馆: () => {}
      }
      operate[state]()
      return list
    },
    isCanEditRelicInfo () {
      /**
       * 判断是否拥有 文物信息修改（1101） 的权限
       */
      return !!this.$store.getters.getUserRole.includes(1101)
    },
    isCanEditRelicValue () {
      /**
       * 判断是否拥有 文物价值修改（1102） 的权限
       */
      return !!this.$store.getters.getUserRole.includes(1102)
    },
    isCanEditRelicStates () {
      /**
       * 判断是否拥有 文物状态修改（1103） 的权限
       */
      return !!this.$store.getters.getUserRole.includes(1103)
    },
    isCanSeeRelicDetails () {
      /**
       * 判断是否拥有 查看文物详情（1104） 的权限
       */
      return !!this.$store.getters.getUserRole.includes(1104)
    }
  }
}
</script>

<style lang="less" scoped>
  .relic-browse-wrapper {
    .container {

      .img-wrapper {
        float: left;
        width: 228px;
        height: 228px;
        margin-right: 20px;
        text-align: center;

        .img-title {
          font-size: 17px;
          margin-bottom: 15px;
        }

        img {
          width: 200px;
          height: 200px;
        }

        .code-content {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .timeline-wrapper {
        float: left;
        width: 355px;

        .timeline-title {
          font-size: 17px;
          margin-bottom: 20px;
          text-indent: 30px;
        }
      }

      .wait-info-wrapper {
        float: left;
        width: 228px;
        height: 228px;
        margin-right: 20px;
        text-align: center;

        .receiveDate-title {
          font-size: 17px;
          margin-bottom: 15px;
        }

        div {
          font-size: 16px;
        }
      }

      .btn-wrapper {
        float: right;
        margin-top: 90px;
      }
    }
  }
</style>
