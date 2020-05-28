<template>
  <div class="newUser">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="商品管理" name="first">
        <goods></goods>
      </el-tab-pane>
      <el-tab-pane label="内容管理" name="second">
        <contents></contents>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import goods from "./goods";
import contents from "./content";
export default {
  data() {
    return {
      activeName: "first"
    };
  },
  components: {
    goods,
    contents
  },
  created() {},
  methods: {
    // tabs切换事件
    handleClick(tab, event) {}
  }
};
</script>
<style lang="less" scoped>
.newUser {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
</style>