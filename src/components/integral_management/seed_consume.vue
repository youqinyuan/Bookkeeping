<template>
  <div class="seed_consume">
    <div class="titleBox">
      <span class="title">种子扣除规则</span>
      <el-button type="primary" @click="navAddRules(0)">添加扣除规则</el-button>
    </div>
    <div class="itemBox">
      <div class="item" v-for="(item,index) in list" :key="index">
        <div>
          <span style="margin-right:30px;">{{item.topic.title}}</span>
          <el-button type="text" @click="navAddRules(1,item.topic.id)">修改规则</el-button>
          <el-button
            type="text"
            style="color:#F56C6C"
            @click="delRules(item.topic.id)"
            v-if="item.topic.id !== -1"
          >删除</el-button>
          <el-button
            type="text"
            style="color:#67C23A"
            @click="opendialogFormVisible(item.topic.id)"
            v-if="item.detailList.length == 0 && item.topic.id !== -1"
          >添加限制人群</el-button>
          <el-button
            type="text"
            style="color:#67C23A"
            @click="changeLimit(item.detailList,item.topic.id)"
            v-if="item.detailList.length > 0 && item.topic.id !== -1"
          >修改限制人群</el-button>
        </div>
        <div class="ruleContent" v-if="item.detailList.length > 0">
          <div v-for="(ite,idx) in item.detailList" :key="idx" style="margin:10px;">
            <span>{{ite.nickname}}</span>
            <span>+</span>
            <span>{{ite.mobileNumber}}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加或修改限制人群弹窗 -->
    <el-dialog
      title="添加/修改限制人群"
      :visible.sync="dialogFormVisible"
      center
      :close-on-click-modal="false"
      width="500px"
    >
      <el-input type="textarea" placeholder="请输入用户手机号多个请用英文逗号隔开," v-model="mobileNumber"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addOrUpdateLimit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  findConsumeTopicList,
  removeConsumeTopic,
  addOrUpdateConsumeTopicUser
} from "@/network/api";
export default {
  data() {
    return {
      id: "",
      dialogFormVisible: false,
      mobileNumber: "",
      list: []
    };
  },
  created() {
    this.findConsumeTopicList();
  },
  methods: {
    // 跳转到添加或修改规则
    navAddRules(type, id) {
      // type: 0--添加规则，1--修改规则
      this.$router.push({
        path: "/addSeedConsume",
        query: {
          type: type,
          id: id
        }
      });
    },
    // 查询规则列表
    findConsumeTopicList() {
      findConsumeTopicList().then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.list = res.data.content;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 删除规则
    delRules(id) {
      this.$confirm("", "确定删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        showClose: false,
        closeOnClickModal: false
      })
        .then(() => {
          let parms = {
            id: id
          };
          removeConsumeTopic(parms).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.findConsumeTopicList();
              this.$message.success("删除成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },

    // 添加受限制人群 -- 打开dialog弹窗
    opendialogFormVisible(id) {
      this.id = id;
      this.mobileNumber = "";
      this.dialogFormVisible = true;
    },

    // 修改限制人群--打开dialog弹窗
    changeLimit(detailList, id) {
      let str = "";
      detailList.forEach((val, index) => {
        str += val.mobileNumber;
        if (index != detailList.length - 1) {
          str += ",";
        }
      });
      this.mobileNumber = str;
      this.id = id;
      this.dialogFormVisible = true;
    },

    // 添加或修改限制人群保存
    addOrUpdateLimit() {
      let mobileNumber = this.mobileNumber;
      if (mobileNumber.indexOf("，") != -1) {
        this.$message.error("多个手机号之间请使用英文逗号隔开");
        return;
      }
      let parms = {
        topicId: this.id,
        mobileNumber: mobileNumber
      };
      addOrUpdateConsumeTopicUser(parms).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.dialogFormVisible = false;
          this.findConsumeTopicList();
          this.$message.success("操作成功");
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.seed_consume {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .titleBox {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1px solid #999;
    .title {
      font-size: 20px;
      font-weight: bold;
    }
  }
  .itemBox {
    width: 100%;
    .item {
      width: 100%;
      margin-top: 20px;
      .ruleContent {
        width: 100%;
        padding: 10px;
        max-height: 600px;
        overflow: auto;
        background-color: #f5f5f5;
        font-size: 14px;
        color: #666;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }
    }
  }
}
</style>