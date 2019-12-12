<template>
  <div class="wish_management">
    <!-- 上方搜索区域 -->
    <div class="title">
      <span>注册电话：</span>
      <el-input style="width:140px;margin-right:20px;" v-model="tel"></el-input>
      <span>状态：</span>
      <el-select v-model="status" placeholder="请选择" style="width:140px;margin-right:20px;">
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
      <el-button type="primary" style="margin-left:20px;" @click="search(1)">搜索</el-button>
      <el-button type="info" @click="downLoadData">导出查询全部内容</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="tableContent">
      <el-table :data="tableData" style="width: 100%;margin-top:40px;" border>
        <el-table-column label="用户昵称" prop="nickname" align="center"></el-table-column>
        <el-table-column label="注册电话" prop="mobileNumber" align="center"></el-table-column>
        <el-table-column label="提交心愿时间" align="center">
          <template slot-scope="scoped">
            <span>{{scoped.row.createTime | getDateShow}}</span>
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
            <span v-if="scope.row.status == 3" style="color:#999">已删除</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope" v-if="scope.row.status !== 3">
            <el-button size="mini" type="text" @click="openWishContent(scope.row.id)">查看心愿完整内容</el-button>
            <el-button size="mini" type="text" @click="chooseGoodsfocus(scope.row.id)">满足心愿</el-button>
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
    <!-- 心愿完整内容弹框 -->
    <div class="wishDialog" v-if="showWishContent">
      <div class="imgWrap" v-if="wishContent.imageList.length>0">
        <img
          style="width:400px;"
          preview="1"
          v-for="(item,index) in wishContent.imageList"
          :key="index"
          :src="item.imageUrl"
        />
      </div>
      <div class="noImg" v-else>暂无图片</div>
      <div class="wishContent">{{wishContent.wishContent}}</div>
      <div class="wishContentBtn">
        <el-button type="primary" @click="closeWishContent">确 定</el-button>
      </div>
    </div>

    <!-- 选择商品弹窗 -->
    <chooseGoodsPop ref="chooseGoods" @satisfyWish="satisfyWish(arguments)"></chooseGoodsPop>
  </div>
</template>
<script>
import chooseGoodsPop from "./common/selectProduct";
import {
  wishQueryPageList,
  wishQueryDetail,
  matchedGoods,
  exportWishGoodsExcel
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
          label: "全部"
        },
        {
          value: "1",
          label: "心愿满足中"
        },
        {
          value: "2",
          label: "心愿已满足"
        },
        {
          value: "3",
          label: "已删除"
        }
      ],
      status: "", // 状态
      tableData: [],
      showWishContent: false //是否显示心愿完整内容弹框
    };
  },
  components: {
    chooseGoodsPop
  },
  filters: {
    getDateShow: function(value) {
      let dt = new Date(value);
      let y = dt.getFullYear();
      let m = dt.getMonth() + 1;
      let d = dt.getDate();
      let h = dt.getHours();
      let mi = dt.getMinutes();
      y = y < 10 ? "0" + y : y;
      m = m < 10 ? "0" + m : m;
      d = d < 10 ? "0" + d : d;
      h = h < 10 ? "0" + h : h;
      mi = mi < 10 ? "0" + mi : mi;
      return `${y}-${m}-${d} ${h}:${mi}`;
    }
  },
  created() {
    this.search(1);
    this.$store.commit("showMask", false);
  },
  methods: {
    // 搜索
    search(pageNumber) {
      let data = {
        pageNumber: pageNumber,
        pageSize: 10,
        beginTime: this.startTime,
        endTime: this.endTime,
        mobileNumber: this.tel,
        status: this.status
      };
      wishQueryPageList({ params: data }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.tableData = res.data.content.items;
          this.totalSize = res.data.content.totalSize;
          this.currentPage = pageNumber;
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
          status: this.status
        }
      });
      window.open(routeData.href, "_blank");
    },

    // 查看心愿完整内容
    openWishContent(id) {
      wishQueryDetail(`?id=${id}`).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.wishContent = res.data.content;
          this.$store.commit("showMask", true);
          this.showWishContent = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 关闭心愿完整内容
    closeWishContent() {
      this.$store.commit("showMask", false);
      this.showWishContent = false;
    },

    // 满足心愿
    chooseGoodsfocus(id) {
      this.$refs.chooseGoods.open(1);
      this.id = id;
    },

    // 接收子组件的值
    satisfyWish(argument) {
      console.log(argument[0]);
      // 满足心愿
      matchedGoods(`?id=${this.id}&&matchedGoodsId=${argument[0]}`).then(
        res => {
          if (res.data.messageCode == "MSG_1001") {
            this.$message.success("保存成功");
            this.search(1);
          } else {
            this.$message.error(res.data.message);
          }
        }
      );
    }
  }
};
</script>
<style lang="less" scoped>
.wishDialog {
  max-width: 800px;
  min-width: 400px;
  border-radius: 4px;
  background-color: #fff;
  padding: 10px 0px;
  position: fixed;
  top: 22%;
  left: 32%;
  z-index: 100;
  .imgWrap {
    max-width: 800px;
    min-width: 400px;
    height: 200px;
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    align-items: center;
    img {
      min-width: 200px;
      max-width: 200px;
      height: 200px;
    }
  }
  .noImg {
    max-width: 800px;
    min-width: 400px;
    height: 200px;
    line-height: 200px;
    text-align: center;
    color: #999;
  }
  .wishContent {
    width: 100%;
    padding: 10px;
    word-wrap: break-word;
  }
  .wishContentBtn {
    width: 100%;
    display: flex;
    margin-top: 4px;
    justify-content: center;
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