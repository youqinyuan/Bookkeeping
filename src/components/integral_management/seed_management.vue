<template>
  <div class="seed_management">
    <el-form :model="form" :rules="rules" ref="form">
      <div class="title">用户获取种子规则：</div>
      <div style="display:flex">
        <el-form-item prop="POST_SEND_SEED">
          <span>1、发布帖子赠送用户</span>
          <el-input v-model="form.POST_SEND_SEED" style="width:100px;"></el-input>
          <span>种子；单日最高上限</span>
        </el-form-item>
        <el-form-item prop="DAY_OF_POST_SEND_SEED">
          <el-input v-model="form.DAY_OF_POST_SEND_SEED" style="width:100px;"></el-input>
          <span>种子</span>
        </el-form-item>
      </div>
      <el-form-item prop="SIGN_SEND_SEED">
        <span>2、签到赠送用户</span>
        <el-input v-model="form.SIGN_SEND_SEED" style="width:100px;"></el-input>
        <span>种子</span>
      </el-form-item>
      <el-form-item prop="BALANCE_SEND_SEED">
        <span>3、余额年化率送种子</span>
        <el-input v-model="form.BALANCE_SEND_SEED" style="width:100px;"></el-input>
        <span>%</span>
      </el-form-item>
      <div style="display:flex">
        <el-form-item prop="TRANS_SEND_SEED">
          <span>4、Freebuy待返合约转让成功赠送</span>
          <el-input v-model="form.TRANS_SEND_SEED" style="width:100px;"></el-input>
          <span>种子；单日最高上限</span>
        </el-form-item>
        <el-form-item prop="DAY_OF_TRANS_SEND_SEED">
          <el-input v-model="form.DAY_OF_TRANS_SEND_SEED" style="width:100px;"></el-input>
          <span>种子</span>
        </el-form-item>
      </div>
      <!-- <el-form-item label>
        <span>5、购买商品赠送积分</span>
        <el-input v-model="form.name" style="width:100px;"></el-input>
      </el-form-item>
      <div class="title">用户消耗种子规则：</div>
      <el-form-item label>
        <span>1、购物时订单可抵扣金额</span>
        <el-input v-model="form.name" style="width:100px;"></el-input>
      </el-form-item>-->
      <div class="title">种子汇率：</div>
      <el-form-item prop="VALUE_OF_SEED">
        <span>1、在抵扣时，一元与</span>
        <el-input v-model="form.VALUE_OF_SEED" style="width:100px;"></el-input>
        <span>种子等值</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getSeedParamConfig, updateSeedParamConfig } from "@/network/api";
export default {
  data() {
    return {
      form: {
        POST_SEND_SEED: "",
        DAY_OF_POST_SEND_SEED: "",
        SIGN_SEND_SEED: "",
        BALANCE_SEND_SEED: "",
        TRANS_SEND_SEED: "",
        DAY_OF_TRANS_SEND_SEED: "",
        VALUE_OF_SEED: ""
      },
      rules: {
        POST_SEND_SEED: [
          {
            required: true,
            pattern: /^[1-9]\d*$/,
            message: "请输入正整数",
            trigger: "blur"
          }
        ],
        DAY_OF_POST_SEND_SEED: [
          {
            required: true,
            pattern: /^[1-9]\d*$/,
            message: "请输入正整数",
            trigger: "blur"
          }
        ],
        SIGN_SEND_SEED: [
          {
            required: true,
            pattern: /^[1-9]\d*$/,
            message: "请输入正整数",
            trigger: "blur"
          }
        ],
        DAY_OF_TRANS_SEND_SEED: [
          {
            required: true,
            pattern: /^[1-9]\d*$/,
            message: "请输入正整数",
            trigger: "blur"
          }
        ],
        TRANS_SEND_SEED: [
          {
            required: true,
            pattern: /^[1-9]\d*$/,
            message: "请输入正整数",
            trigger: "blur"
          }
        ],
        VALUE_OF_SEED: [
          {
            required: true,
            pattern: /^[1-9]\d*$/,
            message: "请输入正整数",
            trigger: "blur"
          }
        ],
        BALANCE_SEND_SEED: [
          {
            required: true,
            pattern: /^(\d{1,2}(\.\d{1,2})?|100)$/,
            message: "请输入0-100之间的数值",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getSeedParamConfig();
  },
  methods: {
    // 获取种子设置
    getSeedParamConfig() {
      getSeedParamConfig().then(res => {
        if (res.data.messageCode == "MSG_1001") {
          if (res.data.content) {
            let keyArr = Object.keys(this.form);
            let result = res.data.content;
            keyArr.forEach(item => {
              result.forEach(ite => {
                if (item == ite.key) {
                  this.form[item] = ite.value;
                }
              });
            });
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 保存
    onSubmit(formName) {
      console.log(this.form);
      this.$refs[formName].validate(valid => {
        if (valid) {
          let form = this.form;
          if (
            Number(form.DAY_OF_POST_SEND_SEED) < Number(form.POST_SEND_SEED)
          ) {
            this.$message.error("发帖赠送用户种子数不能大于单日最高上限");
            return;
          }
          if (
            Number(form.DAY_OF_TRANS_SEND_SEED) < Number(form.TRANS_SEND_SEED)
          ) {
            this.$message.error(
              "Freebuy待返合约转让赠送种子数不能大于单日最高上限"
            );
            return;
          }
          let arr = [
            { key: "POST_SEND_SEED", value: form.POST_SEND_SEED, enabled: 1 },
            {
              key: "DAY_OF_POST_SEND_SEED",
              value: form.DAY_OF_POST_SEND_SEED,
              enabled: 1
            },
            { key: "SIGN_SEND_SEED", value: form.SIGN_SEND_SEED, enabled: 1 },
            {
              key: "BALANCE_SEND_SEED",
              value: form.BALANCE_SEND_SEED,
              enabled: 1
            },
            {
              key: "TRANS_SEND_SEED",
              value: form.TRANS_SEND_SEED,
              enabled: 1
            },
            {
              key: "DAY_OF_TRANS_SEND_SEED",
              value: form.DAY_OF_TRANS_SEND_SEED,
              enabled: 1
            },
            { key: "VALUE_OF_SEED", value: form.VALUE_OF_SEED, enabled: 1 }
          ];
          updateSeedParamConfig(arr).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("修改成功");
              this.getSeedParamConfig();
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
<style scoped>
.seed_management {
  padding: 20px;
  box-sizing: border-box;
}
.title {
  font-size: 16px;
  font-weight: bolder;
  padding-top: 20px;
  padding-bottom: 10px;
}
</style>