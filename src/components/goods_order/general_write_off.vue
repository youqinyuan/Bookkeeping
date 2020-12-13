<template>
  <div class="selfSupportOrder">
    <div class="order-searchTop">
      <div class="searchTop-left">
        <span class="inputBox">
          订单编号:
          <el-input
            class="inputStyle"
            v-model="form.orderNumber"
            placeholder="请输入订单编号"
            style="width:210px;"
          ></el-input>
        </span>
        <span class="inputBox">
          用户电话:
          <el-input
            class="inputStyle"
            v-model.number="form.mobileNumber"
            placeholder="请输入用户电话"
            maxlength="11"
          ></el-input>
        </span>
        <span class="inputBox">
          订单状态:
          <el-select v-model="form.latestStatus" placeholder="请选择">
            <el-option
              v-for="item in selStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </span>
        <span class="inputBox">
          行业分类:
          <el-select v-model="form.businessId" placeholder="请选择">
            <el-option
              v-for="item in industryClassList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </span>
        <span class="inputBox">
          所属商家:
          <el-input class="inputStyle" v-model="form.business" placeholder="关键字查询"></el-input>
        </span>
        <span class="inputBox">
          购买方式:
          <el-select v-model="form.buyMode" placeholder="请选择">
            <el-option
              v-for="item in buyModeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </span>
        <span class="inputBox">
          下单时间：
          <el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dateChange"
          ></el-date-picker>
        </span>
        <span class="inputBox">
          <el-button type="primary" @click="search(1)">搜索</el-button>
          <el-button type="primary" @click="exportExcel">导出</el-button>
        </span>
      </div>
    </div>
    <div class="order-table">
      <el-table
        :data="tableData"
        border
        ref="multipleTable"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="orderNumber" label="订单编号" width="200" align="center"></el-table-column>
        <el-table-column prop label="用户" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.userName}}</div>
            <div>{{scope.row.mobileNumber}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="orderAmount" label="订单金额" align="center" width="120"></el-table-column>
        <el-table-column prop label="购买方式" width="120" align="center">
          <template slot-scope="scope" align="center">
            <span v-if="scope.row.buyMode==1">普通拼团</span>
            <span v-if="scope.row.buyMode==2">一折拼团</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalDiscount" label="总优惠金额" align="center" width="120"></el-table-column>
        <el-table-column prop="name" label="商品个数" align="center" width="100">
          <template slot-scope="scope" align="center">
            <span>{{scope.row.quantity}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="商户" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.storeName}}</div>
            <div>{{scope.row.storeId}}</div>
          </template>
        </el-table-column>
        <el-table-column prop label="自提点" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.orderAddressDetail?scope.row.orderAddressDetail.districtAddress:''}}</span>
            <span>{{scope.row.orderAddressDetail?scope.row.orderAddressDetail.detailedAddress:''}}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="160" align="center">
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.orderTimeDetail" :key="index">
              <span v-if="item.status==1">{{item.statusTime | dateFormat}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.latestStatus==1">待支付</div>
            <div v-if="scope.row.latestStatus==12">已取消</div>
            <div v-if="scope.row.latestStatus==15">待成团</div>
            <div v-if="scope.row.latestStatus==16">
              <div>已上传</div>
              <div v-if="scope.row.validStatus == 1">（过期待验证）</div>
            </div>
            <div v-if="scope.row.latestStatus==10">
              <div v-if="scope.row.verificationCode">已上传</div>
              <div v-if="!scope.row.verificationCode">待成团</div>
              <div>（已退款）</div>
            </div>
            <div v-if="scope.row.latestStatus==17">拼团失败</div>
            <div v-if="scope.row.latestStatus==18">
              <div>已上传</div>
              <div>（过期已用）</div>
            </div>
            <div v-if="scope.row.latestStatus==19">
              <div>已上传</div>
              <div>（过期未用）</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="toOrderDetail(scope.row.id)">查看</el-button>
            <el-button
              type="text"
              v-if="scope.row.latestStatus==15"
              @click="upload_verification_code(scope.row.id)"
            >上传核销码</el-button>
            <el-button
              type="text"
              v-if="scope.row.latestStatus==15"
              @click="refuse(scope.row.id)"
            >拒绝</el-button>
            <el-button
              type="text"
              v-if="scope.row.latestStatus==16 && scope.row.validStatus == 1"
              @click="not_used(scope.row.id)"
            >退款</el-button>
            <el-button
              type="text"
              style="color:#F56C6C"
              v-if="scope.row.latestStatus==16 && scope.row.validStatus == 0"
              @click="upload_verification_code(scope.row.id)"
            >重传核销码</el-button>
            <el-button
              type="text"
              v-if="scope.row.latestStatus==16"
              @click="used(scope.row.id)"
            >完成订单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="order-bottom">
      <span class="totalNum">总计：{{pageTotal}}条</span>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pageTotal"
        :page-size="15"
        :current-page="pageNumber"
        @current-change="pageChange($event)"
      ></el-pagination>
    </div>
    <!-- 上传核销码弹窗 -->
    <el-dialog
      title="上传核销码"
      :visible.sync="verificationCodeDialog"
      width="450px"
      :show-close="false"
      center
      :close-on-click-modal="false"
    >
      <el-form label-position="right" label-width="100px" :model="codeForm">
        <el-form-item label="核销凭证：">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-remove="handleRemove"
            :on-exceed="imgNumber"
            :on-change="changeFile"
            :limit="1"
            :file-list="imageUrl"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="有效截止至：">
          <el-date-picker v-model="codeForm.validDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeVerificationCodeDialog">取 消</el-button>
        <el-button type="primary" @click="pushVerificationCode">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrderList,
  getMerchantBusinessList,
  getNormalOrderByExcel,
  pushVerificationCode,
  groupFinish,
  groupRefund,
  groupRefuse
} from "@/network/api";
export default {
  data() {
    return {
      loading: true,
      pageNumber: 1,
      pageTotal: 0,
      form: {
        orderChannelType: 2,
        orderType: 29,
        orderNumber: "",
        mobileNumber: "",
        latestStatus: "",
        businessId: "",
        business: "",
        buyMode: ""
      },
      time: "",
      selIndustryClass: "",
      industryClassList: [
        {
          id: "",
          name: "全部"
        }
      ],
      tableData: [],
      selStatusList: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 1,
          label: "待支付"
        },
        {
          value: 10,
          label: "已退款"
        },
        {
          value: 12,
          label: "已取消"
        },
        {
          value: 15,
          label: "待成团"
        },
        {
          value: 16,
          label: "已上传"
        },
        {
          value: 17,
          label: "拼团失败"
        },
        {
          value: 18,
          label: "已上传（过期已用）"
        },
        {
          value: 19,
          label: "已上传（过期未用）"
        }
      ],
      buyModeList: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 1,
          label: "普通拼团"
        },
        {
          value: 2,
          label: "一折拼团"
        }
      ],
      verificationCodeDialog: false,
      codeForm: {
        orderId: "",
        verificationCode: "",
        validDate: ""
      },
      imageUrl: []
    };
  },
  // 路由进入时 判断是否从详情页返回
  beforeRouteEnter(to, from, next) {
    if (from.path === "/orderDetail") {
      // 查看是否记录了页面
      let page = sessionStorage.getItem("page");
      page = page ? JSON.parse(page) : 1;
      let orderNumber = sessionStorage.getItem("orderNumber");
      let mobileNumber = sessionStorage.getItem("mobileNumber");
      let businessId = sessionStorage.getItem("businessId");
      let latestStatus = sessionStorage.getItem("latestStatus");
      let business = sessionStorage.getItem("business");
      let buyMode = sessionStorage.getItem("buyMode");
      let time = sessionStorage.getItem("time");
      next(vm => {
        vm.form.orderNumber = orderNumber ? JSON.parse(orderNumber) : "";
        vm.form.mobileNumber = mobileNumber ? JSON.parse(mobileNumber) : "";
        vm.form.businessId = businessId ? JSON.parse(businessId) : "";
        vm.form.latestStatus = latestStatus ? JSON.parse(latestStatus) : "";
        vm.form.business = business ? JSON.parse(business) : "";
        vm.form.buyMode = buyMode ? JSON.parse(buyMode) : "";
        vm.time = time ? JSON.parse(time) : "";
        vm.form.orderStartTime = time
          ? vm.getDateShow(JSON.parse(time)[0])
          : "";
        vm.form.orderEndTime = time ? vm.getDateShow(JSON.parse(time)[1]) : "";
        vm.search(page);
        vm.getBusinessList();
      });
    } else {
      next(vm => {
        vm.search(1);
        vm.getBusinessList();
      });
    }
  },
  created() {},
  methods: {
    // 搜索
    search(val) {
      let parms = {};
      for (let key in this.form) {
        if (this.form[key]) {
          parms[key] = this.form[key];
        }
      }
      parms.pageNumber = val ? val : this.pageNumber;
      parms.pageSize = 15;
      getOrderList({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.tableData = content.items;
          this.pageTotal = content.totalSize;
          this.pageNumber = val ? val : this.pageNumber;
          this.loading = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取行业列表
    getBusinessList() {
      getMerchantBusinessList().then(res => {
        let content = res.data.content;
        if (content) {
          this.industryClassList = this.industryClassList.concat(content);
        }
      });
    },
    // 搜索时间改变事件
    dateChange(val) {
      if (val) {
        this.form.orderStartTime = this.getDateShow(val[0]);
        this.form.orderEndTime = this.getDateShow(val[1]);
      } else {
        this.form.orderStartTime = "";
        this.form.orderEndTime = "";
      }
    },
    // 时间格式处理函数
    getDateShow(value) {
      let dt = new Date(value);
      return dt.getTime();
    },
    // 上传图片
    changeFile(file, fileList) {
      let that = this;
      this.imageUrl = fileList;
      let image = new Image();
      image.src = file.url;
      image.onload = function() {
        let base64 = that.getBase64Image(image);
        that.codeForm.verificationCode = base64;
      };
    },
    // 删除已经上传的图片
    handleRemove(file, fileList) {
      this.codeForm.verificationCode = "";
      this.imageUrl = fileList;
    },
    // 上传图片超出个数限制时的钩子
    imgNumber() {
      this.$message.error("最多添加1张图片");
    },
    // 图片格式转为base64
    getBase64Image(image) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
      let type = image.src.substring(
        image.src.lastIndexOf(".") + 1,
        image.src.lastIndexOf(".") + 4
      );
      let dType = type === "jpg" ? "jpeg" : "png";
      let dataURL = canvas.toDataURL(`image/${dType}`);
      return dataURL;
    },
    // 打开上传核销码弹窗
    upload_verification_code(id) {
      this.codeForm.orderId = id;
      this.verificationCodeDialog = true;
    },
    // 关闭上传核销码弹窗
    closeVerificationCodeDialog() {
      this.verificationCodeDialog = false;
      this.codeForm.orderId = "";
      this.codeForm.verificationCode = "";
      this.codeForm.validDate = "";
      this.imageUrl = [];
    },
    // 上传核销码保存
    pushVerificationCode() {
      let form = JSON.parse(JSON.stringify(this.codeForm));
      if (!form.verificationCode) {
        this.$message.error("请上传核销码");
        return;
      }
      if (!form.validDate) {
        this.$message.error("请选择时间");
        return;
      }
      // 时间格式转换：2020-02-22T16:00:00.000Z 转换格式为: 2020-02-22 16:00:00
      form.validDate = this.dayjs(form.validDate).format("YYYY-MM-DD HH:mm:ss");
      pushVerificationCode(this.qs.stringify(form)).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.verificationCodeDialog = false;
          this.codeForm.orderId = "";
          this.codeForm.verificationCode = "";
          this.codeForm.validDate = "";
          this.imageUrl = [];
          this.$message.success("操作成功");
          this.search();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 拒绝
    refuse(id) {
      this.$confirm("", "拒绝成团后将退款给用户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        showClose: false,
        closeOnClickModal: false
      })
        .then(() => {
          let parms = {
            orderId: id
          };
          groupRefuse(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("操作成功");
              this.search();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 完成订单
    used(id) {
      this.$confirm("（此操作不可撤回）", "确认已使用?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        showClose: false,
        closeOnClickModal: false
      })
        .then(() => {
          let parms = {
            orderId: id
          };
          groupFinish(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("操作成功");
              this.search();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 退款
    not_used(id) {
      this.$confirm("", "确认未使用后将退款给用户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        showClose: false,
        closeOnClickModal: false
      })
        .then(() => {
          let parms = {
            orderId: id
          };
          groupRefund(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("操作成功");
              this.search();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 导出excel
    exportExcel() {
      let parms = {};
      for (let key in this.form) {
        if (this.form[key]) {
          parms[key] = this.form[key];
        }
      }
      getNormalOrderByExcel(parms).then(res => {
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
      a.setAttribute("download", "普通核销订单列表.xls");
      document.body.appendChild(a);
      a.click();
    },
    // 跳转订单详情
    toOrderDetail(id) {
      let form = this.form;
      this.$router.push({
        path: "/orderDetail",
        query: {
          orderid: id,
          isWriteOffOrder: true //是否为核销订单
        }
      });
      sessionStorage.setItem("page", JSON.stringify(this.pageNumber));
      sessionStorage.setItem("orderNumber", JSON.stringify(form.orderNumber));
      sessionStorage.setItem("mobileNumber", JSON.stringify(form.mobileNumber));
      sessionStorage.setItem("businessId", JSON.stringify(form.businessId));
      sessionStorage.setItem("latestStatus", JSON.stringify(form.latestStatus));
      sessionStorage.setItem("business", JSON.stringify(form.business));
      sessionStorage.setItem("buyMode", JSON.stringify(form.buyMode));
      sessionStorage.setItem("time", JSON.stringify(this.time));
    },
    // 分页改变事件
    pageChange(val) {
      this.pageNumber = val;
      this.search();
    }
  }
};
</script>

<style lang='less' scoped>
.selfSupportOrder {
  padding: 30px;
  box-sizing: border-box;
  .order-searchTop {
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    padding-bottom: 30px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .searchTop-left {
      width: 1300px;
      display: flex;
      flex-wrap: wrap;
      > .inputBox {
        display: flex;
        font-size: 14px;
        color: #333;
        line-height: 40px;
        margin-right: 20px;
        margin-bottom: 20px;
        .inputStyle {
          width: 180px;
          height: 40px;
          margin-left: 10px;
        }
        > .el-select {
          width: 144px;
          height: 40px;
          margin-left: 10px;
          > .el-input {
            > .el-input__inner {
              padding: 0;
              padding-left: 15px;
              box-sizing: border-box;
            }
          }
        }
      }
    }
  }
  .order-table {
    margin: 0 auto;
    .el-table__header {
      th {
        background-color: #fafafa;
        font-size: 16px;
        color: #333;
        height: 60px;
      }
    }
    .el-checkbox__label {
      display: none;
    }
    table {
      tbody {
        > tr {
          > td:nth-of-type(1) {
            text-align: center;
          }
        }
      }
    }
  }
  .order-bottom {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 30px;
    button,
    li {
      cursor: pointer;
    }
  }
}
</style>
