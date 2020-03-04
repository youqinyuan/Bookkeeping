<template>
  <div class="newbornZone">
    <div style="font-weight:bold;margin-bottom:10px;font-size:20px;padding-bottom:10px;">商品专区</div>
    <div class="topBox">
      <span>活动状态：</span>
      <el-select v-model="status">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span style="margin-left:20px">活动时间：</span>
      <el-date-picker
        v-model="time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-button type="primary" style="margin-left:40px" @click="queryGoodsArea(1)">搜索</el-button>
      <el-button type="success" style="margin-left:40px" @click="navActives(1)">添加活动</el-button>
    </div>
    <div class="tableBox">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="活动名称"></el-table-column>
        <el-table-column prop="theme" label="活动主题"></el-table-column>
        <el-table-column prop label="活动时间" width="300px">
          <template slot-scope="scope">
            <span>{{scope.row.beginTime | dateFormat}}</span>
            <span>-</span>
            <span>{{scope.row.endTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="活动状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">未开始</span>
            <span v-if="scope.row.status == 2">进行中</span>
            <span v-if="scope.row.status == 3">已结束</span>
            <span v-if="scope.row.status == 4">已删除</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 1"
              type="text"
              @click="handleActive(2,scope.row.id)"
            >开启</el-button>
            <el-button
              v-if="scope.row.status == 2"
              type="text"
              @click="handleActive(3,scope.row.id)"
            >关闭</el-button>
            <el-button
              v-if="scope.row.status == 1 || scope.row.status == 3"
              type="text"
              @click="navActives(2,scope.row.id)"
            >修改</el-button>
            <el-button
              v-if="scope.row.status != 4"
              type="text"
              @click="navActives(3,scope.row.id)"
            >查看</el-button>
            <el-button
              v-if="scope.row.status == 1 || scope.row.status == 3"
              type="text"
              @click="handleActive(4,scope.row.id)"
            >删除</el-button>
            <el-button
              v-if="scope.row.status == 1 || scope.row.status == 2"
              type="text"
              @click="createQRCode(scope.row.id)"
            >生成二维码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="sizeBox">
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
    <!-- 生成二维码弹窗 -->
    <createQRCode ref="createQRCode"></createQRCode>
  </div>
</template>
<script>
import createQRCode from "./common/createQRCode";
import { queryGoodsArea, goodsAreaUpdateStatus } from "@/network/api";
export default {
  data() {
    return {
      totalSize: 0,
      currentPage: 1,
      options: [
        {
          value: null,
          label: "全部"
        },
        {
          value: "1",
          label: "未开始"
        },
        {
          value: "2",
          label: "进行中"
        },
        {
          value: "3",
          label: "已结束"
        }
      ],
      status: null,
      time: "",
      value: "",
      value1: "",
      tableData: []
    };
  },
  components: {
    createQRCode
  },
  created() {
    this.queryGoodsArea(1);
  },
  methods: {
    // 查询活动列表
    queryGoodsArea(val) {
      let beginTime = "";
      let endTime = "";
      if (this.time) {
        beginTime = this.time[0].getTime();
        endTime = this.time[1].getTime();
      }
      let parms = {
        pageNumber: val,
        pageSize: 10,
        beginTime: beginTime,
        endTime: endTime,
        status: this.status
      };
      queryGoodsArea({ params: parms }).then(res => {
        if (res.data.messageCode == "MSG_1001") {
          let data = res.data.content;
          this.tableData = data.items;
          this.totalSize = data.totalSize;
          this.currentPage = val;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 跳转到添加活动页面
    // saveType 1-新增 2-修改
    navActives(saveType, id) {
      this.$router.push({
        path: "/addActive_goods",
        query: {
          saveType: saveType,
          id: id
        }
      });
    },
    // 开启/关闭/删除活动
    handleActive(status, id) {
      // status: 2-开启 3-关闭 4-删除
      let tips;
      let tipsContent;
      switch (status) {
        case 2:
          tips = "开启活动";
          tipsContent = "是否开启当前活动？";
          break;
        case 3:
          tips = "关闭活动";
          tipsContent = "是否关闭当前活动？";
          break;
        case 4:
          tips = "删除活动";
          tipsContent = "是否删除当前活动？";
          break;
      }
      this.$confirm(tipsContent, tips, {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          let parms = {
            id: id,
            status: status
          };
          goodsAreaUpdateStatus(this.qs.stringify(parms)).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.queryGoodsArea(1);
              this.$message.success("操作成功");
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 生成二维码
    createQRCode(id) {
      /**
       * type：活动类型 1-新人专区 2-商品专区
       * id:活动id
       */
      this.$refs.createQRCode.open(2, id);
    },
    // 翻页
    pageChange(val) {
      this.currentPage = val;
      this.queryGoodsArea(val);
    }
  }
};
</script>
<style lang="less" scoped>
.newbornZone {
  padding: 20px;
  box-sizing: border-box;
  .topBox {
    display: flex;
    align-items: center;
  }
  .tableBox {
    margin-top: 20px;
  }
  .sizeBox {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>