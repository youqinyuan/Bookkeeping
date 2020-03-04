<template>
  <div class="changeParameter">
    <el-dialog
      title="修改商品规格（均为必填项，统一设置和单一设置1个即可）"
      :visible.sync="dialogVisible"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="top">
        <span>统一FB支付价:</span>
        <el-input
          v-model="freeBuyPrice"
          style="width:100px"
          size="small"
          @input="unifyFreeBuyPrice"
        ></el-input>
        <span style="margin-left:10px;">统一返现金额:</span>
        <el-input
          v-model="cashBackAmount"
          style="width:100px"
          size="small"
          @input="unifyCashBackAmount"
        ></el-input>
        <span style="margin-left:10px;">统一返现天数:</span>
        <el-input
          v-model="cashBackDays"
          style="width:100px"
          size="small"
          @input="unifyCashBackDays"
        ></el-input>
      </div>
      <div class="tabelBox">
        <el-table
          :data="tableData"
          border
          ref="multipleTable"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="商品规格"></el-table-column>
          <el-table-column prop="orgPrice" label="原价"></el-table-column>
          <el-table-column prop="dctPrice" label="成本价"></el-table-column>
          <el-table-column prop="stock" label="库存" width="70px"></el-table-column>
          <el-table-column prop="dctRate" label="折扣" width="50px"></el-table-column>
          <el-table-column prop="freeBuyPrice" label="Fb支付价">
            <template slot-scope="scope">
              <el-input v-model="scope.row.freeBuyPrice" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="cashBackAmount" label="返现金额">
            <template slot-scope="scope">
              <el-input v-model="scope.row.cashBackAmount" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="cashBackDays" label="返现天数" width="84px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.cashBackDays" size="small"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { queryGoodsDetailRequest } from "@/network/api";
export default {
  data() {
    return {
      dialogVisible: false,
      number: "",
      index: "",
      tableData: [],
      seleteData: [],
      freeBuyPrice: "",
      cashBackAmount: "",
      cashBackDays: ""
    };
  },
  methods: {
    // 打开弹框，接收父组件的参数
    open(number, goodsId, index, stocks) {
      /**
       * number：第几号配置区域
       * goodsId：商品id
       * index：商品规格下标
       * stocks：父组件传递过来的商品规格数据
       */
      this.tableData = [];
      this.seleteData = [];
      this.freeBuyPrice = "";
      this.cashBackAmount = "";
      this.cashBackDays = "";
      this.number = number;
      this.index = index;
      queryGoodsDetailRequest({ params: { id: goodsId } }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let specs = res.data.content.specs;
          let stockDetail = res.data.content.stockDetail;
          console.log(stockDetail);
          for (let item in stockDetail) {
            let json = {};
            json.stockId = stockDetail[item].specId;
            json.orgPrice = stockDetail[item].orgPrice;
            json.dctPrice = stockDetail[item].dctPrice;
            json.stock = stockDetail[item].stock;
            json.dctRate = stockDetail[item].dctRate;
            json.freeBuyPrice = "";
            json.cashBackAmount = "";
            json.cashBackDays = "";
            json.name = "";
            // 处理商品规格拼接
            let arr = item.split(",");
            for (let i = 0; i < arr.length; i++) {
              let a = specs[i].items.filter(val => {
                return val.id == arr[i];
              });
              if (i == arr.length - 1) {
                json.name += a[0].name;
              } else {
                json.name = json.name + a[0].name + "-";
              }
            }
            // 如果父组件传递过来了商品的规格数据，填充到修改参数的弹框中
            if (stocks) {
              stocks.forEach(val => {
                if (val.stockId == stockDetail[item].specId) {
                  json.cashBackAmount = val.cashBackAmount;
                  json.cashBackDays = val.cashBackDays;
                  json.freeBuyPrice = val.freeBuyPrice;
                }
              });
            }
            this.tableData.push(json);
            // 复选框自动选中父组件带过来的数据
            this.$nextTick(() => {
              if (json.freeBuyPrice) {
                this.$refs.multipleTable.toggleRowSelection(json, true);
              }
            });
          }
          this.dialogVisible = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 统一FB支付价
    unifyFreeBuyPrice(e) {
      this.tableData.forEach(val => {
        val.freeBuyPrice = e;
      });
    },
    // 统一返现金额
    unifyCashBackAmount(e) {
      this.tableData.forEach(val => {
        val.cashBackAmount = e;
      });
    },
    // 统一返现天数
    unifyCashBackDays(e) {
      this.tableData.forEach(val => {
        val.cashBackDays = e;
      });
    },
    // 多项选择
    handleSelectionChange(val) {
      this.seleteData = val;
    },
    // 点击确定-传递参数给父组件
    submit() {
      if (this.seleteData.length == 0) {
        this.$message.error("请选择商品规格");
        return;
      }
      let number = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
      let s = true;
      let data = [];
      this.seleteData.forEach(val => {
        if (
          !number.test(val.freeBuyPrice) ||
          !number.test(val.cashBackAmount) ||
          !number.test(val.cashBackDays)
        ) {
          s = false;
        }
        let json = {
          stockId: val.stockId,
          freeBuyPrice: val.freeBuyPrice,
          cashBackAmount: val.cashBackAmount,
          cashBackDays: val.cashBackDays
        };
        data.push(json);
      });
      if (!s) {
        this.$message.error("输入格式不正确");
        return;
      }
      console.log(data);
      this.$emit("changeParameter", this.number, data, this.index);
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang="less" scoped>
.tabelBox {
  margin-top: 20px;
}
</style>