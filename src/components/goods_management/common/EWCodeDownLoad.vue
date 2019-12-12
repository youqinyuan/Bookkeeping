<template>
  <div class="code">
    <el-dialog title :visible.sync="isCode" width="30%" center>
      <div class="btnWrap">
        <el-button type="primary" @click="downLoad_upper">线上二维码下载</el-button>
      </div>
      <div class="btnWrap" style="margin-top:30px;">
        <el-button type="success" @click="downLoad_lower">线下二维码下载</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { queryGoodsQRCode } from "@/network/api";
export default {
  data() {
    return {
      isCode: false,
      id: "",
      name: ""
    };
  },
  methods: {
    open(id, name) {
      this.id = id;
      this.name = name;
      this.isCode = true;
    },

    // 线上二维码下载
    downLoad_upper() {
      let data = {
        type: 1,
        id: this.id
      };
      queryGoodsQRCode(data).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.download(res.data.content);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 线下二维码下载
    downLoad_lower() {
      let data = {
        type: 2,
        id: this.id
      };
      queryGoodsQRCode(data).then(res => {
        console.log(res);
        if (res.data.messageCode == "MSG_1001") {
          this.download(res.data.content);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 下载文件
    download(data) {
      if (!data) {
        return;
      }
      this.getUrlBase64(data).then(base64 => {
        let a = document.createElement("a");
        a.style.display = "none";
        a.download = this.name;
        a.href = base64;
        document.body.appendChild(a);
        a.click();
      });
    },

    //将要下载的图片链接转换为base64格式，防止发生路由跳转
    getUrlBase64(url) {
      return new Promise(resolve => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        let img = new Image();
        img.crossOrigin = "Anonymous"; //允许跨域
        img.src = url;
        img.onload = function() {
          canvas.height = 300;
          canvas.width = 300;
          ctx.drawImage(img, 0, 0, 300, 300);
          let dataURL = canvas.toDataURL("image/png");
          canvas = null;
          resolve(dataURL);
        };
      });
    }
  }
};
</script>
<style lang="less" scoped>
.btnWrap {
  width: 100%;
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>