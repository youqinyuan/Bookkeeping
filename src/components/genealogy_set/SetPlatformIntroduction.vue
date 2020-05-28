<template>
  <div class="setPlatformIntroduction">
    <!-- 视频上传按钮 -->
    <div class="btn_addVideo">
      <span class="title">视频：</span>
      <el-button
        size="small"
        type="primary"
        @click="dialogFormVisible = true"
        :disabled="videoFiles.length>=5"
      >点击上传</el-button>
      <span class="tips">注意：视频不可大于50MB，最多上传5个</span>
    </div>

    <!-- 视频列表 -->
    <div class="videoContent">
      <div class="videoWrap" v-for="(item,index) in videoSrc" :key="index">
        <div class="top" v-if="item.isTop==1" style="background-color:#ccc;">置顶</div>
        <div class="top" @click="topVideo(item.id)" v-else>置顶</div>
        <img :src="item.iconUrl" class="coverImg" @click="playVideo(item.videoUrl)" />
        <img src="@/assets/playVideo.png" class="playIcon" @click="playVideo(item.videoUrl)" />
        <img src="@/assets/icon_del.png" @click="deleteVideo(item.id,index)" class="delImg" />
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
            multiple
            :limit="5"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            :on-error="uploadFail"
            :show-file-list="false"
            :with-credentials="true"
            :headers="myHeaders"
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

    <!-- 富文本编辑器 -->
    <div class="btn_addVideo">
      <span class="title">内容：</span>
      <span class="tips">注意：若上传图片（规定尺寸"UI根据前端给出宽高")</span>
    </div>
    <wang-editor class="wangEditor" @catchData="getContent" :content="content" v-if="flag"></wang-editor>
    <el-button type="primary" @click="saveContent" style="margin-bottom:20px">保 存</el-button>
  </div>
</template>

<script>
import wangEditor from "./common/WangEditor.vue";
import {
  setPage,
  queryPage,
  delFile,
  addOrUpdateVideo,
  deleteVideo,
  findVideoByType,
  updateVideoIsTop
} from "@/network/api";
import { getCookie } from "@/common/cookie.js";
export default {
  data() {
    return {
      fullscreenLoading: false,
      flag: false, //是否显示wangeditor组件
      disabledInput: false, //是否可以上传视频
      imageUrl: "", // 上传的封面图
      videoUrl: "", // 上传的视频连接
      content: "", // 富文本内容
      videoSrc: [], // 视频播放连接
      videoFiles: [], // 上传的视频文件
      videoFiles2: [], // 上传的视频文件2
      videoKey: "",
      iconKey: "",
      myHeaders: { token: "" },
      dialogFormVisible: false, //是否显示添加视频弹框
      playVideoDialog: false, // 视频播放弹框
      playVideoUrl: "" // 视频播放链接
    };
  },
  components: {
    wangEditor
  },
  created() {
    this.myHeaders.token = getCookie().opadminToken;
    this.queryPageData();
  },
  methods: {
    // 深拷贝
    deepCopy(data) {
      let d = JSON.stringify(data);

      return JSON.parse(d);
    },
    // 查询页面设置
    queryPageData() {
      queryPage(`?type=${1}`).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.flag = true;
          this.content = res.data.content.content;
          let video = res.data.content.videoUrls;
          this.videoSrc = this.deepCopy(video);
          this.videoFiles = video.map(item => {
            let json = {};
            json.id = item.id;
            json.videoKey = null;
            json.iconKey = null;
            json.isTop = item.isTop;
            json.type = 1;
            json.maxVideoCount = 5;
            return json;
          });
          this.videoFiles2 = video.map(item => {
            let json = {};
            json.id = item.id;
            json.videoKey = item.videoKey;
            json.iconKey = item.iconKey;
            json.isTop = item.isTop;
            json.type = 1;
            json.maxVideoCount = 5;
            return json;
          });
        } else {
          this.flag = true;
          this.$message.error(res.data.message);
        }
      });
    },
    // 查询页面设置2 -- 不更新富文本内容
    queryPageData2() {
      queryPage(`?type=${1}`).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.flag = true;
          let video = res.data.content.videoUrls;
          this.videoSrc = this.deepCopy(video);
          this.videoFiles = video.map(item => {
            let json = {};
            json.id = item.id;
            json.videoKey = null;
            json.iconKey = null;
            json.isTop = item.isTop;
            json.type = 1;
            json.maxVideoCount = 5;
            return json;
          });
          this.videoFiles2 = video.map(item => {
            let json = {};
            json.id = item.id;
            json.videoKey = item.videoKey;
            json.iconKey = item.iconKey;
            json.isTop = item.isTop;
            json.type = 1;
            json.maxVideoCount = 5;
            return json;
          });
        } else {
          this.flag = true;
          this.$message.error(res.data.message);
        }
      });
    },
    // 播放视频
    playVideo(playVideoUrl) {
      this.playVideoDialog = true;
      this.playVideoUrl = playVideoUrl;
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
    //上传视频之前的钩子
    beforeUpload(file) {
      this.fullscreenLoading = this.$loading({
        lock: true,
        text: "上传中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const isLt10M = file.size / 1024 / 1024 < 50;
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
      if (!isLt10M) {
        this.$message.error("上传视频大小不能超过50MB哦!");
        this.fullscreenLoading.close();
        return false;
      }
    },
    // 上传视频成功
    uploadSuccess(response, file, fileList) {
      this.videoUrl = response.content.url;
      this.videoKey = response.content.key;
      this.fullscreenLoading.close();
    },
    // 上传视频失败
    uploadFail(err, file, fileList) {
      this.fullscreenLoading.close();
      this.$message.error("上传视频失败");
    },
    // 添加或修改视频
    addOrUpdateVideo() {
      let data = {
        videoKey: this.videoKey,
        iconKey: this.iconKey,
        type: 1,
        isTop: 0,
        maxVideoCount: 5
      };
      addOrUpdateVideo(data).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.dialogFormVisible = false;
          this.imageUrl = "";
          this.videoUrl = "";
          this.queryPageData2();
          this.$message.success("添加成功");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 删除视频
    deleteVideo(id, index) {
      this.$confirm("是否删除该视频", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteVideo(`?id=${id}`).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.queryPageData2();
              this.$message.success("删除成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 视频置顶
    topVideo(id) {
      // 先把已置顶的视频设置为不置顶，再将想要置顶的视频设置为置顶
      let newArr = this.videoFiles2.filter((val, index, arr) => {
        return val.isTop == 1;
      });
      if (newArr.length > 0) {
        updateVideoIsTop(`?id=${newArr[0].id}&&isTop=${0}`).then(res => {
          if (res.data.messageCode == "MSG_1001") {
            updateVideoIsTop(`?id=${id}`).then(res => {
              if (res.data.messageCode == "MSG_1001") {
                this.queryPageData2();
                this.$message.success("修改成功");
                return;
              } else {
                this.$message.error(res.data.message);
              }
            });
          } else {
            this.$message.error(res.data.message);
          }
        });
      } else {
        updateVideoIsTop(`?id=${id}`).then(res => {
          if (res.data.messageCode == "MSG_1001") {
            this.queryPageData2();
            this.$message.success("修改成功");
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
    },

    // ==============富文本编辑器===================
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
        type: 1,
        content: this.content,
        videoFiles: this.videoFiles
      };
      setPage(data).then(res => {
        console.log(res);
        if (res.data.messageCode == "MSG_1001") {
          this.queryPageData();
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
.setPlatformIntroduction {
  padding: 0 20px;
  padding-top: 20px;
}
.btn_addVideo {
  width: 100%;
  height: 60px;
  margin-top: 20px;
  display: flex;
  align-items: center;
}
.title {
  font-weight: bold;
  color: #000;
  margin-right: 10px;
  font-size: 20px;
}
.tips {
  color: rgb(33, 91, 179);
  font-size: 14px;
  margin-left: 20px;
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
    .top {
      width: 100%;
      height: 25px;
      line-height: 25px;
      background-color: #409eff;
      color: #fff;
      text-align: center;
      cursor: pointer;
      position: absolute;
      top: 0px;
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
.wangEditor {
  margin: 40px 0px;
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