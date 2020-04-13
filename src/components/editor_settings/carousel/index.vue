<template>
  <div class="carousel-setting">
    <div class="setting-title">轮播图组件</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="模块设置" name="1">
        <el-form ref="carouselSettingForm" :model="setting" label-width="100px">
          <el-form-item label="轮播图样式：">
            <div class="carousel-style-box">
              <i class="indicator"></i>
            </div>
          </el-form-item>
          <el-form-item label="轮播图高度：">
            <el-input-number
              v-model="setting.height"
              @change="changeHandle"
              controls-position="right"
              :min="40"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="轮播间隔：">
            <el-input-number
              v-model="setting.interval"
              @change="changeHandle"
              controls-position="right"
              :min="1"
            ></el-input-number>
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
      <el-collapse-item title="轮播图设置" name="2">
        <div class="carousel-list">
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
                :key="item.imageID"
              >
                <div class="item-header" @click.stop="toggleCarousel(item)">
                  <span class="toggle-icon">
                    <i class="el-icon-arrow-right icon"></i>
                  </span>
                  轮播图{{index+1}}
                  <span
                    v-if="setting.list.length > 1"
                    class="del-btn"
                    @click.stop="delCarouselItem(index)"
                  >
                    <i class="el-icon-delete icon"></i>
                  </span>
                </div>
                <el-collapse-transition>
                  <div class="item-body" v-show="ifActive(item)">
                    <div class="custom-form-group clearfix">
                      <label class="custom-form-label">图片设置：</label>
                      <div class="custom-form-ctrl">
                        <div class="upload-selecctor" style="width: 96px; height: 64px;">
                          <img v-show="item.imageUrl" :src="item.imageUrl" alt class="img" />
                          <span class="tips">更换图片</span>
                          <input type="file" class="file-input" title />
                        </div>
                        <span class="upload-tips">建议尺寸：750*400px</span>
                      </div>
                    </div>
                    <div class="custom-form-group clearfix">
                      <label class="custom-form-label">点击事件：</label>
                      <div class="custom-form-ctrl">
                        <div class="link-selector">
                          <button
                            class="selector-btn"
                            @click="selectorLinkHandle(item, index)"
                            v-show="!item.link.name"
                          >设置点击事件</button>
                          <div class="selector-input-group" v-show="item.link.name">
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
        <el-button type="primary" class="add-btn" @click="addHandle">添加轮播项</el-button>
        <div class="add-tips">最多可添加8张轮播图，上下拖动可切换顺序</div>
      </el-collapse-item>
    </el-collapse>

    <LinkSelector v-if="showLinkSelector" :link="currentLink" @submitLink="submitLinkHandle"></LinkSelector>
    <!-- <el-collapse v-model="activeName" accordion>
      <template v-for="(item, index) in setting.list">
        <el-collapse-item :title="'carousel-'+(index+1)" :name="index+1" :key="index">
          <div class="image-selector" @click="selectorImageHandle(item.imageID)">
            <el-image style="width: 100px; height: 100px" :src="item.imageUrl" fit="contain"></el-image>
          </div>
        </el-collapse-item>
      </template>
    </el-collapse>
    <div class="btn-box">
      <el-button class="add-btn" type="primary" @click="addHandle">新增</el-button>
    </div>
    <ImageSelector
      v-if="showImageSelector"
      :imageID="currentImageID"
      @submitImage="submitImageHandle"
    ></ImageSelector>-->
  </div>
</template>

<script>
import uuidV4 from "uuid/v4";
import draggable from "vuedraggable";
import { mapState, mapMutations } from "vuex";
import ImageSelector from "../../common/image_selector";
import LinkSelector from "../../common/link_selector";

export default {
  name: "carouselSetting",
  data() {
    return {
      activeNames: ["1", "2"],
      dragging: false, // 正在拖动
      carouselItemActive: [],
      showLinkSelector: false,
      showImageSelector: false, // 是否显示图片选择器
      currentImageID: "default", //当前选中图片id
      currentImageIndex: "",
      currentLink: {}, // 当前要设置点击事件 的 数据
      currentLinkIndex: "" // 当前要设置点击事件 的 索引
    };
  },
  props: ["setting"],
  components: {
    ImageSelector,
    LinkSelector,
    draggable
  },
  computed: {
    ...mapState(["design", "designEditID", "editorList", "editorIndex"]),
     dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  mounted() {
    console.log(this.setting);
  },
  methods: {
    ...mapMutations(["CHANGE_DESIGN_TEMPLATE", "CHANGE_EDITOR_LIST"]),
    addHandle() {
      let settingList = this.setting.list;
      if(settingList.length >= 8) {
        this.$message.warning('最多可添加8张轮播图！')
        return;
      };
      let newObj = {
        id: uuidV4(),
        imageID: "default" + new Date().getTime(),
        imageUrl: "https://qxtodo.com/editor/animation_wallpaper.jpg",
        link: {}
      };
      settingList.push(newObj);
      this.setting.list = settingList;
      this.changeHandle();
    },
    changeHandle() {
      let design = this.design;
      let templateSetting = design.template[this.designEditID].setting;
      let templateData = design.template[this.designEditID].data;
      templateData[this.editorIndex].setting = this.setting;

      let template = {
        key: this.designEditID,
        data: {
          setting: templateSetting,
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
    delCarouselItem(index) {
      // 删除 轮播图 item
      this.setting.list.splice(index, 1);
      this.changeHandle();
    },
    delLinkHandle(index) {
      this.setting.list[index].link = {};
      this.changeHandle();
    },
    selectorLinkHandle(item, index) {
      this.currentLink = item.link;
      this.currentLinkIndex = index;
      this.showLinkSelector = true;
    },
    submitLinkHandle(val) {
      if (val.id) {
        let design = this.design;
        let templateSetting = design.template[this.designEditID].setting;
        let templateData = design.template[this.designEditID].data;

        templateData[this.editorIndex].setting.list[
          this.currentLinkIndex
        ].link = val;

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
    toggleCarousel(row) {
      let carouselItemActive = this.carouselItemActive;

      if (carouselItemActive.includes(row.id)) {
        for (let [index, item] of carouselItemActive.entries()) {
          if (item == row.id) {
            carouselItemActive.splice(index, 1);
            break;
          }
        }
      } else {
        carouselItemActive.push(row.id);
      }
      this.$nextTick(() => {
        this.carouselItemActive = carouselItemActive;
      });
    },
    ifActive(row) {
      let falg = this.carouselItemActive.includes(row.id);
      return falg;
    },
    selectorImageHandle(imageID) {
      this.currentImageID = imageID;
      this.showImageSelector = true; // 显示图片选择器
    },
    submitImageHandle(val) {
      let editorList = this.editorList;
      let editorIndex = this.editorIndex;
      if (val.imageID && val.imageUrl) {
        let list = editorList[editorIndex].setting.list;
        list[this.activeName - 1].imageID = val.imageID;
        list[this.activeName - 1].imageUrl = val.imageUrl;
        editorList[editorIndex].setting.list = list;
        this.CHANGE_EDITOR_LIST(editorList);
        this.tellParent();
      }
      this.showImageSelector = false; // 显示图片选择器

      // editorList[editorIndex].setting.children[this.settingFreeComponentIndex].setting.imageID = val.imageID;
      // editorList[editorIndex].setting.children[this.settingFreeComponentIndex].setting.imageUrl = val.imageUrl;
      // this.CHANGE_EDITOR_LIST(editorList)
      // this.tellParent()
      // this.showImageSelector = false; // 显示图片选择器
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