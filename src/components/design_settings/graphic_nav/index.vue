<template>
  <div class="graphic-nav-setting">
    <div class="setting-title">图文导航组件</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="模块设置" name="1">
        <el-form ref="graphicSettingForm" :model="setting" label-width="100px">
          <el-form-item label="导航样式：">
            <div class="graphic-style">
              <div class="default-style style-item clearfix">
                <i class="style-icon"></i>
                <i class="style-icon"></i>
                <i class="style-icon"></i>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="下方间隔：">
            <el-input-number
              v-model="setting.marginBottom"
              @change="changeHandle"
              controls-position="right"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="图文导航设置" name="2">
        <div class="graphic-list">
          <draggable
            :list="setting.list"
            class="list-group"
            :move="checkMove"
            v-bind="dragOptions"
            @start="dragStart"
            @end="dragEnd"
          >
            <transition-group type="transition" :name="!dragging ? 'flip-list' : null">
              <div
                class="list-group-item"
                v-for="(item, index) in setting.list"
                :key="item.id"
              >
                <div class="item-header" @click.stop="toggleGraphic(item)">
                  <span class="toggle-icon">
                    <i class="el-icon-arrow-right icon"></i>
                  </span>
                  {{item.title}}
                  <span
                    v-if="setting.list.length > 1"
                    class="del-btn"
                    @click.stop="delGraphicItem(index)"
                  >
                    <i class="el-icon-delete icon"></i>
                  </span>
                </div>
                <el-collapse-transition>
                  <div class="item-body" v-show="ifActive(item)">
                    <div class="custom-form-group clearfix">
                      <label class="custom-form-label">导航标题：</label>
                      <div class="custom-form-ctrl">
                        <el-input
                          v-model="item.title"
                          placeholder="请输入内容"
                          maxlength="5"
                          show-word-limit
                          style="width: 100%;"
                          @change="changeHandle"
                        ></el-input>
                      </div>
                    </div>
                    <div class="custom-form-group clearfix">
                      <label class="custom-form-label">图片设置：</label>
                      <div class="custom-form-ctrl">
                        <div class="upload-selecctor" style="width: 64px; height: 64px;">
                          <img v-show="item.imageUrl" :src="item.imageUrl" alt class="img" />
                          <span class="tips">更换图片</span>
                          <input type="file" class="file-input" title />
                        </div>
                        <span class="upload-tips">建议尺寸：100*100px</span>
                      </div>
                    </div>
                    <div class="custom-form-group clearfix">
                      <label class="custom-form-label">点击事件：</label>
                      <div class="custom-form-ctrl">
                        <div class="link-selector">
                          <button
                            class="selector-btn"
                            @click="selectorLinkHandle(item, index)"
                            v-if="!item.link"
                          >设置点击事件</button>
                          <div class="selector-input-group" v-else>
                            <div class="selector-input">{{item.link.type + ' | ' +item.link.name}}</div>
                            <button class="clear-btn" @click="delLinkHandle(index)">
                              <i class="el-icon-close icon"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-collapse-transition>
              </div>
            </transition-group>
          </draggable>
        </div>
        <el-button type="primary" class="add-btn" @click="addHandle">添加导航</el-button>
        <div class="add-tips">最多可添加5个导航，上下拖动可切换顺序</div>
      </el-collapse-item>
    </el-collapse>
    <LinkSelector v-if="showLinkSelector" :link="currentLink" @submitLink="submitLinkHandle"></LinkSelector>
  </div>
</template>

<script>
import uuidV4 from "uuid/v4";
import { mapState, mapMutations } from "vuex";
import draggable from "vuedraggable";
import ImageSelector from "../../common/image_selector";
import LinkSelector from "../../common/link_selector"


export default {
  name: "graphicNavSetting",
  data(){
    return {
      activeNames: ["1", "2"],
      dragging: false, // 正在拖动
      graphicItemActive: [],
      showImageSelector: false, // 是否显示图片选择器
      currentImageID: "default", //当前选中图片id
      showLinkSelector: false,  // 是否显示链接选择器
      currentLink: {}, // 当前要设置点击事件 的 数据
      currentLinkIndex: "" // 当前要设置点击事件 的 索引
    }
  },
  components: {
    ImageSelector,
    LinkSelector,
    draggable
  },
  props: {
    setting: {
      type: Object
    }
  },
  computed: {
    ...mapState(["design", "designEditID", "designEditIndex"]),
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  methods: {
    ...mapMutations(["CHANGE_DESIGN_TEMPLATE"]),
    addHandle() {
      let settingList = this.setting.list;
      if(settingList.length >= 5) {
        this.$message.warning('最多可添加5个导航!')
        return;
      };
      let newObj = {
        id: uuidV4(),
        imageID: "default",
        imageUrl: 'https://cdn.qinxus.com/animation_gril_banner_2.jpg',
        title: '标题',
        link: {}
      };
      settingList.push(newObj);
      this.setting.list = settingList;
      this.changeHandle();
    },
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
    dragStart(val) {
      this.dragging = true;
    },
    dragEnd(val) {
      this.dragging = false;
    },
    checkMove: function(e) {
      window.console.log("Future index: " + e.draggedContext.futureIndex);
    },
    delGraphicItem(index) {
      // 删除item
      this.setting.list.splice(index, 1);
      this.changeHandle();
    },
    toggleGraphic(row) {
      let graphicItemActive = this.graphicItemActive;

      if (graphicItemActive.includes(row.id)) {
        for (let [index, item] of graphicItemActive.entries()) {
          if (item == row.id) {
            graphicItemActive.splice(index, 1);
            break;
          }
        }
      } else {
        graphicItemActive.push(row.id);
      }
      this.$nextTick(() => {
        this.graphicItemActive = graphicItemActive;
      });
    },
    ifActive(row) {
      let falg = this.graphicItemActive.includes(row.id);
      return falg;
    },
    selectorLinkHandle(item, index) {
      this.currentLink = item.link;
      this.currentLinkIndex = index;
      this.showLinkSelector = true;
    },
    submitLinkHandle(val) {
      if (val.id) {
        this.setting.list[this.currentLinkIndex].link = val;
        this.changeHandle();
      };
      this.showLinkSelector = false; // 显示图片选择器
    },
    delLinkHandle(index) {
      this.setting.list[index].link = null;
      this.changeHandle();
    },
    selectorImageHandle(imageID) {
      this.currentImageID = imageID;
      this.showImageSelector = true; // 显示图片选择器
    },
    submitImageHandle(val) {
      
      this.showImageSelector = false; // 显示图片选择器
    }
  }
}
</script>

<style>
@import url('./style/index.min.css');
</style>