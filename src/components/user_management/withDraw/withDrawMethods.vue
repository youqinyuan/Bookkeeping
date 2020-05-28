<template>
  <div class="widthDrawMethods">
    <el-tabs v-model="activeName" @tab-click="handleClick" style="clear:both">
      <el-tab-pane label="微信提现" name="tab_1">
        <withDrawWeChat></withDrawWeChat>
      </el-tab-pane>
      <el-tab-pane label="银行卡提现" name="tab_2">
        <withDrawBank></withDrawBank>
      </el-tab-pane>
      <el-tab-pane label="支付宝提现" name="tab_3">
        <alipay></alipay>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import withDrawWeChat from "./withDraw_weChat";
import withDrawBank from "./withDraw_bank";
import alipay from "./alipay";
export default {
  props: {},
  data() {
    return {
      activeName: "tab_1"
    };
  },
  components: {
    withDrawWeChat,
    withDrawBank,
    alipay
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleClick(tab, event) {}
  }
};
</script>

<style scoped lang="less">
.widthDrawMethods {
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
