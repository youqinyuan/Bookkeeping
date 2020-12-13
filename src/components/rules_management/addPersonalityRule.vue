<template>
  <div class="addPersonalityRule">
    <div class="item">
      <span>人群名称：</span>
      <el-input
        v-model="form.individualizationConfig.title"
        style="width: 480px"
        :maxlength="30"
      ></el-input>
    </div>
    <div class="item">
      <span>定义条件：</span>
      <el-radio-group v-model="form.individualizationConfig.type">
        <el-radio-button :label="1">下单</el-radio-button>
        <el-radio-button :label="2">手机号</el-radio-button>
      </el-radio-group>
      <div class="subItem" v-if="form.individualizationConfig.type == 1">
        <span>下单次数：</span>
        <el-radio-group v-model="form.individualizationConfig.freNumberType">
          <el-radio-button :label="1">大于</el-radio-button>
          <el-radio-button :label="2">小于</el-radio-button>
        </el-radio-group>
        <el-input
          v-model="form.individualizationConfig.freNumber"
          style="width: 110px"
        ></el-input>
        <span>次</span>
      </div>
      <div class="subItem" v-if="form.individualizationConfig.type == 1">
        <span>下单金额：</span>
        <el-radio-group v-model="form.individualizationConfig.freAmountType">
          <el-radio-button :label="1">大于</el-radio-button>
          <el-radio-button :label="2">小于</el-radio-button>
        </el-radio-group>
        <el-input
          v-model="form.individualizationConfig.freAmount"
          style="width: 110px"
        ></el-input>
        <span>元</span>
      </div>
      <div class="subItem" v-if="form.individualizationConfig.type == 2">
        <el-input
          type="textarea"
          :rows="6"
          placeholder="输入手机号，用逗号隔开即可"
          v-model="form.mobileNumber"
          style="width: 800px"
        >
        </el-input>
      </div>
    </div>
    <div class="item">
      <span>价格设定：全场商品价格*</span>
      <el-input
        v-model="form.individualizationConfig.goodsRate"
        style="width: 120px"
      ></el-input>
      <span>%</span>
    </div>
    <div class="item">
      <span>商品设定：</span>
      <el-radio v-model="form.individualizationConfig.goodsType" :label="1"
        >全部商品</el-radio
      >
      <el-radio v-model="form.individualizationConfig.goodsType" :label="2"
        >指定商品</el-radio
      >
      <div class="subItem" v-if="form.individualizationConfig.goodsType == 2">
        <el-input
          type="textarea"
          :rows="6"
          placeholder="输入商品id，用逗号隔开即可"
          v-model="form.goodIds"
          style="width: 800px"
        >
        </el-input>
      </div>
    </div>
    <div class="item">
      <el-button type="success" @click="back">返回上一页</el-button>
      <el-button type="primary" @click="submitForm">保存</el-button>
    </div>
  </div>
</template>
<script>
import {
  addOrUpdateTopicIndividualization,
  findConfigIndividualization,
} from "@/network/api";
export default {
  data() {
    return {
      form: {
        individualizationConfig: {
          freNumber: "",
          title: "",
          type: 1,
          freNumberType: 1,
          freAmountType: 1,
          freAmount: "",
          goodsRate: "",
          goodsType: 1,
        },
        mobileNumber: "",
        goodIds: "",
      },
    };
  },
  created() {
    let id = this.$route.query.id;
    if (id) {
      this.findConfigIndividualization(id);
    }
  },
  methods: {
    // 查询
    findConfigIndividualization(id) {
      let parms = {
        id: id,
      };
      findConfigIndividualization({ params: parms }).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.form = res.data.content;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 保存
    submitForm() {
      let form = JSON.parse(JSON.stringify(this.form));
      let a = /^[0-9]\d*$/;
      let b = /^\d+(.\d{1,2})?$/;
      if (!form.individualizationConfig.title) {
        this.$message.error("请输入人群名称");
        return;
      }
      let type = form.individualizationConfig.type;
      if (type == "1") {
        // 验证下单次数
        let freNumber = form.individualizationConfig.freNumber;
        if (freNumber != "0" && !freNumber) {
          this.$message.error("下单次数不能为空");
          return;
        }
        if (freNumber < 0) {
          this.$message.error("下单次数不能小于0");
          return;
        }
        if (freNumber > 10000) {
          this.$message.error("下单次数不能大于10000");
          return;
        }
        if (!a.test(freNumber)) {
          this.$message.error("下单次数只能为整数");
          return;
        }
        // 验证下单金额
        let freAmount = form.individualizationConfig.freAmount;
        if (!freAmount) {
          this.$message.error("下单金额不能为空");
          return;
        }
        if (freAmount < 0) {
          this.$message.error("下单金额不能小于0");
          return;
        }
        if (freAmount > 100000000) {
          this.$message.error("下单金额不能大于100000000");
          return;
        }
        if (!b.test(freAmount)) {
          this.$message.error("下单金额最多保留两位小数");
          return;
        }
        form.mobileNumber = "";
      } else {
        // 验证手机号
        if (!form.mobileNumber) {
          this.$message.error("手机号不能为空");
          return;
        }
        if (form.mobileNumber.indexOf("，") != -1) {
          this.$message.error("多个手机号之间请使用英文逗号隔开");
          return;
        }
        form.individualizationConfig.freNumber = "";
        form.individualizationConfig.freAmount = "";
      }
      // 验证商品价格
      let goodsRate = form.individualizationConfig.goodsRate;
      if (!goodsRate) {
        this.$message.error("商品价格不能为空");
        return;
      }
      if (goodsRate < 0) {
        this.$message.error("商品价格不能小于0");
        return;
      }
      if (goodsRate > 10000) {
        this.$message.error("商品价格不能大于10000");
        return;
      }
      if (!b.test(goodsRate)) {
        this.$message.error("商品价格最多保留两位小数");
        return;
      }
      // 验证商品id
      if (form.individualizationConfig.goodsType == "2") {
        if (!form.goodIds) {
          this.$message.error("商品id不能为空");
          return;
        }
        if (form.goodIds.indexOf("，") != -1) {
          this.$message.error("多个商品id之间请使用英文逗号隔开");
          return;
        }
      } else {
        form.goodIds = "";
      }
      addOrUpdateTopicIndividualization(form).then((res) => {
        if (res.data.messageCode == "MSG_1001") {
          this.$message.success("操作成功");
          this.$router.go("-1");
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 返回上一页
    back() {
      this.$router.go("-1");
    },
  },
};
</script>
<style lang="less" scoped>
.addPersonalityRule {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .item {
    margin-top: 40px;
    .subItem {
      margin-left: 84px;
      margin-top: 15px;
    }
  }
}
</style>