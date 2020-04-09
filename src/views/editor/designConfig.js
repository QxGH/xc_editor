const design = { // 编辑器数据
  data: {
    templateMax: 1,
    componentsMax: 0,
    nav: {
      hide: false,
      navMax: 2,
      list: [
        {
          id: 'nav-1',
          name: '首页',
          icon: {
            id: 'home',
            label: '首页',
            unChecked: 'icon-home',
            checked: 'icon-home-s'
          },
          event: {
            id: 'home',
            type: '',
            label: '',
            url: ''
          }
        }, {
          id: 'nav-2',
          name: '我的',
          icon: {
            id: 'user',
            label: '我的',
            unChecked: 'icon-user',
            checked: 'icon-user-s'
          },
          event: {
            id: 'userCenter',
            type: '',
            label: '',
            url: ''
          }
        }
      ]
    }
  },
  template: {
    'userCenter': {
      setting: {
        "name": "个人中心【系统页面】",
        "pageBgColor": "#FFFFFF",
        "navBgColor": "#FFFFFF",
        "navTitColor": "black",
        "shareDescribe": "",
        "shareImage": ""
      },
      data: []
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
      data: []
    }
  },
  group: {
    system: [
      'userCenter'
    ],
    custom: {
      'template-1': []
    }
  }
};


export default design;