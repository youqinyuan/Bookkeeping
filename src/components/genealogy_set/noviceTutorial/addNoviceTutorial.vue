<template>
  <div class="addNoviceTutorial">
    <div class="titleBox">
      <span>标题：</span>
      <el-input
        v-model="form.title"
        style="width: 600px"
        :maxlength="50"
        placeholder="请用一句大白话阐述此视频内容"
      ></el-input>
    </div>
    <div class="videoBox" style="margin-top: 40px">
      <span>视频：</span>
      <el-upload
        drag
        action="#"
        accept="video/*"
        :auto-upload="false"
        :on-exceed="btnVideoNumber"
        :limit="1"
        :on-change="uploadVideoSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text"><em>点击上传视频</em></div>
      </el-upload>
      <el-upload
        style="margin-left: 20px"
        drag
        action="#"
        accept="image/*"
        :auto-upload="false"
        :on-exceed="btnImgNumber"
        :limit="1"
        :on-change="uploadImgSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text"><em>点击上传封面</em></div>
      </el-upload>
    </div>
    <div class="tipsBox">
      <div class="tipsItems">
        <h4>视频、封面格式</h4>
        <div style="margin-top: 4px">
          支持mp4/webm视频格式，推荐使用mp4，封面推荐PNG、JPG格式
        </div>
      </div>
      <div class="tipsItems">
        <h4>视频、封面大小</h4>
        <div style="margin-top: 4px">
          视频文件大小不超过20M，时长在5分钟以下，封面不大于3M。
        </div>
      </div>
      <div class="tipsItems">
        <h4>视频分辨率</h4>
        <div style="margin-top: 4px">
          为保证清晰度建议分辨率为720p（1280x720）及以上
        </div>
      </div>
    </div>
    <div class="btnBox">
      <el-button plain @click="goBack">取消</el-button>
      <el-button type="primary" plain @click="addCourseVideo">保存</el-button>
    </div>
  </div>
</template>
<script>
import { addCourseVideo } from "@/network/api";
export default {
  data() {
    return {
      form: {
        title: "",
        videoFile: "",
        imageFile: "",
      },
    };
  },
  methods: {
    // 上传视频成功
    uploadVideoSuccess(file) {
      this.form.videoFile = file.raw;
    },
    // 上传视频超出个数
    btnVideoNumber() {
      this.$message.error("最多添加1个视频");
    },
    // 上传封面成功
    uploadImgSuccess(file) {
      this.form.imageFile = file.raw;
    },
    // 上传视频超出个数
    btnImgNumber() {
      this.$message.error("最多添加1张图片");
    },
    // 取消
    goBack() {
      this.$router.go("-1");
    },
    // 保存
    addCourseVideo() {
      let form = this.form;
      if (!form.title) {
        this.$message.error("标题不能为空");
        return false;
      }
      if (!form.videoFile) {
        this.$message.error("视频不能为空");
        return false;
      }
      if (!form.imageFile) {
        this.$message.error("图片不能为空");
        return false;
      }
      //  校验视频大小
      const isLt20M = form.videoFile.size / 1024 / 1024 < 20;
      if (!isLt20M) {
        this.$message.error("上传视频大小不能超过20MB!");
        return false;
      }
      // 校验视频格式
      const fileSuffix = ["video/mp4", "video/webm"];
      let extension = form.videoFile.type;
      if (!fileSuffix.includes(extension)) {
        this.$message.error("视频格式仅支持mp4/webm");
        return false;
      }
      //  校验图片大小
      const isLt3M = form.imageFile.size / 1024 / 1024 < 3;
      if (!isLt3M) {
        this.$message.error("上传图片大小不能超过3MB!");
        return false;
      }
      let formData = new FormData();
      formData.append("title", form.title);
      formData.append("videoFile", form.videoFile);
      formData.append("imageFile", form.imageFile);
      addCourseVideo(formData).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("保存成功");
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
.addNoviceTutorial {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .titleBox {
    width: 100%;
    display: flex;
    align-items: center;
  }
  .videoBox {
    width: 100%;
    display: flex;
  }
  .tipsBox {
    width: 100%;
    margin-top: 20px;
    display: flex;
    .tipsItems {
      width: 260px;
      background-color: #f2f2f2;
      padding: 10px;
      border-radius: 10px;
      font-size: 15px;
      margin-left: 40px;
    }
  }
  .btnBox {
    margin-top: 40px;
    margin-left: 40px;
  }
}
</style>