<template>
  <div class="count-wrapper">
    <el-card>
      <!--搜索表格组件-->
      <table-search use-date="true"/>

      <!--导出表格组件-->
      <export-excel/>

      <!--一览表格-->
      <el-table :data="tableData" style="width: 100%" :highlight-current-row="true"
                :border="true" :stripe="true">

        <el-table-column type="index" label="#" width="50" align="center"/>
        <el-table-column label="文物编号" prop="id" align="center"/>
        <el-table-column label="名称" prop="name" align="center"/>
        <el-table-column label="存储仓库" prop="warehouse" align="center"/>
        <el-table-column label="存储位置" prop="location" align="center"/>
        <el-table-column label="数量" prop="num" align="center"/>
        <el-table-column label="数量状态" prop="isCorrect" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.numStatus" type="success">{{scope.row.numStatus | numStatus}}</el-tag>
            <el-tag v-else type="danger">{{scope.row.numStatus | numStatus}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="上次盘点时间" prop="update_time" align="center"/>
        <el-table-column label="操作" align="center">
            <el-button size="small" type="success">确认无误</el-button>
            <el-button size="small" type="danger">数量存异</el-button>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </div>

    </el-card>
  </div>
</template>

<script>
import TableSearch from '../../../components/TableSearch/index'
import ExportExcel from '../../../components/ExportExcel/index'
import data from '@/mock/countListData.json'

export default {
  name: 'count',
  components: {
    ExportExcel,
    TableSearch
  },
  data () {
    return {
      tableData: data.data
    }
  },
  filters: {
    numStatus (value) {
      /**
       * 过滤数量正确状态
       */
      if (value) return '正确'
      else return '存异'
    }
  }
}
</script>

<style scoped>

</style>
