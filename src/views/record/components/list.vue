<template>
  <div class="record-list-wrapper">
    <el-card>
      <!--搜索表格组件-->
      <table-search use-date="true" table-type="record" @datePicked="handleDatePicked"/>

      <!--导出表格组件-->
      <export-excel :table-headers="tableHeaders" :page-data="excelPageData" table-type="record"
                v-if="isCanExportExcel"/>
      <!--一览表格-->
      <el-table :data="tableData"  :highlight-current-row="true" max-height="623"
                :border="true" :stripe="true" @filter-change="handleOptionTypeFilter">
        <el-table-column type="index" label="#" align="center" />
        <el-table-column label="记录编号" prop="id" width="300" :sortable="true" align="center"/>
        <el-table-column label="文物名称" prop="optionRelicsName" width="300" align="center"/>
        <el-table-column label="操作类型" prop="relicsOptionType" :column-key="optionTypeColumnKey"
                         width="120" align="center" :filters="optionTypeFilters">
          <template slot-scope="{row}" >
            <el-tag :type="formatOptionType(row.relicsOptionType)" size="medium">
              {{row.relicsOptionType}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作详情" prop="details"  align="center"/>
        <el-table-column label="操作人员" prop="operator"  align="center" width="100"/>
        <el-table-column label="操作时间" prop="optionDate" :sortable="true" width="180" align="center" :formatter="formatTableDate"/>
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
import TableSearch from '../../../components/TableSearch/index'
import ExportExcel from '../../../components/ExportExcel/index'
import utils from '../../../utils/utils'
import RECODE_API_URL from '../../../api/recordApiUrl'
import api from '../../../api/baseApi'
import tableConfig from '../../../utils/tableConfig'
export default {
  name: 'record-list',
  components: { ExportExcel, TableSearch },
  created () {
    this.getRecordList()
  },
  data () {
    return {
      tableData: [],
      excelPageData: [],
      tableHeaders: tableConfig.recodeTableHeaders,
      startTime: '',
      endTime: '',
      optionTypeColumnKey: 'record-type',
      optionNumbers: '', //  操作类型，字符串，以逗号分隔每个参数
      optionTypeFilters: [
        {
          text: '入馆',
          value: 0
        },
        {
          text: '移动',
          value: 1
        },
        {
          text: '外借',
          value: 2
        },
        {
          text: '归还',
          value: 3
        },
        {
          text: '修复',
          value: 4
        },
        {
          text: '修复完成',
          value: 5
        },
        {
          text: '离馆',
          value: 6
        },
        {
          text: '盘点',
          value: 7
        }
      ],
      currentPage: 0,
      pageSize: 0,
      total: 0
    }
  },
  methods: {
    async getRecordList (params = {}) {
      /**
       * 获得操作记录列表
       */
      if (this.optionNumbers) params.optionNumbers = this.optionNumbers
      if (this.startTime) params.startTime = this.startTime
      if (this.endTime) params.endTime = this.endTime
      await api.getObject(RECODE_API_URL.getRecordListByFilter, params)
        .then(result => {
          const { data } = result

          this.tableData = data.content
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
        row.optionDate = this.formatDate(item.optionDate)
        result.push(row)
        return result
      }, [])
    },
    filterHandler (value, row, column) {
      const property = column.property
      return row[property] === value
    },
    handleCurrentChange (curPage) {
      /**
       * 当前页码改变的事件
       */
      this.currentPage = curPage - 1
      this.getRecordList({
        page: this.currentPage,
        size: this.pageSize
      })
    },
    handleSizeChange (newSize) {
      /**
       * 每页显示条数改变的事件
       */
      this.pageSize = newSize
      this.getRecordList({
        size: this.pageSize
      })
    },
    handleOptionTypeFilter (value) {
      /**
       * 筛选框选择后的事件
       */
      this.optionNumbers = value[this.optionTypeColumnKey]
      if (this.optionNumbers.length !== 0) {
        this.optionNumbers = this.optionNumbers.join(',')
      }

      this.getRecordList()
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
      this.getRecordList()
    },
    formatOptionType (type) {
      /**
       * 格式化操作类型
       */
      const types = {
        入馆: 'success',
        移动: '',
        外借: 'info',
        归还: 'info',
        修复: 'warning',
        修复完成: 'warning',
        离馆: 'danger',
        盘点: ''
      }
      return types[type]
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
       * 判断是否拥有 导出excel（导出全部需要向后端发请求）（2101） 的权限
       */
      return !!this.$store.getters.getUserRole.includes(2101)
    }
  }
}
</script>

<style lang="less" scoped>
.record-list-wrapper{

  .pagination{
    margin-top: 15px;
  }
}
</style>
