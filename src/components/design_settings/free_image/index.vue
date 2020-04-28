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
              v-model="containerData.style.marginBottom"
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
            <div class="upload-selecctor" @click="checkImageHandle">
              <img v-show="setting.imageUrl" :src="setting.imageUrl" alt class="img" />
              <span class="tips">更换图片</span>
              <!-- <input type="file" class="file-input" title /> -->
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
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <LinkSelector v-if="showLinkSelector" :link="setting.link" @submitLink="submitLinkHandle"></LinkSelector>
    <ImageManage :limit="1" @checkedImage="checkedImageHandle" v-if="showImageManage"></ImageManage>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import ImageManage from "@/components/common/image_manage";
import LinkSelector from "../../common/link_selector";

export default {
  name: "freeTextSetting",
  data() {
    return {
      activeNames: ["1", "2"],
      containerData: {},  // 父级模块数据
      showLinkSelector: false,
      showImageManage: false, // 显示图片库
    };
  },
  computed: {
    ...mapState(["design", "designEditID", "designEditIndex"]),
    ...mapGetters(["designEditData"])
  },
  watch: {
    designEditData: {
      immediate: true,
      deep: true,
      handler(val) {
        this.containerData = this.designEditData.data[this.designEditIndex].setting
      }
    }
  },
  components: {
    ImageManage,
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
    containerChange() {
      let templateNormal = this.design.template[this.designEditID];
      let templateData = templateNormal.data;
      templateData[this.designEditIndex].setting = this.containerData;
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
    },
    checkImageHandle() {
      this.showImageManage = true;
    },
    checkedImageHandle(val) {
      this.showImageManage = false;
      if(val.length > 0) {
        this.setting.imageUrl = val[0].src;
        this.changeHandle();
      };
    }
  }
};
</script>

<style>
@import url("./style/index.min.css");
</style>