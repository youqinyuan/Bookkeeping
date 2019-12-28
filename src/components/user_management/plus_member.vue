<template>
  <div class="contents">
    <div class="search_box">
      <div class="common">
        <span>电话:</span>
        <el-input style="width:150px" v-model="mobile" placeholder></el-input>
      </div>

      <div class="common">
        <span>成为合伙人时间:</span>
        <el-date-picker v-model="beginTime" type="datetime" placeholder="选择开始时间"></el-date-picker>
        <span>至</span>
        <el-date-picker v-model="endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
      </div>

      <div class="common">
        <span>状态:</span>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>

      <el-button class="common" type="primary" @click="search(1)">搜索</el-button>
    </div>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="会员编号" align="center"></el-table-column>
      <el-table-column prop="nickname" label="昵称" align="center"></el-table-column>
      <el-table-column prop="mobileNumber" label="电话" align="center"></el-table-column>
      <el-table-column prop="openTime" label="成为plus会员时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.openTime | dateFormat}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="profitsDistribName" label="分层设置" align="center"></el-table-column> -->
      <el-table-column prop="teamCount" label="团队人数" align="center"></el-table-column>
      <el-table-column prop="referrerName" label="上级" align="center"></el-table-column>
      <el-table-column prop="referrerMobileNumber" label="上级电话" align="center"></el-table-column>
      <el-table-column prop="incomeAmount" label="总计收益(元)" align="center"></el-table-column>
      <el-table-column prop="commissionBalance" label="佣金余额" align="center"></el-table-column>
      <el-table-column prop="rechargeCount" label="充值次数" align="center"></el-table-column>
      <el-table-column prop="freeBuyCount" label="freebuy购买次数" align="center"></el-table-column>
      <el-table-column prop="buyCount" label="正常购买次数" align="center"></el-table-column>
      <el-table-column prop="balance" label="钱包余额(元)" align="center">
        <template slot-scope="scope">
          <span
            style="color:red;cursor: pointer;"
            @click="reduceAssets(scope.row)"
          >{{scope.row.balance}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="consumeBalance" label="累计消费金额(元)" align="center"></el-table-column>
      <el-table-column label="操作" width="290" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 1"
            size="mini"
            type="danger"
            @click="changeStatus(scope.$index, scope.row)"
          >冻结</el-button>
          <el-button
            v-else
            size="mini"
            type="success"
            @click="changeStatus(scope.$index, scope.row)"
          >解冻</el-button>
          <el-button size="mini" type="primary" @click="goDetail(scope.$index, scope.row)">查看详情</el-button>
          <el-button size="mini" type="primary" @click="changePT(scope.$index, scope.row)">身份转变</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="table_bottom">
      <div class="totalNum">总计：{{pageTotal}}条</div>
      <div class="order-bottom" v-if="tableData.length>0">
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

    <!-- 减少弹窗 -->
    <reduceAssetsPop ref="reduce"></reduceAssetsPop>

    <!-- 身份转变弹窗 -->
    <plusPop ref="plus"></plusPop>
  </div>
</template>

<script>
import {
  plusMemberList,
  exchangeMemberStatus,
  exchangeMemberRole
} from "@/network/api";
import reduceAssetsPop from "./common/reduceAssetsPop";
import plusPop from "./common/plusPop";
export default {
  props: {},
  data() {
    return {
      mobile: "",
      beginTime: "",
      endTime: "",
      pageTotal: "",
      currentPage: 2,
      tableData: [],
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
      value: ""
    };
  },
  components: {
    reduceAssetsPop,
    plusPop
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.search(1);
  },
  methods: {
    // 请求页面数据
    getplusMemberList(data) {
      let param = { ...data };
      plusMemberList({ params: param }).then(res => {
        if (res.data.content) {
          this.tableData = res.data.content.items;
          this.pageTotal = res.data.content.totalSize;
        } else {
          this.tableData = [];
          this.pageTotal = 0;
        }
      });
    },
    // 查看详情
    goDetail(index, row) {
      this.$router.push({
        path: "/plusDetail",
        query: {
          id: row.id
        }
      });
    },

    // 解冻、冻结
    changeStatus(index, row) {
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
    // 翻页
    pageChange(val) {
      this.search(val);
      this.currentPage = val;
    },
    // 搜索
    search(val) {
      this.currentPage = 1;
      let obj = {};
      obj.pageNumber = val;
      obj.pageSize = 10;
      obj.mobile = this.mobile;
      obj.enabled = this.value;
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
      obj.beginTime = start;
      obj.endTime = end;
      this.getplusMemberList(obj);
    },

    // 减少资产
    reduceAssets(row) {
      this.$refs.reduce.open(row);
    },

    // 身份转变
    changePT(index, row) {
      this.$refs.plus.open(row.id, 2);
    }
  }
};
</script>

<style scoped lang="less">
.search_box {
  display: flex;
  flex-wrap: wrap;
  .common {
    margin-right: 20px;
    margin-bottom: 20px;
  }
}
.table_bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
}
</style>
