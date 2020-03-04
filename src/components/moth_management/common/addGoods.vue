<template>
  <div>
    <el-dialog title="选择商品(已被添加为活动的商品不可选，活动结束后才可选)" :visible.sync="DialogVisible" width="880px">
      <div>
        <div class="top">
          <span>商品状态:</span>
          <el-select v-model="issueStatus" style="width:100px;margin-right:10px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span>商品分类:</span>
          <el-cascader
            v-model="selectedOptions_class"
            @change="handleChangeClass"
            :options="options_class"
            :props="defaultParams"
            style="width:160px"
          ></el-cascader>
          <el-input
            style="width:250px;margin:0 15px"
            v-model="goodsName"
            clearable
            placeholder="请输入商品名称"
          ></el-input>
          <el-button type="primary" @click="search(1)">搜 索</el-button>
        </div>

        <el-table
          :data="tableData"
          border
          ref="table"
          style="width: 100%;margin-bottom:10px"
          @selection-change="handleSelectionChange"
        >
          >
          <el-table-column type="selection" width="55" :selectable="forbidSelect"></el-table-column>
          <el-table-column prop="id" label="商品编号"></el-table-column>
          <el-table-column prop="name" label="商品名称"></el-table-column>
          <el-table-column prop="orgPrice" label="原价"></el-table-column>
          <el-table-column prop="dctPrice" label="成本价"></el-table-column>
          <el-table-column prop="issueStatus" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.issueStatus == 1">已上架</span>
              <span v-if="scope.row.issueStatus == 2">未上架</span>
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="库存"></el-table-column>
        </el-table>

        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :total="pageTotal"
          :page-size="10"
          :current-page="currentPage"
          @current-change="pageChange($event)"
        ></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="choose">确认添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGoodsClassRequest,
  platGoodsList,
  queryPlatAndMerchantGoodsList
} from "@/network/api";
export default {
  props: {},
  data() {
    return {
      parentIndex: "",
      DialogVisible: false,
      tableData: [],
      currentPage: 1,
      pageTotal: 0,
      defaultParams: {
        label: "name",
        value: "id",
        children: "nextLevelData",
        checkStrictly: true
      },
      options_class: [
        {
          id: "",
          name: "全部"
        }
      ],
      selectedOptions_class: [],
      goodsName: "",
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 1,
          label: "已上架"
        },
        {
          value: 2,
          label: "未上架"
        }
      ],
      issueStatus: "",
      multipleSelectionAll: [], //所有选中的数据包含跨页数据
      multipleSelection: [], // 当前页选中的数据
      idKey: "id" // 标识列表数据中每一行的唯一键的名称
    };
  },
  components: {},
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getGoodsCategory();
  },
  methods: {
    open(index, goodsArr) {
      // goodsArr：父组件带过来的所有商品数据，子组件默认选中，避免重复选择商品
      this.multipleSelectionAll = goodsArr;
      this.search(1);
      this.parentIndex = index;
    },

    // 获取商品分类
    getGoodsCategory() {
      getGoodsClassRequest().then(res => {
        this.options_class = this.options_class.concat(
          this.getTreeData(res.data.content)
        );
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
    // 获取商品列表
    getplatGoodsList(param) {
      queryPlatAndMerchantGoodsList({ params: param }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          if (res.data.content) {
            this.tableData = res.data.content.items;
            this.pageTotal = res.data.content.totalSize;
            setTimeout(() => {
              this.setSelectRow();
            }, 20);
            this.DialogVisible = true;
          } else {
            this.tableData = [];
            this.pageTotal = 0;
          }
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
    // 确认添加
    choose() {
      if (this.multipleSelectionAll.length == 0) {
        this.$message.error("请选择要添加的商品");
        return;
      }
      // 去除父组件带过来的商品数据
      for (let i = 0; i < this.multipleSelectionAll.length; i++) {
        if (!this.multipleSelectionAll[i].name) {
          this.multipleSelectionAll.splice(i, 1);
          i--;
        }
      }
      this.$emit("getgoods", this.multipleSelectionAll, this.parentIndex);
      this.DialogVisible = false;
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
      this.currentPage = val;
      this.changePageCoreRecordData();
      this.search(val);
    },
    search(val) {
      let obj = {};
      obj.pageNumber = val;
      obj.pageSize = 10;
      obj.goodsName = this.goodsName;
      obj.categoryId =
        this.selectedOptions_class == ""
          ? ""
          : this.selectedOptions_class[this.selectedOptions_class.length - 1];
      obj.issueStatus = this.issueStatus;
      this.getplatGoodsList(obj);
      this.currentPage = val;
    }
  }
};
</script>

<style scoped lang="less">
.top {
  margin-bottom: 20px;
}
.none {
  text-align: center;
  color: #cccccc;
  font-size: 20px;
  height: 200px;
  line-height: 200px;
}
</style>
