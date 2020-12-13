<template>
  <div class="weChat">
    <div class="searchBox" style="margin-top:20px;">
      <div>
        <span>电话：</span>
        <el-input v-model="form.mobileNumber" style="width:140px;" :maxlength="11"></el-input>
        <span style="margin-left:20px;">店铺名称：</span>
        <el-input v-model="form.storeName" style="width:140px;" :maxlength="40"></el-input>
        <span style="margin-left:20px;">申请提现金额：</span>
        <el-input v-model="form.amountStart" style="width:120px;" :maxlength="6"></el-input>
        <span>~</span>
        <el-input v-model="form.amountEnd" style="width:120px;" :maxlength="6"></el-input>
        <span style="margin-left:20px;">申请状态：</span>
        <el-select v-model="form.status" style="width:120px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div style="margin-top:20px;">
        <span class="demonstration">申请时间：</span>
        <el-date-picker
          v-model="time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width:360px;margin-right:20px;"
        ></el-date-picker>
        <el-button type="primary" @click="search(1)">搜索</el-button>
        <el-button type="primary" v-if="isAutoPass == 1" @click="setAutoPass(0)">关闭自动通过</el-button>
        <el-button type="success" v-if="isAutoPass == 0" @click="setAutoPass(1)">开启自动通过</el-button>
        <el-button type="primary" @click="openIsBlacklistDialog(1)">管理黑名单</el-button>
      </div>
    </div>
    <div class="tabelBox" style="margin-top:40px;">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="编号" align="center" width="100"></el-table-column>
        <el-table-column prop="storeName" label="店铺名称" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="mobileNumber" label="电话" align="center"></el-table-column>
        <el-table-column prop="createTime" label="申请提交时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyAmount" label="申请提现金额" align="center"></el-table-column>
        <el-table-column prop="adoptAmount" label="通过提现金额" align="center"></el-table-column>
        <el-table-column prop="aliPayName" label="真实姓名" align="center"></el-table-column>
        <el-table-column prop="account" label="支付宝号" align="center"></el-table-column>
        <el-table-column prop label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 1"
              type="text"
              @click="openIsPassDialog(scope.row.id,scope.row.applyAmount)"
            >通过</el-button>
            <span v-if="scope.row.status == 2">已通过</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="totalBox">
      <span>总计：{{totalSize}}条</span>
      <el-pagination
        background
        layout="prev, pager, next,jumper"
        :total="totalSize"
        :page-size="15"
        :current-page.sync="currentPage"
        @current-change="pageChange($event)"
      ></el-pagination>
    </div>
    <!-- 提现通过弹窗 -->
    <el-dialog title="提示" :visible.sync="isPass" center width="480px" :close-on-click-modal="false">
      <span>您将返还</span>
      <el-input v-model="adoptAmount" style="width:120px;"></el-input>
      <span>元给用户的支付宝账户！</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isPass = false">取 消</el-button>
        <el-button type="primary" @click="pass">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 黑名单 -->
    <el-dialog
      title="自动提现黑名单"
      :visible.sync="isBlacklist"
      center
      width="500px"
      :close-on-click-modal="false"
    >
      <div>
        <el-input v-model="merchantId" style="width:140px;margin-right:20px;" placeholder="请输入商品编号"></el-input>
        <el-button type="primary" @click="addBlackList">加入名单</el-button>
        <el-button type="success" @click="deletBlackList">移除名单</el-button>
      </div>
      <div style="margin-top:20px;">
        <el-table :data="blackList" border style="width: 100%">
          <el-table-column prop="merchantId" label="商户编号" align="center" width="100"></el-table-column>
          <el-table-column prop="storeName" label="商户名称" align="center"></el-table-column>
          <el-table-column prop label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="removeBlacklist(scope.row.merchantId)">移出</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top:10px;font-size:12px;">*黑名单中的商户支付宝提现将无法自动通过，需要手动审核通过</div>
      <div style="width:100%;margin-top:20px;display:flex;justify-content:center;">
        <el-pagination
          background
          layout="prev, pager, next,jumper"
          :total="totalSize1"
          :page-size="10"
          :current-page.sync="currentPage1"
          @current-change="pageChange1($event)"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getMerchantDrawList,
  merchantDrawAdopt,
  merchantAutoAdoptSetByAliPay,
  setAutoAdoptByAliPay,
  getMerchantBlackList,
  merchantAddBlackList,
  merchantRemoveBlackList
} from "@/network/api";
export default {
  data() {
    return {
      totalSize: 0,
      totalSize1: 0,
      currentPage: 0,
      currentPage1: 0,
      isPass: false,
      id: "",
      adoptAmount: "",
      adoptAmountMax: "", // 最大提现金额
      isBlacklist: false,
      isAutoPass: null, //是否开启自动通过提现
      form: {
        pageNumber: "",
        pageSize: "15",
        mobileNumber: "",
        storeName: "",
        amountStart: "",
        amountEnd: "",
        status: "",
        startTime: "",
        endTime: "",
        type: "3"
      },
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "待通过"
        },
        {
          value: "2",
          label: "已通过"
        }
      ],
      merchantId: "",
      time: "",
      tableData: [],
      blackList: []
    };
  },
  created() {
    this.search(1);
    this.merchantAutoAdoptSet();
  },
  methods: {
    // 搜索
    search(val) {
      let form = this.form;
      form.pageNumber = val;
      if (this.time) {
        form.startTime = this.time[0].getTime();
        form.endTime = this.time[1].getTime();
      } else {
        form.startTime = "";
        form.endTime = "";
      }
      let b = /^\d+(\.\d{1,2})?$/;
      if (
        (form.amountStart && !b.test(form.amountStart)) ||
        (form.amountEnd && !b.test(form.amountEnd))
      ) {
        this.$message.error("提现金额格式不正确");
        return;
      }
      if (
        form.amountStart &&
        form.amountEnd &&
        Number(form.amountStart) > Number(form.amountEnd)
      ) {
        this.$message.error("申请提现金额前者不可大于后者");
        return;
      }
      getMerchantDrawList({ params: form }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.tableData = content.items;
          this.totalSize = content.totalSize;
          this.currentPage = val;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 查看自动提现设置
    merchantAutoAdoptSet() {
      merchantAutoAdoptSetByAliPay().then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.isAutoPass = res.data.content;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 设置自动提现
    setAutoPass(status) {
      let obj = {
        status: status
      };
      setAutoAdoptByAliPay(this.qs.stringify(obj)).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.merchantAutoAdoptSet();
          this.$message.success("操作成功");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 管理黑名单
    openIsBlacklistDialog(val) {
      let obj = {
        pageNumber: val,
        pageSize: 10
      };
      getMerchantBlackList({ params: obj }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.blackList = content.items;
          this.totalSize1 = content.totalSize;
          this.currentPage1 = val;
          this.isBlacklist = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 加入黑名单
    addBlackList() {
      let regEn = /[`~!@#$%^&*()_+<>?:"{},.\\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
      if (regEn.test(this.merchantId) || regCn.test(this.merchantId)) {
        this.$message.error("商品编号格式不正确");
        return false;
      }
      let obj = {
        merchantId: this.merchantId
      };
      merchantAddBlackList(this.qs.stringify(obj)).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.openIsBlacklistDialog(1);
          this.merchantId = "";
          this.$message.success("加入成功");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 移除黑名单
    deletBlackList() {
      let regEn = /[`~!@#$%^&*()_+<>?:"{},.\\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
      if (regEn.test(this.merchantId) || regCn.test(this.merchantId)) {
        this.$message.error("商品编号格式不正确");
        return false;
      }
      let obj = {
        type: 2,
        id: this.merchantId
      };
      merchantRemoveBlackList(this.qs.stringify(obj)).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.openIsBlacklistDialog(1);
          this.merchantId = "";
          this.$message.success("移除成功");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 移出黑名单
    removeBlacklist(merchantId) {
      this.$confirm("确认从黑名单中移出此商户吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          let obj = {
            type: 2,
            id: merchantId
          };
          merchantRemoveBlackList(this.qs.stringify(obj)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.openIsBlacklistDialog(1);
              this.$message.success("移出成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 黑名单翻页
    pageChange1(val) {
      this.openIsBlacklistDialog(val);
      this.currentPage1 = val;
    },
    // 打开通过弹窗
    openIsPassDialog(id, adoptAmount) {
      this.id = id;
      this.adoptAmount = adoptAmount;
      this.adoptAmountMax = adoptAmount;
      this.isPass = true;
    },
    // 提现通过
    pass() {
      let b = /^\d+(\.\d{1,2})?$/;
      if (!b.test(this.adoptAmount)) {
        this.$message.error("提现金额格式不正确");
        return;
      }
      if (this.adoptAmount < 0.1) {
        this.$message.error("提现金额不得小于0.1元");
        return;
      }
      if (this.adoptAmount > this.adoptAmountMax) {
        this.$message.error("提现金额不能大于申请提现金额");
        return;
      }
      let parms = {
        recordId: this.id,
        adoptAmount: this.adoptAmount
      };
      merchantDrawAdopt(this.qs.stringify(parms)).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.isPass = false;
          this.search(1);
          this.$message.success("操作成功");
        } else {
          this.$message.error(res.data.message);
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
.totalBox {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>