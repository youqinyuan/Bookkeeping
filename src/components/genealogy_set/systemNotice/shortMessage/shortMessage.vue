<template>
  <div class="shortMessage">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="发送记录" name="first">
        <div class="shortMessageList">
          <div class="searchBox">
            <span>发送时间：</span>
            <el-date-picker
              v-model="time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
            <span style="margin-left:20px;">短信模板：</span>
            <el-input v-model="content" style="width:340px;" @focus="selectMb"></el-input>
            <el-button type="primary" style="margin-left:40px;" @click="search(1)">搜索</el-button>
            <el-button type="primary" @click="exportExcelTemplate">查询内容导出</el-button>
          </div>
          <div class="tableBox">
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column prop label="发送时间" width="200" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.predictSendTime | dateFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="mobileNumber" label="发送手机号" align="center"></el-table-column>
              <el-table-column prop="content" label="短信模板" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="sendCount" label="发送总条数" align="center" width="160"></el-table-column>
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
          <!-- 引入模板弹窗短信 -->
          <temp ref="temp" @func="getTemp"></temp>
        </div>
      </el-tab-pane>
      <el-tab-pane label="短信发送" name="second">
        <sendMessage></sendMessage>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { findPageListTemplate, exportExcelTemplate } from "@/network/api";
import temp from "./template";
import sendMessage from "./sendMessage";
export default {
  data() {
    return {
      activeName: "first",
      totalSize: 0,
      currentPage: 1,
      pageNumber: 1,
      content: "",
      time: "",
      tableData: []
    };
  },
  components: {
    temp,
    sendMessage
  },
  created() {
    this.search(1);
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
      this.currentPage = 1;
      if (this.activeName == "first") {
        this.search(1);
      }
    },
    // 打开选择模板弹窗
    selectMb() {
      this.$refs.temp.open(1);
    },
    // 获取模板内容
    getTemp(id, content) {
      this.content = content;
    },
    // 搜索
    search(val) {
      let beginTime, endTime;
      if (this.time) {
        beginTime = this.time[0].getTime();
        endTime = this.time[1].getTime();
      }
      let parms = {
        pageNumber: val ? val : this.pageNumber,
        pageSize: 10,
        beginTime: beginTime,
        endTime: endTime,
        content: this.content
      };
      findPageListTemplate({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.tableData = content.items;
          this.totalSize = content.totalSize;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 导出查询内容
    exportExcelTemplate() {
      let beginTime, endTime;
      if (this.time) {
        beginTime = this.time[0].getTime();
        endTime = this.time[1].getTime();
      }
      let parms = {
        beginTime: beginTime,
        endTime: endTime,
        content: this.content
      };
      exportExcelTemplate({ params: parms }).then(res => {
        this.download(res);
      });
    },
    // 下载文件
    download(data) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data.data]));
      let a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.setAttribute("download", "短信发送记录.xls");
      document.body.appendChild(a);
      a.click();
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
.shortMessage {
  padding: 20px;
  box-sizing: border-box;
  .searchBox {
    margin-top: 20px;
  }
  .tableBox {
    width: 100%;
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