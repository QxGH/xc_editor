<template>
  <div class="free-omnipotent-setting">
    <div class="setting-title">万能热区组件</div>
    <el-form ref="settingForm" :model="setting" label-width="100px">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="模块设置" name="1">
          <el-form-item label="热区宽度：">
            <el-input-number v-model="setting.width" @change="changeHandle" controls-position="right" :min="40" :max="375" ></el-input-number>
          </el-form-item>
          <el-form-item label="热区高度：">
            <el-input-number v-model="setting.height" @change="changeHandle" controls-position="right" :min="40" ></el-input-number>
          </el-form-item>
          <el-form-item label="点击事件：">
            <div class="link-selector">
              <button class="selector-btn" v-show="!setting.link.label">设置点击事件</button>
              <div class="selector-input-group" v-show="setting.link.label">
                <input class="selector-input" type="text" v-model="setting.link.label">
                <button class="clear-btn">
                  <i class="el-icon-close icon"></i>
                </button>
              </div>
            </div>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <!-- <el-divider>点击事件</el-divider>
    <el-button type="primary" plain @click="selectorLinkHandle">选择链接</el-button>
    <span class="link-tips" v-if="currentLinkObj.label">已设置：{{currentLinkObj.label}}</span>

    <LinkSelector
      v-if="showLinkSelector"
      :linkID="currentLinkID"
      @submitLink="submitLinkHandle"
    ></LinkSelector> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import LinkSelector from "../../common/link_selector"


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
  data(){
    return {
      activeNames: '1',
      currentLinkObj: {},
      showLinkSelector: false,  // 是否显示链接选择器
      currentLinkID: "", // 当前选中链接id
    }
  },
  components: {
    LinkSelector
  },
  created(){
    this.currentLinkObj = this.setting.link;
    this.currentLinkID = this.setting.link.id;
  },
  methods: {
    ...mapMutations(["CHANGE_DESIGN_TEMPLATE", "CHANGE_EDITOR_LIST"]),
    changeHandle() {
      let design = this.design;
      let templateSetting = design.template[this.designEditID].setting
      let templateData = design.template[this.designEditID].data;
      templateData[this.editorIndex].setting.children[
        this.settingFreeComponentIndex
      ].setting = this.setting;

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
@import url('./style/index.min.css');
</style>