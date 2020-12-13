<template>
  <div class="orderDetail" v-if="orderObj">
    <div class="titleStyle">订单信息</div>
    <div class="orderInfoBox">
      <div class="orderInfoItem">订单编号：{{orderObj.orderNumber}}</div>
      <div class="orderInfoItem">订单金额：{{orderObj.orderAmount}}元</div>
      <div class="orderInfoItem">商品个数：{{orderObj.quantity}}个</div>
      <div class="orderInfoItem">
        下单时间：
        <span v-for="(item,index) in orderObj.orderTimeDetail" :key="index">
          <span v-if="item.status==1">{{item.statusTime | dateFormat}}</span>
        </span>
      </div>
      <div class="orderInfoItem" v-if="!isWriteOffOrder">
        订单状态：
        <span v-if="orderObj.latestStatus==1">待支付</span>
        <span v-if="orderObj.latestStatus==2">待发货</span>
        <span v-if="orderObj.latestStatus==3">待使用</span>
        <span v-if="orderObj.latestStatus==4">待收货</span>
        <span v-if="orderObj.latestStatus==5">待评价</span>
        <span v-if="orderObj.latestStatus==6">已完成</span>
        <span v-if="orderObj.latestStatus==7">待发货-退款中</span>
        <span v-if="orderObj.latestStatus==8">待评价-退款中</span>
        <span v-if="orderObj.latestStatus==9">取消退款</span>
        <span v-if="orderObj.latestStatus==10">交易关闭</span>
        <span v-if="orderObj.latestStatus==11">退款失败</span>
        <span v-if="orderObj.latestStatus==12">已取消</span>
        <span v-if="orderObj.latestStatus==15">待成团</span>
        <span v-if="orderObj.latestStatus==16">拼团成功</span>
        <span v-if="orderObj.latestStatus==17">拼团失败</span>
        <span v-if="orderObj.latestStatus==18">拼团成功，已使用</span>
        <span v-if="orderObj.latestStatus==19">已过期</span>
      </div>

      <!-- 核销订单购买方式 -->
      <div class="orderInfoItem" v-if="isWriteOffOrder">
        <span v-if="orderObj.buyMode==1">购买方式：普通拼团</span>
        <span v-if="orderObj.buyMode==2">购买方式：一折拼团</span>
      </div>
      <!-- 其他订单购买方式 -->
      <div class="orderInfoItem" v-else>
        <span v-if="orderObj.orderType==1">购买方式：正常购买</span>
        <span v-if="orderObj.orderType==3">购买方式：新人免费体验订单</span>
        <span v-if="orderObj.orderType==4">购买方式：信用卡用户免费领订单</span>
        <span v-if="orderObj.orderType==5">购买方式：渠道合作活动订单</span>
        <span v-if="orderObj.orderType==6">购买方式：FreeBuy活动订单</span>
        <span v-if="orderObj.orderType==7">购买方式：FreeBuy订单</span>
        <span v-if="orderObj.orderType==8">购买方式：线下-普通订单</span>
        <span v-if="orderObj.orderType==9">购买方式：线下-FreeBuy订单</span>
        <span v-if="orderObj.orderType==10">购买方式：FreeBuy转正常购买</span>
        <span v-if="orderObj.orderType==11">购买方式：钻石合伙人订单</span>
        <span v-if="orderObj.orderType==12">购买方式：爱心捐助订单</span>
        <span v-if="orderObj.orderType==13">购买方式：好友赞助订单</span>
        <span v-if="orderObj.orderType==14">购买方式：FreeBuy赞助订单</span>
        <span v-if="orderObj.orderType == 15">购买方式：线上新人专区订单</span>
        <span v-if="orderObj.orderType == 16">购买方式：线下新人专区订单</span>
        <span v-if="orderObj.orderType == 17">购买方式：线上商品活动订单</span>
        <span v-if="orderObj.orderType == 18">购买方式：线下商品活动订单</span>
        <span v-if="orderObj.orderType == 19">购买方式：线上商品活动-FreeBuy订单</span>
        <span v-if="orderObj.orderType == 20">购买方式：线下商品活动-FreeBuy订单</span>
        <span v-if="orderObj.orderType == 21">购买方式：预售订单</span>
        <span v-if="orderObj.orderType == 22">购买方式：商品预售订单</span>
        <span v-if="orderObj.orderType == 23">购买方式：线下商家-普通购买订单</span>
        <span v-if="orderObj.orderType == 24">购买方式：线下商家-0成本购订单</span>
        <span v-if="orderObj.orderType == 26">购买方式：闪付订单</span>
        <span v-if="orderObj.orderType == 27">购买方式：一折购分期订单</span>
        <span v-if="orderObj.orderType == 28">购买方式：普通拼团订单</span>
        <span v-if="orderObj.orderType == 29">购买方式：一折购拼团订单</span>
        <span v-if="orderObj.orderType == 30">购买方式：自定义活动-{{orderObj.activityName}}</span>
      </div>
      <div class="orderInfoItem">备注：{{remark?remark:'无'}}</div>
      <div
        class="orderInfoItem"
        v-if="orderObj.useSeed == 1"
      >种子抵扣：{{orderObj.deductionAmount}}元（消费{{orderObj.deductionSeed}}种子）</div>
      <div class="orderInfoItem">
        订单优惠总金额：{{orderObj.totalDiscount}}元（
        <span
          v-if="orderObj.useSeed == 1"
        >积分减{{orderObj.deductionAmount}}元，</span>
        <span>钻石合伙人{{orderObj.discountRatio/10}}折减{{orderObj.discountAmount}}元</span>
        <span v-if="orderObj.useCoupon == 1">，钻石合伙人购物金减{{orderObj.shoppingAmount}}元</span>）
      </div>
      <div class="orderInfoItem" v-if="orderObj.whetherAdvanceSale == 1">
        <span>违约金：</span>
        <span v-if="orderObj.defaultAmountStatus == 1">待支付：</span>
        <span v-if="orderObj.defaultAmountStatus == 2">已支付：</span>
        <span v-if="orderObj.defaultAmountStatus == 3">已扣除：</span>
        <span v-if="orderObj.defaultAmountStatus == 4">已返还：</span>
        <span>{{orderObj.defaultAmount}}</span>
        <span>元</span>
      </div>
      <div class="orderInfoItem" v-if="orderObj.forumTopicResponse">
        <span>转让信息：</span>
        <span>售价：{{orderObj.forumTopicResponse.expectAmount}}元，</span>
        <span>共返：{{orderObj.forumTopicResponse.cashBackAmount}}元，</span>
        <span>剩余{{orderObj.forumTopicResponse.periodLeft}}期，</span>
        <span>截止{{orderObj.forumTopicResponse.maxReturnTime | dateFormat}}，</span>
        <span>每月{{orderObj.forumTopicResponse.perReturnDay}}号，</span>
        <span>每期返还{{orderObj.forumTopicResponse.perReturnAmount}}，</span>
        <span>年收益率{{orderObj.forumTopicResponse.annualizedRate}}，</span>
        <span>内容：{{orderObj.forumTopicResponse.content}}</span>
      </div>
      <div class="orderInfoItem" v-if="orderObj.orderAddressDetail && isWriteOffOrder">
        <span>自提点：</span>
        <span>{{orderObj.orderAddressDetail.districtAddress}}</span>
        <span>{{orderObj.orderAddressDetail.detailedAddress}}</span>
      </div>
    </div>
    <div class="titleStyle">商品信息</div>
    <div class="orderInfoBox">
      <div class="orderInfoItem" v-for="(item,index) in orderObj.orderGoodsDetail" :key="index">
        商品名：{{item.goodsName}} ( 分类：{{item.goodsCategory}},规格：{{item.specDesc}},折扣：{{item.dctRate}}%,原价：{{item.orgPrice}}元,返现：{{item.cashBack?item.cashBack:0}}元
        <span
          v-if="item.period==0"
        >，返现：立返</span>
        <span v-else-if="item.period==null"></span>
        <span v-else>
          ，返现：{{item.period}}期 (
          <span v-if="item.period==item.returnedPeriod || item.period < 1">
            {{item.returnedPeriod}}期进行中,
            返现时间：
            <span
              v-for="(ite,inde) in item.orderGoodsCashBackItem"
              :key="inde"
            >
              <span v-if="ite.period==item.returnedPeriod || item.period < 1">{{ite.returnTime | dateFormat}}</span>
            </span>
          </span>
          <span v-else>
            {{item.returnedPeriod+1}}期进行中,
            返现时间：
            <span
              v-for="(ite,inde) in item.orderGoodsCashBackItem"
              :key="inde"
            >
              <span
                v-if="ite.period==item.returnedPeriod+1"
              >{{ite.returnTime | dateFormat}}&nbsp;&nbsp;</span>
            </span>
          </span>
          ))
        </span>
        <span>购买数量：{{item.quantity}}个。</span>
        <span v-if="item.orderGoodsApplyRefund">
          <span>退款状态：</span>
          <span v-if="item.orderGoodsApplyRefund.status == 1">退款中，</span>
          <span v-if="item.orderGoodsApplyRefund.status == 2">商家已同意-退款中，</span>
          <span v-if="item.orderGoodsApplyRefund.status == 3">已发货-退款中，</span>
          <span v-if="item.orderGoodsApplyRefund.status == 4">退款失败，</span>
          <span v-if="item.orderGoodsApplyRefund.status == 5">退款成功，</span>
          <span v-if="item.orderGoodsApplyRefund.status == 6">取消退款，</span>
        </span>
        <span>优惠金额：钻石合伙人{{item.discountRatio?item.discountRatio/10:0}}折减{{item.discountAmount?item.discountAmount:0}}元，钻石合伙人购物金减{{item.shoppingAmount?item.shoppingAmount:0}}元，积分减{{item.deductionAmount?item.deductionAmount:0}}元</span>
        <span
          v-if="orderObj.activityName"
        >，{{orderObj.activityName}}减：{{item.activityRatioAmount + item.activityDiscountAmount}}元</span>
        <span
          v-if="item.installmentResponse"
        >，分期期数：{{item.installmentResponse.stagesNumber}}期，剩余每期应支付：{{item.installmentResponse.issueAmount}}元（已还款{{item.installmentResponse.stagesNumber - item.installmentResponse.stagesNumberReturn}}期）</span>
      </div>
    </div>

    <!-- 赠送内容信息 -->
    <div class="titleStyle" v-if="orderObj.activityHistory">赠送内容信息</div>
    <div class="orderInfoBox" v-if="orderObj.activityHistory">
      <div class="orderInfoItem" v-if="orderObj.activityHistory.rewardSeed == 1">
        <span>送种子：{{orderObj.activityHistory.rewardSeedDto.param1}}颗</span>
      </div>
      <div class="orderInfoItem" v-if="orderObj.activityHistory.rewardCashBack == 1">
        <span>送返现：返现金额{{orderObj.activityHistory.rewardCashBackDto.param1}}返现期数{{orderObj.activityHistory.rewardCashBackDto.param2}}</span>
      </div>
      <div class="orderInfoItem" v-if="orderObj.activityHistory.rewardGoods == 1">
        <span>赠送商品：</span>
        <span
          v-for="(item,index) in orderObj.activityHistory.rewardGoodsDtoList"
          :key="index"
        >{{item.goodsName}}+{{item.specDesc}}&nbsp;&nbsp;&nbsp;</span>
      </div>
      <div class="orderInfoItem" v-if="orderObj.activityHistory.rewardMember == 1">
        <span>送身份特权：{{orderObj.activityHistory.rewardMemberDto.param1 == '3'?'合伙人':'钻石合伙人'}}（{{orderObj.activityHistory.rewardMemberDto.param2}}个月）</span>
      </div>
      <div class="orderInfoItem" v-if="orderObj.activityHistory.rewardPaymentAmount == 1">
        <span>减少支付金额：打{{orderObj.activityHistory.rewardPaymentAmountDto.param1}}折，减{{orderObj.activityHistory.rewardPaymentAmountDto.param2}}元</span>
      </div>
      <div class="orderInfoItem" v-if="orderObj.activityHistory.rewardExpressFee == 1">包邮</div>
    </div>

    <!-- 用户信息 -->
    <div class="titleStyle">用户信息</div>
    <div class="orderInfoBox">
      <div class="orderInfoItem">用户编号：{{orderObj.userId}}</div>
      <div class="orderInfoItem">用户名：{{orderObj.userName}}</div>
      <div class="orderInfoItem">联系方式：{{orderObj.mobileNumber}}</div>
      <div
        class="orderInfoItem"
        v-if="orderObj.orderAddressDetail && !isWriteOffOrder"
      >收货信息：收货人：{{orderObj.orderAddressDetail.receiverName}}，手机号码：{{orderObj.orderAddressDetail.mobileNumber}}，所在地区：{{orderObj.orderAddressDetail.districtAddress}}，详细地址：{{orderObj.orderAddressDetail.detailedAddress}}</div>
      <div class="orderInfoItem">上级：{{orderObj.parentName || '无'}}</div>
    </div>
    <div class="titleStyle" v-if="!orderObj.deliveryType">物流信息</div>
    <div class="titleStyle" v-else>配送信息</div>
    <div class="orderInfoBox" v-if="orderObj.deliveryType == 1">
      <span class="orderInfoItem">到店自提</span>
      <span class="orderInfoItem" v-if="orderObj.payType == 1">在线支付</span>
      <span class="orderInfoItem" v-if="orderObj.payType == 2">到付</span>
    </div>
    <div class="orderInfoBox" v-else-if="orderObj.deliveryType == 2">
      <span class="orderInfoItem">商家配送</span>
      <span class="orderInfoItem" v-if="orderObj.payType == 1">在线支付</span>
      <span class="orderInfoItem" v-if="orderObj.payType == 2">到付</span>
      <span class="orderInfoItem">配送费：{{orderObj.expressFee}}</span>
      <span class="orderInfoItem">地址：{{orderObj.orderAddressDetail.detailedAddress}}</span>
    </div>
    <div class="orderInfoBox" v-else-if="isDeliverGoods && !orderObj.deliveryType">
      <span class="orderInfoItem">此商品无需发货</span>
    </div>
    <div class="orderInfoBox" v-else>
      <div
        v-for="(item,index) in orderObj.orderLogisticsDetailList"
        :key="index"
        style="width:100%;margin-bottom:15px;"
      >
        <span class="orderInfoItem">{{item.goodsDetailSpecDesc}}</span>
        <span class="orderInfoItem">物流：{{item.companyName ? item.companyName : '暂无'}}</span>
        <span class="orderInfoItem">物流单号：{{item.trackingNumber ? item.trackingNumber : '暂无'}}</span>
        <el-button
          type="primary"
          size="mini"
          v-if="orderObj.latestStatus==4"
          @click="modifyNum(orderObj.id,item)"
        >修改物流单号</el-button>
        <el-button
          type="primary"
          size="mini"
          v-if="orderObj.latestStatus==4"
          @click="lookLogistics(item.logisticsDto)"
        >查看物流信息</el-button>
      </div>

      <div v-for="(ite) in orderObj.orderGoodsTobeShippedList" :key="ite.id" style="width:100%">
        <span class="orderInfoItem">{{ite.goodsName}}-{{ite.specDesc}}</span>
        <span class="orderInfoItem">物流：暂无</span>
        <span class="orderInfoItem">物流单号：暂无</span>
        <el-button
          type="primary"
          size="mini"
          v-if="orderObj.latestStatus==4"
          @click="AddmodifyNum(orderObj.id)"
        >添加物流单号</el-button>
      </div>

      <div class="orderInfoItem" v-if="orderObj.latestStatus==5">
        <span class="mark">已送达</span>
      </div>
    </div>

    <!-- 用户使用情况 -->
    <div class="titleStyle" v-if="isWriteOffOrder">用户使用情况</div>
    <div class="orderInfoBox" v-if="isWriteOffOrder">
      <div v-if="orderObj.latestStatus==1">待支付</div>
      <div v-if="orderObj.latestStatus==12">已取消</div>
      <div class="orderInfoItem" v-if="orderObj.latestStatus==15">待成团</div>
      <div class="orderInfoItem" v-if="orderObj.latestStatus==16">
        <span>已上传</span>
        <span v-if="orderObj.validStatus == 1">（过期待验证）</span>
      </div>
      <div class="orderInfoItem" v-if="orderObj.latestStatus==10">
        <span v-if="orderObj.verificationCode">已上传（已退款）</span>
        <span v-if="!orderObj.verificationCode">待成团（已退款）</span>
      </div>
      <div class="orderInfoItem" v-if="orderObj.latestStatus==17">拼团失败</div>
      <div class="orderInfoItem" v-if="orderObj.latestStatus==18">已上传（过期已用）</div>
      <div class="orderInfoItem" v-if="orderObj.latestStatus==19">已上传（过期未用）</div>
    </div>
    <div
      v-if="orderObj.latestStatus==7 || orderObj.latestStatus==8 || orderObj.latestStatus==10 || orderObj.latestStatus==11"
      class="titleStyle"
    >退款信息</div>
    <div
      v-if="orderObj.latestStatus==7 || orderObj.latestStatus==8 || orderObj.latestStatus==10 || orderObj.latestStatus==11"
      class="orderInfoBox"
    >
      <div class="orderInfoItem-1" v-for="(item,index) in orderObj.orderTimeDetail" :key="index">
        <span v-if="item.status==7 || item.status==8">申请退款时间：{{item.statusTime | dateFormat}}</span>
        <span v-if="item.status==10">通过退款时间：{{item.statusTime | dateFormat}}</span>
        <span v-if="item.status==11">拒绝退款时间：{{item.statusTime | dateFormat}}</span>
        <span v-if="item.status==7 || item.status==8">退款理由：{{item.desc || '无'}}</span>
        <span v-if="item.status==11">拒绝理由：{{item.desc || '无'}}</span>
      </div>
    </div>
    <div v-if="orderObj.latestStatus==6 && orderObj.orderTimeDetail" class="titleStyle">退款信息</div>
    <div v-if="orderObj.latestStatus==6 && orderObj.orderTimeDetail" class="orderInfoBox">
      <div class="orderInfoItem-1" v-for="(item,index) in orderObj.orderTimeDetail" :key="index">
        <span v-if="item.status==7 || item.status==8">申请退款时间：{{item.statusTime | dateFormat}}</span>
        <span v-if="item.status==10">通过退款时间：{{item.statusTime | dateFormat}}</span>
        <span v-if="item.status==11">拒绝退款时间：{{item.statusTime | dateFormat}}</span>
        <span v-if="item.status==7 || item.status==8">退款理由：{{item.desc || '无'}}</span>
        <span v-if="item.status==11">拒绝理由：{{item.desc || '无'}}</span>
      </div>
    </div>
    <div v-if="orderObj.latestStatus==12" class="titleStyle">取消信息</div>
    <div v-if="orderObj.latestStatus==12" class="orderInfoBox">
      <div class="orderInfoItem">
        取消原因：
        <span v-for="(item,index) in orderObj.orderTimeDetail" :key="index">
          <span v-if="item.status==12">{{item.desc || '无'}}</span>
        </span>
      </div>
    </div>
    <div v-if="orderObj.latestStatus==6 && orderObj.userInteractDetail" class="titleStyle">评论信息</div>
    <div v-if="orderObj.latestStatus==6 && orderObj.userInteractDetail" class="orderInfoBox">
      <div class="orderInfoItem-1" v-for="(item,index) in orderObj.userInteractDetail" :key="index">
        <p v-if="item.action==1">评论时间：{{item.createTime | dateFormat}}</p>
        <p v-if="item.action==1">评论内容：{{item.content}}</p>
        <p v-if="item.action==2">回复时间：{{item.createTime | dateFormat}}</p>
        <p v-if="item.action==2">回复内容：{{item.content}}</p>
      </div>
    </div>
    <!-- 非核销订单按钮 -->
    <div class="bottom-btn" v-if="!isWriteOffOrder">
      <el-button
        type="danger"
        v-if="(orderObj.latestStatus==2 || orderObj.latestStatus==15) && orderObj.transStatementDetail.status!=14"
        @click="changeAddress_dialog = true"
      >修改地址</el-button>
      <el-button
        type="danger"
        v-if="orderObj.latestStatus==11 && orderObj.orderLogisticsDetailList !=''"
        @click="changeAddress_dialog = true"
      >修改地址</el-button>
      <el-button
        type="primary"
        v-if="(orderObj.latestStatus==2 || orderObj.latestStatus==15) && orderObj.transStatementDetail.status!=14"
        @click="deliverGoods(orderObj.id)"
      >发货</el-button>
      <el-button
        type="primary"
        v-if="orderObj.latestStatus==11 && orderObj.orderLogisticsDetailList !=''"
        @click="deliverGoods(orderObj.id)"
      >发货</el-button>
      <el-button
        type="primary"
        v-if="(orderObj.latestStatus==2 || orderObj.latestStatus==15) && orderObj.transStatementDetail.status!=14"
        @click="noDeliverGoods(orderObj.id)"
      >无需发货</el-button>
      <el-button
        type="primary"
        v-if="orderObj.latestStatus==11 && orderObj.orderLogisticsDetailList !=''"
        @click="noDeliverGoods(orderObj.id)"
      >无需发货</el-button>
      <el-button
        type="success"
        v-if="orderObj.latestStatus==1"
        @click="cancelOrder(orderObj.id)"
      >取消订单</el-button>
      <!-- <el-button
        type="success"
        v-if="orderObj.latestStatus==2 && orderObj.transStatementDetail.status!=14"
        @click="refund(orderObj.id)"
      >退款</el-button>-->
      <!-- 退款(自定义活动拼团失败-退款) -->
      <el-button
        type="primary"
        v-if="orderObj.latestStatus== 15"
        @click="refundFailed(orderObj.id)"
      >退款</el-button>
      <el-button
        type="success"
        v-if="(orderObj.latestStatus==7 || orderObj.latestStatus==8 || orderObj.latestStatus==11) && orderObj.transStatementDetail.status!=14"
        @click="refundEvent(orderObj.id)"
      >退款</el-button>
    </div>
    <!-- 核销订单按钮 -->
    <div class="bottom-btn" v-if="isWriteOffOrder">
      <el-button
        type="primary"
        v-if="orderObj.latestStatus==15"
        @click="upload_verification_code(orderObj.id)"
      >上传核销码</el-button>
      <el-button type="primary" v-if="orderObj.latestStatus==15" @click="refuse(orderObj.id)">拒绝</el-button>
      <el-button
        type="primary"
        v-if="orderObj.latestStatus==16 && orderObj.validStatus == 1"
        @click="not_used(orderObj.id)"
      >退款</el-button>
      <el-button
        type="primary"
        v-if="orderObj.latestStatus==16 && orderObj.validStatus == 1"
        @click="used(orderObj.id)"
      >完成订单</el-button>
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
          <el-input v-model="dgform.trackingNumber" autocomplete="off" style="width:400px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deliverGoodsState = false">取 消</el-button>
        <el-button type="primary" @click="saveDeliverGoods(orderObj.id)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改物流弹窗 -->
    <el-dialog title="修改物流单号" :visible.sync="modifyNumState" width="30%">
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
    <el-dialog title="退款" :visible.sync="refundState" width="30%">
      <span>确定要退款吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="refundNo">拒 绝</el-button>
        <el-button type="primary" @click="refundOk">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 拒绝退款弹窗 -->
    <el-dialog title="发货" :visible.sync="refundNoState" width="30%">
      <el-form :model="dgform">
        <el-form-item label="物流单号">
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

    <!-- 修改收货人地址弹框 -->
    <el-dialog title="收货地址" :visible.sync="changeAddress_dialog" :close-on-click-modal="false">
      <el-form :model="address">
        <el-form-item label="收货人:">
          <el-input
            v-model="address.receiverName"
            auto-complete="off"
            style="width:350px"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号:">
          <el-input
            v-model="address.mobileNumber"
            auto-complete="off"
            style="width:350px"
            maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item label="所在地区:">
          <el-select v-model="province" placeholder="请选择" @change="select_province">
            <el-option
              v-for="item in provinceList"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="city" placeholder="请选择" @change="select_citys">
            <el-option
              v-for="item in cityList"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="area" placeholder="请选择" @change="select_provinces">
            <el-option
              v-for="item in districtList"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址:">
          <el-input
            v-model="address.detailedAddress"
            auto-complete="off"
            style="width:600px"
            maxlength="100"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeAddress">保 存</el-button>
      </div>
    </el-dialog>
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
            action="/opadmin/fileStore/uploadFile"
            list-type="picture-card"
            :headers="myHeaders"
            :on-success="handleAvatarSuccessImg"
            :on-error="uploadImgErrorImg"
            :on-remove="handleRemoveImg"
            :on-exceed="imgNumber"
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
        <el-button @click="verificationCodeDialog = false">取 消</el-button>
        <el-button type="primary" @click="pushVerificationCode">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryOrder,
  addOrderLogistics,
  getLogisticsCompanyList,
  applyRefundMerchant,
  queryLogistics,
  cancelOrderMerchant,
  refundAudit,
  getAllCityData,
  updateOrderAddress,
  refundCostomizeActivityOrder,
  noLogistics,
  pushVerificationCode,
  groupFinish,
  groupRefund,
  groupRefuse
} from "@/network/api";
import shipPop from "./common/shipPop";
import { getCookie } from "@/common/cookie.js";
export default {
  data() {
    return {
      isWriteOffOrder: false, // 是否为核销订单
      myHeaders: { token: "" },
      orderObj: {},
      isDeliverGoods: false, // 判断商品是否无需发货
      deliverGoodsState: false,
      changeAddress_dialog: false, // 是否显示修改地址弹框
      remark: "", // 备注
      dgform: {
        logisticsId: "",
        trackingNumber: "",
        orderId: ""
      },
      cityData: "", // 所有城市数据
      address: {
        id: "",
        orderId: "",
        receiverName: "",
        mobileNumber: "",
        districtId: "",
        districtAddress: "",
        detailedAddress: ""
      },
      province: "省",
      city: "市",
      area: "区",
      provinceList: [
        // 省份列表
        {
          value: "",
          label: "请选择"
        }
      ],
      cityList: [
        // 城市列表
        {
          value: "",
          label: "请选择"
        }
      ],
      districtList: [
        // 区列表
        {
          value: "",
          label: "请选择"
        }
      ],
      logisticsListArr: [],
      lookLogisticsState: false,
      lookLogisticsList: [],
      refundState: false,
      refundOrderId: "",
      refundNoState: false,
      rnform: {
        refundNoTxt: ""
      },
      modifyNumState: false,
      verificationCodeDialog: false, // 是否显示上传核销码弹窗
      codeForm: {
        // 上传核销码参数
        orderId: "",
        verificationCode: "",
        validDate: ""
      },
      imageUrl: []
    };
  },
  components: {
    shipPop
  },
  created() {
    // 判断是否为核销订单
    let isWriteOffOrder = this.$route.query.isWriteOffOrder;
    if (isWriteOffOrder) {
      this.isWriteOffOrder = isWriteOffOrder;
      this.myHeaders.token = getCookie().opadminToken;
    }
  },
  mounted() {
    this.getOrderList(this.$route.query.orderid);
    this.getLogisticsList();
    this.getAllCityList(); //获取所有城市数据
  },
  methods: {
    // 查询订单详情
    getOrderList(id) {
      queryOrder(`?orderId=${id}`).then(res => {
        let data = res.data.content;
        this.orderObj = data;
        if (data.orderAddressDetail) {
          this.remark = data.orderAddressDetail.remark;
          this.address = data.orderAddressDetail;
          let districtAddress = data.orderAddressDetail.districtAddress.split(
            "-"
          );
          this.province = districtAddress[0];
          this.city = districtAddress[1];
          this.area = districtAddress[2];
        }
        // 判断商品是否无需发货
        data.orderTimeDetail.forEach(val => {
          if (val.remark == "NO_LOGISTICS") {
            this.isDeliverGoods = true;
          }
        });
      });
    },
    // 获取物流公司列表
    getLogisticsList() {
      getLogisticsCompanyList().then(res => {
        this.logisticsListArr = res.data.content;
      });
    },
    // 获取所有的城市数据
    getAllCityList() {
      getAllCityData().then(res => {
        let data = res.data.content;
        this.cityData = data;
        //获取初始化省份列表
        this.provinceList = data.provinceList.map((val, index) => {
          let json = {};
          json.value = val.id;
          json.label = val.name;
          return json;
        });
        //获取初始化城市列表
        let provinceId = data.provinceList.filter((val, index) => {
          return val.name == this.province;
        });
        // console.log(provinceId);
        if (provinceId.length > 0) {
          let city = data.cityList.filter(val => {
            return val.provinceId == provinceId[0].id;
          });
          this.cityList = city.map(val => {
            let json = {};
            json.value = val.id;
            json.label = val.name;
            return json;
          });
        }
        // 获取初始化区列表
        let cityId = data.cityList.filter((val, index) => {
          return val.name == this.city;
        });
        if (cityId.length > 0) {
          let area = data.districtList.filter(val => {
            return val.cityId == cityId[0].id;
          });
          this.districtList = area.map(val => {
            let json = {};
            json.value = val.id;
            json.label = val.name;
            return json;
          });
        }
      });
    },
    // 发货点击事件
    // deliverGoods (id) {
    //   this.deliverGoodsState = true
    //   this.dgform.orderId = id
    // },
    deliverGoods(id) {
      this.$refs.ship.open(id);
    },
    // 发货确定事件
    saveDeliverGoods(id) {
      if (this.dgform.logisticsId === "") {
        this.$message("请先选择物流公司");
      } else if (this.dgform.trackingNumber === "") {
        this.$message("请先填写物流单号");
      } else {
        addOrderLogistics(this.dgform).then(res => {
          if (res.data.messageCode === "MSG_1001") {
            this.getOrderList(id);
            this.$message({
              type: "success",
              message: "发货成功"
            });
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
          this.getOrderList(id);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 修改物流单号确认事件
    saveModifyNum(id) {
      if (this.dgform.logisticsId === "") {
        this.$message("请先选择物流公司");
      } else if (this.dgform.trackingNumber === "") {
        this.$message("请先填写物流单号");
      } else {
        addOrderLogistics(this.dgform).then(res => {
          if (res.data.messageCode === "MSG_1001") {
            this.getOrderList(id);
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.modifyNumState = false;
          }
        });
      }
    },
    // 退款(自定义活动拼团失败-退款)
    refundFailed(orderId) {
      this.$confirm("确定退款吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        closeOnClickModal: false
      })
        .then(() => {
          let parms = {
            orderId: orderId
          };
          refundCostomizeActivityOrder(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("退款成功");
              this.searchOrderList(this.pageNumber);
            } else {
              this.$message.error(this.$message.error);
            }
          });
        })
        .catch(() => {});
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
              this.getOrderList(id);
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
    // 修改物流单号
    modifyNum(orderid, item) {
      // 第一个参数为订单orderid, 第二个为选择的物流信息
      this.$refs.ship.openUnitePop(orderid, item);
    },
    // 添加物流单号
    AddmodifyNum(orderid) {
      this.$refs.ship.openMultiplePop(orderid);
    },
    // 查询物流信息
    lookLogistics(logisticsDto) {
      if (!logisticsDto) {
        this.$message("待揽件");
        return;
      }
      this.lookLogisticsList = logisticsDto ? logisticsDto.list : null;
      this.lookLogisticsState = true;
    },
    // 取消订单事件
    cancelOrder(id) {
      this.$confirm("确定取消订单吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let parms = {
            orderId: id
          };
          cancelOrderMerchant(parms).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.getOrderList(id);
              this.$message({
                type: "success",
                message: "取消订单成功"
              });
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
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
        if (res.data.statusCode === 200) {
          this.getOrderList(this.$route.query.orderid);
          this.refundState = false;
        }
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
            this.getOrderList(this.$route.query.orderid);
            this.refundNoState = false;
          }
        });
      }
    },
    // 选择省份
    select_province(e) {
      this.provinceList.forEach(val => {
        if (val.value == e) {
          this.province = val.label;
        }
      });
      this.city = "";
      this.area = "";
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
        }
      });
      this.area = "";
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
      this.address.districtId = e;
    },
    //修改收货地址
    changeAddress() {
      if (this.address.receiverName == "") {
        this.$message("请输入收货人");
        return;
      }
      if (!/^1[3456789]\d{9}$/.test(this.address.mobileNumber)) {
        this.$message("请输入正确的手机号");
        return;
      }
      if (this.address.detailedAddress == "") {
        this.$message("请输入详细地址");
        return;
      }
      if (this.province == "") {
        this.$message("请选择省份");
        return;
      }
      if (this.city == "") {
        this.$message("请选择城市");
        return;
      }
      if (this.area == "") {
        this.$message("请选择区");
        return;
      }
      this.address.districtAddress =
        this.province + "-" + this.city + "-" + this.area;
      updateOrderAddress(this.address).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.changeAddress_dialog = false;
          this.$message.success("修改地址成功");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // =====核销订单按钮事件=====
    // 上传核销码成功
    handleAvatarSuccessImg(response, file, fileList) {
      this.codeForm.verificationCode = response.content.key;
    },
    // 上传核销码失败
    uploadImgErrorImg(err, file, fileList) {
      this.$message.error("上传图片失败");
    },
    // 删除核销码
    handleRemoveImg(file, fileList) {
      this.codeForm.verificationCode = "";
      this.imageUrl = fileList;
    },
    // 上传核销码超出个数限制时的钩子
    imgNumber() {
      this.$message.error("最多添加1张图片");
    },
    // 打开上传核销码弹窗
    upload_verification_code(id) {
      this.codeForm.orderId = id;
      this.verificationCodeDialog = true;
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
          this.$message.success("操作成功");
          this.getOrderList(id);
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
              this.getOrderList(id);
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
              this.getOrderList(id);
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
              this.getOrderList(id);
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    }
    // ========================================================
  }
};
</script>

<style lang='less' scoped>
.logisticsList {
  display: flex;
  justify-content: space-between;
  padding-left: 30px;
  padding-right: 30px;
  box-sizing: border-box;
  .logisticsItem {
    font-size: 14px;
    color: #333;
    line-height: 30px;
  }
}
.orderDetail {
  padding: 30px;
  box-sizing: border-box;
  .titleStyle {
    width: 100%;
    height: 30px;
    font-size: 14px;
    border-bottom: solid 1px #ccc;
  }
  .orderInfoBox {
    width: 100%;
    height: auto;
    border: solid 1px #ccc;
    padding: 30px 60px 30px 60px;
    box-sizing: border-box;
    margin-top: 20px;
    margin-bottom: 30px;
    display: flex;
    flex-wrap: wrap;
    .orderInfoItem {
      font-size: 14px;
      color: #333;
      line-height: 30px;
      margin-right: 20px;
      > .mark {
        color: antiquewhite;
        font-size: 20px;
        font-weight: bold;
        margin-left: 20px;
      }
    }
    .orderInfoItem-1 {
      width: 100%;
      font-size: 14px;
      color: #333;
      line-height: 30px;
      margin-right: 60px;
      > span {
        margin-right: 60px;
      }
    }
    .orderInfoItem-btn {
      margin-left: 20px;
    }
  }
  .bottom-btn {
    width: 200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    margin-top: 60px;
  }
}
</style>
