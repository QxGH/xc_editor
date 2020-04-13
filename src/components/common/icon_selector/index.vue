<template>
  <div class="icon-selector-dialog">
    <el-dialog title="图标选择器" width="800px" :visible.sync="dialogVisible" center>
      <div class="icon-dialog-body clearfix">
        <ul class="icon-tabs">
          <li
            class="tabs-item"
            :class="{'active': tabsActive == 'all'}"
            @click="changeTabs('all')"
          >全部图标</li>
          <li
            class="tabs-item"
            :class="{'active': tabsActive == 'common'}"
            @click="changeTabs('common')"
          >通用</li>
        </ul>
        <div class="icon-list">
          <ul class="icon-items clearfix">
            <template v-for="item in iconList">
              <li class="icon-item" :key="item.id" :class="{'active': item.id == currentSelect.id}" @click="changeIcon(item)">
                <div class="clearfix">
                  <span class="icon-box pull-left">
                    <i class="font_family" :class="item.unChecked"></i>
                  </span>
                  <span class="icon-box pull-right">
                    <i class="font_family" :class="item.checked"></i>
                  </span>
                </div>
                <label class="icon-label">{{item.label}}</label>
              </li>
            </template>
          </ul>
        </div>
        <!-- <el-row :gutter="10">
          <template v-for="item in iconList">
            <el-col :span="3" :key="item.id">
              <div class="icon-wrap" :class="{isSelect: item.isSelect}" @click="selectIcon(item.class)">
                <span class="icon-box">
                  <i class="iconfont" :class="item.class"></i>
                </span>
                <div class="icon-name">{{item.name}}</div>
              </div>
            </el-col>
          </template>
        </el-row>-->
      </div>
      <div class="pagetion">
        <el-pagination
          background
          :page-size="pageData.size"
          :current-page="pageData.current"
          :total="pageData.total"
          @current-change="pageChange"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="close">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import iconConfig from "./iconConfig";
export default {
  name: "iconSelector",
  data() {
    return {
      tabsActive: "all",
      pageData: {
        current: 1,
        size: 10,
        total: 0
      },
      dialogVisible: true,
      iconList: iconConfig.list,
      currentSelect: {}
    };
  },
  props: ["icon"],
  watch: {
    icon: {
      immediate: true,
      deep: true,
      handler(val) {
        this.currentSelect = val;
      }
    }
  },

  methods: {
    changeTabs(val) {
      this.tabsActive = val;
    },
    pageChange(currentPage) {
      // this.getList(currentPage)
    },
    changeIcon(val) {
      this.currentSelect = val;
    },
    close() {
      this.$emit("submitIcon", this.currentSelect);
    }
  }
};
</script>

<style>
@import url("./style/index.min.css");
</style>