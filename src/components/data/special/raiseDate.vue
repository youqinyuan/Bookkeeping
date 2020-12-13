<template>
  <div class="return">
    <div class="searchBox">
      <div>
        <span>交易时间：</span>
        <el-date-picker
          v-model="time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
      <div>
        <span>发起提起人电话：</span>
        <el-input v-model="vendorMobile" style="width:130px;"></el-input>
      </div>
      <div>
        <span>帮忙提起人电话：</span>
        <el-input v-model="purchaserMobile" style="width:130px;"></el-input>
      </div>
      <div>
        <span>关联订单：</span>
        <el-input v-model="orderNumber" style="width:220px;"></el-input>
      </div>
      <div>
        <span>待返期数：</span>
        <el-input v-model="periodLeft" style="width:100px;"></el-input>
      </div>
      <el-button type="primary" @click="search(1)">搜索</el-button>
    </div>
    <div class="tableBox">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="编号" width="100" align="center"></el-table-column>
        <el-table-column prop="tradeTime" label="交易时间" width="180" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.tradeTime">{{scope.row.tradeTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="vendorMobile" label="发起提起人电话" align="center"></el-table-column>
        <el-table-column prop="purchaserMobile" label="帮忙提起人电话" align="center"></el-table-column>
        <el-table-column prop="periodLeft" label="待返期数" align="center"></el-table-column>
        <el-table-column prop="expectAmount" label="需提期金额" align="center"></el-table-column>
        <el-table-column prop="commissionAmountTotal" label="发起人给出佣金" align="center"></el-table-column>
        <el-table-column prop="paymentAmount" label="帮忙提期金额" align="center"></el-table-column>
        <el-table-column prop="periodMention" label="减少期数" align="center"></el-table-column>
        <el-table-column prop="commissionAmount" label="帮忙提期人获得佣金" align="center"></el-table-column>
        <el-table-column prop="orderNumber" label="关联订单" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="totalBox">
      <span>总计：{{totalSize}}条</span>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalSize"
        :page-size="10"
        :current-page.sync="currentPage"
        @current-change="pageChange($event)"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { findAdvancePeriodTopicPageList } from "@/network/api";
export default {
  data() {
    return {
      pageSize: 10,
      totalSize: 0,
      currentPage: 0,
      time: "",
      purchaserMobile: "",
      vendorMobile: "",
      orderNumber: "",
      periodLeft: "",
      tableData: []
    };
  },
  created() {
    this.search(1);
  },
  methods: {
    // 搜索
    search(val) {
      let tradeTime, tradeTimeEnd;
      if (this.time) {
        tradeTime = this.time[0].getTime();
        tradeTimeEnd = this.time[1].getTime();
      }
      let parms = {
        pageNumber: val ? val : this.currentPage,
        pageSize: 10,
        tradeTime: tradeTime,
        tradeTimeEnd: tradeTimeEnd,
        purchaserMobile: this.purchaserMobile,
        vendorMobile: this.vendorMobile,
        orderNumber: this.orderNumber,
        periodLeft: this.periodLeft
      };
      findAdvancePeriodTopicPageList({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.tableData = content.items;
          this.totalSize = content.totalSize;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 翻页
    pageChange(val) {
      this.currentPage = val;
      this.search();
    }
  }
};
</script>
<style lang="less" scoped>
.searchBox {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  div {
    margin: 5px;
  }
}
.tableBox {
  margin-top: 20px;
}
.totalBox {
  width: 100%;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>