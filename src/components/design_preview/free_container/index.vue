<template>
  <div class="free-container-wrap" :style="{paddingTop: setting.hideName ? '0' : '40px'}">
    <div class="free-container-title" v-show="!setting.hideName">
      —— {{setting.name}} ——
    </div>
    <div class="free-container-main">
      <vdr
        class="free-container"
        :w="parentWidth"
        :h="parentHeight"
        :min-height="parentMinHeight"
        :draggable="false"
        :handles="['bm']"
        @resizing="parentResize"
      >
        <div style="width: 100%;height: 100%;">
          <Contextmenu ref="contextmenu" @contextmenu="handleContextmenu">
            <ContextmenuItem :disabled="contextMenuDisabled.toTop" @click="contextMenuToTop">置于顶层</ContextmenuItem>
            <ContextmenuItem :disabled="contextMenuDisabled.toUp" @click="contextMenuToUp">上移一层</ContextmenuItem>
            <ContextmenuItem :disabled="contextMenuDisabled.toDown" @click="contextMenuToDown">下移一层</ContextmenuItem>
            <ContextmenuItem
              :disabled="contextMenuDisabled.toBottom"
              @click="contextMenuToBottom"
            >置于底层</ContextmenuItem>
            <ContextmenuItem @click="contextMenuCopy">复制</ContextmenuItem>
            <ContextmenuItem @click="contextMenuDel">删除</ContextmenuItem>
          </Contextmenu>
          <draggable
            class="free-preview-list"
            :list="containerListClone"
            data-name="freePreviewDrag"
            :data-index="itemIndex"
            :group="freeGroup"
            :sort="false"
            element="div"
            @change="log"
            :disabled="dragDisabled"
            :id="'freePreviewnew_'+new Date().getTime()"
          >
            <template v-for="(item, index) in containerList">
              <vdr
                :is-conflict-check="true"
                :w="item.setting.width"
                :h="item.setting.height"
                :x="item.setting.x"
                :y="item.setting.y"
                :z="item.setting.z"
                :key="item.id"
                :data-z="item.setting.z"
                :data-x="item.setting.x"
                :data-y="item.setting.y"
                :data-index="index"
                :min-height="40"
                :min-width="40"
                @dragging="onDrag(index, arguments)"
                @resizing="onResize(index, arguments)"
                @activated="onActivated(item, index)"
                @deactivated="onDeactivated"
                :parent="true"
                :snap="true"
                :snapTolerance="3"
                @refLineParams="getRefLineParams"
                :isConflictCheck="false"
                v-contextmenu:contextmenu
              >
                <div
                  class="component-wrap"
                  @mouseover="mouseOverHandle"
                  @mouseout="mouseOutHandle"
                  @mouseup="componentsClick"
                >
                  <div class="component-delete" @click.stop="deleteComponent(item, index)">
                    <i class="el-icon-close icon"></i>
                  </div>
                  <component
                    :is="item.previewComponent"
                    :setting="item.setting"
                  ></component>
                </div>
              </vdr>
            </template>
            <!-- 辅助线 start -->
            <template>
              <!-- 纵向 -->
              <span
                class="ref-line v-line"
                v-for="(item, index) in vLine"
                v-show="item.display"
                :style="{ left: item.position, top: item.origin, height: item.lineLength, zIndex: 9999+index}"
                :key="'v-line'+index"
              ></span>
              <!-- 横向 -->
              <span
                class="ref-line h-line"
                v-for="(item, index) in hLine"
                v-show="item.display"
                :style="{ top: item.position, left: item.origin, width: item.lineLength, zIndex: 9999+index}"
                :key="'h-line'+index"
              ></span>
              <!-- 辅助线 end -->
            </template>
          </draggable>
        </div>
      </vdr>
    </div>
  </div>
</template>

<script>
import uuidV4 from "uuid/v4";

import draggable from "vuedraggable";
import vdr from "vue-draggable-resizable-gorkys";

import { mapState, mapGetters, mapMutations } from "vuex";

import {
  directive,
  Contextmenu,
  ContextmenuItem,
  ContextmenuSubmenu,
  ContextmenuGroup
} from "v-contextmenu";
import "v-contextmenu/dist/index.css";

import FreeFill from "../../../components/design_preview/free_fill";
import FreeImage from "../../../components/design_preview/free_image";
import FreeText from "../../../components/design_preview/free_text";
import FreeBtn from "../../../components/design_preview/free_btn";
import FreeOmnipotent from "../../../components/design_preview/free_omnipotent";

export default {
  name: "freeContainer",
  components: {
    draggable,
    vdr,
    FreeFill,
    FreeImage,
    FreeText,
    FreeBtn,
    FreeOmnipotent,
    directive,
    Contextmenu,
    ContextmenuItem,
    ContextmenuSubmenu,
    ContextmenuGroup
  },
  directives: {
    contextmenu: directive
  },
  computed: {
    ...mapState([
      "design",
      "designEditID",
      "designEditIndex"
    ]),
    ...mapGetters([
      "designEditData"
    ])
  },
  props: ["itemIndex", "setting", "freeGroup"],
  watch: {
    "setting": {
      immediate: true,
      deep: true,
      handler(val) {
        let children = val.children;
        this.parentHeight = parseInt(val.height);
        if (this.watchSettingLater) {
          clearTimeout(this.watchSettingLater);
          this.watchSettingLater = null;
        }
        // this.$nextTick(() => {})
        this.watchSettingLater = setTimeout(() => {
          let containerList = this.deepClone(children);
          this.containerList = containerList;

          // 重置 自由容器 自小高度 start
          let maxHeight = 0; // 取当前自由容器最大高度元素
          for (let item of containerList) {
            let itemMaxHeight = item.setting.height + item.setting.y;
            if (maxHeight < itemMaxHeight) {
              maxHeight = itemMaxHeight;
            }
          }
          this.parentMinHeight = maxHeight;
          // 重置 自由容器 自小高度 end

          clearTimeout(this.watchSettingLater);
          this.watchSettingLater = null;
        }, 100);
      }
    },
    // "setting.children": {
    //   immediate: true,
    //   deep: true,
    //   handler(val) {
    //     console.log("watch - setting.children");
    //     console.log(val);
    //     if (this.watchSettingLater) {
    //       clearTimeout(this.watchSettingLater);
    //       this.watchSettingLater = null;
    //     }
    //     // this.$nextTick(() => {})
    //     this.watchSettingLater = setTimeout(() => {
    //       let containerList = this.deepClone(val);
    //       this.containerList = containerList;

    //       // 重置 自由容器 自小高度 start
    //       let maxHeight = 0; // 取当前自由容器最大高度元素
    //       for (let item of containerList) {
    //         let itemMaxHeight = item.setting.height + item.setting.y;
    //         if (maxHeight < itemMaxHeight) {
    //           maxHeight = itemMaxHeight;
    //         }
    //       }
    //       this.parentMinHeight = maxHeight;
    //       // 重置 自由容器 自小高度 end

    //       clearTimeout(this.watchSettingLater);
    //       this.watchSettingLater = null;
    //     }, 100);
    //   }
    // }
  },
  data() {
    return {
      parentWidth: 375,
      parentHeight: 300,
      parentMinHeight: 100,
      windowResizeLater: null, // 自由容器大小变化定时器
      containerList: [],
      containerListClone: [],
      submitLater: null,
      dragDisabled: false,
      vLine: [],
      hLine: [],
      contextMenuDisabled: {
        toTop: false,
        toUp: false,
        toDown: false,
        toBottom: false
      },
      contextMenuProps: {
        key: 0,
        z: 1
      },
      watchSettingLater: null, // 监听 props setting 变化赋值定时器
      keyDownIndex: null
    };
  },
  methods: {
    ...mapMutations([
      "CHANGE_DESIGN_TEMPLATE"
    ]),
    deleteComponent(item, index) {
      let containerList = this.containerList;
      containerList.splice(index, 1);
      for (let i = 0; i < containerList.length; i++) {
        containerList[i].setting.z = i + 1;
      }
      this.containerList = containerList;
      this.$emit('freeDelComponents', '');
      this.$emit("dragDisabledHandle", false);
      this.dragDisabled = false;
      this.submit();
      this.$message.success("删除成功！");
    },
    log(evt) {
      console.log("free-container change log");
      console.log(evt);
    },
    // 右键点击事件
    handleContextmenu(vnode) {
      // let index = vnode.data.attrs.dataIndex;
      // let z = vnode.data.attrs.dataZ;
      let index = Number(vnode.elm.dataset.index);
      let z = Number(vnode.elm.dataset.z);

      // this.contextMenuProps.key = vnode.key;
      this.contextMenuProps.key = index;
      this.contextMenuProps.z = z;

      // 是否禁用右键部分选项
      this.contextMenuDisabled.toDown = false;
      this.contextMenuDisabled.toBottom = false;
      this.contextMenuDisabled.toTop = false;
      this.contextMenuDisabled.toUp = false;
      if (z == 1) {
        this.contextMenuDisabled.toDown = true;
        this.contextMenuDisabled.toBottom = true;
      } else if (z == this.containerList.length) {
        this.contextMenuDisabled.toTop = true;
        this.contextMenuDisabled.toUp = true;
      }
    },
    // 右键菜单点击选项事件
    contextMenuToTop() {
      // 置于顶层
      // console.log(this.contextMenuProps)
      // console.log(this.containerList)
      let containerList = this.containerList;
      let key = this.contextMenuProps.key;
      for (let i = key + 1; i < containerList.length; i++) {
        containerList[i].setting.z--;
      }
      containerList[key].setting.z = containerList.length;
      this.containerList = this.containerListSort(containerList);
      this.submit();
    },
    contextMenuToUp() {
      // 上移一层
      let containerList = this.containerList;
      let key = this.contextMenuProps.key;
      containerList[key].setting.z++;
      containerList[key + 1].setting.z--;
      let newContainerList = this.containerListSort(containerList);
      console.log("上移一层");
      console.log(newContainerList);
      this.containerList = newContainerList;
      this.submit();
    },
    contextMenuToDown() {
      // 下移一层
      let containerList = this.containerList;
      let key = this.contextMenuProps.key;
      containerList[key].setting.z--;
      containerList[key - 1].setting.z++;
      let newContainerList = this.containerListSort(containerList);
      console.log("下移一层");
      console.log(newContainerList);
      this.containerList = newContainerList;
      this.submit();
    },
    contextMenuToBottom() {
      // 置于底部
      let containerList = this.containerList;
      let key = this.contextMenuProps.key;
      for (let i = 0; i < key; i++) {
        containerList[i].setting.z++;
      }
      containerList[key].setting.z = 1;
      this.containerList = this.containerListSort(containerList);
      this.submit();
    },
    containerListSort(list) {
      // 根据 z 轴 排序组件
      for (let i = 0; i < list.length - 1; i++) {
        for (let j = 0; j < list.length - 1 - i; j++) {
          if (list[j].setting.z > list[j + 1].setting.z) {
            let temp = list[j];
            list[j] = list[j + 1];
            list[j + 1] = temp;
          }
        }
      }
      return list;
    },
    contextMenuCopy() {
      // 复制自由组件
      let containerList = this.containerList;
      let key = this.contextMenuProps.key;
      let obj = this.deepClone(containerList[key]);
      obj.id = uuidV4();
      obj.setting.z = containerList.length + 1;
      containerList.push(obj);
      this.containerList = this.containerListSort(containerList);
      this.$message.success("复制成功！");
      this.submit();
    },
    contextMenuDel() {
      // 删除自由组件
      let containerList = this.containerList;
      let key = this.contextMenuProps.key;
      containerList.splice(key, 1);
      for (let i = 0; i < containerList.length; i++) {
        containerList[i].setting.z = i + 1;
      }
      this.containerList = containerList;
      this.$emit('freeDelComponents', '');
      this.$emit("dragDisabledHandle", false);
      this.dragDisabled = false;
      this.submit();
      this.$message.success("删除成功！");
    },
    parentResize(x, y, w, h) {
      if (this.windowResizeLater) {
        clearTimeout(this.windowResizeLater);
        this.windowResizeLater = null;
      }

      this.parentHeight = h;
      this.windowResizeLater = setTimeout(() => {
        let resizeEvent = new Event("resize");
        window.dispatchEvent(resizeEvent);

        let templateNormal = this.design.template[this.designEditID]
        let templateData = templateNormal.data;
        templateData[this.itemIndex].setting.height = h;

        let template = {
          key: this.designEditID,
          data: {
            ...templateNormal,
            data: templateData
          }
        };
        this.CHANGE_DESIGN_TEMPLATE(template);

        clearTimeout(this.windowResizeLater);
        this.windowResizeLater = null;
      }, 300);
    },
    onResize(index, [x, y, width, height]) {
      // 拖动大小的方法
      console.log("onResize");
      this.containerList[index].setting.x = x;
      this.containerList[index].setting.y = y;
      this.containerList[index].setting.width = width;
      this.containerList[index].setting.height = height;
      // this.onResizeSnap(index, x, y, width, height);

      // 重置 自由容器 自小高度 start
      let maxHeight = 0; // 取当前自由容器最大高度元素
      for (let item of this.containerList) {
        let itemMaxHeight = item.setting.height + item.setting.y;
        if (maxHeight < itemMaxHeight) {
          maxHeight = itemMaxHeight;
        }
      }
      this.parentMinHeight = maxHeight;
      // 重置 自由容器 自小高度 end

      this.submit();
    },
    onResizeSnap(index, x, y, width, height) {
      // 拖动大小时添加辅助线
      this.vLine = [];
      this.hLine = [];

      // 当前拖动元素的参数
      let vLine = [], // 竖线
        hLine = []; // 横线
      let left = x,
        center = x + width / 2,
        right = x + width;
      let top = y,
        middle = y + height / 2,
        bottom = y + height;

      for (let [itemIndex, item] of this.containerList.entries()) {
        // 非当前拖动元素的参数
        let setting = item.setting;
        let x_ = setting.x,
          y_ = setting.y,
          width_ = setting.width,
          height_ = setting.height;
        if (itemIndex !== index) {
          let left_ = x_,
            center_ = x_ + width_ / 2,
            right_ = x_ + width_;
          let top_ = y_,
            middle_ = y_ + height_ / 2,
            bottom_ = y_ + height_;

          // vLine
          let vLineLength = y < y_ ? y_ - y + height : y - y_ + height;
          if (
            (left >= left_ - 3 && left <= left_ + 3) ||
            (right >= left_ - 3 && right <= left_ + 3)
          ) {
            // 吸附
            // left = left_
            // this.containerList[index].setting.x = left_;
            // this.containerList[index].id = uuidV4();

            let posTop = y < y_ ? y : y_;
            let posLeft = left_;
            vLine.push({
              display: true, // 是否显示
              position: `${posLeft}px`, // hLine-top  vLine-left
              origin: `${posTop}px`, // hLine-left vLine-top
              lineLength: `${vLineLength}px` // width \ height
            });
          }

          if (center >= center_ - 1 && center <= center_ + 1) {
            let posTop = y < y_ ? y : y_;
            let posLeft = center_;
            vLine.push({
              display: true, // 是否显示
              position: `${posLeft}px`, // hLine-top  vLine-left
              origin: `${posTop}px`, // hLine-left vLine-top
              lineLength: `${vLineLength}px` // width \ height
            });
          }

          if (
            (right >= right_ - 3 && right <= right_ + 3) ||
            (left >= right_ - 3 && left <= right_ + 3)
          ) {
            let posTop = y < y_ ? y : y_;
            let posLeft = right_;
            vLine.push({
              display: true, // 是否显示
              position: `${posLeft}px`, // hLine-top  vLine-left
              origin: `${posTop}px`, // hLine-left vLine-top
              lineLength: `${vLineLength}px` // width \ height
            });
          }

          // hLine
          let hLineLength = x < x_ ? x_ - x + width : x - x_ + width;
          if (
            (top >= top_ - 3 && top <= top_ + 3) ||
            (bottom >= top_ - 3 && bottom <= top_ + 3)
          ) {
            let posTop = top_;
            let posLeft = x < x_ ? x : x_;
            hLine.push({
              display: true, // 是否显示
              position: `${posTop}px`, // hLine-top  vLine-left
              origin: `${posLeft}px`, // hLine-left vLine-top
              lineLength: `${hLineLength}px` // width \ height
            });
          }
          if (middle >= middle_ - 1 && middle <= middle_ + 1) {
            let posTop = middle_;
            let posLeft = x < x_ ? x : x_;
            hLine.push({
              display: true, // 是否显示
              position: `${posTop}px`, // hLine-top  vLine-left
              origin: `${posLeft}px`, // hLine-left vLine-top
              lineLength: `${hLineLength}px` // width \ height
            });
          }
          if (
            (bottom >= bottom_ - 3 && bottom <= bottom_ + 3) ||
            (top >= bottom_ - 3 && top <= bottom_ + 3)
          ) {
            let posTop = bottom_;
            let posLeft = x < x_ ? x : x_;
            hLine.push({
              display: true, // 是否显示
              position: `${posTop}px`, // hLine-top  vLine-left
              origin: `${posLeft}px`, // hLine-left vLine-top
              lineLength: `${hLineLength}px` // width \ height
            });
          }
        }
      }
      this.vLine = vLine;
      this.hLine = hLine;
      // console.log("vLine");
      // console.log(vLine);
      // console.log("hLine");
      // console.log(hLine);
    },
    onDrag(index, [x, y]) {
      this.containerList[index].setting.x = x;
      this.containerList[index].setting.y = y;

      // 重置 自由容器 自小高度 start
      let maxHeight = 0; // 取当前自由容器最大高度元素
      for (let item of this.containerList) {
        let itemMaxHeight = item.setting.height + item.setting.y;
        if (maxHeight < itemMaxHeight) {
          maxHeight = itemMaxHeight;
        }
      }
      this.parentMinHeight = maxHeight;
      // 重置 自由容器 自小高度 end

      console.log("onDrag");
      this.submit();
    },
    submit() {

      let templateNormal = this.design.template[this.designEditID];
      let templateData = templateNormal.data;
      templateData[this.itemIndex].setting.children = this.containerList;

      let template = {
        key: this.designEditID,
        data: {
          ...templateNormal,
          data: templateData
        }
      };
      this.CHANGE_DESIGN_TEMPLATE(template);
    },
    keydown(event) {
      console.log("keydown");
      // 上下左右键 移动组件
      var e = event || window.event || arguments.callee.caller.arguments[0];
      e.preventDefault();
      const index = this.keyDownIndex;

      let x = this.containerList[index].setting.x;
      let y = this.containerList[index].setting.y;
      console.log(index);

      if (e && e.keyCode == 37) {
        // 左键
        console.log("左键");
        if (x > 0) {
          x--;
        }
      }
      if (e && e.keyCode == 38) {
        // 上键
        console.log("上键");
        if (y > 0) {
          y--;
        }
      }
      if (e && e.keyCode == 39) {
        // 右键
        console.log("右键");
        if (x < this.parentWidth) {
          x++;
        }
      }
      if (e && e.keyCode == 40) {
        // 下键
        console.log("下键");
        if (x < this.parentHeight) {
          y++;
        }
      }

      this.containerList[index].setting.x = x;
      this.containerList[index].setting.y = y;
      console.log("keydown");
      this.submit();
    },
    onActivated(item, index, e) {
      // this.active = true
      console.log("onActivated");
      this.$emit("dragDisabledHandle", true);
      this.dragDisabled = true;
      this.$emit("freeComponentClick", index);
      this.keyDownIndex = JSON.parse(JSON.stringify(index));
      window.addEventListener("keydown", this.keydown);
    },
    onDeactivated() {
      // this.active = false
      console.log("onDeactivated");
      this.$emit("dragDisabledHandle", false);
      this.dragDisabled = false;
      window.removeEventListener("keydown", this.keydown);
    },
    mouseOverHandle() {
      this.$emit("dragDisabledHandle", true);
      this.dragDisabled = true;
    },
    mouseOutHandle() {
      this.$emit("dragDisabledHandle", false);
      this.dragDisabled = false;
    },
    componentsClick() {
      console.log("componentsClick");
    },
    getRefLineParams(params) {
      const { vLine, hLine } = params;
      // console.log('getRefLineParams');
      // if(vLine[0].display) {
      //   console.log('vLine');
      //   console.log(vLine);
      // }
      // if(hLine[0].display) {
      //   console.log('hLine');
      //   console.log(hLine);
      // }
      this.vLine = vLine;
      this.hLine = hLine;
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
  },
  beforeDestroy() {
    if (this.submitLater) {
      clearTimeout(this.submitLater);
      this.submitLater = null;
    }
    if (this.windowResizeLater) {
      clearTimeout(this.windowResizeLater);
      this.windowResizeLater = null;
    }
    if (this.watchSettingLater) {
      clearTimeout(this.watchSettingLater);
      this.watchSettingLater = null;
    }
    window.removeEventListener("keydown", this.keydown);
  }
};
</script>

<style>
@import url("./style/index.min.css");
</style>