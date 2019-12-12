<template>
  <div class="cashWithdrawal">
    <!-- 提现手续费设置 -->
    <div class="container">
      <div class="title">
        <span>提现手续费设置（暂只针对信用卡充值的余额收费）</span>
        <span class="xg" @click="revise" v-if="right">修改</span>
        <span class="xg" v-else @click="submitForm('formData')">保存</span>
      </div>
      <el-form :model="formData" style="margin-top:10px;" :rules="rules" ref="formData">
        <el-form-item
          label="优惠提现规则："
          prop="freeAmount"
          :rules="{required: true, pattern: /^([0-9]*)$/, message: '仅限输入正整数，最多为7位数', trigger: 'change'}"
        >
          <div>
            每月免费提现额度：
            <el-input
              style="width:100px;"
              :disabled="disabled"
              v-model="formData.freeAmount"
              maxlength="7"
            ></el-input>元
          </div>
        </el-form-item>
        <el-form-item label="收费提现规则1：">
          <el-button type="text" @click="addRule" :disabled="disabled">添加规则</el-button>
          <div v-for="(item,index) in formData.paramList" :key="index" style="margin-top:10px;">
            充值后第{{item.rechargeDay}}天提现手续费比例
            <el-input style="width:80px;" :disabled="disabled" v-model="item.poundageRate"></el-input>%
            <span
              style="margin-left:10px;cursor:pointer"
              v-if="!disabled"
              @click="deleteServiceMoney(index)"
            >
              <i class="el-icon-delete"></i>
            </span>
          </div>
        </el-form-item>
        <el-form-item
          label="收费提现规则2："
          prop="feeForEach"
          :rules="{required: true, pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/, message: '仅限输入数字，最多2位小数，不可大于100', trigger: 'change'}"
        >
          <span>每笔提现收费</span>
          <el-input style="width:80px;" :disabled="disabled" v-model="formData.feeForEach"></el-input>元
        </el-form-item>
      </el-form>
    </div>
    <!-- 待饭转让手续费设置 -->
    <div class="container" style="margin-top:20px;">
      <div class="title">
        <span>待返转让手续费</span>
        <span class="xg" @click="disabled2 = false" v-if="disabled2">修改</span>
        <span class="xg" v-else @click="submitForm2">保存</span>
      </div>
      <div style="margin-top:20px;">
        <span>待返转让手续费修改待返手续费比例：</span>
        <el-input style="width:80px;" :disabled="disabled2" v-model="rateForGoodsCashBackTranser"></el-input>
      </div>
    </div>
  </div>
</template>
<script>
import { queryServiceMoney, addOrUpdateServiceMoney } from "@/network/api";
export default {
  data() {
    return {
      right: true, //是否可以修改内容
      disabled: true,
      disabled2: true,
      formData: {
        freeAmount: "", // 每月免费提现额度
        paramList: [], //收费提现规则1
        feeForEach: "" //每笔提现收费
      },
      rules: {
        freeAmount: [
          { required: true, message: "请输入正确数值", trigger: "blur" }
        ],
        feeForEach: [
          {
            required: true,
            pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/,
            message: "请输入正确数值",
            trigger: "blur"
          }
        ]
      },
      rateForGoodsCashBackTranser: "", // 待返手续费
      id: ""
    };
  },
  created() {
    this.queryServiceMoney();
  },
  methods: {
    // 查询提现手续费
    queryServiceMoney() {
      queryServiceMoney().then(res => {
        if ((res.data.messageCode = "MSG_1001")) {
          if (res.data.content) {
            this.formData = res.data.content;
            this.rateForGoodsCashBackTranser =
              res.data.content.rateForGoodsCashBackTranser;
            this.id = res.data.content.id;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 修改
    revise() {
      this.right = false;
      this.disabled = false;
    },
    // 添加规则
    addRule() {
      let length = this.formData.paramList.length;
      let serviceMoney = this.formData.paramList;
      if (length == 0) {
        this.formData.paramList.push({
          rechargeDay: 1,
          poundageRate: ""
        });
      } else {
        this.formData.paramList.push({
          rechargeDay: serviceMoney[length - 1].rechargeDay + 1,
          poundageRate: ""
        });
      }
    },
    // 删除提现手续费比例
    deleteServiceMoney(index) {
      this.formData.paramList.splice(index, 1);
    },
    // 提现手续费-保存
    submitForm(formName) {
      let length = this.formData.paramList.length;
      let a = /^([0-9][0-9]*)+(.[0-9]{1,2})?$/;
      if (length > 0) {
        for (let item of this.formData.paramList) {
          if (!item.poundageRate && item.poundageRate !== 0) {
            this.$message.warning("提现手续费比例不能为空");
            return;
          }
          if (item.poundageRate > 100) {
            this.$message.warning("提现手续费比例不能大于100");
            return;
          }
          if (!a.test(item.poundageRate)) {
            this.$message.warning(
              "提现手续费比例只能是正整数且最多保留两位小数"
            );
            return;
          }
        }
      }
      if (this.formData.feeForEach > 100) {
        this.$message.warning("每笔提现收费不可大于100");
        return;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          addOrUpdateServiceMoney(this.formData).then(res => {
            if ((res.data.messageCode = "MSG_1001")) {
              this.$message.success("保存成功");
              this.queryServiceMoney();
            } else {
              this.$message.error(res.data.message);
            }
          });
          this.right = true;
          this.disabled = true;
        } else {
          return false;
        }
      });
    },

    // 待返转让手续费-保存
    submitForm2() {
      let returnMoney = this.rateForGoodsCashBackTranser;
      let a = /^\d+(\.\d{1,2})?$/;
      if (!a.test(returnMoney) || returnMoney > 100) {
        this.$message.error("待返转让手续费最多输入两位小数,最高值不可大于100");
        return;
      }
      let data = {
        rateForGoodsCashBackTranser: this.rateForGoodsCashBackTranser,
        id: this.id
      };
      addOrUpdateServiceMoney(data).then(res => {
        if ((res.data.messageCode = "MSG_1001")) {
          this.$message.success("保存成功");
          this.queryServiceMoney();
          this.disabled2 = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.cashWithdrawal {
  padding: 20px;
  .container {
    width: 700px;
    border: 1px solid #000;
    padding: 10px;
    .title {
      width: 100%;
      border-bottom: 1px solid #999;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
    }
  }
}
.xg {
  color: #169bd5;
  cursor: pointer;
  margin-right: 10px;
}
</style>