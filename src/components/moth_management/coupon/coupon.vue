<template>
  <div class="coupon">
    <!-- tabs -->
    <div class="tabsBox">
      <span
        :class="form.type == '1' ? 'tabsItems active' : 'tabsItems'"
        @click="tabsClick('1')"
        >新人优惠券</span
      >
      <span
        :class="form.type == '2' ? 'tabsItems active' : 'tabsItems'"
        @click="tabsClick('2')"
        >通用优惠券</span
      >
      <span
        :class="form.type == '3' ? 'tabsItems active' : 'tabsItems'"
        @click="tabsClick('3')"
        >提期券</span
      >
    </div>
    <!-- 内容区域 -->
    <div class="content">
      <div class="searchBox">
        <span style="margin-left: 10px">优惠券名称：</span>
        <el-input v-model="form.name" style="width: 250px"></el-input>
        <div style="display: inline-block" v-if="form.type != '3'">
          <span style="margin-left: 10px">适用期数：</span>
          <el-input v-model="form.periodBegin" style="width: 100px"></el-input>
          <span>~</span>
          <el-input v-model="form.periodEnd" style="width: 100px"></el-input>
        </div>
        <span style="margin-left: 10px">是否失效：</span>
        <el-select v-model="form.status" style="width: 120px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button type="primary" style="margin-left: 10px" @click="search(1)"
          >搜索</el-button
        >
        <el-button type="primary" @click="addCoupon" v-if="form.type == '1'"
          >创建新人优惠券</el-button
        >
        <el-button type="primary" @click="addCoupon" v-if="form.type == '2'"
          >创建通用优惠券</el-button
        >
        <el-button type="primary" @click="addCoupon" v-if="form.type == '3'"
          >创建提期券</el-button
        >
      </div>
      <div class="tableBox" v-if="flag">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="name" label="优惠券名称" align="center">
          </el-table-column>
          <el-table-column prop="showContent" label="优惠券内容" align="center">
          </el-table-column>
          <el-table-column prop="" label="适用价格" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.amountBegin }}-{{ scope.row.amountEnd }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="适用期数"
            align="center"
            v-if="form.type != '3'"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.periodBegin }}-{{ scope.row.periodEnd }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="showValidDate"
            label="有效期"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="orderNo"
            label="展示序列"
            align="center"
            v-if="form.type == '1'"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="openOrderNoDialog(scope.row.id)">{{
                scope.row.orderNo
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="是否失效" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status == '0'">未上架</span>
              <span v-if="scope.row.status == '1'">未失效</span>
              <span v-if="scope.row.status == '2'">已失效</span>
              <span v-if="scope.row.status == '3'">已使用</span>
              <span v-if="scope.row.status == '4'">已删除</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="已使用/已领取" align="center">
            <template slot-scope="scope">
              <span
                >{{ scope.row.usedCount }}-{{ scope.row.receivedCount }}</span
              >
            </template></el-table-column
          >
          <el-table-column prop="name" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="openGiveCouponsDialog(scope.row.id, scope.row.status)"
                >赠送</el-button
              >
              <el-button type="text" @click="openDelCouponsDialog(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="totalSizeBox" v-if="flag">
        <span>总计：{{ totalSize }}条</span>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalSize"
          :page-size="15"
          :current-page="currentPage"
          @current-change="pageChange($event)"
        >
        </el-pagination>
      </div>
      <!-- 设置展示序列弹窗 -->
      <el-dialog
        title="展示序列"
        :visible.sync="orderNoDialog"
        width="300px"
        center
        :close-on-click-modal="false"
        :show-close="false"
      >
        <div style="width: 100%; display: flex; justify-content: center">
          <el-input v-model="orderNo" style="width: 120px"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            @click="
              orderNoDialog = false;
              orderNo = '';
            "
            >取 消</el-button
          >
          <el-button type="primary" @click="updateOrderNoCoupon"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 删除优惠券弹窗 -->
      <el-dialog
        title="删除后领券中心将不再显示"
        :visible.sync="delCouponDialog"
        width="400px"
        center
        :close-on-click-modal="false"
        :show-close="false"
      >
        <div style="width: 100%; display: flex; justify-content: center">
          <el-checkbox v-model="removeUserReceived"
            >删除所有用户已领取的优惠券</el-checkbox
          >
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            @click="
              delCouponDialog = false;
              removeUserReceived = '';
            "
            >取 消</el-button
          >
          <el-button type="primary" @click="removeCoupon">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 引入赠送优惠券弹窗组件 -->
      <giveCouponsDialog ref="giveCouponsDialog"></giveCouponsDialog>
    </div>
  </div>
</template>
<script>
import {
  findPageListCoupon,
  removeCoupon,
  updateOrderNoCoupon,
} from "@/network/api";
import giveCouponsDialog from "./giveCouponsDialog";
export default {
  data() {
    return {
      orderNoDialog: false,
      delCouponDialog: false,
      totalSize: 0,
      currentPage: 0,
      flag: true,
      form: {
        pageSize: "15",
        type: "1",
        name: "",
        periodBegin: "",
        periodEnd: "",
        status: "",
      },
      options: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "2",
          label: "是",
        },
        {
          value: "1",
          label: "否",
        },
      ],
      tableData: [],
      id: "", // 优惠券id
      orderNo: "", // 排序号
      removeUserReceived: "", //是否删除用户已领取的优惠券
    };
  },
  components: { giveCouponsDialog },
  created() {
    // 记录从添加优惠券跳转回来的优惠券类型
    let type = this.$route.params.type;
    if (type) {
      this.form.type = type;
    }
    this.search(1);
  },
  methods: {
    // tabs切换
    tabsClick(tab) {
      this.flag = false;
      this.form.type = tab;
      this.form.name = "";
      this.form.periodBegin = "";
      this.form.periodEnd = "";
      this.form.status = "";
      this.search(1);
    },
    // 搜索
    search(val) {
      let parms = this.form;
      parms.pageNumber = val ? val : this.currentPage;
      findPageListCoupon({ params: parms }).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.tableData = content.items;
          this.totalSize = content.totalSize;
          this.flag = true;
          this.currentPage = val ? val : this.currentPage;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 创建优惠券
    addCoupon(type) {
      // type:要创建的优惠券类型，1-新人优惠券，2-通用优惠券，3-提期劵
      this.$router.push({
        path: "/addCoupon",
        query: {
          type: this.form.type,
        },
      });
    },

    // 打开修改排序号弹窗
    openOrderNoDialog(id) {
      this.id = id;
      this.orderNoDialog = true;
    },
    // 修改排序号
    updateOrderNoCoupon() {
      if (!this.orderNo) {
        this.$message.error("排序号不能为空");
        return;
      }
      let a = /^[1-9]\d*$/;
      if (!a.test(this.orderNo)) {
        this.$message.error("排序号只能为正整数");
        return;
      }
      let parms = {
        id: this.id,
        orderNo: this.orderNo,
      };
      updateOrderNoCoupon({ params: parms }).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("操作成功");
          this.orderNoDialog = false;
          this.orderNo = "";
          this.search();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 打开赠送优惠券弹窗
    openGiveCouponsDialog(id, status) {
      if (status == "2") {
        this.$message.error("优惠券已失效，无法赠送");
        return;
      }
      this.$refs.giveCouponsDialog.open(id);
    },

    // 打开删除优惠券弹窗
    openDelCouponsDialog(id) {
      this.id = id;
      if (this.form.type == "1") {
        // 打开删除新人优惠券弹窗
        this.delCouponDialog = true;
      } else {
        // 删除通用券和提期券
        this.$confirm("删除所有用户已领取的优惠券？", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true,
          showClose: false,
          closeOnClickModal: false,
        })
          .then(() => {
            let parms = {
              id: this.id,
              removeUserReceived: "1",
            };
            removeCoupon(this.qs.stringify(parms)).then((res) => {
              if (res.data.messageCode == "MSG_1001") {
                this.$message.success("删除成功");
                this.search();
              } else {
                this.$message.error(res.data.message);
              }
            });
          })
          .catch(() => {});
      }
    },
    // 删除新人优惠券优惠券
    removeCoupon() {
      let parms = {
        id: this.id,
        removeUserReceived: this.removeUserReceived ? "1" : "2",
      };
      removeCoupon(this.qs.stringify(parms)).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("删除成功");
          this.delCouponDialog = false;
          this.removeUserReceived = "";
          this.search();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 分页改变事件
    pageChange(val) {
      this.currentPage = val;
      this.search(val);
    },
  },
};
</script>
<style lang="less" scoped>
.coupon {
  padding: 20px;
  box-sizing: border-box;
  .tabsBox {
    width: 100%;
    .tabsItems {
      margin-right: 35px;
      font-size: 15px;
      cursor: pointer;
    }
    .active {
      color: #409eff;
    }
  }
  .searchBox {
    margin-top: 40px;
  }
  .tableBox {
    margin-top: 40px;
  }
  .totalSizeBox {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
