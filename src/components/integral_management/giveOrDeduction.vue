<template>
  <div class="forumComments">
    <div class="searchBox">
      <span>用户电话：</span>
      <el-input v-model="form.mobileNumber" style="width: 130px"></el-input>
      <span style="margin-left: 10px">赠送/扣除时间：</span>
      <el-date-picker
        v-model="time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <span style="margin-left: 10px">类型：</span>
      <el-select v-model="form.queryType" style="width: 110px">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button type="primary" style="margin-left: 10px" @click="search(1)"
        >搜索</el-button
      >
      <el-button type="primary" @click="exportExcel">导出查询数据</el-button>
      <el-button type="primary" @click="giveSeed">赠送</el-button>
      <el-button type="primary" @click="deductionSeed">扣除</el-button>
    </div>
    <div class="tableBox">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column
          prop="mobileNumber"
          label="用户电话"
          width="140"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="surplusAmount"
          label="剩余种子数量"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="赠送/扣除时间"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="赠送数量"
          align="center"
        ></el-table-column>
        <el-table-column prop="type" label="类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type == '1'">赠送</span>
            <span v-if="scope.row.type == '2'">扣除</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="赠送备注"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="operator"
          label="操作的后台账号"
          align="center"
        ></el-table-column>
      </el-table>
    </div>
    <div class="totalSizeBox">
      <span>总计：{{ totalSize }}条</span>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalSize"
        :page-size="20"
        :current-page="currentPage"
        @current-change="pageChange($event)"
      >
      </el-pagination>
    </div>
    <!-- 赠送/扣除种子弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
      @close="closeDialogVisible"
    >
      <el-form
        :model="giveOrDeductionForm"
        :rules="rules"
        ref="giveOrDeductionForm"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="用户手机号：" prop="mobileNumber">
          <el-input
            v-model="giveOrDeductionForm.mobileNumber"
            style="width: 160px"
            :maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item :label="dialogTitle + '数量：'" prop="amount">
          <el-input
            v-model="giveOrDeductionForm.amount"
            style="width: 120px"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            v-model="giveOrDeductionForm.remark"
            style="width: 320px"
            :maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('giveOrDeductionForm')"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  getSendSeedRecordList,
  updateUserSeed,
  getSendSeedRecordListByExcel,
} from "@/network/api";
export default {
  data() {
    const mobileNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("不能为空"));
      } else if (!/^1[23456789]\d{9}$/.test(value)) {
        return callback(new Error("格式不正确"));
      } else {
        callback();
      }
    };
    const amount = (rule, value, callback) => {
      let a = /^[0-9]\d*$/;
      if (!value) {
        return callback(new Error("不能为空"));
      } else if (value < 0 || value > 10000) {
        return callback(new Error("值区间：0-10000"));
      } else if (!a.test(value)) {
        return callback(new Error("不可为小数"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      dialogTitle: "",
      totalSize: 0,
      currentPage: 0,
      form: {
        queryType: "",
        mobileNumber: "",
        name: "",
      },
      time: "",
      options: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "1",
          label: "赠送",
        },
        {
          value: "2",
          label: "扣除",
        },
      ],
      tableData: [],
      giveOrDeductionForm: {
        mobileNumber: "",
        amount: "",
        remark: "",
        type: "",
      },
      rules: {
        mobileNumber: {
          validator: mobileNumber,
          trigger: "blur",
        },
        amount: {
          validator: amount,
          trigger: "blur",
        },
      },
    };
  },
  created() {
    this.search(1);
  },
  methods: {
    // 搜索
    search(val) {
      let parms = {
        pageNumber: val ? val : this.currentPage,
        pageSize: 20,
        queryType: this.form.queryType,
        mobileNumber: this.form.mobileNumber,
      };
      if (this.time) {
        parms.beginTime = this.time[0].getTime();
        parms.endTime = this.time[1].getTime();
      } else {
        parms.beginTime = "";
        parms.endTime = "";
      }
      getSendSeedRecordList({ params: parms }).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.tableData = content.items;
          this.totalSize = content.totalSize;
          this.currentPage = val ? val : this.currentPage;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 导出查询数据
    exportExcel() {
      let parms = {
        queryType: this.form.queryType,
        mobileNumber: this.form.mobileNumber,
      };
      if (this.time) {
        parms.beginTime = this.time[0].getTime();
        parms.endTime = this.time[1].getTime();
      } else {
        parms.beginTime = "";
        parms.endTime = "";
      }
      getSendSeedRecordListByExcel(parms).then((res) => {
        this.download(res);
      });
    },
    // 下载文件
    download(data) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data.data]));
      let a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.setAttribute("download", "种子赠送扣除列表.xls");
      document.body.appendChild(a);
      a.click();
    },
    // 打开赠送种子弹窗
    giveSeed() {
      this.dialogTitle = "赠送";
      this.giveOrDeductionForm.type = "1";
      this.dialogVisible = true;
    },
    // 打开扣除种子弹窗
    deductionSeed() {
      this.dialogTitle = "扣除";
      this.giveOrDeductionForm.type = "2";
      this.dialogVisible = true;
    },
    // 关闭赠送/扣除种子弹窗
    closeDialogVisible() {
      // 重置表单-清除错误提示和表单中已经输入的值
      this.$refs["giveOrDeductionForm"].resetFields();
    },
    // 赠送/扣除种子保存
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateUserSeed(this.qs.stringify(this.giveOrDeductionForm)).then(
            (res) => {
              if (res.data.messageCode == "MSG_1001") {
                this.$message.success("操作成功");
                this.dialogVisible = false;
                this.search(1);
              } else {
                this.$message.error(res.data.message);
              }
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 分页改变事件
    pageChange(val) {
      this.currentPage = val;
      this.search(val);
    },
  },
};
</script>
<style lang="less" scoped>
.forumComments {
  padding: 20px;
  box-sizing: border-box;
}

.tableBox {
  margin-top: 40px;
}

.totalSizeBox {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
