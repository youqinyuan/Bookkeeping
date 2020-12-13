<template>
  <div class="forumComments">
    <div class="searchBox">
      <span>评论人手机号：</span>
      <el-input v-model="form.mobileNumber" style="width: 130px"></el-input>
      <span style="margin-left: 10px">评论时间：</span>
      <el-date-picker v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <span style="margin-left: 10px">评论内容：</span>
      <el-input v-model="form.content" style="width: 400px"></el-input>
      <el-button type="primary" style="margin-left: 10px" @click="search(1)">搜索</el-button>
      <el-button type="primary" @click="removeListForumComment">删除</el-button>
    </div>
    <div class="tableBox">
      <el-table :data="tableData" ref="table" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="mobileNumber" label="评论人手机号" width="140" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="评论时间" width="200" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评论内容" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="" label="操作" align="center" width="160">
          <template slot-scope="scope">
            <el-button type="text" @click="delComments(scope.row.id)">删除评论</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="totalSizeBox">
      <span>总计：{{ totalSize }}条</span>
      <el-pagination background layout="prev, pager, next" :total="totalSize" :page-size="10"
        :current-page="currentPage" @current-change="pageChange($event)">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import {findPageListForumComment,removeForumComment,removeListForumComment} from '@/network/api'
  export default {
    data() {
      return {
        totalSize: 0,
        currentPage: 1,
        form: {
          pageSize:10,
          mobileNumber:'',
          beginTime:'',
          endTime:'',
          content:'',
        },
        time: "",
        tableData: [],
      multipleSelectionAll: [], //所有选中的数据包含跨页数据
      multipleSelection: [], // 当前页选中的数据
      idKey: "id", // 标识列表数据中每一行的唯一键的名称
      };
    },
    created(){
      this.search(1)
    },
    methods: {
      // 搜索
      search(val) {
        let parms = JSON.parse(JSON.stringify(this.form));
        if(this.time){
          parms.beginTime = this.time[0].getTime();
          parms.endTime = this.time[1].getTime();
        }
        parms.pageNumber = val ? val : this.currentPage;
        findPageListForumComment({params:parms}).then(res=>{
          if (res.data.messageCode == "MSG_1001") {
            let content = res.data.content;
            this.tableData = content.items;
            this.totalSize = content.totalSize;
            this.currentPage = val ? val : this.currentPage;
             setTimeout(() => {
            this.setSelectRow();
          }, 20);
          } else {
            this.$message.error(res.data.message);
          }
        })
      },
      // 选择框选择事件
      handleSelectionChange(val) {
        this.multipleSelection = val;
        //实时记录选中的数据
      setTimeout(() => {
        this.changePageCoreRecordData();
      }, 20);
      },
      // 设置选中的方法
    setSelectRow() {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return;
      }
      // 标识当前行的唯一键的名称
      let idKey = this.idKey;
      this.selectAllIds = [];
      let that = this;
      this.multipleSelectionAll.forEach(row => {
        this.selectAllIds.push(row[idKey]);
      });
      this.$refs.table.clearSelection();
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.selectAllIds.indexOf(this.tableData[i][idKey]) >= 0) {
          // 设置选中，记住table组件需要使用ref="table"
          this.$refs.table.toggleRowSelection(this.tableData[i], true);
        }
      }
    },
    // 记忆选择方法（核心部分）
    changePageCoreRecordData() {
      // 标识当前行的唯一键的名称
      let idKey = this.idKey;
      let that = this;
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.multipleSelectionAll.length <= 0) {
        this.multipleSelectionAll = this.multipleSelection;
        return;
      }
      // 总选择里面的key集合
      let selectAllIds = [];
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      let selectIds = [];
      // 获取当前页选中的id
      this.multipleSelection.forEach(row => {
        selectIds.push(row[idKey]);
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          that.multipleSelectionAll.push(row);
        }
      });
      let noSelectIds = [];
      // 得到当前页没有选中的id
      this.tableData.forEach(row => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey]);
        }
      });
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < that.multipleSelectionAll.length; i++) {
            if (that.multipleSelectionAll[i][idKey] == id) {
              // 如果总选择中有未被选中的，那么就删除这条
              that.multipleSelectionAll.splice(i, 1);
              break;
            }
          }
        }
      });
    },
      // 删除评论-批量
      removeListForumComment(){
        if(this.multipleSelectionAll.length == 0){
          this.$message.error('请选择要删除的数据')
          return;
        }
        let ids = [];
        this.multipleSelectionAll.forEach(val=>{
          ids.push(val.id)
        })
        ids = ids.join(',');
        let parms = {
          ids:ids
        }
        removeListForumComment(this.qs.stringify(parms)).then(res=>{
          if (res.data.messageCode == "MSG_1001") {
            this.$message.success('删除成功')
            this.multipleSelection = []
            this.multipleSelectionAll = []
            this.search()
          } else {
            this.$message.error(res.data.message);
          }
        })
      },
      // 删除评论-单个
      delComments(id) {
        let parms = {
          id:id
        }
        removeForumComment(this.qs.stringify(parms)).then(res=>{
          if (res.data.messageCode == "MSG_1001") {
            this.$message.success('删除成功')
            this.search()
          } else {
            this.$message.error(res.data.message);
          }
        })
      },
      // 分页改变事件
      pageChange(val) {
        this.currentPage = val;
        this.search(val);
      },
    },
  };

</script>
<style lang="less" scoped>
  .forumComments {
    padding: 20px;
    box-sizing: border-box;
  }

  .tableBox {
    margin-top: 40px;
  }

  .totalSizeBox {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

</style>
