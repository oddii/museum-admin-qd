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

    <!--文件类型-->
<!--    <span class="file-type">-->
<!--      <span class="label">文件类型：</span>-->
<!--      <el-select v-model="typeValue" placeholder="请选择" style="width: 100px" size="small">-->
<!--        <el-option-->
<!--          v-for="item in typeOptions"-->
<!--          :key="item.value"-->
<!--          :label="item.label"-->
<!--          :value="item.value">-->
<!--        </el-option>-->
<!--      </el-select>-->
<!--    </span>-->

    <span class="label">导出数据到 Excel：</span>
    <el-button size="small" type="primary" icon="el-icon-document" @click="outputPage">导出单页</el-button>
    <el-button size="small" type="primary" icon="el-icon-document-copy" @click="outputAll">导出全部</el-button>
  </div>
</template>

<script>
// import { utils, writeFile } from 'xlsx'
import table2excel from 'js-table2excel'
export default {
  name: 'export-excel',
  props: ['tableHeaders', 'pageData', 'allData'],
  data () {
    return {
      placeholder: '请输入文件名（默认为excel-list）', //  输入框占位符
      filename: '' //  文件名
    }
  },
  methods: {
    outputExcel () {
      /**
       * 导出excel
       */

      /**
      if (this.typeValue === '') return this.$message.error('请选择导出文件类型')

      //  获得表格dom
      const table = document.getElementById(this.tableId)
      //  创建一个新的工作簿
      const workbook = utils.book_new()
      //  转换工作表
      const worksheet = utils.table_to_sheet(table)
      // 向工作簿中追加工作表
      utils.book_append_sheet(workbook, worksheet, 'sheet')

      let fullfilename = `${this.filename}.${this.typeValue}`
      if (this.filename === '') {
        fullfilename = `excel-list.${this.typeValue}`
      }

      // 写入文件
      writeFile(workbook, fullfilename)
        .catch((error) => {
          console.log(error)
          this.$message.error('发生异常，请重试')
        })
       */
    },
    outputPage () {
      /**
       * 导出单页数据到 Excel
       */
    },
    outputAll () {
      /**
       * 导出全部数据到 Excel
       */
      table2excel(this.tableHeaders, this.allData, this.filename === '' ? 'excel-list' : this.filename)
    }
  }
}
</script>

<style lang="less" scoped>
.export2excel-wrapper{
  padding: 15px 0;

  .label{
    font-size: 14px;
    font-weight: 700;
    color: #777777;
  }

  .file-name,
  .auto-width,
  .file-type{
    margin-right: 50px;
  }

}
</style>
