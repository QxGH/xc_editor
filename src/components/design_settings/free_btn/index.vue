<template>
  <div class="free-btn-setting">
    <div class="setting-title">按钮组件</div>
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
      <el-collapse-item title="按钮设置" name="2">
        <el-form ref="btnSettingForm" :model="setting" label-width="90px">
          <div class="custom-form-item">
            <label class="custom-form-label">按钮样式：</label>
            <ul class="btn-style-list clearfix">
              <li
                class="item"
                :class="{'active': setting.style == 'primary'}"
                @click="changeBtnStyle('primary')"
              >
                <el-button type="primary">按钮</el-button>
              </li>
              <li
                class="item"
                :class="{'active': setting.style == 'plain'}"
                @click="changeBtnStyle('plain')"
              >
                <el-button plain>按钮</el-button>
              </li>
              <li
                class="item"
                :class="{'active': setting.style == 'primaryRound'}"
                @click="changeBtnStyle('primaryRound')"
              >
                <el-button type="primary" round>按钮</el-button>
              </li>
              <li
                class="item"
                :class="{'active': setting.style == 'plainRound'}"
                @click="changeBtnStyle('plainRound')"
              >
                <el-button round>按钮</el-button>
              </li>
            </ul>
          </div>
          <el-form-item label="按钮文本：">
            <el-input placeholder="请输入内容" v-model="setting.text" @input="changeHandle"></el-input>
          </el-form-item>
          <el-form-item label="文本字号：">
            <el-select v-model="setting.size" placeholder="请选择">
              <el-option
                v-for="item in fontSizeOption"
                :key="item"
                :label="item+'px'"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文本颜色：">
            <el-color-picker v-model="setting.color" @change="changeHandle"></el-color-picker>
            <span class="color-tips">{{setting.color}}</span>
          </el-form-item>
          <el-form-item label="按钮颜色：">
            <el-color-picker v-model="setting.bg" @change="changeHandle"></el-color-picker>
            <span class="color-tips">{{setting.bg}}</span>
          </el-form-item>
          <el-form-item label="按钮宽度：">
            <el-input-number
              v-model="setting.width"
              @change="changeHandle"
              controls-position="right"
              :min="40"
              :max="375"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="按钮高度：">
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
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import LinkSelector from "../../common/link_selector";

export default {
  name: "freeBtnSetting",
  data() {
    return {
      activeNames: ["1", "2"],
      containerData: {},
      fontSizeOption: [
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        18,
        20,
        24,
        30,
        36,
        48,
        60,
        72,
        84,
        96,
        108,
        120
      ],
      showLinkSelector: false // 是否显示链接选择器
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
    changeBtnStyle(val) {
      this.setting.style = val;
      this.changeHandle();
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
      if (val.id) {
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
@import url("./style/index.min.css");
</style>