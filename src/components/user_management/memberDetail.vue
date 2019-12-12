<template>
  <div class="contents">
    <div class="common">
      <div class="title">基本信息:</div>
      <div class="content">
        <ul>
          <li>会员编号：{{content.id}}</li>
          <li>电话：{{content.mobileNumber}}</li>
          <li>累计消费金额(元)：{{content.consumeBalance}}</li>
          <li>上级:{{content.referrerName}}</li>
          <li>正常购买次数：{{content.buyCount}}</li>
        </ul>

        <ul>
          <li>昵称：{{content.nickname}}</li>
          <li>成为普通会员时间：{{content.registryTime | dateFormat}}</li>
          <li>钱包余额：{{content.balance}}</li>
          <li>性别：{{content.gender == 1?'男':'女'}}</li>
          <li>freebuy购买次数：{{content.freeBuyCount}}</li>
        </ul>

        <ul>
          <li>收货信息：</li>
          <li
            v-for="(item,index) in content.addressBooks"
            :key="index"
          >所在地区：{{item.cityName}}-{{item.districtName}},详细地址：{{item.detailedAddress}}</li>
          <li>注册来源：{{content.registrySource | registrySource}}(首次进入的渠道)</li>
        </ul>
      </div>
    </div>

    <div class="common">
      <div class="title">消费信息:</div>
      <div class="content_table">
        <div class="table">
          <div class="table_top">
            <span>线上消费：{{content.onlineConsumeSum}}元 (总计{{onlinetotalSize}}条)</span>
            <el-pagination
              background
              layout="prev, pager, next"
              :total="onlinetotalSize"
              :page-size="10"
              @current-change="pageChangeOnline($event)"
            ></el-pagination>
          </div>
          <el-table :data="OnlinetableData" border style="width: 100%">
            <el-table-column prop="time" label="下单时间" align="center">
              <template slot-scope="scope">{{scope.row.time | dateFormat}}</template>
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

        <div class="table">
          <div class="table_top">
            <span>线下消费：{{content.offlineConsumeSum}}元 (总计{{offlinetotalSize}}条)</span>
            <el-pagination
              background
              layout="prev, pager, next"
              :total="offlinetotalSize"
              :page-size="10"
              @current-change="pageChangeOffline($event)"
            ></el-pagination>
          </div>
          <el-table :data="OfflinetableData" border style="width: 100%">
            <el-table-column prop="time" label="消费时间" align="center">
              <template slot-scope="scope">{{scope.row.time | dateFormat}}</template>
            </el-table-column>
            <el-table-column prop="storeName" label="商家" align="center"></el-table-column>
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
import { memberDetail } from "@/network/api";
export default {
  props: {},
  data() {
    return {
      OnlinetableData: [],
      OfflinetableData: [],
      onlinetotalSize: 1,
      offlinetotalSize: 1,
      content: {}
    };
  },
  components: {},
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.search(1);
    this.getOnlineData(1);
    this.getOfflineData(1);
  },
  methods: {
    getmemberDetail(data) {
      let param = { ...data };
      memberDetail({ params: param }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.content = res.data.content;
          this.onlinetotalSize = res.data.content.onlineConsumeItems.totalSize;
          this.offlinetotalSize =
            res.data.content.offlineConsumeItems.totalSize;
        } else {
          this.content = {};
        }
      });
    },

    getOnlineData(val) {
      let param = {
        pageNumber: val,
        pageSize: 10,
        id: this.$route.query.id,
        flag: 2
      };
      memberDetail({ params: param }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.OnlinetableData = res.data.content.onlineConsumeItems.items;
        } else {
          this.OnlinetableData = [];
        }
      });
    },

    getOfflineData(val) {
      let param = {
        pageNumber: val,
        pageSize: 10,
        id: this.$route.query.id,
        flag: 3
      };
      memberDetail({ params: param }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.OfflinetableData = res.data.content.offlineConsumeItems.items;
        } else {
          this.OfflinetableData = [];
        }
      });
    },

    search(val) {
      let obj = {};
      obj.pageNumber = val;
      obj.pageSize = 10;
      obj.id = this.$route.query.id;
      obj.flag = 1;
      this.getmemberDetail(obj);
    },

    pageChangeOnline(val) {
      this.getOnlineData(val);
    },
    pageChangeOffline(val) {
      this.getOfflineData(val);
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
      width: 500px;
      .table_top {
        display: flex;
        justify-content: space-between;
        margin: 10px 0;
      }
    }
  }
  .freeze {
    li {
      margin-top: 20px;
    }
  }
}
</style>
