<template>
  <div class="brandLabel">
    <div class="title">
      <span>品牌标签</span>
      <el-button type="text" @click="openAddDialog">新增</el-button>
    </div>
    <div class="list">
      <div class="list_item" v-for="(item,index) in list" :key="index">
        <span class="item">品牌名称：{{item.name}}</span>
        <img :src="item.imageKey" alt class="img" />
        <span class="item">商品SKU：{{item.goodsCount}}个</span>
        <span class="item">销量：{{item.goodsSales}}个</span>
        <span class="item">排序值：{{item.orderNumber}}</span>
        <el-button type="text" class="item" @click="del(item.id)">删除</el-button>
        <el-button type="text" class="item" @click="change(item)">修改</el-button>
      </div>
    </div>

    <!-- 新增品牌标签弹框 -->
    <el-dialog title="新增" :visible.sync="dialogVisible" width="400px" :close-on-click-modal="false">
      <div style="margin-top:10px;">1、请输入品牌名称</div>
      <el-input
        v-model="formData.name"
        placeholder="不可超过10个字符，必填"
        maxlength="10"
        style="margin-top:10px;"
      ></el-input>
      <div style="margin-top:10px;">2、排序值（从小到大排）</div>
      <el-input
        v-model="formData.orderNumber"
        placeholder="不可超过10个字符，仅限数字"
        maxlength="10"
        style="margin-top:10px;"
      ></el-input>
      <div style="margin-top:10px;">3、请上传品牌logo</div>
      <el-upload
        class="avatar-uploader"
        action
        :auto-upload="false"
        :show-file-list="false"
        drag
        :on-change="changeUpload_logo"
      >
        <el-image v-if="logoUrl" :src="logoUrl" fit="contain" class="avatar"></el-image>
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div style="margin-top:10px;">4、请上传品牌宣传图（非必填）</div>
      <el-upload
        class="avatar-uploader"
        action
        :auto-upload="false"
        :show-file-list="false"
        drag
        :on-change="changeUpload_poster"
      >
        <el-image v-if="posterIconUrl" :src="posterIconUrl" fit="contain" class="avatar"></el-image>
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="add">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getGoodsClassRequest,
  addClass,
  deleteClass,
  updateClass
} from "@/network/api";
import { getCookie } from "@/common/cookie.js";
export default {
  data() {
    return {
      myHeaders: { token: "" },
      logoUrl: "", // logo
      iconFile: "",
      posterIconFile: "",
      posterIconUrl: "", // 品牌宣传图
      fullscreenLoading: false, // elementui菊花图
      list: [],
      dialogVisible: false,
      formData: {
        name: "",
        orderNumber: ""
      }
    };
  },
  created() {
    this.myHeaders.token = getCookie().opadminToken;
    this.getGoodsClassRequest();
  },
  methods: {
    // 获取商品标签列表
    getGoodsClassRequest() {
      let parms = {
        type: 2
      };
      getGoodsClassRequest({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.list = res.data.content;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 上传logo
    changeUpload_logo(file, fileList) {
      this.iconFile = file;
      this.logoUrl = window.URL.createObjectURL(file.raw);
    },

    // 上传宣传图
    changeUpload_poster(file, fileList) {
      this.posterIconFile = file;
      this.posterIconUrl = window.URL.createObjectURL(file.raw);
    },

    // 新增
    openAddDialog() {
      for (let key in this.formData) {
        this.formData[key] = "";
      }
      this.logoUrl = "";
      this.iconFile = "";
      this.posterIconFile = "";
      this.posterIconUrl = "";
      this.dialogVisible = true;
    },
    // 修改
    change(item) {
      for (let key in this.formData) {
        this.formData[key] = item[key];
      }
      this.formData.id = item.id;
      this.logoUrl = item.imageKey;
      this.posterIconUrl = item.posterImageKey;
      this.posterIconFile = "";
      this.iconFile = "";
      this.dialogVisible = true;
    },

    // 新增或者修改品牌保存
    add() {
      let param = this.formData;
      if (!param.name) {
        this.$message.error("请输入品牌名称");
        return;
      }
      if (!this.logoUrl) {
        this.$message.error("请上传品牌logo");
        return;
      }
      param.type = 2;
      let formData = new FormData();
      for (let key in param) {
        if (typeof param[key] === "object") {
          formData.append(key, JSON.stringify(param[key]));
        } else {
          formData.append(key, param[key]);
        }
      }
      let types = ["image/bmp", "image/jpg", "image/png", "image/jpeg"];
      if (!param.id) {
        // 新增
        let logoType = this.iconFile.raw.type;
        if (types.indexOf(logoType) == -1) {
          this.$message.error("logo格式不正确");
          return;
        }
        formData.append("icon", this.iconFile.raw);
        if (this.posterIconFile) {
          let posterIconType = this.posterIconFile.raw.type;
          if (types.indexOf(posterIconType) == -1) {
            this.$message.error("宣传图格式不正确");
            return;
          } else {
            formData.append("posterIcon", this.posterIconFile.raw);
          }
        }
        addClass(formData).then(res => {
          if (res.data.messageCode == "MSG_1001") {
            this.dialogVisible = false;
            this.$message.success("添加成功");
            this.getGoodsClassRequest();
          } else {
            this.$message.error(res.data.message);
          }
        });
      } else {
        // 修改
        if (this.iconFile) {
          let logoType = this.iconFile.raw.type;
          if (types.indexOf(logoType) == -1) {
            this.$message.error("logo格式不正确");
            return;
          } else {
            formData.append("icon", this.iconFile.raw);
          }
        }
        if (this.posterIconFile) {
          let posterIconType = this.posterIconFile.raw.type;
          if (types.indexOf(posterIconType) == -1) {
            this.$message.error("宣传图格式不正确");
            return;
          } else {
            formData.append("posterIcon", this.posterIconFile.raw);
          }
        }
        updateClass(formData).then(res => {
          if (res.data.messageCode == "MSG_1001") {
            this.dialogVisible = false;
            this.$message.success("修改成功");
            this.getGoodsClassRequest();
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
    },

    // 删除
    del(id) {
      this.$confirm("确定删除此品牌吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false,
        closeOnClickModal: false,
        center: true
      })
        .then(() => {
          deleteClass({ params: { id: id } }).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getGoodsClassRequest();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="less" scoped>
.brandLabel {
  padding: 20px;
  box-sizing: border-box;
  .title {
    width: 800px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .list {
    width: 100%;
    .list_item {
      width: 100%;
      margin-top: 30px;
      display: flex;
      align-items: center;
      .item {
        margin: 0px 20px;
      }
      .img {
        width: 60px;
        height: 60px;
        margin: 0 20px;
      }
    }
  }
}
</style>