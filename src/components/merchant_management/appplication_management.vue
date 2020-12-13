<template>
  <div class="contents">
    <div class="top">
      <div class="inline">
        <span>账户：</span>
        <el-input class="inp" v-model="form.mobileNumber" :maxlength="11"></el-input>
      </div>
      <div class="inline">
        <span>所属行业：</span>
        <el-select v-model="form.businessId" placeholder="请选择" style="width:140px;">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="inline">
        <span>代理上级：</span>
        <el-input class="inp" v-model="form.agentMobileNumber" :maxlength="11"></el-input>
      </div>
      <div class="inline">
        <span>申请时间：</span>
        <el-date-picker v-model="form.beginTime" type="date" placeholder="选择开始日期"></el-date-picker>
        <el-date-picker v-model="form.endTime" type="date" placeholder="选择结束日期"></el-date-picker>
      </div>

      <el-button type="primary" @click="search(1)">搜 索</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%;margin-top:20px;"
    >
      <el-table-column prop="id" label="申请编号" align="center"></el-table-column>
      <el-table-column prop label="实名信息" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.name}}</div>
          <div>{{scope.row.idNumber}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="mobileNumber" label="账户(联系方式)" align="center"></el-table-column>
      <el-table-column prop="businessName" label="所属行业" align="center"></el-table-column>
      <el-table-column prop="storeName" label="店铺名称" align="center"></el-table-column>
      <el-table-column prop label="店铺logo" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="seeLogo(scope.row.logoKey)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="areaName" label="所在区域" align="center"></el-table-column>
      <el-table-column prop="storeAddress" label="店铺地址" align="center"></el-table-column>
      <el-table-column prop="addressDetail" label="详细地址" align="center"></el-table-column>
      <el-table-column prop="agentMobileNumber" label="代理商" align="center"></el-table-column>
      <el-table-column prop label="营业执照" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="seeBusinessLicense(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="申请时间" align="center">
        <template slot-scope="scope">{{scope.row.createTime | dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="name" label="操作" align="center" width="200">
        <template slot-scope="scope">
          <!-- <span @click="seeDetail(scope.row)" class="handle">查看详情</span> -->
          <el-button
            type="text"
            v-if="scope.row.status == 1"
            @click="openDialogPass(scope.row.id)"
          >通过</el-button>
          <span v-if="scope.row.status == 2">已通过</span>
          <el-button type="text" v-if="scope.row.status == 1" @click="refuse(scope.row)">驳回</el-button>
          <span v-if="scope.row.status == 3">已驳回</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="bot">
      <span>总计:{{total}}条</span>
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 查看logo -->
    <el-dialog
      :title="dialogVisibleTitle"
      :visible.sync="dialogVisible_logo"
      width="600px"
      :close-on-click-modal="false"
      center
    >
      <img
        style="width:560px;height:400px;display:block;margin:0 auto;"
        :src="dialogVisibleImgs_logo"
        v-if="dialogVisibleImgs_logo"
      />
      <div
        v-else
        style="width:560px;height:400px;display:block;margin:0 auto;text-align:center;line-height:400px;"
      >无</div>
    </el-dialog>
    <!-- 查看营业执照 -->
    <el-dialog
      :title="dialogVisibleTitle"
      :visible.sync="dialogVisible"
      width="620px"
      :close-on-click-modal="false"
      center
    >
      <div
        style="width:580px;height:420px;margin:0 auto;overflow-y: scroll;"
        v-if="dialogVisibleImgs.length>0"
      >
        <img
          style="width:560px;height:400px;display:block;"
          v-for="item in dialogVisibleImgs"
          :key="item"
          :src="item"
        />
      </div>
      <div
        v-else
        style="width:580px;height:420px;text-align:center;line-height:420px;margin:0 auto;"
      >无</div>
    </el-dialog>

    <!-- 审核通过弹窗 -->
    <el-dialog
      title="通过后将生成一个新的商家"
      :visible.sync="dialogPass"
      width="400px"
      :close-on-click-modal="false"
    >
      <span>经营模式：</span>
      <el-select v-model="model" style="width:140px;">
        <el-option
          v-for="item in modelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPass = false">取 消</el-button>
        <el-button type="primary" @click="pass">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMerchantBusinessList,
  getMerchantAuditList,
  getLicenseImage,
  // getMerchantAuditListExcel,
  changeAuditStatus
} from "@/network/api";
export default {
  props: {},
  data() {
    return {
      dialogVisible_logo: false, // 查看logo弹窗
      dialogVisible: false, // 查看营业执照弹窗
      dialogVisibleTitle: "", // 查看logo和营业执照弹窗标题
      dialogVisibleImgs_logo: "", //logo图片
      dialogVisibleImgs: [], //营业执照图片
      dialogPass: false,
      id: "",
      model: 1,
      modelOptions: [
        {
          value: 1,
          label: "全托管"
        },
        {
          value: 2,
          label: "半托管"
        }
      ],
      form: {
        pageNumber: "",
        pageSize: 10,
        mobileNumber: "",
        businessId: "",
        agentMobileNumber: "",
        beginTime: "",
        endTime: ""
      },
      options: [
        {
          id: "",
          name: "全部"
        }
      ],
      tableData: [],
      currentPage: 1,
      total: 0
    };
  },
  created() {
    this.getMerchantBusinessList();
    this.search(1);
  },
  methods: {
    // 获取行业分类
    getMerchantBusinessList() {
      getMerchantBusinessList().then(res => {
        if (res.data.content) {
          this.options = this.options.concat(res.data.content);
        }
      });
    },

    // 获取申请列表
    getMerchantAuditList(parms) {
      getMerchantAuditList({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.tableData = res.data.content.items;
          this.total = res.data.content.totalSize;
        }
      });
    },

    // 翻页
    handleCurrentChange(val) {
      this.search(val);
      this.currentPage = val;
    },

    // 搜索
    search(val) {
      let form = JSON.parse(JSON.stringify(this.form));
      form.pageNumber = val;
      form.beginTime = form.beginTime ? new Date(form.beginTime).getTime() : "";
      form.endTime = form.endTime ? new Date(form.endTime).getTime() : "";

      if (form.beginTime && form.endTime) {
        if (form.beginTime > form.endTime) {
          this.$message.error("请正确输入时间");
          return;
        }
      }
      this.getMerchantAuditList(form);
      this.currentPage = 1;
    },

    // seeDetail(row) {
    //   this.$router.push({
    //     path: "/appplicationDetails",
    //     query: {
    //       id: row.id
    //     }
    //   });
    // },

    // 查看logo
    seeLogo(img) {
      this.dialogVisibleTitle = "商家logo";
      this.dialogVisibleImgs_logo = img;
      this.dialogVisible_logo = true;
    },
    // 查看营业执照
    seeBusinessLicense(id) {
      let parms = {
        id: id
      };
      getLicenseImage({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.dialogVisibleTitle = "商家营业执照";
          this.dialogVisibleImgs = res.data.content;
          this.dialogVisible = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 打开审核通过弹窗
    openDialogPass(id) {
      this.id = id;
      this.dialogPass = true;
    },
    // 通过
    pass() {
      let parms = {
        id: this.id,
        status: 2,
        model: this.model
      };
      changeAuditStatus(this.qs.stringify(parms)).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.dialogPass = false;
          this.$message.success("操作成功");
          this.search(1);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 拒绝
    refuse(row) {
      this.$prompt("请填写驳回的理由", "驳回申请", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPlaceholder: "请填写驳回的理由与修改意见",
        inputType: "textarea",
        center: true,
        inputPattern: /\S/,
        inputErrorMessage: "原因不能为空"
      })
        .then(({ value }) => {
          let parms = {
            id: row.id,
            status: 3,
            reason: value
          };
          changeAuditStatus(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success(res.data.message);
              this.search(1);
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

<style scoped lang="less">
.inp {
  width: 140px;
}
.inline {
  display: inline-block;
  margin-bottom: 20px;
  margin-right: 15px;
}
.bot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
</style>    
