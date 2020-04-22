import Vue from 'vue'
import Vuex from 'vuex'
import deepClone from '@/tools/deepClone'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    design: {}, // 编辑器数据
    designEditID: '', // 编辑器 当前编辑页面的id
    designEditIndex: '',  // 编辑器 当前页面编辑的组件的index
  },
  getters: {
    designEditData: (state) => {
      // 当前编辑页面的数据
      let data = deepClone(state.design.template[state.designEditID]);
      return data;
    },
    designNavData: (state) => {
      // 底部导航数据
      return state.design.data.nav;
    }
  },
  mutations: {
    CHANGE_DESIGN(state, val) {
      // 修改编辑器数据
      state.design = val;
    },
    CHANGE_DESIGN_DATA(state, val) {
      // 修改编辑器 公用数据
      state.design.data[val.key] = val.data;
    },
    CHANGE_DESIGN_NAV(state, val) {
      // 修改编辑器 nav 数据
      state.design.data.nav = val;
    },
    CHANGE_DESIGN_NAV_MAX(state, val) {
      // 修改编辑器 nav max id
      state.design.data.nav.navMaxID = val;
    },
    CHANGE_DESIGN_TEMPLATE(state, val) {
      // 修改模板数据
      // Vue.set(state.design.template, [val.key], val.data)
      state.design.template[val.key] = val.data;
    },
    CHANGE_DESIGN_TEMPLATE_MAX(state, val) {
      // 修改 模板 max id
      state.design.data.templateMaxID = val;
    },
    DELETE_DESIGN_TEMPLATE(state, val) {
      // 删除 编辑器模板数据
      delete state.design.template[val];
    },
    CHANGE_DESIGN_GROUP(state, val) {
      // 修改 页面管理 分组数据
      state.design.group = val;
    },
    CHANGE_DESIGN_EDIT_ID (state, val) {
      // 修改当前编辑的模板id
      state.designEditID = val;
    },
    CHANGE_DESIGN_EDIT_INDEX (state, val) {
      // 修改当前模板 编辑组件的 index 
      state.designEditIndex = val;
    }
  },
  actions: {},
  modules: {}
})
