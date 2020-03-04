<template>
  <div class="contents">
    <!-- 合伙人区域 -->
    <div class="pluscontent">
      <div class="title">
        <span style="font-size:20px;">合伙人:</span>
        <el-button type="primary" @click="right = false" v-if="right">修改</el-button>
        <el-button type="primary" v-else @click="save">保存</el-button>
      </div>
      <div class="con">
        <span style="font-weight:bold;font-size:16px;">成为会员条件：</span>
        <ul>
          <li>
            <el-checkbox v-model="ruleFormPartner.ORDERS_COUNT.enabled">
              <span>1.</span>
              <span>{{ruleFormPartner.ORDERS_COUNT.key | plusSet}}</span>
              <el-input :disabled="right" class="inp" v-model="ruleFormPartner.ORDERS_COUNT.value"></el-input>-送1个月
            </el-checkbox>
          </li>
          <li>
            <el-checkbox v-model="ruleFormPartner.INVITEES_COUNT.enabled">
              <span>2.</span>
              <span>{{ruleFormPartner.INVITEES_COUNT.key | plusSet}}</span>
              <el-input
                :disabled="right"
                class="inp"
                v-model="ruleFormPartner.INVITEES_COUNT.value"
              ></el-input>-送1个月
            </el-checkbox>
          </li>
          <li>
            <el-checkbox v-model="ruleFormPartner.RECHARGE_AMOUNT.enabled">
              <span>3.</span>
              <span>{{ruleFormPartner.RECHARGE_AMOUNT.key | plusSet}}</span>
              <el-input
                :disabled="right"
                class="inp"
                v-model="ruleFormPartner.RECHARGE_AMOUNT.value"
              ></el-input>-送1个月
            </el-checkbox>
          </li>
        </ul>
      </div>
      <div class="con" style="border-top:1px solid #ccc;padding-top:10px;">
        <span style="font-weight:bold;font-size:16px;">成为合伙人奖励：</span>
        <div style="margin-top:10px;font-size:14px;">
          <span>下级购买商品返佣商品利润的</span>
          <el-input :disabled="right" v-model="ruleFormPartner.PLUS_RATE.value" style="width:60px;"></el-input>% ，
          <span>特殊情况，无利润商品返佣商品原实付价</span>
          <el-input
            :disabled="right"
            v-model="ruleFormPartner.PLUS_PAYMENT_RATE.value"
            style="width:60px;"
          ></el-input>%
        </div>
        <div style="margin-top:10px;font-size:14px;">
          <span>下级缴费成为钻石合伙人奖励</span>
          <el-input
            :disabled="right"
            v-model="ruleFormPartner.PLUS_DIAMOND.value"
            style="width:60px;"
          ></el-input>元
        </div>
      </div>
    </div>

    <!-- 钻石合伙人区域 -->
    <div class="pluscontent" style="margin-top:20px;">
      <el-form :model="ruleForm" ref="ruleForm" label-width="0px">
        <el-form-item>
          <div class="title">
            <span style="font-size:20px;">钻石合伙人:</span>
            <el-button type="primary" v-if="right_diamond" @click="right_diamond = false">修改</el-button>
            <el-button type="primary" v-else @click="submitForm('ruleForm')">保存</el-button>
          </div>
        </el-form-item>
        <!-- 成为钻石合伙人条件 -->
        <div style="font-weight:bold;font-size:16px;">成为钻石合伙人条件：</div>
        <el-form-item
          prop="PAYMENT_AMOUNT.value"
          style="margin-top:10px"
          :rules="[{required: true, pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/, message: '输入值不可为0，不可大于1000000，仅限两位小数', trigger: 'blur'}]"
        >
          <span>缴纳费用</span>
          <el-input
            style="width:80px;"
            :disabled="right_diamond"
            v-model="ruleForm.PAYMENT_AMOUNT.value"
          ></el-input>
          <span>元-成为一年的钻石合伙人</span>
        </el-form-item>
        <div
          style="font-weight:bold;font-size:16px;border-top:1px solid #ccc;padding-top:10px;"
        >费用返还条件：</div>
        <el-form-item
          label
          prop="SUBORDINATES_NUMBER.value"
          style="margin-top:10px"
          :rules="[{required: true, pattern: /^[1-9]\d*$/, message: '不可为0，不可大于1000000，不可输入小数', trigger: 'blur'}]"
        >
          <div>
            <span>下级用户数量大于等于</span>
            <el-input
              style="width:80px;"
              :disabled="right_diamond"
              v-model="ruleForm.SUBORDINATES_NUMBER.value"
            ></el-input>人
          </div>
        </el-form-item>
        <!-- 成为钻石合伙人奖励 -->
        <div
          style="font-weight:bold;font-size:16px;border-top:1px solid #ccc;padding-top:10px;"
        >成为钻石合伙人奖励：</div>
        <div style="display:flex;margin-top:10px">
          <el-form-item
            label
            prop="DIAMOND_PROFIT_RATE.value"
            :rules="[{required: true, pattern: /^(\d+\.\d{1,1}|\d+)$/, message: '不可小于0.1%,不可超过100%,最多输入一位小数', trigger: 'blur'}]"
          >
            <span>下级购买商品返佣商品利润的</span>
            <el-input
              style="width:80px;"
              :disabled="right_diamond"
              v-model="ruleForm.DIAMOND_PROFIT_RATE.value"
            ></el-input>%
          </el-form-item>
          <el-form-item
            label
            prop="DIAMOND_PROFIT_PAYMENT_RATE.value"
            :rules="[{required: true, pattern: /^(\d+\.\d{1,1}|\d+)$/, message: '不可小于0.1%,不可超过100%,最多输入一位小数', trigger: 'blur'}]"
          >
            <span>+原价的</span>
            <el-input
              style="width:80px;"
              :disabled="right_diamond"
              v-model="ruleForm.DIAMOND_PROFIT_PAYMENT_RATE.value"
            ></el-input>%，有利润的情况
          </el-form-item>
        </div>
        <el-form-item
          label
          prop="DIAMOND_NO_PROFIT_PAYMENT_RATE.value"
          label-width="0px;"
          :rules="[{required: true, pattern: /^(\d+\.\d{1,1}|\d+)$/, message: '不可小于0.1%,不可超过100%,最多输入一位小数', trigger: 'blur'}]"
        >
          <span>下级购买商品返佣商品原价的</span>
          <el-input
            style="width:80px;"
            :disabled="right_diamond"
            v-model="ruleForm.DIAMOND_NO_PROFIT_PAYMENT_RATE.value"
          ></el-input>%，无利润的情况
        </el-form-item>
        <div style="display:flex;">
          <el-form-item
            label
            prop="DIAMOND_COMMISSION_LEVEL.value"
            label-width="0px;"
            :rules="[{required: true, pattern: /^([1-9]|10)$/, message: '级别为1-10，不可填写小数', trigger: 'blur'}]"
          >
            <span>第</span>
            <el-input
              style="width:80px;"
              :disabled="right_diamond"
              v-model="ruleForm.DIAMOND_COMMISSION_LEVEL.value"
            ></el-input>
          </el-form-item>
          <el-form-item
            label
            prop="DIAMOND_COMMISSION_ONE_RATE.value"
            label-width="0px;"
            :rules="[{required: true, pattern: /^(\d+\.\d{1,1}|\d+)$/, message: '不可小于0.1%,不可超过100%,最多输入一位小数', trigger: 'blur'}]"
          >
            <span>级购买商品返佣-1级的分佣的</span>
            <el-input
              style="width:80px;"
              :disabled="right_diamond"
              v-model="ruleForm.DIAMOND_COMMISSION_ONE_RATE.value"
            ></el-input>%
          </el-form-item>
        </div>
        <el-form-item
          label
          prop="DIAMOND_DIAMOND.value"
          label-width="0px;"
          :rules="[{required: true, pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '格式不正确', trigger: 'blur'}]"
        >
          <span>下级缴费成为钻石合伙人奖励</span>
          <el-input
            style="width:80px;"
            :disabled="right_diamond"
            v-model="ruleForm.DIAMOND_DIAMOND.value"
          ></el-input>元
        </el-form-item>
        <div style="display:flex;">
          <el-form-item
            label
            prop="DIAMOND_FREE_BUY_AMOUNT.value"
            label-width="0px;"
            :rules="[{required: true, pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '格式不正确', trigger: 'blur'}]"
          >
            <span>送freebuy下单</span>
            <el-input
              style="width:80px;"
              :disabled="right_diamond"
              v-model="ruleForm.DIAMOND_FREE_BUY_AMOUNT.value"
            ></el-input>
          </el-form-item>
          <el-form-item
            label
            prop="DIAMOND_FREE_BUY_FREQUENCY.value"
            label-width="0px;"
            :rules="[{required: true, pattern: /^\+?[0-9]\d*$/, message: '正整数最大200次', trigger: 'blur'}]"
          >
            <span>元购物金，使用次数</span>
            <el-input
              style="width:80px;"
              :disabled="right_diamond"
              v-model="ruleForm.DIAMOND_FREE_BUY_FREQUENCY.value"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item
          label
          prop="DIAMOND_DISCOUNT.value"
          label-width="0px;"
          :rules="[{required: true, pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '格式不正确', trigger: 'blur'}]"
        >
          <span>freebuy下单的商品支付金额打折</span>
          <el-input
            style="width:80px;"
            :disabled="right_diamond"
            v-model="ruleForm.DIAMOND_DISCOUNT.value"
          ></el-input>%
        </el-form-item>
        <el-form-item
          label
          prop="DIAMOND_TRANSFER_SERVICE_CHARGE.value"
          label-width="0px;"
          :rules="[{required: true, pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '格式不正确', trigger: 'blur'}]"
        >
          <span>下级转让待返金额提取手续费的</span>
          <el-input
            style="width:80px;"
            :disabled="right_diamond"
            v-model="ruleForm.DIAMOND_TRANSFER_SERVICE_CHARGE.value"
          ></el-input>%
        </el-form-item>
        <el-form-item
          label
          prop="DIAMOND_PURCHASE_SERVICE_CHARGE.value"
          label-width="0px;"
          :rules="[{required: true, pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '格式不正确', trigger: 'blur'}]"
        >
          <span>下级购买待返金额提取手续费的</span>
          <el-input
            style="width:80px;"
            :disabled="right_diamond"
            v-model="ruleForm.DIAMOND_PURCHASE_SERVICE_CHARGE.value"
          ></el-input>%
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getMemberParamConfig, updateMemberParamConfig } from "@/network/api";
export default {
  props: {},
  data() {
    return {
      right: true,
      right_diamond: true,
      content1: [],
      // 合伙人
      ruleFormPartner: {
        ORDERS_COUNT: {
          key: "ORDERS_COUNT",
          value: "",
          enabled: true
        },
        INVITEES_COUNT: {
          key: "INVITEES_COUNT",
          value: "",
          enabled: true
        },
        RECHARGE_AMOUNT: {
          key: "RECHARGE_AMOUNT",
          value: "",
          enabled: true
        },
        PLUS_RATE: {
          key: "PLUS_RATE",
          value: "",
          enabled: true
        },
        PLUS_PAYMENT_RATE: {
          key: "PLUS_PAYMENT_RATE",
          value: "",
          enabled: true
        },
        PLUS_DIAMOND: {
          key: "PLUS_DIAMOND",
          value: "",
          enabled: true
        }
      },
      // 钻石合伙人
      ruleForm: {
        PAYMENT_AMOUNT: {
          key: "PAYMENT_AMOUNT",
          value: "",
          enabled: true
        },
        SUBORDINATES_NUMBER: {
          key: "SUBORDINATES_NUMBER",
          value: "",
          enabled: true
        },
        DIAMOND_PROFIT_RATE: {
          key: "DIAMOND_PROFIT_RATE",
          value: "",
          enabled: true
        },
        DIAMOND_PROFIT_PAYMENT_RATE: {
          key: "DIAMOND_PROFIT_PAYMENT_RATE",
          value: "",
          enabled: true
        },
        DIAMOND_NO_PROFIT_PAYMENT_RATE: {
          key: "DIAMOND_NO_PROFIT_PAYMENT_RATE",
          value: "",
          enabled: true
        },
        DIAMOND_COMMISSION_LEVEL: {
          key: "DIAMOND_COMMISSION_LEVEL",
          value: "",
          enabled: true
        },
        DIAMOND_COMMISSION_ONE_RATE: {
          key: "DIAMOND_COMMISSION_ONE_RATE",
          value: "",
          enabled: true
        },
        DIAMOND_DIAMOND: {
          key: "DIAMOND_DIAMOND",
          value: "",
          enabled: true
        },
        DIAMOND_FREE_BUY_AMOUNT: {
          key: "DIAMOND_FREE_BUY_AMOUNT",
          value: "",
          enabled: true
        },
        DIAMOND_FREE_BUY_FREQUENCY: {
          key: "DIAMOND_FREE_BUY_FREQUENCY",
          value: "",
          enabled: true
        },
        DIAMOND_DISCOUNT: {
          key: "DIAMOND_DISCOUNT",
          value: "",
          enabled: true
        },
        DIAMOND_TRANSFER_SERVICE_CHARGE: {
          key: "DIAMOND_TRANSFER_SERVICE_CHARGE",
          value: "",
          enabled: true
        },
        DIAMOND_PURCHASE_SERVICE_CHARGE: {
          key: "DIAMOND_PURCHASE_SERVICE_CHARGE",
          value: "",
          enabled: true
        }
      }
    };
  },
  components: {},
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getMemberParamConfig();
  },
  beforeRouteLeave(to, from, next) {
    if (this.right == false || !this.right_diamond) {
      this.$confirm("", "内容未保存，需要保存吗", {
        confirmButtonText: "保存",
        cancelButtonText: "不用保存",
        center: true
      })
        .then(() => {
          if (!this.right) {
            this.save();
          }
          if (!this.right_diamond) {
            this.submitForm(this.ruleForm);
          }
          next();
        })
        .catch(() => {
          next();
        });
    } else {
      next();
    }
  },
  methods: {
    // 合伙人和城市合伙人初始数据
    getMemberParamConfig() {
      getMemberParamConfig().then(res => {
        if (res.data.content) {
          let result = res.data.content;
          for (var i = 0; i < result.length; i++) {
            if (result[i].enabled == 1) {
              result[i].enabled = true;
            } else if (result[i].enabled == 2) {
              result[i].enabled = false;
            }
          }
          // 获取合伙人值
          for (let item in this.ruleFormPartner) {
            result.forEach(val => {
              if (item == val.key) {
                this.ruleFormPartner[item].value = val.value;
              }
            });
          }
          // 获取钻石合伙人值
          for (let item in this.ruleForm) {
            result.forEach(val => {
              if (item == val.key) {
                this.ruleForm[item].value = val.value;
              }
            });
          }
        }
      });
    },

    // 合伙人保存
    save() {
      if (this.ruleFormPartner.PLUS_DIAMOND.value < 0) {
        this.$message.error("下级缴费成为钻石合伙人奖励不可小于0元");
        return;
      }
      let data = [];
      for (let item in this.ruleFormPartner) {
        data.push(this.ruleFormPartner[item]);
      }
      // console.log(data);
      let copyContent = JSON.parse(JSON.stringify(data));
      for (var i = 0; i < copyContent.length; i++) {
        if (copyContent[i].enabled == true) {
          copyContent[i].enabled = 1;
        } else if (copyContent[i].enabled == false) {
          copyContent[i].enabled = 2;
        }
      }
      // console.log(copyContent);
      updateMemberParamConfig(copyContent).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("修改成功");
          this.getMemberParamConfig();
          this.right = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 钻石合伙人保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = [];
          let ruleForm = this.ruleForm;
          if (ruleForm.PAYMENT_AMOUNT.value > 1000000) {
            this.$message.error("缴纳费用不可大于1000000");
            return;
          }
          if (ruleForm.SUBORDINATES_NUMBER.value > 1000000) {
            this.$message.error("下级用户数量不可大于1000000");
            return;
          }
          if (
            ruleForm.DIAMOND_PROFIT_RATE.value > 100 ||
            ruleForm.DIAMOND_PROFIT_RATE.value < 0.1
          ) {
            this.$message.error(
              "下级购买商品返佣商品利润不可小于0.1%,不可超过100%"
            );
            return;
          }
          if (
            ruleForm.DIAMOND_PROFIT_PAYMENT_RATE.value > 100 ||
            ruleForm.DIAMOND_PROFIT_PAYMENT_RATE.value < 0.1
          ) {
            this.$message.error(
              "下级购买商品返佣商品原价比例(有利润)不可小于0.1%不可超过100%"
            );
            return;
          }
          if (
            ruleForm.DIAMOND_NO_PROFIT_PAYMENT_RATE.value > 100 ||
            ruleForm.DIAMOND_NO_PROFIT_PAYMENT_RATE.value < 0.1
          ) {
            this.$message.error(
              "下级购买商品返佣商品原价比例(无利润)不可小于0.1%不可高于100%"
            );
            return;
          }
          if (
            ruleForm.DIAMOND_COMMISSION_ONE_RATE.value > 100 ||
            ruleForm.DIAMOND_COMMISSION_ONE_RATE.value < 0.1
          ) {
            this.$message.error(
              "购买商品返佣-1级的分佣不可小于等于0.1%，不可高于100%"
            );
            return;
          }
          if (ruleForm.DIAMOND_FREE_BUY_AMOUNT.value > 100000) {
            this.$message.error("送freebuy下单购物金最大100000元");
            return;
          }
          if (ruleForm.DIAMOND_FREE_BUY_FREQUENCY.value > 200) {
            this.$message.error("使用次数不能超过200次");
            return;
          }
          if (
            ruleForm.DIAMOND_DISCOUNT.value > 100 ||
            ruleForm.DIAMOND_DISCOUNT.value < 50
          ) {
            this.$message.error(
              "freebuy下单的商品支付金额打折不可小于50%，不可高于100%"
            );
            return;
          }
          if (
            ruleForm.DIAMOND_TRANSFER_SERVICE_CHARGE.value > 100 ||
            ruleForm.DIAMOND_TRANSFER_SERVICE_CHARGE.value < 1
          ) {
            this.$message.error(
              "下级转让待返金额提取手续费不可小于1%，不可高于100%"
            );
            return;
          }
          if (
            ruleForm.DIAMOND_PURCHASE_SERVICE_CHARGE.value > 100 ||
            ruleForm.DIAMOND_PURCHASE_SERVICE_CHARGE.value < 1
          ) {
            this.$message.error(
              "下级购买待返金额提取手续费不可小于1%，不可高于100%"
            );
            return;
          }
          for (let val in ruleForm) {
            data.push(ruleForm[val]);
          }
          // console.log(data);
          let copyContent = JSON.parse(JSON.stringify(data));
          for (var i = 0; i < copyContent.length; i++) {
            if (copyContent[i].enabled == true) {
              copyContent[i].enabled = 1;
            } else if (copyContent[i].enabled == false) {
              copyContent[i].enabled = 2;
            }
          }
          // console.log(copyContent);
          updateMemberParamConfig(copyContent).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("修改成功");
              this.getMemberParamConfig();
              this.right_diamond = true;
            } else {
              this.$message.error(res.data.message);
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.pluscontent {
  width: 800px;
  padding: 15px;
  border: 1px solid black;
  .title {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #cccccc;
    padding-bottom: 10px;
  }
  .con {
    margin-top: 15px;
    li {
      margin-top: 15px;
      .inp {
        width: 250px;
      }
    }
  }
}
</style>
