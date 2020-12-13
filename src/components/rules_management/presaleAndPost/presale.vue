<template>
  <div class="presale">
    <el-button type="primary" @click="addLimitRule" :disabled="rules.length >= 10">添加限制规则</el-button>
    <div v-for="(item,index) in rules" :key="index">
      <div class="itemBox">
        <div style="margin-right:20px;">
          <span>预售发帖限制：每天最多发起预售或发卖贴</span>
          <el-input v-model="item.timesPerDay" style="width:110px;" :disabled="item.disabled"></el-input>
          <span>次,每月最多发起预售</span>
          <el-input v-model="item.timesPerMonth" style="width:110px;" :disabled="item.disabled"></el-input>
          <span>次</span>
        </div>
        <div class="handle">
          <el-button type="text" v-if="item.disabled" @click="changeRule(index)">修改</el-button>
          <el-button type="text" v-if="!item.disabled" @click="preserve(item)">保存</el-button>
          <el-button type="text" @click="rules.pop()" v-if="item.type == -1">删除</el-button>
          <el-button type="text" @click="deleted(item.id)" v-if="item.type != -1">删除</el-button>
          <el-button type="primary" @click="openDialog(item)" v-if="item.type != -1">修改受限制人群</el-button>
        </div>
      </div>
      <div
        class="userDetail"
        style="height:120px;line-height:120px;text-align: center;"
        v-if="!item.type"
      >未添加受限用户群</div>
      <div
        class="userDetail"
        style="height:120px;line-height:120px;text-align: center;"
        v-if="item.type == 1"
      >所有用户</div>
      <div class="userDetail" style="padding:20px 0px;" v-if="item.type == 2">
        <span
          style="display:inline-block;margin:10px;font-size:14px;"
          v-for="(ite,idx) in item.detailList"
          :key="idx"
        >{{ite.nickname}} + {{ite.mobileNumber}}</span>
      </div>
    </div>
    <!-- 添加受限制人群弹窗 -->
    <el-dialog
      title="添加受限人群"
      :visible.sync="dialogFormVisible"
      center
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form :model="form">
        <el-form-item>
          <el-radio-group v-model="form.type">
            <el-radio :label="1">所有用户</el-radio>
            <el-radio :label="2">自定义</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入用户手机号多个请用英文逗号隔开,"
            v-model="form.mobileNumber"
            v-if="form.type == 2"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addOrUpdateDetail">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  addOrUpdateOrderAndForum,
  findListOrderAndForum,
  addOrUpdateDetailOrderAndForum,
  removeOrderAndForum
} from "@/network/api";
export default {
  data() {
    return {
      dialogFormVisible: false,
      rules: [],
      form: {
        forumConfigId: "",
        type: 2,
        mobileNumber: ""
      }
    };
  },
  created() {
    this.getRulesList();
  },
  methods: {
    // 获取限制规则
    getRulesList() {
      let parms = {
        category: 3
      };
      findListOrderAndForum({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.rules = [];
          content.forEach(val => {
            let json = {};
            json.disabled = true;
            json.id = val.id;
            json.timesPerDay = val.timesPerDay;
            json.timesPerMonth = val.timesPerMonth;
            json.type = val.type;
            json.detailList = val.detailList;
            this.rules.push(json);
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 添加限制规则
    addLimitRule() {
      this.rules.push({
        disabled: false,
        timesPerDay: "",
        timesPerMonth: "",
        type: -1
      });
    },
    // 修改
    changeRule(index) {
      this.rules[index].disabled = false;
    },
    // 保存
    preserve(data) {
      let rexp = /(^[0-9]\d*$)/;
      if (
        !rexp.test(data.timesPerDay) ||
        !rexp.test(data.timesPerMonth) ||
        data.timesPerDay < 0 ||
        data.timesPerDay > 100 ||
        data.timesPerMonth < 0 ||
        data.timesPerMonth > 1000
      ) {
        this.$message.error("输入格式不正确");
        return;
      }
      let parms = {
        category: 3,
        forumConfigId: data.id ? data.id : "",
        timesPerDay: data.timesPerDay,
        timesPerMonth: data.timesPerMonth
      };
      addOrUpdateOrderAndForum(parms).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          data.disabled = true;
          this.getRulesList();
          this.$message.success("操作成功");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 删除
    deleted(id) {
      this.$confirm("是否确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          let parms = {
            id: id
          };
          removeOrderAndForum(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.getRulesList();
              this.$message.success("操作成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 打开添加/修改限制人群的弹窗
    openDialog(item) {
      this.form.forumConfigId = item.id;
      this.form.type = item.type ? item.type : 2;
      this.form.mobileNumber = "";
      item.detailList.forEach((val, index) => {
        if (index != 0) {
          this.form.mobileNumber += ",";
        }
        this.form.mobileNumber += val.mobileNumber;
      });
      this.dialogFormVisible = true;
    },
    // 添加/修改限制人群
    addOrUpdateDetail() {
      let form = JSON.parse(JSON.stringify(this.form));
      if (form.mobileNumber.indexOf("，") != -1) {
        this.$message.error("多个手机号之间请使用英文逗号隔开");
        return;
      }
      addOrUpdateDetailOrderAndForum(form).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.dialogFormVisible = false;
          this.getRulesList();
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
.presale {
  width: 100%;
  // padding: 20px;
  box-sizing: border-box;
  .itemBox {
    display: flex;
    align-items: center;
    margin-top: 20px;
  }
  .userDetail {
    width: 100%;
    max-height: 600px;
    overflow: auto;
    background-color: #f5f5f5;
    color: #666;
    margin-top: 20px;
  }
}
</style>