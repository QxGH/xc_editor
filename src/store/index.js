import Vue from 'vue'
import Vuex from 'vuex'
import { diff } from "json-diff";
import uuidV4 from 'uuid/v4'
import deepClone from '@/tools/deepClone'
import { isUndefined, isNull } from '@/tools/typeof'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    design: {}, // 编辑器数据
    designEditID: '', // 编辑器 当前编辑页面的id
    designEditIndex: '',  //// 编辑器 当前页面编辑的组件的index
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
  getters: {
    designEditData: (state) => {
      // 当前编辑页面的数据
      return state.design.template[state.designEditID];
    },
    designNavData: (state) => {
      // 底部导航数据
      return state.design.data.nav;
    }
  },
  mutations: {
    CHANGE_DESIGN(state, val) {
      state.design = val;
    },
    CHANGE_DESIGN_DATA(state, val) {
      state.design.data[val.key] = val.data;
    },
    CHANGE_DESIGN_NAV(state, val) {
      state.design.data.nav = val;
    },
    CHANGE_DESIGN_NAV_MAX(state, val) {
      state.design.data.nav.navMaxID = val;
    },
    CHANGE_DESIGN_TEMPLATE(state, val) {
      state.design.template[val.key] = val.data;
    },
    DELETE_DESIGN_TEMPLATE(state, val) {
      delete state.design.template[val];
    },
    CHANGE_DESIGN_GROUP(state, val) {
      state.design.group = val;
    },
    CHANGE_DESIGN_EDIT_ID (state, val) {
      state.designEditID = val;
    },
    CHANGE_DESIGN_EDIT_INDEX (state, val) {
      state.designEditIndex = val;
    },
    CHANGE_DESIGN_TEMPLATE_MAX(state, val) {
      state.design.data.templateMaxID = val;
    },
    CHANGE_EDITOR_LIST(state, newVal) {
      state.editorList = newVal
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
