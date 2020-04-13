<template>
  <div class="goods-selector">
    <el-dialog title="已上架商品" :visible.sync="dialogVisible" width="800px" center>
      <div class="goods-selector-body">
        <div class="opt-box clearfix">
          <div class="pull-left">
            <el-button type="primary" class="add-btn">新建商品</el-button>
            <el-button class="refires-btn">刷新</el-button>
          </div>
          <div class="pull-right">
            <el-select v-model="goodsTypeVal" class="group-type-select" placeholder="请选择">
              <el-option
                v-for="item in goodsTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input placeholder="请输入内容" class="search-input" suffix-icon="el-icon-search" v-model="searchVal"></el-input>
          </div>
        </div>
        <el-table
          ref="goodsTable"
          :data="goodsList"
          tooltip-effect="dark"
          style="width: 100%; margin-bottom: 15px;"
          @selection-change="selectionChange"
        >
          <el-table-column type="selection" width="30"></el-table-column>
          <el-table-column label="全选" width="60">
            <template slot-scope="scope">
              <el-image style="width: 40px; height: 40px" :src="scope.row.picture" fit="cover"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="商品信息"></el-table-column>
          <el-table-column prop="type" label="商品分类"></el-table-column>
          <el-table-column prop="create" label="创建时间"></el-table-column>
        </el-table>
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
  props: ["goods"],
  data() {
    return {
      pageData: {
        current: 1,
        size: 10,
        total: 0
      },
      goodsTypeOptions: [
        {
          value: "all",
          label: "全部商品"
        }
      ],
      goodsTypeVal: '',
      searchVal: '',
      goodsList: [],
      currentGoods: [],
      currentGoodsRes: [],
      dialogVisible: true
    };
  },
  created() {
    this.getGoodsList();
    this.currentGoods = this.goods;
  },
  mounted() {},
  methods: {
    pageChange(currentPage) {
      // this.getList(currentPage)
    },
    fillTable() {
      let rows = this.currentGoods;
      if (rows.length > 0) {
        if (rows.length == 1 && rows[0].id.indexOf("default") != "-1") {
          this.$refs.goodsTable.clearSelection();
        } else {
          rows.forEach(row => {
            this.$refs.goodsTable.toggleRowSelection(
              this.goodsList.find(item => {
                return row.id == item.id; // 注意这里寻找的字段要唯一，示例仅参考
              }),
              true
            );
          });
        }
      } else {
        this.$refs.goodsTable.clearSelection();
      }
    },
    getGoodsList() {
      this.$api.editor.getAllGoodsList().then(res => {
        if (res.data.code === 0) {
          this.goodsList = res.data.data.goodsList;
          this.$nextTick(() => {
            this.fillTable();
          });
        } else {
          this.$message.warning("商品列表获取失败！");
        }
      });
    },
    selectionChange(val) {
      console.log(val);
      this.currentGoodsRes = val;
    },
    close() {
      this.$emit("submitGoods", this.currentGoodsRes);
    }
  }
};
</script>

<style>
@import url("./style/index.min.css");
</style>