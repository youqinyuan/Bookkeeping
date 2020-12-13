<template>
  <div class="changeGoodsDialog">
    <el-dialog title :visible.sync="dialogVisible" fullscreen>
      <div class="searchBox">
        <span>统一设置：活动原价</span>
        <el-input v-model="activePrice" style="width:140px;"></el-input>
        <span>可选择期数（多个，隔开）</span>
        <el-input v-model="periodInstallment" style="width:140px;"></el-input>
        <el-button type="primary" @click="unifiedSetting">确定</el-button>
      </div>
      <div class="tableBox">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="specDesc" label="规格" align="center"></el-table-column>
          <el-table-column prop="stock" label="库存" align="center"></el-table-column>
          <el-table-column prop="orgPrice" label="原价" align="center"></el-table-column>
          <el-table-column prop label="活动原价" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.activePrice" style="width:140px;"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop label="可选择期数（多个,隔开）" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.periodInstallment" style="width:140px;"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="商品购买规则配置" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="scope.row.countMin || scope.row.countMax || scope.row.countConsumeSeed || scope.row.countTeamInvite || scope.row.countGroup || scope.row.groupTime"
                @click="openSetBuyRule_change(scope.row,scope.$index)"
              >修改</el-button>
              <el-button
                type="text"
                v-else
                @click="openSetBuyRule(scope.$index,scope.row.isInstallmentPayment)"
              >设置</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="设置在前端展示的规则" align="center">
            <template slot-scope="scope">
              <el-radio
                v-model="scope.row.isDefault"
                :label="1"
                @change="(val)=>radioSelect(val,scope.row.goodsId,scope.$index)"
              >选择</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="del(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="btnBox">
        <el-button type="primary" @click="dialogVisible = false">返回上一页</el-button>
        <el-button type="primary" @click="openSetBuyRule('-1',1)">统一设置商品购买规则</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="商品购买规则配置-规格名/统一配置"
      :visible.sync="buyRuleDialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form ref="formBuyRule" :model="formBuyRule" :rules="rules" label-width="140px">
        <h3>一、数量条件：</h3>
        <hr style="margin:10px;" />
        <el-form-item label="最低购买数量：" prop="countMin" :rules="rules.buyRule1">
          <el-input v-model="formBuyRule.countMin" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="最高购买数量：" prop="countMax" :rules="rules.buyRule2">
          <el-input v-model="formBuyRule.countMax" style="width:200px;"></el-input>
        </el-form-item>
        <h3>二、特殊条件</h3>
        <hr style="margin:10px;" />
        <el-form-item label="购买扣除种子数量：" prop="countConsumeSeed" :rules="rules.buyRule1">
          <el-input v-model="formBuyRule.countConsumeSeed" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="邀请用户数量：" prop="countTeamInvite" :rules="rules.buyRule1">
          <el-input v-model="formBuyRule.countTeamInvite" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="拼团人数：" prop="countGroup" :rules="rules.buyRule1">
          <el-input v-model="formBuyRule.countGroup" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="是否可分期支付：">
          <el-checkbox
            v-model="formBuyRule.isInstallment"
            :disabled="formBuyRule.isInstallmentPayment == 2"
          ></el-checkbox>
        </el-form-item>
        <el-form-item label="成团时间：" prop="groupTime" :rules="rules.buyRule1">
          <el-input v-model="formBuyRule.groupTime" style="width:200px;"></el-input>
          <span>小时</span>
        </el-form-item>
        <hr style="margin:10px;" />
        <el-form-item label label-width="10px">
          <el-button type="primary" style="width:120px;" @click="setBuyRule('formBuyRule')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { findCustomizeActivityGoodsStockList } from "@/network/api";
export default {
  data() {
    const buyRule1 = (rule, value, callback) => {
      let a = /^[0-9]\d*$/;
      if (value) {
        if (value < 1 || value > 1000) {
          callback(new Error("值区间：1-1000"));
        } else if (!a.test(value)) {
          callback(new Error("不能为小数"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const buyRule2 = (rule, value, callback) => {
      let a = /^[0-9]\d*$/;
      if (value) {
        if (value < 1 || value > 10000) {
          callback(new Error("值区间：1-10000"));
        } else if (!a.test(value)) {
          callback(new Error("不能为小数"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      buyRuleDialogVisible: false, //统一设置商品购买规则弹窗
      goodsData: [], // 父组件传递过来的规格数据
      goodsIds: "", // 商品ID集合,使用英文逗号(,)分隔
      index: "",
      activePrice: "",
      periodInstallment: "",
      tableData: [],
      buyRuleIndex: "",
      formBuyRule: {
        countMin: "",
        countMax: "",
        countConsumeSeed: "",
        countTeamInvite: "",
        countGroup: "",
        groupTime: "",
        isInstallment: "",
        isInstallmentPayment: 1 // 是否支持分期支付
      },
      rules: {
        buyRule1: [{ validator: buyRule1, trigger: "blur" }],
        buyRule2: [{ validator: buyRule2, trigger: "blur" }]
      }
    };
  },
  methods: {
    open(data, goodsIds, index,idx) {
      this.goodsData = JSON.parse(JSON.stringify(data));
      if (goodsIds) {
        // 商品ID集合,使用英文逗号(,)分隔
        this.findGoodsStockList(goodsIds);
      } else {
        this.tableData = this.goodsData;
        this.dialogVisible = true;
      }
      this.index = index;
    },
    // 获取活动商品规格列表
    findGoodsStockList(goodsIds) {
      let parms = {
        goodsIds: goodsIds
      };
      findCustomizeActivityGoodsStockList({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          if (this.goodsData.length == 0) {
            this.tableData = res.data.content;
          } else {
            this.tableData = this.goodsData.concat(res.data.content);
          }
          this.dialogVisible = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 统一设置
    unifiedSetting() {
      this.tableData.forEach(val => {
        val.activePrice = this.activePrice ? this.activePrice : val.activePrice;
        val.periodInstallment = this.periodInstallment
          ? this.periodInstallment
          : val.periodInstallment;
      });
      this.activePrice = "";
      this.periodInstallment = "";
    },
    // 选择
    radioSelect(val, goodsId, index) {
      // 选择在前端展示的规则，单选，选中那个那个就在前端展示（默认选中第一个规格）
      // 1.把商品的所有规格均设置为不选中
      this.tableData.forEach(val => {
        if (val.goodsId == goodsId) {
          val.isDefault = 2;
        }
      });
      // 2.选中点击的商品规格
      this.tableData[index].isDefault = val;
    },
    // 删除
    del(index) {
      this.tableData.splice(index, 1);
    },
    // 打开设置商品购买规则弹窗
    openSetBuyRule(index, isInstallmentPayment) {
      // isInstallmentPayment：是否可是设置分期支付 1：可以，2不可以
      // data为所有规格中的第一条数据，如果第一条数据已设置内容，则带入
      let data = this.tableData[0];
      console.log(data)
      this.formBuyRule.countMin = data.countMin ? data.countMin : "";
      this.formBuyRule.countMax = data.countMax ? data.countMax : "";
      this.formBuyRule.countConsumeSeed = data.countConsumeSeed
        ? data.countConsumeSeed
        : "";
      this.formBuyRule.countTeamInvite = data.countTeamInvite
        ? data.countTeamInvite
        : "";
      this.formBuyRule.countGroup = data.countGroup ? data.countGroup : "";
      this.formBuyRule.groupTime = data.groupTime ? data.groupTime : "";
      this.formBuyRule.isInstallment = data.isInstallment == 1 ? true : false;
      this.formBuyRule.isInstallmentPayment = isInstallmentPayment;
      this.buyRuleIndex = index;
      this.buyRuleDialogVisible = true;
    },
    // 打开设置商品购买规则弹窗 -- 修改
    openSetBuyRule_change(item, index) {
      this.formBuyRule.countMin = item.countMin;
      this.formBuyRule.countMax = item.countMax;
      this.formBuyRule.countConsumeSeed = item.countConsumeSeed;
      this.formBuyRule.countTeamInvite = item.countTeamInvite;
      this.formBuyRule.countGroup = item.countGroup;
      this.formBuyRule.groupTime = item.groupTime;
      this.formBuyRule.isInstallment = item.isInstallment == 1 ? true : false;
      this.formBuyRule.isInstallmentPayment = item.isInstallmentPayment;
      this.buyRuleIndex = index;
      this.buyRuleDialogVisible = true;
    },
    // 设置商品购买规则
    setBuyRule(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = this.formBuyRule;
          let index = this.buyRuleIndex;
          if (index == "-1") {
            // 统一设置商品购买规则
            this.tableData.forEach(val => {
              val.countMin = data.countMin;
              val.countMax = data.countMax;
              val.countConsumeSeed = data.countConsumeSeed;
              val.countTeamInvite = data.countTeamInvite;
              val.countGroup = data.countGroup;
              val.groupTime = data.groupTime;
              // 判断该商品该规格是否支持分期支付
              if (val.isInstallmentPayment == 1) {
                val.isInstallment = data.isInstallment ? 1 : 2;
              } else {
                val.isInstallment = 2;
              }
            });
          } else {
            // 设置单个商品购买规则
            this.tableData[index].countMin = data.countMin;
            this.tableData[index].countMax = data.countMax;
            this.tableData[index].countConsumeSeed = data.countConsumeSeed;
            this.tableData[index].countTeamInvite = data.countTeamInvite;
            this.tableData[index].countGroup = data.countGroup;
            this.tableData[index].groupTime = data.groupTime;
            this.tableData[index].isInstallment = data.isInstallment ? 1 : 2;
          }
          this.$message.success("保存成功");
          this.buyRuleDialogVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 保存
    submitForm() {
      let a = /^[0-9]\d*$/;
      let b = /^\d+(.\d{1,2})?$/;
      let c = /^(\d+\.\d{1,1}|\d+)$/;
      let isActivePrice = true;
      let activePriceFlag = true;
      let periodInstallment_flag = true;
      this.tableData.forEach(val => {
        // 验证活动原价是否为空
        if (!val.activePrice) {
          isActivePrice = false;
        }
        // 验证活动原价格式
        if (
          val.activePrice < 0 ||
          !b.test(val.activePrice) ||
          val.activePrice > 100000
        ) {
          activePriceFlag = false;
        }
        // 验证可选期数格式
        if (val.periodInstallment) {
          let arr = val.periodInstallment.split(",");
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] < 0 || arr[i] > 10000) {
              periodInstallment_flag = false;
            } else {
              if (arr[i] > 1 && !a.test(arr[i])) {
                periodInstallment_flag = false;
              } else if (arr[i] < 1 && !c.test(arr[i])) {
                periodInstallment_flag = false;
              }
            }
          }
        }
      });
      if (!isActivePrice) {
        this.$message.error("活动原价不能为空");
        return;
      }
      if (!activePriceFlag) {
        this.$message.error("活动原价格式不正确");
        return;
      }
      if (!periodInstallment_flag) {
        this.$message.error("可选期数格式不正确");
        return;
      }
      this.$emit("func", this.tableData, this.index);
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang="less" scoped>
.tableBox {
  margin-top: 20px;
}
.btnBox {
  margin-top: 20px;
}
</style>