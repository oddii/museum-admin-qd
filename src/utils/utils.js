const utils = {
  formatTableDate (row, column) {
    /**
     * 格式化表格时间
     */
    console.log()
    const date = new Date(row[column.property] / 1)
    const Y = date.getFullYear() + '-'
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    const D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
    return Y + M + D
  },
  formatDate (value) {
    /**
     * 格式化创建时间
     */
    console.log()
    const date = new Date(value / 1)
    const Y = date.getFullYear() + '-'
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    const D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
    return Y + M + D
  }
}

export default utils
