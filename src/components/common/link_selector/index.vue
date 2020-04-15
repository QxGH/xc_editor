<template>
  <div class="link-selector">
    <el-dialog title="设置点击事件" :visible.sync="dialogVisible" width="800px" center>
      <div class="link-selector-body">
        <el-tabs v-model="tabActiveName" @tab-click="tabhandleClick" stretch>
          <el-tab-pane label="自定义页面" name="page">
            <table class="lingk-table" cellpadding="0" cellspacing="0">
              <thead>
                <tr>
                  <th>页面名称</th>
                  <th>创建时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in linkList.page" :key="item.id">
                  <td>
                    <el-radio
                      v-model="currentLinkID"
                      :label="item.id"
                      @change="changeHandle(item)"
                    >{{item.name}}</el-radio>
                  </td>
                  <td>{{item.createdTime}}</td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
          <el-tab-pane label="商品" name="goods">
            <table class="lingk-table goods" cellpadding="0" cellspacing="0">
              <thead>
                <tr>
                  <th>商品信息</th>
                  <th>商品分类</th>
                  <th>创建时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in linkList.goods" :key="item.id">
                  <td>
                    <el-radio v-model="currentLinkID" :label="item.id" @change="changeHandle(item)">
                      <el-image
                        class="v-mid"
                        style="width: 40px; height: 40px"
                        :src="item.picture"
                        fit="contain"
                      ></el-image>
                      <span class="v-mid">{{item.name}}</span>
                    </el-radio>
                  </td>
                  <td>{{item.class}}</td>
                  <td>{{item.createdTime}}</td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
          <el-tab-pane label="系统页面" name="system">
            <table class="lingk-table" cellpadding="0" cellspacing="0">
              <thead>
                <tr>
                  <th>页面名称</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in linkList.system" :key="item.id">
                  <td>
                    <el-radio
                      v-model="currentLinkID"
                      :label="item.id"
                      @change="changeHandle(item)"
                    >{{item.name}}</el-radio>
                  </td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
          <el-tab-pane label="其他" name="other">
            <table class="lingk-table" cellpadding="0" cellspacing="0">
              <thead>
                <tr>
                  <th>页面名称</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in linkList.other" :key="item.id">
                  <td>
                    <el-radio
                      v-model="currentLinkID"
                      :label="item.id"
                      @change="changeHandle(item)"
                    >{{item.name}}</el-radio>
                  </td>
                </tr>
              </tbody>
            </table>
          </el-tab-pane>
        </el-tabs>
        <div class="pagetion-box">
          <el-pagination
            background
            :page-size="pageData.size"
            :current-page="pageData.current"
            :total="pageData.total"
            @current-change="pageChange"
            layout="prev, pager, next"
          ></el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="close">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import uuidV4 from "uuid/v4";

export default {
  name: "linkSelector",
  props: ["link"],
  data() {
    return {
      currentLinkID: "",
      currentLinkObj: {},
      pageData: {
        current: 1,
        size: 10,
        total: 0
      },
      dialogVisible: true,
      tabActiveName: "page",
      linkList: {
        page: [
          {
            id: "page-1",
            type: "自定义页面",
            name: "页面-1",
            url: "pages/logs/index-1",
            createdTime: "2020-12-29 23:23:23"
          },
          {
            id: "page-2",
            type: "自定义页面",
            name: "页面-2",
            url: "pages/logs/index-1",
            createdTime: "2020-12-29 23:23:23"
          },
          {
            id: "page-3",
            type: "自定义页面",
            name: "页面-3",
            url: "pages/logs/index-1",
            createdTime: "2020-12-29 23:23:23"
          }
        ],
        goods: [
          {
            id: "goods-1",
            type: "商品",
            name: "商品-1",
            picture: "",
            class: "商品分类",
            url: "pages/logs/index-1",
            createdTime: "2020-12-29 23:23:23"
          },
          {
            id: "goods-2",
            type: "商品",
            name: "商品-2",
            picture: "",
            class: "商品分类",
            url: "pages/logs/index-1",
            createdTime: "2020-12-29 23:23:23"
          }
        ],
        system: [
          {
            id: "system-1",
            type: "系统页面",
            name: "系统-1",
            url: "pages/logs/index-1"
          },
          {
            id: "system-2",
            type: "系统页面",
            name: "系统-2",
            url: "pages/logs/index-1"
          },
          {
            id: "system-3",
            type: "系统页面",
            name: "系统-3",
            url: "pages/logs/index-1"
          }
        ],
        other: [
          {
            id: "other-1",
            type: "其他",
            name: "其他-1",
            url: "pages/logs/index-1"
          },
          {
            id: "other-2",
            type: "其他",
            name: "其他-2",
            url: "pages/logs/index-1"
          },
          {
            id: "other-3",
            type: "其他",
            name: "其他-3",
            url: "pages/logs/index-1"
          }
        ]
      }
    };
  },
  created() {
    this.currentLinkID = this.link ? this.link.id : '';
  },
  methods: {
    changeHandle(row) {
      this.currentLinkObj = row;
    },
    pageChange(currentPage) {
      // this.getList(currentPage)
    },
    tabhandleClick(val) {
      // console.log(val);
    },
    close() {
      this.$emit("submitLink", this.currentLinkObj);
    }
  }
};
</script>

<style>
@import url("./style/index.min.css");
</style>