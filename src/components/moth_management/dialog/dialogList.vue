<template>
  <div class="dialogList">
    <div class="searchBox">
      <span>弹浮窗名称：</span>
      <el-input v-model="title" style="width:200px;"></el-input>
      <span style="margin-left:20px;">触达类型：</span>
      <el-select v-model="navType" style="width:100px;">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span style="margin-left:20px;">是否上架中：</span>
      <el-select v-model="status" style="width:100px;">
        <el-option
          v-for="item in options1"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button type="primary" style="margin-left:40px;" @click="search(1)">搜索</el-button>
      <el-button type="primary" @click="addDialog(1)">新建弹窗</el-button>
      <el-button type="primary" @click="addDialog(2)">新建浮窗</el-button>
    </div>
    <div class="tableBox">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="title" label="名称" align="center"></el-table-column>
        <el-table-column prop label="类型" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.navType == 1">弹窗</span>
            <span v-if="scope.row.navType == 2">浮窗</span>
          </template>
        </el-table-column>
        <el-table-column prop="displayPageString" label="显示页面" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="displayUserType" label="显示用户" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.displayUserType == 1">全部用户</span>
            <span v-if="scope.row.displayUserType == 2">新注册用户</span>
            <span v-if="scope.row.displayUserType == 3">导入的用户</span>
          </template>
        </el-table-column>
        <el-table-column prop="pageName" label="跳转路径" align="center"></el-table-column>
        <el-table-column prop label="是否上架" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">上架中</span>
            <span v-if="scope.row.status == 2">未上架</span>
          </template>
        </el-table-column>
        <el-table-column prop label="优先级" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="updateOrderNo(scope.row.id)">{{scope.row.orderNo}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row.navType,scope.row.id)">编辑</el-button>
            <el-button
              type="text"
              v-if="scope.row.status == 2"
              @click="updateStatus(1,scope.row.id)"
            >上架</el-button>
            <el-button
              type="text"
              v-if="scope.row.status == 1"
              @click="updateStatus(2,scope.row.id)"
            >下架</el-button>
            <el-button type="text" @click="del(scope.row.id)">删除</el-button>
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
        :page-size="10"
        :current-page.sync="currentPage"
        @current-change="pageChange($event)"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import {
  findPageList_floating,
  updateStatus_floating,
  remove_floating,
  updateOrderNo_floating
} from "@/network/api";
export default {
  data() {
    return {
      currentPage: 1,
      totalSize: 0,
      tableData: [],
      title: "",
      navType: "",
      status: "",
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "弹窗"
        },
        {
          value: "2",
          label: "浮窗"
        }
      ],
      options1: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "上架中"
        },
        {
          value: "2",
          label: "未上架"
        }
      ]
    };
  },
  created() {
    this.search(1);
  },
  methods: {
    // 搜索
    search(val) {
      let parms = {
        pageNumber: val ? val : this.currentPage,
        pageSize: 15,
        title: this.title,
        navType: this.navType,
        status: this.status
      };
      findPageList_floating({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.tableData = content.items;
          this.totalSize = content.totalSize;
          this.currentPage = val ? val : this.currentPage;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 新建弹窗or浮窗
    addDialog(type) {
      // type: 1-弹窗，2-浮窗
      this.$router.push({
        path: "/addDialog",
        query: {
          type: type
        }
      });
    },
    // 修改优先级
    updateOrderNo(id) {
      this.$prompt("优先级：", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        center: true,
        inputPattern: /^[1-9]\d*$/,
        inputErrorMessage: "仅支持正整数"
      })
        .then(({ value }) => {
          let parms = {
            id: id,
            orderNo: value
          };
          updateOrderNo_floating(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.search();
              this.$message.success("操作成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 编辑
    edit(type, id) {
      // type: 1-弹窗，2-浮窗
      this.$router.push({
        path: "/addDialog",
        query: {
          type: type,
          id: id
        }
      });
    },
    // 上架/下架
    updateStatus(status, id) {
      let tips =
        status == 1 ? "上架后将在用户端显示" : "下架后将不在用户端显示";
      this.$confirm(tips, "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        center: true
      })
        .then(() => {
          let parms = {
            id: id,
            status: status
          };
          updateStatus_floating(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.search();
              this.$message.success("操作成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 删除
    del(id) {
      this.$confirm("", "确定要删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false,
        center: true,
        closeOnClickModal: false
      })
        .then(() => {
          let parms = {
            id: id
          };
          remove_floating(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.search();
              this.$message.success("删除成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 翻页
    pageChange(val) {
      this.currentPage = val;
      this.search(val);
    }
  }
};
</script>
<style lang="less" scoped>
.dialogList {
  padding: 20px;
  box-sizing: border-box;
  .tableBox {
    margin-top: 40px;
  }
  .totalBox {
    width: 100%;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>