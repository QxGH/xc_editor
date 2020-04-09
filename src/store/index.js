import Vue from 'vue'
import Vuex from 'vuex'
import { diff } from "json-diff";
import uuidV4 from 'uuid/v4'
import deepClone from '@/tools/deepClone'
import { isUndefined, isNull } from '@/tools/typeof'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    design: { // 编辑器数据
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

      },
      group: {
        
        system: [
          'userCenter'
        ],
        custom: {
          'template-1': [
            'template-2',
            'template-3'
          ],
          'template-4': [
            'template-5',
            'template-6'
          ],
        }
      }
    },
    editorList: [], // 当前页面数据
    editorIndex: '',  // 当前页面编辑的组件 index
    editorNav: [],  // 底部导航数据
    editorCurrentPage: {  // 页面管理 当前选择页面数据
      type: '', // 父级 还是子级
      parent: '', // 父级 id
      children: '', // 子级 id
      setting: {  // 设置项
        name: '新建页面',
        pageBgColor: '#FFFFFF',
        navBgColor: '#FFFFFF',
        navTitColor: 'black',   // black / white
        shareDescribe: '', // 页面分享描述
        shareImage: ''  // 页面分享图片
      },
      nav: {
        hide: false,
        list: [{
          id: '1',
          icon: 'icon-home',
          text: 'home'
        }]
      }
    },
    editorPageData: []  // 全部页面数据
  },
  mutations: {
    CHANGE_EDITOR_LIST(state, newVal) {
      state.editorList = newVal
      // let val = deepClone(newVal);
      // // 判断是否有值
      // if(!isUndefined(val) && !isNull(val)) {
      //   // 判断是否是空数组
      //   if(Array.isArray(val) && val.length == 0) {
      //     state.editorList = val
      //   } else {
      //     // 不是空数组 对比数据
      //     let diffRes = diff(state.editorList, val)
      //     console.log('CHANGE_EDITOR_LIST')
      //     // console.log(diffRes)
      //     // console.log(state.editorList)
      //     // console.log(val)
      //     // console.log('CHANGE_EDITOR_LIST /')
      //     if(diffRes) {
      //       // 赋值改变了的数据
      //       for(let [index, item] of diffRes.entries()) {
      //         if(item.length > 1 && val[index]) {
      //           state.editorList[index] = val[index]
      //         }
      //       };
      //     };
      //   }
      // }
    },
    CHANGE_NAVBAR_LIST(state, val) {
      state.editorNav = val;
    },
    CHANGE_EDITOR_INDEX(state, val) {
      state.editorIndex = val;
    },
    CHANGE_EDITOR_PAGE_DATA(state, val) {
      state.editorPageData = val
      // let diffRes = diff(state.editorPageData, val);
      // if (diffRes && val) {
      //   for (let [index, item] of diffRes.entries()) {
      //     if (item.length > 1 && val[index]) {
      //       state.editorPageData[index] = val[index]
      //     }
      //   };
      // };
    },
    CHANGE_EDITOR_CURRENT_PAGE(state, val) {
      state.editorCurrentPage = val;
    },
  },
  actions: {},
  modules: {}
})
