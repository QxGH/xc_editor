const design = { // 编辑器数据
  data: {
    templateMaxID: 1,
    componentsMaxID: 0,
    nav: {
      hide: false,
      navMaxID: 1,
      unCheckedTextColor: '#333333',
      checkedTextColor: '#1890FF',
      list: [
        {
          id: 'nav-1',
          title: '首页',
          icon: {
            id: 'home',
            label: '首页',
            unChecked: 'icon-home',
            checked: 'icon-home-s'
          },
          link: null
        }
      ]
    }
  },
  template: {
    'userCenter': {
      setting: {
        "name": "我的",
        "pageBgColor": "#FFFFFF",
        "navBgColor": "#FFFFFF",
        "navTitColor": "black",
        "shareDescribe": "",
        "shareImage": ""
      },
      type: 'system',
      data: [
        {
          id: 'UserCenter',
          label: 'UserCenter',
          name: '我的',
          type: 'system',
          previewComponent: 'UserCenter',
          settingComponent: 'systemSetting',
          version: 1,
          setting: {}
        }
      ]
    },
    'template-1': {
      setting: {
        "name": "新建页面",
        "pageBgColor": "#FFFFFF",
        "navBgColor": "#FFFFFF",
        "navTitColor": "black",
        "shareDescribe": "",
        "shareImage": ""
      },
      type: 'custom',
      data: []
    }
  },
  group: {
    system: [
      {
        id: 'userCenter',
        name: '个人中心【系统页面】'
      }
    ],
    custom: [
      {
        id: "template-1",
        name: '新建页面',
        children: []
      }
    ]
  }
};


export default design;