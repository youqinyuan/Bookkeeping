<template>
  <div class="addGoodsDialog">
    <el-dialog
      title="添加商品"
      :visible.sync="dialogVisible"
      width="850px"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="选择分类" name="first">
          <div class="brandBox">
            <el-collapse accordion>
              <el-checkbox-group v-model="selectData">
                <el-collapse-item v-for="(item,index) in categoryData" :key="index">
                  <template slot="title">
                    <el-checkbox :label="item.id">{{item.name}}</el-checkbox>
                  </template>
                  <div style="margin:10px;" v-for="(ite,idx) in item.nextLevelData" :key="idx">
                    <el-checkbox :label="ite.id">{{ite.name}}</el-checkbox>
                  </div>
                </el-collapse-item>
              </el-checkbox-group>
            </el-collapse>
          </div>
        </el-tab-pane>
        <el-tab-pane label="选择品牌" name="second">
          <div class="searchBox">
            <el-input v-model="brandName" placeholder="请输入品牌名称" style="width:240px;"></el-input>
            <el-button type="primary" @click="getGoodsBrand">搜索</el-button>
          </div>
          <div class="brandBox">
            <el-checkbox-group v-model="selectData">
              <el-checkbox
                v-for="(item,index) in brandData"
                :key="index"
                :label="item.id"
                style="display:block;margin-top:10px;"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-tab-pane>
        <el-tab-pane label="选择商品" name="third">
          <div class="searchBox">
            <span>商品名称：</span>
            <el-input v-model="goodsName" style="width:240px;"></el-input>
            <span>商品分类：</span>
            <el-cascader
              expand-trigger="hover"
              :options="options_class"
              :props="defaultParams"
              v-model="selectedOptions_class"
              style="width:160px;"
            ></el-cascader>
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
              <el-table-column prop="id" label="商品编号" align="center"></el-table-column>
              <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
              <el-table-column prop="orgPrice" label="原价" align="center"></el-table-column>
              <el-table-column prop="stock" label="库存" align="center"></el-table-column>
              <el-table-column prop="freeBuyMode" label="返现类型" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.freeBuyMode == 1">按月返</span>
                  <span v-if="scope.row.freeBuyMode == 2">按天返</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div style="width:100%;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <span
            style="font-weight:bold;margin-right:20px;"
            v-if="activeName == 'third'"
          >已选择{{multipleSelectionAll.length}}个商品</span>
          <el-button
            type="primary"
            style="margin-top:20px;"
            @click="queryPlatAndMerchantGoodsList"
          >确定选择</el-button>
        </div>
        <div v-if="activeName == 'third'">
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
import {
  getGoodsClassRequest,
  queryPlatAndMerchantGoodsList
} from "@/network/api";
export default {
  data() {
    return {
      dialogVisible: false,
      activeName: "first",
      name: "",
      categoryData: [], //分类列表
      brandName: "", //品牌名称
      brandData: [], // 品牌列表
      selectData: [], // 选择的类型/品牌id集合
      defaultParams: {
        label: "name",
        value: "id",
        children: "nextLevelData"
      },
      options_class: [
        {
          id: "全部",
          name: "全部"
        }
      ],
      selectedOptions_class: "全部",
      goodsName: "",
      pageNumber: 1,
      totalSize: 0,
      tableData: [],
      multipleSelectionAll: [], //所有选中的数据包含跨页数据
      multipleSelection: [], // 当前页选中的数据
      idKey: "id", // 标识列表数据中每一行的唯一键的名称
      parentIndex: ""
    };
  },
  methods: {
    open(index, data) {
      // data：父组件带过来的所有商品数据，子组件默认选中，避免重复选择商品
      this.multipleSelectionAll = data;
      console.log(this.multipleSelectionAll);
      this.getGoodsType();
      this.parentIndex = index;
    },
    // tabs切换事件
    handleClick(tab, event) {
      let name = tab.name;
      this.selectData = [];
      switch (name) {
        case "first":
          this.getGoodsType();
          break;
        case "second":
          this.getGoodsBrand();
          break;
        case "third":
          this.selectedOptions_class = "";
          this.getGoods(1);
          break;
      }
    },
    // 获取商品分类
    getGoodsType() {
      let parms = {
        type: 1
      };
      getGoodsClassRequest({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.categoryData = content;
          this.options_class = this.options_class.concat(
            this.getTreeData(content)
          );
          this.dialogVisible = true;
        } else {
          this.$message.error(res.data.message);
        }
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
    // 获取商品品牌
    getGoodsBrand() {
      let parms = {
        type: 2,
        name: this.brandName
      };
      getGoodsClassRequest({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.brandData = res.data.content;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取商品
    getGoods(val) {
      let parms = {
        pageNumber: val,
        pageSize: 10,
        issueStatus: 1,
        freeBuyMode: 1,
        excludeActivity: 1,
        goodsName: this.goodsName,
        categoryId:
          this.selectedOptions_class == "全部"
            ? ""
            : this.selectedOptions_class[this.selectedOptions_class.length - 1]
      };
      queryPlatAndMerchantGoodsList({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.totalSize = content.totalSize;
          this.tableData = content.items;
          setTimeout(() => {
            this.setSelectRow();
          }, 20);
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
      this.selectAllIds = [];
      let that = this;
      this.multipleSelectionAll.forEach(row => {
        this.selectAllIds.push(row[idKey]);
      });
      // this.tableData.forEach(row => {
      //   if (row.activityId == 2) {
      //     selectAllIds.push(row[idKey]);
      //   }
      // });
      this.$refs.table.clearSelection();
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.selectAllIds.indexOf(this.tableData[i][idKey]) >= 0) {
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
      console.log(this.multipleSelectionAll);
      if (this.activeName == "first" || this.activeName == "second") {
        let parms = {
          issueStatus: 1,
          freeBuyMode: 1,
          excludeActivity: 1
        };
        if (this.activeName == "first") {
          // 选择分类
          parms.categoryIds = this.selectData.join(",");
        } else {
          // 选择品牌
          parms.brandIds = this.selectData.join(",");
        }
        queryPlatAndMerchantGoodsList({ params: parms }).then(res => {
          if (res.data.messageCode == "MSG_1001") {
            let content = res.data.content.items;
            // 已经添加过的商品不再重复添加
            let arr = [];
            this.multipleSelectionAll.forEach(val => {
              arr.push(val.goodsId);
            });
            content.forEach(val => {
              if (arr.indexOf(val.id) == -1) {
                this.multipleSelectionAll.push(val);
              }
            });
            // 去除父组件带过来的商品数据
            for (let i = 0; i < this.multipleSelectionAll.length; i++) {
              if (!this.multipleSelectionAll[i].name) {
                this.multipleSelectionAll.splice(i, 1);
                i--;
              }
            }
            this.$emit("func", this.multipleSelectionAll, this.parentIndex);
            this.dialogVisible = false;
            this.multipleSelectionAll = [];
            this.tableData = [];
            this.activeName = "first";
          } else {
            this.$message.error(res.data.message);
          }
        });
      } else {
        // 选择商品
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
        this.$emit("func", this.multipleSelectionAll, this.parentIndex);
        this.dialogVisible = false;
        this.multipleSelectionAll = [];
        this.tableData = [];
        this.activeName = "first";
      }
    },
    // 已被添加为活动的商品禁止选择
    forbidSelect(row) {
      if (!this.selectAllIds || this.selectAllIds.length == 0) {
        return true;
      }
      // 标识当前行的唯一键的名称
      let idKey = this.idKey;
      if (this.selectAllIds.indexOf(row[idKey]) >= 0) {
        return false;
      } else {
        return true;
      }
    },
    // 翻页
    pageChange(val) {
      this.pageNumber = val;
      this.getGoods(val);
    }
  }
};
</script>
<style lang="less" scoped>
.brandBox {
  width: 100%;
  height: 420px;
  overflow-y: auto;
  margin-top: 10px;
}
</style>