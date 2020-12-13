<template>
  <div class="guessingGameDetail">
    <!-- 竞猜详情 -->
    <div class="left">
      <el-button @click="goBack">返回上一页</el-button>
      <div class="titleBox">
        <h2 style="margin-top: 10px">【{{ guessResponse.head }}】</h2>
        <h4 style="margin-top: 10px">{{ guessResponse.subhead }}</h4>
      </div>
      <div class="numBox">
        <span>当前奖池花瓣数</span>
        <span>{{ guessResponse.flower }}</span>
      </div>
      <div class="numBox">
        <span>当前总入场票数</span>
        <span>{{
          guessResponse.intoCostFlower ? guessResponse.intoCostFlower : 0
        }}</span>
      </div>
      <div style="width: 100%; text-align: center; margin-top: 70px">
        <span v-if="guessResponse.status == 1">竞猜未开始</span>
        <span v-if="guessResponse.status == 2">竞猜投票进行中...</span>
        <span v-if="guessResponse.status == 3">竞猜等待揭晓中...</span>
        <span v-if="guessResponse.status == 4">竞猜已结束</span>
      </div>
      <table border="1" cellpadding="0" cellspacing="0" class="tableBox">
        <tr>
          <td>选项</td>
          <td>{{ guessResponse.optionOne }}</td>
          <td>{{ guessResponse.optionTwo }}</td>
        </tr>
        <tr>
          <td>票数(花瓣数)</td>
          <td>{{ pageData.optionOneAmount }}</td>
          <td>{{ pageData.optionTwoAmount }}</td>
        </tr>
        <tr>
          <td>人数</td>
          <td>{{ pageData.optionOneUserAmount }}</td>
          <td>{{ pageData.optionTwoUserAmount }}</td>
        </tr>
        <tr>
          <td>-</td>
          <td>
            <el-button
              type="primary"
              @click="openPlatformVotingDialog(guessResponse.optionOne)"
              >平台投票</el-button
            >
          </td>
          <td>
            <el-button
              type="primary"
              @click="openPlatformVotingDialog(guessResponse.optionTwo)"
              >平台投票</el-button
            >
          </td>
        </tr>
      </table>
      <div style="margin-top: 40px; margin-left: 20px">
        <el-link
          type="danger"
          style="font-size: 16px"
          @click="openVotingDetailsDialog"
          >查看用户投票明细</el-link
        >
      </div>
      <div style="margin-top: 20px; margin-left: 20px">
        投票截止时间：{{ guessResponse.endTime | dateFormat }}
      </div>
      <el-button
        type="primary"
        style="margin-top: 20px; margin-left: 20px"
        @click="answerDialog = true"
        >揭晓答案</el-button
      >
    </div>
    <!-- 讨论区 -->
    <div class="right">
      <div class="title">
        <span>讨论区</span>
        <el-link type="danger" class="getMore" @click="getMoreDiscuss"
          >查看更多</el-link
        >
      </div>
      <div class="tableBox" style="margin-top: 20px">
        <el-table :data="discussData" border style="width: 100%">
          <el-table-column
            prop="date"
            label="头像"
            align="center"
            width="80px;"
          >
            <template slot-scope="scope">
              <img
                :src="scope.row.avatarUrl"
                alt=""
                style="width: 40px; height: 40px"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="discussContent"
            label="内容"
            width="328px"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="discussTime"
            label="时间"
            align="center"
            width="150px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.discussTime | dateFormat }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="totalSizeBox">
        <span>总计：{{ totalSizeDiscuss }}条</span>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalSizeDiscuss"
          :page-size="10"
          :current-page="currentPageDiscuss"
          @current-change="pageChangeDiscuss($event)"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 查看用户投票明细弹窗 -->
    <el-dialog
      title="投票明细"
      :visible.sync="votingDetailsDialog"
      width="800px"
      center
      :close-on-click-modal="false"
    >
      <div>
        <el-table :data="votingTable" border style="width: 100%">
          <el-table-column prop="nickname" label="用户" align="center">
          </el-table-column>
          <el-table-column
            prop="guessResult"
            label="预言结果"
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="guessFlower"
            label="实际票数"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="intoFlower"
            label="入场票"
            align="center"
          ></el-table-column>
          <el-table-column prop="isWin" label="结果" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.isWin == '1'">成功</div>
              <div v-if="scope.row.isWin == '0'">失败</div>
              <div v-if="scope.row.isWin == '1'" style="color: #f56c6c">
                +{{ scope.row.winFlower }}花瓣
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="totalSizeBox">
        <span>总计：{{ totalSizeVotingDetails }}条</span>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalSizeVotingDetails"
          :page-size="10"
          :current-page="currentPageVotingDetails"
          @current-change="pageChange($event)"
        >
        </el-pagination>
      </div>
    </el-dialog>
    <!-- 揭晓答案 -->
    <el-dialog
      title="揭晓正确答案"
      :visible.sync="answerDialog"
      width="600px"
      center
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div
        style="
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        <el-radio-group v-model="guessResponse.answer">
          <el-radio-button :label="guessResponse.optionOne"></el-radio-button>
          <el-radio-button :label="guessResponse.optionTwo"></el-radio-button>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="answerDialog = false">取 消</el-button>
        <el-button type="primary" @click="revealAnswerById">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加平台投票弹窗 -->
    <el-dialog
      title="添加平台投票"
      :visible.sync="platformVotingDialog"
      width="400px"
      center
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div
        style="
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        <span>花瓣数量：</span>
        <el-input v-model="flower" style="width: 120px"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="platformVotingDialog = false">取 消</el-button>
        <el-button type="primary" @click="appGuess">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getGuessById,
  revealAnswerById,
  getGuessRecordList,
  appGuess,
  getGuessDiscussList,
} from "@/network/api";
export default {
  data() {
    return {
      id: "",
      votingDetailsDialog: false,
      answerDialog: false,
      platformVotingDialog: false,
      pageData: {},
      guessResponse: {},
      totalSizeVotingDetails: 0,
      currentPageVotingDetails: 1,
      guessResult: "", // 平台投票结果
      flower: "", // 平台投票花瓣数量
      votingTable: [],
      discussData: [], // 讨论列表
      totalSizeDiscuss: 0,
      currentPageDiscuss: 1,
      name: "",
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getGuessById();
    this.getGuessDiscussList(1);
  },
  methods: {
    // 查询竞猜详情
    getGuessById(id) {
      let parms = {
        id: this.id,
      };
      getGuessById({
        params: parms,
      }).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.pageData = res.data.content;
          this.guessResponse = res.data.content.guessResponse;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 查询讨论区明细
    getGuessDiscussList(val) {
      let parms = {
        pageNumber: val ? val : this.currentPageDiscuss,
        pageSize: 10,
        guessId: this.id,
      };
      getGuessDiscussList({ params: parms }).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.discussData = content.items;
          this.totalSizeDiscuss = content.totalSize;
          this.currentPageDiscuss = val ? val : this.currentPageDiscuss;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 讨论区查看更多
    getMoreDiscuss() {
      this.$router.push({
        path: "/discussDetail",
        query: {
          id: this.id,
          title: this.guessResponse.head,
        },
      });
    },
    // 查看讨论区明细分页改变事件
    pageChangeDiscuss(val) {
      this.currentPageDiscuss = val;
      this.getGuessDiscussList(val);
    },
    // 打开平台投票弹窗
    openPlatformVotingDialog(guessResult) {
      this.guessResult = guessResult;
      this.platformVotingDialog = true;
    },
    // 平台投票
    appGuess() {
      let a = /^[1-9]\d*$/;
      if (!a.test(this.flower)) {
        this.$message.error("花瓣数量格式不正确");
        return;
      }
      let parms = {
        guessId: this.id,
        flower: this.flower,
        guessResult: this.guessResult,
      };
      appGuess(this.qs.stringify(parms)).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("投票成功");
          this.platformVotingDialog = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 查看用户投票明细
    openVotingDetailsDialog() {
      let parms = {
        pageNumber: this.currentPageVotingDetails,
        pageSize: "10",
        guessId: this.id,
      };
      getGuessRecordList({ params: parms }).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.votingTable = content.items;
          this.totalSizeVotingDetails = content.totalSize;
          this.votingDetailsDialog = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 查看用户投票明细分页改变事件
    pageChange(val) {
      this.currentPageVotingDetails = val;
      this.openVotingDetailsDialog(val);
    },
    // 揭晓答案
    revealAnswerById() {
      let parms = {
        id: this.id,
        answer: this.guessResponse.answer,
      };
      revealAnswerById(this.qs.stringify(parms)).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("操作成功");
          this.answerDialog = false;
          this.getGuessById();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 返回上一页
    goBack() {
      this.$router.go("-1");
    },
  },
};
</script>
<style lang="less" scoped>
.guessingGameDetail {
  width: 100%;
  display: flex;
  padding: 20px;
  box-sizing: border-box;

  .left {
    width: 600px;
    flex-shrink: 0;

    .titleBox {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 20px;
    }

    .numBox {
      width: 80%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 auto;
      margin-top: 30px;
    }

    .tableBox {
      width: 100%;
      margin-top: 30px;
      border: 1px solid #ccc;

      tr {
        height: 50px;
        text-align: center;
      }

      td {
        height: 50px;
      }
    }
  }
}

.right {
  width: 600px;
  margin-left: 80px;
  background-color: #fff;
  box-shadow: 0px 0px 4px #cccccc;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 12px;
  margin-top: 40px;
  .title {
    width: 100%;
    text-align: center;
    position: relative;
    font-size: 18px;
    .getMore {
      position: absolute;
      right: 0px;
      bottom: 0px;
    }
  }
}

.totalSizeBox {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
