<template>
  <div class="free-container-setting">
    <div class="setting-title">自由容器组件</div>
    <el-form ref="settingForm" :model="setting" label-width="100px">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="模块设置" name="1">
          <el-form-item label="模块名称：">
            <div class="template-name clearfix">
              <el-input v-model="setting.name" @change="changeHandle" placeholder="请输入模块名称" maxlength="10" show-word-limit></el-input>
              <el-checkbox v-model="setting.hideName" @change="changeHandle">隐藏</el-checkbox>
            </div>
          </el-form-item>
          <el-form-item label="容器高度：">
            <el-input-number
              v-model="setting.height"
              @change="changeHandle"
              controls-position="right"
              :min="40"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="下方间隔：">
            <el-input-number
              v-model="setting.marginBottom"
              @change="changeHandle"
              controls-position="right"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "freeOmnipotentSetting",
  data() {
    return {};
  },
  computed: {
    ...mapState(["design", "designEditID", "designEditIndex"])
  },
  props: {
    setting: {
      type: Object
    },
    settingFreeComponentIndex: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  data() {
    return {
      activeNames: "1"
    };
  },
  methods: {
    ...mapMutations(["CHANGE_DESIGN_TEMPLATE"]),
    changeHandle() {
      let templateNormal = this.design.template[this.designEditID];
      let templateData = templateNormal.data;
      templateData[this.designEditIndex].setting = this.setting;

      let template = {
        key: this.designEditID,
        data: {
          ...templateNormal,
          data: templateData
        }
      };
      this.CHANGE_DESIGN_TEMPLATE(template);
    },
  }
};
</script>

<style>
@import url("./style/index.min.css");
</style>