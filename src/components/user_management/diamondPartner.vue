<template>
  <div class="cityPartner_apply">
    <!-- 上方搜索条件区域 -->
    <div class="conditionBox">
      <div>
        <span>电话：</span>
        <el-input v-model="mobile" style="width: 140px"></el-input>
      </div>
      <div>
        <span>注册时间:</span>
        <el-date-picker
          v-model="time"
          type="datetimerange"
          start-placeholder="起始时间"
          end-placeholder="截止时间"
          @change="dateChange"
        ></el-date-picker>
      </div>
      <div>
        <span>上级电话：</span>
        <el-input
          v-model="referrerMobileNumber"
          style="width: 140px"
        ></el-input>
      </div>
      <div>
        <span style="margin-left: 10px">注册渠道：</span>
        <el-select v-model="registrySource" style="width: 100px">
          <el-option
            v-for="item in registrySourceList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div>
        <span style="margin-left: 10px">状态：</span>
        <el-select v-model="enabled" style="width: 100px">
          <el-option
            v-for="item in enabledList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div>
        <span>地址：</span>
        <el-input v-model="address" style="width: 300px"></el-input>
      </div>
      <el-button style="margin-left: 10px" type="primary" @click="search(1)"
        >搜索</el-button
      >
      <el-button type="success" @click="exportExcel">导出</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="tableBox">
      <el-table :data="formData" border ref="multipleTable" style="width: 100%">
        <el-table-column
          prop="id"
          label="会员编号"
          align="center"
          width="100"
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
          width="160px"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.registryTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop
          label="成为钻石合伙人时间"
          align="center"
          width="160"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.openTime | dateFormat }}</span>
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
          prop="diamondTeamCount"
          label="邀请钻石合伙人数量"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="plusTeamCount"
          label="邀请合伙人数量"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="teamCount"
          label="邀请用户数量"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="incomeAmount"
          label="总计收益（元）"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="commissionBalance"
          label="佣金金额"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="rechargeCount"
          label="充值次数"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="buyCount"
          label="正常购买次数"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="freeBuyCount"
          label="freebuy购买次数"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="balance"
          label="账户余额（元）"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="seedAmount"
          label="种子数量"
          width="100px"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="consumeBalance"
          label="累计消费金额（元）"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="240">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="changeStatus(scope.$index, scope.row)"
              v-if="scope.row.status == 1"
              >冻结</el-button
            >
            <el-button
              type="danger"
              size="mini"
              v-if="scope.row.status == 2"
              @click="changeStatus(scope.$index, scope.row)"
              >解冻</el-button
            >
            <el-button
              type="primary"
              size="mini"
              @click="seeDetail(scope.row.id)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页和总计 -->
    <div class="totalBox">
      <div class="totalNum" v-if="formData.length > 0">
        总计：{{ pageTotal }}条
      </div>
      <div class="order-bottom" v-if="formData.length > 0">
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
import {
  exchangeMemberStatus,
  diamondMemberList,
  diamondMemberListByExcel,
} from "@/network/api";
export default {
  data() {
    return {
      mobile: "",
      time: "",
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
      formData: [],
      pageTotal: 0,
      currentPage: 1,
    };
  },
  mounted() {
    this.search(1);
  },
  methods: {
    search(val) {
      let parms = {
        pageNumber: val,
        pageSize: 10,
        beginTime: this.beginTime,
        endTime: this.endTime,
        enabled: this.enabled,
        mobile: this.mobile,
        referrerMobileNumber: this.referrerMobileNumber,
        registrySource: this.registrySource,
        address: this.address,
      };
      diamondMemberList({ params: parms }).then((res) => {
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

    // 导出
    exportExcel() {
      let obj = {
        beginTime: this.beginTime,
        endTime: this.endTime,
        enabled: this.enabled,
        mobile: this.mobile,
        referrerMobileNumber: this.referrerMobileNumber,
        registrySource: this.registrySource,
        address: this.address,
      };
      diamondMemberListByExcel(obj).then((res) => {
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
      a.setAttribute("download", "钻石合伙人列表.xls");
      document.body.appendChild(a);
      a.click();
    },

    // 搜索时间改变事件
    dateChange(val) {
      this.beginTime = this.getDateShow(val[0]);
      this.endTime = this.getDateShow(val[1]);
    },

    // 时间格式处理函数
    getDateShow(value) {
      let dt = new Date(value);
      return dt.getTime();
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
      } else if (row.status === 2) {
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

    // 查看详情
    seeDetail(id) {
      this.$router.push({
        path: "/diamond_detail",
        query: {
          id: id,
        },
      });
    },

    // 翻页
    pageChange(val) {
      this.search(val);
      this.currentPage = val;
    },
  },
};
</script>
<style lang="less" scoped>
.cityPartner_apply {
  padding: 20px;
  box-sizing: border-box;
  .conditionBox {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    div {
      margin: 5px;
    }
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
}
</style>