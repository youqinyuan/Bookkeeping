<template>
  <div class="stagesApply">
    <div class="searchTitle">
      <span>电话：</span>
      <el-input v-model="mobileNumber" style="width:140px;margin-right:10px;"></el-input>
      <span>申请时间：</span>
      <el-date-picker
        v-model="time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <span style="margin-left:10px;">商品名称：</span>
      <el-input v-model="goodsName" style="width:200px;margin-right:10px;"></el-input>
      <span>状态：</span>
      <el-select v-model="status" style="width:100px;margin-right:10px;">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="search(1)">搜索</el-button>
      <el-button type="info" @click="exportContent">导出查询全部内容</el-button>
    </div>
    <div class="tableBox">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" align="center" label="申请编号" width="80"></el-table-column>
        <el-table-column prop="nickName" align="center" label="昵称" width="140"></el-table-column>
        <el-table-column prop="mobileNumber" align="center" label="电话" width="110"></el-table-column>
        <el-table-column prop="createTime" align="center" label="申请时间" width="160">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="realName" align="center" label="姓名" width="100"></el-table-column>
        <el-table-column prop="idCard" align="center" label="身份证号码" width="180"></el-table-column>
        <el-table-column prop="issuingAuthority" align="center" label="签证机关"></el-table-column>
        <el-table-column prop="name" align="center" label="有效期限" width="200">
          <template slot-scope="scope">
            <span>{{scope.row.validBeginTime | dateFormat}}</span>
            <span>至</span>
            <span>{{scope.row.validEndTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="jobTitle" align="center" label="职位"></el-table-column>
        <el-table-column prop="email" align="center" label="个人邮箱" width="180"></el-table-column>
        <el-table-column prop="companyName" align="center" label="公司名称" width="160"></el-table-column>
        <el-table-column prop="companyTel" align="center" label="公司电话" width="120"></el-table-column>
        <el-table-column prop="districtName" align="center" label="工作地址" width="160"></el-table-column>
        <el-table-column prop="detailedAddress" align="center" label="详细地址" width="160"></el-table-column>
        <el-table-column prop="familyContactName" align="center" label="家庭联系人姓名" width="120"></el-table-column>
        <el-table-column prop="familyContactPhone" align="center" label="联系人电话" width="120"></el-table-column>
        <el-table-column prop align="center" label="关系">
          <template slot-scope="scope">
            <span v-if="scope.row.familyRelationship == 1">父亲</span>
            <span v-if="scope.row.familyRelationship == 2">母亲</span>
            <span v-if="scope.row.familyRelationship == 3">兄弟</span>
            <span v-if="scope.row.familyRelationship == 4">姐妹</span>
            <span v-if="scope.row.familyRelationship == 5">爱人</span>
          </template>
        </el-table-column>
        <el-table-column prop="otherContactName" align="center" label="其他联系人姓名" width="160"></el-table-column>
        <el-table-column prop="otherContactPhone" align="center" label="联系人电话" width="120"></el-table-column>
        <el-table-column prop align="center" label="关系">
          <template slot-scope="scope">
            <span v-if="scope.row.otherRelationship == 1">同事</span>
            <span v-if="scope.row.otherRelationship == 2">朋友</span>
            <span v-if="scope.row.otherRelationship == 3">亲戚</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" align="center" label="申请商品" width="160"></el-table-column>
        <el-table-column prop="specDesc" align="center" label="规格" width="160"></el-table-column>
        <el-table-column prop="orgPrice" align="center" label="原价"></el-table-column>
        <el-table-column prop="status" align="center" label="审核状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">未申请</span>
            <span v-if="scope.row.status == 1">审核中</span>
            <span v-if="scope.row.status == 2">拒绝</span>
            <span v-if="scope.row.status == 3">通过</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" align="center" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="scope.row.status == 1"
              @click="refuse(scope.row.id,scope.row.installmentId)"
            >拒绝</el-button>
            <el-button
              type="text"
              v-if="scope.row.status == 2"
              @click="viewReasons(scope.row.refuseReason)"
            >查看拒绝原因</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="totalBox">
      <span>总计：{{totalSize}}条</span>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalSize"
        :current-page="currentPage"
        :page-size="10"
        @current-change="pageChange($event)"
      ></el-pagination>
    </div>
    <!-- 查看拒绝原因弹框 -->
    <el-dialog title="拒绝原因：" :visible.sync="centerDialogVisible" width="30%" :show-close="false">
      <span>{{refuseReason}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  applyGoodsStages,
  refuseStages,
  exportInstallmentGoodsExcel
} from "@/network/api";
export default {
  data() {
    return {
      mobileNumber: null, // 电话
      totalSize: 0,
      goodsName: null, // 商品名称
      currentPage: 1,
      time: "", // 时间
      options: [
        {
          value: null,
          label: "全部"
        },
        {
          value: "1",
          label: "审核中"
        },
        {
          value: "2",
          label: "拒绝"
        }
      ],
      status: null, // 状态
      tableData: [],
      centerDialogVisible: false, // 是否显示查看拒绝原因弹窗
      refuseReason: "" // 拒绝原因
    };
  },
  created() {
    this.search(1);
  },
  methods: {
    // 搜索-获取商品分期购申请数据
    search(val) {
      let beginTime = "";
      let endTime = "";
      if (this.time) {
        beginTime = this.time[0].getTime();
        endTime = this.time[1].getTime();
      }
      let parms = {
        pageNumber: val,
        pageSize: 10,
        mobileNumber: this.mobileNumber,
        beginTime: beginTime,
        endTime: endTime,
        goodsName: this.goodsName,
        status: this.status
      };
      applyGoodsStages({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let data = res.data.content;
          this.tableData = data.items;
          this.totalSize = data.totalSize;
        } else {
          this.$message.error(res.data.message);
        }
      });
      this.currentPage = val;
    },

    // 导出查询内容
    exportContent() {
      let beginTime = "";
      let endTime = "";
      if (this.time) {
        beginTime = this.time[0].getTime();
        endTime = this.time[1].getTime();
      }
      let parms = {
        mobileNumber: this.mobileNumber,
        beginTime: beginTime,
        endTime: endTime,
        goodsName: this.goodsName,
        status: this.status
      };
      exportInstallmentGoodsExcel(parms).then(res => {
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
      a.setAttribute("download", "分期购数据列表.xls");
      document.body.appendChild(a);
      a.click();
    },

    // 拒绝
    refuse(id, installmentId) {
      this.$prompt("填写拒绝原因：", "", {
        confirmButtonText: "拒绝",
        cancelButtonText: "取消",
        inputType: "textarea",
        closeOnClickModal: false,
        showClose: false,
        inputPattern: /\S/,
        inputErrorMessage: "请填写拒绝原因"
      })
        .then(({ value }) => {
          if (value.length > 100) {
            this.$message.error("拒绝原因不可超过100字符");
            return;
          }
          let parms = {
            id: id,
            installmentId: installmentId,
            refuseReason: value
          };
          refuseStages(parms).then(res => {
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

    // 查看拒绝原因
    viewReasons(refuseReason) {
      this.refuseReason = refuseReason;
      this.centerDialogVisible = true;
    },

    // 分页事件
    pageChange(val) {
      this.search(val);
    }
  }
};
</script>
<style lang="less" scoped>
.stagesApply {
  padding: 20px;
  box-sizing: border-box;
  .tableBox {
    margin-top: 20px;
  }
  .totalBox {
    width: 100%;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>