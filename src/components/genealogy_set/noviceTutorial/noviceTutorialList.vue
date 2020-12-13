<template>
  <div class="noviceTutorialList">
    <div class="itemBox">
      <div class="item" v-for="(item, index) in videoList" :key="index">
        <el-tooltip
          class="item"
          effect="dark"
          :content="item.title"
          placement="top"
        >
          <div class="title" placement="top">
            {{ item.title }}
          </div>
        </el-tooltip>
        <div class="videoBox" @click="openPlayVideo(item.videoUrl)">
          <img class="coverImg" :src="item.imageUrl" alt="" />
          <img class="playImg" src="@/assets/playVideo.png" alt="" />
        </div>
        <div class="del">
          <el-button type="text" @click="del(item.id)">删除</el-button>
        </div>
      </div>
    </div>
    <div class="itemBox">
      <div class="item">
        <span>点这里添加新手教程视频与标题</span>
        <div
          class="add"
          style="
            width: 300px;
            border: 1px solid #666;
            text-align: center;
            line-height: 200px;
          "
        >
          <el-button type="text" @click="addNoviceTutorial">添加</el-button>
        </div>
      </div>
    </div>
    <!-- 播放视频弹框 -->
    <el-dialog :visible.sync="playVideoDialog" width="500px">
      <video
        :src="playVideoUrl"
        accept="video/*"
        controls="controls"
        style="width: 420px; height: 210px"
        class="avatar"
      >
        您的浏览器不支持 video 标签。
      </video>
    </el-dialog>
  </div>
</template>
<script>
import { deleteCourseVideoById, selectCourseVideo } from "@/network/api";
export default {
  data() {
    return {
      videoList: [],
      playVideoDialog: false, // 视频播放弹框
      playVideoUrl: "", // 视频播放链接
    };
  },
  created() {
    this.selectCourseVideo();
  },
  methods: {
    // 获取视频
    selectCourseVideo() {
      selectCourseVideo().then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.videoList = res.data.content;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 打开播放视频弹窗
    openPlayVideo(url) {
      this.playVideoUrl = url;
      this.playVideoDialog = true;
    },
    // 删除视频
    del(id) {
      this.$confirm("", "是否删除当前视频内容？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        showClose: false,
        closeOnClickModal: false,
      })
        .then(() => {
          deleteCourseVideoById(`?id=${id}`).then((res) => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("删除成功");
              this.selectCourseVideo();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 跳转到添加新手教程页面
    addNoviceTutorial() {
      this.$router.push("/addNoviceTutorial");
    },
  },
};
</script>
<style lang="less" scoped>
.noviceTutorialList {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .itemBox {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 300px;
      margin-right: 20px;
      .title {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .videoBox {
        width: 100%;
        height: 200px;
        margin-top: 5px;
        position: relative;
        .coverImg {
          width: 100%;
          height: 100%;
        }
        .playImg {
          width: 60px;
          height: 60px;
          position: absolute;
          left: 120px;
          top: 70px;
        }
      }
      .add {
        width: 100%;
        height: 200px;
        margin-top: 10px;
        border-radius: 8px;
      }
      .del {
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>