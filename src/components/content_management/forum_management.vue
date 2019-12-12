<template>
  <div class="forum_management">
    <div class="top">
      <span>发表用户手机号：</span>
      <el-input v-model="mobileNumber" placeholder style="width:180px;"></el-input>
      <span style="margin-left:20px">发表时间：</span>
      <el-date-picker
        v-model="beginTime"
        type="date"
        @change="beginTimeChange"
        placeholder="选择开始时间"
      ></el-date-picker>
      <span>至</span>
      <el-date-picker v-model="endTime" type="date" @change="endTimeChange" placeholder="选择结束时间"></el-date-picker>
      <span style="margin-left:20px">贴子种类：</span>
      <el-select v-model="postType" placeholder="请选择" style="width:120px;">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button type="primary" style="margin-left:20px" @click="findPageListForum(1)">搜索</el-button>
    </div>
    <div class="tableBox">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column
          prop="content"
          label="内容"
          align="center"
          :show-overflow-tooltip="true"
          width="500"
        ></el-table-column>
        <el-table-column prop="type" label="贴子种类" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 1">普通贴</span>
            <span v-if="scope.row.type == 2">卖贴</span>
            <span v-if="scope.row.type == 3">买贴</span>
          </template>
        </el-table-column>
        <el-table-column prop="commentCount" label="留言数量" align="center"></el-table-column>
        <el-table-column prop="commentUserCount" label="留言人数" align="center"></el-table-column>
        <el-table-column prop="mobileNumber" label="发表用户" align="center"></el-table-column>
        <el-table-column prop="createTime" label="发表时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.isTop == 2" @click="putTop(scope.row.id)">置顶</el-button>
            <el-button
              type="text"
              v-if="scope.row.isTop == 1"
              @click="putTopAgain(scope.row.id)"
            >已置顶</el-button>
            <el-button type="text" @click="seeDetail(scope.row.id)">查看详情</el-button>
            <el-button type="text" @click="deleted(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="totalNumBox">
      <span>总计：{{totalSize}}条</span>
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
      <span style="font-size:16px;">请选择操作</span>
      <span slot="footer" class="dialog-footer" style="display:flex;justify-content: center;">
        <el-button @click="updateIsTopForum(id, 2)">取消置顶</el-button>
        <el-button type="primary" @click="updateIsTopForum(id, 1)">再次置顶</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  findPageListForum,
  removeForum,
  updateIsTopForum
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
          label: "全部"
        },
        {
          value: "1",
          label: "普通贴"
        },
        {
          value: "2",
          label: "卖贴"
        },
        {
          value: "3",
          label: "买贴"
        }
      ],
      postType: "", // 贴子种类
      dialogVisible: false
    };
  },
  created() {
    this.findPageListForum(1);
  },
  methods: {
    // 获取论坛列表
    findPageListForum(val) {
      let params = {
        pageNumber: val,
        pageSize: 10,
        beginTime: this.beginTime,
        endTime: this.endTime,
        type: this.postType,
        mobileNumber: this.mobileNumber
      };
      findPageListForum({ params: params }).then(res => {
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
        isTop: isTop
      };
      updateIsTopForum(data).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("操作成功");
          this.findPageListForum(1);
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
        center: true
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
          id: id
        }
      });
    },
    // 删除贴子
    deleted(id) {
      this.$confirm("确定删除吗？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          let data = {
            id: id
          };
          removeForum(this.qs.stringify(data)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.findPageListForum(1);
              this.$message.success("删除成功");
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
    }
  }
};
</script>
<style lang="less" scoped>
.forum_management {
  padding: 20px;
  box-sizing: border-box;
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