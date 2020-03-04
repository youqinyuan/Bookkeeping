<template>
  <div class="changeParameter">
    <el-dialog
      title="修改商品规格（均为必填项，统一设置和单一设置1个即可）"
      :visible.sync="dialogVisible"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="top">
        <span>统一活动折扣:</span>
        <el-input
          v-model="activityDctRate"
          style="width:100px"
          size="small"
          @input="unifyActivityDctRate"
        ></el-input>
        <span style="margin-left:10px;">统一调控比例:</span>
        <el-input
          v-model="controlRatio"
          style="width:100px"
          size="small"
          @input="unifyControlRatio"
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
          <el-table-column prop="activityDctRate" label="活动折扣">
            <template slot-scope="scope">
              <el-input v-model="scope.row.activityDctRate" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="controlRatio" label="调控比例">
            <template slot-scope="scope">
              <el-input v-model="scope.row.controlRatio" size="small"></el-input>
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
      activityDctRate: "",
      controlRatio: ""
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
      this.activityDctRate = "";
      this.controlRatio = "";
      this.number = number;
      this.index = index;
      queryGoodsDetailRequest({ params: { id: goodsId } }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let specs = res.data.content.specs;
          let stockDetail = res.data.content.stockDetail;
          for (let item in stockDetail) {
            let json = {};
            json.stockId = stockDetail[item].specId;
            json.orgPrice = stockDetail[item].orgPrice;
            json.dctPrice = stockDetail[item].dctPrice;
            json.stock = stockDetail[item].stock;
            json.dctRate = stockDetail[item].dctRate;
            json.activityDctRate = stockDetail[item].dctRate;
            json.controlRatio = stockDetail[item].costControlRatio;
            json.name = "";
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
            console.log(stocks);
            // 如果父组件传递过来了商品的规格数据，填充到修改参数的弹框中
            if (stocks) {
              stocks.forEach(val => {
                if (!val.stockId && val.activityDctRate) {
                  json.activityDctRate = val.activityDctRate;
                }
                if (val.stockId == stockDetail[item].specId) {
                  json.activityDctRate = val.activityDctRate;
                  json.controlRatio = val.controlRatio;
                  json.isSelect = val.isSelect;
                }
              });
            }
            this.tableData.push(json);
            // 复选框自动选中父组件带过来的数据
            this.$nextTick(() => {
              if (json.isSelect) {
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
    // 统一活动折扣
    unifyActivityDctRate(e) {
      this.tableData.forEach(val => {
        val.activityDctRate = e;
      });
    },
    // 统一调控比例
    unifyControlRatio(e) {
      this.tableData.forEach(val => {
        val.controlRatio = e;
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
      let ratio = /^-?(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
      let rate = /^([1-9]\d{0}|10)(\.\d{1})?$/;
      let s = true;
      let data = [];
      this.seleteData.forEach(val => {
        if (
          !rate.test(val.activityDctRate) ||
          !ratio.test(val.controlRatio) ||
          val.controlRatio > 100 ||
          val.controlRatio < -100
        ) {
          s = false;
        }
        let json = {
          stockId: val.stockId,
          activityDctRate: val.activityDctRate,
          controlRatio: val.controlRatio
        };
        data.push(json);
      });
      if (!s) {
        this.$message.error("请检查活动折扣和调控比例输入格式是否正确");
        return;
      }
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