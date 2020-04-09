<template>
  <div class="header-main clearfix">
    <!-- <el-button type="primary" @click="fillData">填充数据</el-button>
    <el-button type="primary" @click="JsonDialog = true">页面数据</el-button>
    <el-button type="primary" @click="save">保存页面</el-button> -->
    <div class="tabs-btn-box clearfix">
      <button class="tabs-btn" :class="{'active': asideTabsActive === 'page'}" @click="changeTabs('page')">页面管理</button>
      <button class="tabs-btn" :class="{'active': asideTabsActive === 'components'}" @click="changeTabs('components')">装修组件</button>
    </div>
    <div class="middle">
      主题色
      <i class="el-icon-arrow-right"></i>
    </div>
    <div class="opt-btn-box">
      <button class="btn blue-btn">保存并预览</button>
      <button class="btn white-btn" @click="save">仅保存</button>
      <button class="btn white-btn">返回平台</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Header",
  props: ['asideTabsActive'],
  computed: {
    ...mapState([
      "editorList",
      "editorNav",
      "editorCurrentPage",
      "editorPageData"
    ])
  },
  methods: {
    ...mapMutations(["CHANGE_EDITOR_PAGE_DATA"]),
    changeTabs(val) {
      this.$emit('changeTabs', val)
    },
    fillData() {
      // 填充数据
      this.$api.editor.getEditor().then(res => {
        if (res.data.code === 0) {
          this.CHANGE_EDITOR_PAGE_DATA(res.data.data.list);
        } else {
          this.$message.warning("获取数据失败!");
        }
      });
    },
    save() {
      // 保存页面；
      let editorPageData = this.deepClone(this.editorPageData);
      let editorCurrentPage = this.deepClone(this.editorCurrentPage);
      let editorList = this.deepClone(this.editorList);
      let editorNav = this.deepClone(this.editorNav);
      let pageSetting = editorCurrentPage.setting;

      for (let [index, item] of editorPageData.entries()) {
        if (item.id == editorCurrentPage.parent) {
          if (editorCurrentPage.type == "parent") {
            item.data = editorList;
            item.nav = editorNav;
            item.setting = pageSetting;
          } else if (editorCurrentPage.type == "children") {
            for (let [childIndex, childrenItem] of item.children.entries()) {
              if (childrenItem.id == editorCurrentPage.children) {
                childrenItem.data = editorList;
                childrenItem.nav = editorNav;
                childrenItem.setting = pageSetting;
                break;
              }
            }
          }
          break;
        }
      }
      this.CHANGE_EDITOR_PAGE_DATA(editorPageData);
      this.$message.success("保存成功！");
    },
    deepClone(target) {
      // 定义一个变量
      let result;
      // 如果当前需要深拷贝的是一个对象的话
      if (typeof target === "object") {
        // 如果是一个数组的话
        if (Array.isArray(target)) {
          result = []; // 将result赋值为一个数组，并且执行遍历
          for (let i in target) {
            // 递归克隆数组中的每一项
            result.push(this.deepClone(target[i]));
          }
          // 判断如果当前的值是null的话；直接赋值为null
        } else if (target === null) {
          result = null;
          // 判断如果当前的值是一个RegExp对象的话，直接赋值
        } else if (target.constructor === RegExp) {
          result = target;
        } else {
          // 否则是普通对象，直接for in循环，递归赋值对象的所有值
          result = {};
          for (let i in target) {
            result[i] = this.deepClone(target[i]);
          }
        }
        // 如果不是对象的话，就是基本数据类型，那么直接赋值
      } else {
        result = target;
      }
      // 返回最终结果
      return result;
    }
  }
};
</script>

<style>
@import url("./style/index.min.css");
</style>