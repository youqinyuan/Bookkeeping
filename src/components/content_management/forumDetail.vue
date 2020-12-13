<template>
  <div class="forumDetail">
    <div class="contentBox">
      <div class="avator">
        <img :src="content.avatarKey" />
      </div>
      <div class="content">
        <div class="name">
          <span>{{content.nickname}}</span>
          <img
            style="width:16px;height:13px;"
            src="../../assets/diamond_icon.png"
            v-if="content.type == 7 && content.role == 2"
          />
          <span class="label" v-if="content.type == 1">普通贴</span>
          <span class="label" v-if="content.type == 2">返现卖贴</span>
          <span class="label" v-if="content.type == 3">返现买贴</span>
          <span class="label" v-if="content.type == 4">预售订单</span>
          <span class="label" v-if="content.type == 5">商品卖贴</span>
          <span class="label" v-if="content.type == 6">商品买贴</span>
          <span class="label" v-if="content.type == 7">提期贴</span>
        </div>
        <div class="detail">{{content.content}}</div>
        <!-- 普通贴 -->
        <div class="imgBox" v-if="content.type == 1">
          <img
            v-for="(item,index) in content.attachmentList"
            :key="index"
            :src="item.fileKey"
            preview="1"
          />
        </div>
        <div class="info" v-else>
          <div
            class="infoImg"
            v-if="content.type != 6 &&content.type != 7 && content.status == 3"
            style="text-align:right;font-weight:bold;color:red;font-size:24px;opacity:0.4;"
          >已卖出</div>
          <div
            class="infoImg"
            v-if="content.type == 6 && content.status == 3"
            style="text-align:right;font-weight:bold;color:red;font-size:24px;opacity:0.4;"
          >已被购买</div>
          <div
            class="infoImg"
            v-if="content.type == 7 && content.status == 3"
            style="text-align:right;font-weight:bold;color:red;font-size:24px;opacity:0.4;"
          >已完成</div>
          <div
            class="infoImg"
            v-if="content.status == 4"
            style="text-align:right;font-weight:bold;color:red;font-size:24px;opacity:0.4;"
          >金额已变更</div>
          <div
            class="infoImg"
            v-if="content.status == 5 && content.type != 7"
            style="text-align:right;font-weight:bold;color:red;font-size:24px;opacity:0.4;"
          >已过期</div>
          <div
            class="infoImg"
            v-if="content.status == 5 && content.type == 7"
            style="text-align:right;font-weight:bold;color:red;font-size:24px;opacity:0.4;"
          >已失效</div>
          <div
            class="infoImg"
            v-if="content.status == 6"
            style="text-align:right;font-weight:bold;color:red;font-size:24px;opacity:0.4;"
          >已预订</div>
          <div
            class="infoImg"
            v-if="content.status == 7"
            style="text-align:right;font-weight:bold;color:red;font-size:24px;opacity:0.4;"
          >已撤销</div>
          <div
            class="infoImg"
            v-if="content.status == 8"
            style="text-align:right;font-weight:bold;color:red;font-size:24px;opacity:0.4;"
          >未付款交易关闭</div>
          <div
            class="infoImg"
            v-if="content.status == 9"
            style="text-align:right;font-weight:bold;color:red;font-size:24px;opacity:0.4;"
          >超时未支付关闭交易</div>
          <!-- 卖贴或者预售 -->
          <div class="infoBox" v-if="content.type == 2 || content.type == 4">
            <div v-if="content.type == 4">卖方已缴纳违约金：{{content.liquidateDamageAmountVendor}}元</div>
            <div>期望售价：{{content.expectAmount}}元</div>
            <div>共返金额：{{content.cashBackAmount}}元</div>
            <div>剩余{{content.periodLeft}}期，截止{{content.maxReturnTime | getTimes}}，每月{{content.perReturnDay}}号，每期返还{{content.perReturnAmount}}元</div>
            <div>年化率：{{content.annualizedRate}}%</div>
          </div>
          <!-- 买贴 -->
          <div class="infoBox" v-if="content.type == 3">
            <div>期望共返金额：{{content.cashBackAmount}} - {{content.cashBackAmountEnd}}元</div>
            <div>期望返还期数：{{content.periodLeft}} - {{content.periodLeftEnd}}期</div>
            <div>期望年收益率：{{content.annualizedRate}} - {{content.annualizedRateEnd}}%</div>
          </div>
          <!-- 赚钱订单和省钱订单 -->
          <div class="infoBox" v-if="content.type == 5 || content.type == 6">
            <div style="display:flex;">
              <div>
                <img style="width:40px;height:40px;margin-right:10px;" :src="content.goodsImageUrl" />
              </div>
              <div>
                <div>{{content.goodsName}}</div>
                <div>{{content.specDesc}}</div>
              </div>
            </div>
            <div>商品原价：{{content.platformOrgAmount}}元</div>
            <div v-if="content.type == 5">对方购买意向价：{{content.expectAmount}}元</div>
            <div v-if="content.type == 6">对方出售意向价：{{content.expectAmount}}元</div>
            <div v-if="content.type == 5">购买后可赚：{{content.platformOrgAmount}}元</div>
            <div
              v-if="content.type == 6"
            >购买后可省：{{content.platformOrgAmount - content.expectAmount}}元</div>
          </div>
          <!-- 提期贴 -->
          <div
            class="infoBox"
            v-if="content.type == 7"
            style="display:flex;flex-direction:row;align-items:center;"
          >
            <div>
              <div>{{content.annualizedRate}}%</div>
              <div style="font-size:14px;color:#999;">预估年化收益</div>
            </div>
            <div>
              <div>需要提{{content.periodLeft + content.estimatedPeriod - 2}}期</div>
              <div style="font-size:14px;color:#999;">帮助金额越多，收益越高</div>
            </div>
          </div>
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
    <!-- <el-button type="primary" style="margin:40px 0px;margin-left:260px;" @click="deletedForum">删除贴子</el-button> -->
    <el-button
      type="primary"
      style="margin:40px 0px;margin-left:260px;"
      v-if="content.visible == 1"
      @click="changeVisible(2)"
    >隐藏贴子</el-button>
    <el-button
      type="primary"
      style="margin:40px 0px;margin-left:260px;"
      v-if="content.visible == 2"
      @click="changeVisible(1)"
    >展示贴子</el-button>
  </div>
</template>
<script>
import {
  findDetailForum,
  removeForum,
  removeForumcomment,
  updateVisibleForum
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
    // deletedForum() {
    //   this.$confirm("确定删除吗？", "", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消"
    //   })
    //     .then(() => {
    //       let data = {
    //         id: this.id
    //       };
    //       removeForum(this.qs.stringify(data)).then(res => {
    //         if (res.data.messageCode == "MSG_1001") {
    //           this.$router.go(-1);
    //           this.$message.success("删除成功");
    //         } else {
    //           this.$message.error(res.data.message);
    //         }
    //       });
    //     })
    //     .catch(() => {});
    // }

    // 展示或者隐藏贴子
    changeVisible(visible) {
      let type = visible == 1 ? "展示" : "隐藏";
      this.$confirm(`确定${type}该贴子吗?`, "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          let data = {
            id: this.id,
            visible: visible
          };
          updateVisibleForum(data).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.findDetailForum();
              this.$message.success(`${type}成功`);
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
        .label {
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
        width: 360px;
        height: 180px;
        border: 1px solid #999;
        margin-top: 20px;
        position: relative;
        .infoImg {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0px;
          top: 0px;
        }
        .infoBox {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 10px;
          justify-content: space-around;
          font-size: 14px;
          line-height: 1.5;
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