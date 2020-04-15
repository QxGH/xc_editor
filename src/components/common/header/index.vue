<template>
  <div class="header-main clearfix">
    <div class="tabs-btn-box clearfix">
      <button
        class="tabs-btn"
        :class="{'active': asideTabsActive === 'page'}"
        @click="changeTabs('page')"
      >页面管理</button>
      <button
        class="tabs-btn"
        :class="{'active': asideTabsActive === 'components'}"
        @click="changeTabs('components')"
      >装修组件</button>
    </div>
    <div class="middle">
      主题色
      <i class="el-icon-arrow-right"></i>
    </div>
    <div class="opt-btn-box">
      <button class="btn blue-btn" @click="preview">保存并预览</button>
      <button class="btn white-btn" @click="save">仅保存</button>
      <button class="btn white-btn">返回平台</button>
    </div>
    <el-dialog title="效果预览" custom-class="preview-dialog" :visible.sync="previewDialog" width="455px" center :modal-append-to-body="false">
      <div class="dialog-body">
        <div class="qrcode-box">
          <img src="" alt="" class="img">
        </div>
        <p class="tips">微信扫码预览</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="previewDialog = false">关  闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Header",
  data() {
    return {
      previewDialog: false
    }
  },
  props: ["asideTabsActive"],
  computed: {
    ...mapState(["designEditID"])
  },
  methods: {
    changeTabs(val) {
      this.$emit("changeTabs", val);
    },
    preview() {
      this.previewDialog = true;
    },
    save() {
      // 保存页面；
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