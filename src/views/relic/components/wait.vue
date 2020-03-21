<template>
    <div class="wait-wrapper">
      <el-card>
        <!--搜索表格组件-->
        <table-search use-date="true" :use-operate="true"/>

        <!--导出表格组件-->
        <export-excel tableId="wait-table" />

        <!--一览表格-->
        <el-table :data="tableData" style="width: 100%" :highlight-current-row="true"
                  :border="true" :stripe="true" id="wait-table">
          <!--展开行-->
          <el-table-column type="expand">
            <template slot-scope="{row,$index}">
              <relic-browse :id="row.id" :options="row.options" :use-time-line="false" :use-operate="false"
                            :use-wait="true" :image-url="row.imageUrls" :index="$index" :row="row"/>
            </template>
          </el-table-column>

          <el-table-column label="待入库编号" prop="id" width="122" align="center"/>
          <el-table-column label="名称" prop="name" align="center"/>
          <el-table-column label="缩略图" align="center" width="110">
            <template>
              <img src="../../../assets/relic1.png" width="80px"/>
            </template>
          </el-table-column>
          <el-table-column label="年代" prop="era" width="80" align="center">
            <template slot-scope="scope">
              <div v-text="scope.row.era" contenteditable="true"></div>
            </template>
          </el-table-column>
          <el-table-column label="年号" prop="reign_title" width="80" align="center"/>
          <el-table-column label="来源" prop="from" align="center"/>
          <el-table-column label="类型" prop="material" width="80" align="center"/>
          <el-table-column label="收储仓库" prop="warehouse" align="center"
                           :filters="warehouseFilterList" :filter-method="filterHandler"/>
          <el-table-column label="收储地点" prop="location" align="center"/>
          <el-table-column label="数量" prop="quantity" width="80" align="center"/>
          <el-table-column label="尺寸" prop="size" align="center"/>
          <el-table-column label="入馆价值" prop="admission_value" align="center"/>
          <el-table-column label="操作" align="center">
            <el-tooltip content="编辑录入" placement="top" effect="light" :enterable="false">
              <el-button size="mini" type="primary" icon="el-icon-edit" />
            </el-tooltip>
            <el-tooltip content="取消录入" placement="top" effect="light" :enterable="false">
              <el-button size="mini" type="danger" icon="el-icon-delete" />
            </el-tooltip>
          </el-table-column>
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
import ExportExcel from '../../../components/ExportExcel/index'
import TableSearch from '../../../components/TableSearch/index'
import data from '@/mock/waitListData.json'
import RelicBrowse from '../../../components/RelicBrowse/index'
import relicApi from '../../../api/relicApi'
export default {
  name: 'wait',
  components: { RelicBrowse, TableSearch, ExportExcel },
  created () {
    this.getRelicList({
      handle: false
    })
  },
  data () {
    return {
      tableData: data.data,
      currentPage: 0,
      pageSize: 0,
      total: 0,
      warehouseFilterList: [{ //  仓库过滤列表
        text: '珍宝馆',
        value: '珍宝馆'
      }, {
        text: '不是珍宝馆',
        value: '不是珍宝馆'
      }]
    }
  },
  methods: {
    getRelicList (params = {}) {
      /**
       * 获得列表
       */
      relicApi.getRelicList(params)
        .then(result => {
          const { data } = result
          console.log(data)
          this.tableData = data.content
          this.total = data.total
          this.pageSize = data.size
          this.currentPage = data.currentPage + 1
        })
        .catch(result => {
          this.$message.error('获取失败，请稍后再试')
        })
    },
    filterHandler (value, row, column) {
      /**
       * 过滤
       */
      const property = column.property
      return row[property] === value
    },
    handleCurrentChange (curPage) {
      /**
       * 当前页码改变的事件
       */
      this.currentPage = curPage
      this.getUserList({
        handle: false,
        page: curPage - 1,
        size: this.pageSize
      })
    },
    handleSizeChange (newSize) {
      /**
       * 每页显示条数改变的事件
       */
      this.pageSize = newSize
      this.getRelicList({
        handle: false,
        size: this.pageSize
      })
    }
  }
}
</script>

<style lang="less" scoped>
.wait-wrapper{
  .pagination{
    margin-top: 15px;
  }
}
</style>
