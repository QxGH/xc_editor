<template>
  <div class="page-manage-move">
    <el-dialog title="页面移动" :visible.sync="dialogVisible" width="480px" center>
      <div class="dialog-body">
        <p class="move-tips">【{{moveParams.name}}】页面移动至：</p>
        <el-select v-model="moveID" placeholder="请选择" class="move-selector">
          <el-option
            v-for="item in editorPageData"
            :key="item.id"
            :label="item.setting.name"
            :value="item.id"
            :disabled="item.id == moveParams.parentID"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="close">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: "pageManageMove",
  data() {
    return {
      dialogVisible: true,
      moveID: ''
    };
  },
  props: ['moveParams'],
  computed: {
    ...mapState(['editorPageData'])
  },
  created(){
    console.log(this.moveParams)
    console.log(this.editorPageData)
    this.moveID = this.moveParams.parentID;
  },
  methods: {
    close() {
      let obj = {
        oldParams: this.moveParams,
        newID: this.moveID
      }
      this.$emit('moveClose', obj)
    }
  }
};
</script>

<style>
@import url("../style/index.min.css");
</style>