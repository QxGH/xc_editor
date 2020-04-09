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
            <div
              class="handle-name"
              :class="{'active': designEditID == item.id }"
            >{{item.name}}</div>
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
                      @click.stop="copyChildren(item, childrenItem, index)"
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
      <div class="user-page-item group-item">
        <div class="handle-box clearfix" @click="changePageHandel(userPageData, {}, 'parent')">
          <div class="handle-name" :class="{'active': editorCurrentPage.parent == userPageData.id && !editorCurrentPage.children }">
            个人中心
            <span class="tips">【系统页面】</span>
          </div>
        </div>
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
import { mapState, mapMutations } from "vuex";
import deepClone from "@/tools/deepClone";
import Move from "./components/move";

export default {
  name: "PageManage",
  computed: {
    ...mapState(["design", "designEditID", "editorPageData", "editorCurrentPage"])
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
      "CHANGE_DESIGN_TEMPLATE_MAX",
      "CHANGE_DESIGN_GROUP",
      "DELETE_DESIGN_TEMPLATE",

      "CHANGE_EDITOR_LIST",
      "CHANGE_EDITOR_CURRENT_PAGE",
      "CHANGE_EDITOR_PAGE_DATA",
      "CHANGE_NAVBAR_LIST"
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

      this.$emit('changePage', true)
    },
    addPage(index) {
      // 新建页面
      let id = this.design.data.templateMaxID + 1;
      let template = {
        key: 'template-' + id,
        data: {
          setting: {
            "name": "新建页面",
            "pageBgColor": "#FFFFFF",
            "navBgColor": "#FFFFFF",
            "navTitColor": "black",
            "shareDescribe": "",
            "shareImage": ""
          },
          data: []
        }
      };
      this.CHANGE_DESIGN_TEMPLATE(template);
      this.CHANGE_DESIGN_TEMPLATE_MAX(id);

      let group = this.design.group;
      let groupObj = {
        id: 'template-' + id,
        name: template.data.setting.name
      };
      if(index !== '') {
        group.custom[index].children.push(groupObj)
      } else {
        groupObj.children = []
        group.custom.push(groupObj)
      };
      this.CHANGE_DESIGN_GROUP(group)
    },
    copyParent(item, index) {
      // 复制父级页面
      let templateMaxID = this.design.data.templateMaxID;
      let design = this.design;
      let item_ = deepClone(item);
      let group = this.design.group;
      let groupObj = {};  // 分组


      // 先复制父级
      templateMaxID++;
      let newParentTemplate = deepClone(design.template[item_.id]);
      let template = {
        key: 'template-' + templateMaxID,
        data: newParentTemplate
      };
      this.CHANGE_DESIGN_TEMPLATE(template);
      
      groupObj = {
        id: 'template-' + templateMaxID,
        name: item_.name + '-副本',
        children: []
      };

      if(item_.children.length > 0) {
        for(let i of item_.children) {
          templateMaxID++;
          let newChildrenTemplate = deepClone(design.template[i.id]);
          let template_ = {
            key: 'template-' + templateMaxID,
            data: newChildrenTemplate
          };
          this.CHANGE_DESIGN_TEMPLATE(template_);
          groupObj.children.push({
            id: 'template-' + templateMaxID,
            name: i.name + '-副本',
          })
        }
      };
      group.custom.push(groupObj)
      this.CHANGE_DESIGN_TEMPLATE_MAX(templateMaxID);
      this.CHANGE_DESIGN_GROUP(group)
    },
    copyChildren(item, childrenItem, index) {
      // 复制子级页面
      let templateMaxID = this.design.data.templateMaxID;
      let design = this.design;
      let childrenItem_ = deepClone(childrenItem);
      let group = this.design.group;
      let groupObj = {};  // 分组

      templateMaxID++;
      let newTemplate = deepClone(design.template[childrenItem_.id]);
      let template = {
        key: 'template-' + templateMaxID,
        data: newTemplate
      };
      this.CHANGE_DESIGN_TEMPLATE(template);
      
      groupObj = {
        id: 'template-' + templateMaxID,
        name: childrenItem_.name + '-副本'
      };
      group.custom[index].children.push(groupObj);
      this.CHANGE_DESIGN_TEMPLATE_MAX(templateMaxID);
      this.CHANGE_DESIGN_GROUP(group)
    },
    parentOptCommand(command, index, item) {
      // 父级 删除 或 移动

      let editorPageData = this.editorPageData;
      if (command == "del") {
        // 如果删除的是当前页面
        if(this.designEditID == item.id) {
          this.CHANGE_DESIGN_EDIT_ID(' ')
        };
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
      let editorPageData = this.editorPageData;
      if (command == "del") {
        // 如果删除的是当前页面
        if(this.designEditID == childrenItem.id) {
          this.CHANGE_DESIGN_EDIT_ID(' ')
        };
        // 删除摸板
        this.DELETE_DESIGN_TEMPLATE(childrenItem.id);
        // 删除分组
        let group = this.design.group;
        group.custom[index].children.splice(childrenIndex, 1);;
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
      };

      let group = this.design.group;
      let moveObj = deepClone(group.custom[oldParams.index])
      group.custom.splice(oldParams.index, 1);
      for(let item of group.custom) {
        if(item.id === newID) {
          item.children.push(moveObj);
          break;
        };
      };
      this.CHANGE_DESIGN_GROUP(group)

      this.showMoveDialog = false;
    }
  }
};
</script>

<style>
@import url("./style/index.min.css");
</style>