<template>
  <div class="export2excel-wrapper">
    <!--文件名-->
    <span class="file-name">
      <span class="label">文件名：</span>
      <span class="file-input">
          <el-input v-model="filename" :placeholder="placeholder"
                    clearable size="small" prefix-icon="el-icon-document" style="width: 300px;"/>
      </span>
    </span>
    <span class="file-export">
      <span class="label">导出数据到 Excel：</span>
      <el-button size="small" type="primary" icon="el-icon-document" @click="outputPage">导出单页</el-button>
      <el-button size="small" type="primary" icon="el-icon-document-copy" v-if="tableType !=='permission'"
                 @click="outputAll">导出全部</el-button>
    </span>
  </div>
</template>

<script>
import table2excel from 'js-table2excel'
export default {
  name: 'export-excel',
  props: ['tableHeaders', 'pageData', 'tableType'],
  data () {
    return {
      placeholder: '请输入文件名（默认为excel-list）', //  输入框占位符
      filename: '' //  文件名
    }
  },
  methods: {
    getTableType () {
      return this.tableType
    },
    outputPage () {
      /**
       * 导出单页数据到 Excel
       */
      table2excel(this.tableHeaders, this.pageData, this.filename === '' ? 'excel-list' : this.filename)
    },
    outputAll () {
      /**
       * 导出全部数据到 Excel
       */
      const output = {
        relic: () => {
          this.$store.dispatch('getAllRelicList', {
            tableHeaders: this.tableHeaders,
            filename: this.filename
          })
        },
        wait: () => {
          this.$store.dispatch('getAllWaitRelicList', {
            tableHeaders: this.tableHeaders,
            filename: this.filename
          })
        },
        record: () => {
          this.$store.dispatch('getAllRecordList', {
            tableHeaders: this.tableHeaders,
            filename: this.filename
          })
        },
        store: () => {
          this.$store.dispatch('getAllStoreList', {
            tableHeaders: this.tableHeaders,
            filename: this.filename
          })
        },
        user: () => {
          this.$store.dispatch('getAllUserList', {
            tableHeaders: this.tableHeaders,
            filename: this.filename
          })
        }
      }

      output[this.getTableType()]()
    }
  }
}
</script>

<style lang="less" scoped>
.export2excel-wrapper{
  float: left;
  margin-bottom: 15px;

  .label{
    font-size: 14px;
    font-weight: 700;
    color: #777777;
  }

  .file-name,
  .file-export,
  .auto-width,
  .file-type{
    margin-right: 50px;
  }

}
</style>
