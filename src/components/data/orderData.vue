<template>
  <div class="orderData">
    <div class="searchBox">
      <!-- 订单信息： -->
      <div class="searchItems" v-if="hiddenOrShowItems">
        <div class="title">订单信息：</div>
        <div style="display:flex;flex-wrap:wrap;">
          <div style="margin-top:10px;margin-right:10px;">
            <span>订单编号:</span>
            <el-input v-model="form.orderNumber" style="width:200px;" size="small"></el-input>
          </div>
          <div style="margin-top:10px;margin-right:10px;">
            <span>订单状态：</span>
            <el-select v-model="latestStatus" multiple style="width:180px;" size="small">
              <el-option
                v-for="item in latestStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div style="margin-top:10px;margin-right:10px;">
            <span>下单时间：</span>
            <el-date-picker
              size="small"
              v-model="time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
          <div style="margin-top:10px;margin-right:10px;">
            <span>订单金额：</span>
            <el-input v-model="form.startOrderAmount" style="width:100px;" size="small"></el-input>-
            <el-input v-model="form.endOrderAmount" style="width:100px;" size="small"></el-input>
          </div>
          <div style="margin-top:10px;margin-right:10px;">
            <span>订单优惠金额：</span>
            <el-input v-model="form.startDiscountAmount" style="width:100px;" size="small"></el-input>-
            <el-input v-model="form.endDiscountAmount" style="width:100px;" size="small"></el-input>
          </div>
          <div style="margin-top:10px;margin-right:10px;">
            <span>下单方式：</span>
            <el-select v-model="form.orderType" style="width:160px;" size="small">
              <el-option
                v-for="item in orderTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <!-- 商品信息 -->
      <div class="searchItems" v-if="hiddenOrShowItems">
        <div class="title">商品信息：</div>
        <div style="display:flex;flex-wrap:wrap;">
          <div style="margin-top:10px;margin-right:10px;">
            <span>商品id：</span>
            <el-input v-model="form.goodsId" style="width:80px;" size="small"></el-input>
          </div>
          <div style="margin-top:10px;margin-right:10px;">
            <span>商品分类：</span>
            <el-select
              v-model="form.goodsOneCategory"
              placeholder="一级分类"
              style="width:140px;"
              @change="selectType1"
              size="small"
            >
              <el-option
                v-for="(item,index) in options_type1"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select
              size="small"
              v-model="form.goodsTwoCategory"
              placeholder="二级分类"
              style="width:140px;margin-right:20px;"
              @change="selectType2"
            >
              <el-option
                v-for="item in options_type2"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div style="margin-top:10px;margin-right:10px;">
            <span>商品名称：</span>
            <el-input v-model="form.goodsName" style="width:180px;" size="small"></el-input>
          </div>
          <div style="margin-top:10px;margin-right:10px;">
            <span>购买数量：</span>
            <el-input v-model="form.quantity" style="width:100px;" size="small" :maxlength="9"></el-input>
          </div>
          <div style="margin-top:10px;margin-right:10px;">
            <span>返现周期：</span>
            <el-input v-model="form.period" style="width:100px;" size="small" :maxlength="10"></el-input>
          </div>
        </div>
      </div>
      <!-- 商家信息 -->
      <div class="searchItems" v-if="hiddenOrShowItems">
        <div class="title">商家信息：</div>
        <div style="margin-top:10px;">
          <span>所属商家:</span>
          <el-input v-model="form.business" style="width:180px;" size="small"></el-input>
          <span style="margin-left:10px;">商家电话:</span>
          <el-input v-model="form.businessPhone" style="width:120px;" size="small"></el-input>
          <el-radio v-model="form.businessType" label="1" style="margin-left:10px;">自营</el-radio>
          <el-radio v-model="form.businessType" label style="margin-left:10px;">全部</el-radio>
        </div>
      </div>
      <!-- 用户信息 -->
      <div class="searchItems" v-if="hiddenOrShowItems">
        <div class="title">用户信息：</div>
        <div style="display:flex;flex-wrap:wrap;">
          <div style="margin-top:10px;margin-right:10px;">
            <span>用户电话:</span>
            <el-input v-model="form.userMobileNumber" style="width:120px;" size="small"></el-input>
          </div>
          <div style="margin-top:10px;margin-right:10px;">
            <span>用户身份:</span>
            <el-select v-model="form.userRole" style="width:120px;" size="small">
              <el-option
                v-for="item in userRoleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div style="margin-top:10px;margin-right:10px;">
            <span>收货地址：</span>
            <el-select
              v-model="province"
              placeholder="请选择"
              @change="select_province"
              style="width:120px;"
              size="small"
            >
              <el-option
                v-for="item in provinceList"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select
              v-model="city"
              placeholder="请选择"
              @change="select_citys"
              style="width:120px;"
              size="small"
            >
              <el-option
                v-for="item in cityList"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select
              v-model="area"
              placeholder="请选择"
              @change="select_provinces"
              style="width:120px;"
              size="small"
            >
              <el-option
                v-for="item in districtList"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div style="margin-top:10px;margin-right:10px;">
            <span>收货人：</span>
            <el-input v-model="form.receiverName" style="width:100px;" size="small"></el-input>
          </div>
          <div style="margin-top:10px;margin-right:10px;">
            <span>收货人电话：</span>
            <el-input v-model="form.receiverPhone" style="width:120px;" size="small"></el-input>
          </div>
          <div style="margin-top:10px;margin-right:10px;">
            <span>收货详细地址：</span>
            <el-input v-model="form.detailedAddress" style="width:240px;" size="small"></el-input>
          </div>
        </div>
      </div>
      <!-- 上级信息 -->
      <div class="searchItems" style="border:none">
        <div class="title">上级信息：</div>
        <div>
          <span>上级电话：</span>
          <el-input v-model="form.parentPhone" style="width:120px;" size="small"></el-input>
          <span style="margin-left:10px;">上级邀请码：</span>
          <el-input
            v-model="form.parentInviterCode"
            style="width:120px;"
            size="small"
            :maxlength="11"
          ></el-input>
          <span style="margin-left:10px;">佣金金额：</span>
          <el-input v-model="form.commissionAmount" style="width:120px;" size="small"></el-input>
          <el-button
            type="text"
            @click="hiddenOrShowItems = false"
            style="margin-left:10px;"
            v-if="hiddenOrShowItems"
          >
            <i class="el-icon-arrow-up"></i>收起
          </el-button>
          <el-button type="text" @click="hiddenOrShowItems = true" style="margin-left:10px;" v-else>
            <i class="el-icon-arrow-down"></i>展开
          </el-button>
          <el-button type="primary" @click="search(1)" style="margin-left:10px;">搜索</el-button>
          <el-button type="info" @click="downloadData">导出查询内容</el-button>
        </div>
      </div>
    </div>
    <div class="tableBox">
      <el-table :data="tableData" border style="width: 100%;">
        <el-table-column prop="orderNumber" align="center" label="订单编号" width="80"></el-table-column>
        <el-table-column prop="orderStatus" align="center" label="订单状态" width="100"></el-table-column>
        <el-table-column prop="orderTime" align="center" label="下单时间" width="140"></el-table-column>
        <el-table-column prop="year" align="center" label="年份" width="80"></el-table-column>
        <el-table-column prop="month" align="center" label="月度" width="80"></el-table-column>
        <el-table-column prop="day" align="center" label="日期" width="80"></el-table-column>
        <el-table-column prop="time" align="center" label="时间" width="80"></el-table-column>
        <el-table-column prop="orderAmount" align="center" label="订单金额"></el-table-column>
        <el-table-column prop="orderForm" align="center" label="下单方式"></el-table-column>
        <el-table-column prop="goodsId" align="center" label="商品id"></el-table-column>
        <el-table-column prop="goodsName" align="center" label="商品名称"></el-table-column>
        <el-table-column prop="oneCategory" align="center" label="一级分类"></el-table-column>
        <el-table-column prop="twoCategory" align="center" label="二级分类"></el-table-column>
        <el-table-column prop="specDesc" align="center" label="规格"></el-table-column>
        <el-table-column prop="quantity" align="center" label="购买数量"></el-table-column>
        <el-table-column prop="cashBack" align="center" label="返现金额"></el-table-column>
        <el-table-column prop="periodDesc" align="center" label="返现周期"></el-table-column>
        <el-table-column prop="payFreeAmount" align="center" label="商品freebuy付款价"></el-table-column>
        <el-table-column prop="payNormalAmount" align="center" label="正常购买付款价"></el-table-column>
        <el-table-column prop="goodsDiscountAmount" align="center" label="商品优惠总金额"></el-table-column>
        <el-table-column prop="totalDiscount" align="center" label="订单优惠总金额"></el-table-column>
        <el-table-column prop="discountAmount" align="center" label="钻石合伙人折扣减免金额"></el-table-column>
        <el-table-column prop="shoppingAmount" align="center" label="钻石合伙人购物金减免金额"></el-table-column>
        <el-table-column prop="deductionAmount" align="center" label="积分减免金额"></el-table-column>
        <!-- <el-table-column prop="name" align="center" label="优惠券减免金额" width="120"></el-table-column> -->
        <el-table-column prop="payFreeAmountOld" align="center" label="商品freebuy原付款价" width="120"></el-table-column>
        <el-table-column prop="payNormalAmountOld" align="center" label="正常购买原付款价" width="120"></el-table-column>
        <el-table-column prop="merchantType" align="center" label="所属商家信息" width="120"></el-table-column>
        <el-table-column prop="remark" align="center" label="订单备注" width="120"></el-table-column>
        <el-table-column prop="mobileNumber" align="center" label="下单用户电话" width="120"></el-table-column>
        <el-table-column prop="userRole" align="center" label="下单用户身份" width="120"></el-table-column>
        <el-table-column prop="receiverName" align="center" label="收货人姓名" width="120"></el-table-column>
        <el-table-column prop="receiverPhone" align="center" label="收货人电话" width="120"></el-table-column>
        <el-table-column prop="province" align="center" label="省" width="120"></el-table-column>
        <el-table-column prop="city" align="center" label="市" width="120"></el-table-column>
        <el-table-column prop="district" align="center" label="区" width="120"></el-table-column>
        <el-table-column prop="detailedAddress" align="center" label="收货详细地址" width="120"></el-table-column>
        <el-table-column prop="parentPhone" align="center" label="上级电话" width="120">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="goUserDetail(scope.row.parentRole,scope.row.parentUserId)"
            >{{scope.row.parentPhone}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="parentRole" align="center" label="上级身份" width="120"></el-table-column>
        <el-table-column prop="inviterCode" align="center" label="上级邀请码" width="120"></el-table-column>
        <el-table-column prop="parentAmount" align="center" label="佣金金额" width="120"></el-table-column>
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
  </div>
</template>
<script>
import {
  getAllCityData,
  getGoodsClassRequest,
  queryOrderListOrderData,
  queryOrderListOrderDataExcel
} from "@/network/api";
export default {
  data() {
    return {
      totalSize: 0,
      currentPage: 1,
      name: "",
      hiddenOrShowItems: true, // 展开还是收起搜索选择框
      tableData: [],
      form: {
        orderNumber: "",
        latestStatus: "",
        startOrderAmount: "",
        endOrderAmount: "",
        startDiscountAmount: "",
        endDiscountAmount: "",
        orderType: "",
        goodsId: "",
        goodsOneCategory: "",
        goodsTwoCategory: "",
        goodsName: "",
        quantity: "",
        period: "",
        business: "",
        businessPhone: "",
        businessType: "",
        userMobileNumber: "",
        userRole: "",
        province: "",
        city: "",
        district: "",
        receiverName: "",
        receiverPhone: "",
        detailedAddress: "",
        parentPhone: "",
        parentInviterCode: "",
        commissionAmount: ""
      },
      latestStatus: "",
      time: "",
      latestStatusOptions: [
        {
          value: "1",
          label: "待支付"
        },
        {
          value: "2",
          label: "待发货"
        },
        {
          value: "3",
          label: "待使用"
        },
        {
          value: "4",
          label: "待收货"
        },
        {
          value: "5",
          label: "待评价"
        },
        {
          value: "6",
          label: "已完成"
        },
        {
          value: "7",
          label: "待发货-退款中"
        },
        {
          value: "8",
          label: "待评价-退款中"
        },
        {
          value: "9",
          label: "取消退款"
        },
        {
          value: "10",
          label: "退款成功"
        },
        {
          value: "11",
          label: "退款失败"
        },
        {
          value: "12",
          label: "已取消"
        }
      ],
      orderTypeOptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "正常购买"
        },
        {
          value: "3",
          label: "新人免费领订单"
        },
        {
          value: "4",
          label: "信用卡活动订单"
        },
        {
          value: "5",
          label: "渠道合作活动订单"
        },
        {
          value: "6",
          label: "FreeBuy活动订单"
        },
        {
          value: "7",
          label: "FreeBuy订单"
        },
        {
          value: "8",
          label: "线下-普通订单"
        },
        {
          value: "9",
          label: "线下-FreeBuy订单"
        },
        {
          value: "10",
          label: "FreeBuy转正常购买"
        },
        {
          value: "14",
          label: "FreeBuy赞助订单"
        }
      ],
      userRoleOptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "2",
          label: "普通会员"
        },
        {
          value: "3",
          label: "合伙人"
        },
        {
          value: "4",
          label: "商家"
        },
        {
          value: "5",
          label: "代理商"
        },
        {
          value: "6",
          label: "钻石合伙人"
        }
      ],
      options_type1: [], //一级分类
      options_type2: [], //二级分类
      allCityData: "", // 所有的省市区
      province: "省",
      city: "市",
      area: "区",
      provinceList: [
        // 省份列表
        {
          value: "",
          label: ""
        }
      ],
      cityList: [
        // 城市列表
        {
          value: "",
          label: ""
        }
      ],
      districtList: [
        // 区列表
        {
          value: "",
          label: ""
        }
      ]
    };
  },
  created() {
    // 获取所有城市（省市区）数据
    this.getAllCityList();
    // 获取商品分类数据
    this.getGoodsCategory();
  },
  methods: {
    search(val) {
      if (!this.checkData()) {
        return;
      }
      let data = JSON.parse(JSON.stringify(this.form));
      data.pageNumber = val;
      data.pageSize = 10;
      if (this.time) {
        data.orderStartTime = this.time[0].getTime();
        data.orderEndTime = this.time[1].getTime();
      }
      // 处理状态格式(多个状态使用英文逗号(,)分隔
      if (this.latestStatus) {
        if (this.latestStatus.length == 1) {
          data.latestStatus = this.latestStatus[0];
        } else {
          let status = "";
          this.latestStatus.forEach(value => {
            status = status + "," + value;
          });
          status = status.substr(1);
          data.latestStatus = status;
        }
      }
      queryOrderListOrderData({ params: data }).then(res => {
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
    // 导出查询内容
    downloadData() {
      if (!this.checkData()) {
        return;
      }
      let data = this.form;
      if (this.time) {
        data.orderStartTime = this.time[0].getTime();
        data.orderEndTime = this.time[1].getTime();
      }
      // 处理状态格式(多个状态使用英文逗号(,)分隔
      if (this.latestStatus) {
        if (this.latestStatus.length == 1) {
          data.latestStatus = this.latestStatus[0];
        } else {
          let status = "";
          this.latestStatus.forEach(value => {
            status = status + "," + value;
          });
          status = status.substr(1);
          data.latestStatus = status;
        }
      }
      queryOrderListOrderDataExcel(data).then(res => {
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
      a.setAttribute("download", "订单数据统计.xls");
      document.body.appendChild(a);
      a.click();
    },

    // 校验form表单提交数据是否符合规范
    checkData() {
      let data = this.form;
      let moneyRex = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
      let phoneRex = /^1[3456789]\d{9}$/;
      let integer = /^[+]{0,1}(\d+)$/;
      if (data.startOrderAmount && !moneyRex.test(data.startOrderAmount)) {
        this.$message.error("订单金额输入格式有误");
        return false;
      }
      if (data.endOrderAmount && !moneyRex.test(data.endOrderAmount)) {
        this.$message.error("订单金额输入格式有误");
        return false;
      }
      if (
        data.startDiscountAmount &&
        !moneyRex.test(data.startDiscountAmount)
      ) {
        this.$message.error("订单优惠金额输入格式有误");
        return false;
      }
      if (data.endDiscountAmount && !moneyRex.test(data.endDiscountAmount)) {
        this.$message.error("订单优惠金额输入格式有误");
        return false;
      }
      if (data.goodsId && !moneyRex.test(data.goodsId)) {
        this.$message.error("商品id输入格式有误");
        return false;
      }
      if (data.quantity && !integer.test(data.quantity)) {
        this.$message.error("购买数量输入格式有误");
        return false;
      }
      if (data.period && !moneyRex.test(data.period)) {
        this.$message.error("返现周期输入格式有误");
        return false;
      }
      if (data.businessPhone && !phoneRex.test(data.businessPhone)) {
        this.$message.error("商家电话输入格式有误");
        return false;
      }
      if (data.userMobileNumber && !phoneRex.test(data.userMobileNumber)) {
        this.$message.error("用户电话输入格式有误");
        return false;
      }
      if (data.receiverPhone && !phoneRex.test(data.receiverPhone)) {
        this.$message.error("收货人电话输入格式有误");
        return false;
      }
      if (data.parentPhone && !phoneRex.test(data.parentPhone)) {
        this.$message.error("上级电话输入格式有误");
        return false;
      }
      if (data.parentInviterCode && !integer.test(data.parentInviterCode)) {
        this.$message.error("上级邀请码输入格式有误");
        return false;
      }
      if (data.commissionAmount && !moneyRex.test(data.commissionAmount)) {
        this.$message.error("佣金金额输入格式有误");
        return false;
      } else {
        return true;
      }
    },
    // 获取商品分类
    getGoodsCategory() {
      getGoodsClassRequest().then(res => {
        this.options_type1 = res.data.content;
        let data = {
          id: "",
          name: "全部",
          nextLevelData: []
        };
        this.options_type1.splice(0, 0, data);
      });
    },
    // 选择一级分类
    selectType1(id) {
      this.options_type2 = "";
      this.form.goodsTwoCategory = "";
      let items = this.options_type1.filter((val, index, arr) => {
        return val.id == id;
      });
      this.options_type2 = items[0].nextLevelData;
    },
    // 选择二级分类
    selectType2(id) {
      this.form.goodsTwoCategory = id;
    },

    // 获取所有的城市数据
    getAllCityList() {
      getAllCityData().then(res => {
        let data = res.data.content;
        this.cityData = data;
        // 获取初始化省份列表
        this.provinceList = data.provinceList.map((val, index) => {
          let json = {};
          json.value = val.id;
          json.label = val.name;
          return json;
        });
        this.provinceList.unshift({
          label: "全部",
          value: ""
        });
      });
    },
    // 选择省份
    select_province(e) {
      this.city = "市";
      this.area = "区";
      this.form.city = "";
      this.form.district = "";
      if (!e) {
        this.form.province = "";
        this.cityList = "";
        this.districtList = "";
        return;
      }
      this.provinceList.forEach(val => {
        if (val.value == e) {
          this.province = val.label;
          this.form.province = e
        }
      });
      let city = this.cityData.cityList.filter(val => {
        return val.provinceId == e;
      });
      this.cityList = city.map(val => {
        let json = {};
        json.value = val.id;
        json.label = val.name;
        return json;
      });
    },
    // 选择城市
    select_citys(e) {
      this.cityList.forEach(val => {
        if (val.value == e) {
          this.city = val.label;
          this.form.city = e
        }
      });
      this.area = "区";
      this.form.district = "";
      let districtList = this.cityData.districtList.filter(val => {
        return val.cityId == e;
      });
      this.districtList = districtList.map(val => {
        let json = {};
        json.value = val.id;
        json.label = val.name;
        return json;
      });
    },
    // 选择区
    select_provinces(e) {
      for (let item of this.districtList) {
        if (item.value == e) {
          this.area = item.label;
        }
      }
      this.form.district = e;
    },
    // 点击上级电话，跳转到该上级账号的用户详情页面
    goUserDetail(parentRole, id) {
      let nav;
      switch (parentRole) {
        case "普通会员":
          nav = "/memberDetail";
          break;
        case "合伙人":
          nav = "/plusDetail";
          break;
        case "钻石合伙人":
          nav = "/diamond_detail";
          break;
      }
      this.$router.push({
        path: nav,
        query: {
          id: id
        }
      });
    },
    // 分页事件
    pageChange(val) {
      this.search(val);
    }
  }
};
</script>
<style lang="less" scoped>
.orderData {
  padding: 20px;
  box-sizing: border-box;
  .searchBox {
    width: 100%;
    padding: 0px 10px;
    box-sizing: border-box;
    border: 1px solid #666;
    .searchItems {
      border-bottom: 1px solid #ccc;
      padding: 10px 0px;
      .title {
        font-weight: bold;
      }
    }
  }
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