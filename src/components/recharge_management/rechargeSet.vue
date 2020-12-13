<template>
  <div class="contents">
    <div class="merchant">
      <div class="title">
        <span>充值金额设置:</span>
        <span class="xg" @click="revise" v-if="right">修改</span>
        <span class="xg" v-else @click="save">保存</span>
      </div>
      <div class="con">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px">
          <el-form-item label="每次最低充值金额" prop="value">
            <el-input style="width:160px" :disabled="disabled" v-model="ruleForm.value"></el-input>
            <span>元</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { updateParamConfigMinAmount, getParamConfigByKey } from "@/network/api";
export default {
  props: {},
  data() {
    return {
      right: true,
      disabled: true,
      ruleForm: {
        value: ""
      },
      rules: {
        value: [{ required: true, message: "金额不能为空", trigger: "change" }]
      }
    };
  },
  components: {},
  computed: {},
  watch: {},
  created() {
    this.getRechargeSet();
  },
  mounted() {},
  methods: {
    // 查询设置
    getRechargeSet() {
      let parms = {
        key: "MIN_AMOUNT"
      };
      getParamConfigByKey({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.ruleForm.value = res.data.content.value;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //   修改
    revise() {
      this.right = false;
      this.disabled = false;
    },
    // 保存
    save() {
      let form = this.ruleForm;
      let a = /^([0-9][0-9]*)+(.[0-9]{1,2})?$/;
      if (form.value < 0 || form.value > 10000) {
        this.$message.error("请输入大于0小于10000的数字");
        return;
      }
      if (!a.test(form.value)) {
        this.$message.error("格式不正确");
        return;
      }
      let parms = {
        value: form.value
      };
      updateParamConfigMinAmount(this.qs.stringify(parms)).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.getRechargeSet();
          this.$message.success("设置成功");
          this.right = true;
          this.disabled = true;
        } else {
          this.$message.error(res.data.message);
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
