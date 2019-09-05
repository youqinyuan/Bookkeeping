<template>
    <div class="orderDetail" v-if="orderObj">
        <div class="titleStyle">订单信息</div>
        <div class="orderInfoBox">
            <div class="orderInfoItem">订单编号：{{orderObj.orderNumber}}</div>
            <div class="orderInfoItem">订单金额：{{orderObj.orderAmount}}元</div>
            <div class="orderInfoItem">商品个数：{{orderObj.quantity}}个</div>
            <div class="orderInfoItem">下单时间：
                <span v-for='(item,index) in orderObj.orderTimeDetail' :key='index'>
                    <span v-if="item.status==1">{{item.statusTime | getDateShow}}</span>
                </span>
            </div>
            <div class="orderInfoItem">订单状态：
                <span v-if="orderObj.latestStatus==1">待支付</span>
                <span v-if="orderObj.latestStatus==2">待发货</span>
                <span v-if="orderObj.latestStatus==3">待使用</span>
                <span v-if="orderObj.latestStatus==4">待收货</span>
                <span v-if="orderObj.latestStatus==5">待评价</span>
                <span v-if="orderObj.latestStatus==6">已完成</span>
                <span v-if="orderObj.latestStatus==7">待发货-退款中</span>
                <span v-if="orderObj.latestStatus==8">待评价-退款中</span>
                <span v-if="orderObj.latestStatus==9">取消退款</span>
                <span v-if="orderObj.latestStatus==10">退款成功</span>
                <span v-if="orderObj.latestStatus==11">退款失败</span>
                <span v-if="orderObj.latestStatus==12">已取消</span>
            </div>
        </div>
        <div class="titleStyle">商品信息</div>
        <div class="orderInfoBox">
            <div class="orderInfoItem" v-for="(item,index) in orderObj.orderGoodsDetail" :key="index">
                商品名：{{item.goodsName}} ( 分类：{{item.goodsCategory}},规格：{{item.specDesc}},折扣：{{item.dctRate}}%,原价：{{item.orgPrice}}元
                <span v-if="item.period==0">，返现：立返</span>
                <span v-else-if="item.period==null"></span>
                <span v-else>，返现：{{item.period}}期 (
                    <span v-if="item.period==item.returnedPeriod">{{item.returnedPeriod}}进行中,
                        返现时间：
                        <span v-for="(ite,inde) in item.orderGoodsCashBackItem" :key='inde'>
                            <span v-if="ite.period==item.returnedPeriod">{{ite.returnTime | getDateShow}}</span>
                        </span>
                    </span>
                    <span v-else>{{item.returnedPeriod+1}}期进行中,
                        返现时间：
                        <span v-for="(ite,inde) in item.orderGoodsCashBackItem" :key='inde'>
                            <span v-if="ite.period==item.returnedPeriod+1">{{ite.returnTime | getDateShow}}</span>
                        </span>
                    </span>
                )</span>
              )
            </div>
        </div>
        <div class="titleStyle">用户信息</div>
        <div class="orderInfoBox">
            <div class="orderInfoItem">用户编号：{{orderObj.userId}}</div>
            <div class="orderInfoItem">用户名：{{orderObj.userName}}</div>
            <div class="orderInfoItem">联系方式：{{orderObj.mobileNumber}}</div>
            <div class="orderInfoItem" v-if="orderObj.orderAddressDetail">收货信息：收货人：{{orderObj.orderAddressDetail.receiverName}}，手机号码：{{orderObj.orderAddressDetail.mobileNumber}}，所在地区：{{orderObj.orderAddressDetail.districtAddress}}，详细地址：{{orderObj.orderAddressDetail.detailedAddress}}</div>
            <div class="orderInfoItem">上级：{{orderObj.parentName || '无'}}</div>
        </div>
        <div class="titleStyle">物流信息</div>
        <div class="orderInfoBox">
          <div v-for="(item,index) in orderObj.orderLogisticsDetailList" :key="index" style="width:100%;margin-bottom:15px;">
            <span class="orderInfoItem">{{item.goodsDetailSpecDesc}}</span>
            <span class="orderInfoItem">物流：{{item.companyName ? item.companyName : '暂无'}}</span>
            <span class="orderInfoItem">物流单号：{{item.trackingNumber ? item.trackingNumber : '暂无'}}</span>
            <el-button type="primary" size="mini" v-if="orderObj.latestStatus==4" @click="modifyNum(orderObj.id,item)">修改物流单号</el-button>
            <el-button type="primary" size="mini" v-if="orderObj.latestStatus==4" @click="lookLogistics(item.logisticsDto)">查看物流信息</el-button>
          </div>

          <div v-for="(ite) in orderObj.orderGoodsTobeShippedList" :key="ite.id" style="width:100%">
            <span class="orderInfoItem">{{ite.goodsName}}-{{ite.specDesc}}</span>
            <span class="orderInfoItem">物流：暂无</span>
            <span class="orderInfoItem">物流单号：暂无</span>
            <el-button type="primary" size="mini" v-if="orderObj.latestStatus==4" @click="AddmodifyNum(orderObj.id)">添加物流单号</el-button>
          </div>
            
          <div class="orderInfoItem" v-if="orderObj.latestStatus==5"><span class="mark">已送达</span></div>
        </div>
        <div v-if="orderObj.latestStatus==7 || orderObj.latestStatus==8 || orderObj.latestStatus==10 || orderObj.latestStatus==11" class="titleStyle">退款信息</div>
        <div v-if="orderObj.latestStatus==7 || orderObj.latestStatus==8 || orderObj.latestStatus==10 || orderObj.latestStatus==11" class="orderInfoBox">
          <div class="orderInfoItem-1" v-for="(item,index) in orderObj.orderTimeDetail" :key="index">
              <span v-if="item.status==7 || item.status==8">申请退款时间：{{item.statusTime | getDateShow}}</span>
              <span v-if="item.status==10">通过退款时间：{{item.statusTime | getDateShow}}</span>
              <span v-if="item.status==11">拒绝退款时间：{{item.statusTime | getDateShow}}</span>
              <span v-if="item.status==7 || item.status==8">退款理由：{{item.desc || '无'}}</span>
              <span v-if="item.status==11">拒绝理由：{{item.desc || '无'}}</span>
          </div>
        </div>
        <div v-if="orderObj.latestStatus==6 && orderObj.orderTimeDetail" class="titleStyle">退款信息</div>
        <div v-if="orderObj.latestStatus==6 && orderObj.orderTimeDetail" class="orderInfoBox">
          <div class="orderInfoItem-1" v-for="(item,index) in orderObj.orderTimeDetail" :key="index">
              <span v-if="item.status==7 || item.status==8">申请退款时间：{{item.statusTime | getDateShow}}</span>
              <span v-if="item.status==10">通过退款时间：{{item.statusTime | getDateShow}}</span>
              <span v-if="item.status==11">拒绝退款时间：{{item.statusTime | getDateShow}}</span>
              <span v-if="item.status==7 || item.status==8">退款理由：{{item.desc || '无'}}</span>
              <span v-if="item.status==11">拒绝理由：{{item.desc || '无'}}</span>
          </div>
        </div>
        <div v-if="orderObj.latestStatus==12" class="titleStyle">取消信息</div>
        <div v-if="orderObj.latestStatus==12" class="orderInfoBox">
            <div class="orderInfoItem">取消原因：<span v-for="(item,index) in orderObj.orderTimeDetail" :key="index"><span v-if="item.status==12">{{item.desc || '无'}}</span></span></div>
        </div>
        <div v-if="orderObj.latestStatus==6 && orderObj.userInteractDetail" class="titleStyle">评论信息</div>
        <div v-if="orderObj.latestStatus==6 && orderObj.userInteractDetail" class="orderInfoBox">
          <div class="orderInfoItem-1" v-for="(item,index) in orderObj.userInteractDetail" :key="index">
            <p v-if="item.action==1">评论时间：{{item.createTime | getDateShow}}</p>
            <p v-if="item.action==1">评论内容：{{item.content}}</p>
            <p v-if="item.action==2">回复时间：{{item.createTime | getDateShow}}</p>
            <p v-if="item.action==2">回复内容：{{item.content}}</p>
          </div>
        </div>
        <div class="bottom-btn">
            <el-button type="primary" v-if="orderObj.latestStatus==2 && orderObj.transStatementDetail.status!=14" @click="deliverGoods(orderObj.id)">发货</el-button>
            <el-button type="success" v-if="orderObj.latestStatus==2 && orderObj.transStatementDetail.status!=14" @click="refund(orderObj.id)">退款</el-button>
            <el-button type="success" v-if="orderObj.latestStatus==1" @click="cancelOrder(orderObj.id)">取消订单</el-button>
            <el-button type="success" v-if="orderObj.latestStatus==7 || orderObj.latestStatus==8" @click="refundEvent(orderObj.id)">退款</el-button>
            <el-button type="primary" v-if="orderObj.latestStatus==11" @click="refundEvent(orderObj.id)">退款</el-button>
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
                    <el-input v-model="dgform.trackingNumber" autocomplete="off" style="width:400px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deliverGoodsState = false">取 消</el-button>
                <el-button type="primary" @click="saveDeliverGoods(orderObj.id)">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改物流弹窗 -->
        <el-dialog title="修改物流单号" :visible.sync="modifyNumState" width='30%'>
            <el-form :model="dgform">
                <el-form-item label="选择物流">
                <el-select v-model="dgform.logisticsId" placeholder="选择物流" style="width:400px">
                    <el-option v-for="(item,index) in logisticsListArr" :key="index" :label="item.companyName" :value="item.id"></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="物流单号">
                    <el-input v-model="dgform.trackingNumber" autocomplete="off" style="width:400px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="modifyNumState = false">取 消</el-button>
                <el-button type="primary" @click="saveModifyNum(orderObj.id)">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 查看物流信息弹窗 -->
        <el-dialog title="查看物流信息" :visible.sync="lookLogisticsState">
            <div class="logisticsList" v-for="(item,index) in lookLogisticsList" :key="index">
                <div class="logisticsItem">时间：{{item.datetime}}</div>
                <div class="logisticsItem">{{item.remark}}</div>
            </div>
        </el-dialog>
        <!-- 退款弹窗 -->
        <el-dialog
            title="退款"
            :visible.sync="refundState"
            width="30%">
            <span>确定要退款吗</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="refundNo">拒 绝</el-button>
                <el-button type="primary" @click="refundOk">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 拒绝退款弹窗 -->
        <el-dialog title="发货" :visible.sync="refundNoState" width='30%'>
            <el-form :model="dgform">
                <el-form-item label="物流单号">
                    <el-input type="textarea" v-model="rnform.refundNoTxt" autocomplete="off" style="width:400px;" placeholder="请填写拒绝原因(100字以内)" maxlength="100"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="refundNoState = false">取 消</el-button>
                <el-button type="primary" @click="saveRefundNoTxt">保 存</el-button>
            </div>
        </el-dialog>

        <!-- 发货弹窗  -->
        <shipPop ref="ship"></shipPop>
    </div>
</template>

<script>
import { queryOrder, addOrderLogistics, getLogisticsCompanyList, applyRefundMerchant, queryLogistics, cancelOrderMerchant, refundAudit } from '@/network/api'
import shipPop from './common/shipPop'
export default {
  data () {
    return {
      orderObj: {},
      deliverGoodsState: false,
      dgform: {
        logisticsId: '',
        trackingNumber: '',
        orderId: ''
      },
      logisticsListArr: [],
      lookLogisticsState: false,
      lookLogisticsList: [],
      refundState: false,
      refundOrderId: '',
      refundNoState: false,
      rnform: {
        refundNoTxt: ''
      },
      modifyNumState: false
    }
  },
  components: {
    shipPop
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
  mounted () {
    this.getOrderList(this.$route.query.orderid)
    this.getLogisticsList()
  },
  methods: {
    // 查询订单详情
    getOrderList (id) {
      queryOrder(`?orderId=${id}`).then(res => {
        this.orderObj = res.data.content
      })
    },
    // 获取物流公司列表
    getLogisticsList () {
      getLogisticsCompanyList().then(res => {
        this.logisticsListArr = res.data.content
      })
    },
    // 发货点击事件
    // deliverGoods (id) {
    //   this.deliverGoodsState = true
    //   this.dgform.orderId = id
    // },
    deliverGoods(id){
      this.$refs.ship.open(id)
    },
    // 发货确定事件
    saveDeliverGoods (id) {
      if (this.dgform.logisticsId === '') {
        this.$message('请先选择物流公司')
      } else if (this.dgform.trackingNumber === '') {
        this.$message('请先填写物流单号')
      } else {
        addOrderLogistics(this.dgform).then(res => {
          if (res.data.messageCode === 'MSG_1001') {
            this.getOrderList(id)
            this.$message({
              type: 'success',
              message: '发货成功'
            })
            this.deliverGoodsState = false
          }
        })
      }
    },
    // 修改物流单号确认事件
    saveModifyNum (id) {
      if (this.dgform.logisticsId === '') {
        this.$message('请先选择物流公司')
      } else if (this.dgform.trackingNumber === '') {
        this.$message('请先填写物流单号')
      } else {
        addOrderLogistics(this.dgform).then(res => {
          if (res.data.messageCode === 'MSG_1001') {
            this.getOrderList(id)
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.modifyNumState = false
          }
        })
      }
    },
    // 退款点击事件
    refund (id) {
      this.$confirm('确定退款吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        applyRefundMerchant({orderId: id}).then(res => {
          if (res.data.messageCode === 'MSG_1001') {
            this.getOrderList(id)
            this.$message({
              type: 'success',
              message: '退款成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: '退款失败'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 修改物流单号
    modifyNum (orderid,item) { // 第一个参数为订单orderid, 第二个为选择的物流信息
      this.$refs.ship.openUnitePop(orderid,item)
    },
    // 添加物流单号
    AddmodifyNum(orderid){
      this.$refs.ship.openMultiplePop(orderid)
    },
    // 查询物流信息
    lookLogistics (logisticsDto) {
      if(!logisticsDto){
        this.$message('待揽件')
        return
      }
      this.lookLogisticsList = logisticsDto?logisticsDto.list:null
      this.lookLogisticsState = true
    },
    // 取消订单事件
    cancelOrder (id) {
      this.$confirm('确定取消订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelOrderMerchant(id).then(res => {
          this.getOrderList(id)
          this.$message({
            type: 'success',
            message: '取消订单成功'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
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
        if (res.data.statusCode === 200) {
          this.getOrderList(this.$route.query.orderid)
          this.refundState = false
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
          if (res.data.statusCode === 200) {
            this.getOrderList(this.$route.query.orderid)
            this.refundNoState = false
          }
        })
      }
    }
  }
}
</script>

<style lang='less' scoped>
.logisticsList{
    display: flex;
    justify-content: space-between;
    padding-left: 30px;
    padding-right: 30px;
    box-sizing: border-box;
    .logisticsItem{
        font-size: 14px;
        color: #333;
        line-height: 30px;
    }
}
.orderDetail{
    padding: 30px;
    box-sizing: border-box;
    .titleStyle{
        width: 100%;
        height: 30px;
        font-size: 14px;
        border-bottom: solid 1px #ccc;
    }
    .orderInfoBox{
        width: 100%;
        height: auto;
        border:solid 1px #ccc;
        padding: 30px 60px 30px 60px;
        box-sizing: border-box;
        margin-top: 20px;
        margin-bottom: 30px;
        display: flex;
        flex-wrap: wrap;
        .orderInfoItem{
            font-size: 14px;
            color: #333;
            line-height: 30px;
            margin-right: 20px;
            >.mark{
                color: antiquewhite;
                font-size: 20px;
                font-weight: bold;
                margin-left: 20px;
            }
        }
        .orderInfoItem-1{
            width: 100%;
            font-size: 14px;
            color: #333;
            line-height: 30px;
            margin-right: 60px;
            >span{
                margin-right: 60px;
            }
        }
        .orderInfoItem-btn{
            margin-left: 20px;
        }
    }
    .bottom-btn{
        width: 200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        margin-top: 60px;
    }
}
</style>
