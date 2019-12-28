<template>
  <div class="contents">
    <div class="inline_box">
      <span>商品名称:</span>
      <el-input class="inp" v-model="goodsName" placeholder></el-input>
    </div>

    <div class="inline_box">
      <span>所属商家:</span>
      <el-input class="inp" v-model="businessName" placeholder></el-input>
    </div>

    <div class="inline_box">
      <span>行业分类:</span>
      <el-select v-model="valueCategory" placeholder="请选择" @change="handleChangeCategory">
        <el-option v-for="item in Category" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </div>

    <div class="inline_box" v-show="showGoodsClass">
      <span>商品分类:</span>
      <el-cascader
        expand-trigger="hover"
        :options="options_class"
        :props="defaultParams"
        v-model="selectedGoodsId"
        @change="handleChangeGoods"
      ></el-cascader>
    </div>

    <div class="inline_box">
      <el-button type="primary" @click="search(1)">搜索</el-button>
      <el-button type="success" @click="add">添 加</el-button>
      <el-button type="danger" @click="deletedCheckbox">删 除</el-button>
    </div>

    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        ref="multipleTable"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="goodsName" label="名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="businessName" label="行业"></el-table-column>
        <el-table-column prop="categoryName" label="分类"></el-table-column>
        <el-table-column prop="stock" label="库存"></el-table-column>
        <el-table-column prop="dctRate" label="折扣">
          <template slot-scope="scope">
            <span>{{scope.row.dctRate/10}}折</span>
          </template>
        </el-table-column>
        <el-table-column prop="cashBackAmount" label="返现金额">
          <template slot-scope="scope">
            <span>{{scope.row.cashBackAmount}}元</span>
          </template>
        </el-table-column>
        <el-table-column prop="orgPrice" label="原价">
          <template slot-scope="scope">
            <span>{{scope.row.orgPrice}}元</span>
          </template>
        </el-table-column>
        <el-table-column label="平台价">
          <template slot-scope="scope">
            <span>{{scope.row.orgPrice*scope.row.dctRate/100}}元</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodsImage" label="头图">
          <template slot-scope="scope">
            <img :src="scope.row.goodsImage" width="40" height="40" class="head_pic" />
          </template>
        </el-table-column>
        <el-table-column prop="grabbedNumber" label="以抢数量">
          <template slot-scope="scope">
            <span
              @click="openChangeCount(scope.row.id,scope.row.grabbedNumber)"
              style="color:red;cursor: pointer;"
            >{{scope.row.grabbedNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="adWeights" label="广告值">
          <template slot-scope="scope">
            <span
              @click="openAD(scope.row.id,scope.row.adWeights)"
              style="color:red;cursor: pointer;"
            >{{scope.row.adWeights}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="interactCount" label="评价数量"></el-table-column>
        <el-table-column prop="goodInteractRate" label="好评率">
          <template slot-scope="scope">
            <span>{{scope.row.goodInteractRate}}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="所属商家" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <span
              style="color: #169BD5;cursor: pointer;"
              @click="EWCodedownLoad(scope.row.id,scope.row.goodsName)"
            >二维码</span>
            <span style="color: #169BD5;cursor: pointer;" @click="check(scope.$index, scope.row)">查看</span>
            <span
              v-if="scope.row.issueStatus == 1"
              style="color: #169BD5;cursor: pointer;"
              @click="changeStatus(scope.$index, scope.row)"
            >下架</span>
            <span
              v-if="scope.row.issueStatus == 2"
              style="color:#67C23A;cursor: pointer;"
              @click="changeStatus(scope.$index, scope.row)"
            >上架</span>
            <span
              v-if="scope.row.issueStatus == 2"
              style="color:#F56C6C;cursor: pointer;"
              @click="deletedOne(scope.$index, scope.row)"
            >删除</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="totalNum">总计：{{pageTotal}}条</div>
      <div class="order-bottom" v-if="tableData.length>0">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="pageTotal"
          :page-size="10"
          :current-page="currentPage"
          @current-change="pageChange($event)"
        ></el-pagination>
      </div>
    </div>

    <!-- 广告值弹窗组件 -->
    <adValuePop ref="ad"></adValuePop>

    <!-- 修改以抢数量弹窗 -->
    <changeCountPop ref="changeCount"></changeCountPop>

    <!-- 二维码弹窗 -->
    <EWCode ref="code"></EWCode>
  </div>
</template>

<script>
import {
  merchantGoodsList,
  getMerchantBusinessList,
  getGoodsClassRequest,
  updateGoodsIssueStatus,
  deleteGoods
} from "@/network/api";
import adValuePop from "./common/adValuePop";
import changeCountPop from "./common/changeCountPop";
import EWCode from "./common/EWCodeDownLoad";
export default {
  props: {},
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageTotal: "",
      goodsName: null, // 商品名称
      businessName: null, // 所属商家
      Category: [], // 分类行业
      valueCategory: "", // 已选行业分类ID
      defaultParams: {
        label: "name",
        value: "id",
        children: "nextLevelData"
      },
      options_class: [],
      selectedGoodsId: "全部", // 已选商品分类ID
      showGoodsClass: true,
      multipleSelection: [] // checkbox 选中数据
    };
  },
  components: {
    adValuePop,
    changeCountPop,
    EWCode
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.search(1);
    this.getMerchantBusinessList();
    this.getGoodsCategory();
  },
  methods: {
    // 获取商家商品列表
    getMerchantGoodsList(data) {
      let param = { ...data };
      merchantGoodsList({ params: param }).then(res => {
        if (res.data.content) {
          this.tableData = res.data.content.items;
          this.pageTotal = res.data.content.totalSize;
        } else {
          this.tableData = [];
          this.pageTotal = 0;
        }
      });
    },

    // 翻页
    pageChange(val) {
      this.search(val);
      this.currentPage = val;
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

    // 获取商品分类
    getGoodsCategory() {
      getGoodsClassRequest().then(res => {
        let content = res.data.content;
        let data = {
          id: "全部",
          name: "全部",
          nextLevelData: []
        };
        content.splice(0, 0, data);
        this.options_class = this.getTreeData(content);
      });
    },

    // 递归方法
    getTreeData(data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].nextLevelData.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].nextLevelData = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].nextLevelData);
        }
      }
      return data;
    },
    // 切换商品状态
    handleChangeGoods(value) {},
    // 勾选checkbox
    handleSelectionChange(rows) {
      this.multipleSelection = rows;
    },

    // 切换行业分类
    handleChangeCategory(val) {
      if (val === 11) {
        this.showGoodsClass = false;
        this.selectedGoodsId = "";
      } else {
        this.showGoodsClass = true;
      }
    },
    // 搜索
    search(val) {
      let obj = {};
      obj.pageNumber = val;
      obj.pageSize = 10;
      obj.goodsName = this.goodsName == "" ? null : this.goodsName;
      obj.merchantName = this.businessName;
      obj.businessId = this.valueCategory;
      obj.categoryId =
        this.selectedGoodsId == "全部"
          ? ""
          : this.selectedGoodsId[this.selectedGoodsId.length - 1];
      this.getMerchantGoodsList(obj);
      this.currentPage = 1;
    },

    // 打开广告弹窗
    openAD(id, adWeights) {
      this.$refs.ad.open(id, adWeights);
    },

    // 打开改变以抢数量弹窗
    openChangeCount(id, adWeights) {
      this.$refs.changeCount.open(id, adWeights);
    },

    // 添加
    add() {
      this.$router.push({
        path: "/addGoods",
        query: {
          type: 1
        }
      });
    },

    // 批量删除
    deletedCheckbox() {
      let multipleSelection = this.multipleSelection;
      if (multipleSelection.length == 0) {
        this.$message.error("请选择要删除的商品");
        return;
      }
      let ids = [];
      multipleSelection.forEach(item => {
        ids.push(item.id);
      });
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          let param = {
            ids: ids
          };
          deleteGoods(param).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.search(1);
              this.$message.success("删除成功!");
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },

    // 查看
    check(index, row) {
      this.$router.push({
        path: "/addGoods",
        query: {
          type: 2,
          id: row.id
        }
      });
    },

    // 更改商品状态
    changeStatus(index, row) {
      let message = row.issueStatus == 1 ? "确认下架吗" : "确认上架吗";
      let parms = {
        goodsId: Number(row.id),
        issueStatus: row.issueStatus == 1 ? 2 : 1
      };
      this.$confirm(message, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          updateGoodsIssueStatus(this.qs.stringify(parms)).then(res => {
            let type, message;
            if (res.data.messageCode == "MSG_4001") {
              type = "warning";
              message = "商品库存不足，请先添加库存!";
            } else if (res.data.messageCode == "MSG_1001") {
              type = "success";
              message = "处理成功";
              this.search(1);
            } else {
              type = "warning";
              message = res.data.message;
            }
            this.$message({
              type: type,
              message: message
            });
          });
        })
        .catch(() => {});
    },
    // 删除单个商品
    deletedOne(index, row) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          let parms = {
            goodsId: Number(row.id),
            issueStatus: 3
          };
          updateGoodsIssueStatus(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("删除成功");
              this.search(1);
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },

    // 二维码下载
    EWCodedownLoad(id, name) {
      console.log(id, name);
      this.$refs.code.open(id, name);
    }
  }
};
</script>

<style scoped lang="less">
.inline_box {
  display: inline-block;
  margin-right: 15px;
  margin-bottom: 15px;
  .inp {
    width: 180px;
  }
}
.order-bottom {
  width: 100%;
  text-align: center;
  margin-top: 30px;
}
.totalNum {
  margin-top: 20px;
  font-size: 14px;
}
</style>
