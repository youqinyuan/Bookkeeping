<template>
  <div>
    <div class="bor_content">
      <span>
        活动名称：
        <strong v-if="activityType == 1">新人免费体验</strong>
        <strong v-if="activityType == 2">信用卡用户免费领</strong>
        <strong v-if="activityType == 3">渠道合作活动(新人免费体验)</strong>
        <strong v-if="activityType == 4">FreeBuy购买免费领</strong>
      </span>
      <el-button style="margin-left:200px" type="primary" @click="goAdd" v-if="!content">添加活动</el-button>
    </div>

    <div class="bor_content" v-if="content">
      <div>
        <span>
          活动名称：
          <strong>{{content.name}}</strong>
        </span>
        <span v-if="activityType == 1">活动时间：<span v-for="(item,index) in content.priceActivityTimeIntervalList" :key="index">{{item.startTime}}-{{item.endTime}}</span></span>
        <span v-else>活动时间：{{content.startTime | dateFormat}}至{{content.endTime | dateFormat}}</span>
        <span style="font-size:25px;color:#cccccc">
          <strong>{{content.status | activeStatus}}</strong>
        </span>
      </div>
      <div>
        <ul>
          <li v-for="(item,index) in content.priceActivityGoodsList" :key="index">
            <span>商品：{{item.goodsName}}</span>
            <span>邮费：{{item.expressFee}}元</span>
            <span>返现：{{item.cashBack}}元/{{item.period}}期</span>
            <span v-if="activityType == 4 && item.buyConditions == 1">条件：使用freebuy方式购买一件商品付款价大于{{item.checkPrice}}元</span>
            <span v-if="activityType == 4 && item.buyConditions == 2">条件：使用freebuy方式下单次数大于{{item.checkNumber}}次</span>

            <div v-for="(ite,inx) in item.priceActivityGoodsStockList" :key="inx" class="guige">
              <span>规格名：{{ite.spcDesc}}</span>
              <span>库存：{{ite.stock}}</span>
              <span>原价：{{ite.orgPrice}}</span>
              <span>领取人数：{{ite.receiveNumber}}</span>
              <span
                class="addStock"
                @click="addStocks(ite.id,ite.stock,ite.stockId)"
                v-if="content.status == 2"
              >增加库存</span>
            </div>
          </li>
        </ul>
      </div>

      <!-- <div>
        <span>
          H5页面链接：{{url}}
          <span
            style="color:#169BD5;cursor: pointer;margin-left:10px"
            v-clipboard:copy="url"
            v-clipboard:success="onCopyUrl"
            v-clipboard:error="onErrorUrl"
          >复制链接</span>
        </span>
      </div>-->

      <div>
        <div v-if="content.status == 1">
          <el-button type="primary" @click="revise(content)">修改活动</el-button>
          <el-button type="danger" @click="deleteActive(content.id)">删除活动</el-button>
        </div>
        <div v-if="content.status == 2">
          <el-button type="primary" @click="goDetails(content.id)">查看详情</el-button>
          <el-button type="danger" @click="breakActive(content.id)">中断活动</el-button>
          <el-button type="success" @click="addProducts(content)">添加商品</el-button>
        </div>
        <div v-if="content.status == 3">
          <el-button type="primary" @click="goOnActive(content.id)">活动继续</el-button>
          <el-button type="danger" @click="finishActive(content.id)">活动结束</el-button>
          <el-button type="success" @click="revise(content)">修改活动</el-button>
        </div>
        <div v-if="content.status == 4">
          <el-button type="primary" @click="goDetails(content.id)">查看详情</el-button>
          <el-button type="success">添加活动</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  queryPriceActivity,
  updatePriceActivityStatus,
  deleteActive,
  addStock,
  getStock
} from "@/network/api";
export default {
  props: {},
  data() {
    return {
      content: {},
      url: "www.baidu.com",
      activityType: this.$route.query.activityType // 活动类型
    };
  },
  components: {},
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getqueryPriceActivity();
  },
  methods: {
    getqueryPriceActivity() {
      queryPriceActivity(
        `?activityType=${this.$route.query.activityType}`
      ).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.content = res.data.content;
        }
      });
    },
    // onCopyUrl() {
    //   this.$message.success("复制成功!");
    // },
    // onErrorUrl() {
    //   this.$message.error("复制失败!");
    // },

    // 修改活动
    revise(content) {
      this.$router.push({
        path: "/addActive",
        query: {
          type: 2,
          activityType: this.$route.query.activityType
        }
      });
      this.$store.commit("changeDetails", content);
    },

    // 添加商品
    addProducts(content) {
      this.$router.push({
        path: "/addActive",
        query: {
          type: 3,
          activityType: this.$route.query.activityType
        }
      });
      this.$store.commit("changeDetails", content);
    },

    // 查看详情
    goDetails(id) {
      this.$router.push({
        path: "/activeDetails",
        query: {
          id: id,
          activityType: this.$route.query.activityType
        }
      });
    },

    // 添加活动
    goAdd() {
      this.$router.push({
        path: "/addActive",
        query: {
          activityType: this.$route.query.activityType
        }
      });
    },

    // 删除活动
    deleteActive(id) {
      this.$confirm("", "删除活动？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          deleteActive({ params: { id: id } }).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("删除成功");
              this.getqueryPriceActivity();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },

    // 中断活动
    breakActive(id) {
      this.$confirm("活动中断后，可能影响最终的运营成果，确定中断？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          let parms = {
            id: id,
            status: 3
          };
          updatePriceActivityStatus(parms).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("中断成功");
              this.getqueryPriceActivity();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },

    // 活动继续
    goOnActive(id) {
      this.$confirm("", "确定活动继续？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          let parms = {
            id: id,
            status: 2
          };
          updatePriceActivityStatus(parms).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("继续成功");
              this.getqueryPriceActivity();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },

    // 活动结束
    finishActive(id) {
      this.$confirm("", "确定活动结束？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          let parms = {
            id: id,
            status: 4
          };
          updatePriceActivityStatus(parms).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("结束成功");
              this.getqueryPriceActivity();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    //增加库存
    addStocks(id, stock, stockId) {
      // 获取库存
      getStock(`?id=${stockId}`).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$prompt("", "", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showClose: false,
            inputPattern: /^([0-9][0-9]*)$/,
            inputErrorMessage: "请输入整数",
            inputPlaceholder: `最大可加 "${res.data.content - stock}"`
          })
            .then(({ value }) => {
              let data = {
                id: id,
                stock: value
              };
              //添加库存
              addStock(data).then(res => {
                if (res.data.messageCode == "MSG_1001") {
                  this.$message.success("添加成功");
                  this.getqueryPriceActivity();
                } else {
                  this.$message.error(res.data.message);
                }
              });
            })
            .catch(() => {});
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.bor_content {
  border: 1px solid black;
  padding: 10px;
  margin-bottom: 10px;
  div {
    margin-bottom: 20px;
  }
  .guige {
    margin-left: 25px;
    margin-top: 10px;
  }
  li {
    margin-top: 20px;
  }
  span {
    margin-right: 30px;
  }
}
.addStock {
  background-color: rgb(64, 134, 240);
  color: #fff;
  padding: 4px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}
</style>
