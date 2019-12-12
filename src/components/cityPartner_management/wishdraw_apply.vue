<template>
  <div class="cityPartner_apply">
    <!-- 上方搜索条件区域 -->
    <div class="conditionBox">
      <span>申请时间：</span>
      <el-date-picker
        v-model="time"
        type="datetimerange"
        start-placeholder="起始时间"
        end-placeholder="截止时间"
        @change="dateChange"
      ></el-date-picker>
      <span style="margin-left:10px;">电话：</span>
      <el-input v-model="mobile" style="width:140px;"></el-input>
      <span style="margin-left:10px;">状态：</span>
      <el-select v-model="status" style="width:100px;">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button style="margin-left:10px;" type="primary" @click="search(1)">搜索</el-button>
      <el-button style="margin-left:10px;" type="info">导出查询内容</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="tableBox">
      <el-table :data="formData" border ref="multipleTable" style="width: 100%">
        <el-table-column prop="orderNumber" label="编号" align="center"></el-table-column>
        <el-table-column prop="orderNumber" label="电话" align="center"></el-table-column>
        <el-table-column label="提现时间" align="center">
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row" :key="index">
              <span>{{item.orderNumber}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="orderNumber" label="提现金额" align="center"></el-table-column>
        <el-table-column prop="orderNumber" label="姓名" align="center"></el-table-column>
        <el-table-column prop="orderNumber" label="银行卡号" align="center"></el-table-column>
        <el-table-column prop="orderNumber" label="开户行" align="center"></el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button type="text" style="color:#67C23A" @click="transferMoney(scope.row.id)">转账</el-button>
            <el-button type="text" style="color:#909399">已转账</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页和总计 -->
    <div class="totalBox">
      <div class="totalNum">总计：{{pageTotal}}条</div>
      <div class="order-bottom" v-if="formData.length>0">
        <el-pagination
          background
          layout="prev, pager, next,jumper"
          :total="pageTotal"
          :page-size="10"
          :current-page.sync="currentPage"
          @current-change="pageChange($event)"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
// import {  } from "@/network/api";
export default {
  data() {
    return {
      mobile: "",
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "已转账"
        },
        {
          value: "2",
          label: "未转账"
        }
      ],
      status: "", // 状态
      time: "",
      startTime: "",
      endTime: "",
      formData: [
        {
          orderNumber: 1
        }
      ],
      pageTotal: 100,
      currentPage: 1
    };
  },
  mounted() {},
  methods: {
    search(val) {
      console.log(val);
      console.log(this.mobile);
      console.log(this.status);
      console.log(this.districtId);
      console.log(this.startTime);
      console.log(this.endTime);
    },

    // 搜索时间改变事件
    dateChange(val) {
      this.startTime = this.getDateShow(val[0]);
      this.endTime = this.getDateShow(val[1]);
    },

    // 时间格式处理函数
    getDateShow(value) {
      let dt = new Date(value);
      return dt.getTime();
    },

    // 转账
    transferMoney(id) {
      console.log(id);
      this.$confirm("请给代理商银行卡转账，如已经转账，点击确定！!", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log(id);
        })
        .catch(() => {});
    },

    // 翻页
    pageChange(val) {
      this.search(val);
      this.currentPage = val;
    }
  }
};
</script>
<style lang="less" scoped>
.cityPartner_apply {
  padding: 20px;
  box-sizing: border-box;
}
.tableBox {
  margin-top: 40px;
}
.totalBox {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>