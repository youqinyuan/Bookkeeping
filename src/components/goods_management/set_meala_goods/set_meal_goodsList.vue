<template>
  <div class="set_meal_goodsList">
    <div class="searchBox">
      <span>商品名称：</span>
      <el-input v-model="goodsName" style="width:200px;"></el-input>
      <span style="margin-left:20px;">行业分类：</span>
      <el-select v-model="businessId" style="width:160px;">
        <el-option v-for="item in Category" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <span style="margin-left:20px;">所属商家：</span>
      <el-input class="inp" v-model="merchantName" style="width:160px;"></el-input>
      <el-button type="primary" style="margin-left:20px;" @click="search(1)">搜索</el-button>
      <el-button type="success" @click="addGoods">添加商品</el-button>
      <el-button type="danger" @click="remove('')">删除</el-button>
    </div>
    <div class="tableBox">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="id" label="商品编号" width="120" align="center"></el-table-column>
        <el-table-column prop="name" label="商品名称" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="ordOrgPrice" label="普通价" align="center"></el-table-column>
        <el-table-column prop="orgPrice" label="一折价" align="center"></el-table-column>
        <el-table-column label="头图" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.goodsImage" alt style="width:40px;height:40px;" />
          </template>
        </el-table-column>
        <el-table-column label="销量" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="changeSales(scope.row.id,scope.row.sales)"
            >{{Number(scope.row.sales) + Number(scope.row.grabbedNumber)}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="merchantName" label="所属商家名" align="center"></el-table-column>
        <el-table-column prop="merchantId" label="所属商家编号" align="center"></el-table-column>
        <el-table-column prop="score" label="评分" align="center"></el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="see(scope.row.id)">查看</el-button>
            <el-button
              type="text"
              v-if="scope.row.issueStatus == 1"
              @click="changeStatus(scope.row.id,2)"
            >下架</el-button>
            <el-button
              type="text"
              v-if="scope.row.issueStatus == 2"
              @click="changeStatus(scope.row.id,1)"
            >上架</el-button>
            <el-button
              type="text"
              v-if="scope.row.issueStatus == 2"
              @click="remove(scope.row.id)"
            >删除</el-button>
            <el-button type="text" @click="seeComment(scope.row.id,scope.row.name)">查看评论</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="totalBox">
      <span>总计：{{totalSize}}条</span>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalSize"
        :current-page.sync="currentPage"
        page-size.sync="15"
        @current-change="pageChange($event)"
      ></el-pagination>
    </div>
    <!-- 销量修改弹窗 -->
    <el-dialog
      title="调整月销量"
      :visible.sync="dialogFormVisible"
      center
      width="400px"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <span>当前真实销量：{{Number(realSales)}}+</span>
      <el-input v-model="sales" style="width:140px;"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateMerchantSales">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getMerchantBusinessList,
  packageGoodsList,
  deleteEvaluationGoods,
  updateGoodsIssueStatus,
  updateGoodsGrabbedNumber
} from "@/network/api";
export default {
  data() {
    return {
      id: "",
      goodsName: "", // 商品名称
      Category: [], // 分类行业
      businessId: "", // 已选行业分类ID
      merchantName: "", // 所属商家
      totalSize: 0,
      currentPage: 1,
      tableData: [],
      multipleSelection: [],
      dialogFormVisible: false,
      realSales: "",
      sales: ""
    };
  },
  created() {
    this.search(1);
    this.getMerchantBusinessList();
  },
  methods: {
    // 搜索
    search(val) {
      let parms = {
        pageNumber: val ? val : this.currentPage,
        pageSize: 15,
        goodsName: this.goodsName,
        businessId: this.businessId,
        merchantName: this.merchantName
      };
      packageGoodsList({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.totalSize = content.totalSize;
          this.tableData = content.items;
          this.currentPage = val ? val : this.currentPage;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取行业分类
    getMerchantBusinessList() {
      getMerchantBusinessList().then(res => {
        this.Category = res.data.content;
        let data = {
          id: "",
          name: "全部"
        };
        this.Category.splice(0, 0, data);
      });
    },
    // 添加商品
    addGoods() {
      this.$router.push({
        path: "/add_set_meal_goods"
      });
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 删除
    remove(id) {
      this.$confirm("确认删除该商品吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        closeOnClickModal: false
      })
        .then(() => {
          let ids = [];
          if (id) {
            // 删除单个
            ids.push(id);
          } else {
            // 批量删除
            if (this.multipleSelection.length == 0) {
              this.$message.error("请先选择要删除的商品");
              return;
            }
            this.multipleSelection.forEach(val => {
              ids.push(val.id);
            });
            this.currentPage = 1;
          }

          let parms = {
            ids: ids
          };
          deleteEvaluationGoods(parms).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.search();
              this.$message.success("删除成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 显示修改销量弹窗
    changeSales(id, realSales) {
      this.sales = "";
      this.id = id;
      this.realSales = realSales;
      this.dialogFormVisible = true;
    },
    // 修改销量
    updateMerchantSales() {
      let reg = /^[+]{0,1}(\d+)$/;
      if (!this.sales) {
        this.$message.error("销量不能为空");
        return;
      }
      if (!reg.test(this.sales)) {
        this.$message.error("销量格式不正确");
        return;
      }
      let parms = {
        goodsId: this.id,
        grabbedNumber: this.sales
      };
      updateGoodsGrabbedNumber(this.qs.stringify(parms)).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.dialogFormVisible = false;
          this.search();
          this.$message.success("操作成功");
          this.sales = "";
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 查看
    see(id) {
      this.$router.push({
        path: "/add_set_meal_goods",
        query: {
          id: id
        }
      });
    },
    // 上下架
    changeStatus(id, status) {
      let parms = {
        goodsId: id,
        issueStatus: status
      };
      updateGoodsIssueStatus(this.qs.stringify(parms)).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("操作成功");
          this.search();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 查看评论
    seeComment(id, name) {
      this.$router.push({
        path: "/comment",
        query: {
          id: id,
          name: name
        }
      });
    },
    // 翻页
    pageChange(val) {
      this.currentPage = val;
      this.search();
    }
  }
};
</script>
<style lang="less" scoped>
.set_meal_goodsList {
  padding: 20px;
  box-sizing: border-box;
  .tableBox {
    margin-top: 40px;
  }
  .totalBox {
    width: 100%;
    margin-top: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>