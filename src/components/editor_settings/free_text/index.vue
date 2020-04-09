<template>
  <div class="free-text-setting">
    <div class="setting-title">文本组件</div>
    <el-form ref="pageSettingForm" :model="setting" label-width="110px">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="文本内容" name="1">
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
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文本颜色：">
            <el-color-picker v-model="setting.color" @change="changeHandle"></el-color-picker>
            <span class="color-tips">{{setting.color}}</span>
          </el-form-item>
          <el-form-item label="文本样式：">
            <ul class="style-list clearfix">
              <li class="item" :class="{'active': setting.style.bold}" @click="toBold">
                <i class="icon" style="background-image: url('https://cdn.xingchen.cn/FticSVCudBzXTZYSkDnpXpmN-C3k');"></i>
              </li>
              <li class="item" :class="{'active': setting.style.italic}" @click="toItalic">
                <i class="icon" style="background-image: url('https://cdn.xingchen.cn/Fhoyd4mj9qbg8vPhjKC3SpuRbSCH');"></i>
              </li>
              <li class="item" :class="{'active': setting.style.underline}" @click="toUnderline">
                <i class="icon" style="background-image: url('https://cdn.xingchen.cn/Fo4YFJThmad67HF6E4cwTv878xFC');"></i>
              </li>
              <li class="item" :class="{'active': setting.style.align == 'left'}" @click="toLeft">
                <i class="icon" style="background-image: url('https://cdn.xingchen.cn/Fp7TJJaYTN4ut37-1W_tMj5vGrHJ');"></i>
              </li>
              <li class="item" :class="{'active': setting.style.align == 'center'}" @click="toCenter">
                <i class="icon" style="background-image: url('https://cdn.xingchen.cn/FjF-DhMjagFxzHyuB0-sf3f4rgnl');"></i>
              </li>
              <li class="item" :class="{'active': setting.style.align == 'right'}" @click="toRight">
                <i class="icon" style="background-image: url('https://cdn.xingchen.cn/FrAqyb8rmgu7ieWFPjJv97160obe');"></i>
              </li>
              <li class="item">
                <el-popover
                  placement="top"
                  v-model="lineHeightShow"
                  width="80"
                  trigger="click">
                  <div class="line-height-selector">
                    <vuescroll>
                      <template v-for="item in fontSizeOption">
                        <div class="item" :key="item" @click="selectLineHeight(item)">
                          {{item+'px'}}
                        </div>
                      </template>
                    </vuescroll>
                  </div>
                  <i slot="reference" class="icon" style="background-image: url('https://cdn.xingchen.cn/FptQCxDDv33Zfg3pw3yLiZYyNdnJ');"></i>
                </el-popover>
              </li>
            </ul>
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

    <!-- <el-divider>颜色</el-divider>
    <el-color-picker v-model="setting.color" @change="colorChange"></el-color-picker>
    <el-divider>大小</el-divider>
    <el-select v-model="setting.size" placeholder="请选择" @change="sizeChange">
      <el-option label="14px" value="14"></el-option>
      <el-option label="16px" value="16"></el-option>
      <el-option label="18px" value="18"></el-option>
      <el-option label="20px" value="20"></el-option>
      <el-option label="26px" value="26"></el-option>
      <el-option label="32px" value="32"></el-option>
    </el-select>
    <el-divider>文本</el-divider>
    <el-input
      type="textarea"
      :rows="5"
      placeholder="请输入内容"
      v-model="setting.text"
      maxlength="50"
      show-word-limit
      clearable
      :autosize="{minRows: 5, maxRows: 8}"
      @input="textChange"
    ></el-input>-->
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import vuescroll from "vuescroll";

export default {
  name: "freeTextSetting",
  data() {
    return {
      activeNames: "1",
      textSetting: {},
      fontSizeOption: [10, 11, 12, 13, 14, 15, 16, 18, 20 ,24, 30, 36 ,48, 60, 72, 84, 96, 108, 120],
      lineHeightShow: false
    };
  },
  computed: {
    ...mapState(["design", "designEditID", "editorList", "editorIndex"])
  },
  components: {
    vuescroll
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
      let templateSetting = design.template[this.designEditID].setting
      let templateData = design.template[this.designEditID].data;
      let setting = this.textSetting;
      templateData[this.editorIndex].setting.children[
        this.settingFreeComponentIndex
      ].setting = setting;

      let template = {
        key: this.designEditID,
        data: {
          setting: templateSetting,
          data: templateData
        }
      };
      this.CHANGE_DESIGN_TEMPLATE(template);


      // let editorList = this.editorList;
      // let editorIndex = this.editorIndex;
      // let setting = this.textSetting;
      // editorList[editorIndex].setting.children[
      //   this.settingFreeComponentIndex
      // ].setting = setting;

      // this.CHANGE_EDITOR_LIST(editorList);
      // this.tellParent();
    },
    toBold() {
      let bold = this.setting.style.bold;
      this.textSetting = this.setting;
      this.textSetting.style.bold = !bold;
      this.changeHandle()
    },
    toItalic() {
      let italic = this.setting.style.italic;
      this.textSetting = this.setting;
      this.textSetting.style.italic = !italic;
      this.changeHandle()
    },
    toUnderline() {
      let underline = this.setting.style.underline;
      this.textSetting = this.setting;
      this.textSetting.style.underline = !underline;
      this.changeHandle()
    },
    toLeft() {
      this.textSetting = this.setting;
      this.textSetting.style.align = 'left';
      this.changeHandle()
    },
    toCenter() {
      this.textSetting = this.setting;
      this.textSetting.style.align = 'center';
      this.changeHandle()
    },
    toRight() {
      this.textSetting = this.setting;
      this.textSetting.style.align = 'right';
      this.changeHandle()
    },
    selectLineHeight(val) {
      this.lineHeightShow = false;
      this.textSetting = this.setting;
      this.textSetting.style.lineHeight = val;
      this.changeHandle()
    },
    // colorChange(val) {
    //   let editorList = this.editorList;
    //   let editorIndex = this.editorIndex;
    //   editorList[editorIndex].setting.children[
    //     this.settingFreeComponentIndex
    //   ].setting.color = val;
    //   // editorList[editorIndex].setting = setting;
    //   this.CHANGE_EDITOR_LIST(editorList);
    //   this.tellParent();
    // },
    // sizeChange(val) {
    //   let editorList = this.editorList;
    //   let editorIndex = this.editorIndex;
    //   editorList[editorIndex].setting.children[
    //     this.settingFreeComponentIndex
    //   ].setting.size = val;
    //   this.CHANGE_EDITOR_LIST(editorList);
    //   this.tellParent();
    // },
    // textChange(val) {
    //   let editorList = this.editorList;
    //   let editorIndex = this.editorIndex;
    //   editorList[editorIndex].setting.children[
    //     this.settingFreeComponentIndex
    //   ].setting.text = val;
    //   this.CHANGE_EDITOR_LIST(editorList);
    //   this.tellParent();
    // },
    tellParent() {
      this.$emit("refreshState", "");
    }
  }
};
</script>

<style>
@import url('./style/index.min.css');
</style>