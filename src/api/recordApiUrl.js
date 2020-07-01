const RECODE_API_URL = {
  getAllRecordList: '/api/option/all', // 获取全部操作记录
  getRecordListByFilter: '/api/option/filter', // 根据 操作类型、时间段 筛选操作记录
  insertRecordByType: '/api/option?optionNumber=type' //  新增操作记录
}

export default RECODE_API_URL
