<template>
  <div class="supportList">
    <div class="searchBox">
      <span>商品名称：</span>
      <el-input v-model="goodsName" style="width:180px;"></el-input>
      <span style="margin-left:10px;">分类：</span>
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
      <el-select v-model="status" style="width:160px;">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button type="primary" style="margin-left:10px;" @click="search(1)">搜索</el-button>
      <el-button type="success" @click="addProduct">添加商品</el-button>
    </div>
    <div class="tableBox">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="goodsName" align="center" label="商品名称"></el-table-column>
        <el-table-column prop="goodsCategoryName" align="center" label="分类"></el-table-column>
        <el-table-column prop="stock" align="center" label="商品库存"></el-table-column>
        <el-table-column prop="orderNumber" align="center" label="排序值"></el-table-column>
        <el-table-column prop="sendUserCount" align="center" label="赞助发起人数"></el-table-column>
        <el-table-column prop="completeUserCount" align="center" label="赞助完成人数"></el-table-column>
        <el-table-column prop="invalidUserCount" align="center" label="赞助失效人数"></el-table-column>
        <el-table-column prop="sendOrderUserCount" align="center" label="赞助中下单人数"></el-table-column>
        <el-table-column prop="completeOrderUserCount" align="center" label="赞助完成下单人数"></el-table-column>
        <el-table-column prop="completeNoOrderUserCount" align="center" label="赞助完成未下单人数"></el-table-column>
        <el-table-column prop="issueStatus" align="center" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.issueStatus == 1">活动中上架</span>
            <span v-if="scope.row.issueStatus == 2">活动中下架</span>
            <span v-if="scope.row.issueStatus == 3">删除</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" align="center" label="操作" width="140">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="scope.row.issueStatus == 2"
              @click="upperOrLower(scope.row.id,1)"
            >上架</el-button>
            <el-button
              type="text"
              v-if="scope.row.issueStatus == 1"
              @click="upperOrLower(scope.row.id,2)"
            >下架</el-button>
            <el-button
              type="text"
              v-if="scope.row.issueStatus == 1"
              @click="setSortNum(scope.row.id)"
            >设置排序值</el-button>
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
        :current-page="currentPage"
        :page-size="10"
        @current-change="pageChange($event)"
      ></el-pagination>
    </div>
    <!-- 添加商品弹窗 -->
    <selectProduct ref="chooseGoods" @getgoods="getgoods(arguments)"></selectProduct>
  </div>
</template>
<script>
import selectProduct from "../freeBuyPage/selectProduct";
import {
  getGoodsClassRequest,
  queryPageListSupport,
  addSupport,
  updateIssueStatusSupport,
  updateOrderNumberSupport
} from "@/network/api";
export default {
  data() {
    return {
      goodsName: "",
      totalSize: 0,
      currentPage: 0,
      type: "", // 分类
      type2: "", // 二级分类
      options_type1: [], //一级分类
      options_type2: [], //二级分类
      goodsCategoryId: "", // 商品分类ID
      tableData: [],
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
        },
        {
          value: "3",
          label: "删除"
        }
      ],
      status: "" // 状态
    };
  },
  components: {
    selectProduct
  },
  created() {
    this.search(1);
    this.getGoodsCategory();
  },
  methods: {
    // 搜索
    search(val) {
      let parms = {
        pageNumber: val,
        pageSize: 10,
        goodsName: this.goodsName,
        goodsCategoryId: this.goodsCategoryId,
        issueStatus: this.status
      };
      queryPageListSupport({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.tableData = res.data.content.items;
          this.totalSize = res.data.content.totalSize;
          this.currentPage = val;
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
      // 如果1级分类下面存在二级分类，默认选中二级分类的第一个
      // 否则选中当前点击的1级分类
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
    addProduct() {
      this.$refs.chooseGoods.open();
    },
    // 接收子组件传递过来的值
    getgoods(argument) {
      let checkedData = argument[0];
      let data = {
        goodsIdList: argument[0]
      };
      addSupport(data).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.search(1);
          this.$message.success("添加成功");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 上架或者下架
    upperOrLower(id, issueStatus) {
      let params = {
        id: id,
        issueStatus: issueStatus
      };
      updateIssueStatusSupport(this.qs.stringify(params)).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.search(1);
          this.$message.success("操作成功");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 设置排序值
    setSortNum(id) {
      this.$prompt("设置排序值", "", {
        confirmButtonText: "保存",
        closeOnClickModal: false,
        showCancelButton: false,
        center: true,
        inputPattern: /^[+]{0,1}(\d+)$/,
        inputErrorMessage: "格式不正确"
      })
        .then(({ value }) => {
          if (value > 100000) {
            this.$message.error("排序值最大可设置为100000");
            return;
          }
          let params = {
            id: id,
            orderNumber: value
          };
          updateOrderNumberSupport(this.qs.stringify(params)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.search(1);
              this.$message.success("修改成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 分页事件
    pageChange(val) {
      this.search(val);
    }
  }
};
</script>
<style lang="less" scoped>
.tableBox {
  margin-top: 20px;
}
.totalBox {
  width: 100%;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>