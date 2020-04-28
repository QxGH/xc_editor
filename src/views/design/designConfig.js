const design = { // 编辑器数据
  data: {
    pageMaxID: 1,
    componentsMaxID: 0,
    themeColor: {
      background: "#ffffff",
      color: "#000000"
    },
    tabbar: {
      type: 'tabbar',
      tabbarMaxID: 1,
      data: {
        hide: false,
        color: "#333333",
        selectedColor: "#1890FF",
        backgroundColor: "#ffffff",
        list: [
          {
            id: 'tabbar-1',
            title: '首页',
            icon: {
              id: 'home',
              unChecked: 'icon-home',
              checked: 'icon-home-s'
            },
            link: {
              type: "system",
              name: "首页",
              source: {
                router: "pages/homePage/index",
                alias: "cart"
              }
            }
          }
        ],
      },
      customFeature: {
        tabBarConfig: {
          color: "#333333",
          selectedColor: "#1890FF",
          backgroundColor: "#ffffff",
          list: [
            {
              pagePath: "pages/homePage/index",
              text: "首页",
              iconPath: "/static/tab_bar_icons/common/home_06.png",
              selectedIconPath: "/static/tab_bar_icons/common/home_07.png"
            }
          ]
        }
      }
    }
  },
  template: {
    'userCenter': {
      setting: {
        "name": "我的",
        "pageBgColor": "#FFFFFF",
        "navBgColor": "#FFFFFF",
        "navTitColor": "#000000",
        "shareDescribe": "",
        "shareImage": ""
      },
      type: 'system',
      data: [
        {
          id: 'userCenter',
          label: 'userCenter',
          name: '我的',
          type: 'system',
          previewComponent: 'UserCenter',
          settingComponent: '',
          version: 1,
          setting: {}
        }
      ]
    },
    'page-1': {
      setting: {
        "name": "新建页面",
        "pageBgColor": "#FFFFFF",
        "navBgColor": "#FFFFFF",
        "navTitColor": "#000000",
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
        name: '个人中心'
      }
    ],
    custom: [
      {
        id: "page-1",
        name: '新建页面',
        children: []
      }
    ]
  }
};


export default design;