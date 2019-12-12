<template>
  <div class="setVideoContent">
    <div class="title">
      <span>说明：最多添加3个视频，视频大小不可超过50MB</span>
      <el-button
        type="primary"
        @click="dialogFormVisible = true"
        :disabled="videoList.length>=3"
      >添加视频</el-button>
    </div>
    <!-- 视频列表 -->
    <div class="videoContent">
      <div class="videoWrap" v-for="(item,index) in videoList" :key="index">
        <img :src="item.iconUrl" class="coverImg" @click="playVideo(item.videoUrl)" />
        <img src="@/assets/playVideo.png" class="playIcon" @click="playVideo(item.videoUrl)" />
        <img src="@/assets/icon_del.png" @click="deleteVideo(item.id)" class="delImg" />
      </div>
    </div>
    <!-- 添加视频弹框 -->
    <el-dialog title="添加视频" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="上传封面图：">
          <el-upload
            class="avatar-uploader"
            action="/opadmin/fileStore/uploadFile"
            :show-file-list="false"
            :headers="myHeaders"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-error="uploadImgError"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="上传视频：">
          <el-upload
            class="avatar-uploader"
            action="/opadmin/fileStore/uploadFile"
            :show-file-list="false"
            :headers="myHeaders"
            :on-success="handleVideoSuccess"
            :before-upload="beforeVideoUpload"
            :on-error="uploadVideoError"
          >
            <video
              :src="videoUrl"
              accept="video/*"
              controls="controls"
              width="300"
              height="150"
              v-if="videoUrl"
              class="avatar"
            >您的浏览器不支持 video 标签。</video>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addOrUpdateVideo">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 播放视频弹框 -->
    <el-dialog :visible.sync="playVideoDialog" width="500px">
      <video
        :src="playVideoUrl"
        accept="video/*"
        controls="controls"
        style="width:420px;height:210px;"
        class="avatar"
      >您的浏览器不支持 video 标签。</video>
    </el-dialog>
  </div>
</template>
<script>
import { findVideoByType, deleteVideo, addOrUpdateVideo } from "@/network/api";
import { getCookie } from "@/common/cookie.js";
export default {
  data() {
    return {
      dialogFormVisible: false,
      myHeaders: { token: "" },
      videoList: "", // 视频列表
      imageUrl: "", // 上传的封面图
      videoUrl: "", // 上传的视频连接
      videoKey: "",
      iconKey: "",
      fullscreenLoading: false, // elementui菊花图
      playVideoDialog: false, // 播放视频弹框
      playVideoUrl: "" // 要播放的视频链接
    };
  },
  created() {
    this.myHeaders.token = getCookie().opadminToken;
    this.findVideoByType();
  },
  methods: {
    // 查询视频列表
    findVideoByType() {
      findVideoByType(`?type=${3}`).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.videoList = res.data.content;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 播放视频
    playVideo(playVideoUrl) {
      this.playVideoDialog = true;
      this.playVideoUrl = playVideoUrl;
    },
    // 删除视频
    deleteVideo(id) {
      this.$confirm("是否删除该视频?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteVideo(`?id=${id}`).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.findVideoByType();
              this.$message.success("删除成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 上传图片之前
    beforeAvatarUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      this.fullscreenLoading = this.$loading({
        lock: true,
        text: "上传中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      if (!isLt1M) {
        this.$message.error("上传头像图片大小不能超过 1MB!");
        this.fullscreenLoading.close();
        return false;
      }
    },
    // 上传图片成功
    handleAvatarSuccess(response, file, fileList) {
      this.imageUrl = response.content.url;
      this.iconKey = response.content.key;
      this.fullscreenLoading.close();
    },
    // 上传图片失败
    uploadImgError(err, file, fileList) {
      this.fullscreenLoading.close();
      this.$message.error("上传图片失败");
    },
    // 上传视频之前
    beforeVideoUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 50;
      this.fullscreenLoading = this.$loading({
        lock: true,
        text: "上传中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      if (
        [
          "video/mp4",
          "video/ogg",
          "video/flv",
          "video/avi",
          "video/wmv",
          "video/rmvb"
        ].indexOf(file.type) == -1
      ) {
        this.$message.error("请上传正确的视频格式");
        this.fullscreenLoading.close();
        return false;
      }
      if (!isLt50M) {
        this.$message.error("上传视频大小不能超过 50MB!");
        this.fullscreenLoading.close();
        return false;
      }
    },
    // 上传视频成功
    handleVideoSuccess(response, file, fileList) {
      this.videoUrl = response.content.url;
      this.videoKey = response.content.key;
      this.fullscreenLoading.close();
    },
    // 上传视频失败
    uploadVideoError(err, file, fileList) {
      this.fullscreenLoading.close();
      this.$message.error("上传视频失败");
    },
    // 添加或修改视频
    addOrUpdateVideo() {
      let data = {
        videoKey: this.videoKey,
        iconKey: this.iconKey,
        type: 3,
        maxVideoCount: 3
      };
      addOrUpdateVideo(data).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.dialogFormVisible = false;
          this.findVideoByType();
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
.title {
  width: 100%;
  display: flex;
  align-items: center;
  span {
    margin-right: 20px;
    color: #409eff;
  }
}
.videoContent {
  display: flex;
  flex-wrap: wrap;
  .videoWrap {
    width: 300px;
    height: 150px;
    position: relative;
    margin: 20px;
    .coverImg {
      width: 300px;
      height: 150px;
    }
    .playIcon {
      width: 60px;
      height: 60px;
      position: absolute;
      left: 120px;
      top: 55px;
    }
    .delImg {
      width: 30px;
      height: 30px;
      position: absolute;
      bottom: 10px;
      right: 10px;
      z-index: 100;
    }
  }
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>