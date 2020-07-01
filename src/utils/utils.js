import config from './config'

const utils = {
  formatTableDate (row, column) {
    /**
     * 格式化表格时间
     */
    const date = new Date(row[column.property])
    const Y = date.getFullYear() + '-'
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    const D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())

    const h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':'
    const m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':'
    const s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds())
    return Y + M + D + ' ' + h + m + s
  },
  formatDate (value) {
    /**
     * 格式化创建时间
     */
    const date = new Date(value)
    const Y = date.getFullYear() + '-'
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    const D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())

    const h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':'
    const m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':'
    const s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds())
    return Y + M + D + ' ' + h + m + s
  },
  formatImgPath (imgName, type) {
    /**
     * 格式化图片路径
     * @type {RegExp}
     */
    const pattern = /{imgName}/g
    if (type === 'big') return config.bigImgPath.replace(pattern, imgName)
    else if (type === 'small') return config.smallImgPath.replace(pattern, imgName)
  },
  formatISODate (value) {
    /**
     * 将中国标准时间转换为 ISO 时间
      */

    const dateee = new Date(value).toJSON()
    const date = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace('Z', '')
    return date
  },
  getCheckedList (roleList, arr) {
    /**
     * 通过递归的形式，获取角色下所有权限的id
     */
    roleList.forEach(item => {
      arr.push(item.code)
      if (item.children) {
        this.getCheckedList(item.children, arr)
      } else {
        return false
      }
    })
  }
}

export default utils
