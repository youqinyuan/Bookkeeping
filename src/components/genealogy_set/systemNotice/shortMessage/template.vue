<template>
  <div class="template">
    <el-dialog
      title="请选择短信模板"
      :visible.sync="templateDialog"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="radioGroup">
        <div
          class="radioItem"
          v-for="(item,index) in templatePageList"
          :key="index"
          @click="radioChange(item.id,item.content)"
        >
          <i class="el-icon-success" style="color:#409EFF;" v-if="item.id == templateId"></i>
          <i class="el-icon-circle-check" v-else></i>
          <div>{{item.content}}</div>
        </div>
      </div>
      <div class="totalBox">
        <span>总计：{{templatePageSize}}条</span>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="templatePageSize"
          :page-size="10"
          :current-page.sync="currentPage"
          @current-change="pageChange($event)"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { findTemplatePageList } from "@/network/api";
export default {
  data() {
    return {
      templateDialog: false,
      templateId: "",
      templatePageList: [],
      templatePageSize: 0,
      currentPage: 1
    };
  },
  created() {},
  methods: {
    // 打开模板弹窗
    open(val) {
      let parms = {
        pageNumber: val,
        pageSize: 10
      };
      findTemplatePageList().then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.templatePageList = content.items;
          this.templatePageSize = content.totalSize;
          this.templateDialog = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 模板radio改变事件
    radioChange(id, content) {
      this.templateId = id;
      this.$emit("func", id, content);
      this.templateDialog = false;
    },
    // dialog翻页
    pageChange(val) {
      this.currentPage = val;
      this.search(val);
    }
  }
};
</script>
<style lang="less" scoped>
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
</style>