<template>
  <div class="diamond_detail">
    <!-- 头部基本信息 -->
    <div class="title">基本信息：</div>
    <div class="content" style="border-top:1px solid #ccc;border-bottom:1px solid #ccc;">
      <div class="items">会员编号：{{content.id}}</div>
      <div class="items">昵称：{{content.nickname}}</div>
      <div class="items">钱包余额：{{content.balance}}元</div>
      <div class="items" v-if="content.gender == 1">性别：男</div>
      <div class="items" v-if="content.gender == 2">性别：女</div>
      <div class="items">电话：{{content.mobileNumber}}</div>
      <div class="items">成为钻石合伙人时间：{{content.openTime | dateFormat}}</div>
      <div class="items">到期时间：{{content.expireTime | dateFormat}}</div>
      <div class="items" v-if="content.registrySource == 1">注册来源：App</div>
      <div class="items" v-if="content.registrySource == 2">注册来源：小程序</div>
      <div class="items" v-if="content.registrySource == 3">注册来源：H5</div>
      <div class="items" v-if="content.registrySource == 4">注册来源：导入</div>
      <div class="items">正常购买次数：{{content.buyCount}}次</div>
      <div class="items">freebuy购买次数：{{content.freeBuyCount}}次</div>
      <div>
        <div
          class="items"
          v-for="(item,index) in content.addressBooks"
          :key="index"
        >收货地址：所在地区：{{item.cityName}}-{{item.districtName}} 。 详细地址：{{item.detailedAddress}}</div>
      </div>
    </div>
    <!-- 钻石合伙人身份收益 -->
    <div class="title" style="margin-top:10px;">钻石合伙人身份收益（{{content.isExpired == 1? '已到期':'未到期'}}）：</div>
    <div
      style="margin-top:10px;"
    >下级数量：钻石合伙人数量：{{content.diamondTeamCount}}个，合伙人：{{content.plusTeamCount}}个，普通用户：{{content.normalTeamCount}}个</div>
    <div
      style="margin-top:10px;"
    >第N级数量：钻石合伙人数量：{{content.diamondTeamCountN}}，合伙人：{{content.plusTeamCountN}}个，普通用户：{{content.normalTeamCountN}}个</div>
    <div
      style="margin-top:10px;"
    >总计收益：{{content.incomeAmount}}元，提现金额：{{content.withdrawalAmount}}元，余额：{{content.balance}}元</div>
    <div style="display:flex;margin-top:30px;">
      <span class="demonstration">发展钻石合伙人收益记录表：（总计{{openDiamondMemberIncomeItemsTotal}}条）</span>
      <el-pagination
        @current-change="handleCurrentChange1"
        :current-page.sync="currentPage1"
        :page-size="10"
        layout="prev, pager, next"
        :total="openDiamondMemberIncomeItemsTotal"
      ></el-pagination>
    </div>
    <div style="width:700px;margin-top:10px;">
      <el-table :data="openDiamondMemberIncomeItems" border style="width: 100%">
        <el-table-column prop="createTime" label="到账时间" align="center">
          <template slot-scope="scoped">
            <span>{{scoped.row.createTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="下级注册手机号" align="center"></el-table-column>
        <el-table-column prop="gainAmount" label="返佣" align="center"></el-table-column>
      </el-table>
    </div>
    <div style="display:flex;margin-top:30px;">
      <span class="demonstration">发展用消费收益记录表：（总计{{teamBuyGoodsIncomeItemsTotal}}条）</span>
      <el-pagination
        @current-change="handleCurrentChange2"
        :current-page.sync="currentPage2"
        :page-size="10"
        layout="prev, pager, next"
        :total="teamBuyGoodsIncomeItemsTotal"
      ></el-pagination>
    </div>
    <div style="width:1000px;margin-top:10px;">
      <el-table :data="teamBuyGoodsIncomeItems" border style="width: 100%">
        <el-table-column prop="createTime" label="到账时间" align="center" width="160">
          <template slot-scope="scoped">
            <span>{{scoped.row.createTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="第几级" align="center">
          <template slot-scope="scoped">
            <span>{{scoped.row.level}}级</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="下级注册手机号" align="center" width="140"></el-table-column>
        <el-table-column prop="userRole" label="身份" align="center" width="120">
          <template slot-scope="scoped">
            <span v-if="scoped.row.userRole == 1">用户</span>
            <span v-if="scoped.row.userRole == 2">会员</span>
            <span v-if="scoped.row.userRole == 3">合伙人</span>
            <span v-if="scoped.row.userRole == 4">商户</span>
            <span v-if="scoped.row.userRole == 5">代理商</span>
            <span v-if="scoped.row.userRole == 6">钻石合伙人</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderType" label="购买方式" align="center" width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.orderType == 0">正常购买</span>
            <span v-if="scope.row.orderType == 1">正常购买</span>
            <span v-if="scope.row.orderType == 3">新人免费体验订单</span>
            <span v-if="scope.row.orderType == 4">信用卡用户免费领订单</span>
            <span v-if="scope.row.orderType == 5">渠道合作活动订单</span>
            <span v-if="scope.row.orderType == 6">FreeBuy活动订单</span>
            <span v-if="scope.row.orderType == 7">FreeBuy订单</span>
            <span v-if="scope.row.orderType == 8">线下-普通订单</span>
            <span v-if="scope.row.orderType == 9">线下-FreeBuy订单</span>
            <span v-if="scope.row.orderType == 10">FreeBuy转正常购买</span>
            <span v-if="scope.row.orderType == 11">钻石合伙人订单</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="购买商品" align="center" width="160"></el-table-column>
        <el-table-column prop="gainAmount" label="返佣" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="title" style="margin-top:20px;">消费信息：</div>
    <div style="display:flex">
      <!-- 线上消费信息 -->
      <div>
        <div style="display:flex;margin-top:10px;">
          <span
            class="demonstration"
          >线上消费：{{content.onlineConsumeSum}}元（总计：{{onlineConsumeItemsTotal}}条）</span>
          <el-pagination
            @current-change="handleCurrentChange3"
            :current-page.sync="currentPage3"
            :page-size="10"
            layout="prev, pager, next"
            :total="onlineConsumeItemsTotal"
          ></el-pagination>
        </div>
        <div style="width:700px;margin-top:10px;">
          <el-table :data="onlineConsumeItems" border style="width: 100%">
            <el-table-column prop label="下单时间" align="center" width="150">
              <template slot-scope="scope">
                <span>{{scope.row.time | dateFormat}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="storeName" label="商家" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderType" label="购买方式" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.orderType == 0">正常购买</span>
                <span v-if="scope.row.orderType == 1">正常购买</span>
                <span v-if="scope.row.orderType == 3">新人免费体验订单</span>
                <span v-if="scope.row.orderType == 4">信用卡用户免费领订单</span>
                <span v-if="scope.row.orderType == 5">渠道合作活动订单</span>
                <span v-if="scope.row.orderType == 6">FreeBuy活动订单</span>
                <span v-if="scope.row.orderType == 7">FreeBuy订单</span>
                <span v-if="scope.row.orderType == 8">线下-普通订单</span>
                <span v-if="scope.row.orderType == 9">线下-FreeBuy订单</span>
                <span v-if="scope.row.orderType == 10">FreeBuy转正常购买</span>
                <span v-if="scope.row.orderType == 11">钻石合伙人订单</span>
              </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="购买商品" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="amount" label="消费金额" align="center"></el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 线下消费信息 -->
      <div style="margin-left:20px;">
        <div style="display:flex;margin-top:10px;">
          <span
            class="demonstration"
          >线下消费：{{content.offlineConsumeSum}}元（总计：{{offlineConsumeItemsTotal}}条）</span>
          <el-pagination
            @current-change="handleCurrentChange4"
            :current-page.sync="currentPage4"
            :page-size="10"
            layout="prev, pager, next"
            :total="offlineConsumeItemsTotal"
          ></el-pagination>
        </div>
        <div style="width:700px;margin-top:10px;">
          <el-table :data="offlineConsumeItems" border style="width: 100%">
            <el-table-column prop label="下单时间" align="center" width="150">
              <template slot-scope="scope">
                <span>{{scope.row.time | dateFormat}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="storeName" label="商家" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderType" label="购买方式" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.orderType == 0">正常购买</span>
                <span v-if="scope.row.orderType == 1">正常购买</span>
                <span v-if="scope.row.orderType == 3">新人免费体验订单</span>
                <span v-if="scope.row.orderType == 4">信用卡用户免费领订单</span>
                <span v-if="scope.row.orderType == 5">渠道合作活动订单</span>
                <span v-if="scope.row.orderType == 6">FreeBuy活动订单</span>
                <span v-if="scope.row.orderType == 7">FreeBuy订单</span>
                <span v-if="scope.row.orderType == 8">线下-普通订单</span>
                <span v-if="scope.row.orderType == 9">线下-FreeBuy订单</span>
                <span v-if="scope.row.orderType == 10">FreeBuy转正常购买</span>
                <span v-if="scope.row.orderType == 11">钻石合伙人订单</span>
              </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="购买商品" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="amount" label="消费金额" align="center"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 冻结历史： -->
    <div
      class="title"
      style="margin-top:20px;padding-bottom:10px;border-bottom:1px solid #ccc;"
    >冻结历史：</div>
    <div style="margin-top:10px;" v-for="(item,index) in content.freezeRecords" :key="index">
      {{item.createTime | dateFormat}}，{{item.status == 1?'解冻':'冻结'}}
      <span
        v-if="item.remark"
      >，原因：{{item.remark}}</span>
    </div>
  </div>
</template>
<script>
import { diamondMemberDetail } from "@/network/api";
export default {
  data() {
    return {
      id: "",
      content: {},
      currentPage1: 1,
      currentPage2: 1,
      currentPage3: 1,
      currentPage4: 1,
      openDiamondMemberIncomeItemsTotal: 0, //发展钻石合伙人收益记录表数量
      openDiamondMemberIncomeItems: [], //发展钻石合伙人收益记录表
      teamBuyGoodsIncomeItemsTotal: 0, //发展用消费收益记录表数量
      teamBuyGoodsIncomeItems: [], //发展用消费收益记录表
      onlineConsumeItemsTotal: 0, // 线上消费总数
      onlineConsumeItems: [], // 线上消费数据
      offlineConsumeItemsTotal: 0, // 线下消费总数
      offlineConsumeItems: [] // 线下消费数据
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.diamondMemberDetail();
  },
  methods: {
    // 查询所有信息
    diamondMemberDetail() {
      let parms = {
        pageNumber: 1,
        pageSize: 10,
        id: this.id,
        flag: 1
      };
      diamondMemberDetail({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let data = res.data.content;
          this.content = res.data.content;
          this.openDiamondMemberIncomeItemsTotal =
            data.openDiamondMemberIncomeItems.totalSize;
          this.openDiamondMemberIncomeItems =
            data.openDiamondMemberIncomeItems.items;
          this.teamBuyGoodsIncomeItemsTotal =
            data.teamBuyGoodsIncomeItems.totalSize;
          this.teamBuyGoodsIncomeItems = data.teamBuyGoodsIncomeItems.items;
          this.onlineConsumeItemsTotal = data.onlineConsumeItems.totalSize;
          this.onlineConsumeItems = data.onlineConsumeItems.items;
          this.offlineConsumeItemsTotal = data.offlineConsumeItems.totalSize;
          this.offlineConsumeItems = data.offlineConsumeItems.items;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 仅返回发展钻石合伙人收益记录
    handleCurrentChange1(val) {
      let parms = {
        pageNumber: val,
        pageSize: 10,
        id: this.id,
        flag: 7
      };
      diamondMemberDetail({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let data = res.data.content.openDiamondMemberIncomeItems;
          this.currentPage1 = val;
          this.openDiamondMemberIncomeItems = data.items;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 仅返回发展用户消费收益记录
    handleCurrentChange2(val) {
      let parms = {
        pageNumber: val,
        pageSize: 10,
        id: this.id,
        flag: 8
      };
      diamondMemberDetail({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let data = res.data.content.teamBuyGoodsIncomeItems;
          this.currentPage2 = val;
          this.teamBuyGoodsIncomeItems = data.items;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 仅返回线上消费信息
    handleCurrentChange3(val) {
      let parms = {
        pageNumber: val,
        pageSize: 10,
        id: this.id,
        flag: 2
      };
      diamondMemberDetail({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let data = res.data.content.onlineConsumeItems;
          this.currentPage3 = val;
          this.onlineConsumeItems = data.items;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 仅返回线下消费信息
    handleCurrentChange4(val) {
      let parms = {
        pageNumber: val,
        pageSize: 10,
        id: this.id,
        flag: 3
      };
      diamondMemberDetail({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let data = res.data.content.offlineConsumeItems;
          this.currentPage4 = val;
          this.offlineConsumeItems = data.items;
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.diamond_detail {
  padding: 20px;
  box-sizing: border-box;
  .title {
    font-weight: bold;
    padding-bottom: 10px;
  }
  .content {
    display: flex;
    flex-wrap: wrap;
    .items {
      padding: 15px 0px;
      margin-right: 80px;
    }
  }
}
</style>