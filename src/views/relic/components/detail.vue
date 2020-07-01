<template>
    <div class="detail-wrapper">
      <el-card class="detail-container">
        <header class="detail-header">
          <el-button size="small" @click="toBack">返回</el-button>
          <el-button type="primary" size="small" @click="exportOptions2excel" v-if="isCanExportExcel"
                     icon="el-icon-document-copy">导出操作记录</el-button>
        </header>
        <div class="detail-body clearfix">
          <!--左侧图片轮播组件-->
          <div class="body-left">
            <div class="image-carousel-wrapper">
              <div class="image-carousel-container">
                <div class="btn-wrapper">
                  <el-button icon="el-icon-plus" plain type="primary" style="margin-right: 10px" v-if="isCanEditRelicInfo"
                             size="small" @click="handleUploadImg">增加图片</el-button>
                  <input type="file" id="fileInput" @change="uploadImg" style="display: none"/>
                  <el-button icon="el-icon-minus" plain type="danger" size="small" v-if="isCanEditRelicInfo"
                             @click="deleteImg">删除图片</el-button>
                  <el-button icon="el-icon-search" size="small" style="float: right;margin-right: 40px"
                             @click="handlePreviewImg">浏览大图</el-button>
                </div>
                <div class="img-wrapper">
<!--                  <img :src="relicImagesUrl[ref.activeIndex]" alt="">-->
                  <el-image  :src="relicImagesUrl[ref.activeIndex]" :lazy="true" fit="contain"/>
                </div>
                <div class="carousel-wrapper">
                  <el-carousel type="card" height="200px" :autoplay="false" trigger="click" ref="carouselRef" >
                    <el-carousel-item v-for="item in relicImagesUrl" :key="item" class="carousel-item">
                      <img :src="item" alt="" >
                    </el-carousel-item>
                  </el-carousel>
                </div>
              </div>

              <!--大图图片查看器-->
              <el-image-viewer v-if="previewImgDlgVisible" :on-close="handlePreviewImgClose" :url-list="previewImageUrl" />
            </div>
          </div>
          <!--中间文物信息组件-->
          <div class="body-center">
            <div class="relic-info-wrapper">
              <div class="info-container">
                <div class="info-item"><span class="item-title">名称：</span>{{relicInfo.name | isAirspace}}</div>
                <div class="info-item"><span class="item-title">年代：</span>{{relicInfo.dynasty | isAirspace}}</div>
                <div class="info-item"><span class="item-title">年号：</span>{{relicInfo.year | isAirspace}}</div>
                <div class="info-item"><span class="item-title">来源：</span>{{relicInfo.source | isAirspace}}</div>
                <div class="info-item"><span class="item-title">类型：</span>{{relicInfo.material | isAirspace}}</div>
                <div class="info-item"><span class="item-title">数量：</span>{{relicInfo.number | isAirspace}}</div>
                <div class="info-item"><span class="item-title">尺寸：</span>{{relicInfo.size | isAirspace}}</div>
                <div class="info-item"><span class="item-title">状态：</span>
                  <el-tag :type="formatOptionType(relicInfo.state)" size="medium">
                    {{relicInfo.state}}
                  </el-tag>
                </div>
                <div class="info-item"><span class="item-title">收储仓库：</span>{{relicInfo.store | isAirspace}}</div>
                <div class="info-item"><span class="item-title">收储位置：</span>{{relicInfo.address | isAirspace}}</div>
                <div class="info-item"><span class="item-title">收储价值：</span>{{relicInfo.inValue | isAirspace}}</div>
                <div class="info-item"><span class="item-title">收储日期：</span>{{formatDate(relicInfo.purchaseDate) | isAirspace}}</div>
                <div class="info-item"><span class="item-title">离馆价值：</span>{{relicInfo.outValue | isAirspace}}</div>
                <div class="info-item"><span class="item-title">录入日期：</span>{{formatDate(relicInfo.receiveDate) | isAirspace}}</div>
              </div>

              <div class="btn-wrapper">
                <el-button type="primary" icon="el-icon-edit" @click="handleEdit" size="small"
                 style="width: 76.33px !important;" v-if="isCanEditRelicInfo">编辑</el-button>
                <template v-if="isCanEditRelicStates">
                  <el-button v-for="item in operateList" :key="item.name" plain class="btn-operate"
                             :type="item.type" size="small" @click="item.callback" :icon="item.icon">
                    {{item.name}}
                  </el-button>
                </template>
              </div>

              <div class="code-container">
                <div class="img-title">文物二维码</div>
                <div :id="`code`+this.getRelicId()" class="code-content"></div>
              </div>
            </div>
          </div>
          <!--右侧操作记录组件-->
          <div class="body-right">
            <div class="operation-record-wrapper" >
              <el-timeline>
                <el-timeline-item v-for="item in relicOptions" :key="item.id"
                                  :timestamp="formatDate(item.optionDate)" placement="top" >
                  <el-card>
                    <h3 style="margin-bottom: 5px">{{item.relicsOptionType}}</h3>
                    <p>{{item.details}}</p>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
        </div>
      </el-card>

      <el-dialog title="编辑信息" :visible.sync="editDlgVisible" width="30%">
        <el-form :model="editForm"  label-width="100px" >
          <el-form-item label="文物名称:"><el-input v-model="editForm.name"/></el-form-item>
          <el-form-item label="文物年代:"><el-input v-model="editForm.dynasty"/></el-form-item>
          <el-form-item label="文物年号:"><el-input v-model="editForm.year"/></el-form-item>
          <el-form-item label="文物来源:"><el-input v-model="editForm.source"/></el-form-item>
          <el-form-item label="文物类型:"><el-input v-model="editForm.material"/></el-form-item>
          <el-form-item label="文物数量:"><el-input v-model="editForm.number"/></el-form-item>
          <el-form-item label="文物尺寸:"><el-input v-model="editForm.size"/></el-form-item>
          <el-form-item label="收储价值:" v-if="isCanEditRelicValue"><el-input v-model="editForm.inValue"/></el-form-item>
          <el-form-item label="离馆价值:" v-if="isCanEditRelicValue"><el-input v-model="editForm.outValue"/></el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCancelEdit" size="small">取 消</el-button>
          <el-button type="primary" @click="handleSubmit" size="small">确 定</el-button>
        </div>
      </el-dialog>

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
    </div>
</template>

<script>
import api from '../../../api/baseApi'
import RELIC_API_URL from '../../../api/relicApiUrl'
import utils from '../../../utils/utils'
import QRCode from 'qrcodejs2'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import RECODE_API_URL from '../../../api/recordApiUrl'
import STORE_API_URL from '../../../api/storeApiUrl'
import table2excel from 'js-table2excel'
import tableConfig from '../../../utils/tableConfig'
export default {
  name: 'detail',
  props: ['id'],
  components: { ElImageViewer },
  created () {
    this.getRelicInfo()
  },
  mounted () {
    this.qrcode(this.getRelicId())
  },
  data () {
    return {
      imgUploadAction: 'http://test2.xkspbz.com/images/up.php',
      // imgUploadAction: 'http://192.168.196.71/images/up.php',
      uploadFileList: [],
      relicInfo: {},
      relicImagesUrl: [],
      operateList: [], //  操作按钮列表（根据文物状态渲染）
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
      previewImageUrl: [],
      relicOptions: [],
      editForm: {},
      editDlgVisible: false,
      ref: {},
      previewImgDlgVisible: false
    }
  },
  methods: {
    getRelicId () {
      return this.id
    },
    async getRelicInfo () {
      /**
       * 获取文物详情
       */
      await api.getObjectById(RELIC_API_URL.getRelicById, this.getRelicId())
        .then(result => {
          this.relicInfo = result.data
        })
        .catch(result => {
          return this.$message.error('获取信息失败，请刷新页面重试或确认文物id号码')
        })

      this.ref = this.$refs.carouselRef
      this.getRelicImagesUrl()
      this.getRelicOptions()
      this.getOptionsList()
    },
    getRelicOptions () {
      /**
       * 获得文物记录
       */
      this.relicOptions = JSON.parse(JSON.stringify(this.relicInfo.options))
      return this.relicOptions.reverse()
    },
    getRelicImagesUrl () {
      /**
       * 拼接 url
       */
      this.relicImagesUrl = []
      this.previewImageUrl = []
      this.relicInfo.images.forEach(item => {
        this.relicImagesUrl.push(this.formatSmallImgPath(item))
        this.previewImageUrl.push(this.formatBigImgPath(item))
      })
    },
    getOptionsList () {
      /**
       * 获得文物可操作列表
       */
      const state = this.relicInfo.state
      this.operateList = []

      const count = { type: 'success', name: '盘点', icon: 'el-icon-pie-chart', callback: this.handelCountRelic }
      const move = { type: 'primary', name: '移动', icon: 'el-icon-location-information', callback: this.handelMoveRelic }
      const lend = { type: 'info', name: '外借', icon: 'el-icon-sell', callback: this.lendRelic }
      const lendComplete = { type: 'info', name: '归还', icon: 'el-icon-sold-out', callback: this.lendComplete }
      const restore = { type: 'warning', name: '修复', icon: 'el-icon-setting', callback: this.restoreRelic }
      const restoreComplete = { type: 'warning', name: '修复完成', icon: 'el-icon-setting', callback: this.restoreComplete }
      const outer = { type: 'danger', name: '出库', icon: 'el-icon-map-location', callback: this.outerStore }

      const operate = {
        在馆: () => {
          this.operateList.push(count)
          this.operateList.push(move)
          this.operateList.push(lend)
          this.operateList.push(restore)
          this.operateList.push(outer)
        },
        修复: () => {
          this.operateList.push(restoreComplete)
        },
        外借: () => {
          this.operateList.push(lendComplete)
        },
        离馆: () => {}
      }
      operate[state]()
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
    qrcode (id) {
      /**
       * 根据ID和key生成二维码
       */
      return new QRCode(`code${id}`, {
        width: 155,
        height: 155,
        text: `${id}`, // 二维码地址
        colorDark: '#000',
        colorLight: '#fff'
      })
    },
    handleEdit () {
      /**
       * 编辑事件
       */

      this.editDlgVisible = true
      this.editForm = JSON.parse(JSON.stringify(this.relicInfo))
    },
    handleSubmit () {
      /**
       * 提交编辑
       */
      const updateInfo = {
        address: this.editForm.address,
        dynasty: this.editForm.dynasty,
        handle: this.editForm.handle,
        inValue: this.editForm.inValue,
        material: this.editForm.material,
        name: this.editForm.name,
        number: this.editForm.number,
        outValue: this.editForm.outValue,
        size: this.editForm.size,
        source: this.editForm.source,
        store: this.editForm.store,
        year: this.editForm.year
      }

      api.putObjectById(RELIC_API_URL.updateRelicById, this.getRelicId(), updateInfo)
        .then(async result => {
          const { status } = result
          if (status !== 200) return this.$message.error('修改失败，请稍后再试')
          this.$message.success('修改成功')
          await this.getRelicInfo()
        })
        .catch(async error => {
          if (error.response) {
            return this.$message.error(error.response.data.message)
          }
        })
      this.editDlgVisible = false
    },
    handleCancelEdit () {
      /**
       * 取消编辑事件
       */

      this.editDlgVisible = false
    },
    handleUploadImg () {
      /**
       * 打开文件选择框
       */
      const fileInput = document.getElementById('fileInput')
      fileInput.click()
    },
    uploadImg () {
      /**
       * 上传图片
       */

      const fileInput = document.getElementById('fileInput')
      const file = fileInput.files[0]

      if (this.uploadFileList.includes(file.name)) {
        return this.$message.error('该图片已上传，请勿重新添加，如需重复添加，请刷新网页')
      }

      const isValid = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt10Mb = file.size / 1024 / 1024 < 10

      if (!isValid) return this.$message.error('上传图片只能是 jpg 或 png 格式！')
      if (!isLt10Mb) return this.$message.error('上传图片大小不能超过 10M！')

      const formData = new FormData()
      formData.append('uploadedfile', file)

      api.postObject(this.imgUploadAction, formData)
        .then(result => {
          const { status, data } = result
          if (status !== 200) return this.$message.error('服务器出现异常，请稍后再试')

          api.postObject(RELIC_API_URL.uploadImageUrlsById.replace(/id/, this.getRelicId()), [data.id])
            .then(result => {
              const { status } = result
              if (status !== 200) return this.$message.error('上传失败，请稍后再试')
              this.uploadFileList.push(file.name)
              this.$message.success('上传成功')
              this.getRelicInfo()
            })
            .catch(result => {
              return this.$message.error('服务器出现异常，请稍后再试')
            })
        })
        .catch(result => {
          return this.$message.error('服务器出现异常，请稍后再试')
        })
    },
    deleteImg () {
      /**
       * 删除图片
       */
      if (this.relicImagesUrl.length === 1) return this.$message.error('请勿删除最后一张图片')

      const targetImgUrl = this.relicImagesUrl[this.ref.activeIndex]
      const len = targetImgUrl.split('/').length
      const imgId = targetImgUrl.split('/')[len - 1].split('.')[0]

      api.putObjectById(RELIC_API_URL.deleteImageUrlsById, this.getRelicId(), [imgId])
        .then(result => {
          const { status } = result
          if (status !== 200) return this.$message.error('删除失败，请稍后再试')
          this.$message.success('删除成功')
          this.getRelicInfo()
        })
        .catch(result => {
          return this.$message.error('服务器出现异常，请稍后再试')
        })
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
          this.getRelicInfo()
          this.handleCountRelicDlgClose()
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
          this.getRelicInfo()
          this.handleMoveRelicDlgClose()
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
              this.getRelicInfo()
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
          this.getRelicInfo()
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
          this.getRelicInfo()
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
          this.getRelicInfo()
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
              this.getRelicInfo()
            })
            .catch(result => {
              this.$message.error('获取失败，请稍后再试')
            })
        })
    },
    toBack () {
      this.$router.push('/relic/list')
    },
    exportOptions2excel () {
      /**
       * 导出操作记录到 excel
       */
      const filename = `文物-${this.relicInfo.name}的操作记录表`
      const tableHeaders = tableConfig.recodeTableHeaders
      const tableData = JSON.parse(JSON.stringify(this.relicInfo.options))
      tableData.forEach(item => {
        item.id = 'id' + item.id.toString()
        item.optionDate = this.formatDate(item.optionDate)
      })
      table2excel(tableHeaders, tableData, filename)
    },
    formatDate (date) {
      return utils.formatDate(date)
    },
    formatOptionType (type) {
      const types = {
        在馆: 'success',
        外借: 'info',
        修复: 'warning',
        离馆: 'danger'
      }
      return types[type]
    },
    formatSmallImgPath (imgName) {
      return utils.formatImgPath(imgName, 'small')
    },
    formatBigImgPath (imgName) {
      return utils.formatImgPath(imgName, 'big')
    }
  },
  filters: {
    isAirspace (value) {
      if (!value) return '无'
      else return value
    }
  },
  computed: {
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
    isCanExportExcel () {
      /**
       * 判断是否拥有 导出excel（1105） 的权限
       */
      return !!this.$store.getters.getUserRole.includes(1105)
    }
  },
  watch: {
    /**
     * 监听路由变化
     * @param to
     * @param from
     */
    '$route' (to, from) {
      this.getRelicInfo(this.getRelicId())
      setTimeout(() => {
        const codeContent = document.querySelector('.code-content')
        codeContent.innerHTML = ''
        this.qrcode(this.getRelicId())
      }, 0)
    }
  }
}
</script>

<style lang="less" scoped>
.detail-wrapper{
  min-height: 100%;
  .detail-container{

    .detail-header{
      display: flex;
      justify-content: space-between;
    }

    .detail-body{
      margin: 15px 0;

      .body-left,
      .body-center{
        float: left;
        width: 33%;
      }

      .body-center{
        .relic-info-wrapper{
          position: relative;
          padding: 0 15px ;
          color: #333;

          .info-container{
            .info-item{
              display: flex;
              align-items: center;
              padding: 5px 0;
              font-size: 18px;

              &:first-child,
              .item-title{
                font-size: 21px;
                font-weight: 600;
                color: #444;
              }
            }
          }

          .btn-wrapper{
            position: absolute;
            bottom: -170px;
            width: 260px;

            .btn-operate{
              margin-left: 10px !important;
              margin-bottom: 10px !important;

              &:nth-child(4){
                margin-left: 0 !important;
              }
            }
          }

          .code-container{
            margin-top: 150px;
            font-size: 20px;
            text-align: right;

            .img-title{
              padding-right: 28px;
              margin-bottom: 15px;
            }
            .code-content{
              width: 155px;
              float: right;
            }
          }
        }
      }

      .body-left{
        width: 35%;
        .image-carousel-wrapper {

          .img-wrapper {
            margin-top: 15px;
            height: 700px;
            display: flex;
            align-items: center;
            justify-content: center;

            /*img {*/
            /*  width: 83%;*/
            /*}*/
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
      }

      .body-right{
        float: right;
        width: 30%;
        height: 100%;
        overflow: hidden;
        .operation-record-wrapper{
          height: 980px;
          overflow: auto;
        }
      }
    }
  }
}
</style>
