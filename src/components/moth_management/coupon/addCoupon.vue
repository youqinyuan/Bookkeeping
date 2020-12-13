<template>
  <div class="addCoupon">
    <el-button type="info" style="width: 120px" @click="goBack">返回</el-button>
    <div class="formBox">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
      >
        <el-form-item label="优惠券类型：" prop="">
          <span v-if="ruleForm.type == '1'" style="color: #606266"
            >新人优惠券</span
          >
          <span v-if="ruleForm.type == '2'" style="color: #606266"
            >通用优惠券</span
          >
          <span v-if="ruleForm.type == '3'" style="color: #606266">提期劵</span>
        </el-form-item>
        <div style="display: flex">
          <el-form-item
            label="支付价格区间："
            prop="amountBegin"
            :rules="rules.amount"
          >
            <el-input
              v-model="ruleForm.amountBegin"
              style="width: 120px"
              :maxlength="6"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="至"
            prop="amountEnd"
            label-width="40px"
            :rules="rules.amount"
          >
            <el-input
              v-model="ruleForm.amountEnd"
              style="width: 120px"
              :maxlength="6"
            ></el-input>
          </el-form-item>
          <el-form-item label="元" prop="" label-width="40px"> </el-form-item>
        </div>
        <el-form-item label="优惠券名称:" prop="name" :rules="rules.name">
          <el-input
            v-model="ruleForm.name"
            style="width: 350px"
            :maxlength="20"
          ></el-input>
        </el-form-item>
        <div style="display: flex" v-if="ruleForm.type != '3'">
          <el-form-item
            label="可用返现区间："
            prop="periodBegin"
            :rules="rules.period"
          >
            <el-input
              v-model="ruleForm.periodBegin"
              style="width: 120px"
              :maxlength="3"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="至"
            prop="periodEnd"
            label-width="40px"
            :rules="rules.period"
          >
            <el-input
              v-model="ruleForm.periodEnd"
              style="width: 120px"
              :maxlength="3"
            ></el-input>
          </el-form-item>
          <el-form-item label="期（月）" prop="" label-width="80px">
          </el-form-item>
        </div>
        <el-form-item
          label="优惠券金额："
          v-if="ruleForm.type != '3'"
          prop="couponAmount"
          :rules="rules.amount"
        >
          <span style="color: #606266; margin-right: 6px">最多减</span>
          <el-input
            v-model="ruleForm.couponAmount"
            style="width: 120px"
            :maxlength="6"
          ></el-input>
          <span style="color: #606266">元（返现最短的情况下）</span>
        </el-form-item>
        <el-form-item
          label="优惠券金额："
          v-if="ruleForm.type == '3'"
          prop="couponRatio"
          :rules="rules.couponRatio"
        >
          <el-input
            v-model="ruleForm.couponRatio"
            style="width: 120px"
          ></el-input>
          <span style="color: #606266">折</span>
        </el-form-item>
        <el-form-item label="优惠券有效期：" prop="">
          <div>
            <el-form-item
              label="自用户领取"
              label-width="90px"
              prop="validDay"
              :rules="rules.validDay"
            >
              <el-input
                v-model="ruleForm.validDay"
                style="width: 80px"
                :maxlength="3"
              ></el-input>
              <span style="color: #606266">天内有效</span>
            </el-form-item>
          </div>
          <div style="margin-top: 20px">
            <el-form-item label="具体日期期限：" label-width="120px" prop="">
              <el-date-picker
                v-model="time"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item
          label="序号："
          prop="orderNo"
          :rules="rules.amount"
          v-if="ruleForm.type == '1'"
        >
          <el-input
            v-model="ruleForm.orderNo"
            style="width: 100px"
            :maxlength="6"
          ></el-input>
        </el-form-item>
        <el-form-item label-width="20px">
          <el-button type="primary" @click="submitForm('ruleForm')"
            >创建完成</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { addOrUpdateCoupon } from "@/network/api";
export default {
  data() {
    const amount = (rule, value, callback) => {
      let a = /^[1-9]\d*$/;
      if (!a.test(value)) {
        callback(new Error("正整数"));
      } else {
        callback();
      }
    };
    const period = (rule, value, callback) => {
      let a = /^(\d+\.\d{1,1}|\d+)$/;
      if (value < 0) {
        callback(new Error("正数"));
      } else if (!a.test(value)) {
        callback(new Error("最多保留1位小数"));
      } else {
        callback();
      }
    };
    const name = (rule, value, callback) => {
      if (!value) {
        callback(new Error("不能为空"));
      } else {
        callback();
      }
    };
    const validDay = (rule, value, callback) => {
      if (!value) {
        return callback();
      }
      let a = /^[1-9]\d*$/;
      if (!a.test(value)) {
        callback(new Error("正整数"));
      } else {
        callback();
      }
    };
    const couponRatio = (rule, value, callback) => {
      let a = /^(\d+\.\d{1,1}|\d+)$/;
      if (value < 0.1 || value > 10) {
        callback(new Error("值区间：0.1-10"));
      } else if (!a.test(value)) {
        callback(new Error("最多保留1位小数"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        name: "",
        type: "", // 优惠券类型
        amountBegin: "",
        amountEnd: "",
        periodBegin: "",
        periodEnd: "",
        couponAmount: "",
        couponRatio: "",
        validDay: "",
        validTimeBegin: "",
        validTimeEnd: "",
        orderNo: "",
      },
      time: "",
      rules: {
        amount: {
          validator: amount,
          trigger: "blur",
        },
        period: {
          validator: period,
          trigger: "blur",
        },
        name: {
          validator: name,
          trigger: "blur",
        },
        validDay: {
          validator: validDay,
          trigger: "blur",
        },
        couponRatio: {
          validator: couponRatio,
          trigger: "blur",
        },
      },
    };
  },
  created() {
    // 优惠券类型：1-新人优惠券，2-通用优惠券，3-提期劵
    this.ruleForm.type = this.$route.query.type;
  },
  methods: {
    // 返回
    goBack() {
      this.$router.replace({
        name: "coupon",
        params: {
          type: this.ruleForm.type,
        },
      });
    },
    // 创建完成
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.time) {
            this.ruleForm.validTimeBegin = this.time[0].getTime();
            this.ruleForm.validTimeEnd = this.time[1].getTime();
          } else {
            this.ruleForm.validTimeBegin = "";
            this.ruleForm.validTimeEnd = "";
          }
          addOrUpdateCoupon(this.ruleForm).then((res) => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("创建成功");
              this.$router.replace({
                name: "coupon",
                params: {
                  type: this.ruleForm.type,
                },
              });
            } else {
              this.$message.error(res.data.message);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.addCoupon {
  padding: 20px;
  box-sizing: border-box;

  .formBox {
    padding: 40px;
    box-sizing: border-box;
  }
}
</style>
