<template>
  <div class="petalMall">
    <div class="searchBox">
      <span>商品编号：</span>
      <el-input
        v-model="goodsId"
        :maxlength="20"
        style="width: 200px; margin-right: 20px"
      ></el-input>
      <el-button type="primary" @click="search(1)">搜索</el-button>
      <el-button type="primary" @click="addGoodsDialog = true"
        >新增商品</el-button
      >
      <el-button type="primary" @click="exportExcel">导出兑换记录</el-button>
    </div>
    <div class="tableBox">
      <!-- 商品列表 -->
      <div class="tableItems">
        <div class="tables">
          <el-table :data="tableDataGoods" border style="width: 100%">
            <el-table-column
              prop="goodsId"
              label="商品编号"
              align="center"
              width="80px"
            >
            </el-table-column>
            <el-table-column prop="name" label="商品名称" align="center">
            </el-table-column>
            <el-table-column
              prop="changeAmount"
              label="被兑换次数"
              align="center"
              width="100px"
            ></el-table-column>
            <el-table-column
              prop="serialNumber"
              label="序号"
              align="center"
              width="70px"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="changeNumber(scope.row.id)">{{
                  scope.row.serialNumber
                }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="" label="操作" align="center" width="80px">
              <template slot-scope="scope">
                <el-button type="text" @click="del(scope.row.id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="totalSizeBox">
          <span>总计：{{ totalSizeGoods }}条</span>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalSizeGoods"
            :page-size="15"
            :current-page="currentPageGoods"
            @current-change="pageChangeGoods($event)"
          >
          </el-pagination>
        </div>
      </div>
      <!-- 兑换记录列表 -->
      <div class="tableItems" style="margin-left: 60px">
        <div class="tables">
          <el-table :data="tableDataChange" border style="width: 100%">
            <el-table-column prop="" label="用户" align="center" width="120px">
              <template slot-scope="scope">
                <div>{{ scope.row.nickname }}</div>
                <div>{{ scope.row.mobileNumber }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="兑换商品" align="center">
            </el-table-column>
            <el-table-column
              prop="changeTime"
              label="兑换时间"
              align="center"
              width="160px"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.changeTime | dateFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="" label="操作" align="center" width="80px">
              <template slot-scope="scope">
                <span v-if="scope.row.isDeliver == '1'" style="color: #ccc"
                  >已发货</span
                >
                <el-button
                  v-else
                  type="text"
                  @click="openDeliverGoods(scope.row.id)"
                  >发货</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="totalSizeBox">
          <span>总计：{{ totalSizeChange }}条</span>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalSizeChange"
            :page-size="15"
            :current-page="currentPageChange"
            @current-change="pageChangeChange($event)"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 新增商品弹窗 -->
    <el-dialog
      title="请输入商品编号"
      :visible.sync="addGoodsDialog"
      width="500px"
      center
      :show-close="false"
      :close-on-click-modal="false"
      @close="closeAddGoodsDialog"
    >
      <div>
        <el-input
          v-model="addGoodsForm.goodsId"
          placeholder="请输入商品编号"
          style="width: 200px; margin-right: 10px"
        ></el-input>
        <el-button type="primary" @click="searchGoods">搜索</el-button>
      </div>
      <div style="margin-top: 20px">
        <span>已选：</span>
        <div
          v-if="goodsName"
          style="
            display: inline-block;
            padding: 10px;
            box-sizing: border-box;
            background-color: #ccc;
            border-radius: 8px;
            position: relative;
          "
        >
          <span
            style="
              display: inline-block;
              max-width: 380px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            "
            >{{ goodsName }}</span
          >
          <div
            style="
              width: 20px;
              height: 20px;
              text-align: center;
              line-height: 20px;
              border-radius: 50%;
              background-color: #fff;
              border: 1px solid #666;
              color: red;
              position: absolute;
              right: -10px;
              top: -10px;
              cursor: pointer;
            "
            @click="delSelectGoods"
          >
            X
          </div>
        </div>
        <div>
          <el-input
            v-model="addGoodsForm.flowerAmount"
            placeholder="请输入兑换花瓣数量"
            style="margin-top: 20px; width: 300px"
            :maxlength="7"
          ></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGoodsDialog = false">取 消</el-button>
        <el-button type="primary" @click="addGoods">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 发货弹窗 -->
    <el-dialog
      title="发货"
      :visible.sync="deliverGoodsDialog"
      width="500px"
      :close-on-click-modal="false"
      :show-close="false"
      @close="closeDeliverGoodsDialog"
    >
      <div>
        <span>选择物流：</span>
        <el-select v-model="deliverGoodsForm.logisticsId" style="width: 370px">
          <el-option
            v-for="(item, index) in logisticsListArr"
            :key="index"
            :label="item.companyName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div style="margin-top: 20px">
        <span>物流单号：</span>
        <el-input
          v-model="deliverGoodsForm.trackingNumber"
          style="width: 370px"
        ></el-input>
      </div>
      <div style="margin-top: 20px; display: flex">
        <div style="width: 80px; flex-shrink: 0">收货信息：</div>
        <div>
          <div>收货人：{{ takeGoodsInfo.receiverName }}</div>
          <div style="margin-top: 10px">
            手机号码：{{ takeGoodsInfo.mobileNumber }}
          </div>
          <div style="margin-top: 10px">
            收货地址：{{ takeGoodsInfo.detailedAddress }}
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deliverGoodsDialog = false">取 消</el-button>
        <el-button type="primary" @click="deliverFlowerGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getGoodsFlowerList,
  updateSerialNumber,
  getChangeRecordList,
  exportChangeRecordExcel,
  getFlowerGoodsById,
  addGoodsFlower,
  deleteGoodsFlower,
  getLogisticsCompanyList,
  getTakeGoodsInfo,
  deliverFlowerGoods,
} from "@/network/api";
export default {
  data() {
    return {
      goodsId: "",
      totalSizeGoods: 0,
      currentPageGoods: 1,
      tableDataGoods: [],
      totalSizeChange: 0,
      currentPageChange: 1,
      tableDataChange: [],
      addGoodsDialog: false,
      goodsName: "",
      addGoodsForm: {
        goodsId: "",
        flowerAmount: "",
      },
      deliverGoodsDialog: false,
      deliverGoodsForm: {
        id: "",
        logisticsId: "",
        trackingNumber: "",
      },
      logisticsListArr: [],
      takeGoodsInfo: "",
    };
  },
  created() {
    this.search(1);
    this.getChangeRecordList(1);
    this.getLogisticsList();
  },
  methods: {
    // 搜索
    search(val) {
      let parms = {
        pageNumber: val ? val : this.currentPageGoods,
        pageSize: 15,
        goodsId: this.goodsId,
      };
      getGoodsFlowerList({ params: parms }).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.tableDataGoods = content.items;
          this.totalSizeGoods = content.totalSize;
          this.currentPageGoods = val ? val : this.currentPageGoods;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取兑换列表
    getChangeRecordList(val) {
      let parms = {
        pageNumber: val ? val : this.currentPageChange,
        pageSize: 15,
      };
      getChangeRecordList({ params: parms }).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.tableDataChange = content.items;
          this.totalSizeChange = content.totalSize;
          this.currentPageChange = val ? val : this.currentPageChange;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取物流公司列表
    getLogisticsList() {
      getLogisticsCompanyList().then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.logisticsListArr = res.data.content;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 关闭新增商品弹窗
    closeAddGoodsDialog() {
      this.goodsName = "";
      this.addGoodsForm.goodsId = "";
      this.addGoodsForm.flowerAmount = "";
    },
    // 根据商品编号查询商品
    searchGoods() {
      let goodsId = this.addGoodsForm.goodsId;
      if (!goodsId) {
        this.$message.error("请输入商品编号");
        return;
      }
      let a = /^[0-9]\d*$/;
      if (!a.test(goodsId)) {
        this.$message.error("商品编号格式不正确");
        return;
      }
      let parms = {
        goodsId: goodsId,
      };
      getFlowerGoodsById({ params: parms }).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.goodsName = content.name;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 删除已选商品
    delSelectGoods() {
      this.addGoodsForm.goodsId = "";
      this.goodsName = "";
    },
    // 新增商品
    addGoods() {
      let form = this.addGoodsForm;
      let a = /^[0-9]\d*$/;
      if (!form.goodsId) {
        this.$message.error("请输入商品编号");
        return;
      }
      if (!a.test(form.goodsId)) {
        this.$message.error("商品编号格式不正确");
        return;
      }
      if (!form.flowerAmount) {
        this.$message.error("请输入兑换花瓣数量");
        return;
      }
      if (form.flowerAmount < 1) {
        this.$message.error("最小兑换花瓣为1");
        return;
      }
      if (!a.test(form.flowerAmount)) {
        this.$message.error("兑换花瓣数量格式不正确");
        return;
      }
      addGoodsFlower(this.qs.stringify(form)).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.addGoodsDialog = false;
          this.$message.success("操作成功");
          this.search(1);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 修改排序号
    changeNumber(id) {
      this.$prompt("展示序列", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        center: true,
        inputPattern: /^[1-9]\d*$/,
        inputErrorMessage: "仅支持正整数",
      })
        .then(({ value }) => {
          let parms = {
            id: id,
            serialNumber: value,
          };
          updateSerialNumber(this.qs.stringify(parms)).then((res) => {
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
      this.$confirm("确认从专区中移除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        showClose: false,
        closeOnClickModal: false,
      })
        .then(() => {
          let parms = {
            id: id,
          };
          deleteGoodsFlower(this.qs.stringify(parms)).then((res) => {
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
    // 导出兑换记录
    exportExcel() {
      exportChangeRecordExcel().then((res) => {
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
      a.setAttribute("download", "兑换记录.xls");
      document.body.appendChild(a);
      a.click();
    },
    // 打开发货弹窗
    openDeliverGoods(id) {
      this.deliverGoodsForm.id = id;
      let parms = {
        id: id,
      };
      getTakeGoodsInfo({ params: parms }).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.takeGoodsInfo = res.data.content;
          this.deliverGoodsDialog = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 关闭发货弹窗
    closeDeliverGoodsDialog() {
      this.deliverGoodsForm.id = "";
      this.deliverGoodsForm.logisticsId = "";
      this.deliverGoodsForm.trackingNumber = "";
    },
    // 确认发货
    deliverFlowerGoods() {
      let form = this.deliverGoodsForm;
      if (!form.logisticsId) {
        this.$message.error("请选择物流");
        return;
      }
      if (!form.trackingNumber) {
        this.$message.error("请填写物流单号");
        return;
      }
      deliverFlowerGoods(this.qs.stringify(form)).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.deliverGoodsDialog = false;
          this.$message.success("发货成功");
          this.getChangeRecordList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 商品列表翻页
    pageChangeGoods(val) {
      this.currentPageGoods = val;
      this.search(val);
    },
    // 兑换记录翻页
    pageChangeChange(val) {
      this.currentPageChange = val;
      this.getChangeRecordList(val);
    },
  },
};
</script>
<style lang="less" scoped>
.petalMall {
  padding: 20px;
  box-sizing: border-box;
  .tableBox {
    width: 100%;
    display: flex;
    margin-top: 40px;
    .tableItems {
      width: 750px;
      flex-shrink: 0;
      .totalSizeBox {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 20px;
      }
    }
  }
}
</style>