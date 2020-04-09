<template>
  <div class="page-setting">
    <div class="setting-title">页面设置</div>
    <el-form ref="pageSettingForm" :model="setting" label-width="110px">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基础设置" name="1">
          <el-form-item label="页面名称：">
            <el-input v-model="setting.name" maxlength="10" show-word-limit @input="changeHandle"></el-input>
          </el-form-item>
          <el-form-item label="页面背景色：">
            <el-color-picker v-model="setting.pageBgColor" @change="changeHandle"></el-color-picker>
            <span class="color-tips">{{setting.pageBgColor}}</span>
          </el-form-item>
          <el-form-item label="导航栏背景色：">
            <el-color-picker v-model="setting.navBgColor" @change="changeHandle"></el-color-picker>
            <span class="color-tips">{{setting.navBgColor}}</span>
          </el-form-item>
          <el-form-item label="导航栏标题色：">
            <el-radio-group v-model="setting.navTitColor" @change="changeHandle">
              <el-radio label="black">黑色</el-radio>
              <el-radio label="white">白色</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="分享设置" name="2">
          <el-form-item label="页面分享描述：">
            <el-input
              type="textarea"
              :rows="3"
              maxlength="30"
              show-word-limit
              placeholder="请输入页面分享描述"
              v-model="setting.shareDescribe"
              @input="changeHandle"
            ></el-input>
          </el-form-item>
          <el-form-item label="页面分享图片：">
            <div class="upload-selecctor">
              <img v-show="setting.shareImage" :src="setting.shareImage" alt="" class="img">
              <span class="tips">更换图片</span>
              <input type="file" class="file-input" title="" >
            </div>
            <span class="upload-tips">
              建议尺寸：200*200px
            </span>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>

    <!-- <el-input
      v-model="setting.name"
      placeholder="请输入内容"
      @input="textChange"
      maxlength="5"
      show-word-limit
    ></el-input>
    <el-divider>导航栏背景色</el-divider>
    <el-color-picker v-model="setting.navBgColor" @change="colorChange"></el-color-picker>-->
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "PageSetting",
  props: ["setting"],
  computed: {
    ...mapState(["editorCurrentPage"])
  },
  data() {
    return {
      activeNames: ["1", "2"]
    };
  },
  methods: {
    ...mapMutations(["CHANGE_EDITOR_CURRENT_PAGE"]),
    changeHandle() {
      let currentPage = this.editorCurrentPage;
      currentPage.setting = this.setting;
      this.CHANGE_EDITOR_CURRENT_PAGE(currentPage);
    }
  },
  filters: {
    upperCase(val) {
      // 转换大写
      return val.toUpperCase();
    }
  }
};
</script>

<style>
@import url("./style/index.min.css");
</style>