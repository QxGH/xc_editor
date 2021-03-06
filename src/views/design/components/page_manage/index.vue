<template>
  <div class="page-manage">
    <div class="page-list">
      <vuescroll>
        <template v-for="(item, index) in design.group.custom">
          <div class="group-item custom-item" :key="item.id">
            <div class="handle-box clearfix" @click.stop="changePageHandel(item)">
              <div
                class="handle-icon"
                v-show="item.children.length > 0"
                @click.stop="changeDropdownActive(item.id)"
              >
                <template v-if="item.id == dropDownActive">
                  <i class="el-icon-arrow-down icon"></i>
                </template>
                <template v-else>
                  <i class="el-icon-arrow-right icon"></i>
                </template>
              </div>
              <div class="handle-name" :class="{'active': designEditID == item.id }">{{item.name}}</div>
              <div class="handle-opt" @click.stop>
                <i class="el-icon-plus icon" @click.stop="addPage(index)"></i>
                <i class="el-icon-document-copy icon" @click.stop="copyParent(item, index)"></i>
                <el-dropdown
                  @command="((command) => { parentOptCommand(command, index, item) })"
                  trigger="click"
                >
                  <i class="el-icon-more icon"></i>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="item.children.length == 0" command="move">移动</el-dropdown-item>
                    <el-dropdown-item command="del">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <el-collapse-transition>
              <ul class="group-children" v-show="item.id == dropDownActive">
                <template v-for="(childrenItem, childrenIndex) in item.children">
                  <li
                    class="handle-box clearfix"
                    @click.stop="changePageHandel(childrenItem)"
                    :key="childrenItem.id"
                  >
                    <div
                      class="handle-name"
                      :class="{'active': designEditID == childrenItem.id}"
                    >{{childrenItem.name}}</div>
                    <div class="handle-opt" @click.stop>
                      <i
                        class="el-icon-document-copy icon"
                        @click.stop="copyChildren(item, childrenItem, index, childrenIndex)"
                      ></i>
                      <el-dropdown
                        @click.stop
                        @command="((command) => { childrenOptCommand(command, childrenIndex, item, childrenIndex, childrenItem) })"
                        trigger="click"
                      >
                        <i class="el-icon-more icon"></i>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="move">移动</el-dropdown-item>
                          <el-dropdown-item command="del">删除</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </li>
                </template>
              </ul>
            </el-collapse-transition>
          </div>
        </template>
        <!-- 个人中心 页面  start -->
        <div class="system-page-item group-item">
          <template v-for="(item_, index) in design.group.system">
            <div class="handle-box clearfix" @click="changePageHandel(item_)" :key="index">
              <div class="handle-name" :class="{'active': designEditID == item_.id}">
                个人中心
                <span class="tips">【系统页面】</span>
              </div>
            </div>
          </template>
        </div>
        <!-- 个人中心 页面  end -->
      </vuescroll>
    </div>
    <div class="add-btn-box">
      <el-button type="primary" @click="addPage('')">新建页面</el-button>
    </div>
    <Move v-if="showMoveDialog" :moveParams="moveParams" @moveClose="moveSubmit"></Move>
  </div>
</template>

<script>
import uuidV4 from "uuid/v4";
import vuescroll from "vuescroll";
import { mapState, mapGetters, mapMutations } from "vuex";
import deepClone from "@/tools/deepClone";
import Move from "./components/move";

export default {
  name: "PageManage",
  computed: {
    ...mapState([
      "design",
      "designEditID"
    ]),
    ...mapGetters(["designEditData"])
  },
  components: {
    Move,
    vuescroll
  },
  data() {
    return {
      dropDownActive: "index",
      moveParams: {}, // 当前移动页面的参数
      showMoveDialog: false, // 是否显示'移动'弹窗
      userPageData: {
        id: uuidV4(),
        label: "user",
        name: "分割线",
        icon: "icon-user",
        type: "normal",
        previewComponent: "User",
        settingComponent: "",
        version: 1,
        setting: {}
      }
    };
  },
  methods: {
    ...mapMutations([
      "CHANGE_DESIGN_EDIT_ID",
      "CHANGE_DESIGN_TEMPLATE",
      "CHANGE_DESIGN_PAGE_MAX",
      "CHANGE_DESIGN_GROUP",
      "DELETE_DESIGN_TEMPLATE",
    ]),
    changeDropdownActive(id) {
      if (this.dropDownActive == id) {
        this.dropDownActive = "";
      } else {
        this.dropDownActive = id;
      }
    },
    changePageHandel(item) {
      this.CHANGE_DESIGN_EDIT_ID(item.id);

      this.$emit("changePage", item);
    },
    addPage(index) {
      // 新建页面
      let id = this.design.data.pageMaxID + 1;
      let page = {
        key: "page-" + id,
        data: {
          setting: {
            name: "新建页面"+id,
            pageBgColor: "#FFFFFF",
            navBgColor: "#FFFFFF",
            navTitColor: "#000000",
            shareDescribe: "",
            shareImage: ""
          },
          data: [],
          type: 'custom'
        }
      };
      this.CHANGE_DESIGN_TEMPLATE(page);
      this.CHANGE_DESIGN_PAGE_MAX(id);

      let group = this.design.group;
      let groupObj = {
        id: "page-" + id,
        name: page.data.setting.name
      };
      if (index !== "") {
        group.custom[index].children.push(groupObj);
      } else {
        groupObj.children = [];
        group.custom.push(groupObj);
      }
      this.CHANGE_DESIGN_GROUP(group);
    },
    copyParent(item, index) {
      // 复制父级页面
      let pageMaxID = this.design.data.pageMaxID;
      let design = this.design;
      let item_ = deepClone(item);
      let group = this.design.group;
      let groupObj = {}; // 分组

      // 先复制父级
      pageMaxID++;
      let newParentTemplate = deepClone(design.template[item_.id]);
      let template = {
        key: "page-" + pageMaxID,
        data: newParentTemplate
      };
      template.data.setting.name = item_.name + "-副本"
      this.CHANGE_DESIGN_TEMPLATE(template);

      groupObj = {
        id: "page-" + pageMaxID,
        name: item_.name + "-副本",
        children: []
      };

      if (item_.children.length > 0) {
        for (let i of item_.children) {
          pageMaxID++;
          let newChildrenTemplate = deepClone(design.template[i.id]);
          let template_ = {
            key: "page-" + pageMaxID,
            data: newChildrenTemplate
          };
          this.CHANGE_DESIGN_TEMPLATE(template_);
          groupObj.children.push({
            id: "page-" + pageMaxID,
            name: i.name + "-副本"
          });
        }
      }
      group.custom.splice(index+1, 0, groupObj);
      this.CHANGE_DESIGN_PAGE_MAX(pageMaxID);
      this.CHANGE_DESIGN_GROUP(group);
    },
    copyChildren(item, childrenItem, index, childrenIndex) {
      // 复制子级页面
      let pageMaxID = this.design.data.pageMaxID;
      let design = this.design;
      let childrenItem_ = deepClone(childrenItem);
      let group = this.design.group;
      let groupObj = {}; // 分组

      pageMaxID++;
      let newTemplate = deepClone(design.template[childrenItem_.id]);
      let template = {
        key: "page-" + pageMaxID,
        data: newTemplate
      };
      template.data.setting.name = childrenItem_.name + "-副本"
      this.CHANGE_DESIGN_TEMPLATE(template);

      groupObj = {
        id: "page-" + pageMaxID,
        name: childrenItem_.name + "-副本"
      };
      group.custom[index].children.splice(childrenIndex+1, 0, groupObj)
      this.CHANGE_DESIGN_PAGE_MAX(pageMaxID);
      this.CHANGE_DESIGN_GROUP(group);
    },
    parentOptCommand(command, index, item) {
      // 父级 删除 或 移动

      if (command == "del") {
        // 如果删除的是当前页面
        if (this.designEditID == item.id) {
          this.CHANGE_DESIGN_EDIT_ID(" ");
        }
        // 删除摸板
        this.DELETE_DESIGN_TEMPLATE(item.id);
        // 删除分组
        let group = this.design.group;
        group.custom.splice(index, 1);
        this.CHANGE_DESIGN_GROUP(group);
      } else if (command == "move") {
        this.moveParams = {
          type: "parent",
          parentID: item.id,
          childrenID: "",
          name: item.name,
          index
        };
        this.showMoveDialog = true;
      }
    },
    childrenOptCommand(command, index, item, childrenIndex, childrenItem) {
      if (command == "del") {
        // 如果删除的是当前页面
        if (this.designEditID == childrenItem.id) {
          this.CHANGE_DESIGN_EDIT_ID(" ");
        }
        // 删除摸板
        this.DELETE_DESIGN_TEMPLATE(childrenItem.id);
        // 删除分组
        let group = this.design.group;
        group.custom[index].children.splice(childrenIndex, 1);
        this.CHANGE_DESIGN_GROUP(group);
      } else if (command == "move") {
        this.moveParams = {
          type: "children",
          parentID: item.id,
          childrenID: childrenItem.id,
          name: childrenItem.name,
          index,
          childrenIndex
        };
        this.showMoveDialog = true;
      }
    },
    moveSubmit(val) {
      let { newID, oldParams } = val;
      // id 没变  return;
      if (oldParams.type == "parent") {
        if (newID == oldParams.parentID) {
          return;
        }
      } else if (oldParams.type == "children") {
        if (newID == oldParams.childrenID) {
          return;
        }
      }

      let group = this.design.group;
      let moveObj = deepClone(group.custom[oldParams.index]);
      group.custom.splice(oldParams.index, 1);
      for (let item of group.custom) {
        if (item.id === newID) {
          item.children.push(moveObj);
          break;
        }
      }
      this.CHANGE_DESIGN_GROUP(group);

      this.showMoveDialog = false;
    }
  }
};
</script>

<style>
@import url("./style/index.min.css");
</style>