<template>
  <div class="notice">
    <div class="btnBox">
      <el-button type="primary" @click="addNotice">添加公告</el-button>
    </div>
    <div class="tableBox">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="title" label="公告标题" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column
          prop="content"
          label="公告内容"
          align="center"
          :show-overflow-tooltip="true"
          width="600"
        ></el-table-column>
        <el-table-column prop label="公告时间" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.beginTime | dateFormat}}</span>
            <span>-</span>
            <span>{{scope.row.endTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="公告状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">展示中</span>
            <span v-if="scope.row.status == 2">未展示</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="changeNotice(scope.row)">修改</el-button>
            <el-button type="text" @click="deletedNotice(scope.row)">删除</el-button>
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

    <!-- 添加或修改公告弹框 -->
    <el-dialog title="添加公告" :visible.sync="noticeDialog" :close-on-click-modal="false">
      <span>同一时间内最多可推广3条公告内容</span>
      <el-form :model="form" style="margin-top:20px">
        <el-form-item label="公告标题：">
          <el-input v-model="form.title" autocomplete="off" :maxlength="20" style="width:80%"></el-input>
        </el-form-item>
        <el-form-item label="公告内容：">
          <el-input
            v-model="form.content"
            autocomplete="off"
            :maxlength="100"
            type="textarea"
            style="width:80%"
          ></el-input>
        </el-form-item>
        <el-form-item label="公告时间：">
          <el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @blur="selectTime"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="noticeDialog = false">取 消</el-button>
        <el-button type="primary" @click="preservation">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  findPageListNotice,
  findDetailNotice,
  addOrUpdateNotice,
  removeNotice
} from "@/network/api";
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      form: {
        id: "",
        title: "",
        content: "",
        beginTime: "",
        endTime: ""
      },
      noticeDialog: false, // 是否显示添加/修改公告弹窗
      totalSize: 0, // 总计条数
      time: "", // 时间
      beginTime: "",
      endTime: ""
    };
  },
  created() {
    this.findPageListNotice(1);
  },
  methods: {
    // 查询公告
    findPageListNotice(val) {
      let param = {
        pageNumber: val,
        pageSize: 10
      };
      findPageListNotice(param).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          if (res.data.content) {
            this.tableData = res.data.content.items;
            this.totalSize = res.data.content.totalSize;
            this.currentPage = val;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 添加公告
    addNotice() {
      if (this.totalSize >= 1000) {
        this.$message.error("公告最多可创建1000个");
        return;
      }
      this.form = {
        id: "",
        title: "",
        content: "",
        beginTime: "",
        endTime: ""
      };
      this.time = "";
      this.noticeDialog = true;
    },
    // 选择时间和日期
    selectTime() {
      this.form.beginTime = this.time[0].getTime();
      this.form.endTime = this.time[1].getTime();
    },
    // 修改
    changeNotice(rows) {
      this.form.id = rows.id;
      this.form.title = rows.title;
      this.form.content = rows.content;
      this.time = [rows.beginTime, rows.endTime];
      this.form.beginTime = rows.beginTime;
      this.form.endTime = rows.endTime;
      this.noticeDialog = true;
    },
    // 删除
    deletedNotice(rows) {
      console.log(rows);
      this.$confirm("是否删除此公告？", "删除公告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          let param = {
            id: rows.id
          };
          removeNotice(this.qs.stringify(param)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("删除成功");
              this.findPageListNotice(1);
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 保存
    preservation() {
      let form = this.form;
      if (!form.title || !this.time || !form.content) {
        this.$message.error("请填写完表单全部内容");
        return;
      }
      addOrUpdateNotice(form).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("保存成功");
          this.findPageListNotice(1);
        } else {
          this.$message.error(res.data.message);
        }
      });
      this.noticeDialog = false;
    },
    // 翻页
    pageChange(val) {
      this.search(val);
      this.currentPage = val;
    }
  }
};
</script>
<style lang="less" scoped>
.notice {
  padding: 20px;
  box-sizing: border-box;
  .btnBox {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: flex-end;
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