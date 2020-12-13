<template>
  <div class="refundOrder">
    <div class="top">
      <span>货物状态：</span>
      <el-select v-model="cargoStatus" placeholder="请选择" style="width:120px;">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span style="margin-left:20px">退款状态：</span>
      <el-select v-model="status" placeholder="请选择" style="width:120px;">
        <el-option
          v-for="item in options_money"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span style="margin-left:20px">单号：</span>
      <el-input v-model="number" placeholder="请输入订单号或退款编号查询" style="width:240px;" :maxlength="100"></el-input>
      <el-button type="primary" style="margin-left:20px" @click="search(1)">查询</el-button>
    </div>
    <div class="tableBox">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="refundNumber" label="退款编号" align="center"></el-table-column>
        <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="createTime" label="申请时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderNumber" label="所属订单" align="center"></el-table-column>
        <el-table-column prop="cargoStatus" label="货物状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.cargoStatus == 1">未收到货</span>
            <span v-if="scope.row.cargoStatus == 2">已收到货</span>
            <span v-if="scope.row.cargoStatus == 3">未到店</span>
            <span v-if="scope.row.cargoStatus == 4">已到店</span>
          </template>
        </el-table-column>
        <el-table-column prop="refundAmount" label="退款金额" align="center"></el-table-column>
        <el-table-column prop="desc" label="退款理由" align="center"></el-table-column>
        <el-table-column prop="status" label="退款状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">退款中</span>
            <span v-if="scope.row.status == 2">商家已同意-退款中</span>
            <span v-if="scope.row.status == 3">已发货-退款中</span>
            <span v-if="scope.row.status == 4">退款失败</span>
            <span v-if="scope.row.status == 5">退款成功</span>
            <span v-if="scope.row.status == 6">取消退款</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="seeDetail(scope.row.id)">查看</el-button>
            <el-button
              type="text"
              v-if="scope.row.status == 1"
              @click="agree(scope.row.cargoStatus,scope.row.id,1)"
            >同意</el-button>
            <el-button
              type="text"
              v-if="scope.row.status == 1 || scope.row.status == 2 || scope.row.status == 3"
              @click="refuse(scope.row.id,2)"
            >拒绝</el-button>
            <el-button
              type="text"
              v-if="scope.row.status == 2 || scope.row.status == 3"
              @click="logistics(scope.row.status,scope.row.id,1)"
            >物流</el-button>
            <el-button
              type="text"
              v-if="scope.row.status == 4"
              @click="refuseReason(scope.row.refusalCause)"
            >拒绝原因</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="totalNumBox">
      <span>总计：{{totalSize}}条</span>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalSize"
        :page-size="10"
        :current-page="currentPage"
        @current-change="pageChange($event)"
      ></el-pagination>
    </div>
    <!-- 退货物流信息弹窗 -->
    <el-dialog title="退货物流信息" :visible.sync="dialogVisible" width="60%">
      <div class="title">
        <span>快递名称：{{logisticsInfo.company}}</span>
        <span>快递单号：{{logisticsInfo.no}}</span>
      </div>
      <div class="items" v-for="(item,index) in logisticsInfo.list" :key="index">
        <span>{{item.datetime}}</span>
        <span>{{item.remark}}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="sign">确认签收并退款</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryOperateOrderRefundList,
  refundAudits,
  queryLogistic
} from "@/network/api";
export default {
  data() {
    return {
      tableData: [],
      totalSize: 0, // 总计条数
      currentPage: 1,
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "2",
          label: "已收到货"
        },
        {
          value: "1",
          label: "未收到货"
        },
        {
          value: "3",
          label: "未到店"
        },
        {
          value: "4",
          label: "已到店"
        }
      ],
      cargoStatus: "", // 货物状态
      options_money: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "退款中"
        },
        {
          value: "2",
          label: "商家已同意-退款中"
        },
        {
          value: "3",
          label: "已发货-退款中"
        },
        {
          value: "4",
          label: "退款失败"
        },
        {
          value: "5",
          label: "退款成功"
        },
        {
          value: "6",
          label: "退款取消"
        }
      ],
      status: "", // 退款状态
      number: "", // 订单号或者退款编号
      dialogVisible: false, // 是否显示物流弹窗
      logisticsInfo: {
        // 物流信息
        company: "",
        no: ""
      },
      orderId: "" // 退款id
    };
  },
  // 路由进入时 判断是否从详情页返回
  beforeRouteEnter(to, from, next) {
    if (from.path === "/refundDetail") {
      // 查看是否记录了页面
      let page = sessionStorage.getItem("page");
      page = page ? JSON.parse(page) : 1;
      let cargoStatus = sessionStorage.getItem("cargoStatus");
      let status = sessionStorage.getItem("status");
      next(vm => {
        vm.cargoStatus = cargoStatus ? cargoStatus : "";
        vm.status = status ? status : "";
        vm.search(page);
      });
    } else {
      next(vm => {
        vm.search(1);
      });
    }
  },
  methods: {
    // 搜索
    search(val) {
      let params = {
        pageNumber: val,
        pageSize: 10
      };
      if (this.cargoStatus) {
        params.cargoStatus = this.cargoStatus;
      }
      if (this.status) {
        params.status = this.status;
      }
      if (this.number) {
        params.number = this.number;
      }
      queryOperateOrderRefundList({ params: params }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          if (res.data.content) {
            let data = res.data.content;
            this.tableData = data.items;
            this.totalSize = data.totalSize;
            this.currentPage = val;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 查看
    seeDetail(id) {
      this.$router.push({
        path: "/refundDetail",
        query: {
          id: id
        }
      });
      sessionStorage.setItem("page", this.currentPage);
      sessionStorage.setItem("cargoStatus", this.cargoStatus);
      sessionStorage.setItem("status", this.status);
    },
    // 退款审核
    refundAudit(orderId, type, remark) {
      remark ? remark : "";
      let params = {
        orderId: orderId,
        type: type,
        remark: remark
      };
      refundAudits(params).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("操作成功");
          this.search(1);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 同意
    agree(cargoStatus, orderId, type) {
      let tips;
      if (cargoStatus == 2) {
        tips = "是否同意当前商品退款？";
      } else if (cargoStatus == 1) {
        tips =
          "当前退款商品用户无需退货，同意退款后系统将退款至用户，是否同意当前商品退款？";
      }
      this.$confirm(tips, "同意退款", {
        confirmButtonText: "同意",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.refundAudit(orderId, type);
        })
        .catch(() => {});
    },
    // 拒绝
    refuse(orderId, type) {
      this.$prompt("是否拒绝当前商品退款？", "拒绝退款", {
        confirmButtonText: "拒绝",
        cancelButtonText: "取消",
        inputPlaceholder: "请填写拒绝退款原因，（100字以内）",
        inputType: "textarea",
        inputPattern: /\S/,
        inputErrorMessage: "理由不能为空"
      })
        .then(({ value }) => {
          if (value.length > 100) {
            this.$message.error("拒绝退款原因字数不能大于100");
            return;
          }
          this.refundAudit(orderId, type, value);
        })
        .catch(() => {});
    },
    // 物流
    logistics(status, orderId, type) {
      this.orderId = orderId;
      // status: 3-已填写物流信息，其他-未填写物流信息
      if (status == 3) {
        let data = {
          refundId: orderId
        };
        queryLogistic({ params: data }).then(res => {
          if (res.data.messageCode == "MSG_1001") {
            this.dialogVisible = true;
            if (res.data.content) {
              this.logisticsInfo = res.data.content;
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
      } else {
        this.$confirm(
          "用户暂未上传退货物流信息，如果您已收到货物或其他情况无需退货且双方已经协商成功的请确认签收并退款。",
          "退货物流信息",
          {
            confirmButtonText: "确认签收并退款",
            cancelButtonText: "取消"
          }
        )
          .then(() => {
            this.refundAudit(orderId, type);
            this.dialogVisible = false;
          })
          .catch(() => {});
      }
    },
    // 已填写物流信息弹窗点击确认签收并退款
    sign() {
      this.refundAudit(this.orderId, 1);
      this.dialogVisible = false;
    },
    // 拒绝原因
    refuseReason(refusalCause) {
      refusalCause = refusalCause ? refusalCause : "无";
      this.$alert(refusalCause, "", {
        confirmButtonText: "确定",
        center: true,
        showClose: false,
        callback: action => {}
      });
    },
    // 分页改变事件
    pageChange(val) {
      this.currentPage = val;
      this.search(val);
    }
  }
};
</script>
<style lang="less" scoped>
.refundOrder {
  padding: 20px;
  box-sizing: border-box;
  .tableBox {
    width: 100%;
    margin-top: 20px;
  }
  .totalNumBox {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
  }
  .title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
  }
  .items {
    width: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 14px;
    color: #999;
  }
}
</style>