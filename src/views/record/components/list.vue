<template>
  <div class="record-list-wrapper">
    <el-card>
      <!--搜索表格组件-->
      <table-search use-date="true"/>

      <!--导出表格组件-->
      <export-excel/>

      <!--一览表格-->
      <el-table :data="tableData"  :highlight-current-row="true"
                :border="true" :stripe="true"  :default-sort = "{prop: 'id', order: 'descending'}">
        <el-table-column type="index" label="#" width="50" align="center" />
        <el-table-column label="文物编号" prop="rid" :sortable="true" align="center"/>
        <el-table-column label="缩略图" align="center" width="120">
          <template>
            <img src="../../../assets/relic1.png" width="80px"/>
          </template>
        </el-table-column>
        <el-table-column label="文物名称" prop="relicName" align="center"/>
        <el-table-column label="操作类型" prop="optionType" :filters="operationFilter" :filter-method="filterHandler" align="center">
          <template slot-scope="scope" >
            <el-tag v-if="scope.row.optionType === '盘点'">
              {{scope.row.optionType}}
            </el-tag>
            <el-tag v-else-if="scope.row.optionType === '入馆'" type="success">
              {{scope.row.optionType}}
            </el-tag>
            <el-tag v-else-if="scope.row.optionType === '出借'" type="warning">
              {{scope.row.optionType}}
            </el-tag>
            <el-tag v-else-if="scope.row.optionType === '出库'" type="danger">
              {{scope.row.optionType}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作详情" prop="details"  align="center"/>
        <el-table-column label="操作人员" prop="operator"  align="center"/>
        <el-table-column label="操作时间" prop="optionDate" align="center"/>
      </el-table>

      <!--分页组件-->
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>

    </el-card>
  </div>
</template>

<script>
import TableSearch from '../../../components/TableSearch/index'
import ExportExcel from '../../../components/ExportExcel/index'
import utils from '../../../utils/utils'
import recordApi from '../../../api/recordApi'
export default {
  name: 'record-list',
  components: { ExportExcel, TableSearch },
  created () {
    this.getRecordList()
  },
  data () {
    return {
      tableData: [],
      currentPage: 0,
      pageSize: 0,
      total: 0,
      operationFilter: [
        { text: '盘点', value: '盘点' },
        { text: '入库', value: '入库' },
        { text: '出借', value: '出借' },
        { text: '出库', value: '出库' }
      ]
    }
  },
  methods: {
    getRecordList (params = {}) {
      /**
       * 获得操作记录列表
       */
      recordApi.getRecordList(params)
        .then(result => {
          const { data } = result
          // console.log(data)
          this.tableData = data.content
          this.total = data.total
          this.pageSize = data.size
          this.currentPage = data.currentPage
        })
        .catch(result => {
          this.$message.error('获取失败，请稍后再试')
        })
    },
    filterHandler (value, row, column) {
      const property = column.property
      return row[property] === value
    },
    handleCurrentChange (curPage) {
      /**
       * 当前页码改变的事件
       */
      this.currentPage = curPage
      this.getUserList({
        page: curPage - 1,
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
    formatDate (row, column) {
      return utils.formatTableDate(row, column)
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
