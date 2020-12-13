<template>
  <div class="delivery">
    <div class="searchBox" style="margin-top:20px;">
      <span>商家编号：</span>
      <el-input v-model="form.merchantId" style="width:140px;"></el-input>
      <span style="margin-left:20px;">订单编号：</span>
      <el-input v-model="form.orderNumber" style="width:240px;margin-right:20px;"></el-input>
      <el-button type="primary" @click="openDeliveryTimeDialog">设置配送时间</el-button>
      <el-button type="primary" @click="searchMerchant(1)">管理配送商户</el-button>
      <el-button type="primary" @click="search(1)">搜索</el-button>
    </div>
    <div class="tabelBox" style="margin-top:40px;">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="orderNumber" label="订单编号" align="center"></el-table-column>
        <el-table-column prop="merchantId" label="商户编号" align="center" width="100"></el-table-column>
        <el-table-column prop="mobileNumber" label="用户账号" align="center" width="140"></el-table-column>
        <el-table-column prop label="下单时间" align="center" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.tradeDate | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="appointmentTime" label="配送时间" align="center"></el-table-column>
        <el-table-column prop="addressDetail" label="商家地址" align="center">
          <template slot-scope="scope">
            <span>【{{scope.row.storeName}}】</span>
            <span>【{{scope.row.storeMobileNumber}}】</span>
            <span>【{{scope.row.addressDetail}}】</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="配送地址" align="center">
          <template slot-scope="scope">
            <span>【{{scope.row.receiverName}}】</span>
            <span>【{{scope.row.receiverMobileNumber}}】</span>
            <span>【{{scope.row.detailedAddress}}】</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 1"
              type="text"
              @click="openMerchantInfoDialog(scope.row.addressId)"
            >输入配送信息</el-button>
            <span v-if="scope.row.status == 2">已处理</span>
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
    <!-- 设置配送时间 -->
    <el-dialog title="设置配送时间" :visible.sync="deliveryTimeDialog" center width="440px">
      <el-checkbox-group v-model="week" size="small">
        <el-checkbox-button :label="1">周一</el-checkbox-button>
        <el-checkbox-button :label="2">周二</el-checkbox-button>
        <el-checkbox-button :label="3">周三</el-checkbox-button>
        <el-checkbox-button :label="4">周四</el-checkbox-button>
        <el-checkbox-button :label="5">周五</el-checkbox-button>
        <el-checkbox-button :label="6">周六</el-checkbox-button>
        <el-checkbox-button :label="7">周日</el-checkbox-button>
      </el-checkbox-group>
      <el-divider></el-divider>
      <div
        v-for="(item,index) in deliveryTimeForm"
        :key="index"
        style="width:100%;margin-top:20px;display:flex;justify-content:center;align-items:center;"
      >
        <span>{{item.day}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <el-time-picker
          v-model="item.openTime"
          size="small"
          style="width:120px;"
          format="HH:mm"
          :picker-options="{
      selectableRange: '00:00:00 - 23:59:59'
    }"
          placeholder="开始时间"
        ></el-time-picker>
        <span>&nbsp;&nbsp;~&nbsp;&nbsp;</span>
        <el-time-picker
          v-model="item.closeTime"
          size="small"
          style="width:120px;"
          format="HH:mm"
          :picker-options="{
      selectableRange: '00:00:00 - 23:59:59'
    }"
          placeholder="结束时间"
        ></el-time-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="info" @click="deliveryTimeDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="setDeliveryTime">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 管理配送商户弹窗 -->
    <el-dialog
      title="配送商户"
      :visible.sync="deliveryMerchantsDialog"
      center
      width="800px"
      :close-on-click-modal="false"
    >
      <div>
        <el-input
          v-model="merchantId"
          size="small"
          style="width:160px;margin-right:20px;"
          placeholder="请输入商品编号"
        ></el-input>
        <el-button type="primary" size="small" @click="searchMerchant(1)">搜索</el-button>
        <el-button type="success" size="small" @click="addMerchantDialog = true">添加商户</el-button>
      </div>
      <div style="margin-top:20px;">
        <el-table :data="deliveryMerchantList" border style="width: 100%">
          <el-table-column prop="merchantId" label="商户编号" align="center" width="100"></el-table-column>
          <el-table-column prop="storeName" label="商户名称" align="center"></el-table-column>
          <el-table-column prop="maxDeliveryArea" label="配送范围" align="center" width="100">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="openDeliveryRangeDialog(scope.row.id,scope.row.merchantId)"
              >{{scope.row.maxDeliveryArea}}Km</el-button>
            </template>
          </el-table-column>
          <el-table-column prop label="运费计价" align="center" width="100">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="openDeliveryPrice(scope.row.id,scope.row.merchantId)"
              >{{scope.row.freightName}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="removeMerchant(scope.row.id)">移出</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top:10px;font-size:12px;">*若商户取消了配送模式或者修改为商户配送，则自动从这个列表中移出</div>
      <div style="width:100%;margin-top:20px;display:flex;justify-content:center;">
        <el-pagination
          background
          layout="prev, pager, next,jumper"
          :total="totalSize1"
          :page-size="10"
          :current-page.sync="currentPage1"
          @current-change="pageChange1($event)"
        ></el-pagination>
      </div>
    </el-dialog>
    <!-- 添加商户弹窗 -->
    <el-dialog
      title="添加商户"
      :visible.sync="addMerchantDialog"
      width="360px"
      center
      :close-on-click-modal="false"
    >
      <div style="margin-top:20px;">
        <span>商户编号:</span>
        <el-input v-model="addMerchantForm.merchantId" style="width:140px;" size="small"></el-input>
      </div>
      <div style="margin-top:20px;">
        <span>运费计价：</span>
        <el-select v-model="addMerchantForm.freight" style="width:160px;" size="small">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div style="margin-top:20px;">
        <span>配送范围：:</span>
        <el-input v-model="addMerchantForm.maxDeliveryArea" style="width:140px;" size="small"></el-input>Km
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addMerchant">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置配送范围弹窗 -->
    <el-dialog
      title="配送范围"
      :visible.sync="deliveryRangeDialog"
      width="300px"
      center
      :close-on-click-modal="false"
    >
      <div style="width:100%;display:flex;justify-content:center;align-items:center;">
        <input type="text" v-model="deliveryRange" style="width:100px;height:30px;" />
        <span>&nbsp;Km</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setDeliveryRange">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改运费计价方案弹窗 -->
    <el-dialog
      title="修改运费计价方案"
      :visible.sync="deliveryPriceDialog"
      width="300px"
      center
      :close-on-click-modal="false"
    >
      <div style="width:100%;display:flex;justify-content:center;">
        <el-select v-model="status" style="width:160px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="UpdateDeliveryPrice">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置配送信息弹窗 -->
    <el-dialog
      title="配送信息"
      :visible.sync="merchantInfoDialog"
      width="360px"
      center
      :close-on-click-modal="false"
    >
      <div style="margin-top:20px;">
        <span>配送员电话:</span>
        <el-input
          v-model="merchantInfoForm.deliveryMobileNumber"
          style="width:140px;"
          size="small"
          :maxlength="11"
        ></el-input>
      </div>
      <div style="margin-top:20px;">
        <span>预送达时间:</span>
        <el-date-picker
          v-model="merchantInfoForm.deliveryTime"
          type="datetime"
          size="small"
          placeholder="选择日期时间"
        ></el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="info" @click="merchantInfoDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="setMerchantInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getMerchantOrderList,
  getDeliveryMerchantList,
  setDeliveryTime,
  getDeliveryTime,
  getfreightPlatList,
  addDeliveryMerchantList,
  removeDeliveryMerchantList,
  updateDeliveryMerchantList,
  setDeliveryMerchantinfo
} from "@/network/api";
export default {
  data() {
    return {
      totalSize: 0,
      totalSize1: 0,
      currentPage: 0,
      currentPage1: 0,
      form: {
        pageSize: 10,
        merchantId: "",
        orderNumber: ""
      },
      addMerchantForm: {
        merchantId: "",
        maxDeliveryArea: "",
        freight: ""
      },
      id: "",
      merchantId: "",
      merchantId1: "",
      deliveryTimeDialog: false, // 设置配送时间
      deliveryMerchantsDialog: false, //  配送商户弹窗
      deliveryRangeDialog: false, //配送范围
      deliveryPriceDialog: false, //修改运费计价方案
      addMerchantDialog: false, //添加商户
      merchantInfoDialog: false, //输入配送信息
      options: [],
      status: "",
      time: "",
      week: [],
      deliveryTimeForm: [
        {
          day: 1,
          openTime: "",
          closeTime: "",
          businessType: "3"
        },
        {
          day: 2,
          openTime: "",
          closeTime: "",
          businessType: "3"
        },
        {
          day: 3,
          openTime: "",
          closeTime: "",
          businessType: "3"
        },
        {
          day: 4,
          openTime: "",
          closeTime: "",
          businessType: "3"
        },
        {
          day: 5,
          openTime: "",
          closeTime: "",
          businessType: "3"
        },
        {
          day: 6,
          openTime: "",
          closeTime: "",
          businessType: "3"
        },
        {
          day: 7,
          openTime: "",
          closeTime: "",
          businessType: "3"
        }
      ],
      merchantInfoForm: {
        addressId: "",
        deliveryMobileNumber: "",
        deliveryTime: ""
      },
      deliveryRange: "",
      tableData: [],
      deliveryMerchantList: []
    };
  },
  created() {
    this.search(1);
    this.getfreightPlatList();
  },
  methods: {
    // 搜索
    search(val) {
      let form = JSON.parse(JSON.stringify(this.form));
      for (let key in form) {
        form[key] = form[key] ? form[key] : null;
      }
      form.pageNumber = val;
      getMerchantOrderList({ params: form }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.tableData = res.data.content.items;
          this.totalSize = res.data.content.totalSize;
          this.currentPage = val;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 搜索商户
    searchMerchant(val) {
      let parms = {
        pageNumber: val,
        pageSize: 10,
        merchantId: this.merchantId
      };
      getDeliveryMerchantList({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.deliveryMerchantList = res.data.content.items;
          this.totalSize1 = res.data.content.totalSize;
          this.currentPage1 = val;
          this.deliveryMerchantsDialog = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取计价方案列表
    getfreightPlatList() {
      getfreightPlatList().then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let data = res.data.content;
          data.forEach(val => {
            let json = {};
            json.value = val.id;
            json.label = val.name;
            this.options.push(json);
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 打开配送时间弹窗
    openDeliveryTimeDialog() {
      this.week = [];
      getDeliveryTime().then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.deliveryTimeForm.forEach(val => {
            content.forEach(item => {
              if (val.day == item.day) {
                this.week.push(val.day);
                val.openTime = new Date(
                  "",
                  "",
                  "",
                  (item.openTime - (item.openTime % 60)) / 60,
                  item.openTime % 60,
                  ""
                );
                val.closeTime = new Date(
                  "",
                  "",
                  "",
                  (item.closeTime - (item.closeTime % 60)) / 60,
                  item.closeTime % 60,
                  ""
                );
              }
            });
          });
          this.deliveryTimeDialog = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 设置配送时间
    setDeliveryTime() {
      let form = [];
      let a = true;
      let b = true;
      let deliveryTimeForm = JSON.parse(JSON.stringify(this.deliveryTimeForm));
      deliveryTimeForm.forEach(val => {
        if (this.week.indexOf(val.day) != -1) {
          if (!val.openTime || !val.closeTime) {
            a = false;
          }
          val.openTime =
            new Date(val.openTime).getHours() * 60 +
            new Date(val.openTime).getMinutes();
          val.closeTime =
            new Date(val.closeTime).getHours() * 60 +
            new Date(val.closeTime).getMinutes();
          if (val.openTime > val.closeTime) {
            b = false;
          }
          form.push(val);
        }
      });
      if (form.length == 0) {
        this.$message.error("请选择配送时间");
        return;
      }
      if (!a) {
        this.$message.error("请将已选择的星期的时间填写完整");
        return;
      }
      if (!b) {
        this.$message.error("开始时间不能大于结束时间");
        return;
      }
      setDeliveryTime(form).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.deliveryTimeDialog = false;
          this.$message.success("操作成功");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 添加商户
    addMerchant() {
      let form = this.addMerchantForm;
      for (let key in form) {
        if (!form[key]) {
          this.$message.error("请将表单填写完整");
          return;
        }
      }
      addDeliveryMerchantList(form).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.searchMerchant(1);
          this.$message.success("添加成功");
          this.addMerchantDialog = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 打开设置配送范围弹窗
    openDeliveryRangeDialog(id, merchantId) {
      this.id = id;
      this.merchantId1 = merchantId;
      this.deliveryRangeDialog = true;
    },
    // 设置配送范围
    setDeliveryRange() {
      if (!this.deliveryRange) {
        this.$message.error("配送范围不能为空");
        return;
      }
      if (
        !/^([1-9]\d*|0)(\.\d)?$/.test(this.deliveryRange) ||
        this.deliveryRange > 20
      ) {
        this.$message.error("配送范围格式不正确");
        return;
      }
      let parms = {
        id: this.id,
        merchantId: this.merchantId1,
        maxDeliveryArea: this.deliveryRange
      };
      updateDeliveryMerchantList(parms).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.id = "";
          this.merchantId1 = "";
          this.deliveryRange = "";
          this.searchMerchant(1);
          this.deliveryRangeDialog = false;
          this.$message.success("修改成功");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 打开修改运费计价方案弹窗
    openDeliveryPrice(id, merchantId) {
      this.id = id;
      this.merchantId1 = merchantId;
      this.deliveryPriceDialog = true;
    },
    // 修改运费计价方案
    UpdateDeliveryPrice() {
      if (!this.status) {
        this.$message.error("请选择运费计价方案");
        return;
      }
      let parms = {
        id: this.id,
        merchantId: this.merchantId1,
        freight: this.status
      };
      updateDeliveryMerchantList(parms).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.id = "";
          this.merchantId1 = "";
          this.status = "";
          this.searchMerchant(1);
          this.deliveryPriceDialog = false;
          this.$message.success("修改成功");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 移出商户
    removeMerchant(id) {
      this.$confirm("确认移出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          let parms = {
            platDeliveryId: id
          };
          removeDeliveryMerchantList({ params: parms }).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.searchMerchant(1);
              this.$message.success("移除成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 打开输入配送信息弹窗
    openMerchantInfoDialog(id) {
      this.merchantInfoForm.addressId = id;
      this.merchantInfoDialog = true;
    },
    // 设置配送信息
    setMerchantInfo() {
      let form = this.merchantInfoForm;
      if (!form.deliveryMobileNumber || !form.deliveryTime) {
        this.$message.error("请将表单填写完整");
        return;
      }
      if (!/^1[3456789]\d{9}$/.test(form.deliveryMobileNumber)) {
        this.$message.error("电话号码格式不正确");
        return;
      }
      form.deliveryTime = form.deliveryTime.getTime();
      setDeliveryMerchantinfo(this.qs.stringify(form)).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.search(1);
          this.$message.success("操作成功");
          this.merchantInfoDialog = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 翻页
    pageChange(val) {
      this.search(val);
      this.currentPage = val;
    },
    // 商户列表翻页
    pageChange1(val) {
      this.searchMerchant(val);
      this.currentPage1 = val;
    }
  }
};
</script>
<style lang="less" scoped>
.delivery {
  padding: 20px;
  box-sizing: border-box;
  .totalBox {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>