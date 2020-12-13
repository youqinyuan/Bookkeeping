<template>
  <div class="personalityRule">
    <div class="titleBox">
      <span>人群设定</span>
      <el-button type="primary" @click="navAddPage()">添加新人群</el-button>
    </div>
    <div class="items" v-for="(item, index) in content" :key="index">
      <div class="titleBox">
        <span>{{ item.individualizationConfig.title }}</span>
        <div>
          <el-button
            type="text"
            v-if="item.individualizationConfig.type == '2'"
            @click="seeNumber(item.mobileNumber)"
            >查看手机号</el-button
          >
          <el-button
            type="text"
            @click="navAddPage(item.individualizationConfig.id)"
            >修改人群设定</el-button
          >
          <el-button
            type="text"
            @click="remove(item.individualizationConfig.id)"
            >删除人群设定</el-button
          >
        </div>
      </div>
      <div class="desc">
        价格设定：全场商品价格*{{ item.individualizationConfig.goodsRate }}%
      </div>
      <div class="desc" v-if="item.individualizationConfig.goodsType == '1'">
        商品设定：全部商品可购买
      </div>
      <div class="desc" v-if="item.individualizationConfig.goodsType == '2'">
        商品设定：指定商品可购买
      </div>
    </div>
    <!-- 查看手机号弹窗 -->
    <el-dialog
      title="查看手机号"
      :visible.sync="seeNumberDialog"
      width="700px"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="numberBox">{{ mobileNumber }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="seeNumberDialog = false"
          >关闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { findConfigList, removeConfigIndividualization } from "@/network/api";
export default {
  data() {
    return {
      seeNumberDialog: false,
      content: [],
      mobileNumber: "",
    };
  },
  created() {
    this.findConfigList();
  },
  methods: {
    // 查询
    findConfigList() {
      findConfigList().then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.content = res.data.content;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 添加或者修新人群
    navAddPage(id) {
      if (id) {
        // 修改
        this.$router.push({
          path: "/addPersonalityRule",
          query: {
            id: id,
          },
        });
      } else {
        // 添加
        this.$router.push("/addPersonalityRule");
      }
    },
    // 查看手机号
    seeNumber(mobileNumber) {
      this.mobileNumber = mobileNumber;
      this.seeNumberDialog = true;
    },
    // 删除人群设定
    remove(id) {
      this.$confirm("确认删除人群设定吗?", "提示", {
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
          removeConfigIndividualization(parms).then((res) => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success("删除成功");
              this.findConfigList();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="less" scoped>
.personalityRule {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .titleBox {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .items {
    width: 100%;
    border: 1px solid #666;
    margin-top: 20px;
    padding: 0px 20px;
    padding-bottom: 20px;
    padding-top: 10px;
    box-sizing: border-box;
    .desc {
      color: #909399;
      margin-top: 10px;
      font-size: 15px;
    }
  }
  .numberBox {
    width: 100%;
    max-height: 500px;
    overflow-y: auto;
  }
}
</style>