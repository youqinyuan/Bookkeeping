<template>
  <div class="navigation">
    <div class="btnBox">
      <el-button type="primary" @click="dialogVisible = true">添加导航</el-button>
    </div>
    <div class="tableBox">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="title" label="导航名称" align="center"></el-table-column>
        <el-table-column prop="name" label="入口图" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.iconUrl" />
          </template>
        </el-table-column>
        <el-table-column prop="pageName" label="路径" align="center"></el-table-column>
        <el-table-column prop="orderNo" label="排序" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="setSortNum(scope.row.id)">{{scope.row.orderNo}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">已上架</span>
            <span v-if="scope.row.status == 2">未上架</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="changeNavigation(scope.row.id)">修改</el-button>
            <el-button
              type="text"
              @click="changeNavigationStatus(scope.row.id,1)"
              v-if="scope.row.status == 2"
            >上架</el-button>
            <el-button
              type="text"
              @click="changeNavigationStatus(scope.row.id,2)"
              v-if="scope.row.status == 1"
            >下架</el-button>
            <el-button type="text" @click="deletedNavigation(scope.row.id)">删除</el-button>
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
    <!-- 添加活动导航弹窗 -->
    <el-dialog
      title="选择导航样式"
      :visible.sync="dialogVisible"
      width="400px"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="rectangle">
        <div>示例图</div>
        <div>长方形样式占用活动专区1行，且为固定样式不支持调整顺序</div>
      </div>
      <el-radio v-model="showStyle" :label="1" style="margin-top:15px">选择这个长方形样式-此样式为1行1个</el-radio>
      <div class="square">
        <div class="squareItem">示例图</div>
        <div class="squareItem">示例图</div>
      </div>
      <el-radio v-model="showStyle" :label="2" style="margin-top:15px">选择这个正方形样式-此样式为1行2个</el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNavigation">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  findNavigation,
  updateOrderNoNavigation,
  updateStatusNavigation,
  removeNavigation
} from "@/network/api";
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      totalSize: 0, // 总计条数
      dialogVisible: false,
      showStyle: ""
    };
  },
  created() {
    this.findNavigation(1);
  },
  methods: {
    // 查询导航列表
    findNavigation(val) {
      let params = {
        pageNumber: val,
        pageSize: 10,
        navType: 2
      };
      findNavigation(params).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          if (res.data.content) {
            let data = res.data.content;
            this.totalSize = data.totalSize;
            this.tableData = data.items;
            this.currentPage = val;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 设置排序值
    setSortNum(id) {
      this.$prompt("排序值越小越靠前，排序值不可重复", "设置排序值", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        showClose: false,
        inputPlaceholder: "请添加排序值",
        inputPattern: /^[0-9]\d*$/,
        inputErrorMessage: "仅限数字"
      })
        .then(({ value }) => {
          if (value.length > 6) {
            this.$message.error("排序值输入位数最多为6位");
            return false;
          }
          let params = {
            id: id,
            orderNo: value
          };
          updateOrderNoNavigation(this.qs.stringify(params)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.findNavigation(1);
              this.$message.success("修改成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 添加导航
    addNavigation() {
      if (!this.showStyle) {
        this.$message.error("请选择导航样式");
        return;
      }
      // type 1-添加或修改图标导航 2-添加或修改长方形样式活动导航 3-添加或修改正方形样式活动导航
      let type;
      if (this.showStyle == 1) {
        type = 2;
      } else if (this.showStyle == 2) {
        type = 3;
      }
      this.$router.push({
        path: "/addNavigation",
        query: {
          type: type,
          showStyle: this.showStyle
        }
      });
    },
    // 修改
    changeNavigation(id) {
      // type 1-添加或修改图标导航 2-添加或修改长方形样式活动导航 3-添加或修改正方形样式活动导航
      this.$router.push({
        path: "/addNavigation",
        query: {
          type: 1,
          id: id
        }
      });
    },
    // 上架或者下架
    changeNavigationStatus(id, status) {
      if (status == 1) {
        // 上架
        var tips = "导航营销上架";
        var tipsContent =
          "是否上架此导航入口？上架前请检查功能是否配置完成，以及前端的视觉效果。";
      } else if (status == 2) {
        // 下架
        var tips = "导航营销下架";
        var tipsContent = "是否下架此导航入口？下架前请确保前端布局完整。";
      }
      this.$confirm(tipsContent, tips, {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          let params = {
            id: id,
            status: status
          };
          updateStatusNavigation(this.qs.stringify(params)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("修改成功");
              this.findNavigation(1);
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 删除导航
    deletedNavigation(id) {
      this.$confirm("是否删除此导航入口？", "导航营销删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          let data = {
            id: id
          };
          removeNavigation(this.qs.stringify(data)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("删除成功");
              this.findNavigation(1);
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 翻页
    pageChange(val) {
      this.findNavigation(val);
      this.currentPage = val;
    }
  }
};
</script>
<style lang="less" scoped>
.navigation {
  padding: 20px;
  box-sizing: border-box;
  .btnBox {
    width: 100%;
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
  .rectangle {
    width: 360px;
    height: 80px;
    margin: 0 auto;
    border: 1px solid #000;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    div {
      font-size: 12px;
      color: #666;
      width: 100%;
      text-align: center;
    }
  }
  .square {
    width: 360px;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    div {
      width: 160px;
      height: 160px;
      border-radius: 10px;
      border: 1px solid #000;
      text-align: center;
      line-height: 160px;
      font-size: 12px;
      color: #666;
    }
  }
}
</style>