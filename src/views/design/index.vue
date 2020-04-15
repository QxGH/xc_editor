<template>
  <div class="design">
    <el-container>
      <el-header class="clearfix" style="height: 56px;">
        <Header @changeTabs="changeTabsHandle" :asideTabsActive="asideTabsActive"></Header>
      </el-header>
      <el-container>
        <!-- 左侧 list start -->
        <el-aside width="264px" class="left-aside">
          <div class="tabs-box">
            <div class="tabs-pane" v-show="asideTabsActive === 'page'">
              <PageManage @changePage="changePage"></PageManage>
            </div>
            <div class="tabs-pane" v-show="asideTabsActive === 'components'">
              <vuescroll>
                <div class="components-title">基础组件</div>
                <draggable
                  element="div"
                  class="component-list clearfix"
                  :list="componentsList"
                  :group="listGroupOption"
                  :clone="cloneHandle"
                  :sort="false"
                  @start="startHandle"
                  @end="endHandle"
                  :move="moveHandle"
                  :disabled="dragDisabled"
                >
                  <template v-for="item in componentsList">
                    <div
                      class="component-list-box"
                      :key="item.id"
                      :data-type="item.type"
                      :data-label="item.label"
                    >
                      <div class="component-item">
                        <div class="tips-box">
                          <el-popover
                            placement="bottom"
                            width="200"
                            trigger="hover"
                            :content="item.explain"
                          >
                            <i class="el-icon-question help-icon" slot="reference"></i>
                          </el-popover>
                        </div>
                        <div class="icon-box">
                          <i class="font_family" :class="item.icon"></i>
                        </div>
                        <div class="component-name">{{item.name}}</div>
                      </div>
                      <div class="drop-tips">
                        <span class="tips-text">将组件放置到此处</span>
                      </div>
                    </div>
                  </template>
                </draggable>
              </vuescroll>
            </div>
          </div>
        </el-aside>
        <!-- 左侧 list end -->
        <!-- 中间 preview start -->
        <el-main>
          <draggable
            class="preview-wrap-list"
            :list="previewWrapList"
            group="normal"
            element="div"
            dragClass="draggable"
            :disabled="dragDisabled"
          >
            <!-- 页面设置 & 底部菜单设置 start -->
            <div class="fixed-btn-box" v-show="designEditID">
              <button class="btn" @click="pageSettingHandle">
                <i class="font_family icon-setting"></i>
                页面设置
              </button>
              <button class="btn" @click="bottomMenuHandle">
                <i class="font_family icon-navbar"></i>
                底部菜单
              </button>
            </div>
            <!-- 页面设置 & 底部菜单设置 end -->
            <div class="preview-wrap">
              <div
                class="preview"
                :style="{height: showNavbarDragBox && !designNavData.hide ? '667px' : '617px'}"
              >
                <div
                  class="preview-header"
                  @click="pageSettingHandle"
                  :style="{backgroundColor: designEditData.setting.navBgColor, color: designEditData.setting.navTitColor}"
                >{{designEditData.setting.name}}</div>
                <div
                  class="preview-main"
                  ref="previewMain"
                  :style="{background: designEditData.setting.pageBgColor}"
                >
                  <template v-if="designEditData.type === 'custom'">
                    <!-- 自定义页面 显示 -->
                    <transition name="el-fade-in">
                      <div
                        class="components-handle"
                        v-show="componentsHandle.show"
                        :style="{'top': componentsHandle.top+'px'}"
                        @mouseover="mouseoverHandle"
                        @mouseout="mouseoutHandle"
                      >
                        <span class="hendle-item" @click="componentsDel">
                          <i class="el-icon-close"></i>
                        </span>
                        <span
                          class="hendle-item"
                          v-show="componentsHandle.upShow"
                          @click="componentsToUp"
                        >
                          <i class="el-icon-upload2"></i>
                        </span>
                        <span
                          class="hendle-item"
                          v-show="componentsHandle.downShow"
                          @click="componentsToDown"
                        >
                          <i class="el-icon-download"></i>
                        </span>
                      </div>
                    </transition>
                    <vuescroll ref="scroll" @handle-scroll="handleScroll">
                      <template v-if="showBlankTips">
                        <div class="blank-tips-box">
                          <button class="add-btn" @click="changeTabsHandle('components')">
                            <i class="el-icon-plus icon"></i>
                            添加组件
                          </button>
                          <i class="tips-img"></i>
                          <p class="tips-text">从左侧组件库中将组件拖入改页面</p>
                        </div>
                      </template>
                      <template v-if="!showBlankTips">
                        <draggable
                          class="preview-list"
                          :list="designEditData.data"
                          data-name="previewList"
                          group="normal"
                          element="div"
                          @change="previewLog"
                          dragClass="draggable"
                          :disabled="dragDisabled"
                          :scroll="true"
                        >
                          <template v-for="(item, index) in designEditData.data">
                            <div
                              class="preview-list-box"
                              :id="'previewListBox-'+index"
                              :class="{'isSelect': index === designEditIndex}"
                              :style="{marginBottom: item.setting.marginBottom+'px'}"
                              :key="item.id"
                              @click="clickComponent(item, index, $event)"
                              @mouseover="mouseoverComponenter(item, index, $event)"
                              @mouseout="mouseoutComponenter(item, index, $event)"
                              v-if="item.type != 'free'"
                              :data-com="item.previewComponent"
                            >
                              <component
                                :is="item.previewComponent"
                                :setting="item.setting"
                                :freeGroup="freeGroup"
                                :itemIndex="index"
                                @freeComponentClick="freeComponentClick"
                                @dragDisabledHandle="dragDisabledHandle"
                                @freeDelComponents="freeDelComponents"
                              ></component>
                            </div>
                          </template>
                        </draggable>
                      </template>
                    </vuescroll>
                  </template>
                  <template v-else>
                    <!-- 系统页面 显示 -->
                    <template v-for="item in designEditData.data">
                      <component
                        :is="item.previewComponent"
                        :key="item.id"
                      ></component>
                    </template>
                  </template>
                </div>
                <!-- <div class="preview-navbar" v-if="showNavbarDragBox && !designNavData.hide"> -->
                <div class="preview-navbar" v-if="!designNavData.hide" @click="bottomMenuHandle">
                  <Navbar :setting="designNavData"></Navbar>
                </div>
              </div>
            </div>
          </draggable>
        </el-main>
        <!-- 中间 preview end -->
        <!-- 右侧 setting start -->
        <el-aside width="376px" class="right-aside">
          <template v-if="designEditData.type === 'custom'">
            <!-- 自定义页面设置 -->
            <vuescroll>
              <!-- 组件设置 -->
              <template v-if="settingComponent && designEditIndex !== '' && !showPageSetting">
                <component
                  :is="settingComponent"
                  :setting="settingComponent == 'FreeContainerSetting' ? designEditData.data[designEditIndex].setting : designEditData.data[designEditIndex].label != 'freeContainer' ? designEditData.data[designEditIndex].setting : designEditData.data[designEditIndex].setting.children[settingFreeComponentIndex].setting"
                  :settingFreeComponentIndex="settingFreeComponentIndex"
                ></component>
              </template>
              <!-- 底部导航组件 设置 -->
              <template v-if="settingComponent && selectNavbar && !showPageSetting">
                <component
                  :is="settingComponent"
                  :setting="designNavData"
                ></component>
              </template>
              <!-- 头部 页面设置 -->
              <template v-if="settingComponent && showPageSetting">
                <component
                  :is="settingComponent"
                  :setting="designEditData.setting"
                ></component>
              </template>
            </vuescroll>
          </template>
          <template v-else>
            <!-- 系统页面设置 -->
            <div class="setting-title">我的</div>
            <div class="stytem-setting-tips">
              系统页面，暂不支持编辑
            </div>
          </template>
        </el-aside>
        <!-- 右侧 setting end -->
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";

import draggable from "vuedraggable";
import uuidV4 from "uuid/v4";
import vuescroll from "vuescroll";

import Header from "@/components/common/header/";
import PageManage from "./components/page_manage";

import Carousel from "@/components/design_preview/carousel";
import CarouselSetting from "@/components/design_settings/carousel";
import GraphicNav from "@/components/design_preview/graphic_nav";
import GraphicNavSetting from "@/components/design_settings/graphic_nav";
import GoodsList from "@/components/design_preview/goods_list";
import GoodsListSetting from "@/components/design_settings/goods_list";
import FreeContainer from "@/components/design_preview/free_container";
import FreeContainerSetting from "@/components/design_settings/free_container";
import FreeTextSetting from "@/components/design_settings/free_text";
import FreeBtnSetting from "@/components/design_settings/free_btn";
import FreeOmnipotentSetting from "@/components/design_settings/free_omnipotent";
import FreeImageSetting from "@/components/design_settings/free_image";
import Navbar from "@/components/design_preview/navbar";
import NavbarSetting from "@/components/design_settings/navbar";
import PageSetting from "@/components/design_settings/page_setting";
import UserCenter from '@/components/design_preview/user_center';

import componentsListConfig from "./componentsList";
import designConfig from "./designConfig";

export default {
  name: "editor",
  data() {
    return {
      purpose: "add", // add / edit 新建模板或者编辑模板
      asideTabsActive: "page", // 侧栏 tabs - page / components
      componentsList: [],
      showBlankTips: true,
      previewWrapList: [],
      previewList: [],
      previewLogData: {}, // preview 拖动log数据
      handleIndex: "",
      navbarList: [],
      selectNavbar: false, // 是否选中底部导航
      showPageSetting: false, // 是否显示页面设置
      settingComponent: "", // 当前应该显示的设置组件
      settingFreeComponentIndex: "", // 当前应该显示的自由容器设置组件的下标
      listGroupOption: { name: "normal", pull: "clone", put: false },
      dragDisabled: false,
      componentsHandle: {
        top: 0,
        show: false,
        upShow: true,
        downShow: true
      },
      freeGroup: "free", // 自由容器 拖动插件组
      showNavbarDragBox: true, // 是否显示底部导航栏区域
      showNavbarHandle: false, // 是否显示nabbar handle
      dragOffsetData: {
        // 拖动时offset数据
        x: 0,
        y: 0
      }
    };
  },
  computed: {
    ...mapState([
      "design",
      "designEditID",
      "designEditIndex"
    ]),
    ...mapGetters(["designEditData", "designNavData"])
  },
  created() {
    this.componentsList = this.deepClone(componentsListConfig);
    this.init();
  },
  components: {
    draggable,
    Header,
    PageManage,
    Carousel,
    CarouselSetting,
    GraphicNav,
    GraphicNavSetting,
    GoodsList,
    GoodsListSetting,
    FreeContainer,
    FreeContainerSetting,
    FreeTextSetting,
    FreeBtnSetting,
    FreeOmnipotentSetting,
    FreeImageSetting,
    Navbar,
    NavbarSetting,
    PageSetting,
    UserCenter,
    vuescroll
  },
  methods: {
    ...mapMutations([
      "CHANGE_DESIGN",
      "CHANGE_DESIGN_TEMPLATE",
      "CHANGE_DESIGN_EDIT_ID",
      "CHANGE_DESIGN_EDIT_INDEX"
    ]),
    init() {
      if (this.purpose === "add") {
        let designConfig_ = this.deepClone(designConfig);
        this.CHANGE_DESIGN(designConfig_);
        let editID = designConfig_.group.custom[0].id;
        this.CHANGE_DESIGN_EDIT_ID(editID);
      } else {
        this.getInitData();
      }
    },
    getInitData() {},
    changeTabsHandle(val) {
      // 切换左侧 tabs
      if (val == "components" && !this.designEditID) {
        this.$message.warning("请先选择一个页面");
        return;
      }
      this.asideTabsActive = val;
    },
    componentsDel() {
      // 组件删除
      let handleIndex = this.handleIndex;

      let templateNormal = this.design.template[this.designEditID]
      let templateData = templateNormal.data;
      templateData.splice(handleIndex, 1);

      let template = {
        key: this.designEditID,
        data: {
          ...templateNormal,
          data: templateData
        }
      };
      this.CHANGE_DESIGN_TEMPLATE(template);

      this.CHANGE_DESIGN_EDIT_INDEX("");

      if (this.designEditData.data.length === 0) {
        this.showBlankTips = true; // 显示空白页面提示
      }
      this.componentsHandle.show = false;
      this.$message.success("删除成功");
    },
    componentsToUp() {
      // 组件排序向上
      let handleIndex = this.handleIndex;

      let templateNormal = this.design.template[this.designEditID]
      let templateData = templateNormal.data;
      // templateData.splice(handleIndex, 1);

      const temp = this.deepClone(templateData[handleIndex]);
      templateData[handleIndex] = templateData[handleIndex - 1];
      templateData[handleIndex - 1] = temp;

      let template = {
        key: this.designEditID,
        data: {
          ...templateNormal,
          data: templateData
        }
      };
      this.CHANGE_DESIGN_TEMPLATE(template);
      this.componentsHandle.show = false;
    },
    componentsToDown() {
      // 组件排序向下
      let handleIndex = this.handleIndex;

      let templateNormal = this.design.template[this.designEditID]
      let templateData = templateNormal.data;

      const temp = this.deepClone(templateData[handleIndex]);
      templateData[handleIndex] = templateData[handleIndex + 1];
      templateData[handleIndex + 1] = temp;

      let template = {
        key: this.designEditID,
        data: {
          ...templateNormal,
          data: templateData
        }
      };
      this.CHANGE_DESIGN_TEMPLATE(template);
      this.componentsHandle.show = false;
    },
    handleScroll(vertical, horizontal, nativeEvent) {
      // scroll 滚动事件
      console.log(vertical, horizontal, nativeEvent);
      this.componentsHandle.show = false;
    },
    changePage(val) {
      if (this.designEditData.data.length > 0) {
        this.showBlankTips = false; // 隐藏空白页面提示
      }
      this.settingComponent = "";
      this.settingFreeComponentIndex = "";
      this.CHANGE_DESIGN_EDIT_INDEX("");

      this.pageSettingHandle();
    },
    mouseoverHandle() {
      this.componentsHandle.show = true;
    },
    mouseoutHandle() {
      this.componentsHandle.show = false;
    },
    mouseoverComponenter(item, index, evt) {
      // 鼠标移入组件事件
      // 记录当前鼠标落在元素的 index
      this.handleIndex = index;
      // 显示 handle
      let id = `previewListBox-${index}`;
      let scrollTop = this.$refs["scroll"].scrollPanelElm
        ? this.$refs["scroll"].scrollPanelElm.scrollTop
        : 0;
      let top = document.getElementById(id).offsetTop - scrollTop;
      this.componentsHandle.top = top > 539 ? 539 : top;
      this.componentsHandle.show = true;
      this.componentsHandle.upShow = true;
      this.componentsHandle.downShow = true;
      if (index == 0) {
        this.componentsHandle.upShow = false;
      };
      if (index == this.designEditData.data.length - 1) {
        this.componentsHandle.downShow = false;
      };
    },
    mouseoutComponenter(item, index, evt) {
      // 鼠标移出组件事件
      this.componentsHandle.show = false;
    },
    clickComponent(item, index, evt) {
      console.log("clickComponent");
      // 点击组件
      this.selectNavbar = false; // 点击普通组件 取消navbar选中
      this.showNavbarHandle = false; // 隐藏 navbar handle

      this.showPageSetting = false; // 隐藏页面设置

      this.CHANGE_DESIGN_EDIT_INDEX(index);

      if (item.label == "freeContainer") {
        // 当前点击的是 自由容器，包括自由组件
        console.log("当前点击的是 自由容器，包括自由组件");
        if (evt) {
          // dom 点击事件 或者冒泡事件
          console.log("dom 点击事件 或者冒泡事件");
          if (
            evt.target.classList.contains("free-preview-list") ||
            evt.target.classList.contains("free-container-title")
          ) {
            // 点击的是 自由容器
            console.log("点击的是 自由容器");
            this.settingComponent = item.settingComponent;
          } else {
            // 点击的是 自由组件
            console.log("点击的是 自由组件");
            console.log(item);
            if (
              item.setting.children[this.settingFreeComponentIndex] &&
              item.setting.children[this.settingFreeComponentIndex]
                .settingComponent
            ) {
              // 没有 settingComponent 不赋值
              this.settingComponent =
                item.setting.children[
                  this.settingFreeComponentIndex
                ].settingComponent;
            }
          }
        } else {
          // init 事件
          console.log("当前是 init 事件,不是DOM点击");
          console.log(item);
          if (
            item.setting.children[0] &&
            item.setting.children[0].settingComponent
          ) {
            this.settingComponent = item.setting.children[0].settingComponent;
          } else {
            this.settingComponent = "";
          }
        }
      } else {
        console.log("当前点击的是不自由容器");
        this.settingComponent = item.settingComponent;
        this.settingFreeComponentIndex = ""; // 自由组件 setting index
      }
    },
    freeDelComponents(val) {
      this.settingComponent = val;
    },
    pageSettingHandle() {
      if (!this.designEditID) {
        return;
      }
      this.showPageSetting = true; // 隐藏页面设置
      this.settingComponent = "PageSetting";
    },
    bottomMenuHandle() {
      this.selectNavbar = true;
      this.showPageSetting = false; // 隐藏页面设置
      this.settingComponent = "NavbarSetting";
      this.showNavbarHandle = true;

      this.CHANGE_DESIGN_EDIT_INDEX("");
    },
    clickNavbar(item, index) {
      // 隐藏普通组件handle

      // 显示右侧配置页
      this.CHANGE_DESIGN_EDIT_INDEX("");
      // 显示navbar handle
      this.showNavbarHandle = true;
    },
    previewLog(evt) {},
    startHandle(val) {
      console.log("startHandle val");
      console.log(val);
      this.showBlankTips = false; // 隐藏空白页面提示
      this.dragOffsetData = {
        x: val.originalEvent.offsetX,
        y: val.originalEvent.offsetY
      };
      // console.log(val.item.dataset.type)
      if (val.item.dataset.type == "free") {
        // this.listGroupOption.name = 'free'
        this.freeGroup = "normal";
        this.fillContainer();
      }
      if (val.item.dataset.type == "navbar") {
        if (this.navbarList.length > 0) {
          this.listGroupOption.name = "other";
        } else {
          this.showNavbarDragBox = true;
          this.listGroupOption.name = "navbar";
        }
      }
    },
    endHandle(val) {
      // 拖动结束
      let templateNormal = this.design.template[this.designEditID];
      let templateData = templateNormal.data;
      let endIndex = Number(val.to.dataset.index);

      // 清除自由容器填充组件
      if (val.item.dataset.type == "free") {
        for (let item of templateData) {
          if (item.label == "freeContainer") {
            item.setting.children.splice(0, 1);
          }
        };
      };
      // 放置容器
      if (val.to.dataset.name === "previewList") {
        // 组件拖动到普通容器
        if (val.item.dataset.type === "free") {
          // 自由组件拖动到普通容器
          // newIndex
          let componentsList = this.deepClone(componentsListConfig);
          let obj = {};
          for (let item of componentsList) {
            if (item.label == "freeContainer") {
              obj = item;
              obj.id = uuidV4();
              break;
            }
          };
          for (let item of componentsList) {
            if (item.label == val.item.dataset.label) {
              obj.setting.children = [
                {
                  ...item,
                  id: uuidV4()
                }
              ];
              break;
            }
          };
          templateData.splice(val.newIndex, 1, obj);
          let template = {
            key: this.designEditID,
            data: {
              ...templateNormal,
              data: templateData
            }
          };
          this.CHANGE_DESIGN_TEMPLATE(template);

          this.settingFreeComponentIndex = 0; // 默认选中第一个自由组件
          this.$nextTick(() => {
            this.clickComponent(
              this.designEditData.data[val.newIndex],
              val.newIndex,
              ""
            );
          });
        } else {
          // 普通组件拖动到普通容器
          // 默认选中
          this.clickComponent(
            this.designEditData.data[val.newIndex],
            val.newIndex,
            ""
          );
        }
      } else if (val.to.dataset.name === "freePreviewDrag") {
        // 自由组件拖动到自由容器
        let scrollTop = this.$refs["scroll"].scrollPanelElm
          ? this.$refs["scroll"].scrollPanelElm.scrollTop
          : 0;
        let offsetX = 0,
          offsetY = 0;

        let dropBox = document.getElementById(val.to.id);
        let dropBoxTop = dropBox.getBoundingClientRect().top;
        let dropBoxLeft = dropBox.getBoundingClientRect().left;

        offsetX = val.originalEvent.x - dropBoxLeft + 1 - this.dragOffsetData.x;

        offsetY =
          val.originalEvent.y -
          dropBoxTop +
          scrollTop -
          this.dragOffsetData.y +
          1;

        // 组件拖入超出区域 显示到区域内
        if (offsetX < 0) {
          offsetX = 0;
        } else if (offsetX > val.to.offsetWidth - 100) {
          offsetX = val.to.offsetWidth - 100;
        }
        if (offsetY < 0) {
          offsetY = 0;
        } else if (offsetY > val.to.offsetHeight - 100) {
          offsetY = val.to.offsetHeight - 100;
        };

        let label = val.item.dataset.label;
        for (let item of this.componentsList) {
          if (label === item.label) {
            let obj = {
              ...item,
              id: uuidV4()
            };
            obj.setting.x = offsetX;
            obj.setting.y = offsetY;
            obj.setting.z =
              templateData[endIndex].setting.children.length + 1;
            templateData[endIndex].setting.children.push(obj);
            break;
          }
        };

        let template_ = {
          key: this.designEditID,
          data: {
            ...templateNormal,
            data: templateData
          }
        };
        this.CHANGE_DESIGN_TEMPLATE(template_);
      }
      this.freeGroup = "free";
      this.listGroupOption.name = "normal";
      if (this.navbarList.length <= 0) {
        this.showNavbarDragBox = false;
      };
      if (this.designEditData.data.length === 0) {
        this.showBlankTips = true; // 显示空白页面提示
      } else {
        this.showBlankTips = false; // 隐藏空白页面提示
      }
    },
    cloneHandle(obj) {
      console.log("clone obj");
      console.log(obj);

      // 如果已经有了 navbar 则return
      if (obj.type == "navbar" && this.navbarList.length > 0) {
        return;
      };

      let setting = {};
      for (let item of this.componentsList) {
        if (obj.label === item.label) {
          setting = this.deepClone(item.setting);
          break;
        }
      }
      // console.log(setting);
      let newObj = {
        ...obj,
        setting,
        id: uuidV4()
      };
      // console.log(newObj);
      return newObj;
    },
    moveHandle(obj) {
      console.log("move");
      console.log(obj);
    },
    dragDisabledHandle(val) {
      // 自由组件拖动时  禁止其他拖动操作
      this.dragDisabled = val;
      console.log(`disabled ${val}`);
    },
    freeComponentClick(val) {
      console.log("freeComponentClick");
      // 自由组件被点击时
      this.settingFreeComponentIndex = val;
      this.settingComponent = this.designEditData.data[
        this.designEditIndex
      ].setting.children[val].settingComponent;
    },
    fillContainer() {
      // 优化自由组件放置
      let freeFill = {
        id: uuidV4(),
        label: "freeFill",
        name: "填充",
        type: "free",
        icon: "",
        previewComponent: "FreeFill",
        settingComponent: "",
        setting: {
          width: 375,
          height: 300,
          x: 0,
          y: 0,
          z: 0
        }
      };

      let templateNormal = this.deepClone(this.design.template[this.designEditID]);
      let templateData = templateNormal.data;
      if(templateData.length > 0) {
        templateData.map((item, index) => {
          if (item.type == "freeContainer") {
            freeFill.setting.height = Number(item.setting.height);
            item.setting.children.unshift(freeFill);
          }
        });
        let template = {
          key: this.designEditID,
          data: {
            ...templateNormal,
            data: templateData
          }
        };
        this.CHANGE_DESIGN_TEMPLATE(template);
      };
    },
    deepClone(target) {
      // 定义一个变量
      let result;
      // 如果当前需要深拷贝的是一个对象的话
      if (typeof target === "object") {
        // 如果是一个数组的话
        if (Array.isArray(target)) {
          result = []; // 将result赋值为一个数组，并且执行遍历
          for (let i in target) {
            // 递归克隆数组中的每一项
            result.push(this.deepClone(target[i]));
          }
          // 判断如果当前的值是null的话；直接赋值为null
        } else if (target === null) {
          result = null;
          // 判断如果当前的值是一个RegExp对象的话，直接赋值
        } else if (target.constructor === RegExp) {
          result = target;
        } else {
          // 否则是普通对象，直接for in循环，递归赋值对象的所有值
          result = {};
          for (let i in target) {
            result[i] = this.deepClone(target[i]);
          }
        }
        // 如果不是对象的话，就是基本数据类型，那么直接赋值
      } else {
        result = target;
      }
      // 返回最终结果
      return result;
    }
  }
};
</script>

<style>
@import url("./style/index.min.css");
</style>