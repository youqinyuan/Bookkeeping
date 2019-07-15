<template>
  <div class="selfSupportOrder">
    <div class="order-searchTop">
      <div class="searchTop-left">
        <span class="inputBox">订单编号:<el-input class="inputStyle" v-model="orderId" placeholder="请输入订单编号"></el-input></span>
        <span class="inputBox">用户电话:<el-input class="inputStyle" v-model.number="userPhone" placeholder="请输入用户电话" maxlength="11"></el-input></span>
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
        <span class="inputBox">订单状态:
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
            下单时间：
            <el-date-picker
            v-model="dateChangeVal"
            type="daterange"
            start-placeholder="起始时间"
            end-placeholder="截止时间"
            @change="dateChange"
            ></el-date-picker>
        </span>
      </div>
      <div class="searchTop-right">
        <el-button type="primary" @click="searchEvent">搜索</el-button>
        <el-button type="info" @click="exportExcel">导出</el-button>
      </div>
    </div>
    <div class="order-table">
      <el-checkbox label="全选" v-model="checkAll" @change="checkAllEvent"></el-checkbox>
      <el-checkbox-group v-model="checkList" @change="selGoodChange">
        <el-table :data="tableData" stripe style="width: 100%" key="scope.row.orderNumber">
          <el-table-column label="订单编号" width="220">
            <template slot-scope="scope">
              <el-checkbox :label="scope.row.orderNumber"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="用户名" width="160"></el-table-column>
          <el-table-column prop="mobileNumber" label="联系方式" width="160"></el-table-column>
          <el-table-column prop="orderAmount" label="订单金额" width="160"></el-table-column>
          <el-table-column prop="quantity" label="商品个数" width="140"></el-table-column>
          <el-table-column prop="orderAddressDetail.detailedAddress" label="收货地址" width="160"></el-table-column>
          <el-table-column label="物流" width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.orderLogisticsDetail">
                <span v-if="scope.row.orderLogisticsDetail.companyName">{{scope.row.orderLogisticsDetail.companyName}}</span>
                <span v-else>未发货</span>
              </span>
              <span v-else>未发货</span>
            </template>
          </el-table-column>
          <el-table-column label="下单时间" width="160">
            <template slot-scope="scope">
              <span v-for='(item,index) in scope.row.orderTimeDetail' :key='index'>
                <span v-if="item.status==1">{{item.statusTime | getDateShow}}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.latestStatus==1">待支付</span>
              <span v-if="scope.row.latestStatus==2">待发货</span>
              <span v-if="scope.row.latestStatus==3">待使用</span>
              <span v-if="scope.row.latestStatus==4">待收货</span>
              <span v-if="scope.row.latestStatus==5">待评价</span>
              <span v-if="scope.row.latestStatus==6">已完成</span>
              <span v-if="scope.row.latestStatus==7 || scope.row.latestStatus==8">退款中</span>
              <span v-if="scope.row.latestStatus==9">取消退款</span>
              <span v-if="scope.row.latestStatus==10">退款成功</span>
              <span v-if="scope.row.latestStatus==11">退款失败</span>
              <span v-if="scope.row.latestStatus==12">已取消</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240">
            <template slot-scope="scope">
              <el-button type="text" @click="toOrderDetail(scope.row.id)">查看</el-button>
              <el-button type="text" v-if="scope.row.latestStatus==2" @click="deliverGoods(scope.row.id)">发货</el-button>
              <el-button type="text" v-if="scope.row.latestStatus==7 || scope.row.latestStatus==8" @click="lookRefundTxt(scope.row.id)">退款原因</el-button>
              <el-button type="text" v-if="scope.row.latestStatus==11" @click="lookRefundTxt(scope.row.id)">拒绝原因</el-button>
              <el-button type="text" v-if="scope.row.latestStatus==7 || scope.row.latestStatus==8 || scope.row.latestStatus==11" @click="refundEvent(scope.row.id)">退款</el-button>
              <!-- <el-button type="text" v-if="scope.row.latestStatus==7 || scope.row.latestStatus==8" @click="refundNo(scope.row.id)">拒绝退款</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </el-checkbox-group>
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
    <el-dialog title="发货" :visible.sync="deliverGoodsState" width='30%'>
      <el-form :model="dgform">
        <el-form-item label="选择物流">
          <el-select v-model="dgform.logisticsId" placeholder="选择物流" style="width:400px">
            <el-option v-for="(item,index) in logisticsListArr" :key="index" :label="item.companyName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号">
            <el-input v-model="dgform.trackingNumber" autocomplete="off" style="width:400px" maxlength="32"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deliverGoodsState = false">取 消</el-button>
        <el-button type="primary" @click="saveDeliverGoods">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 退款弹窗 -->
    <el-dialog
        title="退款"
        :visible.sync="refundState"
        width="30%">
        <span>请与商家用户沟通后退款</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="refundState = false">取 消</el-button>
            <el-button type="primary" @click="refundOk">已沟通确认退款</el-button>
        </span>
    </el-dialog>
    <!-- 拒绝退款弹窗 -->
    <el-dialog title="拒绝退款" :visible.sync="refundNoState" width='30%'>
      <el-form :model="dgform">
        <el-form-item label="拒绝原因">
            <el-input type="textarea" v-model="rnform.refundNoTxt" autocomplete="off" style="width:400px;" placeholder="请填写拒绝原因(100字以内)" maxlength="100"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refundNoState = false">取 消</el-button>
        <el-button type="primary" @click="saveRefundNoTxt">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderList, getLogisticsCompanyList, addOrderLogistics, refundAudit, getMerchantBusinessList, queryOrderReason, getExcel } from '@/network/api'
export default {
  data () {
    return {
      orderId: '',
      userPhone: '',
      checkList: [],
      selStatus: '',
      dateChangeVal: '',
      orderStartTime: '',
      orderEndTime: '',
      businessName: '',
      selIndustryClass: '',
      industryClassList: [],
      tableData: [
        {
          id: 0,
          name: 'xkm'
        }
      ],
      selStatusList: [
        {
          value: 0,
          label: '全部订单'
        },
        {
          value: 1,
          label: '待支付'
        },
        {
          value: 2,
          label: '待发货'
        },
        {
          value: 3,
          label: '待使用'
        },
        {
          value: 4,
          label: '待收货'
        },
        {
          value: 5,
          label: '待评价'
        },
        {
          value: 6,
          label: '已完成'
        },
        {
          value: '7,8',
          label: '退款中'
        },
        {
          value: 9,
          label: '取消退款'
        },
        {
          value: 10,
          label: '退款成功'
        },
        {
          value: 11,
          label: '退款失败'
        },
        {
          value: 12,
          label: '已取消'
        }
      ],
      pageNumber: 1,
      pageTotal: 1,
      deliverGoodsState: false,
      dgform: {
        logisticsId: '',
        trackingNumber: '',
        orderId: ''
      },
      logisticsListArr: [],
      refundState: false,
      refundOrderId: '',
      refundNoState: false,
      rnform: {
        refundNoTxt: ''
      },
      checkAll: false
    }
  },
  mounted () {
    this.searchOrderList()
    this.getBusinessList()
    this.getLogisticsList()
  },
  filters: {
    getDateShow: function (value) {
      let dt = new Date(value)
      let y = dt.getFullYear()
      let m = dt.getMonth() + 1
      let d = dt.getDate()
      let h = dt.getHours()
      let mi = dt.getMinutes()
      y = y < 10 ? ('0' + y) : y
      m = m < 10 ? ('0' + m) : m
      d = d < 10 ? ('0' + d) : d
      h = h < 10 ? ('0' + h) : h
      mi = mi < 10 ? ('0' + mi) : mi
      return `${y}-${m}-${d} ${h}:${mi}`
    }
  },
  methods: {
    // 订单列表查询事件
    searchOrderList () {
      let param = {}
      param.pageNumber = this.pageNumber
      param.pageSize = 10
      param.orderChannelType = 2
      if (this.orderId) {
        param.orderNumber = this.orderId
      }
      if (this.userPhone) {
        param.mobileNumber = this.userPhone
      }
      if (this.selStatus) {
        param.latestStatus = this.selStatus
      }
      if (this.orderStartTime) {
        param.orderStartTime = this.orderStartTime
      }
      if (this.orderEndTime) {
        param.orderEndTime = this.orderEndTime
      }
      if (this.selIndustryClass) {
        param.businessId = this.selIndustryClass
      }
      if (this.businessName) {
        param.business = this.businessName
      }

      getOrderList({params: param}).then(res => {
        console.log(res)
        if (res.data.content) {
          this.tableData = res.data.content.items
          this.pageTotal = res.data.content.totalSize
        } else {
          this.tableData = []
          this.pageTotal = 0
        }
        this.checkAll = false
        this.checkList = []
      })
    },
    // renderHeader (h, { column }) {
    //   return h('div', [
    //     h('el-checkbox', {
    //       style: 'margin-top:5px;',
    //       on: {
    //         change: ($event, column) => this.select($event, column) // 选中事件 $event, column，这里$event=true,column是input的dom当在select里打印的时候
    //       }
    //     }),
    //     h('span', column.label)
    //   ])
    // },
    // select ($event, column) {
    //   console.log($event)
    //   if ($event) {
    //     let checkList = []
    //     for (let i of this.tableAllData) {
    //       checkList.push(i.id)
    //     }
    //     this.checkList = checkList
    //   } else {
    //     this.checkList = []
    //   }
    // },
    // 全选事件
    checkAllEvent (val) {
      if (val) {
        let checkList = []
        console.log(this.tableData)
        for (let i of this.tableData) {
          checkList.push(i.orderNumber)
        }
        setTimeout(() => {
          this.checkList = checkList
          console.log(this.checkList)
        })
      } else {
        this.checkList = []
      }
      console.log(this.checkList)
    },
    // 获取行业列表
    getBusinessList () {
      getMerchantBusinessList().then(res => {
        console.log(res)
        this.industryClassList = res.data.content
      })
    },
    // 获取物流公司列表
    getLogisticsList () {
      getLogisticsCompanyList().then(res => {
        console.log(res)
        this.logisticsListArr = res.data.content
      })
    },
    // 分页改变事件
    pageChange (val) {
      console.log(val)
      this.pageNumber = val
      this.searchOrderList()
    },
    // 多选框改变事件
    selGoodChange (val) {
      console.log(val)
      if (val.length < this.tableData.length) {
        this.checkAll = false
      } else if (val.length === this.tableData.length) {
        this.checkAll = true
      }
    },
    // 行业分类改变事件
    industryClassChange (val) {
      console.log(val)
      this.selIndustryClass = val
      this.searchOrderList()
    },
    // 订单状态改变事件
    selStatusChange (val) {
      console.log(val)
      this.selStatus = val
      this.searchOrderList()
    },
    // 搜索时间改变事件
    dateChange (val) {
      console.log(val)
      this.orderStartTime = this.getDateShow(val[0])
      this.orderEndTime = this.getDateShow(val[1])
      this.searchOrderList()
    },
    // 时间格式处理函数
    getDateShow (value) {
      let dt = new Date(value)
      return dt.getTime()
    },
    // 搜索事件
    searchEvent () {
      this.pageNumber = 1

      if (this.userPhone) {
        if (/^1[3456789]\d{9}$/.test(this.userPhone)) {
          this.searchOrderList()
        } else {
          this.$message('请输入正确的手机号')
        }
      } else {
        this.searchOrderList()
      }
    },
    // 发货点击事件
    deliverGoods (id) {
      console.log(id)
      this.dgform.logisticsId = ''
      this.dgform.trackingNumber = ''
      this.deliverGoodsState = true
      this.dgform.orderId = id
    },
    // 发货确定事件
    saveDeliverGoods () {
      console.log(this.dgform)
      if (this.dgform.logisticsId === '') {
        this.$message('请先选择物流公司')
      } else if (this.dgform.trackingNumber === '') {
        this.$message('请先填写物流单号')
      } else {
        console.log(this.dgform)
        addOrderLogistics(this.dgform).then(res => {
          console.log(res)
          if (res.data.messageCode === 'MSG_1001') {
            this.searchOrderList()
            this.deliverGoodsState = false
          }
        })
      }
    },
    // 退款点击事件
    refundEvent (id) {
      this.refundState = true
      this.refundOrderId = id
    },
    // 确定退款事件
    refundOk () {
      let param = {}
      param.orderId = this.refundOrderId
      param.type = 1
      refundAudit(param).then(res => {
        console.log(res)
        if (res.data.statusCode === 200) {
          this.searchOrderList()
          this.refundState = false
        } else {
          this.$message(res.data.message)
        }
      })
    },
    // 拒绝退款事件
    refundNo (id = '') {
      this.refundState = false
      this.refundNoState = true
    },
    // 拒绝退款弹窗保存事件
    saveRefundNoTxt () {
      if (this.rnform.refundNoTxt === '') {
        this.$message('请先填写拒绝原因')
      } else {
        let param = {}
        param.orderId = this.refundOrderId
        param.type = 2
        param.remark = this.rnform.refundNoTxt
        refundAudit(param).then(res => {
          console.log(res)
          if (res.data.statusCode === 200) {
            this.searchOrderList()
            this.refundNoState = false
          }
        })
      }
    },
    // 查看退款/拒绝原因
    lookRefundTxt (id) {
      queryOrderReason(`?orderId=${id}`).then(res => {
        console.log(res)
        this.$alert(res.data.content, '原因', {
          confirmButtonText: '知道了'
        })
      })
    },
    // 跳转订单详情
    toOrderDetail (id) {
      console.log(id)
      this.$router.push({path: '/orderDetail', query: {'orderid': id}})
    },
    // 导出事件
    exportExcel () {
      if (this.checkList.length > 0) {
        let ids = []

        for (let i of this.tableData) {
          for (let j of this.checkList) {
            if (i.orderNumber === j) {
              ids.push(i.id)
            }
          }
        }

        getExcel(ids.toString()).then(res => {
          this.download(res)
        })
      } else {
        this.$message('请先选择你要导出的数据')
      }
    },
    // 下载文件
    download (data) {
      if (!data) {
        return
      }
      let url = window.URL.createObjectURL(new Blob([data.data]))
      let a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.setAttribute('download', '商家订单列表.xlsx')
      document.body.appendChild(a)
      a.click()
    }
  }
}
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
    .searchTop-right {
    }
  }
  .order-table {
    width: 1680px;
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
  .totalNum{
     margin-top: 20px;
     font-size: 14px;
   }
}
</style>
