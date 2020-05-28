<template>
  <div class="withdrawal">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="微信提现" name="first">
        <weChat></weChat>
      </el-tab-pane>
      <el-tab-pane label="银行卡提现" name="second">
        <bankCard></bankCard>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import weChat from "./weChat";
import bankCard from "./bankCard";
export default {
  data() {
    return {
      activeName: "first"
    };
  },
  components: {
    weChat,
    bankCard
  },
  created() {},
  methods: {
    handleClick(tab, event) {}
  }
};
</script>
<style lang="less" scoped>
.withdrawal {
  padding: 0px 20px;
  box-sizing: border-box;
}
</style>