<template>
  <div class="store-list-wrapper">
    <el-card>
      <!--搜索表格组件-->
      <table-search :use-add-store="isCanInsertStore" table-type="store"
                    @refreshStoreList="handleRefresh" @search="handleSearch"/>
      <!--导出表格组件-->
      <export-excel :table-headers="tableHeaders" :page-data="excelPageData" table-type="store"
                  v-if="isCanExportExcel"/>

      <!--一览表格-->
      <el-table :data="tableData" :highlight-current-row="true"
                :border="true" :stripe="true" max-height="670">
        <el-table-column label="#" type="index" align="center"/>
        <el-table-column label="仓库编号" prop="id" width="300" :sortable="true" align="center"/>
        <el-table-column label="仓库名称" prop="name" align="center"/>
        <el-table-column label="仓库地址" prop="address"  align="center"/>
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
import api from '../../../api/baseApi'
import STORE_API_URL from '../../../api/storeApiUrl'
import tableConfig from '../../../utils/tableConfig'
export default {
  name: 'store-list',
  components: { TableSearch, ExportExcel },
  created () {
    this.getStoreList()
  },
  data () {
    return {
      searchValue: '',
      tableData: [],
      excelPageData: [],
      tableHeaders: tableConfig.storeTableHeaders,
      currentPage: 0,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    async getStoreList (params = {}) {
      /**
       * 获取仓库列表
       */

      if (this.searchValue) params.search = this.searchValue
      await api.getObject(STORE_API_URL.getStoreList, params)
        .then(result => {
          const { data } = result

          this.tableData = data.content
          this.total = data.totalElements
          this.pageSize = data.size
          this.currentPage = data.number + 1
        })
        .catch(async error => {
          if (error.response) {
            await this.$message.error(error.response.data.message)
          }
        })

      //  导出到excel的单页数据
      this.excelPageData = JSON.parse(JSON.stringify(this.tableData)).reduce((result, item) => {
        const row = Object.assign(item)
        row.id = 'id' + row.id.toString()
        result.push(row)
        return result
      }, [])
    },
    handleCurrentChange (curPage) {
      /**
       * 当前页码改变的事件
       */
      this.currentPage = curPage - 1
      this.getStoreList({
        page: this.currentPage,
        size: this.pageSize
      })
    },
    handleSizeChange (newSize) {
      /**
       * 每页显示条数改变的事件
       */
      this.pageSize = newSize
      this.getStoreList({
        size: this.pageSize
      })
    },
    handleSearch (value) {
      this.searchValue = value
      this.getStoreList()
    },
    handleRefresh () {
      /**
       * 刷新页面
       */
      this.getStoreList({
        page: this.currentPage - 1,
        size: this.pageSize
      })
    }
  },
  computed: {
    isCanInsertStore () {
      /**
       * 判断是否拥有 新增仓库（4101） 的权限
       */
      return !!this.$store.getters.getUserRole.includes(4101)
    },
    isCanExportExcel () {
      /**
       * 判断是否拥有 导出excel（导出全部需要向后端发请求）（4104） 的权限
       */
      return !!this.$store.getters.getUserRole.includes(4104)
    }
  }
}
</script>

<style lang="less" scoped>
.store-list-wrapper{
  .pagination {
    margin-top: 15px;
  }
}
</style>
