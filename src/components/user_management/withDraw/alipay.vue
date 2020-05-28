<template>
  <div class="alipay">
    <div class="top">
      <span>时间：</span>
      <el-date-picker
        v-model="time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <span>电话：</span>
      <el-input v-model="mobile" style="width:160px;"></el-input>
      <el-button type="primary" style="margin-left:20px;" @click="search(1)">搜索</el-button>
    </div>
    <div class="tableBox">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="编号" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.showType == 1 && scope.row.status == 1">{{scope.row.id}}</span>
            <span
              style="color:red"
              v-else-if="scope.row.showType == 2 && scope.row.status == 1"
            >{{scope.row.id}}</span>
            <span style="color:#ccc;" v-else>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="会员名称" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.showType == 1 && scope.row.status == 1">{{scope.row.name}}</span>
            <span
              style="color:red"
              v-else-if="scope.row.showType == 2 && scope.row.status == 1"
            >{{scope.row.name}}</span>
            <span style="color:#ccc;" v-else>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="电话" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.showType == 1 && scope.row.status == 1">{{scope.row.mobile}}</span>
            <span
              style="color:red"
              v-else-if="scope.row.showType == 2 && scope.row.status == 1"
            >{{scope.row.mobile}}</span>
            <span style="color:#ccc;" v-else>{{scope.row.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="申请时间" align="center">
          <template slot-scope="scope">
            <span
              v-if="scope.row.showType == 1 && scope.row.status == 1"
            >{{scope.row.time | dateFormat}}</span>
            <span
              style="color:red"
              v-else-if="scope.row.showType == 2 && scope.row.status == 1"
            >{{scope.row.time | dateFormat}}</span>
            <span style="color:#ccc;" v-else>{{scope.row.time | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="申请提现金额" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.showType == 1 && scope.row.status == 1">{{scope.row.amount}}</span>
            <span
              style="color:red"
              v-else-if="scope.row.showType == 2 && scope.row.status == 1"
            >{{scope.row.amount}}</span>
            <span style="color:#ccc;" v-else>{{scope.row.amount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="poundageAmount" label="手续费扣除" align="center">
          <template slot-scope="scope">
            <span
              v-if="scope.row.showType == 1 && scope.row.status == 1"
            >{{scope.row.poundageAmount}}</span>
            <span
              style="color:red"
              v-else-if="scope.row.showType == 2 && scope.row.status == 1"
            >{{scope.row.poundageAmount}}</span>
            <span style="color:#ccc;" v-else>{{scope.row.poundageAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="realAmount" label="到账金额" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.showType == 1 && scope.row.status == 1">{{scope.row.realAmount}}</span>
            <span
              style="color:red"
              v-else-if="scope.row.showType == 2 && scope.row.status == 1"
            >{{scope.row.realAmount}}</span>
            <span style="color:#ccc;" v-else>{{scope.row.realAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tradeAmount" label="总计支付金额" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.showType == 1 && scope.row.status == 1">{{scope.row.tradeAmount}}</span>
            <span
              style="color:red"
              v-else-if="scope.row.showType == 2 && scope.row.status == 1"
            >{{scope.row.tradeAmount}}</span>
            <span style="color:#ccc;" v-else>{{scope.row.tradeAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="withdrawAmount" label="总计提现金额" align="center">
          <template slot-scope="scope">
            <span
              v-if="scope.row.showType == 1 && scope.row.status == 1"
            >{{scope.row.withdrawAmount}}</span>
            <span
              style="color:red"
              v-else-if="scope.row.showType == 2 && scope.row.status == 1"
            >{{scope.row.withdrawAmount}}</span>
            <span style="color:#ccc;" v-else>{{scope.row.withdrawAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="真实姓名" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.showType == 1 && scope.row.status == 1">{{scope.row.realName}}</span>
            <span
              style="color:red"
              v-else-if="scope.row.showType == 2 && scope.row.status == 1"
            >{{scope.row.realName}}</span>
            <span style="color:#ccc;" v-else>{{scope.row.realName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bankCardNumber" label="支付宝号" align="center">
          <template slot-scope="scope">
            <span
              v-if="scope.row.showType == 1 && scope.row.status == 1"
            >{{scope.row.bankCardNumber}}</span>
            <span
              style="color:red"
              v-else-if="scope.row.showType == 2 && scope.row.status == 1"
            >{{scope.row.bankCardNumber}}</span>
            <span style="color:#ccc;" v-else>{{scope.row.bankCardNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1" style="color:red;">未通过</span>
            <span v-if="scope.row.status == 2 && scope.row.showType == 1" style="color:#ccc;">自动通过</span>
            <span v-if="scope.row.status == 2 && scope.row.showType == 2" style="color:#ccc;">手动通过</span>
            <span v-if="scope.row.status == 3" style="color:#ccc;">已取消</span>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" :disabled="scope.row.status != 1" @click="pass(scope.row.id)">通过</el-button>
            <el-button
              type="text"
              :disabled="scope.row.status != 1"
              @click="refuse(scope.row.id)"
            >拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bot">
      <span>总计:{{total}}条</span>
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import {
  getUserTransferAuditListAlipay,
  auditPassedById,
  auditCancelById
} from "@/network/api";
export default {
  data() {
    return {
      total: 0,
      currentPage: 1,
      time: "",
      mobile: "",
      tableData: []
    };
  },
  created() {
    this.search(1);
  },
  methods: {
    search(val) {
      let beginTime = "";
      let endTime = "";
      if (this.time) {
        beginTime = this.time[0].getTime();
        endTime = this.time[1].getTime();
      }
      let parms = {
        pageNumber: val,
        pageSize: 10,
        mobile: this.mobile,
        beginTime: beginTime,
        endTime: endTime
      };
      getUserTransferAuditListAlipay({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.total = content.totalSize;
          this.tableData = content.items;
          this.currentPage = val;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 通过
    pass(id) {
      this.$confirm("确认通过吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          let parms = {
            id: id
          };
          auditPassedById(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.search(1);
              this.$message.success("操作成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 拒绝
    refuse(id) {
      this.$confirm("点击后将余额退还给用户，本次提现取消", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          let parms = {
            id: id
          };
          auditCancelById(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.search(1);
              this.$message.success("操作成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 点击分页事件
    handleCurrentChange(val) {
      this.search(val);
      this.currentPage = val;
    }
  }
};
</script>
<style lang="less" scoped>
.top {
  margin-top: 20px;
}
.tableBox {
  margin-top: 40px;
}
.bot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
</style>