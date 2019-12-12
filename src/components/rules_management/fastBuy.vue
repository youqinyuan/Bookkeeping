<template>
  <div class="contents">
    <div class="merchant">
      <div class="title">
        <span>快速分期购设置:</span>
        <span class="xg" @click="revise" v-if="right">修改</span>
        <span class="xg" v-else @click="save('ruleForm')">保存</span>
      </div>
      <div class="con">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px">
          <el-form-item label="公司回报年利率" prop="PLAT_RETURN_RATIO">
            <el-input style="width:250px" :disabled="disabled" v-model="ruleForm.PLAT_RETURN_RATIO"></el-input>
            <span>%</span>
          </el-form-item>
          <el-form-item label="通用成本调控比例" prop="COST_CONTROL_RATIO">
            <el-input
              style="width:250px"
              :disabled="disabled"
              v-model="ruleForm.COST_CONTROL_RATIO"
            ></el-input>
            <span>%</span>
          </el-form-item>
          <el-form-item label="用户利息比例" prop="USER_INTEREST_RATIO">
            <el-input
              style="width:250px"
              :disabled="disabled"
              v-model="ruleForm.USER_INTEREST_RATIO"
            ></el-input>
            <span>%</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  findFastInstallmentConfig,
  updateFastInstallmentConfig
} from "@/network/api";
export default {
  props: {},
  data() {
    return {
      right: true,
      disabled: true,
      ruleForm: {
        PLAT_RETURN_RATIO: "",
        COST_CONTROL_RATIO: "",
        USER_INTEREST_RATIO: ""
      },
      rules: {
        PLAT_RETURN_RATIO: [
          { required: true, message: "不能为空", trigger: "change" },
          {
            pattern: /^([1-9]|[1-9]\d|1\d{1}|100)$/,
            message: "仅限输入1-100",
            trigger: "change"
          }
        ],
        COST_CONTROL_RATIO: [
          { required: true, message: "不能为空", trigger: "change" },
          {
            pattern: /^-?(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
            message: "-100到+100最多保留两位小数",
            trigger: "change"
          }
        ],
        USER_INTEREST_RATIO: [
          { required: true, message: "不能为空", trigger: "change" },
          {
            pattern: /^(((\d|[1-9]\d)(\.\d{1,2})?)|100|100.0|100.00)$/,
            message: "仅输入0-100，仅限输入两位小数",
            trigger: "change"
          }
        ]
      }
    };
  },
  components: {},
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.findFastInstallmentConfig();
  },
  methods: {
    findFastInstallmentConfig() {
      findFastInstallmentConfig().then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let keyArr = Object.keys(this.ruleForm);
          let result = res.data.content;
          keyArr.forEach(item => {
            result.forEach(ite => {
              if (item == ite.key) {
                this.ruleForm[item] = ite.value;
              }
            });
          });
        }
      });
    },
    revise() {
      this.right = false;
      this.disabled = false;
    },
    save(formName) {
      console.log(this.ruleForm)
      this.$refs[formName].validate(valid => {
        if (valid) {
          let COST_CONTROL_RATIO = this.ruleForm.COST_CONTROL_RATIO;
          if (COST_CONTROL_RATIO < -100 || COST_CONTROL_RATIO > 100) {
            this.$message.error("成本调控比例只能输入-100到+100之间且最多保留两位小数");
            return;
          }
          updateFastInstallmentConfig(this.ruleForm).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("修改成功");
              this.right = true;
              this.disabled = true;
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
.merchant {
  width: 600px;
  padding: 15px;
  border: 1px solid black;
  .title {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #cccccc;
    padding-bottom: 10px;
    .xg {
      color: #169bd5;
      cursor: pointer;
    }
  }
  .con {
    margin-top: 15px;
  }
}
</style>
