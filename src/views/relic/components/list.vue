<template>
  <div class="relic-list-wrapper">
    <el-card>
      <!--搜索表格组件-->
      <table-search use-date="true" use-operate="true" table-type="relic" @search="handleSearch" @datePicked="handleDatePicked"
                  @allEdit="handleAllEdit" @allCancel="handleAllCancelEdit" @allSubmit="handleAllSubmit"/>

      <!--导出表格组件-->
      <div style="display: flex;align-items: center">
        <export-excel :table-headers="tableHeaders" :page-data="excelPageData" table-type="relic"
                      v-if="isCanExportExcel"/>

        <span class="select-store">
        <span class="label">选择仓库：</span>
        <el-cascader v-model="storeCascade.selectValue" :options="storeCascade.data" :props="storeCascade.props"
                     @change="handleStoreSelected" clearable size="small"/>
        </span>
      </div>

      <!--一览表格-->
      <el-table :data="tableData" style="width: 100%" :highlight-current-row="true"
                @filter-change="handleStateTypeFilter" :border="true" :stripe="true"
                id="relic-list-table" ref="relicTableRef" max-height="623">
        <!--展开行-->
        <el-table-column type="expand">
          <template slot-scope="{row,$index}">
            <relic-browse :use-time-line="true" :use-operate="true" :index="$index" :row="row" @relicTableRefresh="handleRefresh"
                          @submit="handleSubmit" @cancel="handleCancelEdit" @edit="handleEdit"/>
          </template>
        </el-table-column>

        <el-table-column label="文物编号" prop="id" width="122" align="center" :sortable="true"/>
        <el-table-column label="名称" prop="name" align="center">
          <template slot-scope="{row,$index}">
            <el-input size="small" v-model="row.name" v-if="showEdit[$index] && isCanEditRelicInfo"/>
            <span v-else>{{row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="缩略图" align="center" width="120" style="padding:0">
          <template slot-scope="{row}" style="padding:0">
            <!-- <img :src="formatSmallImgPath(row.images[0])" style="height: 100px;width:100px;text-align: center"/> -->
            <el-image :src="formatSmallImgPath(row.images[0])"
            style="height: 100px;width:100px;text-align: center"/>
          </template>
        </el-table-column>
        <el-table-column label="年代" prop="dynasty" width="80" align="center">
          <template slot-scope="{row,$index}">
            <el-input size="small" v-model="row.dynasty" v-if="showEdit[$index] && isCanEditRelicInfo"/>
            <span v-else>{{row.dynasty}}</span>
          </template>
        </el-table-column>
        <el-table-column label="年号" prop="year" width="80" align="center">
          <template slot-scope="{row,$index}">
            <el-input size="small" v-model="row.year" v-if="showEdit[$index] && isCanEditRelicInfo"/>
            <span v-else>{{row.year}}</span>
          </template>
        </el-table-column>
        <el-table-column label="来源" prop="source" align="center">
          <template slot-scope="{row,$index}">
            <el-input size="small" v-model="row.source" v-if="showEdit[$index] && isCanEditRelicInfo"/>
            <span v-else>{{row.source}}</span>
          </template>
        </el-table-column>
        <el-table-column label="器型/材质" prop="material" width="80" align="center">
          <template slot-scope="{row,$index}">
            <el-input size="small" v-model="row.material" v-if="showEdit[$index] && isCanEditRelicInfo"/>
            <span v-else>{{row.material}}</span>
          </template>
        </el-table-column>
        <el-table-column label="收储日期" prop="purchaseDate" align="center"
                         :formatter="formatTableDate" :sortable="true"/>
        <el-table-column label="收储仓库" prop="store" align="center"/>
        <el-table-column label="收储地点" prop="address" align="center"/>
        <el-table-column label="数量" prop="number" width="80" align="center">
          <template slot-scope="{row,$index}">
            <el-input size="small" v-model="row.number" v-if="showEdit[$index] && isCanEditRelicInfo"/>
            <span v-else>{{row.number}}</span>
          </template>
        </el-table-column>
        <el-table-column label="尺寸" prop="size" align="center">
          <template slot-scope="{row,$index}">
            <el-input size="small" v-model="row.size" v-if="showEdit[$index] && isCanEditRelicInfo"/>
            <span v-else>{{row.size}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state" width="80" align="center"
                         :column-key="stateTypeColumnKey" :filters="optionTypeFilters">
          <template slot-scope="{row}">
            <el-tag type="success" v-if="row.state ==='在馆'">{{row.state}}</el-tag>
            <el-tag type="warning" v-if="row.state ==='修复'">{{row.state}}</el-tag>
            <el-tag type="info" v-if="row.state ==='外借'">{{row.state}}</el-tag>
            <el-tag type="danger" v-if="row.state ==='离馆'">{{row.state}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="入馆价值" prop="inValue" align="center">
          <template slot-scope="{row,$index}">
            <el-input size="small" v-model="row.inValue" v-if="showEdit[$index] && isCanEditRelicValue"/>
            <span v-else>{{row.inValue}}</span>
          </template>
        </el-table-column>
        <el-table-column label="离馆价值" prop="outValue" align="center">
          <template slot-scope="{row,$index}">
            <el-input size="small" v-model="row.outValue" v-if="showEdit[$index] && isCanEditRelicValue"/>
            <span v-else>{{row.outValue}}</span>
          </template>
        </el-table-column>
        <el-table-column label="录入日期" prop="receiveDate" align="center"
                         :formatter="formatTableDate" :sortable="true"/>
      </el-table>

      <!--分页组件-->
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

    </el-card>

  </div>
</template>

<script>
import ExportExcel from '../../../components/ExportExcel/index'
import TableSearch from '../../../components/TableSearch/index'
import RelicBrowse from '../../../components/RelicBrowse/index'
import utils from '../../../utils/utils'
import api from '../../../api/baseApi'
import RELIC_API_URL from '../../../api/relicApiUrl'
import tableConfig from '../../../utils/tableConfig'
import STORE_API_URL from '../../../api/storeApiUrl'

export default {
  name: 'relic-list',
  components: {
    RelicBrowse,
    TableSearch,
    ExportExcel
  },
  created () {
    this.getRelicList()
    this.getStoreList()
  },
  data () {
    return {
      allSubmitSuccess: true, //  全部编辑提交成功
      showEdit: [],
      searchValue: '',
      tableData: [],
      excelPageData: [], //  导出单页的 excel 数据
      excelAllData: [], //  导出
      dateNumber: '',
      startTime: '',
      endTime: '',
      storeCascade: { //  仓库表格的数据
        selectValue: [],
        name: '',
        address: '',
        data: [], //  仓库选择列表
        props: {
          value: 'name',
          label: 'name'
        },
        visible: false
      },
      stateTypeColumnKey: 'relic-type',
      stateNumbers: '', //  状态类型，字符串，以逗号分隔每个参数
      optionTypeFilters: [
        {
          text: '在馆',
          value: 0
        },
        {
          text: '外借',
          value: 1
        },
        {
          text: '修复',
          value: 2
        },
        {
          text: '离馆',
          value: 3
        }
      ],
      beforeEditData: [],
      tableHeaders: tableConfig.relicTableHeaders,
      currentPage: 0,
      pageSize: 0,
      total: 0
    }
  },
  methods: {
    filterHandler (value, row, column) {
      /**
         * 过滤
         */
      const property = column.property
      return row[property] === value
    },
    async getRelicList (params = {}) {
      /**
         * 获得列表
         */
      if (this.searchValue) params.search = this.searchValue
      if (this.stateNumbers) params.stateNumbers = this.stateNumbers
      if (this.dateNumber) params.dateNumber = this.dateNumber
      if (this.startTime) params.startTime = this.startTime
      if (this.endTime) params.endTime = this.endTime
      if (this.storeCascade.name) params.name = this.storeCascade.name
      if (this.storeCascade.address) params.address = this.storeCascade.address
      await api.getObject(RELIC_API_URL.getRelicListByFilter, params)
        .then(result => {
          const { data } = result

          this.tableData = data.content
          this.beforeEditData = JSON.parse(JSON.stringify(data.content))
          this.total = data.totalElements
          this.pageSize = data.size
          this.currentPage = data.number + 1
        })
        .catch(result => {
          this.$message.error('获取失败，请稍后再试')
        })

      //  导出到excel的单页数据
      this.excelPageData = JSON.parse(JSON.stringify(this.tableData)).reduce((result, item) => {
        const row = Object.assign(item)
        row.id = 'id' + row.id.toString()
        row.url = this.formatSmallImgPath(item.images[0])
        row.purchaseDate = this.formatDate(item.purchaseDate)
        row.receiveDate = this.formatDate(item.receiveDate)
        result.push(row)
        return result
      }, [])
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
    handleStateTypeFilter (value) {
      /**
         * 筛选框选择后的事件
         */
      this.stateNumbers = value[this.stateTypeColumnKey]
      if (this.stateNumbers.length !== 0) {
        this.stateNumbers = this.stateNumbers.join(',')
      }

      this.getRelicList()
    },
    handleDatePicked (startTime, endTime, dateNumber) {
      /**
       * 日期选择事件
       */
      this.startTime = ''
      this.endTime = ''
      this.dateNumber = ''

      if (!dateNumber) return this.$message.error('请先选择筛选的日期类型')

      if (startTime !== null && endTime !== null && dateNumber !== '') {
        this.startTime = startTime
        this.endTime = endTime
        this.dateNumber = dateNumber
      }
      this.getRelicList()
    },
    handleStoreSelected (selectValue) {
      const name = selectValue[0]
      const address = selectValue[1]
      this.storeCascade.name = ''
      this.storeCascade.address = ''

      if (name !== '' && address !== '') {
        this.storeCascade.name = name
        this.storeCascade.address = address
      }
      this.getRelicList()
    },
    handleSearch (value) {
      this.searchValue = value
      this.getRelicList()
    },
    handleRefresh () {
      /**
       * 刷新表格
       */
      this.getRelicList({
        page: this.currentPage - 1,
        size: this.pageSize
      })
    },
    handleEdit (index, row) {
      /**
         * 点击编辑
         */
      this.$set(this.showEdit, index, true)
    },
    handleCancelEdit (index, row) {
      /**
         * 取消编辑
         */
      this.$set(this.showEdit, index, false)
      this.tableData[index] = JSON.parse(JSON.stringify(this.beforeEditData[index]))
    },
    handleSubmit (index, row, flag) {
      /**
         * 提交编辑
         */

      const updateInfo = {
        address: row.address,
        dynasty: row.dynasty,
        handle: row.handle,
        inValue: row.inValue,
        material: row.material,
        name: row.name,
        number: row.number,
        outValue: row.outValue,
        size: row.size,
        source: row.source,
        store: row.store,
        year: row.year
      }

      api.putObjectById(RELIC_API_URL.updateRelicById, row.id, updateInfo)
        .then(result => {
          const { status } = result
          if (status !== 200) {
            this.allSubmitSuccess = false
          }
          this.allSubmitSuccess = true
          if (flag) {
            this.$message.success('修改成功')
            return this.getRelicList({
              page: this.currentPage - 1,
              size: this.pageSize
            })
          }
        })
        .catch(async error => {
          if (error.response) {
            return this.$message.error(error.response.data.message)
          }
        })
      this.$set(this.showEdit, index, false)
    },
    handleAllEdit () {
      /**
       * 一键编辑事件
       */
      this.tableData.forEach((item, index) => {
        this.handleEdit(index, item)
      })
    },
    handleAllCancelEdit () {
      /**
       * 一键取消编辑事件
       */
      this.tableData.forEach((item, index) => {
        this.handleCancelEdit(index, item)
      })
    },
    handleAllSubmit () {
      /**
       * 一键提交事件
       */
      this.tableData.forEach((item, index) => {
        this.handleSubmit(index, item)
      })

      if (this.allSubmitSuccess) {
        this.$message.success('修改成功')
        return this.getRelicList({
          page: this.currentPage - 1,
          size: this.pageSize
        })
      }
    },
    handleCurrentChange (curPage) {
      /**
         * 当前页码改变的事件
         */
      this.currentPage = curPage - 1
      this.getRelicList({
        page: this.currentPage,
        size: this.pageSize
      })
    },
    handleSizeChange (newSize) {
      /**
         * 每页显示条数改变的事件
         */
      this.pageSize = newSize
      this.getRelicList({
        size: this.pageSize
      })
    },
    formatSmallImgPath (imgName) {
      return utils.formatImgPath(imgName, 'small')
    },
    formatDate (date) {
      /**
         * 格式化时间
         */
      return utils.formatDate(date)
    },
    formatTableDate (row, column) {
      /**
         * 格式化表格时间
         */
      return utils.formatTableDate(row, column)
    }
  },
  computed: {
    isCanExportExcel () {
      /**
       * 判断是否拥有 导出excel（导出全部需要向后端发请求）（1105） 的权限
       */
      return !!this.$store.getters.getUserRole.includes(1105)
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
    }
  }
}
</script>

<style lang="less" scoped>
  .relic-list-wrapper {
    .select-store{
      margin-bottom: 15px;
      .label{
        font-size: 14px;
        font-weight: 700;
        color: #777777;
      }
    }

    .pagination {
      margin-top: 15px;
    }
  }
</style>
