<template>
  <div class="wxapp">
    <div class="title">模板消息：</div>
    <div class="notice">
      <div class="notice_btn">
        <span>申请成功提醒：</span>
        <el-button type="primary" @click="dialogFormVisible = true">设置发送内容</el-button>
      </div>
      <div class="noticeContent">{{remark}}</div>
    </div>
    <!-- 设置发送内容弹框 -->
    <el-dialog :visible.sync="dialogFormVisible" width="560px" :close-on-click-modal="false">
      <el-form :model="formData">
        <el-form-item label="选择商品：" label-width="100">
          <el-input
            v-model="formData.goodsId"
            auto-complete="off"
            style="width:140px;"
            placeholder="请输入商品id"
          ></el-input>
        </el-form-item>
        <el-form-item label="输入备注：" label-width="100">
          <el-input style="width:400px;" type="textarea" v-model="formData.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { findNoticeSet, updateNoticeSet } from "@/network/api";
export default {
  data() {
    return {
      dialogFormVisible: false, // 是否显示设置发送内容弹框
      formData: {
        id: "",
        type: 1,
        goodsId: "",
        remark: ""
      }, //请求回来的页面数据
      remark: ""
    };
  },
  created() {
    this.findNoticeSet();
  },
  methods: {
    findNoticeSet() {
      findNoticeSet(`?type=${1}`).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          if (res.data.content) {
            this.formData = res.data.content;
            this.remark = res.data.content.remark;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 保存
    submit() {
      console.log(this.formData);
      let a = /^\+?[0-9][0-9]*$/;
      if (!a.test(this.formData.goodsId)) {
        this.$message.warning("请输入正确格式的商品id");
        return;
      }
      updateNoticeSet(this.formData).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("保存成功");
          this.findNoticeSet();
          this.dialogFormVisible = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.wxapp {
  padding: 20px;
  .title {
    font-weight: bold;
    width: 100%;
  }
  .notice {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #000;
    margin-top: 20px;
  }
  .notice_btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: bold;
  }
  .noticeContent {
    width: 100%;
    margin-top: 10px;
    word-wrap: break-word;
    word-break: normal;
    line-height: 1.5;
  }
}
</style>