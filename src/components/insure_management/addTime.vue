<template>
  <div class="addTime">
    <h3>增加保险时长：</h3>
    <div class="item">
      <span>增加性质：</span>
      <el-radio-group v-model="form.resource">
        <el-radio-button label="1">购买</el-radio-button>
        <el-radio-button label="2">赠送</el-radio-button>
      </el-radio-group>
    </div>
    <div class="item">
      <span>增加时长：</span>
      <el-input v-model="form.increaseTime" style="width: 100px"></el-input>
      <span>月</span>
    </div>
    <div class="item">
      <span>赠送人：</span>
      <el-radio v-model="name" label="1">指定用户</el-radio>
      <div class="subItem">
        <el-input
          type="textarea"
          :rows="6"
          placeholder="输入手机号用,隔开即可"
          v-model="form.mobileNumber"
          style="width: 800px"
        >
        </el-input>
      </div>
    </div>
    <div class="item">
      <el-button type="success" @click="back">返回上一页</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </div>
  </div>
</template>
<script>
import { addInsurance } from "@/network/api";
export default {
  data() {
    return {
      name: "1",
      form: {
        resource: "1",
        increaseTime: "",
        mobileNumber: "",
      },
    };
  },
  created() {},
  methods: {
    // 保存
    submitForm() {
      let form = this.form;
      if (!form.increaseTime) {
        this.$message.error("增加时长不能为空");
        return;
      }
      if (form.increaseTime < 1) {
        this.$message.error("增加时长不能小于1");
        return;
      }
      if (form.increaseTime > 100000) {
        this.$message.error("增加时长不能大于100000");
        return;
      }
      let a = /^[0-9]\d*$/;
      if (!a.test(form.increaseTime)) {
        this.$message.error("增加时长只能为整数");
        return;
      }
      if (!form.mobileNumber) {
        this.$message.error("手机号不能为空");
        return;
      }
      if (form.mobileNumber.indexOf("，") != -1) {
        this.$message.error("多个手机号之间请使用英文逗号隔开");
        return;
      }
      addInsurance(form).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("操作成功");
          this.$router.go("-1");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 返回上一页
    back() {
      this.$router.go("-1");
    },
  },
};
</script>
<style lang="less" scoped>
.addTime {
  padding: 20px;
  box-sizing: border-box;
  .item {
    margin-top: 40px;
    .subItem {
      margin-left: 65px;
      margin-top: 20px;
    }
  }
}
</style>