<template>
  <div class="pre_bussiness">
    <div class="searchBox">
      <span>实名信息：</span>
      <el-input v-model="name" placeholder="姓名" style="width:160px;margin-right:20px;"></el-input>
      <span>商家账户：</span>
      <el-input v-model="mobileNumber" style="width:160px;"></el-input>
      <el-button type="primary" style="margin-left:40px;" @click="search(1)">搜索</el-button>
      <el-button type="success" @click="openDefaultValueDialog">默认值调整</el-button>
    </div>
    <div class="tableBox">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="商家编号" width="120" align="center"></el-table-column>
        <el-table-column prop="name" label="实名信息" align="center"></el-table-column>
        <el-table-column prop="mobileNumber" label="账户(联系方式)" width="180" align="center"></el-table-column>
        <el-table-column prop="agentMobileNumber" label="代理上级" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="openAgentDialog(scope.row.id)">
              <span v-if="scope.row.agentMobileNumber">{{scope.row.agentMobileNumber}}</span>
              <span v-if="!scope.row.agentMobileNumber">—</span>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop label="入驻时间" align="center" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodsQuantity" label="商品数量" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="changeGoodsNum(scope.row.id)">{{scope.row.goodsQuantity}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop label="成交单数" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.sales + scope.row.realSales}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="offlineGains" label="营业额" align="center"></el-table-column>
        <el-table-column prop="drawQuota" label="提现额度" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="withdrawalLimit(scope.row.id)">{{scope.row.drawQuota}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="sales" label="闪付设置" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="openFlashPaymentDialog(scope.row.id,scope.row.flashPayCount,scope.row.flashPayAmount)"
            >{{scope.row.flashPayAmount}}元/{{scope.row.flashPayCount}}次</el-button>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="see(scope.row.id)">查看</el-button>
            <el-button type="text" @click="del(scope.row.id)">删除</el-button>
            <el-button
              type="text"
              v-if="scope.row.status != 4"
              @click="frozenOrthaw(scope.row.id,4)"
            >冻结</el-button>
            <el-button
              type="text"
              v-if="scope.row.status == 4"
              @click="frozenOrthaw(scope.row.id,2)"
            >解冻</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="totalBox">
      <span>总计：{{totalSize}}条</span>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalSize"
        :page-size="10"
        :current-page.sync="currentPage"
        @current-change="pageChange($event)"
      ></el-pagination>
    </div>

    <!-- 调整默认值弹窗 -->
    <el-dialog
      title="默认值调整"
      :visible.sync="defaultValueDialog"
      width="300px"
      center
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form :model="defaultValueForm">
        <el-form-item label="提现额度：">
          <el-input v-model="defaultValueForm.drawQuota" style="width:120px;" :maxlength="6"></el-input>元
        </el-form-item>
        <el-form-item label="最大商品数：">
          <el-input v-model="defaultValueForm.goodsQuantity" style="width:120px;" :maxlength="3"></el-input>个
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="defaultValueDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeDefaultValue">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改上级代理弹窗 -->
    <el-dialog
      title="修改上级代理"
      :visible.sync="superiorAgentDialog"
      width="300px"
      center
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form :model="superiorAgentForm">
        <el-form-item label="手机号：">
          <el-input
            v-model="superiorAgentForm.refMobileNumber"
            style="width:120px;"
            :maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item label="邀请码：">
          <el-input v-model="superiorAgentForm.inviterCode" style="width:120px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="superiorAgentDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeAgentValue">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 闪付设置弹窗 -->
    <el-dialog
      title="修改闪付设置"
      :visible.sync="flashPaymentDialog"
      center
      width="400px"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div>
        <span>每天最多支付次数：</span>
        <el-input v-model="flashPaymentForm.flashPayCount" style="width:140px;"></el-input>
        <span>次</span>
      </div>
      <div style="margin-top:20px;">
        <span>单次最大支付金额：</span>
        <el-input v-model="flashPaymentForm.flashPayAmount" style="width:140px;"></el-input>
        <span>元</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="flashPaymentDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeFlashPayment">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOnlineStoreList,
  updateParent,
  updateGoodsQuantity,
  updateDrawQuota,
  getDefaultValue,
  updateDefaultValue,
  deleteMerchantById,
  changeAuditStatus,
  updateFlashPaySet
} from "@/network/api";
export default {
  data() {
    return {
      dialogFormVisible: false,
      superiorAgentDialog: false,
      flashPaymentDialog: false,
      flashPaymentType: 1,
      defaultValueDialog: false,
      superiorAgentDialog: false,
      totalSize: 0,
      currentPage: 1,
      pageNumber: 1,
      pageSize: 10,
      name: "",
      mobileNumber: "",
      tableData: [],
      flashPaymentForm: {
        flashPayCount: "",
        flashPayAmount: ""
      },
      id: "",
      defaultValueForm: {
        drawQuota: "",
        goodsQuantity: ""
      },
      superiorAgentForm: {
        refMobileNumber: "",
        inviterCode: ""
      }
    };
  },
  created() {
    this.search();
  },
  methods: {
    // 搜索
    search(val) {
      let parms = {
        pageNumber: val ? val : this.pageNumber,
        pageSize: this.pageSize,
        name: this.name,
        mobileNumber: this.mobileNumber,
        type: 2
      };
      getOnlineStoreList({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.tableData = content.items;
          this.totalSize = content.totalSize;
          this.currentPage = val ? val : this.pageNumber;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 打开调整默认值弹窗
    openDefaultValueDialog() {
      getDefaultValue().then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.defaultValueForm = res.data.content;
          this.defaultValueDialog = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 调整默认值保存
    changeDefaultValue() {
      let form = this.defaultValueForm;
      let b = /^[0-9]\d*$/;
      if (!b.test(form.drawQuota)) {
        this.$message.error("提现额度格式不正确");
        return;
      }
      if (!b.test(form.goodsQuantity)) {
        this.$message.error("最大商品数格式不正确");
        return;
      }
      updateDefaultValue(this.qs.stringify(form)).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.defaultValueDialog = false;
          this.$message.success("操作成功");
          this.search();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 打开修改上级代理弹窗
    openAgentDialog(id) {
      this.id = id;
      this.superiorAgentDialog = true;
    },
    // 修改上级代理保存
    changeAgentValue(id) {
      let form = this.superiorAgentForm;
      let b = /^[0-9]\d*$/;
      if (!b.test(form.refMobileNumber)) {
        this.$message.error("手机号格式不正确");
        return;
      }
      if (!b.test(form.inviterCode)) {
        this.$message.error("邀请码式不正确");
        return;
      }
      form.id = this.id;
      updateParent(this.qs.stringify(form)).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("操作成功");
          this.superiorAgentDialog = false;
          this.search();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 修改商品数量
    changeGoodsNum(id) {
      this.$prompt("最大商品数量", "", {
        confirmButtonText: "确认修改",
        inputPlaceholder: "请输入最大商品数量",
        closeOnClickModal: false,
        showCancelButton: false,
        inputPattern: /^[0-9]\d*$/,
        inputErrorMessage: "整数"
      })
        .then(({ value }) => {
          if (value > 999) {
            this.$message.error("商品最大数量不能超过999");
            return;
          }
          let parms = {
            id: id,
            goodsQuantity: value
          };
          updateGoodsQuantity(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("操作成功");
              this.search();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 修改提现额度
    withdrawalLimit(id) {
      this.$prompt("提现额度", "", {
        confirmButtonText: "确认修改",
        inputPlaceholder: "请输入最大额度",
        closeOnClickModal: false,
        showCancelButton: false,
        inputPattern: /^\d+(.\d{1,2})?$/,
        inputErrorMessage: "最多保留2位小数"
      })
        .then(({ value }) => {
          if (value > 999999) {
            this.$message.error("最大提现额度为999999");
            return;
          }
          let parms = {
            id: id,
            drawQuota: value
          };
          updateDrawQuota(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("操作成功");
              this.search();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 打开闪付调整弹窗
    openFlashPaymentDialog(id, flashPayCount, flashPayAmount) {
      this.flashPaymentForm.id = id;
      this.flashPaymentForm.flashPayCount = flashPayCount;
      this.flashPaymentForm.flashPayAmount = flashPayAmount;
      this.flashPaymentDialog = true;
    },

    // 闪付设置点击确定
    changeFlashPayment() {
      let form = JSON.parse(JSON.stringify(this.flashPaymentForm));
      let a = /^[0-9]\d*$/;
      let b = /^\d+(.\d{1,2})?$/;
      if (!a.test(form.flashPayCount) || form.flashPayCount > 100000) {
        this.$message.error("支付次数格式不正确");
        return;
      }
      if (
        !b.test(form.flashPayAmount) ||
        form.flashPayAmount > 100000 ||
        form.flashPayAmount == 0
      ) {
        this.$message.error("支付金额格式不正确");
        return;
      }
      updateFlashPaySet(this.qs.stringify(form)).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.flashPaymentDialog = false;
          this.$message.success("操作成功");
          this.search();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 查看
    see(id) {
      this.$router.push({
        path: "/businessDetails",
        query: {
          id: id,
          type: 0 // 0-预入驻商家
        }
      });
    },
    // 删除
    del(id) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        closeOnClickModal: false,
        cancelButtonText: "不了",
        confirmButtonText: "好的"
      })
        .then(() => {
          let parms = {
            id: id
          };
          deleteMerchantById({ params: parms }).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("操作成功");
              this.search();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 冻结/解冻
    frozenOrthaw(id, status) {
      let tips = status == 4 ? "确认冻结吗?" : "确认解除冻结吗?";
      this.$confirm(tips, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        closeOnClickModal: false,
        cancelButtonText: "不了",
        confirmButtonText: "好的"
      })
        .then(() => {
          let parms = {
            id: id,
            status: status
          };
          changeAuditStatus(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success(res.data.message);
              this.search();
              this.$message.success("操作成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
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
.pre_bussiness {
  padding: 20px;
  box-sizing: border-box;
  .tableBox {
    margin-top: 40px;
  }
  .totalBox {
    margin-top: 20px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>