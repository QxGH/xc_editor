<template>
  <div class="free-text-setting">
    <div class="setting-title">文本组件</div>
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
      <el-collapse-item title="文本内容" name="2">
        <el-form ref="pageSettingForm" :model="setting" label-width="110px">
          <el-form-item label="文本内容：">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="setting.text"
              @input="changeHandle"
            ></el-input>
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
          <el-form-item label="文本样式：">
            <ul class="style-list clearfix">
              <li class="item" :class="{'active': setting.style.bold}" @click="toBold">
                <i
                  class="icon"
                  style="background-image: url('https://cdn.xingchen.cn/FticSVCudBzXTZYSkDnpXpmN-C3k');"
                ></i>
              </li>
              <li class="item" :class="{'active': setting.style.italic}" @click="toItalic">
                <i
                  class="icon"
                  style="background-image: url('https://cdn.xingchen.cn/Fhoyd4mj9qbg8vPhjKC3SpuRbSCH');"
                ></i>
              </li>
              <li class="item" :class="{'active': setting.style.underline}" @click="toUnderline">
                <i
                  class="icon"
                  style="background-image: url('https://cdn.xingchen.cn/Fo4YFJThmad67HF6E4cwTv878xFC');"
                ></i>
              </li>
              <li class="item" :class="{'active': setting.style.align == 'left'}" @click="toLeft">
                <i
                  class="icon"
                  style="background-image: url('https://cdn.xingchen.cn/Fp7TJJaYTN4ut37-1W_tMj5vGrHJ');"
                ></i>
              </li>
              <li
                class="item"
                :class="{'active': setting.style.align == 'center'}"
                @click="toCenter"
              >
                <i
                  class="icon"
                  style="background-image: url('https://cdn.xingchen.cn/FjF-DhMjagFxzHyuB0-sf3f4rgnl');"
                ></i>
              </li>
              <li class="item" :class="{'active': setting.style.align == 'right'}" @click="toRight">
                <i
                  class="icon"
                  style="background-image: url('https://cdn.xingchen.cn/FrAqyb8rmgu7ieWFPjJv97160obe');"
                ></i>
              </li>
              <li class="item">
                <el-popover placement="top" v-model="lineHeightShow" width="80" trigger="click">
                  <div class="line-height-selector">
                    <vuescroll>
                      <template v-for="item in fontSizeOption">
                        <div class="item" :key="item" @click="selectLineHeight(item)">{{item+'px'}}</div>
                      </template>
                    </vuescroll>
                  </div>
                  <i
                    slot="reference"
                    class="icon"
                    style="background-image: url('https://cdn.xingchen.cn/FptQCxDDv33Zfg3pw3yLiZYyNdnJ');"
                  ></i>
                </el-popover>
              </li>
            </ul>
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
import vuescroll from "vuescroll";
import LinkSelector from "../../common/link_selector";

export default {
  name: "freeTextSetting",
  data() {
    return {
      activeNames: ["1", "2"],
      showLinkSelector: false,
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
      lineHeightShow: false
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
    vuescroll,
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
    toBold() {
      let bold = this.setting.style.bold;
      this.setting.style.bold = !bold;
      this.changeHandle();
    },
    toItalic() {
      let italic = this.setting.style.italic;
      this.setting.style.italic = !italic;
      this.changeHandle();
    },
    toUnderline() {
      let underline = this.setting.style.underline;
      this.setting.style.underline = !underline;
      this.changeHandle();
    },
    toLeft() {
      this.setting.style.align = "left";
      this.changeHandle();
    },
    toCenter() {
      this.setting.style.align = "center";
      this.changeHandle();
    },
    toRight() {
      this.setting.style.align = "right";
      this.changeHandle();
    },
    selectLineHeight(val) {
      this.lineHeightShow = false;
      this.setting.style.lineHeight = val;
      this.changeHandle();
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
@import url("./style/index.min.css");
</style>