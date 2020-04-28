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
              v-model="setting.style.marginBottom"
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
                        <div class="upload-selecctor" @click="checkImageHandle(index)" style="width: 64px; height: 64px;">
                          <img v-show="item.imageUrl" :src="item.imageUrl" alt class="img" />
                          <span class="tips">更换图片</span>
                          <!-- <input type="file" class="file-input" title /> -->
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
    <ImageManage :limit="1" @checkedImage="checkedImageHandle" v-if="showImageManage"></ImageManage>
  </div>
</template>

<script>
import uuidV4 from "uuid/v4";
import { mapState, mapMutations } from "vuex";
import draggable from "vuedraggable";
import LinkSelector from "../../common/link_selector"
import ImageManage from "@/components/common/image_manage";


export default {
  name: "graphicNavSetting",
  data(){
    return {
      activeNames: ["1", "2"],
      dragging: false, // 正在拖动
      graphicItemActive: [],
      showLinkSelector: false,  // 是否显示链接选择器
      currentLink: {}, // 当前要设置点击事件 的 数据
      currentLinkIndex: "", // 当前要设置点击事件 的 索引
      showImageManage: false, // 显示图片库
      editNavIndex: '',  //当前编辑得轮播图 index
    }
  },
  components: {
    LinkSelector,
    ImageManage,
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
        imageUrl: 'https://cdn.qinxus.com/animation_gril_banner_2.jpg',
        title: '标题',
        link: null
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
      if (val) {
        this.setting.list[this.currentLinkIndex].link = val;
        this.changeHandle();
      };
      this.showLinkSelector = false; // 显示图片选择器
    },
    delLinkHandle(index) {
      this.setting.list[index].link = null;
      this.changeHandle();
    },
    checkImageHandle(index) {
      this.editNavIndex = index;
      this.showImageManage = true;
    },
    checkedImageHandle(val) {
      this.showImageManage = false;
      if(val.length > 0) {
        let list = this.setting.list;
        let index = this.editNavIndex;
        list[index].imageUrl = val[0].src;
        this.setting.list = list;
        this.changeHandle();
      };
    }
  }
}
</script>

<style>
@import url('./style/index.min.css');
</style>