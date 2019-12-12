<template>
  <div class="wishPool_management">
    <el-tabs v-model="activeName" style="clear:both">
      <el-tab-pane label="心愿管理" name="tab_1">
        <wish></wish>
      </el-tab-pane>
      <el-tab-pane label="种草心愿池管理" name="tab_2">
        <wantBuy></wantBuy>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import wish from "./wish_management";
import wantBuy from "./wantBuy_management";
export default {
  data() {
    return {
      activeName: "tab_1"
    };
  },
  components: {
    wish,
    wantBuy
  },
  methods: {}
};
</script>
<style lang="less" scoped>
.wishPool_management {
  padding: 20px;
}
</style>