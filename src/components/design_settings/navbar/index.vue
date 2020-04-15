<template>
  <div class="navbar-setting">
    <div class="setting-title">底部导航设置</div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="底部导航设置" name="1">
        <el-form ref="navSettingForm" :model="setting" label-width="180px">
          <!-- <el-form-item label="是否隐藏导航：">
            <el-radio-group v-model="setting.hide">
              <el-radio :label="false">显示</el-radio>
              <el-radio :label="true">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>-->
          <div style="margin-bottom: 20px;">
            <label for>是否隐藏导航：</label>
            <el-radio-group v-model="setting.hide">
              <el-radio :label="false">显示</el-radio>
              <el-radio :label="true">隐藏</el-radio>
            </el-radio-group>
          </div>
          <el-form-item label="导航文字颜色（未选中）：">
            <el-color-picker v-model="setting.unCheckedTextColor" @change="changeHandle"></el-color-picker>
            <span class="color-tips">{{setting.unCheckedTextColor}}</span>
          </el-form-item>
          <el-form-item label="导航文字颜色（已选中）：">
            <el-color-picker v-model="setting.checkedTextColor" @change="changeHandle"></el-color-picker>
            <span class="color-tips">{{setting.checkedTextColor}}</span>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="导航设置" name="2">
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
              <div class="list-group-item" v-for="(item, index) in setting.list" :key="item.id">
                <div class="item-header" @click.stop="toggleNav(item)">
                  <span class="toggle-icon">
                    <i class="el-icon-arrow-right icon"></i>
                  </span>
                  {{item.title}}
                  <span
                    v-if="setting.list.length > 1"
                    class="del-btn"
                    @click.stop="delNavItem(index)"
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
                      <label class="custom-form-label">图标设置：</label>
                      <div class="custom-form-ctrl">
                        <div class="icon-selector-box" @click.stop="chickIconSelector(item.icon, index)">
                          <template v-if="item.icon.id">
                            <div class="icon-show">
                              <span class="icon-box">
                                <i class="font_family" :class="item.icon.unChecked"></i>
                              </span>
                              <span class="tips">未选中</span>
                            </div>
                            <div class="icon-show">
                              <span class="icon-box">
                                <i class="font_family" :class="item.icon.checked"></i>
                              </span>
                              <span class="tips">选中</span>
                            </div>
                          </template>
                          <template v-else>
                            <button class="setting-btn">设置导航图标</button>
                          </template>
                        </div>
                      </div>
                    </div>
                    <div class="custom-form-group clearfix">
                      <label class="custom-form-label">点击事件：</label>
                      <div class="custom-form-ctrl">
                        <div class="link-selector">
                          <button
                            class="selector-btn"
                            @click.stop="selectorLinkHandle(item, index)"
                            v-if="!item.link"
                          >设置点击事件</button>
                          <div class="selector-input-group" v-else>
                            <div class="selector-input">{{item.link.type + ' | ' +item.link.name}}</div>
                            <button class="clear-btn" @click.stop="delLinkHandle(index)">
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
    <IconSelector v-if="showIconSelector" :icon="currentIcon" @submitIcon="submitIconHandle"></IconSelector>
    <LinkSelector v-if="showLinkSelector" :link="currentLink" @submitLink="submitLinkHandle"></LinkSelector>
  </div>
</template>

<script>
import uuidV4 from "uuid/v4";
import { mapState, mapMutations } from "vuex";
import draggable from "vuedraggable";
import IconSelector from "../../common/icon_selector";
import LinkSelector from "../../common/link_selector";

export default {
  name: "navbarSetting",
  data() {
    return {
      activeNames: ["1", "2"],
      dragging: false, // 正在拖动
      carouselItemActive: [],
      currentIcon: "", // 当前选中的图标
      currentIconIndex: "",
      showIconSelector: false, // 是否显示图标选择弹窗
      showLinkSelector: false,
      currentLink: {}, // 当前要设置点击事件 的 数据
      currentLinkIndex: "" // 当前要设置点击事件 的 索引
    };
  },
  components: {
    IconSelector,
    LinkSelector,
    draggable
  },
  props: ["setting"],
  computed: {
    ...mapState(["design", "designEditID"]),
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
    ...mapMutations([
      "CHANGE_DESIGN_NAV",
      "CHANGE_DESIGN_NAV_MAX"
    ]),
    changeHandle() {
      this.CHANGE_DESIGN_NAV(this.setting);
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
    ifActive(row) {
      let falg = this.carouselItemActive.includes(row.id);
      return falg;
    },
    toggleNav(row) {
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
    addHandle() {
      let settingList = this.setting.list;
      if (settingList.length >= 5) {
        this.$message.warning("最多可添加5个导航！");
        return;
      }
      let max_id = this.design.data.nav.navMaxID + 1;
      let newObj = {
        id: "nav-" + max_id,
        title: "首页",
        icon: {
          id: "home",
          label: "首页",
          unChecked: "icon-home",
          checked: "icon-home-s"
        },
        link: {}
      };
      this.CHANGE_DESIGN_NAV_MAX(max_id);

      settingList.push(newObj);
      this.setting.list = settingList;
      this.changeHandle();
    },
    delNavItem(index) {
      // 删除  item
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
      if (val.id) {
        this.setting.list[this.currentLinkIndex].link = val;
        this.changeHandle();
      };
      this.showLinkSelector = false; // 显示图片选择器
    },
    chickIconSelector(val, index) {
      this.currentIcon = val;
      this.currentIconIndex = index;
      this.showIconSelector = true;
    },
    submitIconHandle(val) {
      if (val.id) {
        this.setting.list[this.currentIconIndex].icon = val;
        this.changeHandle();
      };
      this.showIconSelector = false;
    }
  }
};
</script>

<style>
@import url("./style/index.min.css");
</style>