<template>
  <div class="wrap">
    <div class="top">
      <div>
        <span>时间：</span>
        <el-date-picker
          v-model="beginTime"
          type="datetime"
          placeholder="选择开始时间"
          style="width:200px;"
        ></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="endTime" type="datetime" placeholder="选择结束时间" style="width:200px;"></el-date-picker>
      </div>
      <div>
        <span style="margin-left:20px">电话：</span>
        <el-input style="width:160px" v-model="mobile" placeholder="请输入电话"></el-input>
      </div>
      <div>
        <span style="margin-left:20px">银行卡卡号：</span>
        <el-input style="width:200px" v-model="bankCardNumber" placeholder="请输入银行卡卡号"></el-input>
      </div>
      <div>
        <span style="margin-left:20px">状态：</span>
        <el-select v-model="status" placeholder="请选择" style="width:120px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div style="margin-top:20px;margin-left:20px;">
        <el-button type="primary" @click="search(1)">搜 索</el-button>
        <el-button type="info" @click="downLoadData">导出查询内容</el-button>
      </div>
    </div>

    <div style="margin-top:30px">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="编号" align="center"></el-table-column>
        <el-table-column prop="name" align="center" label="会员名称"></el-table-column>
        <el-table-column prop="mobile" align="center" label="电话"></el-table-column>
        <el-table-column prop="time" align="center" label="申请提交时间">
          <template slot-scope="scope">{{scope.row.time | dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="amount" align="center" label="申请提现金额">
          <template slot-scope="scope">
            <span style="color:red">{{scope.row.amount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" align="center" label="手续费">
          <template slot-scope="scope">
            <span style="color:red">{{scope.row.poundageAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" align="center" label="到账金额">
          <template slot-scope="scope">
            <span style="color:red">{{scope.row.realAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bankCardNumber" align="center" label="银行卡卡号"></el-table-column>
        <el-table-column prop="bankAddress" align="center" label="开户行"></el-table-column>
        <el-table-column prop="realName" align="center" label="真实姓名"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="pass(scope.row)" v-if="scope.row.status == 1">转账</el-button>
            <el-button type="text" style="color:#999;" v-if="scope.row.status == 2">已转账</el-button>
            <span style="color:#999" v-if="scope.row.status == 3">已取消</span>
            <el-button
              type="text"
              @click="showSeeData(scope.row.id)"
              v-if="scope.row.status == 1"
            >查看资料</el-button>
            <el-button
              type="text"
              style="color:#333;"
              @click="showSeeData(scope.row.id)"
              v-if="scope.row.status == 2"
            >查看资料</el-button>
          </template>
        </el-table-column>
      </el-table>
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
    <!-- 查看资料弹框 -->
    <el-dialog title="查看资料" :visible.sync="seeData" center width="410px">
      <div class="dialog_items">银行卡号：{{bankInfo.bankCardNumber}}</div>
      <div class="dialog_items">开户行：{{bankInfo.bankAddress}}</div>
      <div class="dialog_items">真实姓名：{{bankInfo.realName}}</div>
      <img
        class="dialog_img"
        style="width:360px;height:240px;display:block;"
        :src="bankInfo.faceOfIdCardUrl"
      />
      <img
        class="dialog_img"
        style="width:360px;height:240px;display:block;"
        :src="bankInfo.backOfIdCardUrl"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  auditPassedBankCard,
  getUserTransferAuditListBankCard,
  getBankCardInfo,
  getUserTransferAuditListBankCardExcel
} from "@/network/api";
export default {
  props: {},
  data() {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      beginTime: "", // 开始时间
      endTime: "", //结束时间
      mobile: null, //手机号码
      bankCardNumber: "", // 银行卡号码
      status: "", // 状态选择框value值
      options: [
        // 状态选择框可选择的内容
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "未转账"
        },
        {
          value: "2",
          label: "已转账"
        }
      ],
      seeData: false, //是否显示查看资料弹框
      bankInfo: "" //银行卡信息
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
    // 获取提现数据
    getUserTransferAuditListBankCard(parms) {
      getUserTransferAuditListBankCard({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.total = res.data.content.totalSize;
          this.tableData = res.data.content.items;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 点击分页事件
    handleCurrentChange(val) {
      this.search(val);
      this.currentPage = val;
    },

    // 搜索
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
      //正则验证银行卡号格式
      let bank = /^[0-9]*$/;
      if (!bank.test(this.bankCardNumber)) {
        this.$message.error("银行卡卡号格式错误");
        return;
      }
      let obj = {
        pageNumber: val,
        pageSize: 10,
        beginTime: start,
        endTime: end,
        mobile: this.mobile,
        bankCardNumber: this.bankCardNumber,
        status: this.status
      };
      this.getUserTransferAuditListBankCard(obj);
      this.currentPage = 1;
    },

    // 转账
    pass(row) {
      this.$confirm("请转账成功后点击此处!", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          let parms = {
            id: row.id
          };
          auditPassedBankCard(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success(res.data.message);
              this.search(1);
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 查看资料 - 显示查看资料的弹框
    showSeeData(id) {
      getBankCardInfo(`?id=${id}`).then(res => {
        console.log(res.data);
        if ((res.data.messageCode = "MSG_1001")) {
          this.bankInfo = res.data.content;
          this.seeData = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 导出查询内容
    downLoadData() {
      let param = {};
      if (this.beginTime) {
        param.beginTime = this.beginTime.getTime();
      }
      if (this.endTime) {
        param.endTime = this.endTime.getTime();
      }
      if (this.mobile) {
        param.mobile = this.mobile;
      }
      if (this.bankCardNumber) {
        param.bankCardNumber = this.bankCardNumber;
      }
      if (this.status) {
        param.status = this.status;
      }
      getUserTransferAuditListBankCardExcel(param).then(res => {
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
      a.setAttribute("download", "银行卡提现列表.xls");
      document.body.appendChild(a);
      a.click();
    }
  }
};
</script>

<style scoped lang="less">
.wrap {
  padding: 0px 30px;
  padding-bottom: 20px;
  .top {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    div {
      margin-top: 10px;
    }
  }
  .bot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }
}
.dialog_items {
  color: #999;
  padding-top: 10px;
}
.dialog_img {
  margin-top: 10px;
}
</style>
