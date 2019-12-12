<template>
  <div class="forumDetail">
    <div class="contentBox">
      <div class="avator">
        <img :src="content.avatarKey" />
      </div>
      <div class="content">
        <div class="name">
          <span>{{content.nickname}}</span>
          <span v-if="content.type == 1">普通贴</span>
          <span v-if="content.type == 2">卖贴</span>
          <span v-if="content.type == 3">买贴</span>
        </div>
        <div class="detail">{{content.content}}</div>
        <div class="imgBox" v-if="content.type == 1">
          <img
            v-for="(item,index) in content.attachmentList"
            :key="index"
            :src="item.fileKey"
            preview="1"
          />
        </div>
        <div class="info" v-if="content.type == 2">
          <img src="../../assets/ic_saled.png" v-if="content.status == 3" />
          <div>期望售价：{{content.expectAmount}}元</div>
          <div>共返金额：{{content.cashBackAmount}}元</div>
          <div>剩余{{content.periodLeft}}期，截止{{content.maxReturnTime | getTimes}}，每月{{content.perReturnDay}}号，每期返还{{content.perReturnAmount}}元</div>
          <div>年化率：{{content.annualizedRate}}%</div>
        </div>
        <div class="info" v-if="content.type == 3">
          <div>期望共返金额：{{content.cashBackAmount}} - {{content.cashBackAmountEnd}}元</div>
          <div>期望返还期数：{{content.periodLeft}} - {{content.periodLeftEnd}}期</div>
          <div>期望年收益率：{{content.annualizedRate}} - {{content.annualizedRateEnd}}%</div>
        </div>
        <div class="time">{{content.createTime | dateFormat}}</div>
        <div class="comment">
          <div class="items" v-for="(item,index) in commentPageResponse" :key="index">
            <span v-if="item.replyNickname" style="font-weight:bold;">{{item.replyNickname}}</span>
            <span v-if="item.replyNickname">回复</span>
            <span style="font-weight:bold;">{{item.nickname}}：</span>
            <span>{{item.content}}</span>
            <el-button type="text" @click="deletedComment(item.id)">删除</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-button type="primary" style="margin:40px 0px;margin-left:260px;" @click="deletedForum">删除贴子</el-button>
  </div>
</template>
<script>
import {
  findDetailForum,
  removeForum,
  removeForumcomment
} from "@/network/api";
export default {
  data() {
    return {
      id: "",
      content: "",
      commentPageResponse: ""
    };
  },
  filters: {
    getTimes: function(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      return year + "-" + month + "-" + day;
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.findDetailForum();
  },
  methods: {
    // 查询明细
    findDetailForum() {
      let params = {
        id: this.id
      };
      findDetailForum({ params: params }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.content = res.data.content;
          this.commentPageResponse = res.data.content.commentPageResponse.items;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 删除评论
    deletedComment(id) {
      this.$confirm("确定删除吗？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          let data = {
            id: id
          };
          removeForumcomment(this.qs.stringify(data)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.findDetailForum();
              this.$message.success("删除评论成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 删除贴子
    deletedForum() {
      this.$confirm("确定删除吗？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          let data = {
            id: this.id
          };
          removeForum(this.qs.stringify(data)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$router.go(-1);
              this.$message.success("删除成功");
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
.forumDetail {
  padding-top: 40px;
  padding-left: 40px;
  box-sizing: border-box;
  .contentBox {
    display: flex;
    .avator {
      width: 60px;
      height: 60px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .content {
      width: 700px;
      margin-left: 10px;
      .name {
        width: 100%;
        span:nth-child(2) {
          margin-left: 40px;
          padding: 2px 6px;
          background-color: rgb(255, 204, 255);
          border-radius: 6px;
          font-size: 14px;
          color: red;
        }
      }
      .detail {
        width: 100%;
        margin-top: 10px;
        word-wrap: break-word;
      }
      .imgBox {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        img {
          width: 120px;
          height: 120px;
          margin: 5px;
        }
      }
      .info {
        width: 340px;
        height: 160px;
        border: 1px solid #999;
        display: flex;
        flex-direction: column;
        padding: 10px;
        justify-content: space-around;
        margin-top: 20px;
        font-size: 14px;
        line-height: 1.5;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
      .time {
        width: 100%;
        padding: 15px 5px;
        color: #666;
        font-size: 14px;
      }
      .comment {
        width: 100%;
        background-color: #eee;
        font-size: 14px;
        padding: 0 10px;
        box-sizing: border-box;
      }
    }
  }
}
</style>