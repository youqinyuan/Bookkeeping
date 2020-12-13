<template>
  <div class="slef_content">
    <div class="inline_box">
      <span>商品名称:</span>
      <el-input class="inp" v-model="name" placeholder="输入商品名称"></el-input>
    </div>

    <div class="inline_box">
      <span>分类:</span>
      <el-cascader
        expand-trigger="hover"
        :options="options_class"
        :props="defaultParams"
        v-model="selectedOptions_class"
        @change="handleChangeClass"
      ></el-cascader>
    </div>

    <div class="inline_box">
      <span>状态:</span>
      <el-select v-model="value" placeholder="请选择" @change="handleChangeStatus">
        <el-option
          v-for="item in options_status"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>

    <div class="inline_box">
      <span>库存低于:</span>
      <el-input class="inp" value="number" maxlength="4" v-model="LowerCount" placeholder="例：10"></el-input>
    </div>

    <div class="inline_box">
      <el-button type="primary" @click="search(1)">搜索</el-button>
      <el-button type="success" @click="add">添加</el-button>
      <el-button
        @click="setPlatTag"
        style="background-color: rgba(0, 204, 255, 1);color:white"
      >设置自营标签</el-button>
      <el-button type="danger" @click="deletedCheckbox">删除</el-button>
    </div>

    <div class="table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="编号">
          <template slot-scope="scope">
            <span v-if="scope.row.goodsTagId === 1" class="slef">自营</span>
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="categoryName" label="分类"></el-table-column>
        <el-table-column prop="stock" label="库存">
          <template slot-scope="scope">
            <span v-if="scope.row.stock<=10" style="color:red">{{scope.row.stock}}</span>
            <span v-else>{{scope.row.stock}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orgPrice" label="原价">
          <template slot-scope="scope">
            <span>{{scope.row.orgPrice}}元</span>
          </template>
        </el-table-column>
        <el-table-column prop="dctRate" label="折扣">
          <template slot-scope="scope">
            <span>{{scope.row.dctRate/10}}折</span>
          </template>
        </el-table-column>
        <el-table-column prop="dctPrice" label="成本价">
          <template slot-scope="scope">
            <span>{{scope.row.dctPrice}}元</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodsImage" label="头图">
          <template slot-scope="scope">
            <img :src="scope.row.goodsImage" width="40" height="40" class="head_pic" />
          </template>
        </el-table-column>
        <el-table-column prop="grabbedNumber" label="以抢数量">
          <template slot-scope="scope">
            <span>{{scope.row.sales}}</span>+
            <span style="color:red">{{scope.row.adWeights}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="interactCount" label="评价数量">
          <template slot-scope="scope">
            <span>{{scope.row.interactCount == null? 0 : scope.row.interactCount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodInteractRate" label="好评率">
          <template slot-scope="scope">
            <span>{{scope.row.goodInteractRate}}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="issueStatus" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.issueStatus == 1">上架</span>
            <span v-if="scope.row.issueStatus == 2">下架</span>
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
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <span
              style="color: #169BD5;cursor: pointer;"
              @click="EWCodedownLoad(scope.row.id,scope.row.name)"
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
              style="color: #F56C6C;cursor: pointer;"
              @click="deletedOne(scope.$index, scope.row)"
            >删除</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="totalNum">总计：{{pageTotal}}条</div>
      <div class="order-bottom" v-if="tableData.length>0">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :total="pageTotal"
          :page-size="10"
          :current-page="currentPage"
          @current-change="pageChange($event)"
        ></el-pagination>
      </div>
    </div>

    <!-- 广告值弹窗组件 -->
    <adValuePop ref="ad"></adValuePop>

    <!-- 二维码下载弹窗 -->
    <EWCode ref="code"></EWCode>
  </div>
</template>

<script>
import {
  platGoodsList,
  getGoodsClassRequest,
  updateGoodsIssueStatus,
  addPlatTag,
  deleteGoods
} from "@/network/api";
import adValuePop from "./common/adValuePop";
import EWCode from "./common/EWCodeDownLoad";
export default {
  data() {
    return {
      name: "",
      defaultParams: {
        label: "name",
        value: "id",
        children: "nextLevelData"
      },
      options_class: [],
      selectedOptions_class: "全部",
      options_status: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "上架"
        },
        {
          value: "2",
          label: "未上架"
        }
      ],
      value: "全部",
      LowerCount: "",
      tableData: [],
      pageTotal: "",
      currentPage: 1,
      multipleSelection: [],
      multipleSelectionAll: [],
      idKey: "id"
    };
  },
  components: {
    adValuePop,
    EWCode
  },
  computed: {},
  watch: {},
  // 路由进入时 判断是否从详情页返回
  beforeRouteEnter(to, from, next) {
    if (from.path === "/addGoods") {
      // 查看是否记录了页面
      let page = sessionStorage.getItem("page");
      page = page ? JSON.parse(page) : 1;
      let name = sessionStorage.getItem("name");
      let value = sessionStorage.getItem("value");
      let LowerCount = sessionStorage.getItem("LowerCount");
      let selectedOptions_class = JSON.parse(
        sessionStorage.getItem("selectedOptions_class")
      );
      next(vm => {
        vm.name = name ? name : "";
        vm.value = value ? value : "";
        vm.LowerCount = LowerCount ? LowerCount : "";
        vm.selectedOptions_class = selectedOptions_class
          ? selectedOptions_class
          : "全部";
        vm.search(page);
      });
    } else {
      next(vm => {
        vm.search(1);
      });
    }
  },
  created() {},
  mounted() {
    this.getGoodsCategory();
  },
  methods: {
    // 获取自营商品管理列表
    getplatGoodsList(data) {
      let param = { ...data };
      platGoodsList({ params: param }).then(res => {
        if (res.data.content) {
          this.tableData = res.data.content.items;
          this.pageTotal = res.data.content.totalSize;
          setTimeout(() => {
            this.setSelectRow();
          }, 50);
        } else {
          this.tableData = [];
          this.pageTotal = 0;
        }
      });
    },
    unique3(arr) {
      var result = [];
      var obj = {};
      for (var i = 0; i < arr.length; i++) {
        if (!obj[arr[i].id]) {
          result.push(arr[i]);
        }
      }
      return result;
    },
    // 翻页
    pageChange(val) {
      this.search(val);
      this.currentPage = val;
    },
    // 设置选中的方法
    setSelectRow() {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return;
      }
      // 标识当前行的唯一键的名称
      let idKey = this.idKey;
      let selectAllIds = [];
      let that = this;
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      this.$refs.multipleTable.clearSelection();
      for (var i = 0; i < this.tableData.length; i++) {
        if (selectAllIds.indexOf(this.tableData[i][idKey]) >= 0) {
          // 设置选中，记住table组件需要使用ref="table"
          this.$refs.multipleTable.toggleRowSelection(this.tableData[i], true);
        }
      }
    },
    // 记忆选择核心方法
    changePageCoreRecordData() {
      // 标识当前行的唯一键的名称
      let idKey = this.idKey;
      let that = this;
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.multipleSelectionAll.length <= 0) {
        this.multipleSelectionAll = this.multipleSelection;
        return;
      }
      // 总选择里面的key集合
      let selectAllIds = [];
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      let selectIds = [];
      // 获取当前页选中的id
      this.multipleSelection.forEach(row => {
        selectIds.push(row[idKey]);
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          that.multipleSelectionAll.push(row);
        }
      });
      let noSelectIds = [];
      // 得到当前页没有选中的id
      this.tableData.forEach(row => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey]);
        }
      });
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < that.multipleSelectionAll.length; i++) {
            if (that.multipleSelectionAll[i][idKey] == id) {
              // 如果总选择中有未被选中的，那么就删除这条
              that.multipleSelectionAll.splice(i, 1);
              break;
            }
          }
        }
      });
    },
    // 勾选chebox
    handleSelectionChange(rows) {
      this.multipleSelection = rows;
      setTimeout(() => {
        this.changePageCoreRecordData();
      }, 50);
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
    // 切换分类
    handleChangeClass(value) {},
    // 切换状态
    handleChangeStatus(value) {},
    // 搜索
    search(val) {
      let obj = {};
      obj.pageNumber = val;
      obj.pageSize = 10;
      obj.goodsName = this.name;
      obj.categoryId =
        this.selectedOptions_class == "全部"
          ? ""
          : this.selectedOptions_class[this.selectedOptions_class.length - 1];
      obj.issueStatus = this.value == "全部" ? "" : this.value;
      obj.stock = this.LowerCount;
      this.getplatGoodsList(obj);
      this.currentPage = val;
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
      sessionStorage.setItem("page", JSON.stringify(this.currentPage));
      sessionStorage.setItem("name", this.name);
      sessionStorage.setItem("value", this.value);
      sessionStorage.setItem("LowerCount", this.LowerCount);
      sessionStorage.setItem(
        "selectedOptions_class",
        JSON.stringify(this.selectedOptions_class)
      );
    },
    // 设置自营标签
    setPlatTag() {
      if (this.multipleSelectionAll.length < 1) {
        this.$message({
          type: "warning",
          message: "还未勾选商品"
        });
      } else {
        let arr = [];
        this.multipleSelectionAll.forEach(item => {
          arr.push(item.id);
        });
        addPlatTag(arr).then(res => {
          if (res.data.messageCode == "MSG_1001") {
            this.search(1);
            // 清空搜索勾选的数据
            this.multipleSelection = [];
            this.$refs.multipleTable.clearSelection();
            this.$message({
              type: "success",
              message: res.data.message
            });
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
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

    // 打开广告弹窗
    openAD(id, adWeights) {
      this.$refs.ad.open(id, adWeights);
    },

    // 二维码下载
    EWCodedownLoad(id, name) {
      this.$refs.code.open(id, name);
    }
  }
};
</script>

<style scoped lang="less">
.slef_content {
  padding: 30px;
  box-sizing: border-box;
  .slef {
    color: red;
    width: 18px;
    text-align: center;
    display: inline-block;
    background: green;
    color: white;
  }
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
}
</style>
