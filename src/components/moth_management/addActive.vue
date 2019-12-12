<template>
  <div class="contents">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      label-position="right"
      size="mini"
    >
      <div class="common">
        <div class="title">活动信息:</div>
        <el-form-item label="活动名称:" prop="name">
          <el-input
            class="inp"
            v-model="ruleForm.name"
            placeholder="20字以内"
            maxlength="20"
            :disabled="type"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动时间:" required>
          <div v-if="ruleForm.activityType == 1">
            <div
              v-for="(item,index) in priceActivityTimeIntervalList"
              :key="index"
              style="margin-top:4px;"
            >
              <el-time-picker
                arrow-control
                v-model="item.startTime"
                placeholder="开始时间"
                :disabled="type"
              ></el-time-picker>
              <el-time-picker
                arrow-control
                v-model="item.endTime"
                placeholder="结束时间"
                :disabled="type"
              ></el-time-picker>
              <i
                class="el-icon-close"
                style="margin-left:10px;font-size:16px;font-weight:bold"
                v-if="index > 0 && !type"
                @click="deleteTime(index)"
              ></i>
              <el-button
                type="primary"
                size="mini"
                v-if="index == 0"
                @click="addTime"
                :disabled="type"
              >添加</el-button>
            </div>
          </div>
          <div v-else>
            <div style="display: inline-block">
              <el-form-item prop="startTime">
                <el-date-picker
                  v-model="ruleForm.startTime"
                  type="datetime"
                  placeholder="开始时间"
                  :disabled="type"
                ></el-date-picker>
              </el-form-item>
            </div>
            <div style="display: inline-block">
              <el-form-item prop="endTime">
                <el-date-picker
                  v-model="ruleForm.endTime"
                  type="datetime"
                  placeholder="结束时间"
                  :disabled="type"
                ></el-date-picker>
              </el-form-item>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="广告值:" prop="advertValue">
          <el-input
            style="width:150px"
            v-model.number="ruleForm.advertValue"
            placeholder
            maxlength="2"
            :disabled="type"
          ></el-input>
        </el-form-item>
      </div>

      <div class="common">
        <div class="title">商品信息:</div>
        <div
          class="goodinfo"
          v-for="(item,goodsIndex) in ruleForm.priceActivityGoodsList"
          :key="goodsIndex"
        >
          <el-form-item
            label="选择商品:"
            :prop="'priceActivityGoodsList.' + goodsIndex + '.goodsName'"
            :rules="{required: true, message: '请选择商品', trigger: 'change' }"
          >
            <el-input
              class="inp"
              @focus="chooseGoodsfocus(goodsIndex)"
              v-model="item.goodsName"
              placeholder
              :disabled="goodsIndex >= length ?false:true"
            ></el-input>
            <i
              class="el-icon-close"
              style="margin-left:10px;font-size:16px;font-weight:bold"
              @click="deletedProduct(goodsIndex)"
            ></i>
          </el-form-item>

          <el-form-item
            label="分享文案:"
            :prop="'priceActivityGoodsList.' + goodsIndex + '.sharedDesc'"
            :rules="{required: true, message: '请输入分享文案', trigger: 'change'}"
          >
            <el-input
              class="inp"
              v-model="item.sharedDesc"
              placeholder="50字符以内"
              maxlength="50"
              :disabled="goodsIndex >= length ?false:true"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="邮费:"
            :prop="'priceActivityGoodsList.' + goodsIndex + '.expressFee'"
            :rules="{required: true, pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/, message: '仅限输入数字，最多为7位数', trigger: 'change'}"
          >
            <el-input
              class="inp"
              v-model="item.expressFee"
              placeholder
              maxlength="7"
              :disabled="goodsIndex >= length ?false:true"
            ></el-input>
          </el-form-item>

          <div class="payset">
            <el-form-item
              label="返"
              :prop="'priceActivityGoodsList.' + goodsIndex + '.cashBack'"
              :rules="{required: true, pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/, message: '仅限输入数字，最多为5位数', trigger: 'change'}"
            >
              <el-input
                style="width:150px"
                v-model="item.cashBack"
                placeholder
                maxlength="5"
                :disabled="goodsIndex >= length ?false:true"
              ></el-input>
              <span>元</span>
            </el-form-item>
            <el-form-item label="分期" label-width="60px">
              <el-select
                v-model="item.period"
                placeholder="请选择"
                :disabled="goodsIndex >= length ?false:true"
              >
                <el-option
                  v-for="ite in options"
                  :key="ite.value"
                  :label="ite.label"
                  :value="ite.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="buyCondition" v-if="ruleForm.activityType == 4">
            <el-form-item label="购买条件：">
              <el-radio
                v-model="item.buyConditions"
                label="1"
                :disabled="goodsIndex >= length ?false:true"
              >
                使用freebuy方式购买一件商品付款价大于
                <el-input
                  v-model="item.checkPrice"
                  style="width:80px;"
                  :disabled="goodsIndex >= length ?false:true"
                ></el-input>元的商品
              </el-radio>
              <div>
                <el-radio
                  v-model="item.buyConditions"
                  label="2"
                  style="margin-top:6px;"
                  :disabled="goodsIndex >= length ?false:true"
                >
                  使用freebuy方式下单次数大于
                  <el-input
                    v-model="item.checkNumber"
                    style="width:80px;"
                    :disabled="goodsIndex >= length ?false:true"
                  ></el-input>次
                </el-radio>
              </div>
            </el-form-item>
          </div>
          <ul>
            <span class="addguige" @click="addGoodsspec(item.goodsId,goodsIndex)">添加规格</span>
            <li v-for="(items,index) in item.priceActivityGoodsStockList" :key="index">
              <div class="spcDesc">
                <span>商品规格：{{items.spcDesc}}</span>
                <span class="caozuo" @click="againAddGoodsspec(item.goodsId,index,goodsIndex)">重新选择</span>
                <span class="caozuo" @click="deletespcDesc(index,goodsIndex)">删除</span>
              </div>

              <!-- <el-form-item label="商品规格:" :prop="'priceActivityGoodsList['+goodsIndex+'].priceActivityGoodsStockList.' + index + '.spcDesc'"
                            :rules="{required: true, message: '请选择商品规格', trigger: 'change'}">
                        <el-input class="inp" @focus="chooseGoodsspec(item.goodsId,index)" v-model="items.spcDesc" placeholder=""></el-input>
              </el-form-item>-->

              <el-form-item
                label="商品库存:"
                :prop="'priceActivityGoodsList['+goodsIndex+'].priceActivityGoodsStockList.' + index + '.stock'"
                :rules="{required: true, pattern: /^([0-9][0-9]*)$/,message: '请输入整数', trigger: 'change'}"
              >
                <el-input
                  class="inp"
                  v-model="items.stock"
                  :disabled="!(stockDisabled1 == index && stockDisabled2 == goodsIndex)"
                ></el-input>
                <el-button
                  type="text"
                  style="margin-left:15px;"
                  @click="stockDisabled1 = index;stockDisabled2 = goodsIndex"
                >修改</el-button>
              </el-form-item>

              <el-form-item
                label="商品原价:"
                :prop="'priceActivityGoodsList['+goodsIndex+'].priceActivityGoodsStockList.' + index + '.orgPrice'"
                :rules="{required: true, pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/, message: '仅限输入数字，最多为7位数', trigger: 'change'}"
              >
                <el-input
                  class="inp"
                  v-model="items.orgPrice"
                  placeholder
                  maxlength="7"
                  :disabled="goodsIndex >= length ?false:true"
                ></el-input>
              </el-form-item>
            </li>
          </ul>
        </div>
        <el-button style="margin:0 auto" type="primary" @click="addAgin">再次添加商品</el-button>
      </div>

      <div>
        <el-button @click="submitForm('ruleForm')" type="primary">确 定</el-button>
        <el-button type="info" @click="back">返 回</el-button>
      </div>
    </el-form>

    <!-- 选择商品弹窗 -->
    <chooseGoodsPop ref="chooseGoods" @getgoods="getgoods(arguments)"></chooseGoodsPop>

    <!-- 选择商品规格 -->
    <chooseSpecPop ref="chooseGoodsSpec" @getgoodsSpec="getgoodsSpec(arguments)"></chooseSpecPop>
  </div>
</template>

<script>
import { addOrUpdatePriceActivity } from "@/network/api";
import chooseGoodsPop from "./common/chooseGoodsPop";
import chooseSpecPop from "./common/chooseSpecPop";

export default {
  props: {},
  data() {
    return {
      again: false, // 是否重新选择商品规格
      count: 0,
      stockDisabled1: -1, //是否禁止库存input编辑
      stockDisabled2: -1, //是否禁止库存input编辑
      ruleForm: {
        id: "",
        name: "", // 活动名称
        startTime: "", // 开始时间
        endTime: "", // 结束时间
        advertValue: 0, // 广告值
        activityType: "0", // 活动类型
        priceActivityGoodsList: [
          {
            goodsId: "",
            goodsName: "",
            expressFee: "",
            sharedDesc: "",
            cashBack: "",
            period: 0,
            buyConditions: "1", // 购买条件
            checkPrice: "", //限制价格
            checkNumber: "", //限制下单次数
            priceActivityGoodsStockList: [
              {
                spcDesc: "", //规格名字
                stock: "", // 规格库存
                stockId: "", // 规格id
                orgPrice: "" // 规格原价
              }
            ] // 商品规格信息
          }
        ], // 商品信息
        priceActivityTimeIntervalList: []
      },
      priceActivityTimeIntervalList: [
        {
          startTime: "",
          endTime: ""
        }
      ],
      options: [
        {
          value: 0,
          label: "立返"
        },
        {
          value: 1,
          label: "一期"
        },
        {
          value: 2,
          label: "二期"
        },
        {
          value: 3,
          label: "三期"
        },
        {
          value: 4,
          label: "四期"
        },
        {
          value: 5,
          label: "五期"
        },
        {
          value: 6,
          label: "六期"
        },
        {
          value: 7,
          label: "七期"
        },
        {
          value: 8,
          label: "八期"
        },
        {
          value: 9,
          label: "九期"
        },
        {
          value: 10,
          label: "十期"
        },
        {
          value: 11,
          label: "十一期"
        },
        {
          value: 12,
          label: "十二期"
        }
      ],
      type: false,
      length: 0,
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "change" },
          { min: 1, max: 20, message: "1-20字以内", trigger: "change" }
        ],
        startTime: [
          { required: true, message: "请选择开始时间", trigger: "change" }
        ],
        endTime: [
          { required: true, message: "请选择结束时间", trigger: "change" }
        ],
        advertValue: [
          {
            required: true,
            pattern: /^(\d(\.\d)?|10)$/,
            message: "只能为数字,最大不可超过10",
            trigger: "change"
          }
        ],
        stock: [{ required: true, message: "请输入库存", trigger: "change" }],
        purchasePrice: [
          {
            required: true,
            pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/,
            message: "仅限输入数字，最多为5位数",
            trigger: "change"
          }
        ],
        cashBack: [
          {
            required: true,
            pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/,
            message: "仅限输入数字，最多为5位数",
            trigger: "change"
          }
        ]
      }
    };
  },
  components: {
    chooseGoodsPop,
    chooseSpecPop
  },
  computed: {},
  watch: {},
  created() {
    // 判断活动类型
    let activityType = this.$route.query.activityType;
    this.ruleForm.activityType = activityType;
    if (activityType == 1) {
      this.ruleForm.name = "新人免费体验";
    } else if (activityType == 2) {
      this.ruleForm.name = "信用卡用户免费领";
    } else if (activityType == 3) {
      this.ruleForm.name = "渠道合作活动(新人免费体验)";
    } else if (activityType == 4) {
      this.ruleForm.name = "FreeBuy购买免费领";
    }
  },
  mounted() {
    let details = this.$store.state.details;
    console.log(details);
    let activityType = this.$route.query.activityType;
    if (activityType == 4) {
      for (let item of details.priceActivityGoodsList) {
        item.buyConditions = item.buyConditions.toString();
      }
    }
    let type = this.$route.query.type;
    // type：1-添加活动，2-修改活动，3-添加商品
    if (type == 2 || type == 3) {
      this.ruleForm.id = details.id;
      this.ruleForm.name = details.name;
      if (activityType == 1) {
        let arr = [];
        details.priceActivityTimeIntervalList.forEach(item => {
          let arr2 = item.startTime.split(":");
          let arr3 = item.endTime.split(":");
          item.startTime = new Date("", "", "", arr2[0], arr2[1], arr2[2]);
          item.endTime = new Date("", "", "", arr3[0], arr3[1], arr3[2]);
          arr.push(item);
        });
        this.priceActivityTimeIntervalList = arr;
      } else {
        this.ruleForm.startTime = new Date(details.startTime);
        this.ruleForm.endTime = new Date(details.endTime);
      }
      this.ruleForm.advertValue = details.advertValue;
      this.ruleForm.priceActivityGoodsList = details.priceActivityGoodsList;
      this.ruleForm.purchasePrice = details.purchasePrice;
      this.ruleForm.cashBack = details.cashBack;
      this.ruleForm.period = details.period;
    }
    if (type == 3) {
      this.type = true;
      this.length = details.priceActivityGoodsList.length;
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$confirm("", "内容未保存，确定返回吗", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      center: true
    })
      .then(() => {
        next();
      })
      .catch(() => {});
  },
  methods: {
    // 添加时间周期
    addTime() {
      console.log(this.priceActivityTimeIntervalList);
      this.priceActivityTimeIntervalList.push({
        startTime: "",
        endTime: ""
      });
    },
    // 删除时间周期
    deleteTime(index) {
      this.priceActivityTimeIntervalList.splice(index, 1);
    },
    chooseGoodsfocus(index) {
      this.$refs.chooseGoods.open(index, this.ruleForm.priceActivityGoodsList);
    },
    // 添加商品规格
    addGoodsspec(goodsId, index) {
      if (goodsId) {
        if (
          this.ruleForm.priceActivityGoodsList[index]
            .priceActivityGoodsStockList[0]
        ) {
          if (
            !this.ruleForm.priceActivityGoodsList[index]
              .priceActivityGoodsStockList[0].stockId
          ) {
            this.ruleForm.priceActivityGoodsList[
              index
            ].priceActivityGoodsStockList.splice(0, 1);
          }
        }
        this.again = false;
        this.count = index;
        let obj = {
          spcDesc: "", //规格名字
          stock: "", // 规格库存
          stockId: "", // 规格id
          orgPrice: "" // 规格原价
        };
        this.ruleForm.priceActivityGoodsList[
          index
        ].priceActivityGoodsStockList.push(obj);
        this.$refs.chooseGoodsSpec.open(goodsId, index);
      } else {
        this.$message.error("请先选择商品");
      }
    },
    // 重新选择
    againAddGoodsspec(goodsId, index, goodsIndex) {
      if (goodsId) {
        this.$refs.chooseGoodsSpec.open(goodsId, index);
        this.again = true;
        this.count = goodsIndex;
      } else {
        this.$message.error("请先选择商品");
      }
    },
    // 删除商品规格
    deletespcDesc(index, goodsIndex) {
      this.ruleForm.priceActivityGoodsList[
        goodsIndex
      ].priceActivityGoodsStockList.splice(index, 1);
    },
    // 返回
    back() {
      this.$router.go(-1); //返回上一页
    },
    // 再次添加
    addAgin() {
      if (this.ruleForm.priceActivityGoodsList.length > 19) {
        this.$message.error("最多添加20个商品");
        return;
      } else {
        this.ruleForm.priceActivityGoodsList.push({
          goodsName: "",
          goodsId: "",
          spcDesc: "",
          stockId: "",
          stock: "",
          orgPrice: "",
          expressFee: "",
          sharedDesc: "",
          period: 0,
          buyConditions: "1", // 购买条件
          checkPrice: "", //限制价格
          checkNumber: "", //限制下单次数
          priceActivityGoodsStockList: [
            {
              spcDesc: "", //规格名字
              stock: "", // 规格库存
              stockId: "", // 规格id
              orgPrice: "" // 规格原价
            }
          ]
        });
      }
    },
    // 删除已选商品
    deletedProduct(index) {
      this.$confirm("确定删除此商品吗?删除后下面规格全部自动删除!", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false,
        closeOnClickModal: false,
        center: true
      })
        .then(() => {
          this.ruleForm.priceActivityGoodsList.splice(index, 1);
        })
        .catch(() => {});
    },
    getgoods(argument) {
      let goodinfo = argument[0];
      let i = argument[1];
      let priceActivityGoodsList = this.ruleForm.priceActivityGoodsList[i];
      priceActivityGoodsList.goodsName = goodinfo.name;
      priceActivityGoodsList.goodsId = goodinfo.id;
      priceActivityGoodsList.spcDesc = "";
      priceActivityGoodsList.stockId = "";
      priceActivityGoodsList.stock = "";
      priceActivityGoodsList.orgPrice = "";
      priceActivityGoodsList.expressFee = "";
    },
    getgoodsSpec(argument) {
      let goodinfo = argument[0];
      if (this.again) {
        var i = argument[1];
        this.again = false;
      } else {
        var i =
          this.ruleForm.priceActivityGoodsList[this.count]
            .priceActivityGoodsStockList.length - 1;
      }
      this.ruleForm.priceActivityGoodsList[
        this.count
      ].priceActivityGoodsStockList[i].spcDesc = goodinfo.sepcName;
      this.ruleForm.priceActivityGoodsList[
        this.count
      ].priceActivityGoodsStockList[i].stockId = goodinfo.specId;
      this.ruleForm.priceActivityGoodsList[
        this.count
      ].priceActivityGoodsStockList[i].stock = goodinfo.stock;
      this.ruleForm.priceActivityGoodsList[
        this.count
      ].priceActivityGoodsStockList[i].orgPrice = goodinfo.orgPrice;
      this.ruleForm.priceActivityGoodsList[
        this.count
      ].priceActivityGoodsStockList[i].expressFee = goodinfo.expressFee;
      console.log(this.ruleForm.priceActivityGoodsList);
    },

    // 格式化时间
    times(s) {
      return s < 10 ? "0" + s : s;
    },

    // 确定
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let activityType = this.$route.query.activityType;
          var s = 1;
          if (activityType != 1) {
            var startTime = this.ruleForm.startTime.getTime();
            var endTime = this.ruleForm.endTime.getTime();
          } else {
            let timeArr = JSON.parse(
              JSON.stringify(this.priceActivityTimeIntervalList)
            );
            let arr = [];
            timeArr.forEach(item => {
              let d = new Date(item.startTime);
              let p = new Date(item.endTime);
              if (!item.startTime || !item.endTime) {
                s = 0;
                return false;
              }
              item.startTime =
                this.times(d.getHours()) +
                ":" +
                this.times(d.getMinutes()) +
                ":" +
                this.times(d.getSeconds());
              item.endTime =
                this.times(p.getHours()) +
                ":" +
                this.times(p.getMinutes()) +
                ":" +
                this.times(p.getSeconds());
              arr.push(item);
            });
            this.ruleForm.priceActivityTimeIntervalList = arr;
          }
          if (s == 0) {
            this.$message.error("活动时间不能为空");
            return;
          }
          console.log("this.ruleForm", this.ruleForm);
          for (let item of this.ruleForm.priceActivityGoodsList) {
            if (item.priceActivityGoodsStockList.length <= 0) {
              this.$message.error("请添加商品规格");
              return false;
            }
            if (item.buyConditions == 1 && activityType == 4) {
              item.checkNumber = "";
              let a = /^([0-9][0-9]*)+(.[0-9]{1,2})?$/;
              if (!a.test(item.checkPrice)) {
                this.$message.error(
                  "购买条件中付款价只能是正整数且最多保留两位小数"
                );
                return false;
              }
            } else if (item.buyConditions == 2 && activityType == 4) {
              item.checkPrice = "";
              let a = /^[1-9]\d*$/;
              if (!a.test(item.checkNumber)) {
                this.$message.error("购买条件中下单次数只能是正整数");
                return false;
              }
            }
          }
          var copyRuleForm = JSON.parse(JSON.stringify(this.ruleForm));
          if (activityType != 1) {
            copyRuleForm.startTime = startTime;
            copyRuleForm.endTime = endTime;
          }
          addOrUpdatePriceActivity(copyRuleForm).then(res => {
            if (res.data.messageCode == "MSG_1001") {
              this.$message.success(res.data.message);
              this.$refs[formName].resetFields();
            } else {
              this.$message.error(res.data.message);
              console.log(this.priceActivityTimeIntervalList);
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.common {
  margin-bottom: 20px;
  .goodinfo {
    border-bottom: 1px solid #cccccc;
    margin-bottom: 15px;
  }
  ul {
    margin-top: 10px;
    .addguige {
      font-size: 14px;
      color: #169bd5;
      cursor: pointer;
    }
    .spcDesc {
      font-size: 14px;
      margin: 5px 0;
      .caozuo {
        margin-left: 15px;
        color: #169bd5;
        cursor: pointer;
      }
    }
  }
}
.inp {
  width: 350px;
}
.title {
  border-bottom: 1px solid #cccccc;
  margin-bottom: 20px;
}
.payset {
  display: flex;
  .back {
    margin: 5px 10px;
  }
  .fenqi {
    margin-left: 15px;
  }
}
.buyCondition {
  border-bottom: 1px dashed #cccccc;
}
</style>
