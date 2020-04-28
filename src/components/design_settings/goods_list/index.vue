<template>
  <div class="goods-list-setting">
    <div class="setting-title">商品列表组件</div>
    <el-form ref="goodsSettingForm" :model="setting" label-width="110px">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="模块设置" name="1">
          <el-form-item label="模块名称：">
            <div class="template-name clearfix">
              <el-input
                v-model="setting.name"
                @change="changeHandle"
                placeholder="请输入模块名称"
                maxlength="10"
                show-word-limit
              ></el-input>
              <el-checkbox v-model="setting.hideName" @change="changeHandle">隐藏</el-checkbox>
            </div>
          </el-form-item>
          <el-form-item label="下方间隔：">
            <el-input-number
              v-model="setting.style.marginBottom"
              @change="changeHandle"
              controls-position="right"
              :min="0"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="商品列表样式：">
            <div class="goods-list-style">
              <div class="style-item default-style clearfix" :class="{'active': setting.styleType == 'default'}">
                <i class="pull-left ele"></i>
                <i class="pull-right ele"></i>
              </div>
            </div>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="商品设置" name="2">
          <el-form-item label="选择商品：">
            <el-radio-group v-model="setting.chooseMode" @change="changeHandle">
              <el-radio-button label="auto">自动选择</el-radio-button>
              <el-radio-button label="hand">手动选择</el-radio-button>
            </el-radio-group>
            <template v-if="setting.chooseMode == 'hand'">
              <div style="margin: 10px 0;">
                <el-button type="primary" class="select-goods-btn" @click="selectorGoodsHandle">选择商品</el-button>
              </div>
              <div class="choose-goods-num">
                已选择 <span class="blue-color font-bold">{{setting.handList | handListLengthFilter}}</span> 个商品，
                <span class="blue-color pointer" @click="selectorGoodsHandle">点击查看！</span>
              </div>
            </template>
          </el-form-item>
          <el-form-item v-if="setting.chooseMode == 'auto'" label="商品分组：" >
            <el-select v-model="setting.group" multiple placeholder="请选择分组" style="width: 240px;" @change="groupChange">
              <el-option
                v-for="item in goodsGroupList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="setting.chooseMode == 'auto'" label="排序方式：">
            <el-select v-model="setting.sort" placeholder="请选择" style="width: 240px;" @change="sortChange">
              <el-option label="按上架时间" value="createTime"></el-option>
              <el-option label="按价格降序" value="priceDescending"></el-option>
              <el-option label="按价格升序" value="priceAscending"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="setting.chooseMode == 'auto'" label="商品数量：" >
            <el-radio-group v-model="setting.numberType" @change="changeHandle">
              <el-radio label="all">全部</el-radio>
              <el-radio label="custom">自定义</el-radio>
            </el-radio-group>
            <template v-if="setting.numberType == 'custom'">
              <div style="margin: 10px 0;">
                <el-input-number
                  v-model="setting.number"
                  @change="changeHandle"
                  :min="1"
                  :max="100"
                  label="商品数量"
                ></el-input-number>
              </div>
            </template>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>

    <!-- <el-divider>选择商品</el-divider>
    <el-radio-group v-model="setting.chooseMode" @change="chooseModeChange">
      <el-radio-button label="auto">自动选择</el-radio-button>
      <el-radio-button label="hand">手动选择</el-radio-button>
    </el-radio-group>
    <template v-if="setting.chooseMode == 'auto'">
      <el-divider>商品分组</el-divider>
      <el-select v-model="setting.group" multiple placeholder="请选择分组" @change="groupChange">
        <el-option
          v-for="item in goodsGroupList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-divider>商品排序</el-divider>
      <el-select v-model="setting.sort" placeholder="请选择">
        <el-option label="按上架时间" value="createTime"></el-option>
        <el-option label="按价格降序" value="priceDescending"></el-option>
        <el-option label="按价格升序" value="priceAscending"></el-option>
      </el-select>
      <el-divider>商品数量</el-divider>
      <el-radio-group v-model="setting.numberType" @change="numberTypeChange">
        <el-radio label="all">全部</el-radio>
        <el-radio label="custom">自定义</el-radio>
      </el-radio-group>
      <template v-if="setting.numberType == 'custom'">
        <div style="margin: 10px 0;">
          <el-input-number
            v-model="setting.number"
            @change="numberChange"
            :min="1"
            :max="100"
            label="商品数量"
          ></el-input-number>
        </div>
      </template>
    </template>
    <template v-else>
      <div style="margin: 10px 0;">
        <el-button type="primary" plain @click="selectorGoodsHandle">选择商品</el-button>
      </div>
      <span>
        已选择：{{setting.handList | handListLengthFilter}}个商品
      </span>
    </template>-->
    <GoodsSelector v-if="showGoodsSelector" :goods="currentGoods" @submitGoods="submitGoodsHandle"></GoodsSelector>
  </div>
</template>

<script>
import uuidV4 from "uuid/v4";
import { mapState, mapMutations } from "vuex";

import GoodsSelector from "../../common/goods_selector";

export default {
  name: "goodsListSetting",
  data() {
    return {
      activeNames: ["1", "2"],
      showGoodsSelector: false, // 是否显示图片选择器
      currentGoods: "",
      goodsGroupList: [],
      goodsList: {}
    };
  },
  components: {
    GoodsSelector
  },
  props: {
    setting: {
      type: Object
    }
  },
  computed: {
    ...mapState(["design", "designEditID", "designEditIndex"])
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    ...mapMutations(["CHANGE_DESIGN_TEMPLATE"]),
    sortChange() {},
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
    getGoodsList() {
      this.$api.design.getGoodsList().then(res => {
        if (res.data.code === 0) {
          let goodsList = res.data.data.goodsList;
          this.goodsList = goodsList;
          let goodsGroupList = [];
          for (let item in goodsList) {
            let obj = {
              label: item,
              value: item
            };
            goodsGroupList.push(obj);
          }
          this.goodsGroupList = goodsGroupList;
        } else {
          this.$message.warning("商品列表获取失败！");
        }
      });
    },
    groupChange(val) {
      let newList = [];
      for (let item of val) {
        newList = newList.concat(this.goodsList[item]);
      }
      this.setting.autoList = newList;
      this.changeHandle();
    },
    sortHandle(val) {
      this.changeHandle();
    },
    selectorGoodsHandle() {
      this.currentGoods = this.setting.handList;
      this.showGoodsSelector = true;
    },
    submitGoodsHandle(val) {
      if (val.length > 0) {
        this.setting.handList = val;
        this.changeHandle();
      }
      this.showGoodsSelector = false; // 显示图片选择器
    }
  },
  filters: {
    handListLengthFilter(val) {
      let num = 0;
      if (val.length == 1 && val[0].id.indexOf("default") != "-1") {
        num = 0;
      } else {
        num = val.length;
      }
      return num;
    }
  }
};
</script>

<style>
@import url("./style/index.min.css");
</style>