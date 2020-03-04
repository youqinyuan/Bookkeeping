<template>
  <div class="createQRCode">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="800px"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <div class="btnBox">
        <el-radio-group v-model="type" v-if="showBtn">
          <el-radio :label="1">线下推广渠道</el-radio>
          <el-radio :label="0">线上推广渠道</el-radio>
        </el-radio-group>
        <span style="font-size:16px;" v-if="showTotalNum">
          {{totalNum}}个二维码生成中
          <i style="font-size:16px;" class="el-icon-loading"></i>
        </span>
        <span style="font-size:16px;" v-if="createCodeEnd">生成二维码：{{successNum}}个成功，{{failNum}}个失败</span>
        <el-button type="primary" v-if="showBtn" @click="createCode()">生成商品二维码</el-button>
        <el-button type="primary" v-if="!showBtn" @click="saveCode" :disabled="showTotalNum">批量保存至本地</el-button>
      </div>
      <div class="tableBox">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column prop="goodsId" label="商品编号" width="80" align="center"></el-table-column>
          <el-table-column prop label="商品名称">
            <template slot-scope="scope">
              <div style="display:flex;align-items:center;">
                <img
                  :src="scope.row.imageUrl"
                  v-if="scope.row.imageUrl"
                  style="width:100px;height:100px;flex-shrink:0;"
                />
                <span>{{scope.row.name}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop label="商品二维码" width="120" v-if="createCodeEnd">
            <template slot-scope="scope">
              <img :src="scope.row.url" v-if="scope.row.url" style="width:100px;height:100px" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  NewPeopleFindGoods,
  newPeopleQueryGoodsQRCode,
  goodsAreaCreateQrCode,
  goodsAreaFindGoods
} from "@/network/api";
export default {
  data() {
    return {
      dialogVisible: false,
      title: "生成二维码",
      showBtn: true,
      type: 1,
      id: "", //活动id
      activityType: "", // 活动类型 1-新人专区 2-商品专区
      tableData: [],
      selectData: [],
      showTotalNum: false, //是否显示xxx个二维码正在生成中
      createCodeEnd: false, // 是否显示生成成功和失败了多少个二维码
      totalNum: 0, // 所有二维码个数
      successNum: 0, //二维码生成成功的个数
      failNum: 0 // 二维码生成失败的个数
    };
  },
  methods: {
    open(type, id) {
      /**
       * type：活动类型 1-新人专区 2-商品专区
       * id:活动id
       */
      this.showBtn = true;
      this.activityType = type;
      this.id = id;
      this.selectData = [];
      if (type == 1) {
        this.NewPeopleFindGoods(id);
      } else if (type == 2) {
        this.goodsAreaFindGoods(id);
      }
    },
    // 查询新人专区活动商品列表
    NewPeopleFindGoods(id) {
      NewPeopleFindGoods(`?id=${id}`).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.tableData = res.data.content;
          this.dialogVisible = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 查询商品活动专区活动商品列表
    goodsAreaFindGoods(id) {
      goodsAreaFindGoods(`?activityId=${id}`).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.tableData = res.data.content;
          this.dialogVisible = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // tabel多选框选择事件
    handleSelectionChange(val) {
      this.selectData = val;
    },
    // 关闭弹窗
    closeDialog() {
      if (this.showTotalNum) {
        this.$confirm("二维码未全部生成或保存，是否离开？", "二维码未生成", {
          confirmButtonText: "离开",
          cancelButtonText: "不离开"
        })
          .then(() => {
            this.dialogVisible = false;
            this.createCodeEnd = false;
          })
          .catch(() => {});
      } else {
        this.dialogVisible = false;
        this.createCodeEnd = false;
      }
    },
    // 生成商品二维码
    createCode() {
      if (this.selectData.length == 0) {
        this.$message.error("请选择商品");
        return;
      }
      this.totalNum = this.selectData.length;
      this.showBtn = false;
      this.title = "保存二维码";
      this.showTotalNum = true;
      // this.activityType: 活动类型 1-新人专区 2-商品专区
      if (this.activityType == 1) {
        let arr = [];
        this.selectData.forEach(val => {
          arr.push(val.id);
        });
        // 新人专区生成二维码
        let parms = {
          activityIdList: arr + "",
          type: this.type
        };
        newPeopleQueryGoodsQRCode({ params: parms }).then(res => {
          if (res.data.messageCode == "MSG_1001") {
            let data = res.data.content;
            this.successNum = 0;
            this.failNum = 0;
            // 把返回来的二维码图片添加到tabelData中
            for (let i = 0; i < data.length; i++) {
              for (let k = 0; k < this.tableData.length; k++) {
                if (this.tableData[k].id == data[i].activityId) {
                  this.tableData[k].url = data[i].url;
                }
              }
              // 记录二维码生成成功和失败的个数
              if (data[i].url) {
                this.successNum += 1;
              } else {
                this.failNum += 1;
              }
            }
            this.showTotalNum = false;
            this.createCodeEnd = true;
          } else {
            this.$message.error(res.data.message);
          }
        });
      } else if (this.activityType == 2) {
        let arr = [];
        this.selectData.forEach(val => {
          arr.push(val.goodsId);
        });
        // 商品专区生成二维码
        let parms = {
          activityId: this.id,
          goodsIdList: arr + "",
          isUnderLine: this.type
        };
        goodsAreaCreateQrCode({ params: parms }).then(res => {
          if (res.data.messageCode == "MSG_1001") {
            let data = res.data.content;
            this.successNum = 0;
            this.failNum = 0;
            // 把返回来的二维码图片添加到tabelData中
            for (let i = 0; i < data.length; i++) {
              for (let k = 0; k < this.tableData.length; k++) {
                if (this.tableData[k].goodsId == data[i].activityId) {
                  this.tableData[k].url = data[i].url;
                }
              }
              // 记录二维码生成成功和失败的个数
              if (data[i].url) {
                this.successNum += 1;
              } else {
                this.failNum += 1;
              }
            }
            this.showTotalNum = false;
            this.createCodeEnd = true;
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
    },
    // 新人专区和商品专区下载二维码
    saveCode() {
      // 判断有没有选择已经生成成功的二维码
      let s = false;
      this.selectData.forEach(val => {
        if (val.url) {
          s = true;
        }
        this.download(val.url, val.name);
      });
      if (!s) {
        this.$message.error("请选择生成成功的二维码");
        return;
      }
    },
    // 下载文件
    download(data, goodsName) {
      if (!data) {
        return;
      }
      this.getUrlBase64(data).then(base64 => {
        let a = document.createElement("a");
        a.style.display = "none";
        a.download = goodsName;
        a.href = base64;
        document.body.appendChild(a);
        a.click();
      });
    },
    // 将要下载的图片链接转换为base64格式，防止发生路由跳转
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
.btnBox {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tableBox {
  margin-top: 20px;
  height: 500px;
  overflow-y: auto;
}
</style>