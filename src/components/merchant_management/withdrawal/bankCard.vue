<template>
  <div class="bankCard">
    <div class="searchBox" style="margin-top:20px;">
      <div>
        <span>商家姓名：</span>
        <el-input v-model="form.name" style="width:140px;"></el-input>
        <span style="margin-left:20px;">店铺名称：</span>
        <el-input v-model="form.storeName" style="width:140px;"></el-input>
        <span style="margin-left:20px;">申请提现金额：</span>
        <el-input v-model="form.amountStart" style="width:120px;" :maxlength="6"></el-input>
        <span>~</span>
        <el-input v-model="form.amountEnd" style="width:120px;" :maxlength="6"></el-input>
        <span style="margin-left:20px;">申请状态：</span>
        <el-select v-model="form.status" style="width:120px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div style="margin-top:20px;">
        <span class="demonstration">申请时间：</span>
        <el-date-picker
          v-model="time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width:360px;margin-right:20px;"
        ></el-date-picker>
        <el-button type="primary" @click="search(1)">搜索</el-button>
        <el-button type="info" @click="exportMerchantDrawRecord">导出查询内容</el-button>
      </div>
    </div>
    <div class="tabelBox" style="margin-top:40px;">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="编号" align="center" width="100"></el-table-column>
        <el-table-column prop="storeName" label="店铺名称" align="center"></el-table-column>
        <el-table-column prop="mobileNumber" label="电话" align="center"></el-table-column>
        <el-table-column prop label="申请提交时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyAmount" label="申请提现金额" align="center"></el-table-column>
        <el-table-column prop="bankCardNumber" label="银行卡号" align="center"></el-table-column>
        <el-table-column prop="bankAddress" label="开户行" align="center"></el-table-column>
        <el-table-column prop="realName" label="真实姓名" align="center"></el-table-column>
        <el-table-column prop label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status == 1" type="text" @click="transfer(scope.row.id)">转账</el-button>
            <span v-if="scope.row.status == 2">已转账</span>
            <el-button
              type="text"
              @click="showIdCard(scope.row.faceOfIdCard,scope.row.backOfIdCard)"
            >查看资料</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="totalBox">
      <span>总计：{{totalSize}}条</span>
      <el-pagination
        background
        layout="prev, pager, next,jumper"
        :total="totalSize"
        :page-size="10"
        :current-page.sync="currentPage"
        @current-change="pageChange($event)"
      ></el-pagination>
    </div>

    <!-- 查看身份证弹窗 -->
    <el-dialog title :visible.sync="dialogIDCard" width="350px" center>
      <div>身份证正面照：</div>
      <img :src="faceOfIdCard" style="width:300px;height:180px;margin-top:10px;" />
      <div>身份证反面照：</div>
      <img :src="backOfIdCard" style="width:300px;height:180px;margin-top:10px;" />
    </el-dialog>
  </div>
</template>
<script>
import {
  getMerchantDrawList,
  exportMerchantDrawRecord,
  merchantDrawAdopt
} from "@/network/api";
export default {
  data() {
    return {
      totalSize: 0,
      currentPage: 0,
      dialogIDCard: false,
      faceOfIdCard: "",
      backOfIdCard: "",
      form: {
        name: "",
        mobileNumber: "",
        storeName: "",
        amountStart: "",
        amountEnd: "",
        status: "",
        startTime: "",
        endTime: "",
        type: "2"
      },
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "未处理"
        },
        {
          value: "2",
          label: "已处理"
        }
      ],
      time: "",
      tableData: []
    };
  },
  created() {
    this.search(1);
  },
  methods: {
    // 搜索
    search(val) {
      let form = this.form;
      form.pageNumber = val;
      form.pageSize = 10;
      if (this.time) {
        form.startTime = this.time[0].getTime();
        form.endTime = this.time[1].getTime();
      } else {
        form.startTime = "";
        form.endTime = "";
      }
      let b = /^\d+(\.\d{1,2})?$/;
      if (
        (form.amountStart && !b.test(form.amountStart)) ||
        (form.amountEnd && !b.test(form.amountEnd))
      ) {
        this.$message.error("提现金额格式不正确");
        return;
      }
      if (
        form.amountStart &&
        form.amountEnd &&
        Number(form.amountStart) > Number(form.amountEnd)
      ) {
        this.$message.error("申请提现金额前者不可大于后者");
        return;
      }
      getMerchantDrawList({ params: form }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.tableData = content.items;
          this.totalSize = content.totalSize;
          this.currentPage = val;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 导出excel
    exportMerchantDrawRecord() {
      let form = this.form;
      if (this.time) {
        form.startTime = this.time[0].getTime();
        form.endTime = this.time[1].getTime();
      } else {
        form.startTime = "";
        form.endTime = "";
      }
      let b = /^\d+(\.\d{1,2})?$/;
      if (
        (form.amountStart && !b.test(form.amountStart)) ||
        (form.amountEnd && !b.test(form.amountEnd))
      ) {
        this.$message.error("提现金额格式不正确");
        return;
      }
      if (
        form.amountStart &&
        form.amountEnd &&
        Number(form.amountStart) > Number(form.amountEnd)
      ) {
        this.$message.error("申请提现金额前者不可大于后者");
        return;
      }
      exportMerchantDrawRecord(form).then(res => {
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
      a.setAttribute("download", "商户提现列表.xls");
      document.body.appendChild(a);
      a.click();
    },
    // 转账
    transfer(id) {
      this.$confirm("请转账成功后点击此处!", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          let parms = {
            recordId: id
          };
          merchantDrawAdopt(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.search(1);
              this.$message.success("操作成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 查看资料
    showIdCard(faceOfIdCard, backOfIdCard) {
      this.faceOfIdCard = faceOfIdCard;
      this.backOfIdCard = backOfIdCard;
      this.dialogIDCard = true;
    },
    // 翻页
    pageChange(val) {
      this.search(val);
      this.currentPage = val;
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>
<style lang="less" scoped>
.totalBox {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>