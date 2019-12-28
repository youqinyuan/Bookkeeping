<template>
  <div class="supportPage">
    <el-tabs v-model="activeName">
      <el-tab-pane label="活动商品设置" name="first">
        <supportList></supportList>
      </el-tab-pane>
      <el-tab-pane label="活动规则配置" name="second">
        <supportSet></supportSet>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import supportList from "./supportList";
import supportSet from "./supportSet";
export default {
  data() {
    return {
      activeName: "first"
    };
  },
  components: {
    supportList,
    supportSet
  }
};
</script>
<style lang="less" scoped>
.supportPage {
  padding: 20px;
  box-sizing: border-box;
}
</style>