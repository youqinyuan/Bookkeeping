<template>
  <div class="agentRule">
    <div class="title">
      <span>代理商角色</span>
      <el-button type="primary" @click="goAddAgentPage(1)">添加代理商角色</el-button>
    </div>
    <div class="content">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="roleName" label></el-table-column>
        <el-table-column prop="category" label>
          <template slot-scope="scope">
            <span v-if="scope.row.category == 1" style="color:#F59A23">独家代理</span>
            <span v-if="scope.row.category == 2" style="color:#93E60F">非独家代理</span>
          </template>
        </el-table-column>
        <el-table-column prop label width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="goAddAgentPage(2,scope.row.id)">查看</el-button>
            <el-button type="text" @click="goAddAgentPage(3,scope.row.id)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { queryAgentRole } from "@/network/api";
export default {
  data() {
    return {
      tableData: []
    };
  },
  created() {
    this.queryAgentRole();
  },
  methods: {
    // 获取代理商角色列表
    queryAgentRole() {
      queryAgentRole(`?category=${0}`).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          this.tableData = res.data.content;
          console.log(this.tableData);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 跳转到添加代理角色页面
    goAddAgentPage(index, id) {
      // index:跳转类型 1-添加 2-查看 3-修改
      this.$router.push({
        path: "/addAgent",
        query: {
          index: index,
          id: id
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.agentRule {
  padding: 20px;
  box-sizing: border-box;
  .title {
    width: 600px;
    font-weight: bold;
    font-size: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 5px;
    box-sizing: border-box;
    border-bottom: 1px solid #ebeef5;
  }
  .content {
    width: 600px;
  }
}
</style>
<style lang="less">
.agentRule {
  .el-table td,
  .el-table th.is-leaf {
    border: none !important;
  }
}
</style>