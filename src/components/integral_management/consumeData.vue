<template>
  <div class="consumeData">
    <div class="searchBox">
      <span>用户电话：</span>
      <el-input v-model="mobileNumber" style="width:140px;margin-right:20px;"></el-input>
      <span>类型：</span>
      <el-select v-model="queryType" style="width:100px;margin-right:20px;">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span>获取/扣除时间：</span>
      <el-date-picker
        v-model="time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-button type="primary" style="margin-left:20px;" @click="search(1)">搜索</el-button>
    </div>
    <div class="tabelBox">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="mobileNumber" label="用户电话" width="140" align="center"></el-table-column>
        <el-table-column prop="amountTotal" label="剩余总量" align="center"></el-table-column>
        <el-table-column prop="queryType" label="类型" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.queryType == 1">获取</span>
            <span v-if="scope.row.queryType == 2">扣除</span>
          </template>
        </el-table-column>
        <el-table-column prop="recordTime" label="获取/扣除时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.recordTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="数量" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="totalSizeBox">
      <span>总计：{{totalSize}}条</span>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalSize"
        :current-page.sync="pageNumber"
        page-size.sync="10"
        @current-change="pageChange($event)"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { findPageListSeedList } from "@/network/api";
export default {
  data() {
    return {
      mobileNumber: "",
      time: "",
      totalSize: 0,
      pageNumber: 1,
      options: [
        {
          value: 0,
          label: "全部"
        },
        {
          value: 1,
          label: "获取"
        },
        {
          value: 2,
          label: "扣除"
        }
      ],
      tableData: [],
      queryType: ""
    };
  },
  created() {
    this.search(1);
  },
  methods: {
    // 搜索
    search(val) {
      let beginTime, endTime;
      if (this.time) {
        beginTime = this.time[0].getTime();
        endTime = this.time[1].getTime();
      } else {
        beginTime = "";
        endTime = "";
      }
      let parms = {
        pageNumber: val ? val : this.pageNumber,
        pageSize: 10,
        beginTime: beginTime,
        endTime: endTime,
        queryType: this.queryType,
        mobileNumber: this.mobileNumber
      };
      findPageListSeedList({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.totalSize = content.totalSize;
          this.tableData = content.items;
          this.pageNumber = val ? val : this.pageNumber;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 翻页
    pageChange(val) {
      this.pageNumber = val;
      this.search();
    }
  }
};
</script>
<style lang="less" scoped>
.consumeData {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .tabelBox {
    width: 100%;
    margin-top: 40px;
  }
  .totalSizeBox {
    width: 100%;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>