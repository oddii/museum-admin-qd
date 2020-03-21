const tableConfig = {
  relicsTableHeaders: [
    {
      title: '文物编号',
      key: 'id',
      type: 'text'
    },
    {
      title: '缩略图',
      key: 'imageUrls',
      type: 'image',
      width: 200,
      height: 200
    },
    {
      title: '文物名称',
      key: 'name',
      type: 'text'
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

  recodesTableHeaders: [
    {
      title: '文物编号',
      key: 'id',
      type: 'text'
    },
    {
      title: '缩略图',
      key: 'imageUrls',
      type: 'image',
      width: 200,
      height: 200
    },
    {
      title: '文物名称',
      key: 'name',
      type: 'text'
    },
    {
      title: '操作类型',
      key: 'optionType',
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
  ]
}

export default tableConfig
