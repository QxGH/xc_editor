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
    ...mapState(["design", "designEditID", "editorList", "editorIndex"])
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
    ...mapMutations(["CHANGE_DESIGN_TEMPLATE", "CHANGE_EDITOR_LIST"]),
    changeHandle() {
      let design = this.design;
      let templateSetting = design.template[this.designEditID].setting;
      let templateData = design.template[this.designEditID].data;
      templateData[this.editorIndex].setting = this.setting;

      let template = {
        key: this.designEditID,
        data: {
          setting: templateSetting,
          data: templateData
        }
      };
      this.CHANGE_DESIGN_TEMPLATE(template);
    },
    selectorLinkHandle() {
      // this.currentLinkID = id;
      this.showLinkSelector = true;
    },
    submitLinkHandle(val) {
      if (val.id && val.type && val.label && val.url) {
        let editorList = this.editorList;
        let editorIndex = this.editorIndex;
        editorList[editorIndex].setting.children[
          this.settingFreeComponentIndex
        ].setting.link = val;
        this.currentLinkObj = val;
        this.CHANGE_EDITOR_LIST(editorList);
        this.tellParent();
      }
      this.showLinkSelector = false; // 显示图片选择器
    },
    tellParent() {
      this.$emit("refreshState", "");
    }
  }
};
</script>

<style>
@import url("./style/index.min.css");
</style>