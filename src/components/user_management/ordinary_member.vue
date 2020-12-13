<template>
  <div class="contents">
    <div class="search_box">
      <div>
        <span>电话:</span>
        <el-input style="width: 150px" v-model="mobile" placeholder></el-input>
      </div>

      <div class="center">
        <span>注册时间:</span>
        <el-date-picker
          v-model="beginTime"
          type="datetime"
          placeholder="选择开始时间"
        ></el-date-picker>
        <span>至</span>
        <el-date-picker
          v-model="endTime"
          type="datetime"
          placeholder="选择结束时间"
        ></el-date-picker>
      </div>

      <div>
        <span>上级电话:</span>
        <el-input
          style="width: 150px"
          v-model="referrerMobileNumber"
        ></el-input>
      </div>

      <div>
        <span>注册渠道:</span>
        <el-select v-model="registrySource" style="width: 140px">
          <el-option
            v-for="item in registrySourceList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <div>
        <span>状态:</span>
        <el-select v-model="enabled" style="width: 120px">
          <el-option
            v-for="item in enabledList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <div>
        <span>收货地址:</span>
        <el-input style="width: 300px" v-model="address"></el-input>
      </div>

      <el-button type="primary" @click="search(1)">搜索</el-button>
      <el-button type="success" @click="exportExcel">导出</el-button>
    </div>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column
        prop="id"
        label="会员编号"
        width="120px"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="registrySource"
        label="注册渠道"
        width="120px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.registrySource | registrySource }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="昵称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="receiverName"
        label="收货人姓名"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="alipayRealName"
        label="支付宝提现姓名"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="mobileNumber"
        label="电话"
        width="140px"
        align="center"
      ></el-table-column>
        <el-table-column
          prop="insureValidTime"
          label="保险剩余时长"
          width="130px"
          align="center"
        >
        <template slot-scope="scope">
          <span>{{scope.row.insureValidTime}}天</span>
        </template>
        </el-table-column>
      <el-table-column
        prop="registryTime"
        label="注册时间"
        width="180px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.registryTime | dateFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="registryTime"
        label="成为普通会员时间"
        width="180px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.registryTime | dateFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="referrerName"
        label="上级"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="referrerMobileNumber"
        label="上级电话"
        width="140px"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="balance"
        label="钱包余额(元)"
        width="130px"
        align="center"
      >
        <template slot-scope="scope">
          <span
            style="color: red; cursor: pointer"
            @click="reduceAssets(scope.row)"
            >{{ scope.row.balance }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="seedAmount"
        label="种子数量"
        width="100px"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="buyCount"
        label="正常购买次数"
        width="100px"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="rechargeCount"
        label="充值次数"
        width="100px"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="freeBuyCount"
        label="freebuy购买次数"
        width="100px"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="consumeBalance"
        label="累计消费金额(元)"
        align="center"
        width="140px"
      ></el-table-column>
      <el-table-column label="操作" width="290" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.enabled == 1"
            size="mini"
            type="danger"
            @click="changeStatus(scope.$index, scope.row)"
            >冻结</el-button
          >
          <el-button
            v-else
            size="mini"
            type="success"
            @click="changeStatus(scope.$index, scope.row)"
            >解冻</el-button
          >
          <el-button
            size="mini"
            type="primary"
            @click="goDetail(scope.$index, scope.row)"
            >查看详情</el-button
          >
          <el-button
            size="mini"
            type="primary"
            @click="changePlus(scope.$index, scope.row)"
            >身份转变</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="table_bottom">
      <div class="totalNum">总计：{{ pageTotal }}条</div>
      <div class="order-bottom" v-if="tableData.length > 0">
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
import { memberList, exchangeMemberStatus,memberListByExcel } from "@/network/api";
import reduceAssetsPop from "./common/reduceAssetsPop";
import plusPop from "./common/plusPop";
export default {
  props: {},
  data() {
    return {
      mobile: "",
      beginTime: "",
      endTime: "",
      referrerMobileNumber: "",
      registrySource: "",
      enabled: "",
      address: "",
      registrySourceList: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "1",
          label: "Android",
        },
        {
          value: "2",
          label: "小程序",
        },
        {
          value: "3",
          label: "H5",
        },
        {
          value: "4",
          label: "iOS",
        },
      ],
      enabledList: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "1",
          label: "启用",
        },
        {
          value: "2",
          label: "禁用",
        },
      ],
      pageTotal: "",
      currentPage: 1,
      tableData: [],
    };
  },
  components: {
    reduceAssetsPop,
    plusPop,
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.search(1);
  },
  methods: {
    // 请求页面数据
    getmemberList(data) {
      let param = { ...data };
      memberList({ params: param }).then((res) => {
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
        path: "/memberDetail",
        query: {
          id: row.id,
        },
      });
    },

    // 解冻、冻结
    changeStatus(index, row) {
      if (row.enabled === 1) {
        this.$prompt("", "冻结此会员后无法登陆平台", {
          confirmButtonText: "确定",
          cancelButtonText: "点错了",
          confirmButtonClass: "confirmButton",
          cancelButtonClass: "cancelButton",
          inputPlaceholder: "最多输入100字",
          inputType: "textarea",
          center: true,
          inputPattern: /\S/,
          inputErrorMessage: "理由不能为空",
        })
          .then(({ value }) => {
            let parms = {
              id: row.id,
              enabled: 2,
              remark: value,
            };
            exchangeMemberStatus(this.qs.stringify(parms)).then((res) => {
              if (res.data.messageCode == "MSG_1001") {
                this.$message({
                  type: "success",
                  message: res.data.message,
                });
                this.search(1);
              } else {
                this.$message.error(res.data.message);
              }
            });
          })
          .catch(() => {});
      } else if (row.enabled === 2) {
        this.$confirm("", "解冻后，会员账号恢复正常", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true,
        })
          .then(() => {
            let parms = {
              id: row.id,
              enabled: 1,
              remark: "",
            };
            exchangeMemberStatus(this.qs.stringify(parms)).then((res) => {
              if (res.data.messageCode == "MSG_1001") {
                this.$message({
                  type: "success",
                  message: res.data.message,
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
        pageSize: 10,
        mobile: this.mobile,
        beginTime: start,
        endTime: end,
        referrerMobileNumber: this.referrerMobileNumber,
        registrySource: this.registrySource,
        enabled: this.enabled,
        address: this.address,
      };
      this.getmemberList(obj);
    },

    // 导出
    exportExcel() {
      this.currentPage = 1;
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
        mobile: this.mobile,
        beginTime: start,
        endTime: end,
        referrerMobileNumber: this.referrerMobileNumber,
        registrySource: this.registrySource,
        enabled: this.enabled,
        address: this.address,
      };
      memberListByExcel(obj).then((res) => {
        this.download(res);
      });
    },

    // 下载文件
    download(data) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data.data]));
      let a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.setAttribute("download", "普通会员列表.xls");
      document.body.appendChild(a);
      a.click();
    },

    // 减少资产
    reduceAssets(row) {
      this.$refs.reduce.open(row);
    },

    // 身份转变
    changePlus(index, row) {
      this.$refs.plus.open(row.id, 1);
    },
  },
};
</script>

<style scoped lang="less">
.search_box {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  div {
    margin: 5px;
  }
  .center {
    margin: 0 30px;
  }
}
.table_bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
}
</style>
