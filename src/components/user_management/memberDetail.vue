<template>
  <div class="contents">
    <div class="common">
      <div class="title">基本信息:</div>
      <div class="content">
        <ul>
          <li>会员编号：{{ content.id }}</li>
          <li>电话：{{ content.mobileNumber }}</li>
          <li>累计消费金额(元)：{{ content.consumeBalance }}</li>
          <li>上级:{{ content.referrerName }}</li>
          <li>正常购买次数：{{ content.buyCount }}</li>
          <li>充值次数：{{ content.rechargeCount }}</li>
        </ul>

        <ul>
          <li>昵称：{{ content.nickname }}</li>
          <li>
            <span>提现使用姓名：</span>
            <span v-for="(item, index) in content.withdrawNameList" :key="index">
              <span>{{ item }}</span>
              <span v-if="index !== content.withdrawNameList.length - 1">，</span>
            </span>
          </li>
          <li>注册时间：{{ content.registryTime | dateFormat }}</li>
          <li>成为普通会员时间：{{ content.registryTime | dateFormat }}</li>
          <li>钱包余额：{{ content.balance }}</li>
          <li>性别：{{ content.gender == 1 ? "男" : "女" }}</li>
          <li>freebuy购买次数：{{ content.freeBuyCount }}</li>
          <li>上级电话：{{ content.referrerMobileNumber }}</li>
        </ul>

        <ul>
          <li>收货信息：</li>
          <li v-for="(item, index) in content.addressBooks" :key="index">
            所在地区：{{ item.cityName }}-{{ item.districtName }},详细地址：{{
              item.detailedAddress
            }}
          </li>
          <li>
            注册来源：{{
              content.registrySource | registrySource
            }}(首次进入的渠道)
          </li>
        </ul>
      </div>
    </div>

    <!-- 待返记录 -->
    <div class="common">
      <div class="title">待返记录</div>
      <div class="table">
        <div class="table_top">
          <span>待返余额：{{ content.amountNoCashBackSum }}元 (总计{{
              noCashBackItemsSize
            }}条)</span>
          <el-pagination background layout="prev, pager, next" :total="noCashBackItemsSize" :page-size="10"
            @current-change="pageChangenoCashBackItems($event)"></el-pagination>
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
          <el-table-column prop="tradeTime" label="记录时间" align="center">
            <template slot-scope="scope">{{
              scope.row.tradeTime | dateFormat
            }}</template>
          </el-table-column>
          <el-table-column prop="remark" label="来源" align="center"></el-table-column>
          <el-table-column prop="orderNumber" label="关联订单" align="center"></el-table-column>
          <el-table-column prop="noCashBackAmount" label="待返金额" align="center"></el-table-column>
          <el-table-column prop="amountReturned" label="已返金额" align="center"></el-table-column>
          <el-table-column prop="period" label="总计返现周期" align="center"></el-table-column>
          <el-table-column prop="periodLeft" label="剩余返现周期" align="center"></el-table-column>
          <el-table-column prop="transferRemak" label="转让信息" align="center"></el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 余额来源记录 -->
    <div class="common">
      <div class="title">余额来源记录</div>
      <div class="table">
        <div class="table_top">
          <span>余额：{{ content.balance }}元 (总计{{ balanceItemsSize }}条)</span>
          <el-pagination background layout="prev, pager, next" :total="balanceItemsSize" :page-size="10"
            @current-change="pagebalanceItems($event)"></el-pagination>
        </div>
        <el-table :data="balanceItemsData" border style="width: 100%">
          <el-table-column prop="tradeTime" label="时间" align="center">
            <template slot-scope="scope">{{
              scope.row.tradeTime | dateFormat
            }}</template>
          </el-table-column>
          <el-table-column prop="tradeAmount" label="金额" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="remark" label="来源" align="center"></el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 种子明细 -->
    <div class="common">
      <div class="title">种子明细</div>
      <div class="table">
        <div class="table_top">
          <span>种子余额：{{ content.seedAmount }}元 (总计{{
              seedItemsSize
            }}条)</span>
          <el-pagination background layout="prev, pager, next" :total="seedItemsSize" :page-size="10"
            @current-change="pageSeedItems($event)"></el-pagination>
        </div>
        <el-table :data="seedItemsData" border style="width: 100%">
          <el-table-column prop="surplusAmount" label="剩余总量" align="center"></el-table-column>
          <el-table-column prop="tradeAmount" label="类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.amount > 0">获取</span>
              <span v-else>扣除</span>
            </template>
          </el-table-column>
          <el-table-column prop="tradeTime" label="获取/扣除时间" align="center">
            <template slot-scope="scope">{{
              scope.row.recordTime | dateFormat
            }}</template>
          </el-table-column>
          <el-table-column prop="amount" label="数量" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 邀请好友记录 -->
    <div class="common">
      <div class="title">邀请好友记录</div>
      <div class="table">
        <div class="table_top">
          <span>总计邀请：{{ content.teamCount }}人 (总计{{
              teamItemsSize
            }}条)</span>
          <el-pagination background layout="prev, pager, next" :total="teamItemsSize" :page-size="10"
            @current-change="pageteamItems($event)"></el-pagination>
        </div>
        <el-table :data="teamItemsData" border style="width: 100%">
          <el-table-column prop="registryTime" label="时间" align="center">
            <template slot-scope="scope">{{
              scope.row.registryTime | dateFormat
            }}</template>
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
          <span>总计充值：{{ content.amountRechargeSum }}元 (总计{{
              rechargeItemsSize
            }}条)</span>
          <el-pagination background layout="prev, pager, next" :total="rechargeItemsSize" :page-size="10"
            @current-change="pagerechargeItems($event)"></el-pagination>
        </div>
        <el-table :data="rechargeItemsData" border style="width: 100%">
          <el-table-column prop="tradeTime" label="充值时间" align="center">
            <template slot-scope="scope">{{
              scope.row.tradeTime | dateFormat
            }}</template>
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

    <!-- 消费信息 -->
    <div class="common">
      <div class="title">消费信息:</div>
      <div class="content_table">
        <div class="table">
          <div class="table_top">
            <span>线上消费：{{ content.onlineConsumeSum }}元 (总计{{
                onlinetotalSize
              }}条)</span>
            <el-pagination background layout="prev, pager, next" :total="onlinetotalSize" :page-size="10"
              @current-change="pageChangeOnline($event)"></el-pagination>
          </div>
          <el-table :data="OnlinetableData" border style="width: 100%">
            <el-table-column prop="time" label="下单时间" align="center">
              <template slot-scope="scope">{{
                scope.row.time | dateFormat
              }}</template>
            </el-table-column>
            <el-table-column prop="storeName" label="商家" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderType" label="购买方式" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.orderType | orderType }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="购买商品" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="amount" label="消费金额" align="center"></el-table-column>
          </el-table>
        </div>

        <div class="table">
          <div class="table_top">
            <span>线下消费：{{ content.offlineConsumeSum }}元 (总计{{
                offlinetotalSize
              }}条)</span>
            <el-pagination background layout="prev, pager, next" :total="offlinetotalSize" :page-size="10"
              @current-change="pageChangeOffline($event)"></el-pagination>
          </div>
          <el-table :data="OfflinetableData" border style="width: 100%">
            <el-table-column prop="time" label="消费时间" align="center">
              <template slot-scope="scope">{{
                scope.row.time | dateFormat
              }}</template>
            </el-table-column>
            <el-table-column prop="storeName" label="商家" align="center"></el-table-column>
            <el-table-column prop="orderType" label="购买方式" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.orderType | orderType }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="categoryName" label="商品分类" align="center"></el-table-column>
            <el-table-column prop="amount" label="消费金额" align="center"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <div class="common">
      <div class="title">冻结历史:</div>
      <div class="freeze">
        <ul>
          <li v-for="(item, index) in content.freezeRecords" :key="index">
            {{ item.createTime | dateFormat }},{{
              item.status == 1 ? "解冻" : "冻结"
            }}
            <span v-if="item.remark">,原因:{{ item.remark }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    memberDetail
  } from "@/network/api";
  export default {
    props: {},
    data() {
      return {
        // 全部信息
        content: {},
        // 待返明细和条数
        noCashBackItemsData: [],
        noCashBackItemsSize: 0,
        // 余额来源记录
        balanceItemsData: [],
        balanceItemsSize: 0,
        // 种子明细
        seedItemsData: [],
        seedItemsSize: 0,
        // 邀请好友记录
        teamItemsData: [],
        teamItemsSize: 0,
        // 充值记录
        rechargeItemsData: [],
        rechargeItemsSize: 0,
        // 线上消费信息
        OnlinetableData: [],
        onlinetotalSize: 0,
        // 线下消费信息
        OfflinetableData: [],
        offlinetotalSize: 0,
      };
    },
    components: {},
    computed: {},
    watch: {},
    created() {},
    mounted() {
      this.getmemberDetail();
    },
    methods: {
      // 查询所有信息
      getmemberDetail() {
        let param = {
          pageNumber: 1,
          pageSize: 10,
          id: this.$route.query.id,
          flag: 1,
        };
        memberDetail({
          params: param,
        }).then((res) => {
          if (res.data.messageCode == "MSG_1001") {
            let content = res.data.content;
            this.content = content;
            // 待返记录明细和条数
            this.noCashBackItemsData = content.noCashBackItems.items;
            this.noCashBackItemsSize = content.noCashBackItems.totalSize;
            // 余额来源记录
            this.balanceItemsData = content.balanceItems.items;
            this.balanceItemsSize = content.balanceItems.totalSize;
            // 种子明细
            this.seedItemsData = content.seedRecordItems.items;
            this.seedItemsSize = content.seedRecordItems.totalSize;
            // 邀请好友记录
            this.teamItemsData = content.teamItems.items;
            this.teamItemsSize = content.teamItems.totalSize;
            // 充值记录
            this.rechargeItemsData = content.rechargeItems.items;
            this.rechargeItemsSize = content.rechargeItems.totalSize;
            // 线上消费明细和条数
            this.OnlinetableData = content.onlineConsumeItems.items;
            this.onlinetotalSize = content.onlineConsumeItems.totalSize;
            // 线下消费明细和条数
            this.offlinetotalSize = content.offlineConsumeItems.totalSize;
            this.OfflinetableData = content.offlineConsumeItems.items;
          } else {
            this.$message.error(res.data.message);
          }
        });
      },

      // 根据flag查询单项信息
      getmemberDetailItems(val, flag) {
        let param = {
          pageNumber: val,
          pageSize: 10,
          id: this.$route.query.id,
          flag: flag,
        };
        memberDetail({
          params: param,
        }).then((res) => {
          if (res.data.messageCode == "MSG_1001") {
            let content = res.data.content;
            switch (flag) {
              case 2:
                this.OnlinetableData = content.onlineConsumeItems.items;
                break;
              case 3:
                this.offlinetotalSize = content.offlineConsumeItems.totalSize;
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
              case 14:
                this.seedItemsData = content.seedRecordItems.items;
                break;
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
      },

      // 待返记录翻页
      pageChangenoCashBackItems(val) {
        this.getmemberDetailItems(val, 10);
      },

      // 余额来源记录翻页
      pagebalanceItems(val) {
        this.getmemberDetailItems(val, 11);
      },

      // 种子明细翻页
      pageSeedItems(val) {
        this.getmemberDetailItems(val, 14);
      },

      // 邀请好友记录翻页
      pageteamItems(val) {
        this.getmemberDetailItems(val, 12);
      },

      // 充值记录
      pagerechargeItems(val) {
        this.getmemberDetailItems(val, 13);
      },

      // 线上消费明细翻页
      pageChangeOnline(val) {
        this.getmemberDetailItems(val, 2);
      },

      // 线下消费明细翻页
      pageChangeOffline(val) {
        this.getmemberDetailItems(val, 3);
      },
    },
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
      width: 70%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      li {
        margin-top: 20px;
      }
    }

    .content_table {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .table {
        width: 600px;
      }
    }

    .table_top {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
    }

    .freeze {
      li {
        margin-top: 20px;
      }
    }
  }

</style>
