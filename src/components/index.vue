<template>
  <div class="container">
    <div class="title">待办事项</div>
    <div class="itemBox">
      <div class="item" @click="nav">
        <span>商家配送待处理</span>
        <span style="margin-top:10px;">{{content.deliveryCount}}条</span>
      </div>
      <div class="item" @click="openIsDeliveryDialog(1)">
        <span>商家申请平台配送</span>
        <span style="margin-top:10px;">{{content.applyPlatDeliveryCount}}条</span>
      </div>
    </div>
    <!-- 商家申请平台配送详情 -->
    <el-dialog title="申请详情" :visible.sync="isDelivery" width="400" :close-on-click-modal="false">
      <el-table :data="gridData" border>
        <el-table-column property="merchantId" label="商家编号" align="center"></el-table-column>
        <el-table-column property="storeName" label="商家名称" align="center"></el-table-column>
        <el-table-column property="mobileNumber" label="联系电话" align="center"></el-table-column>
        <el-table-column property label="标记" align="center" width="120">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 1"
              type="text"
              @click="contact(scope.row.id,scope.row.merchantId)"
            >联系</el-button>
            <span v-if="scope.row.status == 2">已联系</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="width:100%;margin-top:20px;display:flex;justify-content:center">
        <el-pagination
          background
          layout="prev, pager, next,jumper"
          :total="totalSize"
          :page-size="10"
          :current-page.sync="currentPage"
          @current-change="pageChange($event)"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDeliveryData,
  platDeliveryApplyList,
  platDeliveryApply
} from "@/network/api";
export default {
  data() {
    return {
      totalSize: 0,
      currentPage: 0,
      content: "",
      isDelivery: false,
      gridData: []
    };
  },
  created() {
    this.getDeliveryData();
  },
  methods: {
    // 获取商家配送数据
    getDeliveryData() {
      getDeliveryData().then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.content = res.data.content;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 点击商家配送待处理跳转商家配送管理页面
    nav() {
      this.$router.push("/delivery");
    },
    // 打开申请平台配送弹窗
    openIsDeliveryDialog(val) {
      let parms = {
        pageNumber: val,
        pageSize: 10
      };
      platDeliveryApplyList({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.gridData = content.items;
          this.totalSize = content.totalSize;
          this.isDelivery = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 联系
    contact(id, merchantId) {
      let parms = {
        id: id,
        merchantId: merchantId,
        status: "2"
      };
      platDeliveryApply(parms).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.openIsDeliveryDialog(1);
          this.$message.success("操作成功");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 翻页
    pageChange(val) {
      this.openIsDeliveryDialog(val);
      this.currentPage = val;
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  padding: 20px;
  box-sizing: border-box;
  .title {
    padding-bottom: 20px;
    border-bottom: 1px solid #333;
  }
  .itemBox {
    margin-top: 20px;
    display: flex;
    .item {
      width: 200px;
      height: 100px;
      border-radius: 20px;
      border: 1px solid #333;
      margin-right: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }
}
</style>
