<template>
  <div class="cityPartner_apply">
    <!-- 上方搜索条件区域 -->
    <div class="conditionBox">
      <span>电话：</span>
      <el-input v-model="mobile" style="width:140px;"></el-input>
      <span>成为钻石合伙人时间:</span>
      <el-date-picker
        v-model="time"
        type="datetimerange"
        start-placeholder="起始时间"
        end-placeholder="截止时间"
        @change="dateChange"
      ></el-date-picker>
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
    </div>
    <!-- 表格区域 -->
    <div class="tableBox">
      <el-table :data="formData" border ref="multipleTable" style="width: 100%">
        <el-table-column prop="id" label="会员编号" align="center" width="100"></el-table-column>
        <el-table-column prop="nickname" label="昵称" align="center"></el-table-column>
        <el-table-column prop="mobileNumber" label="电话" align="center"></el-table-column>
        <el-table-column prop label="成为钻石合伙人时间" align="center" width="160">
          <template slot-scope="scope">
            <span>{{scope.row.openTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="referrerName" label="上级" align="center"></el-table-column>
        <el-table-column prop="referrerMobileNumber" label="上级电话" align="center"></el-table-column>
        <el-table-column prop="diamondTeamCount" label="邀请钻石合伙人数量" align="center"></el-table-column>
        <el-table-column prop="plusTeamCount" label="邀请合伙人数量" align="center"></el-table-column>
        <el-table-column prop="teamCount" label="邀请用户数量" align="center"></el-table-column>
        <el-table-column prop="incomeAmount" label="总计收益（元）" align="center"></el-table-column>
        <el-table-column prop="commissionBalance" label="佣金金额" align="center"></el-table-column>
        <el-table-column prop="rechargeCount" label="充值次数" align="center"></el-table-column>
        <el-table-column prop="buyCount" label="正常购买次数" align="center"></el-table-column>
        <el-table-column prop="freeBuyCount" label="freebuy购买次数" align="center"></el-table-column>
        <el-table-column prop="balance" label="账户余额（元）" align="center"></el-table-column>
        <el-table-column prop="consumeBalance" label="累计消费金额（元）" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="240">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="changeStatus(scope.$index, scope.row)"
              v-if="scope.row.status == 1"
            >冻结</el-button>
            <el-button
              type="danger"
              size="mini"
              v-if="scope.row.status == 2"
              @click="changeStatus(scope.$index, scope.row)"
            >解冻</el-button>
            <el-button type="primary" size="mini" @click="seeDetail(scope.row.id)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页和总计 -->
    <div class="totalBox">
      <div class="totalNum" v-if="formData.length>0">总计：{{pageTotal}}条</div>
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
import { exchangeMemberStatus, diamondMemberList } from "@/network/api";
export default {
  data() {
    return {
      mobile: "",
      time: "",
      startTime: "",
      endTime: "",
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "2",
          label: "禁用"
        },
        {
          value: "1",
          label: "启用"
        }
      ],
      status: "", // 状态
      formData: [],
      pageTotal: 0,
      currentPage: 1
    };
  },
  mounted() {
    this.search(1);
  },
  methods: {
    search(val) {
      let startTime = "";
      let endTime = "";
      if (this.startTime) {
        let startTime = this.startTime.getTime();
      }
      if (this.endTime) {
        let endTime = this.endTime.getTime();
      }
      let parms = {
        pageNumber: val,
        pageSize: 10,
        beginTime: startTime,
        endTime: endTime,
        enabled: this.status,
        mobile: this.mobile
      };
      diamondMemberList({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          if (res.data.content) {
            this.formData = res.data.content.items;
            this.pageTotal = res.data.content.totalSize;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
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

    // 解冻、冻结
    changeStatus(index, row) {
      console.log(row);
      if (row.status === 1) {
        this.$prompt("", "冻结此会员后无法登陆平台", {
          confirmButtonText: "确定",
          cancelButtonText: "点错了",
          confirmButtonClass: "confirmButton",
          cancelButtonClass: "cancelButton",
          inputPlaceholder: "最多输入100字",
          inputType: "textarea",
          center: true,
          inputPattern: /\S/,
          inputErrorMessage: "理由不能为空"
        })
          .then(({ value }) => {
            let parms = {
              id: row.id,
              enabled: 2,
              remark: value
            };
            exchangeMemberStatus(this.qs.stringify(parms)).then(res => {
              if (res.data.messageCode == "MSG_1001") {
                this.$message({
                  type: "success",
                  message: res.data.message
                });
                this.search(1);
              } else {
                this.$message.error(res.data.message);
              }
            });
          })
          .catch(() => {});
      } else if (row.status === 2) {
        this.$confirm("", "解冻后，会员账号恢复正常", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true
        })
          .then(() => {
            let parms = {
              id: row.id,
              enabled: 1,
              remark: ""
            };
            exchangeMemberStatus(this.qs.stringify(parms)).then(res => {
              if (res.data.messageCode == "MSG_1001") {
                this.$message({
                  type: "success",
                  message: res.data.message
                });
                this.search(1);
              } else {
                this.$message.error(res.data.message);
              }
            });
          })
          .catch(() => {});
      }
    },

    // 查看详情
    seeDetail(id) {
      this.$router.push({
        path: "/diamond_detail",
        query: {
          id: id
        }
      });
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