<template>
  <div class="free-btn">
    <template v-if="setting.style == 'primary'">
      <button class="primary-btn btn" :style="{'fontSize': setting.size+'px', 'borderColor': setting.bg, 'background': setting.bg, 'color': setting.color}">{{setting.text}}</button>
    </template>
    <template v-else-if="setting.style == 'plain'">
      <button class="plain-btn btn" :style="{'fontSize': setting.size+'px', 'borderColor': setting.bg, 'background': '#fff', 'color': setting.color}">{{setting.text}}</button>
    </template>
    <template v-else-if="setting.style == 'primaryRound'">
      <button class="primaryRound-btn btn" :style="{'fontSize': setting.size+'px', 'borderColor': setting.bg, 'background': setting.bg, 'color': setting.color, 'borderRadius': setting.height/2 +'px'}">{{setting.text}}</button>
    </template>
    <template v-else-if="setting.style == 'plainRound'">
      <button class="plainRound-btn btn" :style="{'fontSize': setting.size+'px', 'borderColor': setting.bg, 'color': setting.color, 'borderRadius': setting.height/2 +'px'}">{{setting.text}}</button>
    </template>
  </div>
</template>

<script>
export default {
  name: "freeBtn",
  props: {
    setting: {
      type: Object
    },
  }
};
</script>

<style>
@import url("./style/index.min.css");
</style>