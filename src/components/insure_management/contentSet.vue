<template>
  <div class="contentSet">
    <div class="searchBox">
      <span>电话：</span>
      <el-input v-model="form.mobileNumber" style="width: 160px"></el-input>
      <span style="margin-left: 10px">增加时间：</span>
      <el-date-picker
        v-model="time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <span style="margin-left: 10px">性质：</span>
      <el-select v-model="form.resource" style="width: 100px">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button type="primary" style="margin-left: 10px" @click="search(1)"
        >搜索</el-button
      >
      <el-button type="primary" @click="nav('/addTime')">增加时长</el-button>
      <el-button type="primary" @click="nav('/insureIntroduction')"
        >保险介绍页</el-button
      >
    </div>
    <div class="tableBox">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column
          prop="mobileNumber"
          label="用户电话"
          width="140"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" align="center">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="增加时间"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="increaseTime"
          label="本次增加时长"
          align="center"
        >
        <template slot-scope="scope">
          <span>{{scope.row.increaseTime}}个月</span>
        </template>
        </el-table-column>
        <el-table-column prop="leftTime" label="保险剩余时长" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.leftTime }}天</span>
          </template>
        </el-table-column>
        <el-table-column prop="resource" label="性质" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.resource == '1'">购买</span>
            <span v-if="scope.row.resource == '2'">平台赠送</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="totalSizeBox">
      <span>总计：{{ totalSize }}条</span>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalSize"
        :page-size="20"
        :current-page="currentPage"
        @current-change="pageChange($event)"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { findPageListInsurance } from "@/network/api";
export default {
  data() {
    return {
      totalSize: 0,
      currentPage: 0,
      options: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "2",
          label: "赠送",
        },
        {
          value: "1",
          label: "购买",
        },
      ],
      form: {
        pageSize: 20,
        resource: "",
        mobileNumber: "",
        timeBegin: "",
        timeEnd: "",
      },
      time: "",
      tableData: [],
    };
  },
  created() {
    this.search(1);
  },
  methods: {
    // 搜索
    search(val) {
      let parms = this.form;
      parms.pageNumber = val ? val : this.currentPage;
      if (this.time) {
        parms.timeBegin = this.time[0].getTime();
        parms.timeEnd = this.time[1].getTime();
      } else {
        parms.timeBegin = "";
        parms.timeEnd = "";
      }
      findPageListInsurance({ params: parms }).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.tableData = content.items;
          this.totalSize = content.totalSize;
          this.currentPage = val ? val : this.currentPage;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 跳转到增加时长或者保险介绍页
    nav(path) {
      this.$router.push(path);
    },
    // 分页改变事件
    pageChange(val) {
      this.currentPage = val;
      this.search(val);
    },
  },
};
</script>
<style lang="less" scoped>
.contentSet {
  padding: 20px;
  box-sizing: border-box;
}
.tableBox {
  margin-top: 40px;
}
.totalSizeBox {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
