<template>
  <div class="cityPartner_detail">
    <!-- 左边区域 -->
    <div class="left">
      <div class="title">基本信息:</div>
      <div class="content">
        <div>代理商编号：001</div>
        <div>姓名：王小娃儿</div>
        <div>注册账号：18888888888</div>
        <div>押金：5000元</div>
        <div>银行卡卡号：13099919987546365222</div>
        <div>开户行：北京市大兴支行</div>
        <div>代理区域：四川省成都市双流区</div>
      </div>
      <div class="title">商家表:</div>
      <div class="businessTableBox">
        <span class="demonstration">商户数量：10</span>
        <el-pagination
          @current-change="handleCurrentChange1"
          :current-page.sync="currentPage1"
          :page-size="10"
          layout="prev, pager, next"
          :total="100"
        ></el-pagination>
      </div>
      <div class="tableBox">
        <el-table :data="formData" border ref="multipleTable" style="width: 100%">
          <el-table-column prop="orderNumber" label="入驻时间" align="center"></el-table-column>
          <el-table-column prop="orderNumber" label="商户电话" align="center"></el-table-column>
          <el-table-column prop="orderNumber" label="行业" align="center"></el-table-column>
          <el-table-column prop="orderNumber" label="带来收益" align="center"></el-table-column>
        </el-table>
      </div>
      <div class="title">城市合伙人身份收益:</div>
      <div class="content">
        <div>总计佣金：50001元</div>
        <div>提现金额：5210元</div>
        <div>剩余佣金：10000元</div>
      </div>
      <div class="businessTableBox">
        <span class="demonstration">商家商品收益记录表：（总计：20条）</span>
        <el-pagination
          @current-change="handleCurrentChange1"
          :current-page.sync="currentPage2"
          :page-size="10"
          layout="prev, pager, next"
          :total="100"
        ></el-pagination>
      </div>
      <div class="tableBox">
        <el-table :data="formData" border ref="multipleTable" style="width: 100%">
          <el-table-column prop="orderNumber" label="到账时间" align="center"></el-table-column>
          <el-table-column prop="orderNumber" label="商户" align="center"></el-table-column>
          <el-table-column prop="orderNumber" label="用户" align="center"></el-table-column>
          <el-table-column prop="orderNumber" label="购买方式" align="center"></el-table-column>
          <el-table-column prop="orderNumber" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="orderNumber" label="商品成本价" align="center"></el-table-column>
          <el-table-column prop="orderNumber" label="返佣" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 右边区域 -->
    <div class="right">
      <div class="title">冻结-流失历史:</div>
      <div>2019-10-20日冻结，原因：刷单</div>
      <div>2019-10-20日冻结，原因：刷单</div>
      <div>2019-10-20日冻结，原因：刷单</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentPage1: 1,
      currentPage2: 1,
      formData: [
        {
          orderNumber: 1
        }
      ]
    };
  },
  methods: {
    handleCurrentChange1(val) {
      console.log(`当前页: ${val}`);
    }
  }
};
</script>
<style lang="less" scoped>
.cityPartner_detail {
  padding: 20px;
  box-sizing: border-box;
  display: flex;
}
.left {
  width: 50%;
  border-right: 1px solid #ccc;
  .title {
    font-size: 18px;
    font-weight: bold;
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }
  .content {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
    div {
      padding: 10px;
    }
  }
  .businessTableBox {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding-right: 10px;
    box-sizing: border-box;
  }
  .tableBox {
    margin: 20px 0px;
  }
}
.right {
  width: 50%;
  .title {
    font-size: 18px;
    font-weight: bold;
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }
  div {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
  }
}
</style>