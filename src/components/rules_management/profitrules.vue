<template>
  <div class="contents">
    <div>
      <span>利润分成名称:</span>
      <el-input style="width:220px" v-model="name" placeholder="请输入名称"></el-input>
      <el-button style="margin:0 20px" type="primary" @click="search">搜 索</el-button>
      <el-button type="success" @click="add">添 加</el-button>
    </div>

    <div>
      <ul>
        <li v-for="(ite,index) in content" :key="index">
          <div class="title">
            <span>{{ite.name}}</span>
            <span style="color: #169BD5;cursor: pointer;" @click="modify(ite)">修改</span>
          </div>
          <div class="set">余额支付占比设置</div>
          <div class="details">
            <div>Plus会员：占利润空间的{{ite.items[0].plusRate}}%</div>
            <div>代理商：占利润空间的{{ite.items[0].agentRate}}%</div>
            <div>平台：占利润空间的{{ite.items[0].platformRate}}%</div>
            <div>Plus会员：占商品付款金额的{{ite.items[0].plusPaymentRate}}%</div>
          </div>
          <div class="mr" v-if="ite.isDefault === 1">默认使用</div>
          <div class="setmr" v-else>
            <el-button type="primary" @click="setDefault(ite)">设为默认</el-button>
          </div>
        </li>
      </ul>
    </div>

    <addDividedIntoPop ref="DividedIntoPop"></addDividedIntoPop>
  </div>
</template>

<script>
import {
  getProfitsDistributions,
  modifyProfitsDistribution
} from "@/network/api";
import addDividedIntoPop from "./common/addDividedIntoPop";
export default {
  props: {},
  data() {
    return {
      name: "",
      content: []
    };
  },
  components: {
    addDividedIntoPop
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getProfitsDistributions();
  },
  methods: {
    getProfitsDistributions() {
      let parms = {
        name: this.name
      };
      getProfitsDistributions({ params: parms }).then(res => {
        if (res.data.content) {
          this.content = res.data.content;
        }
      });
    },
    search() {
      this.getProfitsDistributions();
    },
    // 添加
    add() {
      this.$refs.DividedIntoPop.open("添加利润分成规则");
    },
    // 修改
    modify(ite) {
      this.$refs.DividedIntoPop.open("修改利润分成规则", ite);
    },
    // 设置默认
    setDefault(ite) {
      let parms = JSON.parse(JSON.stringify(ite));
      parms.isDefault = 1;
      this.$confirm("", `确定将，${parms.name}设置为默认使用吗`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          modifyProfitsDistribution(parms).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.getProfitsDistributions();
              this.$message.success(res.data.message);
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped lang="less">
ul {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  li {
    width: 400px;
    border: 1px solid black;
    padding: 15px;
    margin-right: 20px;
    margin-bottom: 20px;
    .title {
      display: flex;
      justify-content: space-between;
    }
    .set {
      margin-top: 15px;
      padding-bottom: 5px;
      border-bottom: 1px solid #cccccc;
    }
    .details {
      div {
        margin: 15px 0;
        &:nth-of-type(3) {
          border-bottom: 1px solid #cccccc;
          padding-bottom: 15px;
        }
      }
    }
    .mr {
      text-align: center;
      font-size: 20px;
      color: #cccccc;
      font-weight: bolder;
    }
    .setmr {
      text-align: center;
    }
  }
}
</style>
