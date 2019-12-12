<template>
  <div class="freeBuy">
    <el-tabs v-model="activeName">
      <el-tab-pane label="商品内容设置" name="first">
        <setProductContent></setProductContent>
      </el-tab-pane>
      <el-tab-pane label="视频内容设置" name="second">
        <setVideoContent></setVideoContent>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import setProductContent from "./setProductContent";
import setVideoContent from "./setVideoContent";
export default {
  data() {
    return {
      activeName: "first"
    };
  },
  components: {
    setProductContent,
    setVideoContent
  },
  methods: {}
};
</script>
<style lang="less" scoped>
.freeBuy {
  padding: 20px;
}
</style>