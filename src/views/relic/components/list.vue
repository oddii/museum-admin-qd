<template>
  <div class="browse-wrapper">
    <el-card>
      <!--搜索表格组件-->
      <table-search use-date="true" use-operate="true" />

      <!--导出表格组件-->
      <export-excel :table-headers="tableHeaders" :page-data="tableData" :all-data="tableData"/>

      <!--一览表格-->
      <el-table :data="tableData" style="width: 100%" :highlight-current-row="true"
                :border="true" :stripe="true" id="relic-list-table" ref="relicTableRef" >
        <!--展开行-->
        <el-table-column type="expand">
          <template slot-scope="{row,$index}">
            <relic-browse :id="row.id" :options="row.options" :use-time-line="true" :use-operate="true"
                          :use-wait="false" :image-url="row.imageUrls" :index="$index" :row="row"/>
          </template>
        </el-table-column>

        <el-table-column label="文物编号" prop="id" width="122" align="center"/>
        <el-table-column label="名称" prop="name" align="center">
          <template slot-scope="{row,$index}">
            <el-input size="small" v-model="row.name" v-if="showEdit[$index]"/>
            <span v-if="!showEdit[$index]">{{row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="缩略图" align="center" width="110">
          <template slot-scope="{row}">
            <img :src="row.imageUrls" width="80px"/>
          </template>
        </el-table-column>
        <el-table-column label="年代" prop="dynasty" width="80" align="center">
          <template slot-scope="{row,$index}">
            <el-input size="small" v-model="row.dynasty" v-if="showEdit[$index]"/>
            <span v-if="!showEdit[$index]">{{row.dynasty}}</span>
          </template>
        </el-table-column>
        <el-table-column label="年号" prop="year" width="80" align="center">
          <template slot-scope="{row,$index}">
            <el-input size="small" v-model="row.year" v-if="showEdit[$index]"/>
            <span v-if="!showEdit[$index]">{{row.year}}</span>
          </template>
        </el-table-column>
        <el-table-column label="来源" prop="source" align="center">
          <template slot-scope="{row,$index}">
            <el-input size="small" v-model="row.source" v-if="showEdit[$index]"/>
            <span v-if="!showEdit[$index]">{{row.source}}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="material" width="80" align="center">
          <template slot-scope="{row,$index}">
            <el-input size="small" v-model="row.material" v-if="showEdit[$index]"/>
            <span v-if="!showEdit[$index]">{{row.material}}</span>
          </template>
        </el-table-column>
        <el-table-column label="收储日期" prop="purchaseDate" align="center"/>
        <el-table-column label="收储仓库" prop="store" align="center"
                         :filters="warehouseFilterList" :filter-method="filterHandler">
          <template slot-scope="{row,$index}">
            <el-input size="small" v-model="row.store" v-if="showEdit[$index]"/>
            <span v-if="!showEdit[$index]">{{row.store}}</span>
          </template>
        </el-table-column>
        <el-table-column label="收储地点" prop="address" align="center">
          <template slot-scope="{row,$index}">
            <el-input size="small" v-model="row.address" v-if="showEdit[$index]"/>
            <span v-if="!showEdit[$index]">{{row.address}}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="number" width="80" align="center">
          <template slot-scope="{row,$index}">
            <el-input size="small" v-model="row.number" v-if="showEdit[$index]"/>
            <span v-if="!showEdit[$index]">{{row.number}}</span>
          </template>
        </el-table-column>
        <el-table-column label="尺寸" prop="size" align="center">
          <template slot-scope="{row,$index}">
            <el-input size="small" v-model="row.size" v-if="showEdit[$index]"/>
            <span v-if="!showEdit[$index]">{{row.size}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state" width="80" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.state === '在馆' ? 'success' : 'danger'">{{row.state}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="入馆价值" prop="inValue" align="center">
          <template slot-scope="{row,$index}">
            <el-input size="small" v-model="row.inValue" v-if="showEdit[$index]"/>
            <span v-if="!showEdit[$index]">{{row.inValue}}</span>
          </template>
        </el-table-column>
        <el-table-column label="离馆价值" prop="outValue" align="center">
          <template slot-scope="{row,$index}">
            <el-input size="small" v-model="row.outValue" v-if="showEdit[$index]"/>
            <span v-if="!showEdit[$index]">{{row.outValue}}</span>
          </template>
        </el-table-column>
        <el-table-column label="录入日期" prop="receiveDate" align="center"/>
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
import RelicBrowse from '../../../components/RelicBrowse/index'
import utils from '../../../utils/utils'
import api from '../../../api/relicApi'
import tableConfig from '../../../utils/tableConfig'

export default {
  name: 'relic-list',
  components: {
    RelicBrowse,
    TableSearch,
    ExportExcel
  },
  created () {
    this.getRelicList({
      handle: true
    })
    this.$bus.$on('relicTableEdit', (index, row) => {
      this.handleEdit(index, row)
    })

    this.$bus.$on('relicTableSubmit', (index, row) => {
      this.handleSubmit(index, row)
    })
  },
  mounted () {
    this.$bus.$on('relicTableAllEdit', () => {
      this.tableData.forEach((item, index) => {
        this.handleEdit(index, item)
        console.log(index)
      })
    })

    this.$bus.$on('relicTableAllSubmit', () => {
      this.tableData.forEach((item, index) => {
        this.handleSubmit(index, item)
      })
    })
  },
  data () {
    return {
      showEdit: [],
      tableHeader: ['文物编号', '名称', '年代', '年号', '来源', '类型', '收储日期', '状态',
        '收储仓库', '收储位置', '数量', '尺寸', '入库价值', '离库价值', '录入日期', '预览图'],
      tableData: [],
      tableHeaders: tableConfig.relicsTableHeaders,
      warehouseFilterList: [
        { //  仓库过滤列表
          text: '珍宝馆',
          value: '珍宝馆'
        },
        {
          text: '不是珍宝馆',
          value: '不是珍宝馆'
        }],
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
    getRelicList (params = {}) {
      /**
         * 获得列表
         */
      api.getRelicList(params)
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
      console.log(index)
      console.log(this.tableData)
    },
    handleSubmit (index, row) {
      /**
       * 提交编辑
       */
      console.log(row)
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
      console.log(updateInfo)
      api.updateRelicInfo(row.id, updateInfo)
        .then(result => {
          this.$message.success('修改成功')
        })
        .catch(async error => {
          if (error.response) {
            return this.$message.error(error.response.data.message)
          }
        })
      this.$set(this.showEdit, index, false)
      // console.log(index)
      // console.log(this.tableData)
    },
    handleCurrentChange (curPage) {
      /**
         * 当前页码改变的事件
         */
      this.currentPage = curPage
      this.getUserList({
        handle: true,
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
        handle: true,
        size: this.pageSize
      })
    },
    formatDate (row, column) {
      /**
         * 格式化时间
         */
      return utils.formatTableDate(row, column)
    }
  }
}
</script>

<style lang="less" scoped>
  .browse-wrapper {
    .pagination {
      margin-top: 15px;
    }
  }
</style>
