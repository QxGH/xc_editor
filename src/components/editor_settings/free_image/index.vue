<template>
  <div class="free-image-setting">
    <div class="setting-title">图片组件</div>
    <el-form ref="imageSettingForm" :model="setting" label-width="100px">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="图片设置" name="1">
          <el-form-item label="图片设置：">
            <div class="upload-selecctor">
              <img v-show="setting.shareImage" :src="setting.shareImage" alt="" class="img">
              <span class="tips">更换图片</span>
              <input type="file" class="file-input" title="" >
            </div>
            <span class="upload-tips">
              建议尺寸：400*300px
            </span>
            <!-- <div class="image-selector" @click="selectorImageHandle">
              <el-image style="width: 100px; height: 100px" :src="setting.imageUrl" fit="contain"></el-image>
            </div> -->
          </el-form-item>
          <el-form-item label="图片宽度：">
            <el-input-number v-model="setting.width" @change="changeHandle" controls-position="right" :min="40" :max="375" ></el-input-number>
          </el-form-item>
          <el-form-item label="图片高度：">
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
    <!-- <el-divider>图片</el-divider>
    <div class="image-selector" @click="selectorImageHandle">
      <el-image style="width: 100px; height: 100px" :src="setting.imageUrl" fit="contain"></el-image>
    </div>
    <ImageSelector v-if="showImageSelector" :imageID="currentImageID" @submitImage="submitImageHandle"></ImageSelector> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import ImageSelector from '../../../components/common/image_selector'

export default {
  name: 'freeTextSetting',
  data(){
    return {
      activeNames: '1',
      showImageSelector: false, // 是否显示图片选择器
      currentImageID: 'default'  //当前选中图片id
    }
  },
  computed: {
    ...mapState(['design', 'designEditID', 'editorList', 'editorIndex'])
  },
  components: {
    ImageSelector
  },
  props: {
    setting: {
      type: Object
    },
    settingFreeComponentIndex:{
      type: Number,
      default(){
        return 0
      }
    }
  },
  methods: {
    ...mapMutations(['CHANGE_DESIGN_TEMPLATE', 'CHANGE_EDITOR_LIST']),
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
    selectorImageHandle(){
      this.currentImageID = this.setting.imageID;
      this.showImageSelector = true; // 显示图片选择器
    },
    submitImageHandle(val) {
      let editorList = this.editorList;
      let editorIndex = this.editorIndex;
      // console.log(this.settingFreeComponentIndex)
      // let setting = editorList[editorIndex].setting.children[this.settingFreeComponentIndex].setting;
      // setting.color = val;
      if(val.imageID && val.imageUrl) {
        editorList[editorIndex].setting.children[this.settingFreeComponentIndex].setting.imageID = val.imageID;
        editorList[editorIndex].setting.children[this.settingFreeComponentIndex].setting.imageUrl = val.imageUrl;
        // editorList[editorIndex].setting = setting;
        this.CHANGE_EDITOR_LIST(editorList)
        this.tellParent()
      };
      
      this.showImageSelector = false; // 显示图片选择器
    },
    tellParent(){
      this.$emit('refreshState', '')
    }
  }
}
</script>

<style>
@import url('./style/index.min.css');
</style>