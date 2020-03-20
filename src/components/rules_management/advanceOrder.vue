<template>
  <div class="advanceOrder">
    <div class="top">
      <span>预售订单服务设置</span>
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
    </div>
    <div class="formBox">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="预售订单违约金最低为" required prop label-width="170px">
          <el-col style="width:180px;">
            <el-form-item prop="ADVANCE_ORDER_LIQUIDATED_DAMAGE_MIN">
              <el-input style="width:100px;" v-model="ruleForm.ADVANCE_ORDER_LIQUIDATED_DAMAGE_MIN"></el-input>&nbsp;&nbsp;元，最高为
            </el-form-item>
          </el-col>
          <el-col style="width:190px;">
            <el-form-item prop="ADVANCE_ORDER_LIQUIDATED_DAMAGE_MAX">
              <el-input style="width:100px;" v-model="ruleForm.ADVANCE_ORDER_LIQUIDATED_DAMAGE_MAX"></el-input>&nbsp;元。
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item
          label="订单支付后无人购买超过"
          required
          prop="ADVANCE_ORDER_PAID_AUTO_CANCEL_DATE"
          label-width="182px"
        >
          <el-input style="width:80px;" v-model="ruleForm.ADVANCE_ORDER_PAID_AUTO_CANCEL_DATE"></el-input>&nbsp;&nbsp;天后订单自动取消，注：情况多数发生于卖方订单一直无人购买。
        </el-form-item>
        <el-form-item
          label="买卖双方支付违约金后对方支付尾款超过"
          required
          prop="ADVANCE_ORDER_AMOUNT_PAY_EXPIRE_DATE"
          label-width="280px"

        >
          <el-input style="width:80px;" v-model="ruleForm.ADVANCE_ORDER_AMOUNT_PAY_EXPIRE_DATE"></el-input>&nbsp;&nbsp;小时订单自动取消，注：订单取消后违约金将补偿给予未违约方。
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  getAdvanceOrderParamConfig,
  updateAdvanceOrderParamConfig
} from "@/network/api";
export default {
  data() {
    const a = (rule, value, callback) => {
      if (value < 1 || value > 10000000) {
        callback(new Error("值区间为：1-10000000"));
      } else {
        callback();
      }
    };
    const b = (rule, value, callback) => {
      if (value < 1 || value > 180) {
        callback(new Error("值区间为：1-180"));
      } else {
        callback();
      }
    };
    const c = (rule, value, callback) => {
      if (value < 1 || value > 720) {
        callback(new Error("值区间为：1-720"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        ADVANCE_ORDER_LIQUIDATED_DAMAGE_MIN: "",
        ADVANCE_ORDER_LIQUIDATED_DAMAGE_MAX: "",
        ADVANCE_ORDER_PAID_AUTO_CANCEL_DATE: "",
        ADVANCE_ORDER_AMOUNT_PAY_EXPIRE_DATE: ""
      },
      rules: {
        ADVANCE_ORDER_LIQUIDATED_DAMAGE_MIN: [
          {
            required: true,
            pattern: /^-?\d+(\.\d{1,1})?$/,
            message: "数字,小数点后最多1位",
            trigger: "blur"
          },
          {
            required: true,
            validator: a,
            trigger: "blur"
          }
        ],
        ADVANCE_ORDER_LIQUIDATED_DAMAGE_MAX: [
          {
            required: true,
            pattern: /^-?\d+(\.\d{1,1})?$/,
            message: "数字,小数点后最多1位",
            trigger: "blur"
          },
          {
            required: true,
            validator: a,
            trigger: "blur"
          }
        ],
        ADVANCE_ORDER_PAID_AUTO_CANCEL_DATE: [
          {
            required: true,
            pattern: /^-?[0-9]\d*$/,
            message: "格式为整数",
            trigger: "blur"
          },
          {
            required: true,
            validator: b,
            trigger: "blur"
          }
        ],
        ADVANCE_ORDER_AMOUNT_PAY_EXPIRE_DATE: [
          {
            required: true,
            pattern: /^-?[0-9]\d*$/,
            message: "格式为整数",
            trigger: "blur"
          },
          {
            required: true,
            validator: c,
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getAdvanceOrderParamConfig();
  },
  methods: {
    // 获取规则数据
    getAdvanceOrderParamConfig() {
      getAdvanceOrderParamConfig().then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let data = res.data.content;
          console.log(data);
          let form = this.ruleForm;
          for (let val in form) {
            data.forEach(ele => {
              if (val == ele.key) {
                form[val] = ele.value;
              }
            });
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let form = this.ruleForm;
          if (
            Number(form.ADVANCE_ORDER_LIQUIDATED_DAMAGE_MIN) >
            Number(form.ADVANCE_ORDER_LIQUIDATED_DAMAGE_MAX)
          ) {
            this.$message.error("请检查输入框是否输入正确");
            return;
          }
          updateAdvanceOrderParamConfig(form).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("保存成功");
              this.getAdvanceOrderParamConfig();
            } else {
              this.$message.error(res.data.message);
            }
          });
        } else {
          // this.$message.error("请检查输入框是否输入正确");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.advanceOrder {
  padding: 20px;
  box-sizing: box-border;
  .top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    padding-bottom: 5px;
    box-sizing: border-box;
    border-bottom: 1px solid #333;
    margin-bottom: 20px;
  }
}
</style>
<style lang="less">
// 修改form表单label颜色
.advanceOrder {
  .el-form-item__label {
    color: #000;
  }
}
</style>