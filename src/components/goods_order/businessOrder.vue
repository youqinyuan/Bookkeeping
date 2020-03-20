<template>
  <div class="selfSupportOrder">
    <div class="order-searchTop">
      <div class="searchTop-left">
        <span class="inputBox">
          订单编号:
          <el-input class="inputStyle" v-model="orderId" placeholder="请输入订单编号"></el-input>
        </span>
        <span class="inputBox">
          用户电话:
          <el-input
            class="inputStyle"
            v-model.number="userPhone"
            placeholder="请输入用户电话"
            maxlength="11"
          ></el-input>
        </span>
        <span class="inputBox">
          行业分类:
          <el-select v-model="selIndustryClass" placeholder="请选择" @change="industryClassChange">
            <el-option
              v-for="item in industryClassList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </span>
        <span class="inputBox">
          订单状态:
          <el-select v-model="selStatus" placeholder="请选择" @change="selStatusChange">
            <el-option
              v-for="item in selStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </span>
        <span class="inputBox">
          选择商家:
          <el-input class="inputStyle" v-model="businessName" placeholder="关键字查询"></el-input>
        </span>
        <span class="inputBox">
          购买方式:
          <el-select v-model="buyMode" placeholder="请选择" @change="buyModeChange">
            <el-option
              v-for="item in buyModeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </span>
        <span class="inputBox" v-if="activityList.length>0">
          活动名称:
          <el-select v-model="activityId" placeholder="请选择" @change="activityChange">
            <el-option
              v-for="item in activityList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </span>
        <span class="inputBox">
          物流单号:
          <el-input class="inputStyle" v-model="trackingNumber" placeholder="请输入物流单号"></el-input>
        </span>
        <span class="inputBox">
          下单时间：
          <el-date-picker
            v-model="dateChangeVal"
            type="datetimerange"
            start-placeholder="起始时间"
            end-placeholder="截止时间"
            @change="dateChange"
          ></el-date-picker>
        </span>
      </div>
      <div class="searchTop-right">
        <el-button type="primary" @click="searchEvent">搜索</el-button>
        <el-button type="info" @click="exportExcel">导出</el-button>
        <el-button type="info" @click="seachExport">查询内容全部导出</el-button>
        <el-button type="info" @click="logisticsport">导入物流信息</el-button>
      </div>
    </div>
    <div class="order-table">
      <el-table
        :data="tableData"
        @selection-change="handleSelectionChange"
        border
        ref="multipleTable"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="orderNumber" label="订单编号" width="200"></el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="mobileNumber" label="联系方式" width="120">
          <template slot-scope="scope">
            <!-- 判断号码是否为虚拟号码，如果是字体颜色为红 -->
            <span
              style="color:#F56C6C"
              v-if="/^(?:\+?86)?1(?:7[01]|6[257])\d{8}$/.test(scope.row.mobileNumber)"
            >{{scope.row.mobileNumber}}</span>
            <span v-else>{{scope.row.mobileNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderAmount" label="订单金额" width="120"></el-table-column>
        <el-table-column prop label="购买方式" width="160" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.orderType==1">正常购买</span>
            <span v-if="scope.row.orderType==3">新人免费体验订单</span>
            <span v-if="scope.row.orderType==4">信用卡用户免费领订单</span>
            <span v-if="scope.row.orderType==5">渠道合作活动订单</span>
            <span v-if="scope.row.orderType==6">FreeBuy活动订单</span>
            <span v-if="scope.row.orderType==7">FreeBuy订单</span>
            <span v-if="scope.row.orderType==8">线下-普通订单</span>
            <span v-if="scope.row.orderType==9">线下-FreeBuy订单</span>
            <span v-if="scope.row.orderType==10">FreeBuy转正常购买</span>
            <span v-if="scope.row.orderType==11">钻石合伙人订单</span>
            <span v-if="scope.row.orderType==12">爱心捐助订单</span>
            <span v-if="scope.row.orderType==13">好友赞助订单</span>
            <span v-if="scope.row.orderType==14">FreeBuy赞助订单</span>
            <span v-if="scope.row.orderType == 15">线上新人专区订单</span>
            <span v-if="scope.row.orderType == 16">线下新人专区订单</span>
            <span v-if="scope.row.orderType == 17">线上商品活动订单</span>
            <span v-if="scope.row.orderType == 18">线下商品活动订单</span>
            <span v-if="scope.row.orderType == 19">线上商品活动-FreeBuy订单</span>
            <span v-if="scope.row.orderType == 20">线下商品活动-FreeBuy订单</span>
            <span v-if="scope.row.orderType == 21">预售订单</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalDiscount" label="总优惠金额" width="120"></el-table-column>
        <el-table-column prop="quantity" label="商品个数" width="80"></el-table-column>
        <el-table-column prop="orderAddressDetail.detailedAddress" label="收货地址" width="220"></el-table-column>
        <el-table-column label="物流" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.orderLogisticsDetailList==''">
              <span v-if="scope.row.isDeliverGoods">此商品无需发货</span>
              <span v-else>未发货</span>
            </span>
            <span
              v-if="scope.row.orderLogisticsDetailList !=''"
            >{{scope.row.orderLogisticsDetailList[0].companyName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="160">
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.orderTimeDetail" :key="index">
              <span v-if="item.status==1">{{item.statusTime | dateFormat}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.latestStatus==1">待支付</span>
            <span v-if="scope.row.latestStatus==2">待发货</span>
            <span v-if="scope.row.latestStatus==3">待使用</span>
            <span v-if="scope.row.latestStatus==4">待收货</span>
            <span v-if="scope.row.latestStatus==5">待评价</span>
            <span v-if="scope.row.latestStatus==6">已完成</span>
            <span v-if="scope.row.latestStatus==7 || scope.row.latestStatus==8">退款中</span>
            <span v-if="scope.row.latestStatus==9">取消退款</span>
            <span v-if="scope.row.latestStatus==10">交易关闭</span>
            <span v-if="scope.row.latestStatus==11">退款失败</span>
            <span v-if="scope.row.latestStatus==12">已取消</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-button type="text" @click="toOrderDetail(scope.row.id)">查看</el-button>
            <el-button
              type="text"
              v-if="scope.row.latestStatus==2"
              @click="deliverGoods(scope.row.id)"
            >发货</el-button>
            <el-button
              type="text"
              v-if="scope.row.latestStatus==11 && scope.row.orderLogisticsDetailList==''"
              @click="deliverGoods(scope.row.id)"
            >发货</el-button>
            <el-button
              type="text"
              v-if="scope.row.latestStatus==2"
              @click="noDeliverGoods(scope.row.id)"
            >无需发货</el-button>
            <el-button
              type="text"
              v-if="scope.row.latestStatus==11 && scope.row.orderLogisticsDetailList==''"
              @click="noDeliverGoods(scope.row.id)"
            >无需发货</el-button>
            <el-button
              type="text"
              v-if="scope.row.latestStatus==7 || scope.row.latestStatus==8"
              @click="lookRefundTxt(scope.row.id)"
            >退款原因</el-button>
            <el-button
              type="text"
              v-if="scope.row.latestStatus==11"
              @click="lookRefundTxt(scope.row.id)"
            >拒绝原因</el-button>
            <!-- <el-button
              type="text"
              v-if="scope.row.latestStatus==2 && scope.row.transStatementDetail.status!=14"
              @click="refund(scope.row.id)"
            >退款</el-button>-->
            <el-button
              type="text"
              v-if="(scope.row.latestStatus==7 || scope.row.latestStatus==8 || scope.row.latestStatus==11) && scope.row.transStatementDetail.status != 14"
              @click="refundEvent(scope.row.id)"
            >退款</el-button>

            <!-- <el-button type="text" v-if="scope.row.latestStatus==7 || scope.row.latestStatus==8" @click="refundNo(scope.row.id)">拒绝退款</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="totalNum">总计：{{pageTotal}}条</div>
    <div class="order-bottom" v-if="tableData.length>0">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pageTotal"
        :page-size="10"
        @current-change="pageChange($event)"
      ></el-pagination>
    </div>
    <!-- 发货弹窗 -->
    <el-dialog title="发货" :visible.sync="deliverGoodsState" width="30%">
      <el-form :model="dgform">
        <el-form-item label="选择物流">
          <el-select v-model="dgform.logisticsId" placeholder="选择物流" style="width:400px">
            <el-option
              v-for="(item,index) in logisticsListArr"
              :key="index"
              :label="item.companyName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input
            v-model="dgform.trackingNumber"
            autocomplete="off"
            style="width:400px"
            maxlength="32"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deliverGoodsState = false">取 消</el-button>
        <el-button type="primary" @click="saveDeliverGoods">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 退款弹窗 -->
    <el-dialog title="退款" :visible.sync="refundState" width="30%">
      <span>确定要退款吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="refundNo">拒 绝</el-button>
        <el-button type="primary" @click="refundOk">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 拒绝退款弹窗 -->
    <el-dialog title="拒绝退款" :visible.sync="refundNoState" width="30%">
      <el-form :model="dgform">
        <el-form-item label="拒绝原因">
          <el-input
            type="textarea"
            v-model="rnform.refundNoTxt"
            autocomplete="off"
            style="width:400px;"
            placeholder="请填写拒绝原因(100字以内)"
            maxlength="100"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refundNoState = false">取 消</el-button>
        <el-button type="primary" @click="saveRefundNoTxt">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 发货弹窗  -->
    <shipPop ref="ship"></shipPop>

    <!-- 导入物流信息弹窗 -->
    <logisticsport ref="logisticsport"></logisticsport>
  </div>
</template>

<script>
import {
  getOrderList,
  getLogisticsCompanyList,
  addOrderLogistics,
  refundAudit,
  getMerchantBusinessList,
  queryOrderReason,
  getExcel,
  queryActivitiesByOrderType,
  getMerchantAuditListByWhereExcel,
  applyRefundMerchant,
  noLogistics
} from "@/network/api";
import shipPop from "./common/shipPop";
import logisticsport from "./common/logisticsport";
export default {
  data() {
    return {
      orderId: "",
      userPhone: "",
      multipleSelection: [],
      multipleSelectionAll: [],
      idKey: "orderNumber",
      selStatus: "",
      dateChangeVal: "",
      orderStartTime: "",
      orderEndTime: "",
      businessName: "",
      selIndustryClass: "",
      industryClassList: [],
      tableData: [
        {
          id: 0,
          name: "xkm"
        }
      ],
      selStatusList: [
        {
          value: 0,
          label: "全部订单"
        },
        {
          value: 1,
          label: "待支付"
        },
        {
          value: 2,
          label: "待发货"
        },
        {
          value: 3,
          label: "待使用"
        },
        {
          value: 4,
          label: "待收货"
        },
        {
          value: 5,
          label: "待评价"
        },
        {
          value: 6,
          label: "已完成"
        },
        {
          value: "7,8",
          label: "退款中"
        },
        {
          value: 9,
          label: "取消退款"
        },
        {
          value: 10,
          label: "交易关闭"
        },
        {
          value: 11,
          label: "退款失败"
        },
        {
          value: 12,
          label: "已取消"
        }
      ],
      buyModeList: [
        {
          value: 1,
          label: "正常购买"
        },
        {
          value: 3,
          label: "新人免费体验订单"
        },
        {
          value: 4,
          label: "信用卡用户免费领"
        },
        {
          value: 5,
          label: "渠道合作活动订单"
        },
        {
          value: 6,
          label: "FreeBuy活动订单"
        },
        {
          value: 7,
          label: "FreeBuy订单"
        },
        {
          value: 8,
          label: "线下-普通订单"
        },
        {
          value: 9,
          label: "线下-FreeBuy订单"
        },
        {
          value: 10,
          label: "FreeBuy转正常购买"
        },
        {
          value: 11,
          label: "钻石合伙人订单"
        },
        {
          value: 12,
          label: "爱心捐助订单"
        },
        {
          value: 13,
          label: "好友赞助订单"
        },
        {
          value: 14,
          label: "FreeBuy赞助订单"
        },
        {
          value: 15,
          label: "线上新人专区订单"
        },
        {
          value: 16,
          label: "线下新人专区订单"
        },
        {
          value: 17,
          label: "线上商品活动订单"
        },
        {
          value: 18,
          label: "线下商品活动订单"
        },
        {
          value: 19,
          label: "线上商品活动-FreeBuy订单"
        },
        {
          value: 20,
          label: "线下商品活动-FreeBuy订单"
        },
        {
          value: 21,
          label: "预售订单"
        }
      ],
      buyMode: "",
      activityId: "",
      activityList: [],
      trackingNumber: "", // 物流单号
      pageNumber: 1,
      pageTotal: 1,
      deliverGoodsState: false,
      dgform: {
        logisticsId: "",
        trackingNumber: "",
        orderId: ""
      },
      logisticsListArr: [],
      refundState: false,
      refundOrderId: "",
      refundNoState: false,
      rnform: {
        refundNoTxt: ""
      },
      checkAll: false,
      loadinginstace: false //elementui菊花图
    };
  },
  components: {
    shipPop,
    logisticsport
  },
  mounted() {
    this.searchOrderList();
    this.getBusinessList();
    this.getLogisticsList();
  },
  methods: {
    // 订单列表查询事件
    searchOrderList() {
      let param = {};
      param.pageNumber = this.pageNumber;
      param.pageSize = 10;
      param.orderChannelType = 2;
      if (this.orderId) {
        param.orderNumber = this.orderId;
      }
      if (this.userPhone) {
        param.mobileNumber = this.userPhone;
      }
      if (this.selStatus) {
        param.latestStatus = this.selStatus;
      }
      if (this.orderStartTime) {
        param.orderStartTime = this.orderStartTime;
      }
      if (this.orderEndTime) {
        param.orderEndTime = this.orderEndTime;
      }
      if (this.selIndustryClass) {
        param.businessId = this.selIndustryClass;
      }
      if (this.businessName) {
        param.business = this.businessName;
      }
      if (this.buyMode) {
        param.orderType = this.buyMode;
      }
      if (this.trackingNumber) {
        param.trackingNumber = this.trackingNumber;
      }
      if (this.activityId) {
        param.activityId = this.activityId;
      }

      getOrderList({ params: param }).then(res => {
        if (res.data.content) {
          this.tableData = res.data.content.items;
          this.pageTotal = res.data.content.totalSize;
          // 判断商品是否是无需发货
          this.tableData.forEach(val => {
            val.isDeliverGoods = false;
            val.orderTimeDetail.forEach(item => {
              if (item.remark == "NO_LOGISTICS") {
                val.isDeliverGoods = true;
              }
            });
          });
          setTimeout(() => {
            this.setSelectRow();
          }, 50);
        } else {
          this.tableData = [];
          this.pageTotal = 0;
        }
        this.checkAll = false;
        this.checkList = [];
        this.loadinginstace.close();
      });
    },
    // 设置选中的方法
    setSelectRow() {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return;
      }
      // 标识当前行的唯一键的名称
      let idKey = this.idKey;
      let selectAllIds = [];
      let that = this;
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      this.$refs.multipleTable.clearSelection();
      for (var i = 0; i < this.tableData.length; i++) {
        if (selectAllIds.indexOf(this.tableData[i][idKey]) >= 0) {
          // 设置选中，记住table组件需要使用ref="table"
          this.$refs.multipleTable.toggleRowSelection(this.tableData[i], true);
        }
      }
    },
    // 记忆选择核心方法
    changePageCoreRecordData() {
      // 标识当前行的唯一键的名称
      let idKey = this.idKey;
      let that = this;
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.multipleSelectionAll.length <= 0) {
        this.multipleSelectionAll = this.multipleSelection;
        return;
      }
      // 总选择里面的key集合
      let selectAllIds = [];
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      let selectIds = [];
      // 获取当前页选中的id
      this.multipleSelection.forEach(row => {
        selectIds.push(row[idKey]);
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          that.multipleSelectionAll.push(row);
        }
      });
      let noSelectIds = [];
      // 得到当前页没有选中的id
      this.tableData.forEach(row => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey]);
        }
      });
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < that.multipleSelectionAll.length; i++) {
            if (that.multipleSelectionAll[i][idKey] == id) {
              // 如果总选择中有未被选中的，那么就删除这条
              that.multipleSelectionAll.splice(i, 1);
              break;
            }
          }
        }
      });
    },
    // 勾选chebox
    handleSelectionChange(rows) {
      this.multipleSelection = rows;
      setTimeout(() => {
        this.changePageCoreRecordData();
      }, 50);
    },
    // 获取行业列表
    getBusinessList() {
      getMerchantBusinessList().then(res => {
        this.industryClassList = res.data.content;
        this.loadinginstace = this.$loading({
          lock: true,
          text: "请求中……",
          background: "rgba(0, 0, 0, 0.7)"
        });
      });
    },
    // 获取物流公司列表
    getLogisticsList() {
      getLogisticsCompanyList().then(res => {
        this.logisticsListArr = res.data.content;
      });
    },
    // 分页改变事件
    pageChange(val) {
      this.pageNumber = val;
      this.searchOrderList();
    },
    // 行业分类改变事件
    industryClassChange(val) {
      this.selIndustryClass = val;
      this.searchOrderList();
    },
    // 订单状态改变事件
    selStatusChange(val) {
      this.selStatus = val;
      this.searchOrderList();
    },
    // 搜索时间改变事件
    dateChange(val) {
      this.orderStartTime = this.getDateShow(val[0]);
      this.orderEndTime = this.getDateShow(val[1]);
      this.searchOrderList();
    },
    // 时间格式处理函数
    getDateShow(value) {
      let dt = new Date(value);
      return dt.getTime();
    },
    // 根据购买方式搜索订单列表
    buyModeChange(e) {
      console.log(e);
      this.buyMode = e;
      this.activityId = "";
      this.searchOrderList();
      if (e >= 15) {
        this.queryActivitiesByOrderType(e);
      }
    },
    // 根据订单类型查询活动名称
    queryActivitiesByOrderType(orderType) {
      let parms = {
        orderType: orderType
      };
      queryActivitiesByOrderType({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          // console.log(res.data.content);
          if (res.data.content) {
            this.activityList = [];
            res.data.content.forEach(val => {
              let json = {
                label: val.activityName,
                value: val.activityId
              };
              this.activityList.push(json);
            });
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 选择活动名称
    activityChange(e) {
      // console.log(e);
      this.activityId = e;
      this.searchOrderList();
    },
    // 搜索事件
    searchEvent() {
      this.pageNumber = 1;

      if (this.userPhone) {
        if (/^1[3456789]\d{9}$/.test(this.userPhone)) {
          this.searchOrderList();
        } else {
          this.$message("请输入正确的手机号");
        }
      } else {
        this.searchOrderList();
      }
    },
    // 发货点击事件
    // deliverGoods (id) {
    //   this.dgform.logisticsId = ''
    //   this.dgform.trackingNumber = ''
    //   this.deliverGoodsState = true
    //   this.dgform.orderId = id
    // },
    deliverGoods(id) {
      this.$refs.ship.open(id);
    },
    // 发货确定事件
    saveDeliverGoods() {
      if (this.dgform.logisticsId === "") {
        this.$message("请先选择物流公司");
      } else if (this.dgform.trackingNumber === "") {
        this.$message("请先填写物流单号");
      } else {
        addOrderLogistics(this.dgform).then(res => {
          if (res.data.messageCode === "MSG_1001") {
            this.searchOrderList();
            this.deliverGoodsState = false;
          }
        });
      }
    },
    // 无需发货
    noDeliverGoods(id) {
      let parms = {
        orderId: id
      };
      noLogistics(this.qs.stringify(parms)).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("操作成功");
          this.searchOrderList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 退款点击事件
    refundEvent(id) {
      this.refundState = true;
      this.refundOrderId = id;
    },
    // 确定退款事件
    refundOk() {
      let param = {};
      param.orderId = this.refundOrderId;
      param.type = 1;
      refundAudit(param).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success(res.data.message);
          this.searchOrderList();
          this.refundState = false;
        } else {
          this.$message(res.data.message);
        }
      });
    },
    // 退款点击事件
    refund(id) {
      this.$confirm("确定退款吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          applyRefundMerchant({ orderId: id }).then(res => {
            if (res.data.messageCode === "MSG_1001") {
              this.searchOrderList(id);
              this.$message({
                type: "success",
                message: "退款成功"
              });
            } else {
              this.$message({
                type: "error",
                message: "退款失败"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 拒绝退款事件
    refundNo(id = "") {
      this.refundState = false;
      this.refundNoState = true;
    },
    // 拒绝退款弹窗保存事件
    saveRefundNoTxt() {
      if (this.rnform.refundNoTxt === "") {
        this.$message("请先填写拒绝原因");
      } else {
        let param = {};
        param.orderId = this.refundOrderId;
        param.type = 2;
        param.remark = this.rnform.refundNoTxt;
        refundAudit(param).then(res => {
          if (res.data.statusCode === 200) {
            this.searchOrderList();
            this.refundNoState = false;
          }
        });
      }
    },
    // 查看退款/拒绝原因
    lookRefundTxt(id) {
      queryOrderReason(`?orderId=${id}`).then(res => {
        this.$alert(res.data.content, "原因", {
          confirmButtonText: "知道了"
        });
      });
    },
    // 跳转订单详情
    toOrderDetail(id) {
      this.$router.push({ path: "/orderDetail", query: { orderid: id } });
    },
    // 导出事件
    exportExcel() {
      if (this.multipleSelectionAll.length > 0) {
        let ids = [];

        this.multipleSelectionAll.forEach(item => {
          ids.push(item.id);
        });

        getExcel(ids.toString()).then(res => {
          this.download(res);
        });
      } else {
        this.$message("请先选择你要导出的数据");
      }
    },
    // 搜索导出全部内容
    seachExport() {
      let param = {
        orderChannelType: 2 // 订单类型:1：自营订单 2：商家订单
      };
      if (this.orderId) {
        param.orderNumber = this.orderId; // 订单号
      }
      if (this.userPhone) {
        param.mobileNumber = this.userPhone; // 用户电话
      }
      if (this.selStatus) {
        param.latestStatus = this.selStatus; // 状态
      }
      if (this.orderStartTime) {
        param.orderStartTime = this.orderStartTime; // 下单起始时间
      }
      if (this.orderEndTime) {
        param.orderEndTime = this.orderEndTime; // 下单截止时间
      }
      if (this.selIndustryClass) {
        param.businessId = this.selIndustryClass; // 行业ID
      }
      if (this.businessName) {
        param.business = this.businessName; // 所选商家
      }
      if (this.buyMode) {
        // 购买方式
        param.orderType = this.buyMode;
      }
      if (this.trackingNumber) {
        //物流单号
        param.trackingNumber = this.trackingNumber;
      }
      if (this.activityId) {
        //活动id
        param.activityId = this.activityId;
      }

      getMerchantAuditListByWhereExcel(param).then(res => {
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
      a.setAttribute("download", "商家订单列表.xls");
      document.body.appendChild(a);
      a.click();
    },
    // 导入物流信息
    logisticsport() {
      this.$refs.logisticsport.open();
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
    text-align: center;
    margin-top: 30px;
    button,
    li {
      cursor: pointer;
    }
  }
  .totalNum {
    margin-top: 20px;
    font-size: 14px;
  }
}
</style>
