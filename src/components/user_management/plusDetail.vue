<template>
  <div class="contents">
    <div class="common">
      <div class="title">基本信息:</div>
      <div class="content">
        <ul>
          <li>会员编号：{{content.id}}</li>
          <li>电话：{{content.mobileNumber}}</li>
          <li>收货信息：</li>
          <li
            v-for="(item,index) in content.addressBooks"
            :key="index"
          >所在地区：{{item.cityName}}-{{item.districtName}},详细地址：{{item.detailedAddress}}</li>
        </ul>

        <ul>
          <li>昵称：{{content.nickname}}</li>
          <li>成为合伙人时间：{{content.openTime | dateFormat}}</li>
          <li>正常购买次数：{{content.buyCount}}</li>
          <li>上级电话：{{content.referrerMobileNumber}}</li>
        </ul>

        <ul>
          <li>钱包余额：{{content.balance}}</li>
          <li>到期时间：{{content.expireTime | dateFormat}}</li>
          <li>freebuy购买次数：{{content.freeBuyCount}}</li>
        </ul>

        <ul>
          <li>性别：{{content.gender == 1?'男':'女'}}</li>
          <li>注册来源：{{content.registrySource | registrySource}}(注册的渠道)</li>
          <li>充值次数：{{content.rechargeCount}}</li>
        </ul>
      </div>
    </div>

    <!-- 待返记录 -->
    <div class="common">
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

    <!-- 业绩收益 -->
    <div class="common">
      <div class="title">业绩收益:</div>
      <div class="content">
        <div class="shouyi_top">
          <span>邀请好友数量：{{content.count}}</span>
          <span>总计收益：{{content.incomeAmount}}元</span>
          <span>提现金额：{{content.withdrawalAmount}}元</span>
          <span>佣金余额：{{content.commissionBalance}}元</span>
        </div>
        <div class="table_content">
          <div class="table_top">
            <span>线上收益记录表（正利润）：(总计:{{onlineProfitIncomeItemsSize}}条)</span>
            <el-pagination
              background
              layout="prev, pager, next"
              :total="onlineProfitIncomeItemsSize"
              :page-size="10"
              @current-change="pageChangeOnlineSY($event)"
            ></el-pagination>
          </div>
          <el-table :data="onlineProfitIncomeItemsData" border style="width: 100%">
            <el-table-column prop="createTime" label="到账时间" align="center">
              <template slot-scope="scope">{{scope.row.createTime | dateFormat}}</template>
            </el-table-column>
            <el-table-column prop="storeName" label="商户" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="nickname" label="用户" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="goodsName" label="商品" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderType" label="购买方式" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.orderType | orderType}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="buyAmount" label="用户消费金额" align="center"></el-table-column>
            <el-table-column prop="gainAmount" label="获得收益" align="center"></el-table-column>
          </el-table>

          <div class="table_top">
            <span>线上收益记录表（无利润/负利润）：(总计:{{onlineLossIncomeItemsSize}}条)</span>
            <el-pagination
              background
              layout="prev, pager, next"
              :total="onlineLossIncomeItemsSize"
              :page-size="10"
              @current-change="pageChangeOnlineFSY($event)"
            ></el-pagination>
          </div>
          <el-table :data="onlineLossIncomeItemsData" border style="width: 100%">
            <el-table-column prop="createTime" label="到账时间" align="center">
              <template slot-scope="scope">{{scope.row.createTime | dateFormat}}</template>
            </el-table-column>
            <el-table-column prop="storeName" label="商户" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="nickname" label="用户" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="goodsName" label="商品" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderType" label="购买方式" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.orderType | orderType}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="buyAmount" label="用户消费金额" align="center"></el-table-column>
            <el-table-column prop="gainAmount" label="获得收益" align="center"></el-table-column>
          </el-table>

          <div class="table_top">
            <span>线下收益记录表：(总计:{{offlineIncomeItemsSize}}条)</span>
            <el-pagination
              background
              layout="prev, pager, next"
              :total="offlineIncomeItemsSize"
              :page-size="10"
              @current-change="pageChangeOfflineSY($event)"
            ></el-pagination>
          </div>
          <el-table :data="offlineIncomeItemsData" border style="width: 100%">
            <el-table-column prop="createTime" label="到账时间" align="center">
              <template slot-scope="scope">{{scope.row.createTime | dateFormat}}</template>
            </el-table-column>
            <el-table-column prop="storeName" label="商户" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="nickname" label="用户" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="categoryName" label="商品分类" align="center"></el-table-column>
            <el-table-column prop="orderType" label="购买方式" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.orderType | orderType}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="buyAmount" label="用户消费金额" align="center"></el-table-column>
            <el-table-column prop="gainAmount" label="获得收益" align="center"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 消费信息 -->
    <div class="common">
      <div class="title">消费信息:</div>
      <div class="content">
        <div class="xiaofei_table">
          <div class="top">
            <span>线上消费：{{content.onlineConsumeSum}}元 (总计：{{onlineConsumeItemsSize}}条)</span>
            <el-pagination
              background
              layout="prev, pager, next"
              :total="onlineConsumeItemsSize"
              :page-size="10"
              @current-change="pageChangeOnlineXF($event)"
            ></el-pagination>
          </div>
          <el-table :data="onlineConsumeItemsData" border style="width: 100%">
            <el-table-column prop="time" label="下单时间" align="center">
              <template slot-scope="scope">{{scope.row.time | dateFormat}}</template>
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

        <div class="xiaofei_table">
          <div class="top">
            <span>线下消费：{{content.offlineConsumeSum}}元 (总计：{{offlineConsumeItemsSize}}条)</span>
            <el-pagination
              background
              layout="prev, pager, next"
              :total="offlineConsumeItemsSize"
              :page-size="10"
              @current-change="pageChangeOfflineXF($event)"
            ></el-pagination>
          </div>
          <el-table :data="offlineConsumeItemsData" border style="width: 100%">
            <el-table-column prop="time" label="消费时间" align="center">
              <template slot-scope="scope">{{scope.row.time | dateFormat}}</template>
            </el-table-column>
            <el-table-column prop="storeName" label="商家" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderType" label="购买方式" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.orderType | orderType}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="categoryName" label="商品分类" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="amount" label="消费金额" align="center"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <div class="common">
      <div class="title">冻结历史:</div>
      <div class="freeze">
        <ul>
          <li v-for="(item,index) in content.freezeRecords" :key="index">
            {{item.createTime | dateFormat}},{{item.status == 1?'解冻':'冻结'}}
            <span
              v-if="item.remark"
            >,原因:{{item.remark}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { plusMemberDetail } from "@/network/api";
export default {
  props: {},
  data() {
    return {
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
      // 线上收益记录表（正收益）
      onlineProfitIncomeItemsData: [],
      onlineProfitIncomeItemsSize: 0,
      // 线上收益记录表（无利润/负利润）
      onlineLossIncomeItemsData: [],
      onlineLossIncomeItemsSize: 0,
      // 线下收益记录表
      offlineIncomeItemsData: [],
      offlineIncomeItemsSize: 0,
      // 线上消费信息
      onlineConsumeItemsData: [],
      onlineConsumeItemsSize: 0,
      // 线下消费信息
      offlineConsumeItemsData: [],
      offlineConsumeItemsSize: 0
    };
  },
  created() {},
  mounted() {
    this.getplusMemberDetail();
  },
  methods: {
    // 获取所有信息
    getplusMemberDetail() {
      let parms = {
        pageSize: 10,
        pageNumber: 1,
        id: this.$route.query.id,
        flag: 1
      };
      plusMemberDetail({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.content = content;
          // 待返记录明细和条数
          this.noCashBackItemsData = content.noCashBackItems.items;
          this.noCashBackItemsSize = content.noCashBackItems.totalSize;
          // 余额来源记录
          this.balanceItemsData = content.balanceItems.items;
          this.balanceItemsSize = content.balanceItems.totalSize;
          // 邀请好友记录
          this.teamItemsData = content.teamItems.items;
          this.teamItemsSize = content.teamItems.totalSize;
          // 充值记录
          this.rechargeItemsData = content.rechargeItems.items;
          this.rechargeItemsSize = content.rechargeItems.totalSize;
          // 线上收益(正利润)
          this.onlineProfitIncomeItemsData =
            content.onlineProfitIncomeItems.items;
          this.onlineProfitIncomeItemsSize =
            content.onlineProfitIncomeItems.totalSize;
          // // 线上收益 (无利润或负利润)
          this.onlineLossIncomeItemsData = content.onlineLossIncomeItems.items;
          this.onlineLossIncomeItemsSize =
            content.onlineLossIncomeItems.totalSize;
          // // 线下收益
          this.offlineIncomeItemsData = content.offlineIncomeItems.items;
          this.offlineIncomeItemsSize = content.offlineIncomeItems.totalSize;
          // // 线上消费信息
          this.onlineConsumeItemsData = content.onlineConsumeItems.items;
          this.onlineConsumeItemsSize = content.onlineConsumeItems.totalSize;
          // // 线下消费信息
          this.offlineConsumeItemsData = content.offlineConsumeItems.items;
          this.offlineConsumeItemsSize = content.offlineConsumeItems.totalSize;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 根据flag获取单项信息
    getplusMemberDetailItems(val, flag) {
      let parms = {
        pageSize: 10,
        pageNumber: val,
        id: this.$route.query.id,
        flag: flag
      };
      plusMemberDetail({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          switch (flag) {
            case 2:
              this.onlineConsumeItemsData = content.onlineConsumeItems.items;
              break;
            case 3:
              this.offlineConsumeItemsData = content.offlineConsumeItems.items;
              break;
            case 4:
              this.onlineProfitIncomeItemsData =
                content.onlineProfitIncomeItems.items;
              break;
            case 5:
              this.onlineLossIncomeItemsData =
                content.onlineLossIncomeItems.items;
              break;
            case 6:
              this.offlineIncomeItemsData = content.offlineIncomeItems.items;
              break;
            case 10:
              this.noCashBackItemsData = content.noCashBackItems.items;
              break;
            case 11:
              this.balanceItemsData = content.balanceItems.items;
              break;
            case 12:
              this.teamItemsData = content.teamItems.items;
              break;
            case 13:
              this.rechargeItemsData = content.rechargeItems.items;
              break;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 待返记录翻页
    pageChangenoCashBackItems(val) {
      this.getplusMemberDetailItems(val, 10);
    },

    // 余额来源记录翻页
    pagebalanceItems(val) {
      this.getplusMemberDetailItems(val, 11);
    },

    // 邀请好友记录翻页
    pageteamItems(val) {
      this.getplusMemberDetailItems(val, 12);
    },

    // 充值记录
    pagerechargeItems() {
      this.getplusMemberDetailItems(val, 13);
    },

    // 线上收益 (正利润)翻页
    pageChangeOnlineSY(val) {
      this.getplusMemberDetailItems(val, 4);
    },
    // 线上收益 (无利润或负利润)翻页
    pageChangeOnlineFSY(val) {
      this.getplusMemberDetailItems(val, 5);
    },
    // 线下收益翻页
    pageChangeOfflineSY(val) {
      this.getplusMemberDetailItems(val, 6);
    },
    // 线上消费翻页
    pageChangeOnlineXF(val) {
      this.getplusMemberDetailItems(val, 2);
    },
    // 线下消费翻页
    pageChangeOfflineXF(val) {
      this.getplusMemberDetailItems(val, 3);
    }
  }
};
</script>

<style scoped lang="less">
.common {
  margin-bottom: 30px;
  .title {
    border-bottom: 1px solid #cccccc;
    font-size: 18px;
    font-weight: bold;
  }
  .content {
    width: 90%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .shouyi_top {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-top: 20px;
    }
    li {
      margin-top: 20px;
    }
  }
  .table_content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .table_top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
  }
  .xiaofei_table {
    width: 500px;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px 0;
    }
  }
  .freeze {
    li {
      margin-top: 20px;
    }
  }
}
</style>
