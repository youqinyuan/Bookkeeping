<template>
  <div class="presaleAndPost">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待返发帖次数限制" name="first">
        <returned></returned>
      </el-tab-pane>
      <el-tab-pane label="预售发帖次数限制" name="second">
        <presale></presale>
      </el-tab-pane>
      <el-tab-pane label="提期发帖次数限制" name="third">
        <period></period>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import returned from "./return";
import presale from "./presale";
import period from "./period";
export default {
  data() {
    return {
      activeName: "first"
    };
  },
  components: { returned, presale, period },
  created() {},
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    }
  }
};
</script>
<style lang="less" scoped>
.presaleAndPost {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
</style>