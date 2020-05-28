<template>
  <div class="content">
    <div class="editorArea">
      <div class="editorBox">
        <wang-editor @catchData="getContent" :content="content" v-if="flag"></wang-editor>
      </div>
      <div class="previewBox">
        <h3>预览页</h3>
        <div class="preview" v-html="content">{{content}}</div>
      </div>
    </div>
    <el-button type="primary" style="margin-top:30px;" @click="updateGuidePage">保存发布</el-button>
  </div>
</template>
<script>
import wangEditor from "../../genealogy_set/common/WangEditor";
import { getGuidePage, updateGuidePage } from "@/network/api";
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
    this.getGuidePage();
  },
  methods: {
    // 查询页面设置
    getGuidePage() {
      getGuidePage().then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.content = res.data.content.content;
          this.flag = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 接收来自子组件的值
    getContent(data) {
      this.content = data;
    },
    // 保存发布
    updateGuidePage() {
      let parms = {
        content: this.content
      };
      updateGuidePage(this.qs.stringify(parms)).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.getGuidePage();
          this.$message.success("保存成功");
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.editorArea {
  width: 100%;
  display: flex;
  .editorBox {
    width: 600px;
    margin-right: 120px;
    margin-top: 24px;
  }
  .previewBox {
    width: 375px;
    height:700px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .preview {
      width: 100%;
      height: 100%;
      border: 1px solid #666;
      overflow: auto;
    }
  }
}
</style>