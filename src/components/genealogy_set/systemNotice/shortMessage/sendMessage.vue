<template>
  <div class="sendMessage">
    <div style="margin-top:20px;">
      <span>短信模板选择：</span>
      <el-input v-model="templateContent" style="width:340px;" @focus="selectMb(1)" readonly></el-input>
    </div>
    <div style="margin-top:20px;">填写发送人手机号（手机号之间用英文,隔开）：</div>
    <div style="margin-top:10px;">
      <textarea v-model="mobileNumber" style="width:420px;height:400px;"></textarea>
    </div>
    <el-button
      type="primary"
      style="width:140px;margin-left:130px;margin-top:20px;"
      @click="send"
    >发送</el-button>

    <!-- 引入模板弹窗短信 -->
    <temp ref="temp" @func="getTemp"></temp>
  </div>
</template>
<script>
import { addOrUpdateTemplate } from "@/network/api";
import temp from "./template";
export default {
  data() {
    return {
      templateId: "",
      templateContent: "",
      mobileNumber: ""
    };
  },
  components: {
    temp
  },
  created() {},
  methods: {
    // 打开选择模板弹窗
    selectMb() {
      this.$refs.temp.open(1);
    },
    // 获取模板内容
    getTemp(id, content) {
      this.templateId = id;
      this.templateContent = content;
    },
    // 发送
    send() {
      if (!this.templateId) {
        this.$message.error("请先选择短信模板");
        return;
      }
      if (!this.mobileNumber) {
        this.$message.error("请填写发送人手机号");
        return;
      }
      if (this.mobileNumber.indexOf("，") != -1) {
        this.$message.error("手机号内容格式有误");
        return;
      }
      let parms = {
        templateId: this.templateId,
        mobileNumber: this.mobileNumber
      };
      addOrUpdateTemplate(parms).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("发送成功");
          this.templateId = "";
          this.templateContent = "";
          this.mobileNumber = "";
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.sendMessage {
  font-size: 16px;
  .radioGroup {
    width: 100%;
    .radioItem {
      width: 100%;
      margin-top: 20px;
      display: flex;
      cursor: pointer;
      div {
        margin-left: 10px;
      }
    }
  }
  .totalBox {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>