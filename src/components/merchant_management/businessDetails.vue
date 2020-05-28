<template>
  <div class="contents">
    <div class="title">
      <strong>基本信息:</strong>
    </div>
    <div class="con">
      <ul>
        <li>申请编号：{{content.id}}</li>
        <li>姓名：{{content.name}}</li>
        <li>联系方式：{{content.mobileNumber}}</li>
        <li>店铺名称：{{content.storeName}}</li>
      </ul>
      <ul>
        <li>身份证：{{content.idNumber}}</li>
        <li>分类：{{content.businessName}}</li>
        <li>店铺地区：{{content.areaName}}</li>
        <li>收款账号：{{content.bankAddress}}</li>
      </ul>
      <ul>
        <li>所属代理商：{{content.agentMobileNumber}}</li>
        <li>来源：{{content.source | registrySource}}</li>
        <li>详细地址：{{content.addressDetail}}</li>
      </ul>
    </div>
    <div class="title">
      <strong>营业执照:</strong>
    </div>
    <div style="min-height: 160px;">
      <img
        v-for="item in content.businessLicenseKey"
        :key="item"
        :src="item"
        style="width:200px;height:150px;margin:10px;"
        preview="1"
      />
    </div>
    <div class="title">
      <strong>商品列表:</strong>
    </div>
    <div class="table_con">
      <div class="table">
        <div class="top">
          <span>商品数量：{{totalGoods}}个</span>
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            @current-change="handleCurrentChangeGoods"
            :current-page.sync="goodsListPage"
            :page-size="10"
            :total="totalGoods"
          ></el-pagination>
        </div>
        <div style="margin:20px 0px;">
          <el-button type="primary" size="small" @click="navGoodsDetail(1,content.id)">新建商品</el-button>
          <el-button type="primary" size="small" @click="storeTypeDialog = true">管理店铺商品品类</el-button>
        </div>
        <el-table border :data="tableDataGoods" style="width: 100%">
          <el-table-column prop="id" label="商品编号" align="center"></el-table-column>
          <el-table-column prop="goodsName" label="商品名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="categoryName" label="平台分类" align="center"></el-table-column>
          <el-table-column label="店铺分类" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="openChangeStoreTypeDialog(scope.row.id)"
              >{{scope.row.merchantCategoryName}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="navGoodsDetail(2,scope.row.id)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="title">
      <strong>营收记录:</strong>
    </div>
    <div class="table_con">
      <div class="table">
        <div class="top">
          <span>线上营收：{{IncomeON}}元(总计：{{totalON}}条)</span>
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            @current-change="handleCurrentChangeON"
            :page-size="10"
            :total="totalON"
          ></el-pagination>
        </div>
        <el-table border :data="tableDataON" style="width: 100%">
          <el-table-column prop="createTime" label="入账时间" align="center">
            <template slot-scope="scope">{{scope.row.createTime | dateFormat}}</template>
          </el-table-column>
          <el-table-column prop="nickname" label="购买用户" align="center"></el-table-column>
          <el-table-column prop="goodsName" label="商品" align="center"></el-table-column>
          <el-table-column prop="gainAmount" label="收入金额" align="center"></el-table-column>
        </el-table>
      </div>
      <div class="table">
        <div class="top">
          <span>线下营收：{{IncomeOff}}元(总计：{{totalOff}}条)</span>
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            @current-change="handleCurrentChangeOff"
            :page-size="10"
            :total="totalOff"
          ></el-pagination>
        </div>
        <el-table :data="tableDataOff" border style="width: 100%">
          <el-table-column prop="createTime" label="入账时间" align="center">
            <template slot-scope="scope">{{scope.row.createTime | dateFormat}}</template>
          </el-table-column>
          <el-table-column prop="nickname" label="购买用户" align="center"></el-table-column>
          <el-table-column prop="categoryName" label="商品分类" align="center"></el-table-column>
          <el-table-column prop="rebate" label="折扣" align="center"></el-table-column>
          <el-table-column prop="gainAmount" label="收入金额" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="title">
      <strong>提现记录:</strong>
    </div>
    <div class="table_con">
      <div class="table">
        <div class="top">
          <span>当前余额：{{balance}}元</span>
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            @current-change="handleCurrentChangeDraw"
            :page-size="10"
            :total="totalDraw"
          ></el-pagination>
        </div>
        <el-table border :data="tableDataDraw" style="width: 100%">
          <el-table-column prop="createTime" label="申请提现时间" align="center">
            <template slot-scope="scope">{{scope.row.createTime | dateFormat}}</template>
          </el-table-column>
          <el-table-column prop="adoptAmount" label="提现金额" align="center"></el-table-column>
          <el-table-column prop="realName" label="账户名" align="center"></el-table-column>
          <el-table-column prop label="账号" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.type == 1">微信:{{scope.row.remark}}</span>
              <span v-if="scope.row.type == 2">{{scope.row.bankCardNumber}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="afterAmount" label="提现后余额" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <!-- <div class="title">
      <strong>冻结/流失历史:</strong>
    </div>
    <div class="details">
      <span v-if="history.length == 0">暂无记录</span>
      <ul v-if="history.length > 0">
        <li v-for="(item,index) in content.records" :key="index">
          <span>
            {{item.createTime | dateFormat}} {{item.status | merchantHistoryStatus}}
            <span
              v-if="item.status != 2"
            >原因：{{item.remark}}</span>
          </span>
        </li>
      </ul>
    </div>-->

    <!-- 店铺分类弹窗 -->
    <el-dialog
      title="店铺分类"
      :visible.sync="storeTypeDialog"
      center
      :close-on-click-modal="false"
      width="600px"
    >
      <el-table :data="storeTypeData">
        <el-table-column property="name" label="分类名"></el-table-column>
        <el-table-column property="goodsCount" label="商品数量"></el-table-column>
        <el-table-column property label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="removeStoreType(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="primary"
        size="small"
        style="margin-top:20px;"
        @click="addStoreTypeDialog = true"
      >新建分类</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="storeTypeDialog = false">取 消</el-button>
        <el-button type="primary" @click="storeTypeDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新建分类弹窗 -->
    <el-dialog
      title="店铺分类"
      :visible.sync="addStoreTypeDialog"
      center
      :close-on-click-modal="false"
      width="340px"
    >
      <el-input
        v-model="goodsCategoryName"
        placeholder="请输入分类名称"
        style="width:200px;margin:0 auto;display:block;"
        :maxlength="5"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addStoreTypeDialog = false">取 消</el-button>
        <el-button type="primary" @click="addMerchantGoodsCategory">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改店铺分类弹窗 -->
    <el-dialog
      title="店铺分类"
      :visible.sync="changeStoreTypeDialog"
      center
      :close-on-click-modal="false"
      width="340px"
    >
      <el-select
        v-model="categoryId"
        placeholder="请选择"
        style="width:260px;display:block;margin:0 auto;"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeStoreTypeDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeStoreType">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMerchantDetails,
  getMerchantIncomeDetails,
  getMerchantGoods,
  getMerchantGoodsCategory,
  addMerchantGoodsCategory,
  removeMerchantGoodsCategory,
  changeGoodsSetCategory,
  getMerchantDrawRecordList
} from "@/network/api";
export default {
  data() {
    return {
      storeTypeDialog: false,
      storeTypeData: [],
      addStoreTypeDialog: false,
      goodsCategoryName: "",
      changeStoreTypeDialog: false,
      goodsListPage: 1,
      content: {},
      history: [],
      totalGoods: 0,
      tableDataGoods: [],
      totalON: 0,
      tableDataON: [],
      totalOff: 0,
      tableDataOff: [],
      totalDraw: 0,
      tableDataDraw: [],
      balance: 0,
      IncomeON: 0,
      IncomeOff: 0,
      options: [],
      categoryId: "",
      goodsId: ""
    };
  },
  components: {},
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getMerchantDetails();
    this.getMerchantGoods(1);
    this.getOnData(1);
    this.getOffData(1);
    this.getMerchantDrawRecordList(1);
  },
  methods: {
    // 获取商户详细信息（基础信息）
    getMerchantDetails() {
      let parms = {
        id: this.$route.query.id
      };
      getMerchantDetails({ params: parms }).then(res => {
        if (res.data.content) {
          this.content = res.data.content;
          this.history = res.data.content.records;
          this.getMerchantGoodsCategory();
        } else {
          this.content = {};
        }
      });
    },
    // 获取商户商品列表
    getMerchantGoods(val) {
      let parms = {
        pageNumber: val,
        pageSize: 10,
        id: this.$route.query.id
      };
      getMerchantGoods({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.tableDataGoods = res.data.content.items;
          this.totalGoods = res.data.content.totalSize;
          this.goodsListPage = val;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 点击编辑跳转到商品详情页
    navGoodsDetail(type, id) {
      if (type == 1) {
        this.$router.push({
          path: "/addGoods",
          query: {
            type: type,
            storeId: id
          }
        });
      } else {
        this.$router.push({
          path: "/addGoods",
          query: {
            type: type,
            id: id
          }
        });
      }
    },
    // 获取店铺商品分类
    getMerchantGoodsCategory() {
      let parms = {
        storeId: this.content.storeId
      };
      getMerchantGoodsCategory({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.storeTypeData = res.data.content;
        } else {
          this.$message.error(res.data.messageCode);
        }
      });
    },
    // 新建店铺商品分类
    addMerchantGoodsCategory() {
      if (!this.goodsCategoryName.trim()) {
        this.$message.error("请填写分类名称");
        return;
      }
      let data = {
        storeId: this.content.storeId,
        name: this.goodsCategoryName
      };
      addMerchantGoodsCategory(this.qs.stringify(data)).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.getMerchantGoodsCategory();
          this.$message.success("操作成功");
          this.addStoreTypeDialog = false;
        } else {
          this.$message.error(res.data.messageCode);
        }
      });
    },
    // 删除店铺商品品类
    removeStoreType(id) {
      this.$confirm("确定删除分类嘛?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        showClose: false,
        closeOnClickModal: false
      })
        .then(() => {
          let data = {
            categoryId: id
          };
          removeMerchantGoodsCategory({ params: data }).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.getMerchantGoodsCategory();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 打开修改店铺商品分类弹窗
    openChangeStoreTypeDialog(id) {
      this.options = [];
      this.goodsId = id;
      this.storeTypeData.forEach(val => {
        let json = {};
        json.value = val.id;
        json.label = val.name;
        this.options.push(json);
      });
      this.changeStoreTypeDialog = true;
    },
    // 修改店铺商品分类
    changeStoreType() {
      let parms = {
        goodsId: this.goodsId,
        categoryId: this.categoryId
      };
      changeGoodsSetCategory(this.qs.stringify(parms)).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.changeStoreTypeDialog = false;
          this.goodsListPage = 1;
          this.getMerchantGoods(1);
          this.$message.success("操作成功");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 线上营收
    getOnData(val) {
      let obj = {
        pageNumber: val,
        pageSize: 10,
        merchantId: this.$route.query.id,
        goodsType: 1
      };
      getMerchantIncomeDetails({ params: obj }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.tableDataON = res.data.content.items.items;
          this.totalON = res.data.content.items.totalSize;
          this.IncomeON = res.data.content.totalIncome;
        }
      });
    },
    // 线下营收
    getOffData(val) {
      let obj = {
        pageNumber: val,
        pageSize: 10,
        merchantId: this.$route.query.id,
        goodsType: 2
      };
      getMerchantIncomeDetails({ params: obj }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.tableDataOff = res.data.content.items.items;
          this.totalOff = res.data.content.items.totalSize;
          this.IncomeOff = res.data.content.totalIncome;
        }
      });
    },
    // 获取提现记录
    getMerchantDrawRecordList(val) {
      let obj = {
        pageNumber: val,
        pageSize: 10,
        id: this.$route.query.id
      };
      getMerchantDrawRecordList({ params: obj }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.balance = content.balance;
          this.tableDataDraw = content.drawResponseList.items;
          this.totalDraw = content.drawResponseList.totalSize;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 商品列表翻页
    handleCurrentChangeGoods(val) {
      this.getMerchantGoods(val);
    },
    // 线上营收翻页
    handleCurrentChangeON(val) {
      this.getOnData(val);
    },
    // 线下营收翻页
    handleCurrentChangeOff(val) {
      this.getOffData(val);
    },
    // 提现记录翻页
    handleCurrentChangeDraw(val) {
      this.getMerchantDrawRecordList(val);
    }
  }
};
</script>

<style scoped lang="less">
.title {
  border-bottom: 1px solid #cccccc;
}
.con {
  display: flex;
  flex-wrap: wrap;
  ul {
    width: 350px;
    li {
      margin: 20px 0;
    }
  }
}
.table_con {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 20px;
  .table {
    width: 600px;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px 0;
    }
  }
}
.details {
  margin-top: 20px;
  li {
    margin-top: 15px;
  }
}
</style>
