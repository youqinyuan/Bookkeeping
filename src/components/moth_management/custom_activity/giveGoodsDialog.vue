<template>
  <div class="addGoodsDialog">
    <el-dialog
      title="选择赠送商品"
      :visible.sync="dialogVisible"
      width="850px"
      :close-on-click-modal="false"
    >
      <div class="searchBox">
        <el-input v-model="goodsName" style="width:300px;" placeholder="输入商品名称"></el-input>
        <el-button type="primary" @click="getGoods(1)">搜索</el-button>
      </div>
      <div class="brandBox">
        <el-table
          :data="tableData"
          border
          ref="table"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" :selectable="forbidSelect"></el-table-column>
          <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="orgPrice" label="原价" align="center" width="110"></el-table-column>
          <el-table-column prop="specDesc" label="规格" align="center"></el-table-column>
          <el-table-column prop="stock" label="库存" align="center" width="100"></el-table-column>
        </el-table>
      </div>
      <div style="width:100%;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <span style="font-weight:bold;margin-right:20px;">已选择{{multipleSelectionAll.length}}个商品</span>
          <el-button
            type="primary"
            style="margin-top:20px;"
            @click="queryPlatAndMerchantGoodsList"
          >确定选择</el-button>
        </div>
        <div>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalSize"
            :current-page.sync="pageNumber"
            page-size.sync="10"
            @current-change="pageChange($event)"
          ></el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { queryPlatAndMerchantGoodsStockList } from "@/network/api";
export default {
  data() {
    return {
      dialogVisible: false,
      goodsName: "",
      pageNumber: 1,
      totalSize: 0,
      tableData: [],
      multipleSelectionAll: [], //所有选中的数据包含跨页数据
      multipleSelection: [], // 当前页选中的数据
      idKey: "id" // 标识列表数据中每一行的唯一键的名称
    };
  },
  methods: {
    open(data) {
      // data：父组件带过来的所有商品数据，子组件默认选中，避免重复选择商品
      this.multipleSelectionAll = data;
      this.getGoods();
    },
    // 获取商品
    getGoods() {
      let parms = {
        pageNumber: this.pageNumber,
        pageSize: 10,
        goodsName: this.goodsName,
        issueStatus: 1
      };
      queryPlatAndMerchantGoodsStockList({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.totalSize = content.totalSize;
          this.tableData = content.items;
          setTimeout(() => {
            this.setSelectRow();
          }, 20);
          this.dialogVisible = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 表格多选框点击事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
      //实时记录选中的数据
      setTimeout(() => {
        this.changePageCoreRecordData();
      }, 20);
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
      // this.tableData.forEach(row => {
      //   if (row.activityId == 2) {
      //     selectAllIds.push(row[idKey]);
      //   }
      // });
      this.$refs.table.clearSelection();
      for (var i = 0; i < this.tableData.length; i++) {
        if (selectAllIds.indexOf(this.tableData[i][idKey]) >= 0) {
          // 设置选中，记住table组件需要使用ref="table"
          this.$refs.table.toggleRowSelection(this.tableData[i], true);
        }
      }
    },
    // 记忆选择方法（核心部分）
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
    // 确定选择
    queryPlatAndMerchantGoodsList() {
      if (this.multipleSelectionAll.length == 0) {
        this.$message.error("请选择要添加的商品");
        return;
      }
      // 去除父组件带过来的商品数据
      for (let i = 0; i < this.multipleSelectionAll.length; i++) {
        if (!this.multipleSelectionAll[i].goodsId) {
          this.multipleSelectionAll.splice(i, 1);
          i--;
        }
      }
      this.$emit("func", this.multipleSelectionAll);
      this.dialogVisible = false;
      this.multipleSelectionAll = [];
      this.tableData = [];
    },
    // 已被添加为活动的商品禁止选择
    forbidSelect(row) {
      if (row.activityId == 2) {
        return false;
      } else {
        return true;
      }
    },
    // 翻页
    pageChange(val) {
      this.pageNumber = val;
      this.getGoods();
    }
  }
};
</script>
<style lang="less" scoped>
.brandBox {
  width: 100%;
  margin-top: 10px;
}
</style>