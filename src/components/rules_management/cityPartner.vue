<template>
  <div class="cityPartner">
    <div class="box">
      <div class="title">
        <span>代理商规则设置：</span>
        <el-button type="primary" @click="disabled = false" v-if="disabled">修改</el-button>
        <el-button type="primary" v-else @click="submit">保存</el-button>
      </div>
      <div class="content">
        <div style="margin-top:20px;">
          <span>最多代理区域个数：</span>
          <el-input v-model="number.value" style="width:80px;" :disabled="disabled"></el-input>
        </div>
        <div style="margin-top:20px;">
          <span>占商家商品利润的</span>
          <el-input v-model="money.value" style="width:80px;" :disabled="disabled"></el-input>%
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getAgentParamConfig, updateAgentParamConfig } from "@/network/api";
export default {
  data() {
    return {
      disabled: true,
      number: {
        key: "MAN_REGION_NUMBER",
        value: "",
        enabled: 1
      },
      money: {
        key: "PROFIT_RATE",
        value: "",
        enabled: 1
      },
      pageData: []
    };
  },
  created() {
    this.getAgentParamConfig();
  },
  beforeRouteLeave(to, from, next) {
    if (!this.disabled) {
      this.$confirm("内容未保存，需要保存吗?", "提示", {
        confirmButtonText: "保存",
        cancelButtonText: "不用保存",
        type: "warning"
      })
        .then(() => {
          let number = this.number.value;
          let money = this.money.value;
          let a = /^\d+$/;
          let b = /^\d+(\.\d{1,2})?$/;
          if (!a.test(number) || number < 1 || number > 10) {
            this.$message.error(
              "代理区域个数不可填写小数，最大不可大于10，不可小于1。"
            );
            return;
          }
          if (!b.test(money) || money > 80 || money < 1) {
            this.$message.error(
              "商品利润最多两位小数，最大可填写80，最小不可小于1"
            );
            return;
          }
          this.pageData[0] = this.money;
          this.pageData[1] = this.number;
          updateAgentParamConfig(this.pageData).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("保存成功");
              next();
              this.disabled = true;
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {
          next();
        });
      return;
    } else {
      next();
    }
  },
  methods: {
    // 请求页面数据
    getAgentParamConfig() {
      getAgentParamConfig().then(res => {
        console.log(res.data.content);
        if (res.data.messageCode == "MSG_1001") {
          if (res.data.content) {
            this.pageData = res.data.content;
            this.number = res.data.content[0];
            this.money = res.data.content[1];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 保存
    submit() {
      let number = this.number.value;
      let money = this.money.value;
      let a = /^\d+$/;
      let b = /^\d+(\.\d{1,2})?$/;
      if (!a.test(number) || number < 1 || number > 10) {
        this.$message.error(
          "代理区域个数不可填写小数，最大不可大于10，不可小于1。"
        );
        return;
      }
      if (!b.test(money) || money > 80 || money < 1) {
        this.$message.error(
          "商品利润最多两位小数，最大可填写80，最小不可小于1"
        );
        return;
      }
      this.pageData[0] = this.money;
      this.pageData[1] = this.number;
      console.log(this.pageData);
      updateAgentParamConfig(this.pageData).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("保存成功");
          this.getAgentParamConfig();
          this.disabled = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.cityPartner {
  padding: 20px;
  box-sizing: border-box;
  .box {
    width: 600px;
    border: 1px solid #ccc;
    padding: 10px;
    box-sizing: border-box;
    .title {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ccc;
      padding: 10px 0px;
    }
  }
}
</style>