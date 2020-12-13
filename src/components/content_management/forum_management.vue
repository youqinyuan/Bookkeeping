<template>
  <div class="forum_management">
    <div class="top">
      <div>
        <span>发贴人手机号：</span>
        <el-input
          v-model="mobileNumber"
          placeholder
          style="width: 180px"
        ></el-input>
      </div>
      <div>
        <span>发贴时间：</span>
        <el-date-picker
          v-model="beginTime"
          type="date"
          @change="beginTimeChange"
          placeholder="选择开始时间"
        ></el-date-picker>
        <span>至</span>
        <el-date-picker
          v-model="endTime"
          type="date"
          @change="endTimeChange"
          placeholder="选择结束时间"
        ></el-date-picker>
      </div>
      <div>
        <span>贴子种类：</span>
        <el-select v-model="type" style="width: 120px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div>
        <span>贴子状态：</span>
        <el-select v-model="status" style="width: 120px">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div>
        <span>发贴人上级：</span>
        <el-input
          v-model="parentMobileNumber"
          placeholder
          style="width: 180px"
        ></el-input>
      </div>
      <div>
        <span>展示状态：</span>
        <el-select v-model="isTop" style="width: 120px">
          <el-option
            v-for="item in isTopOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="visible" style="width: 120px">
          <el-option
            v-for="item in visibleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <el-button type="primary" @click="findPageListForum(1)">搜索</el-button>
    </div>
    <div class="tableBox">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column
          prop="content"
          label="内容"
          align="center"
          :show-overflow-tooltip="true"
          width="500"
        >
        </el-table-column>
        <el-table-column prop="type" label="贴子种类" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.type | postType }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="贴子状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | postStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="mobileNumber"
          label="发贴用户"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="parentMobileNumber"
          label="发贴用户上级"
          align="center"
          width="120px"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="发贴时间"
          align="center"
          width="180px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="cashBackAmount"
          label="待返金额"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="periodLeft"
          label="待返剩余期数"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="expectAmount"
          label="待返售价"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="annualizedRate"
          label="年化率"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="seedAmount"
          label="种子曝光数量"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="validDate"
          label="剩余展示时间"
          align="center"
          width="180px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.validDate">{{
              scope.row.validDate | dateFormat
            }}</span>
            <span v-else>{{ scope.row.validDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="scope.row.isTop == 2"
              @click="putTop(scope.row.id)"
              >置顶</el-button
            >
            <el-button
              type="text"
              v-if="scope.row.isTop == 1"
              @click="putTopAgain(scope.row.id)"
              >已置顶</el-button
            >
            <el-button type="text" @click="seeDetail(scope.row.id)"
              >查看详情</el-button
            >
            <!-- <el-button type="text" @click="deleted(scope.row.id)">删除</el-button> -->
            <el-button
              type="text"
              v-if="scope.row.visible == 2"
              @click="changeVisible(scope.row.id, 1)"
              >展示</el-button
            >
            <el-button
              type="text"
              v-if="scope.row.visible == 1"
              @click="changeVisible(scope.row.id, 2)"
              >隐藏</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="totalNumBox">
      <span>总计：{{ totalSize }}条</span>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalSize"
        :page-size="10"
        :current-page="currentPage"
        @current-change="pageChange($event)"
      ></el-pagination>
    </div>
    <!-- 已置顶弹出框 -->
    <el-dialog title :visible.sync="dialogVisible" width="300px" align="center">
      <span style="font-size: 16px">请选择操作</span>
      <span
        slot="footer"
        class="dialog-footer"
        style="display: flex; justify-content: center"
      >
        <el-button @click="updateIsTopForum(id, 2)">取消置顶</el-button>
        <el-button type="primary" @click="updateIsTopForum(id, 1)"
          >再次置顶</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  findPageListForum,
  removeForum,
  updateIsTopForum,
  updateVisibleForum,
} from "@/network/api";
export default {
  data() {
    return {
      id: "",
      tableData: [],
      totalSize: 0, // 总计条数
      currentPage: 1,
      mobileNumber: "", // 发表用户
      beginTime: "", //开始时间
      endTime: "", //结束时间
      options: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "1",
          label: "普通贴",
        },
        {
          value: "2",
          label: "返现卖贴",
        },
        {
          value: "3",
          label: "返现买贴",
        },
        {
          value: "4",
          label: "预售订单",
        },
        {
          value: "5",
          label: "商品卖贴",
        },
        {
          value: "6",
          label: "商品买贴",
        },
        {
          value: "7",
          label: "提期贴",
        },
      ],
      type: "", // 贴子种类
      statusOptions: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "1",
          label: "草稿",
        },
        {
          value: "2",
          label: "已发布(未交易)",
        },
        {
          value: "3",
          label: "已卖出(交易完成)",
        },
        {
          value: "4",
          label: "金额已变更",
        },
        {
          value: "5",
          label: "已过期",
        },
        {
          value: "6",
          label: "已预订(交易中)",
        },
        {
          value: "7",
          label: "自行关闭交易（已撤销）",
        },
        {
          value: "8",
          label: "未付款交易关闭",
        },
        {
          value: "9",
          label: "超时未支付关闭交易",
        },
      ],
      status: "", // 贴子状态
      parentMobileNumber: "",
      isTopOptions: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "1",
          label: "已置顶",
        },
        {
          value: "2",
          label: "未置顶",
        },
      ],
      isTop: "",
      visibleOptions: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "2",
          label: "已隐藏",
        },
        {
          value: "1",
          label: "未隐藏",
        },
      ],
      visible: "",
      dialogVisible: false,
    };
  },
  // 路由进入时 判断是否从详情页返回
  beforeRouteEnter(to, from, next) {
    if (from.path === "/forumDetail") {
      // 查看是否记录了页面
      let page = sessionStorage.getItem("page");
      page = page ? JSON.parse(page) : 1;
      let type = sessionStorage.getItem("type");
      let beginTime = sessionStorage.getItem("beginTime");
      let endTime = sessionStorage.getItem("endTime");
      let mobileNumber = sessionStorage.getItem("mobileNumber");
      next((vm) => {
        vm.type = type ? type : "";
        vm.beginTime = beginTime ? JSON.parse(beginTime) : "";
        vm.endTime = endTime ? JSON.parse(endTime) : "";
        vm.mobileNumber = mobileNumber ? mobileNumber : "";
        vm.findPageListForum(page);
      });
    } else {
      next((vm) => {
        vm.findPageListForum(1);
      });
    }
  },
  created() {},
  methods: {
    // 获取论坛列表
    findPageListForum(val) {
      let params = {
        pageNumber: val,
        pageSize: 10,
        beginTime: this.beginTime,
        endTime: this.endTime,
        type: this.type,
        mobileNumber: this.mobileNumber,
        status: this.status,
        parentMobileNumber: this.parentMobileNumber,
        isTop: this.isTop,
        visible: this.visible,
      };
      findPageListForum({
        params: params,
      }).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          if (res.data.content) {
            let data = res.data.content;
            this.tableData = data.items;
            this.totalSize = data.totalSize;
            this.currentPage = val;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 开始时间改变
    beginTimeChange() {
      if (!this.beginTime) return;
      this.beginTime = this.beginTime.getTime();
    },
    // 结束时间改变
    endTimeChange() {
      if (!this.endTime) return;
      this.endTime = this.endTime.getTime();
    },
    // 置顶或者取消置顶接口
    updateIsTopForum(id, isTop) {
      let data = {
        id: id,
        isTop: isTop,
      };
      updateIsTopForum(data).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("操作成功");
          this.findPageListForum(this.currentPage);
          this.dialogVisible = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 置顶
    putTop(id) {
      this.$confirm("", "确定置顶吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false,
        center: true,
      })
        .then(() => {
          this.updateIsTopForum(id, 1);
        })
        .catch(() => {});
    },
    // 已置顶
    putTopAgain(id) {
      this.dialogVisible = true;
      this.id = id;
    },
    // 查看
    seeDetail(id) {
      this.$router.push({
        path: "/forumDetail",
        query: {
          id: id,
        },
      });
      sessionStorage.setItem("page", JSON.stringify(this.currentPage));
      sessionStorage.setItem("type", this.type);
      sessionStorage.setItem("beginTime", JSON.stringify(this.beginTime));
      sessionStorage.setItem("endTime", JSON.stringify(this.endTime));
      sessionStorage.setItem("mobileNumber", this.mobileNumber);
    },

    // 删除贴子
    // deleted(id) {
    //   this.$confirm("确定删除吗？", "", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消"
    //   })
    //     .then(() => {
    //       let data = {
    //         id: id
    //       };
    //       removeForum(this.qs.stringify(data)).then(res => {
    //         if (res.data.messageCode == "MSG_1001") {
    //           this.findPageListForum(1);
    //           this.$message.success("删除成功");
    //         } else {
    //           this.$message.error(res.data.message);
    //         }
    //       });
    //     })
    //     .catch(() => {});
    // },

    // 展示或者隐藏贴子
    changeVisible(id, visible) {
      let type = visible == 1 ? "展示" : "隐藏";
      this.$confirm(`确定${type}该贴子吗?`, "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          let data = {
            id: id,
            visible: visible,
          };
          updateVisibleForum(data).then((res) => {
            if (res.data.messageCode == "MSG_1001") {
              this.findPageListForum(this.currentPage);
              this.$message.success(`${type}成功`);
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 分页改变事件
    pageChange(val) {
      this.currentPage = val;
      this.findPageListForum(val);
    },
  },
};
</script>
<style lang="less" scoped>
.forum_management {
  padding: 20px;
  box-sizing: border-box;

  .top {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    div {
      margin: 5px;
    }
  }

  .tableBox {
    width: 100%;
    margin-top: 20px;
  }

  .totalNumBox {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
  }
}
</style>
