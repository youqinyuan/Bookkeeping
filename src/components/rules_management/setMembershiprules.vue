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
            <el-checkbox v-model="money0.enabled">
              <span>1.</span>
              <span>{{money0.key | plusSet}}</span>
              <el-input :disabled="right" class="inp" v-model="money0.value"></el-input>-送1个月
            </el-checkbox>
          </li>
          <li>
            <el-checkbox v-model="money1.enabled">
              <span>2.</span>
              <span>{{money1.key | plusSet}}</span>
              <el-input :disabled="right" class="inp" v-model="money1.value"></el-input>-送1个月
            </el-checkbox>
          </li>
          <li>
            <el-checkbox v-model="money2.enabled">
              <span>3.</span>
              <span>{{money2.key | plusSet}}</span>
              <el-input :disabled="right" class="inp" v-model="money2.value"></el-input>-送1个月
            </el-checkbox>
          </li>
        </ul>
      </div>
      <div class="con" style="border-top:1px solid #ccc;padding-top:10px;">
        <span style="font-weight:bold;font-size:16px;">成为合伙人奖励：</span>
        <div style="margin-top:10px;font-size:14px;">
          <span>下级购买商品返佣商品利润的</span>
          <el-input :disabled="right" v-model="money3.value" style="width:60px;"></el-input>% ，
          <span>特殊情况，无利润商品返佣商品支付金额</span>
          <el-input :disabled="right" v-model="money4.value" style="width:60px;"></el-input>%
        </div>
        <div style="margin-top:10px;font-size:14px;">
          <span>下级缴费成为钻石合伙人奖励</span>
          <el-input :disabled="right" v-model="money5.value" style="width:60px;"></el-input>元
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
          prop="money6.value"
          style="margin-top:10px"
          :rules="[{required: true, pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/, message: '输入值不可为0，不可大于1000000，仅限两位小数', trigger: 'blur'}]"
        >
          <span>缴纳费用</span>
          <el-input style="width:80px;" :disabled="right_diamond" v-model="ruleForm.money6.value"></el-input>
          <span>元-成为一年的钻石合伙人</span>
        </el-form-item>
        <div
          style="font-weight:bold;font-size:16px;border-top:1px solid #ccc;padding-top:10px;"
        >费用返还条件：</div>
        <el-form-item
          label
          prop="money7.value"
          style="margin-top:10px"
          :rules="[{required: true, pattern: /^[1-9]\d*$/, message: '不可为0，不可大于1000000，不可输入小数', trigger: 'blur'}]"
        >
          <div>
            <span>下级用户数量大于等于</span>
            <el-input style="width:80px;" :disabled="right_diamond" v-model="ruleForm.money7.value"></el-input>人
          </div>
        </el-form-item>
        <!-- 成为钻石合伙人奖励 -->
        <div
          style="font-weight:bold;font-size:16px;border-top:1px solid #ccc;padding-top:10px;"
        >成为钻石合伙人奖励：</div>
        <div style="display:flex;margin-top:10px">
          <el-form-item
            label
            prop="money8.value"
            :rules="[{required: true, pattern: /^(\d+\.\d{1,1}|\d+)$/, message: '不可小于1%,不可超过80%,最多输入一位小数', trigger: 'blur'}]"
          >
            <span>下级购买（普通购买）商品返佣商品利润的</span>
            <el-input style="width:80px;" :disabled="right_diamond" v-model="ruleForm.money8.value"></el-input>%
          </el-form-item>
          <el-form-item
            label
            prop="money9.value"
            :rules="[{required: true, pattern: /^(\d+\.\d{1,1}|\d+)$/, message: '不可小于1%,不可超过50%,最多输入一位小数', trigger: 'blur'}]"
          >
            <span>，特殊情况，无利润商品返佣商品支付金额</span>
            <el-input style="width:80px;" :disabled="right_diamond" v-model="ruleForm.money9.value"></el-input>%
          </el-form-item>
        </div>
        <div style="display:flex;">
          <el-form-item
            label
            prop="money10.value"
            label-width="0px;"
            :rules="[{required: true, pattern: /^([1-9]|10)$/, message: '级别最高为10，不可填写小数', trigger: 'blur'}]"
          >
            <span>第</span>
            <el-input
              style="width:80px;"
              :disabled="right_diamond"
              v-model="ruleForm.money10.value"
            ></el-input>
          </el-form-item>
          <el-form-item
            label
            prop="money11.value"
            label-width="0px;"
            :rules="[{required: true, pattern: /^(\d+\.\d{1,1}|\d+)$/, message: '不可小于1%,不可超过100%,最多输入一位小数', trigger: 'blur'}]"
          >
            <span>级购买（普通购买）商品返佣-1级的分佣的</span>
            <el-input
              style="width:80px;"
              :disabled="right_diamond"
              v-model="ruleForm.money11.value"
            ></el-input>%
          </el-form-item>
        </div>
        <el-form-item label prop="name" label-width="0px;">
          <span>下级购买（freebuy购买）商品，返支付金额的</span>
          <el-input style="width:80px;" :disabled="right_diamond" v-model="ruleForm.money12.value"></el-input>%
        </el-form-item>
        <div style="display:flex;">
          <el-form-item
            label
            prop="money13.value"
            label-width="0px;"
            :rules="[{required: true, pattern: /^([1-9]|10)$/, message: '级别最高为10，不可填写小数', trigger: 'blur'}]"
          >
            <span>第</span>
            <el-input
              style="width:80px;"
              :disabled="right_diamond"
              v-model="ruleForm.money13.value"
            ></el-input>
          </el-form-item>
          <el-form-item
            label
            prop="money14.value"
            label-width="0px;"
            :rules="[{required: true, pattern: /^(\d+\.\d{1,1}|\d+)$/, message: '不可小于0.1%,不可超过25%,最多输入一位小数', trigger: 'blur'}]"
          >
            <span>级购买（freebuy购买）商品，返支付金额的</span>
            <el-input
              style="width:80px;"
              :disabled="right_diamond"
              v-model="ruleForm.money14.value"
            ></el-input>%
          </el-form-item>
        </div>
        <el-form-item
          label
          prop="money15.value"
          label-width="0px;"
          :rules="[{required: true, pattern: /^\+?[1-9]\d*$/, message: '大于0的正整数', trigger: 'blur'}]"
        >
          <span>下级缴费成为钻石合伙人奖励</span>
          <el-input style="width:80px;" :disabled="right_diamond" v-model="ruleForm.money15.value"></el-input>元
        </el-form-item>
        <div style="display:flex;">
          <el-form-item
            label
            prop="money16.value"
            label-width="0px;"
            :rules="[{required: true, pattern: /^\+?[0-9]\d*$/, message: '正整数最大100000元', trigger: 'blur'}]"
          >
            <span>送freebuy下单</span>
            <el-input
              style="width:80px;"
              :disabled="right_diamond"
              v-model="ruleForm.money16.value"
            ></el-input>
          </el-form-item>
          <el-form-item
            label
            prop="money17.value"
            label-width="0px;"
            :rules="[{required: true, pattern: /^\+?[0-9]\d*$/, message: '正整数最大200次', trigger: 'blur'}]"
          >
            <span>元购物金，使用次数</span>
            <el-input
              style="width:80px;"
              :disabled="right_diamond"
              v-model="ruleForm.money17.value"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label prop="name" label-width="0px;">
          <span>freebuy下单的商品支付金额打折</span>
          <el-input style="width:80px;" :disabled="right_diamond" v-model="ruleForm.money18.value"></el-input>%
        </el-form-item>
        <el-form-item label prop="name" label-width="0px;">
          <span>下级转让待返金额提取手续费的</span>
          <el-input style="width:80px;" :disabled="right_diamond" v-model="ruleForm.money19.value"></el-input>%
        </el-form-item>
        <el-form-item label prop="name" label-width="0px;">
          <span>下级购买待返金额提取手续费的</span>
          <el-input style="width:80px;" :disabled="right_diamond" v-model="ruleForm.money20.value"></el-input>%
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
      money0: {
        key: "ORDERS_COUNT",
        value: "",
        enabled: true
      },
      money1: {
        key: "INVITEES_COUNT",
        value: "",
        enabled: true
      },
      money2: {
        key: "RECHARGE_AMOUNT",
        value: "",
        enabled: true
      },
      money3: {
        key: "PLUS_RATE",
        value: "",
        enabled: true
      },
      money4: {
        key: "PLUS_PAYMENT_RATE",
        value: "",
        enabled: true
      },
      money5: {
        key: "PLUS_DIAMOND",
        value: "",
        enabled: true
      },
      ruleForm: {
        money6: {
          key: "PAYMENT_AMOUNT",
          value: "",
          enabled: true
        },
        money7: {
          key: "SUBORDINATES_NUMBER",
          value: "",
          enabled: true
        },
        money8: {
          key: "DIAMOND_RATE ",
          value: "",
          enabled: true
        },
        money9: {
          key: "DIAMOND_PAYMENT_RATE",
          value: "",
          enabled: true
        },
        money10: {
          key: "DIAMOND_LEVEL",
          value: "",
          enabled: true
        },
        money11: {
          key: "DIAMOND_COMMISSION_RATE",
          value: "",
          enabled: true
        },
        money12: {
          key: "DIAMOND_FREE_BUY_RATE",
          value: "",
          enabled: true
        },
        money13: {
          key: "DIAMOND_FREE_BUY_LEVEL",
          value: "",
          enabled: true
        },
        money14: {
          key: "DIAMOND_FREE_BUY_COMMISSION_RATE",
          value: "",
          enabled: true
        },
        money15: {
          key: "DIAMOND_DIAMOND",
          value: "",
          enabled: true
        },
        money16: {
          key: "DIAMOND_FREE_BUY_AMOUNT",
          value: "",
          enabled: true
        },
        money17: {
          key: "DIAMOND_FREE_BUY_FREQUENCY",
          value: "",
          enabled: true
        },
        money18: {
          key: "DIAMOND_DISCOUNT",
          value: "",
          enabled: true
        },
        money19: {
          key: "DIAMOND_TRANSFER_SERVICE_CHARGE",
          value: "",
          enabled: true
        },
        money20: {
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
          this.money0 = result[0];
          this.money1 = result[1];
          this.money2 = result[2];
          this.money3 = result[3];
          this.money4 = result[4];
          this.money5 = result[5];
          this.ruleForm.money6 = result[6];
          this.ruleForm.money7 = result[7];
          this.ruleForm.money8 = result[8];
          this.ruleForm.money9 = result[9];
          this.ruleForm.money10 = result[10];
          this.ruleForm.money11 = result[11];
          this.ruleForm.money12 = result[12];
          this.ruleForm.money13 = result[13];
          this.ruleForm.money14 = result[14];
          this.ruleForm.money15 = result[15];
          this.ruleForm.money16 = result[16];
          this.ruleForm.money17 = result[17];
          this.ruleForm.money18 = result[18];
          this.ruleForm.money19 = result[19];
          this.ruleForm.money20 = result[20];
        }
      });
    },

    // 合伙人保存
    save() {
      if (this.money5.value < 0) {
        this.$message.error("下级缴费成为钻石合伙人奖励不可小于0元");
        return;
      }
      this.content1[0] = this.money0;
      this.content1[1] = this.money1;
      this.content1[2] = this.money2;
      this.content1[3] = this.money3;
      this.content1[4] = this.money4;
      this.content1[5] = this.money5;
      let copyContent = JSON.parse(JSON.stringify(this.content1));
      for (var i = 0; i < copyContent.length; i++) {
        if (copyContent[i].enabled == true) {
          copyContent[i].enabled = 1;
        } else if (copyContent[i].enabled == false) {
          copyContent[i].enabled = 2;
        }
      }
      console.log(copyContent);
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
          if (this.ruleForm.money6.value > 1000000) {
            this.$message.error("缴纳费用不可大于1000000");
            return;
          }
          if (this.ruleForm.money7.value > 1000000) {
            this.$message.error("下级用户数量不可大于1000000");
            return;
          }
          if (
            this.ruleForm.money8.value > 80 ||
            this.ruleForm.money8.value < 1
          ) {
            this.$message.error(
              "下级购买（普通购买）商品返佣商品利润不可小于1%,不可超过80%"
            );
            return;
          }
          if (
            this.ruleForm.money9.value > 50 ||
            this.ruleForm.money9.value < 1
          ) {
            this.$message.error(
              "下级购买（普通购买）商品(无利润商品返佣商品支付金额)不可小于1%不可超过50%"
            );
            return;
          }
          if (
            this.ruleForm.money11.value > 100 ||
            this.ruleForm.money11.value < 1
          ) {
            this.$message.error(
              "购买（普通购买）商品返佣-1级的分佣不可小于1%不可高于100%"
            );
            return;
          }
          if (
            this.ruleForm.money12.value > 50 ||
            this.ruleForm.money12.value < 1
          ) {
            this.$message.error(
              "下级购买（freebuy购买）商品，返支付金额不可小于1%，不可高于50%"
            );
            return;
          }
          if (
            this.ruleForm.money14.value > 25 ||
            this.ruleForm.money14.value < 0.1
          ) {
            this.$message.error(
              "购买（freebuy购买）商品，返支付金额不可小于0.1%，不可高于25%"
            );
            return;
          }
          if (this.ruleForm.money17.value > 200) {
            this.$message.error("使用次数不能超过200次");
            return;
          }
          if (
            this.ruleForm.money18.value > 100 ||
            this.ruleForm.money18.value < 50
          ) {
            this.$message.error(
              "freebuy下单的商品支付金额打折不可小于50%，不可高于100%"
            );
            return;
          }
          if (
            this.ruleForm.money19.value > 100 ||
            this.ruleForm.money19.value < 1
          ) {
            this.$message.error(
              "下级转让待返金额提取手续费不可小于1%，不可高于100%"
            );
            return;
          }
          if (
            this.ruleForm.money20.value > 100 ||
            this.ruleForm.money20.value < 1
          ) {
            this.$message.error(
              "下级购买待返金额提取手续费不可小于1%，不可高于100%"
            );
            return;
          }
          for (let val in this.ruleForm) {
            data.push(this.ruleForm[val]);
          }
          console.log(data);
          let copyContent = JSON.parse(JSON.stringify(data));
          for (var i = 0; i < copyContent.length; i++) {
            if (copyContent[i].enabled == true) {
              copyContent[i].enabled = 1;
            } else if (copyContent[i].enabled == false) {
              copyContent[i].enabled = 2;
            }
          }
          console.log(copyContent);
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
