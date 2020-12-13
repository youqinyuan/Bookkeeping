<template>
  <div class="getPetal">
    <div>用户获取花瓣规则：</div>
    <div style="margin-top: 20px">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="0px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="1、种子兑换：一个种子与"
          prop="CHANG_SEED_FLOWER"
          label-width="174px"
        >
          <el-input
            v-model="ruleForm.CHANG_SEED_FLOWER"
            style="width: 120px"
          ></el-input>
          <span style="color: #606266"
            >花瓣等值，余额购买汇率与种子直接换算</span
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getFlowerRuleList, updateFlowerRule } from "@/network/api";
export default {
  data() {
    const CHANG_SEED_FLOWER = (rule, value, callback) => {
      let a = /^(\d+\.\d{1,1}|\d+)$/;
      if (value < 0) {
        callback(new Error("不可小于0"));
      } else if (!a.test(value)) {
        callback(new Error("最多保留一位小数"));
      } else {
        callback();
      }
    };
    return {
      id: "",
      ruleForm: {
        CHANG_SEED_FLOWER: "",
      },
      rules: {
        CHANG_SEED_FLOWER: {
          validator: CHANG_SEED_FLOWER,
          trigger: "blur",
        },
      },
    };
  },
  created() {
    this.getFlowerRuleList();
  },
  methods: {
    // 查询
    getFlowerRuleList() {
      getFlowerRuleList().then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.ruleForm.CHANG_SEED_FLOWER = content[0].value;
          this.id = content[0].id;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 保存
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let parms = [];
          for (let key in this.ruleForm) {
            let obj = {
              id: this.id,
              key: key,
              value: this.ruleForm[key],
            };
            parms.push(obj);
          }
          updateFlowerRule(parms).then((res) => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("保存成功");
              this.getFlowerRuleList();
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
.getPetal {
  padding: 20px;
  box-sizing: border-box;
}
</style>
