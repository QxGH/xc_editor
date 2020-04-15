<template>
  <div class="user-center-preview">
    <div class="top-card clearfix">
      <div class="avatar-box">
        <img src class="avatar" alt />
      </div>
      <div class="user-name">用户昵称</div>
    </div>
    <div class="order-manage">
      <div class="order-header clearfix">
        <div class="name">订单管理</div>
        <div class="look">
          查看全部订单
          <i class="el-icon-arrow-right icon"></i>
        </div>
      </div>
      <div class="order-body clearfix">
        <div class="item">
          <i
            class="icon"
            style="background-image: url('https://cdn.xingchen.cn/FtoEkpb547XNjc1nV9HkenLoiOf2')"
          ></i>
          <label class="name">待付款</label>
        </div>
        <div class="item">
          <i
            class="icon"
            style="background-image: url('https://cdn.xingchen.cn/Fm5Ox23uCjjuOAShtV5g0DxuQz7G')"
          ></i>
          <label class="name">待使用</label>
        </div>
        <div class="item">
          <i
            class="icon"
            style="background-image: url('https://cdn.xingchen.cn/FlzrVtB5DaVrgHj5Cr1JEe2T5Ily')"
          ></i>
          <label class="name">待发货</label>
        </div>
        <div class="item">
          <i
            class="icon"
            style="background-image: url('https://cdn.xingchen.cn/FrV-hXeCXp5pJyqSeXtCkCJ3GwqK')"
          ></i>
          <label class="name">已发货</label>
        </div>
      </div>
    </div>
    <ul class="user-list">
      <li class="item">
        <div class="item-box clearfix">
          <i class="img-icon" style="background-image: url('https://cdn.xingchen.cn/FkFAFaKY4IFETn_UMlnE9NFBbEBV')"></i>
          <span class="title">收获地址</span>
          <span class="icon-box">
            <i class="el-icon-arrow-right icon"></i>
          </span>
        </div>
      </li>
      <li class="item">
        <div class="item-box clearfix">
          <i class="img-icon" style="background-image: url('https://cdn.xingchen.cn/FuELhlVid8LMX2R6oHvsn18osdiK')"></i>
          <span class="title">个人信息</span>
          <span class="icon-box">
            <i class="el-icon-arrow-right icon"></i>
          </span>
        </div>
      </li>
    </ul>
    <p class="agreement">用户注册协议</p>
  </div>
</template>

<script>
export default {
  name: "UserCenterPreview"
};
</script>

<style>
@import url("./style/index.min.css");
</style>