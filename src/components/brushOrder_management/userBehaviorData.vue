<template>
  <div class="userBehaviorData">
    <div class="searchBox">
      <el-input
        v-model="mobileNumber"
        style="width: 300px; margin-right: 20px"
        placeholder="请输入手机号"
      ></el-input>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button type="success" @click="limit">限制当前查询账户</el-button>
      <el-button type="primary" @click="relieve"
        >解除当前查询账户限制</el-button
      >
      <el-button type="success" @click="exportExcel">查询内容导出</el-button>
    </div>
    <div class="content" style="margin-top: 40px">
      <el-tree :props="props" :load="loadNode" lazy v-if="flag">
        <span slot-scope="{ node }">
          <span
            v-if="node.data.isCurrent == '1'"
            style="color: #67c23a; margin-top: 5px"
            >{{ node.label }}</span
          >
          <span
            v-else-if="node.data.isDealHunter == '1'"
            style="color: #f56c6c; margin-top: 5px"
            >{{ node.label }}</span
          >
          <span v-else style="margin-top: 5px">{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
    <!-- 限制查询当前账户弹窗 -->
    <el-dialog
      title="限制级别"
      :visible.sync="dialogVisible"
      width="300px"
      :close-on-click-modal="false"
      center
      :before-close="closeDialogVisible"
    >
      <div style="display: flex; flex-direction: column">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="2" style="margin-top: 10px"
            >限制本号码</el-checkbox
          >
          <el-checkbox label="3" style="margin-top: 10px"
            >限制本号码上级</el-checkbox
          >
          <el-checkbox label="4" style="margin-top: 10px"
            >限制本号码下级</el-checkbox
          >
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateDealHunter">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  findListUserBehavior,
  findChildrenUserBehavior,
  updateDealHunter,
  exportExcelUserBehavior,
} from "@/network/api";
export default {
  data() {
    return {
      flag: false,
      dialogVisible: false,
      mobileNumber: "", // 查询的号码
      queryMobileNumber: "", // 查询的号码备份 - 查询下级时使用（不使用mobileNumber是避免号码从输入框删除后找不到）
      props: {
        label: "name",
        children: "zones",
        isLeaf: "leaf",
      },
      content: [],
      item: "", // 当前查看的账号
      allItems: [], // 所有展开的数据 - 用于导出
      checkList: [], // 账号限制类型
    };
  },
  methods: {
    // 搜索
    search() {
      if (!this.mobileNumber) {
        this.$message.error("请输入手机号");
        return;
      }
      this.flag = false;
      this.allItems = [];
      this.queryMobileNumber = this.mobileNumber;
      let parms = {
        mobileNumber: this.mobileNumber,
      };
      findListUserBehavior({ params: parms }).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          let content = res.data.content;
          this.content = content;
          // 收集所有展开的数据
          this.allItems.push(content[0]);
          // 如果请求回来的数据是当前查询的数据
          if (content[0].isCurrent == "1") {
            this.item = content[0];
            this.flag = true;
          } else {
            // 如果请求回来的数据是当前查询的数据的上级
            // 利用查询下级接口获取当前查询的数据
            let parms = {
              mobileNumber: content[0].mobileNumber,
              queryMobileNumber: this.queryMobileNumber,
            };
            findChildrenUserBehavior({ params: parms }).then((res) => {
              if (res.data.messageCode == "MSG_1001") {
                let data = res.data.content;
                data.forEach((val) => {
                  if (val.isCurrent == "1") {
                    this.item = val;
                  }
                });
                this.flag = true;
              } else {
                this.$message.error(res.data.message);
              }
            });
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 树形控件加载子树数据
    loadNode(node, resolve) {
      if (node.level === 0) {
        let data = [];
        let content = this.content;
        if (content.length > 0) {
          content.forEach((val, idx) => {
            let obj = {
              id: val.mobileNumber,
              leaf: val.countTeam == 0 ? true : false,
              isCurrent: val.isCurrent,
              isDealHunter: val.isDealHunter,
              label: val.mobileNumber,
              name: `${val.mobileNumber}${
                val.isCurrent == "1" ? "（当前查看账号）" : ""
              }（邀请总人数：${val.countTeam}人，总计发卖贴：${
                val.countSale
              }个（已卖出${val.countSaleSaleOut}个），总计发预售贴：${
                val.countAdvanceOrder
              }个（已卖出${val.countAdvanceOrderSaleOut}个），累计提现：${
                val.withdrawAmount
              }元，累计下单金额：${val.tradeAmount}元）（支付宝关联账号数量：${
                val.countAlipayAccountUser
              }个）`,
            };
            data.push(obj);
          });
          return resolve(data);
        }
      }
      if (node.level > 0) {
        let parms = {
          mobileNumber: node.data.id,
          queryMobileNumber: this.queryMobileNumber,
        };
        // 查询下级
        findChildrenUserBehavior({ params: parms }).then((res) => {
          if (res.data.messageCode == "MSG_1001") {
            let content = res.data.content;
            let data = [];
            if (content.length > 0) {
              content.forEach((val, idx) => {
                let obj = {
                  id: val.mobileNumber,
                  leaf: val.countTeam == 0 ? true : false,
                  isCurrent: val.isCurrent,
                  isDealHunter: val.isDealHunter,
                  name: `${val.mobileNumber}${
                    val.isCurrent == "1" ? "（当前查看账号）" : ""
                  }（邀请总人数：${val.countTeam}人，总计发卖贴：${
                    val.countSale
                  }个（已卖出${val.countSaleSaleOut}个），总计发预售贴：${
                    val.countAdvanceOrder
                  }个（已卖出${val.countAdvanceOrderSaleOut}个），累计提现：${
                    val.withdrawAmount
                  }元，累计下单金额：${
                    val.tradeAmount
                  }元）（支付宝关联账号数量：${val.countAlipayAccountUser}个）`,
                };
                data.push(obj);
                // 收集所有展开的数据
                this.allItems.push(val);
              });
              return resolve(data);
            } else {
              return resolve([]);
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
    },
    // 打开限制弹窗
    limit() {
      let item = this.item;
      if (!item) {
        this.$message.error("请先搜索要查询的数据");
        return;
      }
      if (item.dealHunterLimitType != "1") {
        this.checkList = item.dealHunterLimitType.split(",");
      }
      this.dialogVisible = true;
    },
    // 关闭限制弹窗
    closeDialogVisible() {
      this.dialogVisible = false;
      this.checkList = [];
    },
    // 限制
    updateDealHunter() {
      if (this.checkList.length == 0) {
        this.$message.error("请选择限制类型");
        return;
      }
      let parms = {
        userId: this.item.userId,
        isDealHunter: 1,
        dealHunterLimitType: this.checkList.join(","),
      };
      updateDealHunter(parms).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("限制成功");
          this.dialogVisible = false;
          this.search();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 解除限制
    relieve() {
      let item = this.item;
      if (!item) {
        this.$message.error("请先搜索要查询的数据");
        return;
      }
      this.$confirm("确定解除限制吗？", "提示", {
        confirmButtonText: "确定",
        center: true,
        showCancelButton: false,
        closeOnClickModal: false,
      })
        .then(({ value }) => {
          let parms = {
            userId: item.userId,
            isDealHunter: 2,
          };
          updateDealHunter(parms).then((res) => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("取消限制成功");
              this.search();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 导出
    exportExcel() {
      let item = this.item;
      if (!item) {
        this.$message.error("请先搜索要查询的数据");
        return;
      }
      let userId = [];
      this.allItems.forEach((val) => {
        userId.push(val.userId);
      });
      userId = userId.join(",");
      let parms = {
        userId: userId,
      };
      exportExcelUserBehavior(parms).then((res) => {
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
      a.setAttribute("download", "关联用户行为数据.xls");
      document.body.appendChild(a);
      a.click();
    },
  },
};
</script>
<style lang="less" scoped>
.userBehaviorData {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
</style>