const steps = [
  {
    element: '#driver-aside', // 显示高亮的元素
    popover: {
      title: '侧边栏', // 引导标题
      description: '点击切换功能菜单', // 引导描述
      position: 'right' // 引导出现的位置
    }
  },
  {
    element: '#btn-fold', // 显示高亮的元素
    popover: {
      title: '折叠按钮', // 引导标题
      description: '点击可折叠/展开侧边栏', // 引导描述
      position: 'bottom' // 引导出现的位置
    }
  },
  {
    element: '#driver-breadcrumb', // 显示高亮的元素
    popover: {
      title: '导航栏', // 引导标题
      position: 'bottom' // 引导出现的位置
    }
  },
  {
    element: '#btn-full', // 显示高亮的元素
    popover: {
      title: '全屏按钮', // 引导标题
      description: '点击可全屏/关闭全屏', // 引导描述
      position: 'left' // 引导出现的位置
    }
  },
  {
    element: '#btn-driver', // 显示高亮的元素
    popover: {
      title: '引导按钮', // 引导标题
      description: '点击进行简单引导', // 引导描述
      position: 'left' // 引导出现的位置
    }
  },
  {
    element: '#driver-info', // 显示高亮的元素
    popover: {
      title: '个人信息', // 引导标题
      description: '点击可修改密码/退出系统', // 引导描述
      position: 'left' // 引导出现的位置
    }
  },
  {
    element: '#driver-tagbar', // 显示高亮的元素
    popover: {
      title: 'tag栏', // 引导标题
      description: '点击可快速切换页面', // 引导描述
      position: 'bottom' // 引导出现的位置
    }
  }
]

export default steps
