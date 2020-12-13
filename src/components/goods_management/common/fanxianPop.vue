<template>
  <div>
    <el-dialog
      width="40%"
      title="批量返现设置"
      v-if="dialogTableVisible"
      :close-on-click-modal="false"
      :visible.sync="dialogTableVisible"
    >
      <el-form label-width="110px">
        <el-form-item label="选择返现分期:">
          <el-select v-model="optionVal">
            <el-option
              :key="item.txt"
              :label="item.txt"
              :value="item.txt"
              v-for="item in optArr"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
          <el-button type="primary" @click="addCashback()">添加</el-button>
        </el-form-item>
        <el-form-item
          :label="item.tle + ':'"
          v-for="(item, index) in cashbackDetail.cashbackList"
          :key="index"
        >
          <span>付</span>
          <el-input style="width: 80px;" :disabled="true" :value="payMoney"></el-input>
          <span>返</span>
          <el-input style="width: 80px;" v-model="item.cashbackMoney"></el-input>
          <i class="el-icon-close" @click="cashbackDelBtn(index)"></i>
        </el-form-item>
        <div
          style="font-size:16px;color:#303133;border-bottom:1px solid #eee;padding-bottom:10px;margin-bottom:20px;margin-top:60px"
        >快速0元购设置:</div>
        <el-form-item label="0元购分期期数:" label-width="130">
          <el-input
            style="width: 65px;"
            v-model="cashbackDetail.periodScope.minPeriod"
            @change="setMinPeriod"
          ></el-input>
          <span>至</span>
          <el-input
            style="width: 65px;"
            v-model="cashbackDetail.periodScope.maxPeriod"
            @change="setMaxPeriod"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户选择分期数:" label-width="130">
          <div
            style="position:relative;display:inline"
            v-for="(item,index) in cashbackDetail.periodScope.periodItems"
            :key="index"
          >
            <i
              class="el-icon-close"
              style="position:absolute;top:-16px;right:-2px;z-index:99999"
              v-show="index!=0 && index!=1"
              @click="deletedZeroUserNum(index)"
            ></i>
            <el-input
              style="width: 65px;margin-right:4px;"
              v-model="item.periods"
              :disabled="index == 0 || index == 1?true:false"
            ></el-input>
          </div>
          <el-button type="text" @click="addUserNum">添加</el-button>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button type="primary" @click="confirmCashback()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      dialogTableVisible: false,
      optionVal: "",
      optArr: [
        {
          txt: "立返",
          disabled: false
        },
        {
          txt: "一期",
          disabled: false
        },
        {
          txt: "二期",
          disabled: false
        },
        {
          txt: "三期",
          disabled: false
        },
        {
          txt: "四期",
          disabled: false
        },
        {
          txt: "五期",
          disabled: false
        },
        {
          txt: "六期",
          disabled: false
        },
        {
          txt: "七期",
          disabled: false
        },
        {
          txt: "八期",
          disabled: false
        },
        {
          txt: "九期",
          disabled: false
        },
        {
          txt: "十期",
          disabled: false
        },
        {
          txt: "十一期",
          disabled: false
        },
        {
          txt: "十二期",
          disabled: false
        }
      ],
      payMoney: "", // 取出父组件传过来的最小值
      cashbackArr: [], // 父组件传过来的值
      cashbackDetail: { cashbackList: [], specCashBacks: [], periodScope: {} }
    };
  },
  components: {},
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    open(cashback) {
      this.cashbackArr = cashback;
      this.dialogTableVisible = true;
      this.cashbackDetail.cashbackList = [];
      this.cashbackDetail.specCashBacks = [];
      this.cashbackDetail.periodScope = {
        minPeriod: "",
        maxPeriod: "",
        periodItems: [{ periods: "" }]
      };
      let moneyArr = [];
      cashback.forEach(item => {
        if (item.checkset == true) {
          moneyArr.push(item.money);
        }
      });
      this.payMoney = Math.min.apply(null, moneyArr);
      this.optArr.forEach(item => {
        item.disabled = false;
      });
    },

    // 检查金额格式
    checkNum(num) {
      if (/^([1-9]\d{0,7}|0)(\.\d{1,2})?$/.test(num)) {
        return true;
      } else {
        return false;
      }
    },

    // 弹层提示
    alertTips(msg) {
      this.$alert(msg, "错误", {
        confirmButtonText: "确定",
        callback: action => {}
      });
    },

    //添加
    addCashback() {
      let options = this.optArr;
      let value = this.optionVal;
      let obj = {
        tle: value,
        cashbackMoney: ""
      };
      if (value === "" || this.cashbackDetail.cashbackList.length > 3)
        return false;

      for (let i = 0; i < options.length; i++) {
        if (options[i].txt === value) {
          this.optArr[i].disabled = true;
          this.cashbackDetail.specCashBacks.push({
            month: i,
            amount: null
          });
        }
      }
      this.optionVal = "";
      this.cashbackDetail.cashbackList.push(obj);
    },

    //删除
    cashbackDelBtn(index) {
      let options = this.optArr;
      let value = this.cashbackDetail.cashbackList[index].tle;
      for (let i = 0; i < options.length; i++) {
        if (options[i].txt === value) {
          this.optArr[i].disabled = false;
        }
      }
      this.cashbackDetail.cashbackList.splice(index, 1);
      this.cashbackDetail.specCashBacks.splice(index, 1);
    },

    // 0元购设置 - 设置最小分期期数
    setMinPeriod() {
      this.cashbackDetail.periodScope.periodItems.splice(0, 1);
      this.cashbackDetail.periodScope.periodItems.splice(0, 0, {
        periods: this.cashbackDetail.periodScope.minPeriod
      });
    },

    // 0元购设置 - 设置最大分期期数
    setMaxPeriod() {
      this.cashbackDetail.periodScope.periodItems.splice(1, 1);
      this.cashbackDetail.periodScope.periodItems.splice(1, 0, {
        periods: this.cashbackDetail.periodScope.maxPeriod
      });
    },

    // 0元购设置 - 添加用户选择分期数
    addUserNum() {
      if (!this.cashbackDetail.periodScope.periodItems) {
        this.cashbackDetail.periodScope.periodItems = [{ periods: "" }];
        return;
      }
      this.cashbackDetail.periodScope.periodItems.push({ periods: "" });
    },

    // 0元购设置 - 删除用户选择分期数
    deletedZeroUserNum(index) {
      this.cashbackDetail.periodScope.periodItems.splice(index, 1);
    },

    // 确定
    confirmCashback() {
      let list = this.cashbackDetail.cashbackList;
      let periodItems = this.cashbackDetail.periodScope.periodItems;
      let minPeriod = this.cashbackDetail.periodScope.minPeriod;
      let maxPeriod = this.cashbackDetail.periodScope.maxPeriod;
      if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          let item = list[i];

          if (item.cashbackMoney === "") {
            this.alertTips("返现数值不能为空");
            return false;
          } else if (this.checkNum(item.cashbackMoney) !== true) {
            this.alertTips("返现数值只能数字");
            return false;
          } else if (
            item.cashbackMoney < 1 ||
            item.cashbackMoney > this.payMoney
          ) {
            this.alertTips('"返" 输入数字不可大于付的金额，不可小于1');
            return false;
          }
        }
      }
      if (!maxPeriod) {
        this.$message.error("请输入最大分期期数");
        return;
      } else if (!minPeriod) {
        this.$message.error("请输入最小分期期数");
        return;
      }
      for (let item of periodItems) {
        if (!item.periods) {
          this.$message.error("用户选择分期数不能为空");
          return;
        }
        if (Number(item.periods) < Number(minPeriod)) {
          this.$message.error("用户选择分期数不能小于最小0元购分期数");
          return;
        }
        if (Number(item.periods) > Number(maxPeriod)) {
          this.$message.error("用户选择分期数不能大于最大0元购分期数");
          return;
        }
      }
      this.cashbackDetail.specCashBacks.forEach((item, index) => {
        this.cashbackDetail.specCashBacks[
          index
        ].amount = this.cashbackDetail.cashbackList[index].cashbackMoney;
      });
      for (var i = 0, len = this.cashbackArr.length; i < len; i++) {
        if (this.cashbackArr[i].checkset == true) {
          this.cashbackArr[i].cashbackList = this.cashbackDetail.cashbackList;
          this.cashbackArr[i].specCashBacks = this.cashbackDetail.specCashBacks;
          this.cashbackArr[i].options = this.optArr;
          this.cashbackArr[i].periodScope = this.cashbackDetail.periodScope;
        }
      }
      console.log(this.cashbackArr);
      // return;
      this.dialogTableVisible = false;
    }
  }
};
</script>

<style scoped lang="less">
</style>
