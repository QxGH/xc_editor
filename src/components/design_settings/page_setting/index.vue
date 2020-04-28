<template>
  <div class="page-setting">
    <div class="setting-title">页面设置</div>
    <el-form ref="pageSettingForm" :model="setting_" label-width="110px">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基础设置" name="1">
          <el-form-item label="页面名称：">
            <el-input v-model="setting_.name" maxlength="10" show-word-limit @input="changeHandle"></el-input>
          </el-form-item>
          <el-form-item label="页面背景色：">
            <el-color-picker v-model="setting_.pageBgColor" @change="changeHandle"></el-color-picker>
            <span class="color-tips">{{setting_.pageBgColor}}</span>
          </el-form-item>
          <el-form-item label="导航栏背景色：">
            <el-color-picker v-model="setting_.navBgColor" @change="changeHandle"></el-color-picker>
            <span class="color-tips">{{setting_.navBgColor}}</span>
          </el-form-item>
          <el-form-item label="导航栏标题色：">
            <el-radio-group v-model="setting_.navTitColor" @change="changeHandle">
              <el-radio label="#000000">黑色</el-radio>
              <el-radio label="#ffffff">白色</el-radio>
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
              v-model="setting_.shareDescribe"
              @input="changeHandle"
            ></el-input>
          </el-form-item>
          <el-form-item label="页面分享图片：">
            <div class="upload-selecctor">
              <img v-show="setting_.shareImage" :src="setting_.shareImage" alt="" class="img">
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
import { mapState, mapGetters, mapMutations } from "vuex";
import deepClone from '@/tools/deepClone'

export default {
  name: "PageSetting",
  props: ["setting"],
  watch: {
    setting: {
      immediate: true,
      deep: true,
      handler(val) {
        this.setting_ = deepClone(val);
      }
    }
  },
  computed: {
    ...mapState(["design", "designEditID"])
  },
  data() {
    return {
      activeNames: ["1", "2"],
      setting_: {}
    };
  },
  methods: {
    ...mapMutations(["CHANGE_DESIGN_TEMPLATE", "CHANGE_DESIGN_GROUP"]),
    ...mapGetters(["designEditData"]),
    changeHandle(val) {
      let templateNormal = this.design.template[this.designEditID];
      // let templateSetting = templateNormal.setting;
      let templateSetting = this.setting_;

      let template = {
        key: this.designEditID,
        data: {
          ...templateNormal,
          setting: templateSetting
        }
      };
      this.CHANGE_DESIGN_TEMPLATE(template);
      this.changeGroup(template.data.type, template.key, template.data.setting.name)
    },
    changeGroup(type, key, name) {
      let group = this.design.group;
      for(let item of group[type]) {
        if(item.id == key) {
          item.name = name;
          break;
        }
      };
      this.CHANGE_DESIGN_GROUP(group)
    }
  }
};
</script>

<style>
@import url("./style/index.min.css");
</style>