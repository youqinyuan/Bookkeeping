<template>
  <div class="addNavigation">
    <el-dialog title="选择页面链接" :visible.sync="centerDialogVisible" width="50%" :show-close="false">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 系统页面模块 -->
        <el-tab-pane label="系统页面" name="first">
          <div class="userBox">
            <div class="userTitle">页面名称</div>
            <div class="userRadioBox" v-for="(item,index) in systemData" :key="index">
              <span>{{item.title}}</span>
              <el-radio v-model="radioData1" :label="item.id" @change="radioSelect1">选择此链接</el-radio>
            </div>
          </div>
          <div style="margin-top:10px;">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="systemTotal"
              :page-size="5"
              :current-page="systemCurrentPage"
              @current-change="systemPageChange($event)"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <!-- 商品详情模块 -->
        <el-tab-pane label="商品详情" name="second">
          <div class="searchBox">
            <el-select
              v-model="parentTypeId"
              placeholder="一级分组"
              style="width:120px;"
              @change="selectparentTypeId"
            >
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select v-model="typeId" placeholder="二级分组" style="width:120px;">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-checkbox v-model="issueStatus" style="margin-left:20px;">只显示上架中商品</el-checkbox>
            <el-input v-model="goodsName" placeholder="输入商品名或编号" style="width:160px;"></el-input>
            <el-button type="primary" style="margin-left:20px;" @click="search(1)">查询</el-button>
          </div>
          <div class="tableBox" style="margin-top:10px;">
            <el-table :data="productDetailData" border style="width: 100%">
              <el-table-column prop="id" label="编号" width="60" align="center"></el-table-column>
              <el-table-column
                prop="name"
                label="商品名称"
                align="center"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column prop="orgPrice" label="原价" width="80" align="center"></el-table-column>
              <el-table-column prop="dctRate" label="折扣" width="80" align="center"></el-table-column>
              <el-table-column prop="dctPrice" label="成本价" width="80" align="center"></el-table-column>
              <el-table-column prop="stock" label="库存" width="80" align="center"></el-table-column>
              <el-table-column prop="issueStatus" label="商品状态" width="80" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.issueStatus == 1">上架中</span>
                  <span v-if="scope.row.issueStatus == 2">未上架</span>
                </template>
              </el-table-column>
              <el-table-column prop width="140">
                <template slot-scope="scope">
                  <el-radio
                    v-model="radioData2"
                    :label="scope.row.id"
                    v-if="scope.row.issueStatus == 1"
                    @change="radioSelect2"
                  >选择此链接</el-radio>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="margin-top:10px;">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="productDetailTotal"
              :page-size="5"
              :current-page="productDetailCurrentPage"
              @current-change="productDetailPageChange($event)"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <!-- 商品分类模块 -->
        <el-tab-pane label="商品分类" name="third">
          <div class="searchBox">
            <el-select v-model="productTypeValue" style="width:160px;" @change="selecteProductType">
              <el-option
                v-for="item in productType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="tableBox" style="margin-top:10px;">
            <el-table :data="productTypeData" border style="width: 100%">
              <el-table-column prop="name" label="分类名称" align="center"></el-table-column>
              <el-table-column prop="goodsCount" label="商品数量" align="center"></el-table-column>
              <el-table-column prop="address" label align="center">
                <template slot-scope="scope">
                  <el-radio v-model="radioData3" :label="scope.row.id" @change="radioSelect3">选择此链接</el-radio>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="margin-top:10px;">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="productTypeTotal"
              :page-size="5"
              :current-page="productTypeCurrentPage"
              @current-change="productTypePageChange($event)"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <!-- 新人专区 -->
        <el-tab-pane label="新人专区" name="four">
          <div class="tableBox">
            <el-table :data="newPeopleData" border style="width: 100%">
              <el-table-column prop="name" label="页面名称" width="180"></el-table-column>
              <el-table-column prop="status" label="状态" width="180">
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 1">未开始</span>
                  <span v-if="scope.row.status == 2">进行中</span>
                  <span v-if="scope.row.status == 3">已结束</span>
                </template>
              </el-table-column>
              <el-table-column prop>
                <template slot-scope="scope">
                  <el-radio
                    v-model="radioNewPeople"
                    :label="scope.row.id"
                    v-if="scope.row.status == 1 || scope.row.status == 2"
                    @change="radioSelectNewPeople"
                  >选择此链接</el-radio>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="margin-top:10px;">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="newPeopleTotal"
              :page-size="5"
              :current-page="newPeopleCurrentPage"
              @current-change="newPeoplePageChange($event)"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <!-- 商品专区 -->
        <el-tab-pane label="商品专区" name="five">
          <div class="tableBox">
            <el-table :data="goodsActiviteData" border style="width: 100%">
              <el-table-column prop="name" label="页面名称" width="180"></el-table-column>
              <el-table-column prop="status" label="状态" width="180">
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 1">未开始</span>
                  <span v-if="scope.row.status == 2">进行中</span>
                  <span v-if="scope.row.status == 3">已结束</span>
                </template>
              </el-table-column>
              <el-table-column prop>
                <template slot-scope="scope">
                  <el-radio
                    v-model="radioGoodsActivite"
                    :label="scope.row.id"
                    v-if="scope.row.status == 1 || scope.row.status == 2"
                    @change="radioSelectGoodsArea"
                  >选择此链接</el-radio>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="margin-top:10px;">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="goodsActiviteTotal"
              :page-size="5"
              :current-page="goodsActiviteCurrentPage"
              @current-change="goodsActivitePageChange($event)"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <!-- H5链接路径 -->
        <el-tab-pane label="H5链接路径" name="six">
          <div class="tableBox">
            <div>
              <span style="margin-right:10px;">新建链接地址</span>
              <el-button type="text" @click="addH5">保存</el-button>
            </div>
            <el-input v-model="H5" placeholder="请输入要跳转的H5链接路径" style="margin:10px 0px;"></el-input>
            <div>提示：H5链接仅可使用https且同域名下链接</div>
          </div>
          <div style="margin-top:10px;">
            <el-table :data="H5Data" border style="width: 100%">
              <el-table-column prop="param" label="已添加H5链接"></el-table-column>
              <el-table-column prop width="120px">
                <template slot-scope="scope">
                  <el-radio v-model="radioH5" :label="scope.row.id" @change="radioSelectH5">选择此链接</el-radio>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="margin-top:10px;">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="H5Total"
              :page-size="5"
              :current-page="H5CurrentPage"
              @current-change="H5PageChange($event)"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="preservation">保 存</el-button>
        <el-button @click="centerDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  findSystemPageListNavigation,
  findPageListNavigation,
  getGoodsClassRequest,
  queryPlatAndMerchantGoodsList,
  queryNewPeople,
  queryGoodsArea,
  findPageListH5,
  addOrUpdateH5
} from "@/network/api";
export default {
  data() {
    return {
      activeName: "first",
      centerDialogVisible: false,
      systemData: [],
      systemTotal: 0,
      systemCurrentPage: 1,
      productTypeData: [],
      productTypeTotal: 0,
      productTypeCurrentPage: 1,
      productDetailData: [],
      productDetailTotal: 0,
      productDetailCurrentPage: 1,
      goodsName: "",
      radioData1: "",
      radioData2: "",
      radioData3: "",
      radioName: "",
      paramExt: 1,
      category: "", //导航分类： 1-系统页面 2-商品详情 3-商品分类 4-新人专区
      issueStatus: false,
      goodsCategory: [], //所有商品分类
      options1: [],
      options2: [],
      parentTypeId: "",
      typeId: "",
      productType: [
        {
          value: "1",
          label: "全部一级分类"
        },
        {
          value: "2",
          label: "全部二级分类"
        }
      ],
      productTypeValue: "1",
      newPeopleData: [],
      newPeopleTotal: 0,
      newPeopleCurrentPage: 1,
      radioNewPeople: "",
      goodsActiviteData: "",
      radioGoodsActivite: "",
      goodsActiviteTotal: 0,
      goodsActiviteCurrentPage: 1,
      H5: "",
      H5Data: [],
      radioH5: "",
      H5Total: 0,
      H5CurrentPage: 1
    };
  },
  created() {
    this.findSystemPageListNavigation(1);
    this.getGoodsCategory();
    this.search(1);
    this.findPageListNavigation(1);
    this.queryNewPeople(1);
    this.queryGoodsArea(1);
    this.findPageListH5(1);
  },
  methods: {
    // 打开dialog
    open() {
      this.centerDialogVisible = true;
    },
    // =========================系统页面============================
    // 请求系统页面数据
    findSystemPageListNavigation(val) {
      let params = {
        pageNumber: val,
        pageSize: 5
      };
      findSystemPageListNavigation(params).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          if (res.data.content) {
            let data = res.data.content;
            this.systemData = data.items;
            this.systemTotal = data.totalSize;
            this.systemCurrentPage = val;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 系统页面radio改变事件
    radioSelect1(val) {
      this.category = 1;
      let arr = this.systemData.filter(item => {
        return item.id == val;
      });
      this.radioName = arr[0].title;
      this.radioData2 = "";
      this.radioData3 = "";
      this.radioNewPeople = "";
      this.radioGoodsActivite = "";
      this.radioH5 = "";
    },
    // 系统页面翻页
    systemPageChange(val) {
      this.findSystemPageListNavigation(val);
      this.systemCurrentPage = val;
    },
    // ==========================商品详情=================================
    // 获取商品详情中商品具体分组类别
    getGoodsCategory() {
      getGoodsClassRequest().then(res => {
        if (res.data.messageCode == "MSG_1001") {
          if (res.data.content) {
            let data = res.data.content;
            this.goodsCategory = data;
            data.forEach((item, index) => {
              let json = {};
              json.value = item.id;
              json.label = item.name;
              this.options1.push(json);
            });
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 选择一级分类
    selectparentTypeId(val) {
      let arr = this.goodsCategory.filter(item => {
        return item.id == val;
      });
      this.options2 = [];
      this.typeId = "";
      if (arr[0].nextLevelData.length > 0) {
        arr[0].nextLevelData.forEach((item, index) => {
          let json = {};
          json.value = item.id;
          json.label = item.name;
          this.options2.push(json);
        });
        this.typeId = this.options2[0].value;
      }
    },
    // 搜索
    search(val) {
      let issueStatus = this.issueStatus == true ? 1 : " ";
      let categoryId = this.typeId ? this.typeId : this.parentTypeId;
      let params = {
        pageNumber: val,
        pageSize: 5,
        goodsName: this.goodsName,
        categoryId: categoryId,
        issueStatus: issueStatus
      };
      queryPlatAndMerchantGoodsList({ params: params }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          if (res.data.content) {
            let data = res.data.content;
            this.productDetailData = data.items;
            this.productDetailTotal = data.totalSize;
            this.productDetailCurrentPage = val;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 商品详情radio改变事件
    radioSelect2(val) {
      this.category = 2;
      let arr = this.productDetailData.filter(item => {
        return item.id == val;
      });
      this.radioName = arr[0].name;
      this.radioData1 = "";
      this.radioData3 = "";
      this.radioNewPeople = "";
      this.radioGoodsActivite = "";
      this.radioH5 = "";
    },
    // 商品详情翻页
    productDetailPageChange(val) {
      this.search(val);
      this.productDetailCurrentPage = val;
    },
    // ==========================商品分类==============================
    // 请求商品分类数据
    findPageListNavigation(val) {
      let params = {
        pageNumber: val,
        pageSize: 5,
        level: this.productTypeValue
      };
      findPageListNavigation(params).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          if (res.data.content) {
            let data = res.data.content;
            this.productTypeData = data.items;
            this.productTypeTotal = data.totalSize;
            this.productTypeCurrentPage = val;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 商品分裂radio改变事件
    radioSelect3(val) {
      this.category = 3;
      let arr = this.productTypeData.filter(item => {
        return item.id == val;
      });
      this.radioName = arr[0].name;
      this.radioData1 = "";
      this.radioData2 = "";
      this.radioNewPeople = "";
      this.radioGoodsActivite = "";
      this.radioH5 = "";
    },
    // 商品分类翻页
    productTypePageChange(val) {
      this.findPageListNavigation(val);
      this.productTypeCurrentPage = val;
    },
    // 选择商品分类一级分类或者二级分类
    selecteProductType(val) {
      this.productTypeValue = val;
      this.paramExt = val;
      this.findPageListNavigation(1);
    },
    // ====================新人专区===========================
    // 查询活动列表
    queryNewPeople(val) {
      let parms = {
        pageNumber: val,
        pageSize: 5
      };
      queryNewPeople({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let data = res.data.content;
          this.newPeopleData = data.items;
          this.newPeopleTotal = data.totalSize;
          this.currentPage = val;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 新人专区radio改变事件
    radioSelectNewPeople(val) {
      this.category = 4;
      let arr = this.newPeopleData.filter(item => {
        return item.id == val;
      });
      this.radioName = arr[0].name;
      this.radioData1 = "";
      this.radioData2 = "";
      this.radioData3 = "";
      this.radioGoodsActivite = "";
      this.radioH5 = "";
    },
    // 新人专区翻页
    newPeoplePageChange(val) {
      this.queryNewPeople(val);
      this.newPeopleCurrentPage = val;
    },
    // ======================商品专区================================

    // 查询活动列表
    queryGoodsArea(val) {
      let parms = {
        pageNumber: val,
        pageSize: 5
      };
      queryGoodsArea({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let data = res.data.content;
          this.goodsActiviteData = data.items;
          this.goodsActiviteTotal = data.totalSize;
          this.goodsActiviteCurrentPage = val;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 商品专区radio改变事件
    radioSelectGoodsArea(val) {
      this.category = 5;
      let arr = this.goodsActiviteData.filter(item => {
        return item.id == val;
      });
      this.radioName = arr[0].name;
      this.radioData1 = "";
      this.radioData2 = "";
      this.radioData3 = "";
      this.radioNewPeople = "";
      this.radioH5 = "";
    },
    // 商品专区翻页
    goodsActivitePageChange(val) {
      this.queryGoodsArea(val);
      this.goodsActiviteCurrentPage = val;
    },
    // ===========================H5链接路径==================================
    // 查询H5列表
    findPageListH5(val) {
      let parms = {
        pageNumber: val,
        pageSize: 5
      };
      findPageListH5({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let data = res.data.content;
          this.H5Data = data.items;
          this.H5Total = data.totalSize;
          this.H5CurrentPage = val;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 添加或修改H5路径
    addH5() {
      let parms = {
        param: this.H5,
        title: this.H5
      };
      addOrUpdateH5(parms).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.findPageListH5(1);
          this.$message.success("保存成功");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // H5专区radio改变事件
    radioSelectH5(val) {
      this.category = 6;
      let arr = this.H5Data.filter(item => {
        return item.id == val;
      });
      this.radioName = arr[0].title;
      this.radioData1 = "";
      this.radioData2 = "";
      this.radioData3 = "";
      this.radioNewPeople = "";
      this.radioGoodsActivite = "";
    },
    // H5专区翻页
    H5PageChange(val) {
      this.findPageListH5(val);
      this.H5CurrentPage = val;
    },
    // =============================================================
    // tabs选择
    handleClick(tab, event) {
      // console.log(tab.label);
    },
    // 保存
    preservation() {
      let category = this.category;
      let radioData = "";
      if (category == 1) {
        radioData = this.radioData1;
      } else if (category == 2) {
        radioData = this.radioData2;
      } else if (category == 3) {
        radioData = this.radioData3;
      } else if (category == 4) {
        radioData = this.radioNewPeople;
      } else if (category == 5) {
        radioData = this.radioGoodsActivite;
      } else if (category == 6) {
        radioData = this.radioH5;
      }
      if (!radioData) {
        this.$message.error("请选择路径");
        return;
      }
      this.$emit("func", radioData, this.radioName, category, this.paramExt);
      this.centerDialogVisible = false;
    }
  }
};
</script>
<style lang="less" scoped>
.userBox {
  border: 1px solid #ccc;
  padding: 0px 10px;
  .userTitle {
    font-weight: bold;
    padding: 10px 0px;
  }
  .userRadioBox {
    width: 100%;
    height: 40px;
    border-top: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>