<template>
  <div class="ten-percent_pay">
    <div class="title">
      <h3>一折购分期支付规则</h3>
      <el-button type="primary" @click="addLimitRule">添加规则</el-button>
    </div>
    <div v-for="(item,index) in rulesList" :key="index">
      <div class="itemBox">
        <div style="margin-right:40px;">{{item.topic.title}}</div>
        <div class="handle">
          <el-button type="text" @click="changeRule(item.topic.id)">修改规则</el-button>
          <el-button
            type="text"
            style="color:#67C23A;"
            v-if="item.topic.id !== -1 && item.topic.id !== -2"
            @click="removeTopic(item.topic.id)"
          >删除规则</el-button>
          <el-button
            type="text"
            @click="openDialog(item,'添加使用人群')"
            v-if="item.topic.id !== -1 && item.topic.id !== -2 && item.detailList.length == 0"
          >添加使用人群</el-button>
          <el-button
            type="text"
            @click="openDialog(item,'修改使用人群')"
            v-if="item.topic.id !== -1 && item.topic.id !== -2 && item.detailList.length > 0"
          >修改使用人群</el-button>
        </div>
      </div>
      <div
        class="userDetail"
        style="height:120px;line-height:120px;text-align: center;"
        v-if="item.detailList.length == 0 && item.topic.id !== -1 && item.topic.id !== -2"
      >未添加受限用户群</div>
      <div
        class="userDetail"
        style="padding:20px 0px;"
        v-if="item.detailList.length > 0 && item.topic.id !== -1 && item.topic.id !== -2"
      >
        <span
          style="display:inline-block;margin:10px;font-size:14px;"
          v-for="(ite,idx) in item.detailList"
          :key="idx"
        >{{ite.nickname}} + {{ite.mobileNumber}}</span>
      </div>
    </div>
    <!-- 添加/修改规则弹窗 -->
    <el-dialog
      title="添加规则"
      :visible.sync="dialogFormVisible_rule"
      :close-on-click-modal="false"
      width="800px"
    >
      <el-form :model="formRules" ref="formRules" :rules="payRules">
        <el-form-item prop="title">
          <span>规则名称：</span>
          <el-input
            v-model="formRules.title"
            style="width:330px;"
            :maxlength="20"
            :disabled="topicId == -1 || topicId == -2"
          ></el-input>
          <el-button type="text" style="margin-left:10px;" @click="addRules_item">添加</el-button>
        </el-form-item>
        <div v-for="(item,index) in formRules.configList" :key="index" style="margin-top:20px;">
          <div style="display:flex;">
            <el-form-item
              :prop="'configList.'+index+'.periodMin'"
              :rules="payRules.configList.period"
            >
              <span>返现期数在</span>
              <el-input v-model="item.periodMin" style="width:100px;"></el-input>-
            </el-form-item>
            <el-form-item
              :prop="'configList.'+index+'.periodMax'"
              :rules="payRules.configList.period"
            >
              <el-input v-model="item.periodMax" style="width:100px;"></el-input>
              <span>之间可选择分期支付</span>
              <i
                class="el-icon-delete"
                style="color:#409EFF"
                @click="delRules_item(index)"
                v-if="index > 0"
              ></i>
            </el-form-item>
          </div>
          <div style="display:flex;align-items:center;flex-wrap: wrap;">
            <span>分期期数</span>
            <el-form-item
              :prop="`configList.${index}.periodInstallment.${idx}.num`"
              style="padding:0px;margin:0px;"
              v-for="(ite,idx) in formRules.configList[index].periodInstallment"
              :key="idx"
              :rules="payRules.configList.num"
            >
              <el-input v-model="ite.num" style="width:65px;margin-left:10px;margin-top:20px;"></el-input>
              <i
                class="el-icon-close"
                style="color:#409EFF;position:absolute;right:-4px;top:15px;"
                @click="delRules_num(index,idx)"
              ></i>
            </el-form-item>
            <el-button type="text" style="margin-left:10px;" @click="addRules_num(index)">添加</el-button>
          </div>
          <div
            style="width:100%;height:1px;background-color:#d4d4d4;margin-top:20px;"
            v-if="index !== formRules.configList.length -1"
          ></div>
        </div>
      </el-form>
      <el-button type="primary" style="margin-top:20px;" @click="submitForm('formRules')">保存</el-button>
    </el-dialog>

    <!-- 添加受限制人群弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      center
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form :model="form" ref="form">
        <el-form-item>
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入用户手机号多个请用英文逗号隔开,"
            v-model="form.mobileNumber"
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
  findTopicList,
  addOrUpdateTopicUser,
  findConfig,
  addOrUpdateTopic,
  removeTopic
} from "@/network/api";
export default {
  data() {
    const period = (rule, value, callback) => {
      let a = /^(\d+\.\d{1,1}|\d+)$/;
      let b = /^[1-9]\d*$/;
      if (value < 0.5 || value > 2) {
        callback(new Error("值区间：0.5-2"));
      } else if (value < 1 && !a.test(value)) {
        callback(new Error("最多保留1位小数"));
      } else if (value >= 1 && !b.test(value)) {
        callback(new Error("整数"));
      } else {
        callback();
      }
    };
    const num = (rule, value, callback) => {
      let a = /^[1-9]\d*$/;
      if (value < 2 || value > 100) {
        callback(new Error("值区间:2-100"));
      } else if (!a.test(value)) {
        callback(new Error("整数"));
      } else {
        callback();
      }
    };
    return {
      topicId: "",
      dialogFormVisible: false,
      dialogTitle: "",
      dialogFormVisible_rule: false,
      rulesList: [],
      formRules: {
        title: "",
        configList: [
          {
            periodMin: "",
            periodMax: "",
            periodInstallment: [{ num: "" }]
          }
        ]
      },
      form: {
        topicId: "",
        mobileNumber: ""
      },
      payRules: {
        title: [{ required: true, message: "请输入规则名称", trigger: "blur" }],
        configList: {
          period: { validator: period, trigger: "blur" },
          num: { validator: num, trigger: "blur" }
        }
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
        category: 2
      };
      findTopicList({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.rulesList = res.data.content;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 添加限制规则
    addLimitRule() {
      this.topicId = "";
      this.formRules = {
        title: "",
        configList: [
          {
            periodMin: "",
            periodMax: "",
            periodInstallment: [{ num: "" }]
          }
        ]
      };
      this.dialogFormVisible_rule = true;
    },
    // 修改限制规则
    changeRule(id) {
      this.topicId = id;
      let parms = {
        topicId: id
      };
      findConfig({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let form = res.data.content;
          if (form.configList.length == 0) {
            this.formRules = {
              topicId: id,
              title: form.title,
              configList: [
                {
                  periodMin: "",
                  periodMax: "",
                  periodInstallment: [{ num: "" }]
                }
              ]
            };
          } else {
            form.configList.forEach(val => {
              val.periodInstallment = val.periodInstallment.split(",");
              let arr = [];
              val.periodInstallment.forEach((val, index) => {
                let json = {
                  num: val
                };
                arr.push(json);
              });
              val.periodInstallment = arr;
            });
            this.formRules = form;
          }
          this.dialogFormVisible_rule = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 删除规则
    removeTopic(id) {
      this.$confirm("确定删除此规则嘛?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        closeOnClickModal: false
      })
        .then(() => {
          let parms = {
            id: id
          };
          removeTopic(parms).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("删除成功");
              this.getRulesList();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 弹窗中添加规则
    addRules_item() {
      this.formRules.configList.push({
        periodMin: "",
        periodMax: "",
        periodInstallment: [{ num: "" }]
      });
    },
    // 弹窗中删除规则
    delRules_item(index) {
      this.formRules.configList.splice(index, 1);
    },
    // 弹窗中添加规则期数
    addRules_num(index) {
      this.formRules.configList[index].periodInstallment.push({ num: "" });
    },
    // 弹窗中删除规则期数
    delRules_num(index, idx) {
      this.formRules.configList[index].periodInstallment.splice(idx, 1);
    },
    // 添加/修改规则 保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let form = JSON.parse(JSON.stringify(this.formRules));
          // 把periodInstallment字段中的值变为以逗号分隔的字符串
          form.configList.forEach(val => {
            let arr = [];
            val.periodInstallment.forEach((val, index) => {
              arr[index] = val.num;
            });
            val.periodInstallment = arr.join(",");
          });
          addOrUpdateTopic(form).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.dialogFormVisible_rule = false;
              this.$message.success("保存成功");
              this.getRulesList();
            } else {
              this.$message.error(res.data.message);
            }
          });
        } else {
          console.log("error submit!!");
        }
      });
    },
    // 打开添加/修改限制人群的弹窗
    openDialog(item, title) {
      this.dialogTitle = title;
      this.form.topicId = item.topic.id;
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
      addOrUpdateTopicUser(form).then(res => {
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
.ten-percent_pay {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #999;
    padding-bottom: 10px;
  }
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