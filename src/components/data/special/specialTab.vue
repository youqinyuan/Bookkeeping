<template>
  <div class="specialTab">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待返卖贴交易" name="first">
        <returnData></returnData>
      </el-tab-pane>
      <el-tab-pane label="预售订单交易" name="second">
        <advanceOrder></advanceOrder>
      </el-tab-pane>
      <el-tab-pane label="商品卖贴交易" name="third">
        <goodsSales></goodsSales>
      </el-tab-pane>
      <el-tab-pane label="商品买交易" name="fourth">
        <goodsBuy></goodsBuy>
      </el-tab-pane>
      <el-tab-pane label="提期交易" name="fifth">
        <raiseDate></raiseDate>
      </el-tab-pane>
      <el-tab-pane label="种子交易" name="sixth">
        <seed></seed>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import returnData from "./return";
import advanceOrder from "./advanceOrder";
import goodsSales from "./goodsSales";
import goodsBuy from "./goodsBuy";
import raiseDate from "./raiseDate";
import seed from "./seed";
export default {
  data() {
    return {
      activeName: "first"
    };
  },
  components: {
    returnData,
    advanceOrder,
    goodsSales,
    goodsBuy,
    raiseDate,
    seed
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    }
  }
};
</script>
<style lang="less" scoped>
.specialTab {
  padding: 20px;
  box-sizing: border-box;
}
</style>