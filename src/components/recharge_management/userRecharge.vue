<template>
  <div class="contents">
    <div class="top">
      <span>用户姓名:</span>
      <el-input class="inp" v-model="name" placeholder></el-input>
      <span>联系方式:</span>
      <el-input class="inp" v-model="mobile" placeholder></el-input>
      <span>时间:</span>
      <div style="display: inline-block">
        <el-date-picker v-model="beginTime" type="datetime" placeholder="选择开始时间"></el-date-picker>
        <el-date-picker v-model="endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
      </div>
      <el-button type="primary" @click="search(1)">搜 索</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="编号" align="center"></el-table-column>
        <el-table-column prop="nickname" label="用户名" align="center"></el-table-column>
        <el-table-column prop="mobileNumber" label="联系方式" align="center"></el-table-column>
        <el-table-column prop="rechargeAmount" label="充值金额" align="center"></el-table-column>
        <el-table-column prop="rechargeMethod" label="充值方式" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.rechargeMethod | rechargeWay}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tradeTime" label="充值时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.tradeTime | dateFormat}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="bot">
        <span>总计：{{total}}条</span>
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="15"
          layout="prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserRechargeRecord } from "@/network/api";
export default {
  props: {},
  data() {
    return {
      tableData: [],
      currentPage: 1,
      total: 0,
      name: "",
      mobile: "",
      beginTime: "",
      endTime: ""
    };
  },
  components: {},
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.search(1);
  },
  methods: {
    getUserRechargeRecord(parms) {
      getUserRechargeRecord({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.tableData = res.data.content.items;
          this.total = res.data.content.totalSize;
        }
      });
    },
    handleCurrentChange(val) {
      this.search(val);
      this.currentPage = val;
    },
    search(val) {
      let start, end;
      if (!this.beginTime) {
        start = "";
      } else {
        start = this.beginTime.getTime();
      }
      if (!this.endTime) {
        end = "";
      } else {
        end = this.endTime.getTime();
      }

      if (this.beginTime && this.endTime) {
        if (this.beginTime.getTime() > this.endTime.getTime()) {
          this.$message.error("请正确输入时间");
          return;
        }
      }
      let obj = {
        pageNumber: val,
        pageSize: 15,
        beginTime: start,
        endTime: end,
        name: this.name
      };
      if (this.mobile) {
        obj.mobile = this.mobile;
      }
      this.getUserRechargeRecord(obj);
      this.currentPage = 1;
    }
  }
};
</script>

<style scoped lang="less">
.table {
  margin-top: 20px;
}
.inp {
  width: 200px;
  margin-right: 20px;
}
.bot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
</style>
