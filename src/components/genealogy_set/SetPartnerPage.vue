<template>
  <div class="setPartnerPage">
    <div class="tips">注意：若上传图片（规定尺寸“UI根据前端给出宽高”）</div>
    <wang-editor class="wangEditor" @catchData="getContent" :content="content" v-if="flag"></wang-editor>
    <el-button type="primary" @click="saveContent">保 存</el-button>
  </div>
</template>

<script>
import wangEditor from "./common/WangEditor.vue";
import { setPage, queryPage } from "@/network/api";
export default {
  data() {
    return {
      content: "",
      flag: false
    };
  },
  components: {
    wangEditor
  },
  created() {
    this.queryPageData();
  },
  methods: {
    // 查询页面设置
    queryPageData() {
      queryPage(`?type=${2}`).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.content = res.data.content.content;
          this.flag = true;
        } else {
          this.flag = true;
          this.$message.error(res.data.message);
        }
      });
    },
    // 接收来自子组件的值
    getContent(data) {
      this.content = data;
    },
    // 点击保存按钮 - 发送富文本给后台
    saveContent() {
      if (this.content == "") {
        this.$message.error("请添加内容");
        return;
      }
      let data = {
        type: 2,
        content: this.content,
        videoFiles: null
      };
      setPage(data).then(res => {
        console.log(res);
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("保存成功");
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.setPartnerPage {
  padding: 20px;
  box-sizing: border-box;
  .tips {
    font-size: 14px;
    color: rgb(87, 172, 241);
  }
  .wangEditor {
    margin: 40px 0px;
  }
}
</style>