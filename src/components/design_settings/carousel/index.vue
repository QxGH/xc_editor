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
              v-model="setting.style.marginBottom"
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
                :key="item.id"
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
                        <div class="upload-selecctor" @click="checkImageHandle(index)" style="width: 96px; height: 64px;">
                          <img v-show="item.imageUrl" :src="item.imageUrl" alt class="img" />
                          <span class="tips">更换图片</span>
                          <!-- <input type="file" class="file-input" title /> -->
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
        <el-button type="primary" class="add-btn" @click="addHandle">添加轮播项</el-button>
        <div class="add-tips">最多可添加8张轮播图，上下拖动可切换顺序</div>
      </el-collapse-item>
    </el-collapse>

    <LinkSelector v-if="showLinkSelector" :link="currentLink" @submitLink="submitLinkHandle"></LinkSelector>
    <ImageManage :limit="1" @checkedImage="checkedImageHandle" v-if="showImageManage"></ImageManage>
  </div>
</template>

<script>
import uuidV4 from "uuid/v4";
import draggable from "vuedraggable";
import { mapState, mapMutations } from "vuex";
import ImageManage from "@/components/common/image_manage";
import LinkSelector from "../../common/link_selector";

export default {
  name: "carouselSetting",
  data() {
    return {
      activeNames: ["1", "2"],
      dragging: false, // 正在拖动
      carouselItemActive: [],
      showLinkSelector: false,
      currentLink: {}, // 当前要设置点击事件 的 数据
      currentLinkIndex: "", // 当前要设置点击事件 的 索引
      showImageManage: false, // 显示图片库
      editCarouselIndex: '',  //当前编辑得轮播图 index
    };
  },
  props: ["setting"],
  components: {
    ImageManage,
    LinkSelector,
    draggable
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
  mounted() {
    console.log(this.setting);
  },
  methods: {
    ...mapMutations(["CHANGE_DESIGN_TEMPLATE"]),
    addHandle() {
      let settingList = this.setting.list;
      if(settingList.length >= 8) {
        this.$message.warning('最多可添加8张轮播图！')
        return;
      };
      let newObj = {
        id: uuidV4(),
        imageUrl: "https://qxtodo.com/editor/animation_wallpaper.jpg",
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
    delCarouselItem(index) {
      // 删除 轮播图 item
      this.setting.list.splice(index, 1);
      this.changeHandle();
    },
    delLinkHandle(index) {
      this.setting.list[index].link = null;
      this.changeHandle();
    },
    selectorLinkHandle(item, index) {
      this.currentLink = item.link;
      this.currentLinkIndex = index;
      this.showLinkSelector = true;
    },
    submitLinkHandle(val) {
      if (val) {
        let templateNormal = this.design.template[this.designEditID];
        let templateData = templateNormal.data;

        templateData[this.designEditIndex].setting.list[
          this.currentLinkIndex
        ].link = val;

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
    checkImageHandle(index) {
      this.editCarouselIndex = index;
      this.showImageManage = true;
    },
    checkedImageHandle(val) {
      this.showImageManage = false;
      if(val.length > 0) {
        let list = this.setting.list;
        let index = this.editCarouselIndex;
        list[index].imageUrl = val[0].src;
        this.setting.list = list;
        this.changeHandle();
      };
    }
  }
};
</script>

<style>
@import url("./style/index.min.css");
</style>