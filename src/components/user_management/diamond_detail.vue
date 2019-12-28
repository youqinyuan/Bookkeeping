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
      <div class="items">注册来源：{{content.registrySource | registrySource}}</div>
      <div class="items">正常购买次数：{{content.buyCount}}次</div>
      <div class="items">freebuy购买次数：{{content.freeBuyCount}}次</div>
      <div class="items">充值次数：{{content.rechargeCount}}次</div>
      <div class="items">上级电话：{{content.referrerMobileNumber}}</div>
      <div>
        <div
          class="items"
          v-for="(item,index) in content.addressBooks"
          :key="index"
        >收货地址：所在地区：{{item.cityName}}-{{item.districtName}} 。 详细地址：{{item.detailedAddress}}</div>
      </div>
    </div>

    <!-- 待返记录 -->
    <div class="common" style="margin-top:20px;">
      <div class="title">待返记录</div>
      <div class="table">
        <div class="table_top">
          <span>待返余额：{{content.amountNoCashBackSum}}元 (总计{{noCashBackItemsSize}}条)</span>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="noCashBackItemsSize"
            :page-size="10"
            @current-change="pageChangenoCashBackItems($event)"
          ></el-pagination>
        </div>
        <el-table :data="noCashBackItemsData" border style="width: 100%">
          <el-table-column prop="status" label="状态" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">正常状态</span>
              <span v-if="scope.row.status == 2">转让中</span>
              <span v-if="scope.row.status == 3">转让完成</span>
              <span v-if="scope.row.status == 4">终止返现</span>
            </template>
          </el-table-column>
          <el-table-column prop="tradeTime" label="开始时间" align="center">
            <template slot-scope="scope">{{scope.row.tradeTime | dateFormat}}</template>
          </el-table-column>
          <el-table-column prop="goodsName" label="商品名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="noCashBackAmount"
            label="待返金额"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="period" label="返现周期" align="center"></el-table-column>
          <el-table-column prop="amountReturned" label="已返金额" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" align="center"></el-table-column>
          <el-table-column prop="transferRemak" label="转让信息" align="center"></el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 余额来源记录 -->
    <div class="common">
      <div class="title">余额来源记录</div>
      <div class="table">
        <div class="table_top">
          <span>余额：{{content.balance}}元 (总计{{balanceItemsSize}}条)</span>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="balanceItemsSize"
            :page-size="10"
            @current-change="pagebalanceItems($event)"
          ></el-pagination>
        </div>
        <el-table :data="balanceItemsData" border style="width: 100%">
          <el-table-column prop="tradeTime" label="时间" align="center">
            <template slot-scope="scope">{{scope.row.tradeTime | dateFormat}}</template>
          </el-table-column>
          <el-table-column prop="tradeAmount" label="金额" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="remark" label="来源" align="center"></el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 邀请好友记录 -->
    <div class="common">
      <div class="title">邀请好友记录</div>
      <div class="table">
        <div class="table_top">
          <span>总计邀请：{{content.teamCount}}人 (总计{{teamItemsSize}}条)</span>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="teamItemsSize"
            :page-size="10"
            @current-change="pageteamItems($event)"
          ></el-pagination>
        </div>
        <el-table :data="teamItemsData" border style="width: 100%">
          <el-table-column prop="registryTime" label="时间" align="center">
            <template slot-scope="scope">{{scope.row.registryTime | dateFormat}}</template>
          </el-table-column>
          <el-table-column prop="mobileNumber" label="下级注册号" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="roleName" label="身份" align="center"></el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 充值记录 -->
    <div class="common">
      <div class="title">充值记录</div>
      <div class="table">
        <div class="table_top">
          <span>总计充值：{{content.amountRechargeSum}}元 (总计{{rechargeItemsSize}}条)</span>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="rechargeItemsSize"
            :page-size="10"
            @current-change="pagerechargeItems($event)"
          ></el-pagination>
        </div>
        <el-table :data="rechargeItemsData" border style="width: 100%">
          <el-table-column prop="tradeTime" label="充值时间" align="center">
            <template slot-scope="scope">{{scope.row.tradeTime | dateFormat}}</template>
          </el-table-column>
          <el-table-column prop="tradeAmount" label="充值金额" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="remark" label="充值方式" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="status" label="是否退款" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">是</span>
              <span v-if="scope.row.status == 2">否</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 钻石合伙人身份收益 -->
    <div
      class="title"
      style="margin-top:10px;border-bottom:1px solid #ccc;"
    >钻石合伙人身份收益（{{content.isExpired == 1? '已到期':'未到期'}}）：</div>
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
            <span>{{scope.row.orderType | orderType}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="购买商品" align="center" width="160"></el-table-column>
        <el-table-column prop="gainAmount" label="返佣" align="center"></el-table-column>
      </el-table>
    </div>
    <!-- 消费信息 -->
    <div class="title" style="margin-top:20px;border-bottom:1px solid #ccc;">消费信息：</div>
    <div style="display:flex">
      <!-- 线上消费信息 -->
      <div>
        <div style="display:flex;margin-top:10px;">
          <span
            class="demonstration"
          >线上消费：{{content.onlineConsumeSum}}元（总计：{{onlineConsumeItemsTotal}}条）</span>
          <el-pagination
            @current-change="handleCurrentChange3"
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
                <span>{{scope.row.orderType | orderType}}</span>
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
                <span>{{scope.row.orderType | orderType}}</span>
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
      // 所有信息
      content: {},
      // 待返明细和条数
      noCashBackItemsData: [],
      noCashBackItemsSize: 0,
      // 余额来源记录
      balanceItemsData: [],
      balanceItemsSize: 0,
      // 邀请好友记录
      teamItemsData: [],
      teamItemsSize: 0,
      // 充值记录
      rechargeItemsData: [],
      rechargeItemsSize: 0,
      // 发展钻石合伙人收益记录
      openDiamondMemberIncomeItems: [],
      openDiamondMemberIncomeItemsTotal: 0,
      // 发展用消费收益记录
      teamBuyGoodsIncomeItems: [],
      teamBuyGoodsIncomeItemsTotal: 0,
      // 线上消费
      onlineConsumeItems: [],
      onlineConsumeItemsTotal: 0,
      // 线下消费
      offlineConsumeItems: [],
      offlineConsumeItemsTotal: 0
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
          // 待返记录明细和条数
          this.noCashBackItemsData = data.noCashBackItems.items;
          this.noCashBackItemsSize = data.noCashBackItems.totalSize;
          // 余额来源记录
          this.balanceItemsData = data.balanceItems.items;
          this.balanceItemsSize = data.balanceItems.totalSize;
          // 邀请好友记录
          this.teamItemsData = data.teamItems.items;
          this.teamItemsSize = data.teamItems.totalSize;
          // 充值记录
          this.rechargeItemsData = data.rechargeItems.items;
          this.rechargeItemsSize = data.rechargeItems.totalSize;
          // 发展钻石合伙人收益记录
          this.openDiamondMemberIncomeItemsTotal =
            data.openDiamondMemberIncomeItems.totalSize;
          this.openDiamondMemberIncomeItems =
            data.openDiamondMemberIncomeItems.items;
          // 发展用消费收益记录
          this.teamBuyGoodsIncomeItemsTotal =
            data.teamBuyGoodsIncomeItems.totalSize;
          this.teamBuyGoodsIncomeItems = data.teamBuyGoodsIncomeItems.items;
          // 线上消费
          this.onlineConsumeItemsTotal = data.onlineConsumeItems.totalSize;
          this.onlineConsumeItems = data.onlineConsumeItems.items;
          // 线下消费
          this.offlineConsumeItemsTotal = data.offlineConsumeItems.totalSize;
          this.offlineConsumeItems = data.offlineConsumeItems.items;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 根据flag查询单项信息
    diamondMemberDetailItmes(val, flag) {
      let parms = {
        pageNumber: val,
        pageSize: 10,
        id: this.id,
        flag: flag
      };
      diamondMemberDetail({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let data = res.data.content;
          switch (flag) {
            case 2:
              this.onlineConsumeItems = data.onlineConsumeItems.items;
              break;
            case 3:
              this.offlineConsumeItems = data.offlineConsumeItems.items;
              break;
            case 7:
              this.openDiamondMemberIncomeItems =
                data.openDiamondMemberIncomeItems.items;
              break;
            case 8:
              this.teamBuyGoodsIncomeItems = data.teamBuyGoodsIncomeItems.items;
              break;
            case 10:
              this.noCashBackItemsData = data.noCashBackItems.items;
              break;
            case 11:
              this.balanceItemsData = data.balanceItems.items;
              break;
            case 12:
              this.teamItemsData = data.teamItems.items;
              break;
            case 13:
              this.rechargeItemsData = data.rechargeItems.items;
              break;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 待返记录翻页
    pageChangenoCashBackItems(val) {
      this.diamondMemberDetailItmes(val, 10);
    },

    // 余额来源记录翻页
    pagebalanceItems(val) {
      this.diamondMemberDetailItmes(val, 11);
    },

    // 邀请好友记录翻页
    pageteamItems(val) {
      this.diamondMemberDetailItmes(val, 12);
    },

    // 充值记录
    pagerechargeItems() {
      this.diamondMemberDetailItmes(val, 13);
    },

    // 仅返回发展钻石合伙人收益记录
    handleCurrentChange1(val) {
      this.diamondMemberDetailItmes(val, 7);
    },

    // 仅返回发展用户消费收益记录
    handleCurrentChange2(val) {
      this.diamondMemberDetailItmes(val, 8);
    },

    // 仅返回线上消费信息
    handleCurrentChange3(val) {
      this.diamondMemberDetailItmes(val, 2);
    },

    // 仅返回线下消费信息
    handleCurrentChange4(val) {
      this.diamondMemberDetailItmes(val, 3);
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
  .common {
    margin-bottom: 30px;
    .title {
      border-bottom: 1px solid #cccccc;
      font-size: 18px;
      font-weight: bold;
    }
    .content_table {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .table {
        width: 500px;
      }
    }
    .table_top {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
    }
  }
}
</style>