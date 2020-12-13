<template>
  <div class="setProductContent">
    <!-- 上方搜索区域 -->
    <div class="title">
      <span>商品名称：</span>
      <el-input style="width:140px;margin-right:20px;" v-model="goodsName"></el-input>
      <span>分类：</span>
      <el-select v-model="type" placeholder="分类" style="width:140px;" @change="selectType1">
        <el-option
          v-for="(item,index) in options_type1"
          :key="item.id"
          :label="item.name"
          :value="index"
        ></el-option>
      </el-select>
      <el-select
        v-model="type2"
        placeholder="二级分类"
        style="width:140px;margin-right:20px;"
        @change="selectType2"
      >
        <el-option v-for="item in options_type2" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <span style="margin-left:10px;">状态：</span>
      <el-select v-model="status" placeholder="请选择" style="width:140px;margin-right:20px;">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="queryPageList(1)">搜索</el-button>
      <el-button type="success" @click="chooseGoodsfocus">添加商品</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="tableContent">
      <el-table :data="tableData" style="width: 100%;margin-top:40px;" border>
        <el-table-column label="商品名称" prop="goodsName" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="goAddGoods(scope.row.goodsId)">{{scope.row.goodsName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="goodsCategoryName" align="center"></el-table-column>
        <el-table-column label="商品库存" prop="stock" align="center"></el-table-column>
        <el-table-column label="排序值" prop="orderNumber" align="center"></el-table-column>
        <el-table-column label="进入商品详情页面人数" prop="goodsDetailCount" align="center"></el-table-column>
        <el-table-column label="进入使用须知页面人数" prop="instructionsCount" align="center"></el-table-column>
        <el-table-column label="进入freebuy计算页面人数" prop="calculationCount" align="center"></el-table-column>
        <el-table-column label="通过freebuy提交订单人数" prop="orderCount" align="center"></el-table-column>
        <el-table-column label="通过freebuy提交订单并支付成功人数" prop="paidCount" align="center"></el-table-column>
        <el-table-column label="状态" prop="issueStatus" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.issueStatus == 1">活动中上架</span>
            <span v-if="scope.row.issueStatus == 2">活动中下架</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              v-if="scope.row.issueStatus == 2"
              @click="addProduct(scope.row.id, 1)"
            >上架</el-button>
            <el-button
              size="mini"
              type="text"
              v-if="scope.row.issueStatus == 1"
              @click="cancelProduct(scope.row.id, 2)"
            >下架</el-button>
            <el-button
              size="mini"
              type="text"
              @click="updateOrderNumber(scope.row.id)"
              v-if="scope.row.issueStatus == 1"
            >设置排序值</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 底部总计条数和分页区域 -->
    <div class="bottom">
      <div class="total">总计：{{totalSize}}条</div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="Number(totalSize)"
        :page-size="10"
        :current-page="currentPage"
        @current-change="pageChange($event)"
      ></el-pagination>
    </div>
    <!-- 选择商品弹窗 -->
    <chooseGoodsPop ref="chooseGoods" @getgoods="getgoods(arguments)"></chooseGoodsPop>
  </div>
</template>
<script>
import chooseGoodsPop from "./selectProduct";
import {
  queryPageList,
  updateOrderNumber,
  updateIssueStatus,
  getGoodsClassRequest,
  addProduct
} from "@/network/api";
export default {
  name: "wish_management",
  data() {
    return {
      goodsName: "", // 商品名称
      goodsCategoryId: "", //商品分类ID
      type: "", // 分类
      type2: "", // 二级分类
      currentPage: 1,
      totalSize: "", // 总计条数
      options: [
        // 状态
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "活动中上架"
        },
        {
          value: "2",
          label: "活动中下架"
        }
      ],
      status: "", // 状态
      options_type1: [], //一级分类
      options_type2: [], //二级分类
      tableData: []
    };
  },
  components: {
    chooseGoodsPop
  },
  created() {
    this.queryPageList(1);
    this.getGoodsCategory();
  },
  methods: {
    // 请求商品数据
    queryPageList(pageNumber) {
      let data = {
        pageNumber: pageNumber,
        pageSize: 10,
        category: 1,
        goodsName: this.goodsName,
        goodsCategoryId: this.goodsCategoryId,
        issueStatus: this.status
      };
      queryPageList({ params: data }).then(res => {
        if ((res.data.messageCode = "MSG_1001")) {
          this.tableData = res.data.content.items;
          this.totalSize = res.data.content.totalSize;
          this.currentPage = pageNumber;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取商品分类
    getGoodsCategory() {
      getGoodsClassRequest().then(res => {
        this.options_type1 = res.data.content;
        let data = {
          id: "",
          name: "全部",
          nextLevelData: []
        };
        this.options_type1.splice(0, 0, data);
      });
    },
    // 选择一级分类
    selectType1(index) {
      this.options_type2 = "";
      this.type2 = "";
      if (this.options_type1[index].nextLevelData.length > 0) {
        this.options_type2 = this.options_type1[index].nextLevelData;
        this.type2 = this.options_type1[index].nextLevelData[0].name;
        this.goodsCategoryId = this.options_type1[index].nextLevelData[0].id;
      } else {
        this.goodsCategoryId = this.options_type1[index].id;
      }
    },
    // 选择二级分类
    selectType2(id) {
      this.goodsCategoryId = id;
    },
    // 添加商品
    chooseGoodsfocus() {
      this.$refs.chooseGoods.open();
    },
    // 接收子组件传递过来的值
    getgoods(argument) {
      let checkedData = argument[0];
      let data = {
        category: 1,
        goodsIdList: argument[0]
      };
      addProduct(data).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.queryPageList(1);
          this.$message.success("添加成功");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 跳转到商品详情页
    goAddGoods(id) {
      this.$router.push({
        path: "/addGoods",
        query: {
          type: 2,
          id: id
        }
      });
    },
    // 上架
    addProduct(id, issueStatus) {
      this.$prompt("确认上架该商品吗？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        inputPattern: /^[+]{0,1}(\d+)$/,
        inputErrorMessage: "排序值只能是正整数",
        inputPlaceholder: "请设置排序值"
      })
        .then(({ value }) => {
          if (value > 100000) {
            this.$message({
              type: "error",
              message: "排序值上限100000"
            });
          } else {
            updateIssueStatus(
              `?id=${id}&&issueStatus=${issueStatus}&&orderNumber=${value}`
            ).then(res => {
              if (res.data.messageCode == "MSG_1001") {
                this.$message.success("修改成功");
                this.queryPageList(1);
              } else {
                this.$message.error(res.data.message);
              }
            });
          }
        })
        .catch(() => {});
    },
    // 下架
    cancelProduct(id, issueStatus) {
      this.$confirm("确认下架该商品吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        type: "warning"
      })
        .then(() => {
          updateIssueStatus(`?id=${id}&&issueStatus=${issueStatus}`).then(
            res => {
              if (res.data.messageCode == "MSG_1001") {
                this.$message.success("修改成功");
                this.queryPageList(1);
              } else {
                this.$message.error(res.data.message);
              }
            }
          );
        })
        .catch(() => {});
    },
    // 设置排序值
    updateOrderNumber(id) {
      this.$prompt("设置排序值", "", {
        confirmButtonText: "保存",
        center: true,
        // inputValue: "",
        inputPattern: /^[+]{0,1}(\d+)$/,
        inputErrorMessage: "排序值只能是正整数",
        inputPlaceholder: "请设置排序值"
      })
        .then(({ value }) => {
          if (value > 100000) {
            this.$message({
              type: "error",
              message: "排序值上限100000"
            });
          } else {
            updateOrderNumber(`?id=${id}&&orderNumber=${value}`).then(res => {
              if (res.data.messageCode == "MSG_1001") {
                this.$message.success("修改成功");
                this.queryPageList(1);
              } else {
                this.$message.error(res.data.message);
              }
            });
          }
        })
        .catch(() => {});
    },
    // 分页改变事件
    pageChange(val) {
      this.currentPage = val;
      this.queryPageList(val);
    }
  }
};
</script>
<style lang="less" scoped>
.bottom {
  width: 100%;
  margin-top: 20px;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .total {
    font-weight: bold;
  }
}
</style>