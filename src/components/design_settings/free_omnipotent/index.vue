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
              <button
                class="selector-btn"
                @click="selectorLinkHandle"
                v-if="!setting.link"
              >设置点击事件</button>
              <div class="selector-input-group" v-else>
                <div class="selector-input">{{setting.link.type + ' | ' +setting.link.name}}</div>
                <button class="clear-btn" @click="delLinkHandle">
                  <i class="el-icon-close icon"></i>
                </button>
              </div>
            </div>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <LinkSelector v-if="showLinkSelector" :link="setting.link" @submitLink="submitLinkHandle"></LinkSelector>

    <!-- <el-divider>点击事件</el-divider>
    <el-button type="primary" plain @click="selectorLinkHandle">选择链接</el-button>
    <span class="link-tips" v-if="currentLinkObj.label">已设置：{{currentLinkObj.label}}</span>
-->
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
  methods: {
    ...mapMutations(["CHANGE_DESIGN_TEMPLATE"]),
    changeHandle() {
      let templateNormal = this.design.template[this.designEditID];
      let templateData = templateNormal.data;
      templateData[this.designEditIndex].setting.children[
        this.settingFreeComponentIndex
      ].setting = this.setting;

      let template = {
        key: this.designEditID,
        data: {
          ...templateNormal,
          data: templateData
        }
      };
      this.CHANGE_DESIGN_TEMPLATE(template);
    },
    delLinkHandle() {
      this.setting.link = null;
      this.changeHandle();
    },
    selectorLinkHandle() {
      this.showLinkSelector = true;
    },
    submitLinkHandle(val) {
      if (val) {
        let templateNormal = this.design.template[this.designEditID];
        let templateData = templateNormal.data;
        templateData[this.designEditIndex].setting.children[
          this.settingFreeComponentIndex
        ].setting.link = val;

        let template = {
          key: this.designEditID,
          data: {
            ...templateNormal,
            data: templateData
          }
        };
        this.CHANGE_DESIGN_TEMPLATE(template);
      }
      this.showLinkSelector = false; // 显示图片选择器
    }
  }
};
</script>

<style>
@import url('./style/index.min.css');
</style>