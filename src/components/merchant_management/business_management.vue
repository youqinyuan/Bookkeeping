<template>
  <div class="contents">
    <div class="top">
      <div class="inline">
        <span>实名信息：</span>
        <el-input class="inp" v-model="form.name" :maxlength="20"></el-input>
      </div>
      <div class="inline">
        <span>商家账户：</span>
        <el-input
          class="inp"
          v-model="form.mobileNumber"
          :maxlength="11"
        ></el-input>
      </div>
      <div class="inline">
        <span>所属行业：</span>
        <el-select
          v-model="form.businessId"
          placeholder="请选择"
          style="width: 150px"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="inline">
        <span>代理上级：</span>
        <el-input
          class="inp"
          v-model="form.agentMobileNumber"
          :maxlength="11"
        ></el-input>
      </div>
      <div class="inline">
        <span>店铺名称：</span>
        <el-input
          class="inp"
          v-model="form.storeName"
          :maxlength="40"
        ></el-input>
      </div>
      <div class="inline">
        <span>线上营业额：</span>
        <el-input class="inp" v-model="form.minOnlineGains"></el-input>~
        <el-input class="inp" v-model="form.maxOnlineGains"></el-input>
      </div>
      <div class="inline">
        <span>线下营业额：</span>
        <el-input class="inp" v-model="form.minOfflineGains"></el-input>~
        <el-input class="inp" v-model="form.maxOfflineGains"></el-input>
      </div>

      <el-button type="primary" @click="search(1)">搜 索</el-button>
      <el-button type="info" @click="downLoadExcel">导 出</el-button>
      <el-button type="success" @click="importMerchant">导入商家</el-button>
      <el-button type="primary" @click="openFlashPaymentDialog(1)"
        >默认闪付调整</el-button
      >
    </div>

    <el-table
      :data="tableData_on"
      border
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="商家编号"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="实名信息"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="mobileNumber"
        label="商家账户"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="contactNumber"
        label="用户联系电话"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="businessName"
        label="所属行业"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="storeName"
        label="店铺名称"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="source"
        align="center"
        label="来源"
      ></el-table-column>
      <el-table-column prop="agentMobileNumber" label="代理上级" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="openAgentDialog(scope.row.id)">
            <span v-if="scope.row.agentMobileNumber">{{
              scope.row.agentMobileNumber
            }}</span>
            <span v-if="!scope.row.agentMobileNumber">—</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="onlineGains"
        label="线上营业额（总）"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="offlineGains"
        label="线下营业额（总）"
        align="center"
      ></el-table-column>
      <el-table-column prop="" label="店铺评分" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="changeScore(scope.row.id, scope.row.score)"
            v-if="scope.row.virtualScore"
            >{{ scope.row.virtualScore }}</el-button
          >
          <el-button
            type="text"
            @click="changeScore(scope.row.id, scope.row.score)"
            v-else
            >{{ scope.row.score }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="sales" label="销量" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="changeSales(scope.row.id, scope.row.realSales)"
            >{{ scope.row.sales + scope.row.realSales }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="sales" label="闪付设置" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="
              openFlashPaymentDialog(
                2,
                scope.row.id,
                scope.row.flashPayAmount,
                scope.row.flashPayCount
              )
            "
            >{{ scope.row.flashPayAmount }}元/{{
              scope.row.flashPayCount
            }}次</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="scope">
          <el-button type="text" @click="godetail(scope.row.id)"
            >查看</el-button
          >
          <el-button type="text" @click="deletes(scope.row.id)">删除</el-button>
          <el-button type="text" @click="updateContactNumber(scope.row.id)"
            >用户联系电话</el-button
          >
          <!-- <div class="handle_box" v-else>
            <span class="handle">重置密码</span>
            <span class="handle" v-if="scope.row.status == 2">冻结</span>
            <span class="handle" v-else-if="scope.row.status == 4" style="color:#008000;">解冻</span>
            <span class="handle">流失</span>
            <span class="handle">更换代理商</span>
            <span v-if="scope.row.channel == 2">设为供应商</span>
            <span v-else-if="scope.row.channel == 4" class="handle" style="color:#996666;">改为普通商家</span>
          </div>
          <div class="handle_box" v-if="scope.row.status == 5">
            <span class="handle" style="color:#cccccc">已流失</span>
          </div>-->
        </template>
      </el-table-column>
    </el-table>
    <div class="bot">
      <span>总计:{{ total }}条</span>
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
        :total="total"
      ></el-pagination>
    </div>

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
            style="width: 120px"
            :maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item label="邀请码：">
          <el-input
            v-model="superiorAgentForm.inviterCode"
            style="width: 120px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="superiorAgentDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeAgentValue">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 销量修改弹窗 -->
    <el-dialog
      title="调整月销量"
      :visible.sync="dialogFormVisible"
      center
      width="400px"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <span>当前真实销量：{{ realSales }}+</span>
      <el-input v-model="sales" style="width: 140px"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateMerchantSales">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 销量店铺评分弹窗 -->
    <el-dialog
      title="调整评分"
      :visible.sync="changeScoreDialog"
      center
      width="300px"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div style="text-align: center; margin-bottom: 10px">
        真实评分：{{ score }}
      </div>
      <el-input-number
        style="margin-left: 35px"
        v-model="virtualScore"
        :step="0.1"
        :min="0"
        :max="5"
      ></el-input-number>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeScoreDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateMerchantScore">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 闪付设置弹窗 -->
    <el-dialog
      :title="flashPaymentTitle"
      :visible.sync="flashPaymentDialog"
      center
      width="400px"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div>
        <span>每天最多支付次数：</span>
        <el-input
          v-model="flashPaymentForm.flashPayCount"
          style="width: 140px"
        ></el-input>
        <span>次</span>
      </div>
      <div style="margin-top: 20px">
        <span>单次最大支付金额：</span>
        <el-input
          v-model="flashPaymentForm.flashPayAmount"
          style="width: 140px"
        ></el-input>
        <span>元</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="flashPaymentDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeFlashPayment">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 广告值弹窗 -->
    <adValuePop ref="advalue"></adValuePop>

    <!-- 导入商家弹窗 -->
    <ImportMerchantPop ref="ImportMerchant"></ImportMerchantPop>
  </div>
</template>

<script>
import {
  getMerchantBusinessList,
  getOnlineStoreList,
  getOfflineStoreList,
  resetPassword,
  changeAuditStatus,
  deleteMerchantById,
  exportOnlinesStoreListExcel,
  updateParent,
  updateMerchantSales,
  updateMerchantScore,
  getDefaultValue,
  updateDefaultValue,
  updateFlashPaySet,
  updateContactNumber,
} from "@/network/api";
import adValuePop from "../goods_management/common/adValuePop";
import ImportMerchantPop from "./common/ImportMerchantPop";
export default {
  props: {},
  data() {
    return {
      dialogFormVisible: false,
      superiorAgentDialog: false,
      flashPaymentDialog: false,
      flashPaymentTitle: "",
      flashPaymentType: 1,
      superiorAgentForm: {
        refMobileNumber: "",
        inviterCode: "",
      },
      mobileNumber: "",
      options: [
        {
          id: "",
          name: "全部",
        },
      ],
      tableData_on: [],
      currentPage: 1,
      total: 0,
      tableData_off: [],
      form: {
        name: "",
        mobileNumber: "",
        businessId: "",
        agentMobileNumber: "",
        storeName: "",
        minOnlineGains: "",
        maxOnlineGains: "",
        minOfflineGains: "",
        maxOfflineGains: "",
      },
      flashPaymentForm: {
        flashPayCount: "",
        flashPayAmount: "",
      },
      id: "",
      realSales: "", // 真实销量
      sales: "", // 销量
      changeScoreDialog: false,
      score: "", // 评分
      virtualScore: "", //虚拟评分
    };
  },
  components: {
    adValuePop,
    ImportMerchantPop,
  },
  created() {},
  mounted() {
    this.getMerchantBusinessList();
    this.search(1);
  },
  methods: {
    // 获取行业分类
    getMerchantBusinessList() {
      getMerchantBusinessList().then((res) => {
        if (res.data.content) {
          this.options = this.options.concat(res.data.content);
        }
      });
    },

    // 获取商户列表
    getOnlineStoreList(parms) {
      getOnlineStoreList({ params: parms }).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.tableData_on = res.data.content.items;
          this.total = res.data.content.totalSize;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 获取商户列表  其他行业接口
    // getOfflineStoreList(parms) {
    //   getOfflineStoreList({ params: parms }).then(res => {
    //     if (res.data.messageCode == "MSG_1001") {
    //       this.tableData_off = res.data.content.items;
    //       this.total = res.data.content.totalSize;
    //     }
    //   });
    // },

    //翻页
    handleCurrentChange(val) {
      this.search(val);
      this.currentPage = val;
    },

    // 搜索
    search(val) {
      let obj = this.form;
      obj.pageNumber = val ? val : this.currentPage;
      obj.pageSize = 10;
      for (let key in obj) {
        if (!obj[key]) {
          obj[key] = null;
        }
      }
      let a = /^\d+(\.\d{1,2})?$/;
      if (obj.minOnlineGains && !a.test(obj.minOnlineGains)) {
        this.$message.error("线上营业额格式不正确");
        return;
      }
      if (obj.maxOnlineGains && !a.test(obj.maxOnlineGains)) {
        this.$message.error("线上营业额格式不正确");
        return;
      }
      if (obj.minOfflineGains && !a.test(obj.minOfflineGains)) {
        this.$message.error("线下营业额格式不正确");
        return;
      }
      if (obj.maxOfflineGains && !a.test(obj.maxOfflineGains)) {
        this.$message.error("线下营业额格式不正确");
        return;
      }
      if (Number(obj.minOnlineGains) > Number(obj.maxOnlineGains)) {
        this.$message.error("线上营业额后者不可大于前者");
        return;
      }
      if (Number(obj.minOfflineGains) > Number(obj.maxOfflineGains)) {
        this.$message.error("线下营业额后者不可大于前者");
        return;
      }
      this.getOnlineStoreList(obj);
      this.currentPage = val ? val : this.currentPage;
    },

    // 导入商家
    importMerchant() {
      this.$refs.ImportMerchant.open();
    },

    // 导出
    downLoadExcel() {
      let obj = this.form;
      for (let key in obj) {
        if (!obj[key]) {
          obj[key] = null;
        }
      }
      let a = /^\d+(\.\d{1,2})?$/;
      if (obj.minOnlineGains && !a.test(obj.minOnlineGains)) {
        this.$message.error("线上营业额格式不正确");
        return;
      }
      if (obj.maxOnlineGains && !a.test(obj.maxOnlineGains)) {
        this.$message.error("线上营业额格式不正确");
        return;
      }
      if (obj.minOfflineGains && !a.test(obj.minOfflineGains)) {
        this.$message.error("线下营业额格式不正确");
        return;
      }
      if (obj.maxOfflineGains && !a.test(obj.maxOfflineGains)) {
        this.$message.error("线下营业额格式不正确");
        return;
      }
      if (Number(obj.minOnlineGains) > Number(obj.maxOnlineGains)) {
        this.$message.error("线上营业额后者不可大于前者");
        return;
      }
      if (Number(obj.minOfflineGains) > Number(obj.maxOfflineGains)) {
        this.$message.error("线下营业额后者不可大于前者");
        return;
      }
      exportOnlinesStoreListExcel(obj).then((res) => {
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
      a.setAttribute("download", "商户管理列表.xls");
      document.body.appendChild(a);
      a.click();
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
      updateParent(this.qs.stringify(form)).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("操作成功");
          this.superiorAgentDialog = false;
          this.search();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 更改广告值
    open(id, adWeights) {
      this.$refs.advalue.open(id, adWeights, 2);
    },

    // 重置密码
    resetPassword(id) {
      this.$confirm("重置密码为88888888", "重置密码？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          let parms = {
            id: id,
          };
          resetPassword(this.qs.stringify(parms)).then((res) => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success(res.data.message);
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },

    // 冻结
    freeze(id) {
      this.$prompt(
        "冻结后商家无法登录后台，爆品商城内商家隐藏，商品隐藏!",
        "冻结商家？",
        {
          confirmButtonText: "确定",
          cancelButtonText: "点错了",
          confirmButtonClass: "confirmButton",
          cancelButtonClass: "cancelButton",
          inputPlaceholder: "输入拒绝原因：100字以内",
          inputType: "textarea",
          center: true,
          inputPattern: /\S/,
          inputErrorMessage: "原因不能为空",
        }
      )
        .then(({ value }) => {
          let parms = {
            id: id,
            status: 4,
            reason: value,
          };
          changeAuditStatus(this.qs.stringify(parms)).then((res) => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success(res.data.message);
              this.search();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },

    // 解冻
    unfreeze(id) {
      this.$confirm("解冻后，商家可正常操作，商品自动上线!", "解冻商家?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          let parms = {
            id: id,
            status: 2,
          };
          changeAuditStatus(this.qs.stringify(parms)).then((res) => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success(res.data.message);
              this.search();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },

    // 流失
    loss(id) {
      this.$prompt("", "流失商家？", {
        confirmButtonText: "确定",
        cancelButtonText: "点错了",
        confirmButtonClass: "confirmButton",
        cancelButtonClass: "cancelButton",
        inputPlaceholder: "输入备注：200字以内",
        inputType: "textarea",
        center: true,
        inputPattern: /\S/,
        inputErrorMessage: "备注不能为空",
      })
        .then(({ value }) => {
          let parms = {
            id: id,
            status: 5,
            reason: value,
          };
          changeAuditStatus(this.qs.stringify(parms)).then((res) => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success(res.data.message);
              this.search();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },

    // 打开闪付调整弹窗
    openFlashPaymentDialog(type, id, flashPayAmount, flashPayCount) {
      // type: 1-闪付默认值调整-修改闪付设置
      this.flashPaymentType = type;
      this.id = id;
      if (type == 1) {
        getDefaultValue().then((res) => {
          if (res.data.messageCode == "MSG_1001") {
            let content = res.data.content;
            this.flashPaymentForm.flashPayCount = content.flashPayCount;
            this.flashPaymentForm.flashPayAmount = content.flashPayAmount;
            this.flashPaymentTitle = "闪付默认值调整";
            this.flashPaymentDialog = true;
          } else {
            this.$message.error(res.data.message);
          }
        });
      } else if (type == 2) {
        this.flashPaymentTitle = "修改闪付设置";
        this.flashPaymentForm.flashPayAmount = flashPayAmount;
        this.flashPaymentForm.flashPayCount = flashPayCount;
        this.flashPaymentDialog = true;
      }
    },

    // 闪付设置点击确定
    changeFlashPayment() {
      let form = JSON.parse(JSON.stringify(this.flashPaymentForm));
      console.log(form);
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
      if (this.flashPaymentType == 1) {
        // 调整闪付默认值
        updateDefaultValue(this.qs.stringify(form)).then((res) => {
          if (res.data.messageCode == "MSG_1001") {
            this.flashPaymentDialog = false;
            this.$message.success("操作成功");
            this.search();
          } else {
            this.$message.error(res.data.message);
          }
        });
      } else if (this.flashPaymentType == 2) {
        // 修改闪付设置
        form.id = this.id;
        updateFlashPaySet(this.qs.stringify(form)).then((res) => {
          if (res.data.messageCode == "MSG_1001") {
            this.flashPaymentDialog = false;
            this.$message.success("操作成功");
            this.search();
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
    },

    // 点击显示修改销量弹窗
    changeSales(id, realSales) {
      this.sales = "";
      this.id = id;
      this.realSales = realSales;
      this.dialogFormVisible = true;
    },

    // 修改销量
    updateMerchantSales() {
      let reg = /^[+]{0,1}(\d+)$/;
      if (!this.sales) {
        this.$message.error("销量不能为空");
        return;
      }
      if (!reg.test(this.sales)) {
        this.$message.error("销量格式不正确");
        return;
      }
      let parms = {
        id: this.id,
        sales: this.sales,
      };
      updateMerchantSales(this.qs.stringify(parms)).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.dialogFormVisible = false;
          this.search();
          this.$message.success("操作成功");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 打开修改评分弹窗
    changeScore(id, score) {
      this.id = id;
      this.score = score;
      this.virtualScore = "";
      this.changeScoreDialog = true;
    },

    // 修改评分
    updateMerchantScore() {
      let a = /^(\d+\.\d{1,1}|\d+)$/;
      if (!a.test(this.virtualScore)) {
        this.$message.error("评分格式不正确");
        return;
      }
      let parms = {
        id: this.id,
        score: this.virtualScore,
      };
      updateMerchantScore(this.qs.stringify(parms)).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.changeScoreDialog = false;
          this.search();
          this.$message.success("操作成功");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 删除
    deletes(id) {
      this.$confirm("", "确认删除该商家吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
      })
        .then(() => {
          let parms = {
            id: id,
          };
          deleteMerchantById({ params: parms }).then((res) => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success(res.data.message);
              this.search();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },

    // 用户联系电话
    updateContactNumber(id) {
      this.$prompt("用户联系电话", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        center: true,
      })
        .then(({ value }) => {
          if (!value) {
            this.$message.error("用户联系电话不能为空");
            return;
          }
          if (value.length > "20") {
            this.$message.error("用户联系电话不可超过20个字符");
            return;
          }
          let parms = {
            id: id,
            contactNumber: value,
          };
          updateContactNumber(this.qs.stringify(parms)).then((res) => {
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

    // 跳转详情
    godetail(id) {
      this.$router.push({
        path: "/businessDetails",
        query: {
          id: id,
        },
      });
    },
  },
};
</script>

<style scoped lang="less">
.top {
  margin-bottom: 15px;
}
.inp {
  width: 140px;
}
.inline {
  display: inline-block;
  margin-bottom: 20px;
  margin-right: 15px;
}
.bot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.handle_box {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .handle {
    color: red;
    cursor: pointer;
    margin: 0px 5px;
  }
}
</style>    
