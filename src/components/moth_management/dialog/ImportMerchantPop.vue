<template>
  <div>
    <el-dialog title :visible.sync="dialogVisible" width="30%" center>
      <div class="content">
        <el-button type="primary" @click="downtemplate">下载模板</el-button>
        <div class="file">
          直接导入
          <input type="file" @change="handleSuccess($event)" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getExcelTemplet_floating,
  importMerchantForExcel
} from "@/network/api";
export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      chooseFile: ""
    };
  },
  components: {},
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    open() {
      this.dialogVisible = true;
    },
    // 获取导入用户模板
    downtemplate() {
      getExcelTemplet_floating().then(res => {
        this.download(res);
      });
    },
    // 下载文件
    download(data) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data.data]));
      let a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.setAttribute("download", "导入用户模板.xls");
      document.body.appendChild(a);
      a.click();
    },
    handleSuccess(e) {
      this.chooseFile = e.target.files[0];
      let filename = this.chooseFile.name;
      let arr = filename.split(".");
      if (arr[1] !== "xls" && arr[1] !== "xlsx") {
        this.$message.error("文件格式错误！");
        return;
      }
      this.$emit("func", this.chooseFile);
      this.dialogVisible = false;
    }
  }
};
</script>

<style scoped lang="less">
.content {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.file {
  position: relative;
  display: inline-block;
  background: #d0eeff;
  border: 1px solid #99d3f5;
  border-radius: 4px;
  padding: 4px 12px;
  overflow: hidden;
  color: #1e88c7;
  text-decoration: none;
  text-indent: 0;
  line-height: 30px;
  margin-left: 15px;
}
.file input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
}
.file:hover {
  background: #aadffd;
  border-color: #78c3f3;
  color: #004974;
  text-decoration: none;
}
</style>
