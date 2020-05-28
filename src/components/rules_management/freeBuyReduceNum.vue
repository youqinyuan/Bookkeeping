<template>
  <div class="freeBuy">
    <div class="top">
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
    </div>
    <div class="formBox">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item
          label="FreeBuy提期帖子有效期为"
          prop="FREE_BUY_MENTION_PERIOD_TERM_OF_VALIDITY"
          label-width="190px"
        >
          <el-input
            style="width:80px;"
            v-model="ruleForm.FREE_BUY_MENTION_PERIOD_TERM_OF_VALIDITY"
            :maxlength="3"
          ></el-input>&nbsp;&nbsp;天
        </el-form-item>
        <el-form-item
          label="购买FreeBuy帖子的年化收益率为"
          prop="FREE_BUY_MENTION_PERIOD_ANNUALIZED_RATE"
          label-width="230px"
        >
          <el-input style="width:80px;" v-model="ruleForm.FREE_BUY_MENTION_PERIOD_ANNUALIZED_RATE"></el-input>&nbsp;&nbsp;%
        </el-form-item>
        <el-form-item
          label="FreeBuy提期支付金额倍数为"
          prop="FREE_BUY_MENTION_PERIOD_MULTIPLE"
          label-width="206px"
        >
          <el-input style="width:80px;" v-model="ruleForm.FREE_BUY_MENTION_PERIOD_MULTIPLE"></el-input>&nbsp;&nbsp;倍
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  getMentionPeriodParamConfig,
  updateMentionPeriodParamConfig
} from "@/network/api";
export default {
  data() {
    const a = (rule, value, callback) => {
      if (value < 0.01 || value > 100) {
        callback(new Error("值区间：0.01-100"));
      } else {
        callback();
      }
    };
    const b = (rule, value, callback) => {
      if (value < 1 || value > 1000) {
        callback(new Error("值区间：1-1000"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        FREE_BUY_MENTION_PERIOD_TERM_OF_VALIDITY: "",
        FREE_BUY_MENTION_PERIOD_ANNUALIZED_RATE: "",
        FREE_BUY_MENTION_PERIOD_MULTIPLE:''
      },
      rules: {
        FREE_BUY_MENTION_PERIOD_TERM_OF_VALIDITY: [
          {
            required: true,
            pattern: /^[1-9]\d*$/,
            message: "整数，必填",
            trigger: "blur"
          }
        ],
        FREE_BUY_MENTION_PERIOD_ANNUALIZED_RATE: [
          {
            required: true,
            pattern: /^\d+(\.\d{1,2})?$/,
            message: "数字，最多两位小数",
            trigger: "blur"
          },
          {
            required: true,
            validator: a,
            trigger: "blur"
          }
        ],
        FREE_BUY_MENTION_PERIOD_MULTIPLE: [
          {
            required: true,
            pattern: /^\d+(\.\d{1,2})?$/,
            message: "数字，最多两位小数",
            trigger: "blur"
          },
          {
            required: true,
            validator: b,
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getMentionPeriodParamConfig();
  },
  methods: {
    // 获取数据
    getMentionPeriodParamConfig() {
      getMentionPeriodParamConfig().then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let data = res.data.content;
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

    // 保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let form = this.ruleForm;
          updateMentionPeriodParamConfig(form).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("保存成功");
              this.getMentionPeriodParamConfig();
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
<style lang="less" scoped>
.freeBuy {
  padding: 20px;
  box-sizing: box-border;
  .top {
    width: 100%;
    display: flex;
    justify-content: flex-end;
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