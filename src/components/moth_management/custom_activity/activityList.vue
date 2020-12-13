<template>
  <div class="activityList">
    <div class="searchBox">
      <span>请输入活动名称：</span>
      <el-input v-model="name" style="width:180px;"></el-input>
      <span style="margin-left:20px;">活动状态：</span>
      <el-select v-model="status" style="width:120px;">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span style="margin-left:20px;">活动时间：</span>
      <el-date-picker
        v-model="time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-button type="primary" style="margin-left:20px;" @click="search(1)">搜索</el-button>
      <el-button type="success" @click="navAddActivity(1)">添加活动</el-button>
    </div>
    <div class="tableBox">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        border
      >
        <el-table-column prop="name" label="活动名称" align="center"></el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{ scope.row.createTime | dateFormat }}</template>
        </el-table-column>
        <el-table-column label="活动时间" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              type="text"
            >{{scope.row.beginTime | dateFormat}}-{{scope.row.endTime | dateFormat}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="活动状态" align="center" width="120px">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.status == 1">未开始</el-button>
            <el-button type="text" v-if="scope.row.status == 2">进行中</el-button>
            <el-button type="text" v-if="scope.row.status == 3">已结束</el-button>
            <el-button type="text" v-if="scope.row.status == 4">已删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="scope.row.status == 1"
              @click="changeStatus(scope.row.id,2)"
            >开启</el-button>
            <el-button
              type="text"
              v-if="scope.row.status == 2"
              @click="changeStatus(scope.row.id,3)"
            >结束</el-button>
            <el-button type="text" @click="navAddActivity(2,scope.row.id)">查看</el-button>
            <el-button
              type="text"
              v-if="scope.row.status == 1 || scope.row.status == 3"
              @click="changeStatus(scope.row.id,4)"
            >删除</el-button>
            <el-button
              type="text"
              v-if="scope.row.status == 1 || scope.row.status == 3"
              @click="navAddActivity(3,scope.row.id)"
            >修改</el-button>
            <el-button
              type="text"
              v-if="scope.row.status == 2"
              @click="copyConnect(scope.row.id)"
            >复制链接</el-button>
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
        :current-page.sync="currentPage"
        page-size.sync="10"
        @current-change="pageChange($event)"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import {
  findCustomizeActivityList,
  updateCustomizeActivityStatus
} from "@/network/api";
export default {
  data() {
    return {
      id: "",
      name: "",
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 1,
          label: "未开始"
        },
        {
          value: 2,
          label: "进行中"
        },
        {
          value: 3,
          label: "已结束"
        },
        {
          value: 4,
          label: "已删除"
        }
      ],
      status: "",
      time: "",
      totalSize: 0,
      currentPage: 1,
      tableData: []
    };
  },
  created() {
    this.search(1);
  },
  methods: {
    // 搜索
    search(val) {
      let beginTime = "";
      let endTime = "";
      if (this.time) {
        beginTime = this.time[0].getTime();
        endTime = this.time[1].getTime();
      }
      let parms = {
        pageNumber: val ? val : this.currentPage,
        pageSize: 10,
        name: this.name,
        beginTime: beginTime,
        endTime: endTime,
        status: this.status
      };
      findCustomizeActivityList({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.totalSize = content.totalSize;
          this.tableData = content.items;
          this.currentPage = val ? val : this.currentPage;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 跳转到添加活动页面,type:1-添加，2-查看，3-修改
    navAddActivity(type, id) {
      this.$router.push({
        path: "/add_custom_activity",
        query: {
          type: type,
          id: id,
          fromActivityList: true
        }
      });
    },
    // 修改状态 status:2-开启，3-结束，4-删除
    changeStatus(id, status) {
      let type;
      switch (status) {
        case 2:
          type = "开启";
          break;
        case 3:
          type = "结束";
          break;
        case 4:
          type = "删除";
          break;
      }
      this.$confirm(`确定${type}活动?`, "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        closeOnClickModal: false
      })
        .then(() => {
          let parms = {
            id: id,
            status: status
          };
          updateCustomizeActivityStatus(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("操作成功");
              this.search();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 复制链接
    copyConnect(e) {
      this.$copyText(`https://xuncaoji.net/#/customEvent/${e}`).then(
        res => {
          this.$message.success("已成功复制，可直接去粘贴");
        },
        err => {
          this.$message.error("复制失败");
        }
      );
    },
    // 翻页
    pageChange(val) {
      this.currentPage = val;
      this.search();
    }
  }
};
</script>
<style lang="less" scoped>
.activityList {
  padding: 20px;
  box-sizing: border-box;
  .tableBox {
    margin-top: 40px;
  }
  .totalBox {
    width: 100%;
    margin-top: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>