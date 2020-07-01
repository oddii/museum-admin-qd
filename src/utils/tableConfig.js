const tableConfig = {
  relicTableHeaders: [
    {
      title: '文物编号',
      key: 'id',
      type: 'text'
    },
    {
      title: '文物名称',
      key: 'name',
      type: 'text'
    },
    {
      title: '缩略图',
      key: 'url',
      type: 'image',
      width: 155,
      height: 155
    },
    {
      title: '年代',
      key: 'dynasty',
      type: 'text'
    },
    {
      title: '年号',
      key: 'year',
      type: 'text'
    },
    {
      title: '来源',
      key: 'source',
      type: 'text'
    },
    {
      title: '材质',
      key: 'material',
      type: 'text'
    },
    {
      title: '收储日期',
      key: 'purchaseDate',
      type: 'text'
    },
    {
      title: '状态',
      key: 'state',
      type: 'text'
    },
    {
      title: '存储仓库',
      key: 'store',
      type: 'text'
    },
    {
      title: '收储地点',
      key: 'address',
      type: 'text'
    },
    {
      title: '数量',
      key: 'number',
      type: 'text'
    },
    {
      title: '尺寸',
      key: 'size',
      type: 'text'
    },
    {
      title: '入馆价值',
      key: 'inValue',
      type: 'text'
    },
    {
      title: '离馆价值',
      key: 'outValue',
      type: 'text'
    },
    {
      title: '录入日期',
      key: 'receiveDate',
      type: 'text'
    }
  ],

  recodeTableHeaders: [
    {
      title: '记录编号',
      key: 'id',
      type: 'text'
    },
    {
      title: '文物名称',
      key: 'optionRelicsName',
      type: 'text'
    },
    {
      title: '操作类型',
      key: 'relicsOptionType',
      type: 'text'
    },
    {
      title: '操作详情',
      key: 'details',
      type: 'text'
    },
    {
      title: '操作人员',
      key: 'operator',
      type: 'text'
    },
    {
      title: '操作时间',
      key: 'optionDate',
      type: 'text'
    }
  ],

  waitRelicTableHeaders: [
    {
      title: '待入库编号',
      key: 'id',
      type: 'text'
    },
    {
      title: '缩略图',
      key: 'url',
      type: 'image',
      width: 155,
      height: 155
    },
    {
      title: '创建时间',
      key: 'createDate',
      type: 'text'
    }
  ],

  storeTableHeaders: [
    {
      title: '仓库编号',
      key: 'id',
      type: 'text'
    },
    {
      title: '仓库名称',
      key: 'name',
      type: 'text'
    },
    {
      title: '仓库地址',
      key: 'address',
      type: 'text'
    }
  ],

  userTableHeaders: [
    {
      title: '工号',
      key: 'id',
      type: 'text'
    },
    {
      title: '用户名',
      key: 'username',
      type: 'text'
    },
    {
      title: '姓名',
      key: 'name',
      type: 'text'
    },
    {
      title: '邮箱地址',
      key: 'email',
      type: 'text'
    },
    {
      title: '角色',
      key: 'roleName',
      type: 'text'
    }
  ],

  permissionTableHeaders: [
    {
      title: '权限编号',
      key: 'code',
      type: 'text'
    },
    {
      title: '权限名称',
      key: 'name',
      type: 'text'
    },
    {
      title: '权限等级',
      key: 'level',
      type: 'text'
    }
  ],

  formatRelicExcelHeaders: {
    id: {
      text: '文物编号',
      type: 'string'
    },
    name: {
      text: '文物名称',
      type: 'string'
    },
    dynasty: {
      text: '年代',
      type: 'string'
    },
    year: {
      text: '年号',
      type: 'string'
    },
    source: {
      text: '来源',
      type: 'string'
    },
    material: {
      text: '材质',
      type: 'string'
    },
    purchaseDate: {
      text: '收储日期',
      type: 'date'
    },
    state: {
      text: '状态',
      type: 'string'
    },
    store: {
      text: '存储仓库',
      type: 'string'
    },
    address: {
      text: '收储地点',
      type: 'string'
    },
    number: {
      text: '数量',
      type: 'string'
    },
    size: {
      text: '尺寸',
      type: 'string'
    },
    inValue: {
      text: '入馆价值',
      type: 'string'
    },
    outValue: {
      text: '离馆价值',
      type: 'string'
    },
    receiveDate: {
      text: '录入日期',
      type: 'date'
    }
  }
}

export default tableConfig
