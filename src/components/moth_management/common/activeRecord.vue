<template>
  <div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="name" label="活动" align="center"></el-table-column>
      <el-table-column prop label="活动时间" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.activityType == 1">
            <div
              v-for="(item,index) in scope.row.priceActivityTimeIntervalList"
              :key="index"
            >{{item.startTime}}-{{item.endTime}}</div>
          </span>
          <span v-else>{{scope.row.startTime | dateFormat}}至{{scope.row.endTime | dateFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column prop align="center" label="商品" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            style="color:rgb(0, 153, 255);cursor: pointer;"
            @click="goDetails(scope.row.id)"
          >查看详情</span>
        </template>
      </el-table-column>
      <el-table-column prop="lachineNumber" label="拉新数量" align="center"></el-table-column>
      <el-table-column prop="receiveNumber" label="领取人数" align="center"></el-table-column>
      <!-- <el-table-column prop="receiveNumber" label="访问人数" align="center"></el-table-column> -->
    </el-table>
    <div style="margin-top:20px">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="pageTotal"
        :page-size="10"
        @current-change="pageChange($event)"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { queryPriceActivityList } from "@/network/api";
export default {
  props: {},
  data() {
    return {
      tableData: [],
      pageTotal: 0,
      activityType: ""
    };
  },
  components: {},
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getqueryPriceActivityList(1);
  },
  methods: {
    getqueryPriceActivityList(val) {
      let parms = {
        pageNumber: val,
        pageSize: 10,
        activityType: this.$route.query.activityType
      };
      queryPriceActivityList({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          if (res.data.content) {
            this.tableData = res.data.content.items;
            this.pageTotal = res.data.content.totalSize;
          }
        }
      });
    },
    pageChange(val) {
      this.getqueryPriceActivityList(val);
    },
    goDetails(id) {
      this.$router.push({
        path: "/activeDetails",
        query: {
          id: id,
          activityType:this.tableData[0].activityType
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
</style>
