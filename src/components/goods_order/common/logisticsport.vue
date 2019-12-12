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
    <div @click="copyCode"></div>
  </div>
</template>

<script>
import {
  importLogisticsExcel, //引入导入物流信息接口
  getLogisticsExcelTemplet //引入下载模板接口
} from "@/network/api";
export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      chooseFile: "",
      copyContent: "" //需要复制的内容
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
    downtemplate() {
      getLogisticsExcelTemplet().then(res => {
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
      a.setAttribute("download", "商户模板.xls");
      document.body.appendChild(a);
      a.click();
    },
    handleSuccess(e) {
      this.chooseFile = e.target.files[0];
      let filename = this.chooseFile.name;
      // let arr = filename.split(".");
      // if (arr[1] !== ".xls" && arr[1] !== ".xlsx") {
      //   this.$message.error("文件格式错误！");
      //   return;
      // }
      let index = filename.lastIndexOf(".");
      if (index == -1 || index == filename.length) {
        this.$message.error("文件格式错误！"); //文件没有扩展名
        return;
      }
      let suffix = filename.substring(index + 1);
      if (suffix !== "xls" && suffix !== "xlsx") {
        this.$message.error("文件格式错误！");
        return;
      }
      let formData = new FormData();
      formData.append("excel", this.chooseFile);
      importLogisticsExcel(formData).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.dialogVisible = false;
          if (res.data.content.errorList) {
            console.log("导入物流错误");
            for (let i = 0; i < res.data.content.errorList.length; i++) {
              if (res.data.content.errorList[i].errorCode == 1) {
                console.log("订单编号错误");
                this.$alert(
                  `表内订单编号为${res.data.content.errorList[i].orderNumber}的在系统中未找到该订单`,
                  "错误",
                  {
                    confirmButtonText: "复制以上订单编号",
                    callback: action => {
                      this.copyCode(res.data.content.errorList[i].orderNumber);
                    }
                  }
                );
                return;
              } else if (res.data.content.errorList[i].errorCode == 2) {
                console.log("物流公司错误");
                this.$alert(
                  `表内订单编号为${res.data.content.errorList[i].trackingNumber}的物流公司系统中暂无`,
                  "错误",
                  {
                    confirmButtonText: "复制以上订单编号",
                    callback: action => {
                      this.copyCode(
                        res.data.content.errorList[i].trackingNumber
                      );
                    }
                  }
                );
                return;
              }
            }
          }
          this.$message.success(res.data.message);
          // this.$parent.searchEvent
          this.$parent.searchEvent(1);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 复制文本
    copyCode(e) {
      this.$copyText(e).then(
        res => {
          console.log(res);
          this.$message.success("已成功复制，可直接去粘贴");
        },
        err => {
          this.$message.error("复制失败");
        }
      );
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
