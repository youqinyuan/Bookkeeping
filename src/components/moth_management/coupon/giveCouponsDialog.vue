<template>
  <div class="giveCouponsDialog">
    <el-dialog
      title="赠送优惠券"
      :visible.sync="giveCouponsDialog"
      width="600px"
      :close-on-click-modal="false"
      center
      @close="closeCouponsDialog"
    >
      <!-- 个人 -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="个人" name="first">
          <div style="margin-top: 10px">
            <span>选择个人用户：</span>
            <el-input
              v-model="number"
              :maxlength="11"
              placeholder="请输入手机号"
              style="width: 160px; margin-right: 20px"
            ></el-input>
            <el-button @click="addNumber">确认</el-button>
          </div>
          <div class="numberBox">
            <div
              class="number"
              v-for="(item, index) in form.mobileNumber"
              :key="index"
            >
              {{ item }}
              <span class="close" @click="delNumber(index)">X</span>
            </div>
          </div>
          <div style="margin-top: 10px; margin-left: 14px">
            <span>优惠券数量：</span>
            <el-input-number
              v-model="form.presentQuantity"
              :min="1"
            ></el-input-number>
          </div>
        </el-tab-pane>
        <!-- 批量导入 -->
        <el-tab-pane label="批量导入" name="second">
          <div class="exportBox">
            <div class="file">
              点击上传
              <input
                type="file"
                @change="handleSuccess($event)"
                v-if="inputFlag"
              />
            </div>
            <span v-if="filename">已选：{{ filename }}</span>
            <el-link
              type="primary"
              style="display: block; margin-top: 30px"
              @click="downTemplate"
              >下载模板</el-link
            >
          </div>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-if="activeName == 'first'"
          @click="giveCoupon_person"
          >确认赠送</el-button
        >
        <el-button
          type="primary"
          v-if="activeName == 'second'"
          @click="giveCoupon_batch"
          >确认赠送</el-button
        >
      </span>
    </el-dialog>

    <!-- 赠送结果弹窗 -->
    <el-dialog
      title=""
      :visible.sync="resultDialog"
      width="300px"
      :close-on-click-modal="false"
      :show-close="false"
      center
    >
      <div class="resultBox">
        <span>赠送成功</span>
        <el-link
          type="primary"
          style="display: block; margin-top: 30px"
          @click="downResult"
          >下载赠送结果</el-link
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="
            resultDialog = false;
            batchCode = '';
          "
          >确认</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  presentPersonally,
  check4PresentPersonally,
  getExcelTemplate,
  importExcel4Present,
  getExcel4PresentResult,
} from "@/network/api";
export default {
  data() {
    return {
      activeName: "first",
      inputFlag: false, // 控制上传按钮是否存在-以便关闭弹窗时清除已经上传的文件
      giveCouponsDialog: false,
      resultDialog: false,
      form: {
        id: "",
        mobileNumber: [],
        presentQuantity: "1",
      },
      number: "",
      excel: "",
      filename: "", // 上传的文件名
      batchCode: "", // 批次号
    };
  },
  methods: {
    // 打开弹窗
    open(id) {
      this.form.id = id;
      this.inputFlag = true;
      this.giveCouponsDialog = true;
    },
    // 添加号码
    addNumber() {
      if (!this.number) {
        return;
      }
      if (this.form.mobileNumber.indexOf(this.number) != "-1") {
        this.$message.error("此账号已重复了");
        return;
      }
      if (this.form.mobileNumber.length >= 9) {
        this.$message.error("最多添加9人");
        return;
      }
      let parms = {
        id: this.form.id,
        mobileNumber: this.number,
        presentQuantity: this.form.presentQuantity,
      };
      check4PresentPersonally(parms).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.form.mobileNumber.push(this.number);
          this.number = "";
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 删除号码
    delNumber(index) {
      this.form.mobileNumber.splice(index, 1);
    },
    // 确认赠送 - 个人
    giveCoupon_person() {
      let parms = JSON.parse(JSON.stringify(this.form));
      if (parms.mobileNumber.length == 0) {
        this.$message.error("请添加要赠送的账号");
        return;
      }
      let a = /^[1-9]\d*$/;
      if (!a.test(parms.presentQuantity)) {
        this.$message.error("优惠券数量必须为正整数");
        return;
      }
      parms.mobileNumber = parms.mobileNumber.join(",");
      presentPersonally(parms).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("操作成功");
          this.giveCouponsDialog = false;
          this.form.mobileNumber = [];
          this.form.presentQuantity = "1";
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 下载模板
    downTemplate() {
      getExcelTemplate().then((res) => {
        this.download(res, "赠送优惠券.xls");
      });
    },
    // 下载文件
    download(data, fileName) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data.data]));
      let a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.setAttribute("download", fileName);
      document.body.appendChild(a);
      a.click();
    },

    // 上传excel文件
    handleSuccess(e) {
      let chooseFile = e.target.files[0];
      let filename = chooseFile.name;
      let index = filename.lastIndexOf(".");
      if (index == -1 || index == filename.length) {
        this.$message.error("文件格式错误！"); //文件没有扩展名
        return;
      }
      let suffix = filename.substring(index + 1);
      if (suffix !== "xls" && suffix !== "xlsx") {
        this.$message.error("文件格式错误！");
        return;
      }
      this.excel = chooseFile;
      this.filename = filename;
    },
    // 确定赠送-批量
    giveCoupon_batch() {
      if (!this.excel) {
        this.$message.error("请上传赠送excel");
        return;
      }
      let formData = new FormData();
      formData.append("id", this.form.id);
      formData.append("excel", this.excel);
      importExcel4Present(formData).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.batchCode = res.data.content;
          this.giveCouponsDialog = false;
          this.resultDialog = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 关闭赠送优惠券弹窗
    closeCouponsDialog() {
      this.activeName = "first";
      this.form.mobileNumber = [];
      this.form.presentQuantity = "1";
      this.number = "";
      this.excel = "";
      this.filename = "";
      this.inputFlag = false;
    },
    // 下载赠送结果
    downResult() {
      let parms = {
        batchCode: this.batchCode,
      };
      getExcel4PresentResult(parms).then((res) => {
        this.batchCode = "";
        this.download(res, "赠送结果.xls");
      });
    },
  },
};
</script>
<style lang="less" scoped>
.numberBox {
  margin-left: 100px;
  display: flex;
  flex-wrap: wrap;
  .number {
    width: 104px;
    padding: 8px 0px;
    margin-top: 16px;
    margin-right: 20px;
    position: relative;
    text-align: center;
    background-color: #cccccc;
    border-radius: 6px;
    .close {
      position: absolute;
      display: block;
      width: 16px;
      height: 16px;
      border-radius: 16px;
      text-align: center;
      line-height: 16px;
      background-color: #fff;
      border: 1px solid #d4d4d4;
      color: red;
      top: -8px;
      right: -8px;
      cursor: pointer;
      font-size: 12px;
    }
  }
}
.exportBox {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .file {
    position: relative;
    display: inline-block;
    background: #d0eeff;
    border: 1px solid #99d3f5;
    border-radius: 4px;
    padding: 4px 12px;
    overflow: hidden;
    color: #1e88c7;
    text-decoration: none;
    text-indent: 0;
    line-height: 30px;
    input {
      position: absolute;
      font-size: 100px;
      right: 0;
      top: 0;
      opacity: 0;
    }
  }
  .file:hover {
    background: #aadffd;
    border-color: #78c3f3;
    color: #004974;
    text-decoration: none;
  }
}
.resultBox {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  span {
    font-size: 18px;
  }
}
</style>