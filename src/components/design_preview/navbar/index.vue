<template>
  <div class="navbar">
    <template v-for="item of setting.list">
      <div class="nav-item" :key="item.id" :style="{color: setting.unCheckedTextColor}">
        <span class="icon-box">
          <i class="font_family" :class="item.icon.unChecked"></i>
        </span>
        <div class="text">{{item.title}}</div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "navbar",
  props: ["setting"],
  mounted() {
    console.log("this.setting");
    console.log(this.setting);
  }
};
</script>

<style>
@import url("./style/index.min.css");
</style>