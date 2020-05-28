<template>
  <div class="changeMoney">
    <div class="searchBox" style="margin-top:20px;">
      <span>商品编号：</span>
      <el-input v-model="form.goodsId" style="width:140px;" size="small" :maxlength="6"></el-input>
      <span style="margin-left:20px;">商户编号：</span>
      <el-input
        v-model="form.merchantId"
        style="width:140px;margin-right:20px;"
        size="small"
        :maxlength="6"
      ></el-input>
      <el-button size="small" type="primary" @click="search(1)">搜索</el-button>
    </div>
    <div class="tabelBox" style="margin-top:40px;">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="编号" align="center" width="100"></el-table-column>
        <el-table-column prop="storeName" label="商户名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mobileNumber" label="电话" align="center"></el-table-column>
        <el-table-column prop label="申请提交时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="申请商品" align="center"></el-table-column>
        <el-table-column prop label="调价详情" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="modifyPrice(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status == 1" type="text" @click="agree(scope.row.id)">同意</el-button>
            <el-button v-if="scope.row.status == 1" type="text" @click="refuse(scope.row.id)">拒绝</el-button>
            <span v-if="scope.row.status == 2">已同意</span>
            <span v-if="scope.row.status == 3">已拒绝</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="totalBox">
      <span>总计：{{totalSize}}条</span>
      <el-pagination
        background
        layout="prev, pager, next,jumper"
        :total="totalSize"
        :page-size="10"
        :current-page.sync="currentPage"
        @current-change="pageChange($event)"
      ></el-pagination>
    </div>
    <!-- 调价详情弹窗 -->
    <el-dialog title="调价详情" :visible.sync="modifyPriceDialog" width="70%">
      <el-table :data="detailData" border>
        <el-table-column property="specDesc" label="规格" align="center"></el-table-column>
        <el-table-column property="dctPrice" label="成本价" align="center" width="100px"></el-table-column>
        <el-table-column property="name" label="当前返后价" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.cashbackList.length>0">
              <div
                v-for="(item,index) in scope.row.cashbackList"
                :key="index"
              >{{item.period}}期：{{item.amount}}</div>
            </div>
            <div>{{scope.row.orgPrice}}</div>
          </template>
        </el-table-column>
        <el-table-column property="name" label="当前价格(元)" align="center" width="140px">
          <template slot-scope="scope">
            <div>零售价：{{scope.row.retailPrice}}</div>
            <div>供货价：{{scope.row.supplyPrice}}</div>
          </template>
        </el-table-column>
        <el-table-column property="name" label="申请价格(元)" align="center" width="140px">
          <template slot-scope="scope">
            <div>零售价：{{scope.row.applyRetailPrice}}</div>
            <div>供货价：{{scope.row.applySupplyPrice}}</div>
          </template>
        </el-table-column>
        <el-table-column property="name" label="调价幅度" align="center">
          <template slot-scope="scope">
            <div>零售价：{{scope.row.retailPriceRange}}</div>
            <div>供货价：{{scope.row.supplyPriceRange}}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import {
  getMerchantApplyList,
  getMerchantApplyDetail,
  changeMerchantApplyStatus
} from "@/network/api";
export default {
  data() {
    return {
      totalSize: 0,
      currentPage: 0,
      form: {
        pageSize: 10,
        goodsId: "",
        merchantId: ""
      },
      modifyPriceDialog: false,
      tableData: [],
      detailData: []
    };
  },
  created() {
    this.search(1);
  },
  methods: {
    // 搜索
    search(val) {
      let form = this.form;
      let reg = /^[1-9]\d*$/;
      if (form.goodsId && !reg.test(form.goodsId)) {
        this.$message.error("商品编号格式不正确");
        return;
      }
      if (form.merchantId && !reg.test(form.merchantId)) {
        this.$message.error("商户编号格式不正确");
        return;
      }
      form.pageNumber = val;
      getMerchantApplyList({ params: form }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let data = res.data.content;
          this.totalSize = data.totalSize;
          this.tableData = data.items;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 查看调价详情
    modifyPrice(id) {
      let parms = {
        priceApplyId: id
      };
      getMerchantApplyDetail({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.detailData = res.data.content;
          this.modifyPriceDialog = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 同意
    agree(id) {
      this.$confirm("同意后商家的到账金额将改变", "提示", {
        confirmButtonText: "通过",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          let parms = {
            id: id,
            status: 2
          };
          changeMerchantApplyStatus(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.search(1);
              this.$message.success("操作成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 拒绝
    refuse(id) {
      let that = this;
      this.$prompt("请填写拒绝的理由", "拒绝", {
        confirmButtonText: "驳回",
        cancelButtonText: "取消",
        inputType: "textarea",
        closeOnClickModal: false,
        center: true,
        beforeClose(action, instance, done) {
          if (action == "confirm") {
            let value = instance.inputValue;
            if (value == null || value.trim().length < 1) {
              this.$message.error("拒绝理由不能为空");
            } else if (value.trim().length > 50) {
              this.$message.error("拒绝理由最多输入50个字符");
            } else {
              let parms = {
                id: id,
                status: 3,
                reason: value
              };
              changeMerchantApplyStatus(this.qs.stringify(parms)).then(res => {
                if (res.data.messageCode == "MSG_1001") {
                  that.search(1);
                  done();
                  that.$message.success("操作成功");
                } else {
                  this.$message.error(res.data.message);
                }
              });
            }
          } else {
            done();
          }
        }
      })
        .then(() => {})
        .catch(() => {});
    },
    // 翻页
    pageChange(val) {
      this.search(val);
      this.currentPage = val;
    }
  }
};
</script>
<style lang="less" scoped>
.changeMoney {
  padding: 20px;
  box-sizing: border-box;
  .totalBox {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>