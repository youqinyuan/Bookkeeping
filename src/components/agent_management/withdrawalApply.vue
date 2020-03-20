<template>
  <div class="withdrawalApply">
    <!-- 上方搜索条件区域 -->
    <div class="searchBox">
      <span>代理商电话：</span>
      <el-input v-model="form.mobileNumber" style="width:140px;margin-right:20px;"></el-input>
      <span>申请时间：</span>
      <el-date-picker
        v-model="time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <span style="margin-left:20px;">申请状态：</span>
      <el-select v-model="form.status" style="width:130px;margin-right:20px;">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="search(1)">搜索</el-button>
      <el-button type="primary" @click="exportSearchContent">导出查询内容</el-button>
    </div>
    <!-- 下方表格区域 -->
    <div class="tableBox">
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="id" label="申请编号" width="80" align="center"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120" align="center"></el-table-column>
        <el-table-column prop="agentType" label="申请身份" align="center" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.agentType == 1">独家</span>
            <span v-if="scope.row.agentType == 2">非独家</span>
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="代理角色" align="center"></el-table-column>
        <el-table-column prop="createTime" label="申请时间" align="center" width="160">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobileNumber" label="申请人电话" align="center" width="120"></el-table-column>
        <el-table-column prop="referrerMobileNumber" label="推荐人电话" align="center"></el-table-column>
        <el-table-column prop="amount" label="申请提现金额（元）" align="center"></el-table-column>
        <el-table-column prop="realName" label="姓名" align="center"></el-table-column>
        <el-table-column prop="bankCardNumber" label="银行卡卡号" align="center"></el-table-column>
        <el-table-column prop="bankAddress" label="开户行" align="center"></el-table-column>
        <el-table-column prop="balanceStatus" label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.balanceStatus == 2" style="color:#409EFF">已通过</span>
            <span v-if="scope.row.balanceStatus == 1" style="color:#409EFF">审核中</span>
            <el-button v-if="scope.row.balanceStatus == 3" type="text" style="color:#F56C6C">审核拒绝</el-button>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="scope.row.balanceStatus == 1"
              @click="pass(scope.row.id)"
            >通过</el-button>
            <el-button
              type="text"
              v-if="scope.row.balanceStatus == 1"
              @click="refuse(scope.row.id)"
            >拒绝</el-button>
            <el-button
              type="text"
              @click="openIDCardDialog(scope.row.faceOfIdCard,scope.row.backOfIdCard)"
            >查看身份证</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页区域 -->
    <div class="totalSizeBox">
      <span>总计：{{totalSize}}条</span>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalSize"
        :page-size="10"
        :current-page="currentPage"
        @current-change="pageChange($event)"
      ></el-pagination>
    </div>
    <!-- 查看身份证弹窗 -->
    <el-dialog title :visible.sync="dialogIDCard" width="350px" center>
      <div>身份证正面照：</div>
      <img :src="faceOfIdCard" style="width:300px;height:180px;margin-top:10px;" />
      <div>身份证反面照：</div>
      <img :src="backOfIdCard" style="width:300px;height:180px;margin-top:10px;" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="downloadIDCard">下载</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllCityData,
  agentApplyBalance,
  exportApplyBalanceExcel,
  agentPassBalance,
  agentRefuseBalance
} from "@/network/api";
export default {
  data() {
    return {
      totalSize: 0,
      currentPage: 1,
      time: "",
      form: {
        mobileNumber: "",
        beginTime: "",
        endTime: "",
        province: "",
        city: "",
        district: "",
        status: ""
      },
      tableData: [],
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "2",
          label: "已通过"
        },
        {
          value: "1",
          label: "审核中"
        },
        {
          value: "3",
          label: "拒绝"
        }
      ],
      dialogIDCard: false, // 是否显示查看身份证弹窗
      faceOfIdCard: "", //身份证正面照
      backOfIdCard: "" // 身份证反面照
    };
  },
  created() {
    this.search(1);
  },
  methods: {
    // 搜索
    search(val) {
      let form = JSON.parse(JSON.stringify(this.form));
      form.pageNumber = val;
      form.pageSize = 10;
      if (this.time) {
        form.beginTime = this.time[0].getTime();
        form.endTime = this.time[1].getTime();
      } else {
        form.beginTime = "";
        form.endTime = "";
      }
      agentApplyBalance({ params: form }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let data = res.data.content;
          this.tableData = data.items;
          this.totalSize = data.totalSize;
          this.currentPage = val;
        } else {
          this.$message.error(res.data.content);
        }
      });
    },
    // 导出查询内容
    exportSearchContent() {
      let form = JSON.parse(JSON.stringify(this.form));
      if (this.time) {
        form.beginTime = this.time[0].getTime();
        form.endTime = this.time[1].getTime();
      } else {
        form.beginTime = "";
        form.endTime = "";
      }
      exportApplyBalanceExcel(form).then(res => {
        this.downloadBlob(res);
      });
    },

    // 下载文件
    downloadBlob(data) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data.data]));
      let a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.setAttribute("download", "提现申请.xls");
      document.body.appendChild(a);
      a.click();
    },
    // 通过
    pass(id) {
      this.$confirm("请打款后点击通过！", "", {
        confirmButtonText: "确认",
        center: true,
        showCancelButton: false,
        closeOnClickModal: false
      })
        .then(() => {
          let data = {
            id: id
          };
          agentPassBalance(data).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("操作成功");
              this.search(1);
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 拒绝
    refuse(id) {
      this.$confirm("确定拒绝该代理商提现吗？", "", {
        confirmButtonText: "确认",
        center: true,
        showCancelButton: false,
        closeOnClickModal: false
      })
        .then(() => {
          let data = {
            id: id
          };
          agentRefuseBalance(data).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("操作成功");
              this.search(1);
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 查看身份证
    openIDCardDialog(faceOfIdCard, backOfIdCard) {
      this.faceOfIdCard = faceOfIdCard;
      this.backOfIdCard = backOfIdCard;
      this.dialogIDCard = true;
    },
    // 下载身份证
    downloadIDCard(data) {
      this.download(this.faceOfIdCard, "身份证正面照");
      this.download(this.backOfIdCard, "身份证反面照");
    },
    // 下载文件
    download(data, name) {
      if (!data) {
        return;
      }
      this.getUrlBase64(data).then(base64 => {
        let a = document.createElement("a");
        a.style.display = "none";
        a.download = name;
        a.href = base64;
        document.body.appendChild(a);
        a.click();
      });
    },
    // 将要下载的图片链接转换为base64格式，防止发生路由跳转
    getUrlBase64(url) {
      return new Promise(resolve => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        let img = new Image();
        img.crossOrigin = "Anonymous"; //允许跨域
        img.src = url;
        img.onload = function() {
          canvas.height = 300;
          canvas.width = 300;
          ctx.drawImage(img, 0, 0, 300, 300);
          let dataURL = canvas.toDataURL("image/png");
          canvas = null;
          resolve(dataURL);
        };
      });
    },
    // 分页改变事件
    pageChange(val) {
      this.currentPage = val;
      this.search(val);
    }
  }
};
</script>
<style lang="less" scoped>
.withdrawalApply {
  padding: 20px;
  box-sizing: border-box;
  .tableBox {
    margin-top: 20px;
  }
  .totalSizeBox {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }
}
</style>