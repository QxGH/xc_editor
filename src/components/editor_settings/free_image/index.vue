<template>
  <div class="free-image-setting">
    <div class="setting-title">图片组件</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="模块设置" name="1">
        <el-form ref="settingForm" :model="containerData" label-width="100px">
          <el-form-item label="模块名称：">
            <div class="template-name clearfix">
              <el-input
                v-model="containerData.name"
                @change="containerChange"
                placeholder="请输入模块名称"
                maxlength="10"
                show-word-limit
              ></el-input>
              <el-checkbox v-model="containerData.hideName" @change="containerChange">隐藏</el-checkbox>
            </div>
          </el-form-item>
          <el-form-item label="容器高度：">
            <el-input-number
              v-model="containerData.height"
              @change="containerChange"
              controls-position="right"
              :min="40"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="下方间隔：">
            <el-input-number
              v-model="containerData.marginBottom"
              @change="containerChange"
              controls-position="right"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="图片设置" name="2">
        <el-form ref="imageSettingForm" :model="setting" label-width="100px">
          <el-form-item label="图片设置：">
            <div class="upload-selecctor">
              <img v-show="setting.shareImage" :src="setting.shareImage" alt class="img" />
              <span class="tips">更换图片</span>
              <input type="file" class="file-input" title />
            </div>
            <span class="upload-tips">建议尺寸：400*300px</span>
          </el-form-item>
          <el-form-item label="图片宽度：">
            <el-input-number
              v-model="setting.width"
              @change="changeHandle"
              controls-position="right"
              :min="40"
              :max="375"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="图片高度：">
            <el-input-number
              v-model="setting.height"
              @change="changeHandle"
              controls-position="right"
              :min="40"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="点击事件：">
            <div class="link-selector">
              <button
                class="selector-btn"
                @click="selectorLinkHandle"
                v-show="!setting.link.name"
              >设置点击事件</button>
              <div class="selector-input-group" v-show="setting.link.name">
                <div class="selector-input">{{setting.link.type + ' | ' +setting.link.name}}</div>
                <button class="clear-btn" @click="delLinkHandle">
                  <i class="el-icon-close icon"></i>
                </button>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <LinkSelector v-if="showLinkSelector" :link="setting.link" @submitLink="submitLinkHandle"></LinkSelector>
    <!-- <el-divider>图片</el-divider>
    <div class="image-selector" @click="selectorImageHandle">
      <el-image style="width: 100px; height: 100px" :src="setting.imageUrl" fit="contain"></el-image>
    </div>
    <ImageSelector v-if="showImageSelector" :imageID="currentImageID" @submitImage="submitImageHandle"></ImageSelector>-->
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import ImageSelector from "../../common/image_selector";
import LinkSelector from "../../common/link_selector";

export default {
  name: "freeTextSetting",
  data() {
    return {
      activeNames: ["1", "2"],
      containerData: {},  // 父级模块数据
      showLinkSelector: false,
      showImageSelector: false, // 是否显示图片选择器
      currentImageID: "default" //当前选中图片id
    };
  },
  computed: {
    ...mapState(["design", "designEditID", "editorList", "editorIndex"]),
    ...mapGetters(["designEditData"])
  },
  watch: {
    designEditData: {
      immediate: true,
      deep: true,
      handler(val) {
        this.containerData = this.designEditData.data[this.editorIndex].setting
      }
    }
  },
  components: {
    ImageSelector,
    LinkSelector
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
  methods: {
    ...mapMutations(["CHANGE_DESIGN_TEMPLATE", "CHANGE_EDITOR_LIST"]),
    changeHandle() {
      let design = this.design;
      let templateSetting = design.template[this.designEditID].setting;
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
    containerChange() {
      let design = this.design;
      let templateSetting = design.template[this.designEditID].setting;
      let templateData = design.template[this.designEditID].data;
      templateData[this.editorIndex].setting = this.containerData;
      let template = {
        key: this.designEditID,
        data: {
          setting: templateSetting,
          data: templateData
        }
      };
      this.CHANGE_DESIGN_TEMPLATE(template);
    },
    delLinkHandle() {
      this.setting.link = {};
      this.changeHandle();
    },
    selectorLinkHandle() {
      this.showLinkSelector = true;
    },
    submitLinkHandle(val) {
      if (val.id) {
        let design = this.design;
        let templateSetting = design.template[this.designEditID].setting;
        let templateData = design.template[this.designEditID].data;
        templateData[this.editorIndex].setting.children[
          this.settingFreeComponentIndex
        ].setting.link = val;

        let template = {
          key: this.designEditID,
          data: {
            setting: templateSetting,
            data: templateData
          }
        };
        this.CHANGE_DESIGN_TEMPLATE(template);
      }
      this.showLinkSelector = false; // 显示图片选择器
    },
    selectorImageHandle() {
      this.currentImageID = this.setting.imageID;
      this.showImageSelector = true; // 显示图片选择器
    },
    submitImageHandle(val) {
      let editorList = this.editorList;
      let editorIndex = this.editorIndex;
      // console.log(this.settingFreeComponentIndex)
      // let setting = editorList[editorIndex].setting.children[this.settingFreeComponentIndex].setting;
      // setting.color = val;
      if (val.imageID && val.imageUrl) {
        editorList[editorIndex].setting.children[
          this.settingFreeComponentIndex
        ].setting.imageID = val.imageID;
        editorList[editorIndex].setting.children[
          this.settingFreeComponentIndex
        ].setting.imageUrl = val.imageUrl;
        // editorList[editorIndex].setting = setting;
        this.CHANGE_EDITOR_LIST(editorList);
        this.tellParent();
      }

      this.showImageSelector = false; // 显示图片选择器
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