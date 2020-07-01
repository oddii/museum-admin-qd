<template>
  <div class="wait-wrapper">
    <el-card>
      <!--搜索表格组件-->
      <table-search use-date="true" table-type="wait" @search="handleSearch" @datePicked="handleDatePicked"/>

      <!--导出表格组件-->
      <export-excel :table-headers="tableHeaders" :page-data="excelPageData" table-type="wait"
                  v-if="isCanExportExcel"/>

      <!--一览表格-->
      <el-table :data="tableData" style="width: 100%" :highlight-current-row="true"
                :border="true" :stripe="true" id="wait-table" max-height="623">

        <el-table-column type="index" label="#" width="80" align="center"/>
        <el-table-column label="待入库编号" prop="id" width="300" :sortable="true" align="center"/>
        <el-table-column label="缩略图" align="center" width="200">
          <template slot-scope="{row}">
            <!-- <img :src="formatSmallImgPath(row.images[0])" style="height: 100px;text-align: center"/> -->
            <el-image :src="formatSmallImgPath(row.images[0])"
            style="height: 100px;width:100px;text-align: center"/>
          </template>
        </el-table-column>
        <el-table-column label="二维码" align="center" width="200">
          <template slot-scope="{row}">
            <div :id="`code-wait-`+row.id" style="display: flex;justify-content: center;"></div>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="createDate" width="180" :formatter="formatTableDate"
                         :sortable="true" align="center"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <el-button icon="el-icon-search" size="mini" @click="handlePreviewImgDlg(row)">浏览大图</el-button>
            <el-button icon="el-icon-download" type="primary" size="mini" @click="downloadImg(row.id)">导出标签</el-button>
            <el-button icon="el-icon-check" type="success" size="mini"
                       @click="handleEnterStore(row.id)" v-if="isCanEnterStore">文物入库
            </el-button>
            <el-button icon="el-icon-delete" type="danger" size="mini"
                       @click="deleteWaitRelic(row.id)" v-if="isCanDeleteWaitRelic">删除文物</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

    </el-card>

    <!--    <el-dialog title="浏览大图" :visible.sync="dialogVisible" width="70%"-->
    <!--               :before-close="handlePreviewImgDlgClose">-->
    <!--      <img id="bigImg"/>-->
    <!--    </el-dialog>-->

    <el-dialog title="选择仓库" :visible.sync="storeCascade.visible" width="350px"
               :before-close="handleEnterStoreDlgClose">
      <el-cascader v-model="storeCascade.selectValue" :options="storeCascade.data" :props="storeCascade.props"
                   @change="handleStoreSelectChange" clearable/>
      <div slot="footer">
        <el-button size="small" type="primary" @click="enterStore">确认入库</el-button>
      </div>
    </el-dialog>

    <!--大图图片查看器-->
    <el-image-viewer v-if="previewImgDlgVisible" :on-close="handlePreviewImgDlgClose" :url-list="imgPreviewList"/>
  </div>
</template>

<script>
import ExportExcel from '../../../components/ExportExcel/index'
import TableSearch from '../../../components/TableSearch/index'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import RELIC_API_URL from '../../../api/relicApiUrl'
import QRCode from 'qrcodejs2'
import config from '../../../utils/config'
import tableConfig from '../../../utils/tableConfig'
import utils from '../../../utils/utils'
import api from '../../../api/baseApi'
import STORE_API_URL from '../../../api/storeApiUrl'
import RECODE_API_URL from '../../../api/recordApiUrl'

export default {
  name: 'wait',
  components: {
    TableSearch,
    ExportExcel,
    ElImageViewer
  },
  created () {
    this.getWaitRelicList()
  },
  data () {
    return {
      previewImgDlgVisible: false, //  浏览大图对话框
      tableHeaders: tableConfig.waitRelicTableHeaders, //  表头
      tableData: [],
      excelPageData: [],
      startTime: '',
      endTime: '',
      currentPage: 0,
      pageSize: 10,
      total: 0,
      imgPreviewList: [],
      imgWithCodeList: [], //  合唱标签图列表
      storeCascade: { //  仓库表格的数据
        selectValue: '', //  仓库的 value
        data: [], //  仓库选择列表
        props: {
          value: 'id',
          label: 'name'
        },
        relicId: '',
        storeId: '',
        visible: false
      }
    }
  },
  methods: {
    getWaitRelicById (id) {
      api.getObjectById(RELIC_API_URL.getWaitRelicById, id)
        .then(result => {
          const { data } = result
          this.tableData = [data]
          this.total = data !== '' ? 1 : 0
          this.pageSize = data !== '' ? 1 : 0
          this.currentPage = data !== '' ? 1 : 0
        })
        .catch(result => {
          this.$message.error('没有此id的文物，请重新输入')
        })
      this.renderImg(this.tableData)

      //  导出到 excel 的单页数据
      this.excelPageData = this.tableData.reduce((result, item) => {
        const row = Object.assign(item)
        row.url = this.formatSmallImgPath(item.images[0])
        row.createDate = this.formatDate(item.createDate)
        result.push(row)
        return result
      }, [])
    },
    async getWaitRelicList (params = {}) {
      /**
         * 获得列表
         */
      if (this.startTime) params.startTime = this.startTime
      if (this.endTime) params.endTime = this.endTime
      await api.getObject(RELIC_API_URL.getWaitRelicListByFilter, params)
        .then(result => {
          const { data } = result

          this.tableData = data.content
          this.total = data.totalElements
          this.pageSize = data.size
          this.currentPage = data.number + 1
        })
        .catch(result => {
          this.$message.error('获取待入文物列表失败，请稍后再试')
        })
      this.renderImg(this.tableData)

      //  导出到 excel 的单页数据
      this.excelPageData = JSON.parse(JSON.stringify(this.tableData)).reduce((result, item) => {
        const row = Object.assign(item)
        row.id = 'id' + row.id.toString()
        row.url = this.formatSmallImgPath(item.images[0])
        row.createDate = this.formatDate(item.createDate)
        result.push(row)
        return result
      }, [])
    },
    handleCurrentChange (curPage) {
      /**
         * 当前页码改变的事件
         */
      this.currentPage = curPage - 1
      this.getWaitRelicList({
        page: this.currentPage,
        size: this.pageSize
      })
    },
    handleSizeChange (newSize) {
      /**
         * 每页显示条数改变的事件
         */
      this.pageSize = newSize
      this.getWaitRelicList({
        size: this.pageSize
      })
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
    handleDatePicked (startTime, endTime) {
      /**
       * 日期选择事件
       */
      this.startTime = ''
      this.endTime = ''
      if (startTime !== null && endTime !== null) {
        this.startTime = startTime
        this.endTime = endTime
      }
      this.getWaitRelicList()
    },
    handleSearch (value) {
      if (value) {
        this.getWaitRelicById(value)
      } else {
        this.getWaitRelicList()
      }
    },
    qrcode (id) {
      /**
         * 根据ID和key生成二维码
         */
      const div = document.querySelector(`#code-wait-${id}`)
      div.innerHTML = ''
      return new QRCode(`code-wait-${id}`, {
        width: 100,
        height: 100,
        text: `${id}${config.codeKey}`, // 二维码内容
        colorDark: '#000',
        colorLight: '#fff'
      })
    },
    renderImg (list) {
      /**
         * 根绝列表渲染二维码进相应的地方与渲染二维码和图片合成
         */
      list.forEach(item => {
        this.qrcode(item.id)
        this.compositeImg(item.id, this.formatSmallImgPath(item.images[0]))
      })
    },
    handlePreviewImgDlgClose () {
      /**
         * 关闭大图窗口
         */
      this.previewImgDlgVisible = false
    },
    handlePreviewImgDlg (row) {
      /**
         * 浏览大图
         */
      this.previewImgDlgVisible = true
      this.imgPreviewList = []
      row.images.forEach(item => {
        this.imgPreviewList.push(this.formatBigImgPath(item))
      })
    },
    compositeImg (id, src) {
      /**
         * 合成图片
         */
      const imageBg = new Image()
      imageBg.crossOrigin = 'Anonymous'
      // this.getBase64ByUrl(src, (url) => {
      //   imageBg.src = url
      // })
      imageBg.src = src
      imageBg.onload = () => {
        // console.log(imageBg.width, imageBg.height)
        imageBg.width = 300
        imageBg.height = 300
        // console.log(imageBg.width, imageBg.height)

        const canvas = document.createElement('canvas')
        canvas.width = imageBg.width + imageBg.height
        canvas.height = imageBg.height + 50

        const context = canvas.getContext('2d')

        context.rect(0, 0, canvas.width, canvas.height)
        context.fillStyle = '#fff'
        context.fill()
        context.drawImage(imageBg, 0, 0, imageBg.width, imageBg.height)

        const imageCode = new Image()
        imageCode.src = document.querySelector(`#code-wait-${id}`).querySelector('img').src
        imageCode.crossOrigin = 'Anonymous'
        imageCode.onload = () => {
          context.drawImage(imageCode, imageBg.width, 0, imageBg.height, imageBg.height)
          context.font = '47px bold'
          context.fillStyle = '#111'
          context.fillText(id, 0, canvas.height - 3)

          const base64 = canvas.toDataURL('image/png')

          this.imgWithCodeList.push({
            id,
            src: base64
          })
        }
      }
    },
    downloadImg (id) {
      /**
         * 下载标签
         */
      const index = this.imgWithCodeList.findIndex(item => {
        return item.id === id
      })

      let url = this.imgWithCodeList[index].src

      const request = new XMLHttpRequest()
      request.open('get', url, true)
      request.responseType = 'blob'
      request.onload = e => {
        url = window.URL.createObjectURL(request.response)
        const a = document.createElement('a')
        a.href = url
        a.download = id
        a.click()
      }
      request.send()
    },
    handleEnterStore (id) {
      /**
         * 打开文物入库对话框
         */
      this.storeCascade.visible = true
      this.getStoreList()
      this.storeCascade.relicId = id
    },
    handleEnterStoreDlgClose () {
      /**
         * 关闭文物入库对话框
         */
      this.storeCascade.visible = false
      this.storeCascade.relicId = ''
      this.storeCascade.storeId = ''
      this.storeCascade.selectValue = ''
    },
    enterStore () {
      /**
         * 文物确认入库
         */
      api.postObject(RECODE_API_URL.insertRecordByType.replace(/type/, 0), {
        details: '',
        params: {},
        relicsId: this.storeCascade.relicId,
        storageId: this.storeCascade.storeId
      })
        .then(result => {
          const { status } = result
          if (status !== 200) return this.$message.error('文物入库失败，请稍后再试')
          this.$message.success('文物入库成功')
          this.getWaitRelicList({
            page: this.currentPage - 1,
            size: this.pageSize
          })
          this.handleEnterStoreDlgClose()
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    deleteWaitRelic (id) {
      /**
         * 删除待录文物
         */

      api.deleteObjectById(RELIC_API_URL.deleteWaitRelicById, id)
        .then(result => {
          const { status } = result
          if (status !== 200) return this.$message.error('删除失败，请稍后再试')
          this.$message.success('删除成功')
          this.getWaitRelicList({
            page: this.currentPage - 1,
            size: this.pageSize
          })
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error(error.response.data.message)
          }
        })
    },
    formatDate (date) {
      /**
         * 格式化时间
         */
      return utils.formatDate(date)
    },
    formatTableDate (row, column) {
      return utils.formatTableDate(row, column)
    },
    formatSmallImgPath (imgName) {
      return utils.formatImgPath(imgName, 'small')
    },
    formatBigImgPath (imgName) {
      return utils.formatImgPath(imgName, 'big')
    }
  },
  computed: {
    isCanEnterStore () {
      /**
       * 判断是否拥有 文物确认入库（1202） 的权限
       */
      return !!this.$store.getters.getUserRole.includes(1202)
    },
    isCanDeleteWaitRelic () {
      /**
       * 判断是否拥有 删除文物（1203） 的权限
       */
      return !!this.$store.getters.getUserRole.includes(1203)
    },
    isCanExportExcel () {
      /**
       * 判断是否拥有 导出excel（导出全部需要向后端发请求）（1204） 的权限
       */
      return !!this.$store.getters.getUserRole.includes(1204)
    }
  }
}
</script>

<style lang="less">
  .wait-wrapper {
    height: 100%;

    .pagination {
      margin-top: 15px;
    }

    .el-dialog__body {
      display: flex;
      justify-content: center;
    }
  }
</style>
