<template>
  <div class="insureIntroduction">
    <div>注意：图片宽度750px</div>
    <div class="box">
      <div class="item" v-for="(item, index) in img" :key="index">
        <img class="img" :src="item.imgUrl" alt="" preview="1" />
        <div class="btn">
          <el-upload
            action="/opadmin/fileStore/uploadFile"
            :headers="myHeaders"
            :show-file-list="false"
            :on-success="changeImgSuccess.bind(null, { index: index })"
            :on-error="changeImgError"
            :limit="1"
          >
            <el-button type="text">更换图片</el-button>
          </el-upload>
          <el-button type="text" @click="removeImg(index)">删除图片</el-button>
        </div>
      </div>
      <el-upload
        class="uploadBtn"
        action="/opadmin/fileStore/uploadFile"
        :headers="myHeaders"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :on-error="uploadImgErrorLabelImg"
      >
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <el-button
      type="primary"
      style="margin-top: 100px"
      @click="addOrUpdateImagesInsurance"
      >保存发布</el-button
    >
  </div>
</template>
<script>
import {
  findListImagesInsurance,
  addOrUpdateImagesInsurance,
} from "@/network/api";
import { getCookie } from "@/common/cookie.js";
export default {
  data() {
    return {
      myHeaders: { token: "" },
      fullscreenLoading: false,
      img: [],
      imageKeys: [],
    };
  },
  created() {
    this.myHeaders.token = getCookie().opadminToken;
    this.findListImagesInsurance();
  },
  methods: {
    // 查询
    findListImagesInsurance() {
      findListImagesInsurance().then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          content.forEach((val) => {
            this.img.push({
              imgUrl: val.imageUrl,
            });
            this.imageKeys.push(val.imageKey);
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 上传图片成功
    handleAvatarSuccess(res) {
      this.img.push({
        imgUrl: res.content.url,
      });
      this.imageKeys.push(res.content.key);
    },
    // 上传标签图片失败
    uploadImgErrorLabelImg(err, file, fileList) {
      this.$message.error("上传图片失败");
    },
    // 更换图片成功
    changeImgSuccess(obj, res) {
      let index = obj.index;
      this.img[index].imgUrl = res.content.url;
      this.imageKeys[index] = res.content.key;
    },
    // 更换图片失败
    changeImgError(err) {
      this.$message.error("上传图片失败");
    },
    // 删除图片
    removeImg(index) {
      this.img.splice(index, 1);
      this.imageKeys.splice(index, 1);
    },
    // 保存
    addOrUpdateImagesInsurance() {
      if (this.imageKeys.length == 0) {
        this.$message.error("请上传图片");
        return;
      }
      let parms = {
        imageKeys: this.imageKeys,
      };
      addOrUpdateImagesInsurance(parms).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("操作成功");
          this.$router.go("-1");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.insureIntroduction {
  padding: 20px;
  box-sizing: border-box;
  .box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 300px;
      flex-shrink: 0;
      margin: 20px;
      .img {
        width: 100%;
        height: 200px;
      }
      .btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    .uploadBtn {
      width: 180px;
      height: 180px;
      margin-top: 30px;
      border: 1px dashed #909399;
    }
  }
}
</style>