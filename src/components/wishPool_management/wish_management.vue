<template>
  <div class="wish_management">
    <!-- 上方搜索区域 -->
    <div class="title">
      <span>注册电话：</span>
      <el-input
        style="width: 140px; margin-right: 20px"
        v-model="tel"
      ></el-input>
      <span>状态：</span>
      <el-select
        v-model="status"
        placeholder="请选择"
        style="width: 140px; margin-right: 20px"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span>时间：</span>
      <el-date-picker
        v-model="time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="dateChange"
      ></el-date-picker>
      <el-button type="primary" style="margin-left: 20px" @click="search(1)"
        >搜索</el-button
      >
      <el-button type="info" @click="downLoadData">导出查询全部内容</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="tableContent">
      <el-table :data="tableData" style="width: 100%; margin-top: 40px" border>
        <el-table-column
          label="用户昵称"
          prop="nickname"
          align="center"
        ></el-table-column>
        <el-table-column
          label="注册电话"
          prop="mobileNumber"
          align="center"
        ></el-table-column>
        <el-table-column label="提交心愿时间" align="center">
          <template slot-scope="scoped">
            <span>{{ scoped.row.createTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="心愿内容"
          width="300"
          prop="wishContent"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="状态" width="120" prop="status" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">心愿满足中</span>
            <span v-if="scope.row.status == 2">心愿已满足</span>
            <span v-if="scope.row.status == 3" style="color: #999">已删除</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope" v-if="scope.row.status !== 3">
            <el-button
              size="mini"
              type="text"
              @click="openWishContent(scope.row.id, scope.row.type)"
              >查看心愿完整内容</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="chooseGoodsfocus(scope.row.id, scope.row.matchedGoodsId)"
              v-if="scope.row.type == 1"
              >满足心愿</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 底部总计条数和分页区域 -->
    <div class="bottom">
      <div class="total">总计：{{ totalSize }}条</div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="Number(totalSize)"
        :page-size="10"
        :current-page="currentPage"
        @current-change="pageChange($event)"
      ></el-pagination>
    </div>
    <!-- 寻商品心愿完整内容弹框 -->
    <div class="wishDialog" v-if="showWishContent">
      <div class="dialogTips">查看心愿内容</div>
      <div class="dialogTitle">心愿名称、链接等信息</div>
      <div class="wishContent">
        {{ wishContent.wishContent ? wishContent.wishContent : "无" }}
      </div>
      <div class="dialogTitle">心愿规格、颜色、大小等信息</div>
      <div class="wishContent">
        {{ wishContent.contentDetail ? wishContent.contentDetail : "无" }}
      </div>
      <div class="dialogTitle">心愿图片</div>
      <div class="imgWrap" v-if="wishContent.imageList.length > 0">
        <img
          preview="1"
          v-for="(item, index) in wishContent.imageList"
          :key="index"
          :src="item.imageUrl"
        />
      </div>
      <div class="noImg" v-else>无</div>
      <div class="dialogTitle">已满足的心愿商品</div>
      <div class="wishContent">{{ wishContent.matchedGoodsName }}</div>
      <div class="wishContentBtn">
        <el-button type="primary" @click="closeWishContent">确 定</el-button>
      </div>
    </div>
    <!-- 寻商家心愿完整内容弹框 -->
    <div class="wishDialog" v-if="showWishContent_business">
      <div class="dialogTips">查看心愿内容</div>
      <div class="dialogTitle">商家名称：</div>
      <div class="wishContent">
        {{ wishContent.name ? wishContent.name : "无" }}
      </div>
      <div class="dialogTitle">商家地址等信息：</div>
      <div class="wishContent">
        {{ wishContent.address ? wishContent.address : "无" }}
      </div>
      <!-- 高德地图组件 -->
      <amap
        style="width: 300px; height: 300px; margin-top: 20px"
        :lat="wishContent.lat"
        :lng="wishContent.lng"
      ></amap>
      <div class="dialogTitle">心愿图片</div>
      <div class="imgWrap" v-if="wishContent.imageList.length > 0">
        <img
          preview="1"
          v-for="(item, index) in wishContent.imageList"
          :key="index"
          :src="item.imageUrl"
        />
      </div>
      <div class="noImg" v-else>无</div>
      <div class="dialogTitle">喜欢的商家商品，描述等信息：</div>
      <div class="wishContent">
        {{ wishContent.contentDetail ? wishContent.contentDetail : "无" }}
      </div>
      <div class="dialogTitle">链接商家</div>
      <div class="wishContent">
        <el-select v-model="merchantId" style="width: 260px">
          <el-option
            v-for="item in businessOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="wishContent" style="margin-top: 10px">
        <div style="font-weight: bold">备注留言：</div>
        <el-input
          style="width: 450px; margin-top: 10px"
          v-model="message"
          clearable
          :maxlength="40"
        ></el-input>
      </div>
      <div class="wishContentBtn">
        <el-button type="primary" @click="closeWishContent_business"
          >取 消</el-button
        >
        <el-button type="primary" @click="satisfyWish_business"
          >确 定</el-button
        >
      </div>
    </div>

    <!-- 选择商品弹窗 -->
    <chooseGoodsPop
      ref="chooseGoods"
      @satisfyWish="satisfyWish(arguments)"
    ></chooseGoodsPop>
  </div>
</template>
<script>
import chooseGoodsPop from "./common/selectProduct";
import amap from "./common/amap";
import {
  wishQueryPageList,
  wishQueryDetail,
  matchedGoods,
  getBusinessOptionsRequest,
  exportWishGoodsExcel,
} from "@/network/api";
export default {
  name: "wish_management",
  data() {
    return {
      id: "",
      tel: "", // 用户电话
      time: "",
      startTime: "", //开始时间
      endTime: "", //结束时间
      totalSize: "0",
      currentPage: 1,
      wishContent: [], //心愿内容
      options: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "1",
          label: "心愿满足中",
        },
        {
          value: "2",
          label: "心愿已满足",
        },
        {
          value: "3",
          label: "已删除",
        },
      ],
      status: "", // 状态
      tableData: [],
      showWishContent: false, //是否显示寻商品心愿完整内容弹框
      showWishContent_business: false, //是否显示寻商家心愿完整内容弹框
      merchantId: "",
      message: "",
    };
  },
  components: {
    chooseGoodsPop,
    amap,
  },
  created() {
    this.search(1);
    // 获取商家列表数据
    this.getBusinessOptions();
    this.$store.commit("showMask", false);
  },
  methods: {
    // 搜索
    search(val) {
      let data = {
        pageNumber: val ? val : this.currentPage,
        pageSize: 10,
        beginTime: this.startTime,
        endTime: this.endTime,
        mobileNumber: this.tel,
        status: this.status,
      };
      wishQueryPageList({ params: data }).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.tableData = res.data.content.items;
          this.totalSize = res.data.content.totalSize;
          this.currentPage = val ? val : this.currentPage;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 获取商家列表数据
    getBusinessOptions() {
      let parms = {
        businessId: 0,
      };
      getBusinessOptionsRequest({ params: parms }).then((res) => {
        if (res.data.messageCode === "MSG_1001") {
          let businessOptions = [];
          res.data.content.map((item) => {
            businessOptions.push({
              label: item.storeName,
              value: item.storeId,
            });
          });
          this.businessOptions = businessOptions;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 搜索时间改变事件
    dateChange(val) {
      this.startTime = this.getDateShow(val[0]);
      this.endTime = this.getDateShow(val[1]);
    },

    // 时间格式处理函数
    getDateShow(value) {
      let dt = new Date(value);
      return dt.getTime();
    },

    // 分页改变事件
    pageChange(val) {
      this.currentPage = val;
      this.search(val);
    },

    // 导出查询内容
    downLoadData() {
      let routeData = this.$router.resolve({
        name: "wishExcelDownLoad",
        query: {
          beginTime: this.startTime,
          endTime: this.endTime,
          mobileNumber: this.tel,
          status: this.status,
        },
      });
      window.open(routeData.href, "_blank");
    },

    // 查看心愿完整内容
    openWishContent(id, type) {
      // type:1-寻商品 2-寻商家
      wishQueryDetail(`?id=${id}`).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.wishContent = res.data.content;
          if (type == 1) {
            this.$store.commit("showMask", true);
            this.showWishContent = true;
          } else {
            this.id = id;
            this.merchantId = res.data.content.matchedGoodsId;
            this.$store.commit("showMask", true);
            this.showWishContent_business = true;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 关闭寻商品心愿完整内容
    closeWishContent() {
      this.$store.commit("showMask", false);
      this.showWishContent = false;
    },

    // 关闭寻商家心愿完整内容
    closeWishContent_business() {
      this.$store.commit("showMask", false);
      this.showWishContent_business = false;
      this.message = "";
    },

    // 满足寻商家心愿
    satisfyWish_business() {
      if (!this.merchantId) {
        this.$message.error("请选择链接商家");
        return;
      }
      let parms = {
        id: this.id,
        matchedGoodsId: this.merchantId,
        message: this.message,
      };
      matchedGoods(this.qs.stringify(parms)).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.$store.commit("showMask", false);
          this.showWishContent_business = false;
          this.$message.success("保存成功");
          this.search();
          this.message = "";
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 满足心愿
    chooseGoodsfocus(id, matchedGoodsId) {
      this.$refs.chooseGoods.open(1, matchedGoodsId);
      this.id = id;
    },

    // 接收子组件的值
    satisfyWish(argument) {
      // 满足心愿
      let parms = {
        id: this.id,
        matchedGoodsId: argument[0],
        message: argument[1],
      };
      matchedGoods(this.qs.stringify(parms)).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("保存成功");
          this.search();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.wishDialog {
  width: 40%;
  max-height: 800px;
  overflow-y: auto;
  border-radius: 10px;
  background-color: #fff;
  padding: 20px;
  position: fixed;
  top: 10%;
  left: 30%;
  z-index: 100;
  .dialogTips {
    font-size: 16px;
  }
  .dialogTitle {
    padding: 20px 0px;
    font-weight: bold;
    font-size: 15px;
  }
  .wishContent {
    width: 100%;
    word-wrap: break-word;
    font-size: 14px;
  }
  .imgWrap {
    width: 100%;
    height: 150px;
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    img {
      width: 150px;
      height: 150px;
      flex-shrink: 0;
      margin-right: 6px;
    }
  }
  .noImg {
    width: 100%;
    height: 50px;
    line-height: 50px;
  }
  .wishContentBtn {
    width: 100%;
    padding: 0px 20px;
    box-sizing: border-box;
    display: flex;
    margin-top: 10px;
    justify-content: flex-end;
  }
}
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